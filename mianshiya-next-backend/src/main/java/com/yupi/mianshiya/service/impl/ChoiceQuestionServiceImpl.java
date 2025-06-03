package com.yupi.mianshiya.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.mianshiya.model.entity.ChoiceQuestion;
import com.yupi.mianshiya.mapper.ChoiceQuestionMapper;
import com.yupi.mianshiya.service.ChoiceQuestionService;
import org.springframework.stereotype.Service;

@Service
public class ChoiceQuestionServiceImpl extends ServiceImpl<ChoiceQuestionMapper, ChoiceQuestion> implements ChoiceQuestionService {
    // 可扩展自定义方法
}