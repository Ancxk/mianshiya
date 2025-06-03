import { addChoiceQuestionUsingPost } from "@/api/questionController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
  visible: boolean;
  columns: ProColumns<API.ChoiceQuestion>[];
  onSubmit: (values: API.ChoiceQuestionAddRequest) => void;
  onCancel: () => void;
}

/**
 * 添加选择题弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onSubmit, onCancel } = props;

  /**
   * 添加
   * @param fields
   */
  const doAdd = async (fields: API.ChoiceQuestionAddRequest) => {
    const hide = message.loading("正在添加");
    try {
      await addChoiceQuestionUsingPost(fields);
      hide();
      message.success("创建成功");
      onSubmit?.(fields);
    } catch (error: any) {
      hide();
      message.error("创建失败，" + error.message);
    }
  };

  return (
    <Modal
      destroyOnClose
      title={"创建选择题"}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable<API.ChoiceQuestionAddRequest>
        onSubmit={async (values: any) => {
          // 处理选项数据结构
          const choiceOption = {
            a: values.choiceOptionA,
            b: values.choiceOptionB,
            c: values.choiceOptionC,
            d: values.choiceOptionD,
          };
          
          const submitData: API.ChoiceQuestionAddRequest = {
            questionTitle: values.questionTitle,
            answerOption: values.answerOption,
            answer: values.answer,
            questionBankId: values.questionBankId,
            choiceOption: JSON.stringify(choiceOption),
          };
          
          await doAdd(submitData);
        }}
        rowKey="id"
        type="form"
        columns={[
          {
            title: "题目标题",
            dataIndex: "questionTitle",
            valueType: "text",
            formItemProps: {
              rules: [{ required: true, message: "请输入题目标题" }],
            },
          },
          {
            title: "选项A",
            dataIndex: "choiceOptionA",
            valueType: "textarea",
            formItemProps: {
              rules: [{ required: true, message: "请输入选项A" }],
            },
          },
          {
            title: "选项B",
            dataIndex: "choiceOptionB",
            valueType: "textarea",
            formItemProps: {
              rules: [{ required: true, message: "请输入选项B" }],
            },
          },
          {
            title: "选项C",
            dataIndex: "choiceOptionC",
            valueType: "textarea",
            formItemProps: {
              rules: [{ required: true, message: "请输入选项C" }],
            },
          },
          {
            title: "选项D",
            dataIndex: "choiceOptionD",
            valueType: "textarea",
          },
          {
            title: "正确答案",
            dataIndex: "answerOption",
            valueType: "select",
            valueEnum: {
              A: "A",
              B: "B",
              C: "C",
              D: "D",
            },
            formItemProps: {
              rules: [{ required: true, message: "请选择正确答案" }],
            },
          },
          {
            title: "答案解析",
            dataIndex: "answer",
            valueType: "textarea",
          },
          {
            title: "题库ID",
            dataIndex: "questionBankId",
            valueType: "digit",
          },
        ]}
      />
    </Modal>
  );
};

export default CreateModal;