import { updateChoiceQuestionUsingPost } from "@/api/questionController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
  visible: boolean;
  columns: ProColumns<API.ChoiceQuestion>[];
  oldData?: API.ChoiceQuestion;
  onSubmit: (values: API.ChoiceQuestionUpdateRequest) => void;
  onCancel: () => void;
}

/**
 * 更新选择题弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const { visible, columns, oldData, onSubmit, onCancel } = props;

  if (!oldData) {
    return <></>;
  }

  /**
   * 更新
   * @param fields
   */
  const doUpdate = async (fields: API.ChoiceQuestionUpdateRequest) => {
    const hide = message.loading("正在更新");
    try {
      await updateChoiceQuestionUsingPost({
        id: oldData.id,
        ...fields,
      });
      hide();
      message.success("更新成功");
      onSubmit?.(fields);
    } catch (error: any) {
      hide();
      message.error("更新失败，" + error.message);
    }
  };

  // 解析选项数据
  const parseChoiceOption = (choiceOption: any) => {
    if (typeof choiceOption === 'string') {
      try {
        return JSON.parse(choiceOption);
      } catch {
        return {};
      }
    }
    return choiceOption || {};
  };

  const parsedOptions = parseChoiceOption(oldData.choiceOption);

  return (
    <Modal
      destroyOnClose
      title={"更新选择题"}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable<API.ChoiceQuestionUpdateRequest>
        onSubmit={async (values: any) => {
          // 处理选项数据结构
          const choiceOption = {
            a: values.choiceOptionA,
            b: values.choiceOptionB,
            c: values.choiceOptionC,
            d: values.choiceOptionD,
          };
          
          const submitData = {
            ...values,
            choiceOption: JSON.stringify(choiceOption),
          };
          
          await doUpdate(submitData);
        }}
        rowKey="id"
        type="form"
        form={{
          initialValues: {
            ...oldData,
            choiceOptionA: parsedOptions.a,
            choiceOptionB: parsedOptions.b,
            choiceOptionC: parsedOptions.c,
            choiceOptionD: parsedOptions.d,
          },
        }}
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
                a: "a",
                b: "b",
                c: "c",
                d: "d",
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

export default UpdateModal;