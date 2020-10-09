import React from 'react';
import { Modal, DatePicker, Form, Button, Select } from 'antd';
import InputWithHead from "./InputWithHead"
import AppConstants from "../themes/appConstants"
import ValidationConstants from '../themes/validationConstant';

const { Option } = Select;
class CompetitionVenueModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionState: true,
            buttonClicked: ""
        }
    }

    componentDidUpdate() {
        if (this.props.venueVisible === true && this.state.competitionState === true) {
            this.setState({ competitionState: false })
            this.setFieldValues()
        }
        if (this.props.venueVisible === false && this.state.competitionState === false) {
            this.setState({ competitionState: true })
        }
    }

    setFieldValues = () => {
        this.props.form.setFieldsValue({
            selectedVenues: this.props.quickCompetitionState.postSelectedVenues,
        })
    }

    onOKsubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (this.state.buttonClicked == "save") {
                    this.props.handleVenueOK()
                }
                else if (this.state.buttonClicked == "next") {
                    this.props.handleVenueNext()
                }
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { modalTitle, handleVenueOK, onVenueCancel, onVenueBack, appState, onSelectValues, handleSearch, handleVenueNext } = this.props
        return (
            <div style={{ backgroundColor: "red" }}>
                <Modal
                    {...this.props}
                    className="add-membership-type-modal modalFooter"
                    title={modalTitle}
                    visible={this.props.venueVisible}
                    onOk={handleVenueOK}
                    onCancel={onVenueCancel}
                    footer={
                        <div style={{ display: "none" }}
                        />
                    }
                >
                    <Form
                        autoComplete="off"
                        onSubmit={this.onOKsubmit}
                        noValidate="noValidate">

                        <div className="inside-container-view mt-3">
                            <div className="col-sm division" >
                                <InputWithHead required={"required-field pb-0 pt-0 "} heading={AppConstants.venue} />
                                <Form.Item  >
                                    {getFieldDecorator('selectedVenues', { rules: [{ required: true, message: ValidationConstants.pleaseSelectvenue }] })(
                                        <Select
                                            mode="multiple"
                                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                            onChange={(venueSelection) => onSelectValues(venueSelection)}
                                            placeholder={AppConstants.selectVenue}
                                            filterOption={false}
                                            // onBlur={() => console.log("called")}
                                            onSearch={(value) => handleSearch(value)}
                                        >
                                            {appState.venueList.length > 0 && appState.venueList.map((item) => {
                                                return (
                                                    <Option
                                                        key={item.id}
                                                        value={item.id}>
                                                        {item.name}</Option>
                                                )
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm" style={{ display: "flex", width: "100%", paddingTop: 10 }}>
                                <div className="col-sm-6" style={{ display: "flex", width: "50%", justifyContent: "flex-start" }}>
                                    <Button className="cancelBtnWidth" type="cancel-button" onClick={onVenueBack} style={{ marginRight: '20px' }}
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


export default (Form.create()(CompetitionVenueModal));