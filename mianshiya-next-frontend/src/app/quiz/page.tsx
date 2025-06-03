'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Card, Radio, Button, message, Typography, Space, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getChoiceQuestionListUsingGet, saveChoiceQuestionRecordUsingPost } from '@/api/questionController';
import { useSearchParams } from 'next/navigation';
import './index.css';

const { Title, Text, Paragraph } = Typography;

// 选择题数据类型定义
interface ChoiceOption {
  a: string;
  b: string;
  c: string;
  d?: string;
}

interface QuizQuestion {
  id: string;
  questionId: string;
  questionTitle: string;
  choiceOption: ChoiceOption;
  answerOption: string;
  answer: string;
  createTime: string;
  updateTime: string;
}

/**
 * 选择题组件（包含 useSearchParams 的部分）
 */
function QuizContent() {
  const searchParams = useSearchParams();
  const questionBankId = searchParams.get('questionBankId');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [continuingQuiz, setContinuingQuiz] = useState(false);

  // 获取选择题数据
  useEffect(() => {
    fetchQuizData(currentPage);
  }, []);

  const fetchQuizData = async (pageNum: number) => {
    try {
      setLoading(true);
      
      // 将questionBankId从字符串转换为数字
      const questionBankIdNumber = questionBankId ? Number(questionBankId) : undefined;
      
      const response = await getChoiceQuestionListUsingGet({
        pageNum: pageNum,
        pageSize: 5,
        questionBankId: questionBankIdNumber
      });
      
      if (response.code === 0 && response.data) {
        const quizQuestions = response.data.records || [];
        setQuestions(quizQuestions);
        
        // 如果题目列表为空，显示提示信息
        if (quizQuestions.length === 0) {
          message.info('暂无题目数据');
        }
      } else {
        message.error('获取题目失败: ' + (response.message || '未知错误'));
      }
    } catch (error) {
      message.error('获取题目失败');
      console.error('Error fetching quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理用户选择答案
  const handleAnswerChange = (questionId: string, value: string) => {
    if (submitted) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // 保存单个题目的提交记录
  const saveQuestionRecord = async (question: QuizQuestion, userChoice: string) => {
    try {
      await saveChoiceQuestionRecordUsingPost({
        id: question.id ? Number(question.id) : undefined,
        questionId: question.questionId ? Number(question.questionId) : undefined,
        choiceOption: userChoice
      });
    } catch (error) {
      console.error('保存题目记录失败:', error);
    }
  };

  // 提交答案
  const handleSubmit = async () => {
    // 检查题目列表是否为空
    if (questions.length === 0) {
      message.warning('暂无题目，无法提交');
      return;
    }
    
    if (Object.keys(userAnswers).length !== questions.length) {
      message.warning('请完成所有题目后再提交');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // 保存所有题目的提交记录
      const savePromises = questions.map(question => {
        const userChoice = userAnswers[question.id];
        if (userChoice) {
          return saveQuestionRecord(question, userChoice);
        }
        return Promise.resolve();
      });
      
      await Promise.all(savePromises);
      
      setSubmitted(true);
      message.success('提交成功！');
    } catch (error) {
      message.error('提交失败，请重试');
      console.error('提交失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 继续答题（获取下一页题目）
  const handleContinueQuiz = async () => {
    setContinuingQuiz(true);
    
    try {
      const nextPage = currentPage + 1;
      await fetchQuizData(nextPage);
      
      // 重置状态
      setCurrentPage(nextPage);
      setUserAnswers({});
      setSubmitted(false);
      
      message.success('已加载新题目，继续答题吧！');
    } catch (error) {
      message.error('加载新题目失败');
    } finally {
      setContinuingQuiz(false);
    }
  };

  // 重新开始当前页
  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  // 计算得分
  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (userAnswers[question.id] === question.answerOption) {
        correct++;
      }
    });
    return { correct, total: questions.length };
  };

  const { correct, total } = submitted ? calculateScore() : { correct: 0, total: 0 };

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <Title level={2}>加载中...</Title>
        </div>
      </div>
    );
  }

  // 如果没有题目，显示空状态
  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-header">
            <Title level={2}>选择题练习 - 第{currentPage}页</Title>
          </div>
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px 0' }}>
            <Title level={3} style={{ color: '#999' }}>暂无题目</Title>
            <Text style={{ color: '#666' }}>当前页面没有可用的题目</Text>
            <div style={{ marginTop: 24 }}>
              {currentPage > 1 && (
                <Button 
                  onClick={() => {
                    const prevPage = currentPage - 1;
                    setCurrentPage(prevPage);
                    fetchQuizData(prevPage);
                  }}
                >
                  返回上一页
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <Title level={2}>选择题练习 - 第{currentPage}页</Title>
          {submitted && (
            <div className="score-display">
              <Text strong style={{ fontSize: '18px' }}>
                本页得分: {correct}/{total} ({Math.round((correct/total) * 100)}%)
              </Text>
            </div>
          )}
        </div>

        <div className="quiz-content">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const isCorrect = submitted && userAnswer === question.answerOption;
            const isWrong = submitted && userAnswer && userAnswer !== question.answerOption;
            
            return (
              <Card 
                key={question.id} 
                className={`question-card ${
                  submitted ? (isCorrect ? 'correct' : isWrong ? 'wrong' : 'unanswered') : ''
                }`}
                style={{ marginBottom: 24 }}
              >
                <div className="question-header">
                  <Title level={4}>
                    {index + 1}. {question.questionTitle}
                    {submitted && (
                      <span className="result-icon">
                        {isCorrect ? (
                          <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
                        ) : isWrong ? (
                          <CloseCircleOutlined style={{ color: '#ff4d4f', marginLeft: 8 }} />
                        ) : null}
                      </span>
                    )}
                  </Title>
                </div>
                
                <Radio.Group 
                  value={userAnswer} 
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={submitted}
                  className="options-group"
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {Object.entries(question.choiceOption).map(([key, value]) => {
                      const isThisCorrect = submitted && key === question.answerOption;
                      const isThisUserChoice = submitted && key === userAnswer;
                      
                      return (
                        <Radio 
                          key={key} 
                          value={key}
                          className={`option-radio ${
                            submitted ? (
                              isThisCorrect ? 'correct-option' : 
                              isThisUserChoice && !isThisCorrect ? 'wrong-option' : ''
                            ) : ''
                          }`}
                        >
                          <span className="option-text">
                            <strong>{key.toUpperCase()}.</strong> {value}
                          </span>
                        </Radio>
                      );
                    })}
                  </Space>
                </Radio.Group>

                {submitted && (
                  <div className="answer-explanation">
                    <Divider />
                    <div className="correct-answer">
                      <Text strong style={{ color: '#52c41a' }}>
                        正确答案: {question.answerOption.toUpperCase()}
                      </Text>
                    </div>
                    <div className="explanation">
                      <Text strong>解析:</Text>
                      <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                        {question.answer}
                      </Paragraph>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="quiz-actions">
          {!submitted ? (
            <Button 
              type="primary" 
              size="large" 
              onClick={handleSubmit}
              loading={submitting}
              disabled={
                questions.length === 0 || // 题目列表为空时禁用
                Object.keys(userAnswers).length !== questions.length
              }
            >
              {submitting ? '提交中...' : '提交答案'}
            </Button>
          ) : (
            <Space>
              <Button size="large" onClick={handleReset}>
                重做本页
              </Button>
              <Button 
                type="primary" 
                size="large" 
                onClick={handleContinueQuiz}
                loading={continuingQuiz}
              >
                {continuingQuiz ? '加载中...' : '继续答题'}
              </Button>
            </Space>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 选择题页面
 */
export default function QuizPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <QuizContent />
    </Suspense>
  );
}