import React from 'react';
import { Modal, Select } from 'antd';
import AppConstants from '../themes/appConstants';
const { Option } = Select;
class RegistrationWizardModel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstTimeCompId: "manu",
        };
        // this.props.clearYearCompetitionAction()
        // this.props.getCommonRefData()
    }

    render() {
        const { competitionClick, registrationClick, publishStatus, stripeConnectURL, stripeConnected, competitionId, competitionChange, wizardCompetition, heading, placeholder, name, handleBlur, modalTitle, visible, onOK, onCancel, ownnerComment, affilateComment } = this.props
        console.log(publishStatus)
        return (
            <div style={{ backgroundColor: "red" }}>
                <Modal
                    {...this.props}
                    className="add-membership-type-modal"
                    title={modalTitle}
                    visible={this.props.visible}
                    onOk={onOK}
                    onCancel={onCancel}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    okButtonProps={{ style: { display: "none" } }}
                    maskClosable={true}
                >


                    <div className="col-sm pl-0 pb-2">

                        {/* < span style={{ fontFamily: "bold", fontSize: 18, paddingRight: 2 }} className={`comment-heading`}>{AppConstants.competition}{" "}</span> */}
                        <span className="year-select-heading">
                            {AppConstants.competition}:
                                </span>
                        <Select
                            className="year-select"
                            style={{ minWidth: 160 }}
                            onChange={competitionChange}
                            value={competitionId}
                        >
                            {wizardCompetition.length > 0 && wizardCompetition.map((item, index) => {
                                return (
                                    < Option key={"Comp" + index} value={item.competitionId}> {item.competitionName}</Option>
                                );
                            })}
                        </Select>
                    </div>

                    <div className="wizard_div">
                        <div className="row">
                            <div className="col-sm pl-0 pb-2">
                                <div className="col-sm-6 " style={{ display: "flex", justifyContent: 'flex-start' }}>
                                    <span className={`comment-heading`}>
                                        {"Step"}
                                    </span>
                                </div>
                                <div className="col-sm-6" style={{ display: "flex", justifyContent: 'flex-end' }}>
                                    <span className={`comment-heading`}>
                                        {"Status"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!stripeConnected && <div className="col-sm pl-0 pb-2">
                            <div className="col-sm-2 pl-0 pb-2">
                                <span className={`comment-heading`} >
                                    {"1"}{" "}
                                </span>
                            </div>
                            <div className="col-sm pl-0 pb-2">
                                <span className={`comment-heading`}>
                                    {AppConstants.setup} {" "}
                                </span>
                                <a href={stripeConnectURL} class="stripe-connect">
                                    <span className={`comment-heading`} style={{ textDecoration: "underline", cursor: 'pointer' }}>
                                        {AppConstants.setupStripe}
                                    </span>
                                </a>
                            </div>
                        </div>}

                        <div className="col-sm pl-0 pb-2">
                            <div className="col-sm-2 pl-0 pb-2">
                                <span className={`comment-heading`} >
                                    {!stripeConnected ? "2" : "1"}{" "}
                                </span>
                            </div>
                            <div className="col-sm pl-0 pb-2">
                                <span className={`comment-heading`}>
                                    {AppConstants.set} {" "}
                                </span>

                                <span className={`comment-heading`} onClick={competitionClick} style={{ textDecoration: "underline", cursor: 'pointer' }}>
                                    {AppConstants.competitionFees}
                                </span>
                            </div>
                        </div>
                        <div click className="col-sm pl-0 pb-2">
                            <div className="col-sm-2 pl-0 pb-2">
                                <span className={`comment-heading`} >
                                    {!stripeConnected ? "3" : "2"} {" "}
                                </span>
                            </div>
                            <div className="col-sm pl-0 pb-2">
                                <span disabled={publishStatus == 2 ? true : false} className={`comment-heading`}>
                                    {AppConstants.createPublish} {" "}
                                </span>
                                <span onClick={registrationClick} className={`comment-heading`} style={{ textDecoration: "underline", cursor: 'pointer' }}>
                                    {AppConstants.registrationForm}
                                </span>
                            </div>
                        </div>
                    </div>
                </Modal >
            </div >
        )
    }
}


export default RegistrationWizardModel;