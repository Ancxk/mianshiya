"use client";
import { Card, Button } from "antd";
import { useState } from "react";
import Title from "antd/es/typography/Title";
import TagList from "@/components/TagList";
import MdViewer from "@/components/MdViewer";
import useAddUserSignInRecord from "@/hooks/useAddUserSignInRecord";
import "./index.css";

interface Props {
  question: API.QuestionVO;
}

/**
 * 题目卡片
 * @param props
 * @constructor
 */
const QuestionCard = (props: Props) => {
  const { question } = props;
  const [showAnswer, setShowAnswer] = useState(false);

  // 签到
  useAddUserSignInRecord();

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="question-card">
      <Card>
        <Title level={1} style={{ fontSize: 24 }}>
          {question.title}
        </Title>
        <TagList tagList={question.tagList} />
        <div style={{ marginBottom: 16 }} />
        <MdViewer value={question.content} />
      </Card>
      <div style={{ marginBottom: 16 }} />
      <Card 
        title="推荐答案" 
        extra={
          <Button 
            type="primary" 
            onClick={toggleAnswer}
          >
            {showAnswer ? '隐藏答案' : '查看答案'}
          </Button>
        }
      >
        {showAnswer && <MdViewer value={question.answer} />}
        {!showAnswer && (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            点击右上角按钮查看推荐答案
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuestionCard;
