package com.yupi.mianshiya.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 评论视图对象
 */
@Data
public class CommentVO implements Serializable {

    /**
     * 评论ID
     */
    private Long id;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 评论用户
     */
    private UserCommentVO user;

    /**
     * 回复的用户名
     */
    private String replyUserName;

    /**
     * 回复的用户ID
     */
    private Long replyUserId;

    /**
     * 回复的评论ID
     */
    private Long replyCommentId;

    /**
     * 点赞数量
     */
    private Integer likeCount;

    /**
     * 点踩数量
     */
    private Integer dislikeCount;

    private static final long serialVersionUID = 1L;
}