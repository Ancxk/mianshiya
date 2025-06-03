package com.yupi.mianshiya.model.dto.choice;

import lombok.Data;
import java.io.Serializable;

@Data
public class ChoiceQuestionUpdateRequest implements Serializable {
    private Long id;
    private String questionTitle;
    private String choiceTitle;
    private String choiceOption;
    private Long questionBankId; // 所属题库id
    private String answerOption; // 答案选择的选项（如a/b/c/d）
    private String answer; // 答案

    // 其他字段根据表结构补充
}