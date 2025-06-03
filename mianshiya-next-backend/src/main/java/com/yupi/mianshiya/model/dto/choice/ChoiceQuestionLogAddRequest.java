package com.yupi.mianshiya.model.dto.choice;

import lombok.Data;

import java.io.Serializable;

@Data
public class ChoiceQuestionLogAddRequest implements Serializable {
    
    /**
     * 题目ID
     */
    private Long questionId;
    
    /**
     * 用户选择的选项（如a/b/c/d）
     */
    private String choiceOption;
    
    private static final long serialVersionUID = 1L;
}