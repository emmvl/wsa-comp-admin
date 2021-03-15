import React from 'react';
import { Modal, DatePicker, Form, Button } from 'antd';

import AppConstants from "../themes/appConstants";
import ValidationConstants from '../themes/validationConstant';
import { captializedString } from "../util/helpers";
import InputWithHead from "./InputWithHead";

class CompetitionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionState: true,
            buttonClicked: "",
        };
        this.formRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.props.visible === true && this.state.competitionState === true) {
            this.setState({ competitionState: false });
            this.setFieldValues();
        }
        if (this.props.visible === false && this.state.competitionState === false) {
            this.setState({ competitionState: true });
        }
    }

    setFieldValues = () => {
        if (this.formRef.current) {
            this.formRef.current.setFieldsValue({
                compName: this.props.competitionName,
                date: this.props.selectedDate,
            });
        }
    }

    onSubmit = () => {
        if (this.state.buttonClicked === "save") {
            this.props.handleOK();
        } else {
            this.props.handleCompetitionNext();
        }
    }

    render() {
        const { modalTitle, handleOK, onCancel, competitionChange, updateDate } = this.props;
        return (
            <div className="bg-danger">
                <Modal
                    {...this.props}
                    className="add-membership-type-modal modalFooter"
                    title={modalTitle}
                    visible={this.props.visible}
                    onOk={handleOK}
                    onCancel={onCancel}
                    footer={
                        <div className="d-none" />
                    }
                >
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.onSubmit}
                        onFinishFailed={({ errorFields }) => this.formRef.current.scrollToField(errorFields[0].name)}
                        noValidate="noValidate"
                    >
                        {/* <div className="d-flex">
                            <span className="comment-heading" style={{ fontSize: 16 }}>
                                {'"Enter competition Name"'} {" "} {'or'}{" "}   {'Select an existing competition'}
                            </span>
                        </div> */}
                        <div className="inside-container-view mt-3">
                            <div className="col-sm pl-0 pb-2">
                                <Form.Item name="compName" rules={[{ required: true, message: ValidationConstants.competitionNameIsRequired }]}>
                                    <InputWithHead
                                        required="required-field pt-0"
                                        heading={AppConstants.competitionName}
                                        placeholder="Enter competition Name"
                                        onChange={(e) => competitionChange(e)}
                                        onBlur={(i) => this.formRef.current.setFieldsValue({
                                            compName: captializedString(i.target.value),
                                        })}
                                    />
                                </Form.Item>
                            </div>
                            <div className="col-sm pl-0 pb-2">
                                <InputWithHead
                                    required="required-field"
                                    heading={AppConstants.competitionStartDate}
                                />
                                <Form.Item name="date" rules={[{ required: true, message: ValidationConstants.dateField }]}>
                                    <DatePicker
                                        // size="large"
                                        className="w-100"
                                        onChange={(date) => updateDate(date)}
                                        format="DD-MM-YYYY"
                                        placeholder="dd-mm-yyyy"
                                        showTime={false}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm d-flex w-100" style={{ paddingTop: 10 }}>
                                <div className="col-sm-6 d-flex w-50 justify-content-start">
                                    {/* <Button onClick={() => this.props.addVenueAction(venuData)} className="open-reg-button" type="primary"> */}
                                    <Button className="cancelBtnWidth" type="cancel-button" onClick={onCancel} style={{ marginRight: 20 }}>
                                        {AppConstants.back}
                                    </Button>
                                </div>
                                <div className="col-sm-6 d-flex w-50 justify-content-end">
                                    <Button
                                        className="publish-button save-draft-text"
                                        type="primary"
                                        htmlType="submit"
                                        onClick={() => this.setState({ buttonClicked: "save" })}
                                    >
                                        {AppConstants.save}
                                    </Button>
                                    <Button
                                        className="publish-button"
                                        type="primary"
                                        htmlType="submit"
                                        onClick={() => this.setState({ buttonClicked: "next" })}
                                    >
                                        {AppConstants.next}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default CompetitionModal;
