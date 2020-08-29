import React from 'react';
import { Input, Modal, TimePicker, Select, Button, Spin } from 'antd';
import Loader from "./loader"
import InputWithHead from "./InputWithHead"
import moment from 'moment'
import AppConstants from "../themes/appConstants"
import AppImages from "../themes/appImages"
const { TextArea } = Input;
const { Option } = Select
class TimeSlotModal extends React.Component {
    render() {
        const { weekDays, timeslots, modalTitle, timeSlotOK, onCancel, addTimeSlot, addStartTime, removetimeSlotDay, changeDay, removeStartTime, UpdateTimeSlotsDataManual, handleTimeslotNext, onTimslotBack, onTimeslotLoad } = this.props
        return (
            <div style={{ backgroundColor: "red" }}>
                <Modal
                    {...this.props}
                    className="add-membership-type-modal modalFooter"
                    title={modalTitle}
                    visible={this.props.visible}
                    onOk={timeSlotOK}
                    onCancel={onCancel}
                    okText={AppConstants.save}
                    footer={
                        <div style={{ display: "none" }}
                        />
                    }
                >
                    <div className="inside-container-view">
                        <Loader visible={onTimeslotLoad} />
                        {timeslots.length > 0 && timeslots.map((item, index) => {
                            return (
                                < div className="row " key={"timevalue" + index} >
                                    <div className="col-sm">
                                        <InputWithHead heading={index == 0 ? AppConstants.dayOfTheWeek : " "} />
                                        <Select
                                            style={{ width: "70%", minWidth: 100 }}
                                            onChange={(dayOfTheWeek) => changeDay(dayOfTheWeek, index)}
                                            value={item.dayRefId}
                                            placeholder="Select Week Day"
                                        >
                                            {weekDays.length > 0 && weekDays.map((item, index) => (
                                                < Option key={"weekdays" + index} value={item.id}> {item.description}</Option>
                                            ))
                                            }
                                        </Select>
                                    </div>
                                    <div className="col-sm">
                                        {item.startTime.length > 0 && item.startTime.map((timeItem, timeIndex) => {
                                            return (

                                                <div className="row" key={"timevalue" + timeIndex}>
                                                    <div className={"col-sm"} >
                                                        <InputWithHead heading={index == 0 && timeIndex == 0 ? AppConstants.startTime : ' '} />
                                                        <TimePicker
                                                            key={"startTime"}
                                                            style={{ minWidth: 100, }}
                                                            className="comp-venue-time-timepicker"
                                                            onChange={(startTime) => startTime != null && UpdateTimeSlotsDataManual(startTime.format("HH:mm"), index, timeIndex)}
                                                            value={timeItem.startTime != null && moment(timeItem.startTime, "HH:mm")}
                                                            format={"HH:mm"}
                                                        // minuteStep={15}
                                                        />
                                                        {item.startTime.length > 1 &&
                                                            <span className='user-remove-btn pl-2'
                                                                onClick={() => removeStartTime(index, timeIndex)}
                                                                style={{ cursor: 'pointer' }}>
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

                                                </div>
                                            )
                                        })}
                                        <span className='input-heading-add-another' onClick={() => addStartTime(index)} > + {AppConstants.add_TimeSlot}</span>
                                    </div>
                                    {timeslots.length > 1 &&
                                        <div className="col-sm-2 delete-image-timeSlot-view" onClick={() => removetimeSlotDay(index)}>
                                            <a className="transfer-image-view">
                                                <span className="user-remove-btn">
                                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                                </span>
                                            </a>
                                        </div>
                                    }
                                </div>
                            )
                        })}
                        <span className='input-heading-add-another pointer' onClick={addTimeSlot}> + {AppConstants.addAnotherDay}</span>
                    </div>
                    <div className="row">
                        <div className="col-sm" style={{ display: "flex", width: "100%", paddingTop: 10 }}>
                            <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-start" }}>
                                <Button className="cancelBtnWidth" type="cancel-button" onClick={onTimslotBack} style={{ marginRight: '20px' }}
                                >
                                    {AppConstants.back}
                                </Button>
                            </div>
                            <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-end" }}>
                                <Button className="publish-button save-draft-text" type="primary" onClick={() => timeSlotOK()} >
                                    {AppConstants.save}
                                </Button>
                                <Button className="publish-button" type="primary" onClick={() => handleTimeslotNext()} >
                                    {AppConstants.next}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal >
            </div >
        )
    }
}


export default TimeSlotModal;