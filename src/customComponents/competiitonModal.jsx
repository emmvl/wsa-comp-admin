import React from 'react';
import { Input, Modal, TimePicker, Select } from 'antd';
import Loader from "./loader"
import InputWithHead from "./InputWithHead"
import moment from 'moment'
import AppConstants from "../themes/appConstants"
import AppImages from "../themes/appImages"

const { Option } = Select
class CompetitionModal extends React.Component {
    render() {
        const { modalTitle, handleOK, onCancel, competitionChange, competitionName } = this.props
        return (
            <div style={{ backgroundColor: "red" }}>
                <Modal
                    {...this.props}
                    className="add-membership-type-modal"
                    title={modalTitle}
                    visible={this.props.visible}
                    onOk={handleOK}
                    onCancel={onCancel}>
                    <div style={{ display: 'flex' }}>
                        < span style={{ fontSize: 16 }} className={`comment-heading`}>{'"Enter competition Name"'} {" "} {'or'}{" "}   {'Select an existing competition'}   </span>
                    </div>
                    < div className="col-sm pl-0 pb-2">
                        <InputWithHead
                            heading={"Competition Name"}
                            placeholder={"Enter competition Name"}
                            onChange={(e) => competitionChange(e)}
                            value={competitionName}
                        ></InputWithHead>
                    </div>

                </Modal >
            </div >
        )
    }
}


export default CompetitionModal;