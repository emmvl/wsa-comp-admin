import React from 'react';
import { Modal, DatePicker, Form, Button } from 'antd';
import InputWithHead from "./InputWithHead"
import AppConstants from "../themes/appConstants"
import ValidationConstants from '../themes/validationConstant';
import { captializedString } from "../util/helpers"

class CompetitionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionState: true
        }
    }

    componentDidUpdate() {
        if (this.props.visible === true && this.state.competitionState === true) {
            this.setState({ competitionState: false })
            this.setFieldValues()
        }
        if (this.props.visible === false && this.state.competitionState === false) {
            this.setState({ competitionState: true })
        }
    }

    setFieldValues = () => {
        this.props.form.setFieldsValue({
            compName: this.props.competitionName,
            date: this.props.selectedDate
        })
    }

    onOKsubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.handleOK()
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { modalTitle, handleOK, onCancel, competitionChange, updateDate, competitionName, selectedDate } = this.props
        return (
            <div style={{ backgroundColor: "red" }}>
                <Modal
                    {...this.props}
                    className="add-membership-type-modal modalFooter"
                    title={modalTitle}
                    visible={this.props.visible}
                    onOk={handleOK}
                    onCancel={onCancel}
                    footer={
                        <div style={{ display: "none" }}
                        />
                    }
                >
                    <Form
                        autoComplete="off"
                        onSubmit={this.onOKsubmit}
                        noValidate="noValidate">

                        <div style={{ display: 'flex' }}>
                            < span style={{ fontSize: 16 }} className={`comment-heading`}>{'"Enter competition Name"'} {" "} {'or'}{" "}   {'Select an existing competition'}   </span>
                        </div>
                        <div className="inside-container-view mt-3">
                            < div className="col-sm pl-0 pb-2">
                                <Form.Item
                                >
                                    {getFieldDecorator(`compName`, {
                                        normalize: (input) => captializedString(input),
                                        rules: [{ required: true, message: ValidationConstants.competitionNameIsRequired },
                                        ],
                                    })(
                                        <InputWithHead
                                            required={"pt-0"}
                                            heading={AppConstants.competition_name}
                                            placeholder={"Enter competition Name"}
                                            onChange={(e) => competitionChange(e)}
                                        ></InputWithHead>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm pl-0 pb-2">
                                <InputWithHead
                                    heading={"Competition Date"}
                                />
                                <Form.Item
                                >
                                    {getFieldDecorator(`date`, {
                                        rules: [{ required: true, message: ValidationConstants.dateField },
                                        ],
                                    })(
                                        <DatePicker
                                            size="large"
                                            style={{ width: "100%" }}
                                            onChange={date => updateDate(date)}
                                            format={"DD-MM-YYYY"}
                                            placeholder={"dd-mm-yyyy"}
                                            showTime={false}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm" style={{ display: "flex", width: "100%", paddingTop: 10 }}>
                                <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-start" }}>
                                    {/* <Button onClick={() => this.props.addVenueAction(venuData)} className="open-reg-button" type="primary"> */}
                                    <Button className="open-reg-button" type="primary" onClick={onCancel} style={{ marginRight: '20px' }}
                                    >
                                        {AppConstants.cancel}
                                    </Button>
                                </div>
                                <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-end" }}>
                                    <Button className="open-reg-button" type="primary" htmlType="submit" >
                                        {AppConstants.save}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal >
            </div >
        )
    }
}


export default (Form.create()(CompetitionModal));