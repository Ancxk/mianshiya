package com.yupi.mianshiya.model.vo;

import lombok.Data;

import java.io.Serializable;

/**
 * 评论用户视图对象
 */
@Data
public class UserCommentVO implements Serializable {

    /**
     * 用户ID
     */
    private Long uid;

    /**
     * 用户名
     */
    private String name;

    /**
     * 用户头像
     */
    private String avatar;

    private static final long serialVersionUID = 1L;
}