import React from 'react';
import { Input, Modal, } from 'antd';
const { TextArea } = Input;
class CommentModal extends React.Component {
    render() {
        const { heading, placeholder, name, handleBlur, onChange, type, value, modalTitle, visible, onOK, onCancel } = this.props
        return (
            <div style={{ backgroundColor: "red" }}>
                <Modal
                    {...this.props}
                    className="add-membership-type-modal"
                    title={modalTitle}
                    visible={this.props.visible}
                    onOk={onOK}
                    onCancel={onCancel}
                >
                    <span className={`input-heading`}>{heading}</span>
                    <TextArea
                        className="textAreaInput"
                        placeholder={placeholder}
                        allowClear
                        name={name}
                        // handleChange={(name) => alert(name)}
                        onBlur={handleBlur}
                        onChange={onChange}
                        type={type}
                        value={value}
                        // defaultValue="xyz"
                        {...this.props}
                    />

                </Modal>
            </div>
        )
    }
}


export default CommentModal;