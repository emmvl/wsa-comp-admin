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
            competitionState: true,
            buttonClicked: ""
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
                console.log(this.state.buttonClicked)
                if (this.state.buttonClicked == "save") {
                    this.props.handleOK()
                }
                else {
                    this.props.handleCompetitionNext()
                }
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { modalTitle, handleOK, onCancel, competitionChange, updateDate, onCompetitionBack, selectedDate, handleCompetitionNext } = this.props
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

                        {/* <div style={{ display: 'flex' }}>
                            < span style={{ fontSize: 16 }} className={`comment-heading`}>{'"Enter competition Name"'} {" "} {'or'}{" "}   {'Select an existing competition'}   </span>
                        </div> */}
                        <div className="inside-container-view mt-3">
                            < div className="col-sm pl-0 pb-2">
                                <Form.Item
                                >
                                    {getFieldDecorator(`compName`, {
                                        rules: [{ required: true, message: ValidationConstants.competitionNameIsRequired },
                                        ],
                                    })(
                                        <InputWithHead
                                            required={"required-field pt-0"}
                                            heading={AppConstants.competition_name}
                                            placeholder={"Enter competition Name"}
                                            onChange={(e) => competitionChange(e)}
                                            onBlur={(i) => this.props.form.setFieldsValue({
                                                'compName': captializedString(i.target.value)
                                            })}
                                        ></InputWithHead>
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm pl-0 pb-2">
                                <InputWithHead
                                    required={"required-field"}
                                    heading={AppConstants.competitionStartDate}
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
                                    <Button className="cancelBtnWidth" type="cancel-button" onClick={onCancel} style={{ marginRight: '20px' }}
                                    >
                                        {AppConstants.back}
                                    </Button>
                                </div>
                                <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-end" }}>
                                    <Button className="publish-button save-draft-text" type="primary" htmlType="submit" onClick={() => this.setState({ buttonClicked: "save" })} >
                                        {AppConstants.save}
                                    </Button>
                                    <Button className="publish-button" type="primary" htmlType="submit" onClick={() => this.setState({ buttonClicked: "next" })} >
                                        {AppConstants.next}
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