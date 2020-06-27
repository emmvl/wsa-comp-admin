import React from 'react';
import { Input, Modal, TimePicker, Select } from 'antd';
import Loader from "./loader"
import InputWithHead from "./InputWithHead"
import moment from 'moment'
import AppConstants from "../themes/appConstants"
import AppImages from "../themes/appImages"
const { TextArea } = Input;
const { Option } = Select
class TimeSlotModal extends React.Component {
    render() {
        const { weekDays, timeslots, modalTitle, timeSlotOK, onCancel, addTimeSlot, addStartTime, removetimeSlotDay, changeDay, removeStartTime, UpdateTimeSlotsDataManual } = this.props
        return (
            <div style={{ backgroundColor: "red" }}>
                <Modal
                    {...this.props}
                    className="add-membership-type-modal"
                    title={modalTitle}
                    visible={this.props.visible}
                    onOk={timeSlotOK}
                    onCancel={onCancel}
                    okText={AppConstants.save}
                    cancelButtonProps={{ style: { position: "absolute", left: 15 } }}


                >
                    <div className="inside-container-view">
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
                </Modal >
            </div >
        )
    }
}


export default TimeSlotModal;