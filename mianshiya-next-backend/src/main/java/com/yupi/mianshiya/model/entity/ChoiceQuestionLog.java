package com.yupi.mianshiya.model.entity;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.TableName;

@Data
@TableName(value = "choice_question_log")
public class ChoiceQuestionLog  implements Serializable{
    private Long id; // 答题记录ID
    private Long questionId; // 题目ID
    private Long userId; // 用户id
    private String selectedOption; // 用户选择的选项（如a/b/c/d）
    private Date createTime; // 答题时间
    private Date updateTime; // 更新时间
}