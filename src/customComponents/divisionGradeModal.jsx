import React from 'react';
import { Modal, InputNumber, Form, Button } from 'antd';

import AppConstants from "../themes/appConstants";
import AppImages from "../themes/appImages";
import ValidationConstants from '../themes/validationConstant';
import InputWithHead from "./InputWithHead";

class DivisionGradeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            divisionState: true
        }
        this.formRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.props.visible === true && this.state.divisionState === true) {
            this.setState({ divisionState: false })
            this.valueupdate()
        }
        if (this.props.visible === false && this.state.divisionState === false) {
            this.setState({ divisionState: true })
        }
    }

    setFieldValues = () => {
        if (this.formRef.current) {
            let division = this.props.division
            if (division.length > 0) {
                division.forEach((item, index) => {
                    let division = `division${index}`
                    this.formRef.current.setFieldsValue({
                        [division]: item.divisionName,
                    })
                    let grade = item.grades
                    if (grade.length > 0) {
                        grade.forEach((gradeItem, gradeIndex) => {
                            let grade = `grade${index}${gradeIndex}`
                            let team = `team${index}${gradeIndex}`
                            this.formRef.current.setFieldsValue({
                                [grade]: gradeItem.gradeName,
                                [team]: gradeItem.noOfTeams
                            })
                        })
                    }
                })
            }
        }
    }

    valueupdate = () => {
        setTimeout(() => {
            this.setFieldValues()
        }, 500);
    }

    onOKsubmit = (e) => {
        this.props.onOK()
    }

    render() {
        const { checkvalue, changeDivision, changeTeam, division, modalTitle, onDivisionBack, onCancel, addDivision, addGrade, removegrade, changegrade, removeDivision } = this.props
        return (
            <div style={{ backgroundColor: "red" }}>
                <Modal
                    {...this.props}
                    className="add-membership-type-modal modalFooter"
                    title={modalTitle}
                    visible={this.props.visible}
                    onCancel={onCancel}
                    okText={AppConstants.save}
                    cancelButtonProps={{ style: { position: "absolute", left: 15 } }}
                    footer={
                        <div style={{ display: "none" }} />
                    }
                >
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.onOKsubmit}
                        onFinishFailed={({ errorFields }) => this.formRef.current.scrollToField(errorFields[0].name)}
                        noValidate="noValidate"
                    >
                        <div>
                            <div className="inside-container-view mt-0">
                                {division.map((item, index) => (
                                    <div className="row" key={"divisionValue" + index}>
                                        <div className="col-sm-4 pl-4 pb-2 division">
                                            <Form.Item name={`division${index}`} rules={[{ required: true, message: ValidationConstants.divisionField }]}>
                                                <InputWithHead
                                                    heading={index == 0 ? AppConstants.division : " "}
                                                    placeholder="Enter division"
                                                    // value={item.division}
                                                    onChange={(e) => changeDivision(index, e)}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="col-sm-7">
                                            {item.grades.map((gradeItem, gradeIndex) => (
                                                <div className="row" key={"gradeValue" + gradeIndex}>
                                                    <div className="col-sm pl-4 pb-2 division" style={{ display: "flex" }}>
                                                        <Form.Item name={`grade${index}${gradeIndex}`} rules={[{ required: gradeIndex >= 1, message: ValidationConstants.gradeField }]}>
                                                            <InputWithHead
                                                                heading={index == 0 && gradeIndex == 0 ? AppConstants.grade : " "}
                                                                placeholder={"Enter grade"}
                                                                // value={gradeItem.grade}
                                                                onChange={(e) => changegrade(index, gradeIndex, e)}
                                                            />
                                                        </Form.Item>
                                                        {item.grades.length > 1 && (
                                                            <span
                                                                className="user-remove-btn pl-2"
                                                                onClick={() => { removegrade(index, gradeIndex); this.valueupdate() }}
                                                                style={{ cursor: 'pointer', display: 'flex', position: 'relative', justifyContent: "center", alignItems: 'center', paddingTop: 30 }}
                                                            >
                                                                <img
                                                                    className="dot-image"
                                                                    src={AppImages.redCross}
                                                                    alt=""
                                                                    width="16"
                                                                    height="16"
                                                                />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="col-sm pl-4 pb-2 pr-0">
                                                        <InputWithHead
                                                            heading={index == 0 && gradeIndex == 0 ? AppConstants.numbersOfTeams : " "}
                                                        />
                                                        <Form.Item name={`team${index}${gradeIndex}`} rules={[{ required: true, message: ValidationConstants.SelectNumberTeam }]}>
                                                            <InputNumber
                                                                className="quick_comp_ant_number"
                                                                type="number"
                                                                style={{ width: 100 }}
                                                                // value={gradeItem.team}
                                                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                onChange={(e) => changeTeam(index, gradeIndex, e)}
                                                                placeholder="0"
                                                                min={0}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                            ))}
                                            <span className="input-heading-add-another pointer" onClick={() => { item.grades[0].gradeName.length > 0 && addGrade(index); this.valueupdate() }}> + {AppConstants.addGrade}</span>
                                        </div>
                                        {division.length > 1 && (
                                            <div className="col-sm-1 delete-image-timeSlot-view" onClick={() => { removeDivision(index); this.valueupdate() }}>
                                                <a className="transfer-image-view">
                                                    <span className="user-remove-btn">
                                                        <i className="fa fa-trash-o" aria-hidden="true" />
                                                    </span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <span className="input-heading-add-another pointer" onClick={() => { addDivision(); this.valueupdate() }}> + {AppConstants.addDivisions}</span>
                            </div>

                            <div className="row">
                                <div className="col-sm" style={{ display: "flex", width: '100%', paddingTop: 10 }}>
                                    <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-start" }}>
                                        <Button className="cancelBtnWidth" type="cancel-button" onClick={onDivisionBack} style={{ marginRight: '20px' }}>
                                            {AppConstants.back}
                                        </Button>
                                    </div>
                                    <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-end" }}>
                                        <Button className="publish-button" type="primary" htmlType="submit">
                                            {AppConstants.save}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default DivisionGradeModal;
