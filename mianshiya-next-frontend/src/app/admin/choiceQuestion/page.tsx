"use client";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {
  deleteChoiceQuestionUsingPost,
  getChoiceQuestionListUsingGet,
} from "@/api/questionController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space, Typography } from "antd";
import React, { useRef, useState } from "react";
import "./index.css";

const { Text } = Typography;

/**
 * 选择题管理页面
 */
const ChoiceQuestionAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前选择题点击的数据
  const [currentRow, setCurrentRow] = useState<API.ChoiceQuestion>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.ChoiceQuestion) => {
    const hide = message.loading("正在删除");
    if (!row) return true;
    try {
      await deleteChoiceQuestionUsingPost({
        id: row.id as any,
      });
      hide();
      message.success("删除成功");
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error("删除失败，" + error.message);
      return false;
    }
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.ChoiceQuestion>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: "题目标题",
      dataIndex: "questionTitle",
      valueType: "text",
      hideInSearch: true,
    },
    {
      title: "选项A",
      dataIndex: ["choiceOption", "a"],
      valueType: "text",
      ellipsis: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "选项B",
      dataIndex: ["choiceOption", "b"],
      valueType: "text",
      ellipsis: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "选项C",
      dataIndex: ["choiceOption", "c"],
      valueType: "text",
      ellipsis: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "选项D",
      dataIndex: ["choiceOption", "d"],
      valueType: "text",
      ellipsis: true,
      width: 120,
      hideInSearch: true,
    },
    {
      title: "正确答案",
      dataIndex: "answerOption",
      valueType: "text",
      width: 80,
    hideInSearch: true,
      render: (_, record) => (
        <Text strong style={{ color: '#52c41a' }}>
          {record.answerOption}
        </Text>
      ),
    },
    {
      title: "题库ID",
      dataIndex: "questionBankId",
      valueType: "text",
      hideInSearch: true,
      width: 80,
    },
    {
      title: "创建时间",
      sorter: true,
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "更新时间",
      sorter: true,
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Button>
          <Popconfirm
            title="确认删除？"
            description="你确定要删除这个选择题吗？"
            onConfirm={() => handleDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="text" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ChoiceQuestion>
        headerTitle={"选择题管理"}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params) => {
          const { data, code } = await getChoiceQuestionListUsingGet({
            pageNum: params.current,
            pageSize: params.pageSize,
            questionBankId: params.questionBankId,
          });

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
      />
    </PageContainer>
  );
};

export default ChoiceQuestionAdminPage;