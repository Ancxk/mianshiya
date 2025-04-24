"use client";
import { List, Form, Input, Button, message, Tooltip, Avatar } from "antd";
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import { Comment } from "@ant-design/compatible";
import { useState, createElement,useEffect } from "react";
import { addCommentUsingPost, getCommentsByQuestionIdUsingGet } from "@/api/commentController";
import { log } from "console";
import { useSelector } from 'react-redux';
import { RootState } from '@/stores';
import { doCommentThumbUsingPost } from '@/api/commentController';

interface Props {
  questionId: number;
}

interface CommentActionState {
  likes: Record<number, number>;
  dislikes: Record<number, number>;
  actions: Record<number, string | null>;
}

const CommentsSection = ({ questionId }: Props) => {
  const [comments, setComments] = useState<API.CommentVO[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [commentContents, setCommentContents] = useState<Record<number, string>>({});
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  
  const [commentActions, setCommentActions] = useState<CommentActionState>({
    likes: {},
    dislikes: {},
    actions: {}
  });
  useEffect(() => {
    loadComments();
}, []);

  const handleVote = async (commentId: number, type: 'like' | 'dislike') => {
    try {
      await doCommentThumbUsingPost({
        commentId: commentId,
        isLike: type === 'like' ? 1 : 0
      });
  
      // 点赞/点踩后，重新拉取评论列表，保证数量刷新
      await loadComments();
    } catch (e) {
      message.error('操作失败');
    }
  };

  

  const loadComments = async () => {
      try {
          const res = await getCommentsByQuestionIdUsingGet({ questionId });
          const comments = (res.data) as API.CommentVO[];
          setComments(comments);
          
          // 初始化点赞状态
          const initialActions = comments.reduce((acc, comment) => {
              acc.likes = { ...acc.likes, [comment.id]: comment.likeCount || 0 };
              acc.dislikes = { ...acc.dislikes, [comment.id]: comment.dislikeCount || 0 };
              return acc;
          }, { likes: {}, dislikes: {}, actions: {} });
          
          setCommentActions(initialActions);
      } catch (e) {
          message.error("加载评论失败");
            // 模拟数据
            const mockComments: API.CommentVO[] = [
                {
                  id: 1,
                  content: "这是第一条测试评论",
                  createTime: "2023-01-01T00:00:00.000Z",
                  user: {
                    uid: 101,
                    name: "测试用户1",
                    avatar: "https://joeschmoe.io/api/v1/random"
                  },
                  likeCount: 3,  // 初始化点赞数
                  dislikeCount: 2 // 初始化点踩数
                },
                {
                  id: 2,
                  content: "这是第二条测试评论",
                  createTime: "2023-01-01T00:00:00.000Z",
                  user: {
                    uid: 103,
                    name: "测试用户3",
                    avatar: "https://joeschmoe.io/api/v1/random"
                  },
                  replyCommentId: 1,
                  replyUserId: 1,
                  replyUserName: "测试用户1",
                  likeCount: 110,  // 初始化点赞数
                  dislikeCount: 10 // 初始化点踩数
                }
              ];
      setComments(mockComments);
      // 新增：同步初始化点赞状态
      const initialActions = mockComments.reduce((acc, comment) => {
        acc.likes = { ...acc.likes, [comment.id]: comment.likeCount || 0 };
        acc.dislikes = { ...acc.dislikes, [comment.id]: comment.dislikeCount || 0 };
        return acc;
      }, { likes: {}, dislikes: {}, actions: {} });
      setCommentActions(initialActions);
    }
  };

  const handleSubmit = async (
    content: string,
    questionId: number,
    replyCommentId?: number,
    replyUserId?: number,
    replyUserName?: string
) => {
    if (!content) return;
    
    setSubmitting(true);
    try {
        await addCommentUsingPost({
            questionId,
            content,
            replyCommentId,
            replyUserId,
            replyUserName,
        });
    
        // 这里改为重新加载评论列表
        await loadComments();
        setContent("");
    } catch (e) {
        message.error("提交评论失败");
    } finally {
        setSubmitting(false);
    }
};


const renderCommentContent = (comment: API.CommentVO) => {
    return (
      <p>
        {comment.replyUserName && (
          <span style={{ color: '#1890ff' }}>@{comment.replyUserName} </span>
        )}
        {comment.content}
      </p>
    );
  };


const renderCommentItem = (item: API.CommentVO) => {
    const actions = [
        <Tooltip key="comment-basic-like" title="Like">
            <span onClick={() => handleVote(item.id, 'like')}>
                {createElement(commentActions.actions[item.id] === 'liked' ? LikeFilled : LikeOutlined)}
                <span className="comment-action">{commentActions.likes[item.id] || 0}</span>
            </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
            <span onClick={() => handleVote(item.id, 'dislike')}>
                {createElement(commentActions.actions[item.id] === 'disliked' ? DislikeFilled : DislikeOutlined)}
                <span className="comment-action">{commentActions.dislikes[item.id] || 0}</span>
            </span>
        </Tooltip>,
        <span key="comment-basic-reply-to" onClick={() => setReplyingToId(replyingToId === item.id ? null : item.id)}>
            Reply to
        </span>
    ];

    return (
        <li key={item.id}>
            <Comment
                actions={actions}
                author={item.user?.name || '匿名用户'}
                avatar={<Avatar src={item.user?.avatar} alt={item.user?.name} />}
                content={renderCommentContent(item)}
                datetime={item.createTime}
            />
            {replyingToId === item.id && (
                <div style={{ marginTop: 16 }}>
                    <Form.Item>
                        <Input.TextArea
                            rows={4}
                            value={commentContents[item.id] || ""}
                            onChange={(e) => setCommentContents({
                                ...commentContents,
                                [item.id]: e.target.value
                            })}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            loading={submitting}
                            onClick={() => handleSubmit(
                                commentContents[item.id], 
                                questionId,
                                item.id,
                                item.user?.uid,
                                item.user?.name
                            )}
                            type="primary"
                        >
                            发表评论
                        </Button>
                    </Form.Item>
                </div>
            )}
        </li>
    );
};

  return (
    <div className="comments-section">
      <Comment
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
        content={
          <Form.Item>
            <Input.TextArea 
              rows={4} 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Item>
        }
      />
      <Form.Item>
        <Button 
          htmlType="submit" 
          loading={submitting}
          onClick={() => handleSubmit(content, questionId)}
          type="primary"
        >
          发表评论
        </Button>
      </Form.Item>
      <List
        className="comment-list"
        header={`${comments.length} replies`}
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={renderCommentItem}
      />
    </div>
  );
};

// const renderCommentContent = (comment: API.CommentVO) => {
//     return (
//       <p>
//         {comment.replyName && (
//           <span style={{ color: '#1890ff' }}>@{comment.replyName} </span>
//         )}
//         {comment.content}
//       </p>
//     );
//   };
  

export default CommentsSection;