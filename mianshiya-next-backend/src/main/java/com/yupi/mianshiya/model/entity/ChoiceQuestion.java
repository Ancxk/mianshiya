package com.yupi.mianshiya.model.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableName;

@TableName(value = "choice_question")
@Data
public class ChoiceQuestion implements Serializable{
    private Long id; // 答题记录ID
    private Long questionId; // 题目ID
    private String questionTitle; // 题目标题
    private String choiceOption; // 选项（JSON对象，key为a/b/c/d）
    private String answerOption; // 答案选择的选项（如a/b/c/d）
    private String answer; // 答案
    private Long questionBankId; // 所属题库id
    private Date createTime; // 答题时间
    private Date updateTime; // 更新时间
}