package com.yupi.mianshiya.model.vo;

import com.yupi.mianshiya.model.entity.ChoiceQuestion;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

/**
 * 选择题视图对象
 *
 * @author <a href="https://github.com/liyupi">程序员鱼皮</a>
 * @from <a href="https://www.code-nav.cn">编程导航学习圈</a>
 */
@Data
public class ChoiceQuestionVO implements Serializable {

    /**
     * id
     */
    private Long id;

    /**
     * 题目ID
     */
    private Long questionId;

    /**
     * 题目标题
     */
    private String questionTitle;

    /**
     * 选项（Map格式，key为a/b/c/d，value为选项内容）
     */
    private Map<String, String> choiceOption;

    /**
     * 答案选择的选项（如a/b/c/d）
     */
    private String answerOption;

    /**
     * 答案
     */
    private String answer;
    private Long questionBankId;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 对象转封装类
     *
     * @param choiceQuestion
     * @return
     */
    public static ChoiceQuestionVO objToVo(ChoiceQuestion choiceQuestion) {
        if (choiceQuestion == null) {
            return null;
        }
        ChoiceQuestionVO choiceQuestionVO = new ChoiceQuestionVO();
        BeanUtils.copyProperties(choiceQuestion, choiceQuestionVO);
        return choiceQuestionVO;
    }

    private static final long serialVersionUID = 1L;
}