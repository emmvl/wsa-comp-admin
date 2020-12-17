import React, { Component } from "react";
import { Modal, Spin } from "antd";

class Loader extends Component {
    render() {
        return (
            <Modal
                // title="WSA 1"
                visible={this.props.visible}
                // onOk={this.handleOk}
                // onCancel={this.handleCancel}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                centered
                width={0}
                height={0}
                closable={false}
                footer={null}
            >
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent'
                }}>
                    <Spin tip="Loading..." delay={this.props.delay} />
                </div>
            </Modal>


        );
    }
}

export default Loader;
