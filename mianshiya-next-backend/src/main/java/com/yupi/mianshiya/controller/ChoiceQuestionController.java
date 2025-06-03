package com.yupi.mianshiya.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.mianshiya.common.BaseResponse;
import com.yupi.mianshiya.common.ErrorCode;
import com.yupi.mianshiya.common.ResultUtils;
import com.yupi.mianshiya.exception.BusinessException;
import com.yupi.mianshiya.mapper.ChoiceQuestionMapper;
import com.yupi.mianshiya.mapper.ChoiceQuestionLogMapper;
import com.yupi.mianshiya.model.entity.ChoiceQuestion;
import com.yupi.mianshiya.model.entity.ChoiceQuestionLog;
import com.yupi.mianshiya.model.entity.User;
import com.yupi.mianshiya.model.dto.choice.ChoiceQuestionAddRequest;
import com.yupi.mianshiya.model.dto.choice.ChoiceQuestionUpdateRequest;
import com.yupi.mianshiya.model.dto.choice.ChoiceQuestionLogAddRequest;
import com.yupi.mianshiya.model.vo.ChoiceQuestionVO;
import com.yupi.mianshiya.service.ChoiceQuestionService;
import com.yupi.mianshiya.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.extern.slf4j.Slf4j;
import java.util.Date;

@RestController
@RequestMapping("/choiceQuestion")
@Slf4j
public class ChoiceQuestionController {

    @Resource
    private ChoiceQuestionMapper choiceQuestionMapper;
    
    @Resource
    private ChoiceQuestionLogMapper choiceQuestionLogMapper;
    
    @Resource
    private UserService userService;

    /**
     * 分页查询题目列表
     */
    @GetMapping("/list/page")
    public BaseResponse<Page<ChoiceQuestionVO>> listChoiceQuestions(
            @RequestParam int pageNum, 
            @RequestParam int pageSize,
            @RequestParam(required = false) Long questionBankId) {
        if (pageNum <= 0 || pageSize <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Page<ChoiceQuestion> page = new Page<>(pageNum, pageSize);
        
        // 构建查询条件
        QueryWrapper<ChoiceQuestion> queryWrapper = new QueryWrapper<>();
        if (questionBankId != null) {
            queryWrapper.eq("questionBankId", questionBankId);
        }
        
        Page<ChoiceQuestion> choiceQuestionPage = choiceQuestionMapper.selectPage(page, queryWrapper);
        
        // 转换为VO对象
        Page<ChoiceQuestionVO> choiceQuestionVOPage = new Page<>(choiceQuestionPage.getCurrent(), choiceQuestionPage.getSize(), choiceQuestionPage.getTotal());
        List<ChoiceQuestionVO> choiceQuestionVOList = choiceQuestionPage.getRecords().stream().map(choiceQuestion -> {
            ChoiceQuestionVO choiceQuestionVO = ChoiceQuestionVO.objToVo(choiceQuestion);
            
            // 处理 choiceOption 字段，将JSON字符串转换为Map
            if (choiceQuestion.getChoiceOption() != null && !choiceQuestion.getChoiceOption().isEmpty()) {
                try {
                    ObjectMapper objectMapper = new ObjectMapper();
                    Map<String, String> optionsMap = objectMapper.readValue(
                        choiceQuestion.getChoiceOption(), 
                        new TypeReference<Map<String, String>>() {}
                    );
                    choiceQuestionVO.setChoiceOption(optionsMap);
                } catch (Exception e) {
                    log.error("Error parsing choiceOption JSON string to Map for id: {}", choiceQuestion.getId(), e);
                    // 如果解析失败，设置为null或空Map
                    choiceQuestionVO.setChoiceOption(null);
                }
            }
            
            return choiceQuestionVO;
        }).collect(Collectors.toList());
        
        choiceQuestionVOPage.setRecords(choiceQuestionVOList);
        return ResultUtils.success(choiceQuestionVOPage);
    }

    /**
     * 创建题目
     */
    @PostMapping("/add")
    public BaseResponse<Long> addChoiceQuestion(@RequestBody ChoiceQuestionAddRequest addRequest) {
        if (addRequest == null || addRequest.getAnswer() == null || addRequest.getAnswerOption() == null || addRequest.getChoiceOption() == null || addRequest.getQuestionTitle() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        ChoiceQuestion question = new ChoiceQuestion();
        BeanUtils.copyProperties(addRequest, question);
        question.setQuestionId(1L);

        int result = choiceQuestionMapper.insert(question);
        if (result != 1) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "题目创建失败");
        }
        return ResultUtils.success(question.getId());
    }

    /**
     * 更新题目
     */
    @PostMapping("/update")
    public BaseResponse<Boolean> updateChoiceQuestion(@RequestBody ChoiceQuestionUpdateRequest updateRequest) {
        if (updateRequest == null || updateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        if (updateRequest.getAnswer() == null || updateRequest.getAnswerOption() == null || updateRequest.getChoiceOption() == null || updateRequest.getQuestionTitle() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        ChoiceQuestion question = new ChoiceQuestion();
        BeanUtils.copyProperties(updateRequest, question);
        int result = choiceQuestionMapper.updateById(question);
        if (result != 1) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "题目更新失败");
        }
        return ResultUtils.success(true);
    }
    
    /**
     * 保存答题记录
     */
    @PostMapping("/record/save")
    public BaseResponse<Long> saveChoiceQuestionLog(@RequestBody ChoiceQuestionLogAddRequest logRequest, HttpServletRequest request) {
        if (logRequest == null || logRequest.getQuestionId() == null || logRequest.getChoiceOption() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数不能为空");
        }
        
        // 获取登录用户信息
        User loginUser = userService.getLoginUser(request);
        

        // 创建答题记录
        ChoiceQuestionLog log = new ChoiceQuestionLog();
        log.setQuestionId(logRequest.getQuestionId());
        log.setUserId(loginUser.getId());
        log.setSelectedOption(logRequest.getChoiceOption());
        log.setCreateTime(new Date());
        log.setUpdateTime(new Date());
        
        int result = choiceQuestionLogMapper.insert(log);
        if (result != 1) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "答题记录保存失败");
        }
        
        return ResultUtils.success(log.getId());
    }
}