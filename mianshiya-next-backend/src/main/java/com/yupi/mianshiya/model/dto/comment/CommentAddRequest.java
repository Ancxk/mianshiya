package com.yupi.mianshiya.model.dto.comment;

import lombok.Data;

import java.io.Serializable;

/**
 * 评论添加请求
 */
@Data
public class CommentAddRequest implements Serializable {

    /**
     * 关联的问题ID
     */
    private Long questionId;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 用户ID（可选，通常后端自动填充）
     */
    private Long uid;

    /**
     * 用户名（可选）
     */
    private String name;

    /**
     * 父评论ID（可选，支持多级评论时用）
     */
    private Long parentId;

    /**
     * 回复的评论ID（可选）
     */
    private Long replyCommentId;

    /**
     * 回复的用户ID（可选）
     */
    private Long replyUserId;

    /**
     * 回复的用户名（可选）
     */
    private String replyUserName;

    private static final long serialVersionUID = 1L;
}