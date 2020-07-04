import React from 'react';
import { Modal, InputNumber, Form, Button } from 'antd';
import InputWithHead from "./InputWithHead"
import AppConstants from "../themes/appConstants"
import AppImages from "../themes/appImages"
import ValidationConstants from '../themes/validationConstant';
import { captializedString } from "../util/helpers"

class DivisionGradeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            divisionState: true
        }
    }

    componentDidUpdate() {
        if (this.props.visible === true && this.state.divisionState === true) {
            this.setState({ divisionState: false })
            this.setFieldValues()
        }
        if (this.props.visible === false && this.state.divisionState === false) {
            this.setState({ divisionState: true })
        }
    }

    setFieldValues
        = () => {
            let division = this.props.division
            division.length > 0 && division.map((item, index) => {
                let division = `division${index}`
                this.props.form.setFieldsValue({
                    [division]: item.divisionName,
                })
                let grade = item.grades
                grade.length > 0 && grade.map((gradeItem, gradeIndex) => {
                    let grade = `grade${index}${gradeIndex}`
                    let team = `team${index}${gradeIndex}`
                    this.props.form.setFieldsValue({
                        [grade]: gradeItem.gradeName,
                        [team]: gradeItem.noOfTeams
                    })
                })
            })
        }

    valueupdate = () => {
        setTimeout(() => {
            this.setFieldValues()
        }, 500);
    }

    onOKsubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.onOK()
            }
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { fieldDecorator, checkvalue, changeDivision, changeTeam, division, modalTitle, onOK, onCancel, addDivision, addGrade, removegrade, changegrade, removeDivision } = this.props
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
                        <div style={{ display: "none" }}
                        />
                    }

                >

                    <Form
                        autoComplete="off"
                        onSubmit={this.onOKsubmit}
                        noValidate="noValidate">
                        <div >
                            <div className="inside-container-view mt-0">
                                {division.length > 0 && division.map((item, index) => {
                                    return (
                                        < div className="row " key={"divisionValue" + index}>
                                            < div className="col-sm-4 pl-4 pb-2 division"  >
                                                <Form.Item
                                                >
                                                    {getFieldDecorator(`division${index}`, {
                                                        normalize: (input) => captializedString(input),
                                                        rules: [{ required: true, message: ValidationConstants.divisionField },
                                                        ],
                                                    })(
                                                        <InputWithHead
                                                            heading={index == 0 ? AppConstants.division : " "}
                                                            placeholder={"Enter division"}
                                                            // value={item.division}
                                                            onChange={(e) => changeDivision(index, e)}
                                                        ></InputWithHead>
                                                    )}
                                                </Form.Item>
                                            </div>
                                            <div className="col-sm-7">
                                                {item.grades.length > 0 && item.grades.map((gradeItem, gradeIndex) => {
                                                    return (
                                                        < div className="row " key={"gradeValue" + gradeIndex} >
                                                            < div className="col-sm pl-4 pb-2 division" style={{ display: "flex" }}>
                                                                <Form.Item
                                                                >
                                                                    {getFieldDecorator(`grade${index}${gradeIndex}`, {
                                                                        normalize: (input) => captializedString(input), rules: [{ required: gradeIndex >= 1 ? true : false, message: ValidationConstants.gradeField },
                                                                        ],
                                                                    })(
                                                                        <InputWithHead
                                                                            heading={index == 0 && gradeIndex == 0 ? AppConstants.grade : " "}
                                                                            placeholder={"Enter grade"}
                                                                            // value={gradeItem.grade}
                                                                            onChange={(e) => changegrade(index, gradeIndex, e)}
                                                                        ></InputWithHead>

                                                                    )}
                                                                </Form.Item>
                                                                {item.grades.length > 1 &&
                                                                    <span className='user-remove-btn pl-2'
                                                                        onClick={() => { removegrade(index, gradeIndex); this.valueupdate() }}
                                                                        style={{ cursor: 'pointer', display: 'flex', position: 'relative', justifyContent: "center", alignItems: 'center', paddingTop: 30 }}>
                                                                        <img
                                                                            className="dot-image"
                                                                            src={AppImages.redCross}
                                                                            alt=""
                                                                            width="16"
                                                                            height="16"
                                                                        />
                                                                    </span>
                                                                }
                                                            </div>
                                                            < div className="col-sm pl-4 pb-2 pr-0">
                                                                <InputWithHead
                                                                    heading={index == 0 && gradeIndex == 0 ? AppConstants.numbersOfTeams : " "}
                                                                /> <Form.Item
                                                                >
                                                                    {getFieldDecorator(`team${index}${gradeIndex}`, {
                                                                        rules: [{ required: true, message: ValidationConstants.SelectNumberTeam },
                                                                        ],
                                                                    })(
                                                                        <InputNumber
                                                                            type={"number"}
                                                                            style={{ width: 100 }}
                                                                            // value={gradeItem.team}
                                                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                                                            onChange={(e) => changeTeam(index, gradeIndex, e)}
                                                                            placeholder={'0'}
                                                                            min={0}
                                                                        />
                                                                    )}
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                )}
                                                <span className='input-heading-add-another pointer' onClick={() => { item.grades[0].gradeName.length > 0 && addGrade(index); this.valueupdate() }} > + {AppConstants.addgrade}</span>
                                            </div>
                                            {
                                                division.length > 1 &&
                                                <div className="col-sm-1 delete-image-timeSlot-view" onClick={() => { removeDivision(index); this.valueupdate() }}>
                                                    <a className="transfer-image-view">
                                                        <span className="user-remove-btn">
                                                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                                                        </span>
                                                    </a>
                                                </div>
                                            }
                                        </div>
                                    )
                                }
                                )}
                                <span className='input-heading-add-another pointer' onClick={addDivision}> + {AppConstants.addDivisions}</span>
                            </div>

                            <div className="row">
                                <div className="col-sm" style={{ display: "flex", width: "100%", paddingTop: 10 }}>
                                    <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-start" }}>
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
                        </div>
                    </Form>
                </Modal >
            </div >
        )
    }
}
export default (Form.create()(DivisionGradeModal));