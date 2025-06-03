package com.yupi.mianshiya.model.dto.choice;

import lombok.Data;
import java.io.Serializable;

@Data
public class ChoiceQuestionAddRequest implements Serializable {
    private Long questionId;
    private String questionTitle;
    private String choiceOption; // 建议用 String 存 JSON，或 List/Map 配合类型转换
    private String answerOption; // 答案选择的选项（如a/b/c/d）
    private String answer; // 答案
    private Long questionBankId; // 所属题库id
    // 其他字段根据表结构补充
}