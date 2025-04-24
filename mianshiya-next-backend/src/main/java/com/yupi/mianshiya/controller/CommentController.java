package com.yupi.mianshiya.controller;

import com.yupi.mianshiya.common.BaseResponse;
import com.yupi.mianshiya.common.ErrorCode;
import com.yupi.mianshiya.common.ResultUtils;
import com.yupi.mianshiya.exception.BusinessException;
import com.yupi.mianshiya.model.dto.comment.CommentAddRequest;
import com.yupi.mianshiya.model.dto.comment.CommentLikeRequest;
import com.yupi.mianshiya.model.entity.Comment;
import com.yupi.mianshiya.model.entity.CommentLike;
import com.yupi.mianshiya.model.entity.User;
import com.yupi.mianshiya.model.vo.*;
import com.yupi.mianshiya.mapper.CommentMapper;
import com.yupi.mianshiya.mapper.CommentLikeMapper;
import com.yupi.mianshiya.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import lombok.extern.slf4j.Slf4j;
/**
 * 评论接口
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@RestController
@RequestMapping("/comment")
@Slf4j
public class CommentController {

    @Resource
    private CommentMapper commentMapper;

    @Resource
    private CommentLikeMapper commentLikeMapper;

    @Resource
    private UserService userService;

    /**
     * 根据 questionId 查询评论列表
     */
    @GetMapping("/list")
    public BaseResponse<List<CommentVO>> listCommentsByQuestionId(@RequestParam Long questionId) {
        if (questionId == null || questionId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        List<Comment> commentList = commentMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<Comment>().eq("question_id", questionId)
        );

        List<CommentVO> commentVOList = commentList.stream().map(comment -> {
            CommentVO vo = new CommentVO();
            
            
            BeanUtils.copyProperties(comment, vo);
            //查询用户信息
            User user = userService.getById(comment.getUserId());
            
            if (user != null) {
                UserCommentVO userCommentVO = new UserCommentVO();
                BeanUtils.copyProperties(user, userCommentVO);
                userCommentVO.setAvatar(user.getUserAvatar());
                userCommentVO.setName(user.getUserName());
                userCommentVO.setUid(user.getId());
                vo.setUser(userCommentVO);
            }


            // 查询点赞数量
            Long likeCount = commentLikeMapper.selectCount(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<CommentLike>()
                    .eq("comment_id", comment.getId())
                    .eq("is_like", 1)
            );
            // 查询点踩数量
            Long dislikeCount = commentLikeMapper.selectCount(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<CommentLike>()
                    .eq("comment_id", comment.getId())
                    .eq("is_like", 0)
            );
            vo.setLikeCount(likeCount.intValue());
            vo.setDislikeCount(dislikeCount.intValue());
            return vo;
        }).collect(Collectors.toList());
        return ResultUtils.success(commentVOList);
    }

    /**
     * 发布评论
     */
    @PostMapping("/add")
    public BaseResponse<Long> addComment(@RequestBody CommentAddRequest commentAddRequest, HttpServletRequest request) {
        if (commentAddRequest == null || commentAddRequest.getQuestionId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        Comment comment = new Comment();
        BeanUtils.copyProperties(commentAddRequest, comment);
        comment.setUserId(loginUser.getId());
        int result = commentMapper.insert(comment);
        if (result <= 0) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "评论发布失败");
        }
        return ResultUtils.success(comment.getId());
    }

    /**
     * 点赞或点踩评论
     */
    @PostMapping("/likeOrDislike")
    public BaseResponse<Boolean> likeOrDislikeComment(@RequestBody CommentLikeRequest commentLikeRequest, HttpServletRequest request) {
        if (commentLikeRequest == null || commentLikeRequest.getCommentId() == null || commentLikeRequest.getIsLike() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);

        // 先查是否已存在
        CommentLike old = commentLikeMapper.selectOne(
            new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<CommentLike>()
                .eq("comment_id", commentLikeRequest.getCommentId())
                .eq("user_id", loginUser.getId())
        );
        int result;
        if (old != null) {
            // 存在则更新
            old.setIsLike(commentLikeRequest.getIsLike());
            result = commentLikeMapper.updateById(old);
        } else {
            // 不存在则插入
            CommentLike commentLike = new CommentLike();
            commentLike.setCommentId(commentLikeRequest.getCommentId());
            commentLike.setUserId(loginUser.getId());
            commentLike.setIsLike(commentLikeRequest.getIsLike());
            result = commentLikeMapper.insert(commentLike);
        }
        if (result <= 0) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "操作失败");
        }
        return ResultUtils.success(true);
    }
}