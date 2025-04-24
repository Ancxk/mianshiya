// @ts-ignore
/* eslint-disable */
import request from '@/libs/request';

/**
 * 添加评论
 */
export async function addCommentUsingPost(
  body: API.CommentAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/comment/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 根据题目ID获取评论列表
 */
export async function getCommentsByQuestionIdUsingGet(
  params: {
    // query
    questionId: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListCommentVO>('/api/comment/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export interface ThumbResult {
  likeCount: number;
  dislikeCount: number;
}

export async function doCommentThumbUsingPost(
  params: {
    commentId: number;
    isLike: number; // 1为点赞，0为点踩
  },
  options?: { [key: string]: any },
) {
  return request<ThumbResult>('/api/comment/likeOrDislike', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: params,
    ...(options || {}),
  });
}