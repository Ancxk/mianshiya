package com.yupi.mianshiya.model.dto.comment;

import lombok.Data;

import java.io.Serializable;

/**
 * 评论点赞/点踩请求
 */
@Data
public class CommentLikeRequest implements Serializable {

    /**
     * 评论ID
     */
    private Long commentId;

    /**
     * 是否点赞（1为点赞，0为点踩）
     */
    private Integer isLike;

    private static final long serialVersionUID = 1L;
}