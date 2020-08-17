import React from "react";
import { Modal } from "antd";

const { success } = Modal;

const errLine = (key, error) => (
  <div key={key}>
    <div
      style={{
        minWidth: 'max-content',
        color: 'red'
      }}
    >
      {key}:
    </div>
    <div>{error.map((msg, index) => (<p key={index * index}>{msg}</p>))}</div>
  </div>
);

const showContent = (errors) => {
  const keys = Object.keys(errors);
  return (
    <div style={{ maxHeight: '200px', overflow: 'auto' }}>
      {keys.length === 0 ? (
        <h3>No issue is occurred.</h3>
      ) : (
        keys.map(key => errLine(key, errors[key]))
      )}
    </div>
  );
};

export const receiptImportResult = (result) => {
  const resData = result.data.data;
  const resMsg = result.data.message;
  const resErr = result.data.error;

  success({
    title: resMsg,
    content: showContent(resErr),
    type: Object.keys(resErr).length === 0
      ? 'success'
      : (resData.length === 0 ? 'error' : 'warning'),
    okText: 'Ok',
    okType: 'danger',
    okButtonProps: { className: 'ant-btn primary-add-comp-form ant-btn-primary' },
    cancelButtonProps: { className: 'hide' },
    onOk() {
    },
  });
};
