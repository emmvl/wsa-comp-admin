import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Select, Button, Radio, message } from 'antd';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import history from '../../util/history'
import InputWithHead from "../../customComponents/InputWithHead";
import Loader from '../../customComponents/loader';
import ValidationConstants from "../../themes/validationConstant";
import Tooltip from 'react-png-tooltip'
import {
    saveDeRegisterDataAction,
    updateDeregistrationData,
    getTransferCompetitionsAction,
    getDeRegisterDataAction
} from '../../store/actions/registrationAction/registrationChangeAction'
import { isArrayNotEmpty } from "util/helpers";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class DeRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registrationOption: 0,
            userId: 0,
            loading: false,
            saveLoad: false,
            regData: null,
            personal: null,
            membershipMappingId: null
        }
    }

    componentDidMount() {
        let regData = this.props.location.state ? this.props.location.state.regData : null;
        let personal = this.props.location.state ? this.props.location.state.personal : null;
        if (personal) {
            this.setState({ userId: personal.userId });
        }
        this.setState({ regData, personal });
        let payload = null;
        if(this.props.location.state.sourceFrom == AppConstants.ownRegistration){
            payload = {
                userId: personal.userId,
                teamId: 0,
                registrationId: regData.registrationId,
                competitionId: regData.competitionId,
                organisationId: regData.organisationId,
                division: regData.divisionId,
                membershipMappingId: regData.membershipMappingId
            }
        } else if(this.props.location.state.sourceFrom == AppConstants.teamRegistration){
            payload = {
                userId: 0,
                teamId: regData.teamId,
                registrationId: regData.registrationUniqueKey,
                competitionId: null,
                organisationId: null,
                division: 0,
                membershipMappingId: 0
            }
        } else if(this.props.location.state.sourceFrom == AppConstants.teamMembers){
            payload = {
                userId: regData.userId,
                teamId: regData.teamId,
                registrationId: regData.registrationUniqueKey,
                competitionId: regData.competitionId,
                organisationId: regData.organisationId,
                division: regData.divisionId,
                membershipMappingId: regData.membershipMappingId
            }
        }
        this.apiCall(payload);
    }

    apiCall(payload) {
        this.props.getDeRegisterDataAction(payload);
        this.setState({ loading: true });
    }

    componentDidUpdate(nextProps) {
        let deRegisterState = this.props.deRegistrationState;
        if (this.state.saveLoad && deRegisterState.onSaveLoad == false) {
            this.goBack()
        }
    }
    
    goBack = () => {
        let fromTeamDashboard = this.props.location.state.fromTeamDashboard ? this.props.location.state.fromTeamDashboard : false
        this.updateDeregistrationData(null, 'clear', 'deRegister');
        if(fromTeamDashboard) {
            history.push({pathname: '/teamRegistrations'})
        }
        else{
            history.push({ pathname: '/userPersonal', state: { tabKey: "5", userId: this.state.userId } });
        }
    }

    updateDeregistrationData = (value, key, subKey) => {
        if (key === "regChangeTypeRefId") {
            if (value == 2) {
                this.getTransferOrgData();
            }
        }
        this.props.updateDeregistrationData(value, key, subKey)
    }

    getTransferOrgData = () => {
        let regData = this.state.regData;
        let payload = {
            competitionId: regData.competitionId,
            membershipMappingId: regData.membershipMappingId
        }
        this.props.getTransferCompetitionsAction(payload);
    }

    saveAPIsActionCall = (values) => {
        let deRegisterState = this.props.deRegistrationState;
        let saveData = JSON.parse(JSON.stringify(deRegisterState.saveData));

        let deRegisterData = deRegisterState.deRegisterData

        if (saveData.regChangeTypeRefId == 0 || saveData.regChangeTypeRefId == null) {
            message.config({ duration: 0.9, maxCount: 1 });
            message.error(ValidationConstants.deRegisterChangeTypeRequired);
        } else if(saveData.regChangeTypeRefId == 1 && saveData.deRegistrationOptionId == 2 && saveData.reasonTypeRefId == 0) {
            message.config({ duration: 0.9, maxCount: 1 });
            message.error(ValidationConstants.deRegisterReasonRequired);
        } else if (saveData.regChangeTypeRefId == 2 && saveData.transfer.reasonTypeRefId == 0) {
            message.config({ duration: 0.9, maxCount: 1 });
            message.error(ValidationConstants.transferReasonRequired);
        } else {
            let regData = this.state.regData;
            let personal = this.state.personal;
            if(this.props.location.state.sourceFrom != AppConstants.teamRegistration){
                saveData["isTeam"] = 0;
                saveData["userId"] = deRegisterData.userId;
                saveData["organisationId"] = regData.organisationId;
                saveData["competitionId"] = regData.competitionId;
                saveData["membershipMappingId"] = deRegisterData.membershipMappingId;
                saveData["teamId"] = regData.teamId;
                saveData["divisionId"] = deRegisterData.divisionId;
                saveData["registrationId"] = this.props.location.state.sourceFrom == AppConstants.teamMembers ? regData.registrationUniqueKey : regData.registrationId;
                this.props.saveDeRegisterDataAction(saveData);
                this.setState({ saveLoad: true });
            }else{
                saveData["isTeam"] = 1;
                saveData["userId"] = 0;
                saveData["teamId"] = regData.teamId;
                saveData["registrationId"] = regData.registrationUniqueKey;
                this.props.saveDeRegisterDataAction(saveData);
                this.setState({ saveLoad: true });
            }
        } 
    }

    headerView = () => (
        <Header className="comp-venue-courts-header-view">
            <div className="row">
                <div className="col-sm d-flex align-content-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.registrationChange}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        </Header>
    );

    ///checkDeRegistrationOption
    checkDeRegistrationOption = (subItem, selectedOption) => {
        const {
            saveData,
            // deRegistionOther
        } = this.props.deRegistrationState
        if (subItem.id == 5 && selectedOption == 5) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required="pt-0"
                        placeholder={AppConstants.other}
                        value={saveData.deRegisterOther}
                        onChange={(e) => this.updateDeregistrationData(e.target.value, "deRegisterOther", 'deRegister')}
                    />
                </div>
            );
        }
    }

    ////checkMainRegistrationOption
    checkMainRegistrationOption = (subItem, selectedOption) => {
        const { saveData, deRegistionOption } = this.props.deRegistrationState

        if ((subItem.id == 1 && selectedOption == 1) || (subItem.id == 2 && selectedOption == 2)) {
            return (
                <div className="ml-5 pt-3">
                    <InputWithHead
                        required="pt-0"
                        heading={AppConstants.reasonRegisterTitle}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.updateDeregistrationData(
                                e.target.value,
                                'reasonTypeRefId',
                                'deRegister'
                            )
                        }
                        value={saveData.reasonTypeRefId}
                    >
                        {(deRegistionOption || []).map((item) => (
                            <div key={'reasonType_' + item.id}>
                                <Radio value={item.id}>{item.value}</Radio>
                                {this.checkDeRegistrationOption(item, saveData.reasonTypeRefId)}
                            </div>
                        ))}
                    </Radio.Group>
                </div>
            )
        }
    }

    //checkTransferOption
    checkTransferOption = (subItem, selectedOption) => {
        const {
            saveData,
            // transferOther
        } = this.props.deRegistrationState
        if (subItem.id == 3 && selectedOption == 3) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required="pt-0"
                        placeholder={AppConstants.other}
                        value={saveData.transfer.transferOther}
                        onChange={(e) => this.updateDeregistrationData(e.target.value, "transferOther", 'transfer')}
                    />
                </div>
            )
        }
    }

    ///checkRegistrationOption
    checkRegistrationOption = (subItem, selectedOption) => {
        const {
            saveData,
            DeRegistionMainOption,
            transferOption,
            transferOrganisations,
            transferCompetitions,
        } = this.props.deRegistrationState
        if (subItem.id == 1 && selectedOption == 1) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required="pt-0"
                        heading={AppConstants.takenCourtForTraining}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.updateDeregistrationData(
                                e.target.value,
                                'deRegistrationOptionId',
                                'deRegister'
                            )
                        }
                        value={saveData.deRegistrationOptionId}
                    >
                        {(DeRegistionMainOption || []).map((item) => (
                            <div key={'deRegistrationOption_' + item.id}>
                                <Radio value={item.id}>{item.value}</Radio>
                                {this.checkMainRegistrationOption(item, saveData.deRegistrationOptionId)}
                            </div>
                        ))}
                    </Radio.Group>
                </div>
            )
        } else if (subItem.id == 2 && selectedOption == 2) {
            return (
                <div className="ml-5">
                    <InputWithHead heading={AppConstants.newOrganisationName} required="required-field" />
                    <Form.Item
                        name="transferOrganisationId"
                        rules={[{ required: true, message: ValidationConstants.organisationName }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ paddingRight: 1 }}
                            required="required-field pt-0 pb-0"
                            className="input-inside-table-venue-court team-mem_prod_type w-100"
                            onChange={(e) => this.updateDeregistrationData(e, "organisationId", "transfer")}
                            value={saveData.transfer.organisationId}
                            placeholder="Organisation Name"
                        >
                            {(transferOrganisations || []).map((org) => (
                                <Option key={'organisation_' + org.organisationId} value={org.organisationId}>
                                    {org.organisationName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <InputWithHead heading={AppConstants.newCompetition_name} required="required-field" />
                    <Form.Item
                        name="transferCompetitionId"
                        rules={[{ required: true, message: ValidationConstants.competitionRequired }]}
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ paddingRight: 1 }}
                            required="required-field pt-0 pb-0"
                            className="input-inside-table-venue-court team-mem_prod_type w-100"
                            onChange={(e) => this.updateDeregistrationData(e, "competitionId", "transfer")}
                            value={saveData.transfer.competitionId}
                            placeholder="Competition Name"
                        >
                            {(transferCompetitions || []).map((comp) => (
                                <Option key={'competition_' + comp.competitionId} value={comp.competitionId}>
                                    {comp.competitionName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <InputWithHead required="pt-3" heading={AppConstants.reasonForTransfer} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.updateDeregistrationData(
                                e.target.value,
                                'reasonTypeRefId',
                                'transfer'
                            )
                        }
                        value={saveData.transfer.reasonTypeRefId}
                    >
                        {(transferOption || []).map((item) => (
                            <div key={'reasonType_' + item.id}>
                                <Radio value={item.id}>{item.value}</Radio>
                                {this.checkTransferOption(item, saveData.transfer.reasonTypeRefId)}
                            </div>
                        ))}
                    </Radio.Group>
                </div>
            )
        }
    }

    contentView = () => {
        const { saveData, registrationSelection,deRegisterData } = this.props.deRegistrationState
        let regData = this.state.regData;
        let personal = this.state.personal;
        let sourceFrom = this.props.location.state.sourceFrom
        return (
            <div className="content-view pt-5">
                 {sourceFrom != AppConstants.teamRegistration &&
                    <InputWithHead
                        disabled
                        heading={AppConstants.username}
                        required="pb-1"
                        style={{ paddingRight: 1 }}
                        className="input-inside-table-venue-court team-mem_prod_type w-100"
                        value={deRegisterData ? (deRegisterData.firstName + ' ' + deRegisterData.lastName) : ""}
                        placeholder="User Name"
                    />
                }
                <InputWithHead
                    disabled
                    style={{ paddingRight: 1 }}
                    heading={AppConstants.organisationName}
                    required="pb-1"
                    className="input-inside-table-venue-court team-mem_prod_type w-100"
                    value={deRegisterData ? deRegisterData.organisationName : ''}
                    placeholder="Organisation Name"
                />

                <InputWithHead
                    disabled
                    heading={AppConstants.competition_name}
                    required="pb-1"
                    style={{ paddingRight: 1 }}
                    className="input-inside-table-venue-court team-mem_prod_type w-100"
                    value={deRegisterData ? deRegisterData.competitionName : ''}
                    placeholder="Competition Name"
                />
                {sourceFrom != AppConstants.teamRegistration &&
                    <div>    
                        <InputWithHead
                            disabled
                            heading={AppConstants.membershipProduct}
                            required="pb-1"
                            style={{ paddingRight: 1 }}
                            className="input-inside-table-venue-court team-mem_prod_type w-100"
                            value={(deRegisterData ? deRegisterData.membershipProduct : '') + ' - ' + (deRegisterData ? deRegisterData.membershipType : '')}
                            placeholder={AppConstants.membershipProduct}
                        />  
                    </div>
                }            
                <InputWithHead
                    disabled
                    heading={AppConstants.division}
                    required="pb-1"
                    style={{ paddingRight: 1 }}
                    className="input-inside-table-venue-court team-mem_prod_type w-100"
                    value={deRegisterData ? deRegisterData.divisionName : ''}
                    placeholder={AppConstants.division}
                />

                <InputWithHead
                    disabled
                    heading={AppConstants.teamName}
                    required="pb-1"
                    style={{ paddingRight: 1 }}
                    className="input-inside-table-venue-court team-mem_prod_type w-100"
                    value={deRegisterData ? deRegisterData.teamName : ''}
                    placeholder={AppConstants.teamName}
                />
                {sourceFrom != AppConstants.teamRegistration &&
                    <InputWithHead
                        disabled
                        heading={AppConstants.mobileNumber}
                        required="pb-1"
                        placeholder={AppConstants.mobileNumber}
                        value={deRegisterData ? (deRegisterData.mobileNumber) : ''}
                    />
                }
                {sourceFrom != AppConstants.teamRegistration &&
                    <InputWithHead
                        disabled
                        heading={AppConstants.emailAdd}
                        required="pb-1"
                        placeholder={AppConstants.emailAdd}
                        value={deRegisterData ? (deRegisterData.email) : ''}
                    />
                }

                <InputWithHead heading={AppConstants.whatRegistrationChange} />
                <div>
                    <Radio.Group
                        className="reg-competition-radio"
                        style={{ overflow: "visible" }}
                        onChange={(e) => {
                            this.updateDeregistrationData(e.target.value, 'regChangeTypeRefId', 'deRegister');
                        }}
                        value={saveData.regChangeTypeRefId}
                    >
                        {(registrationSelection || []).map((item) => (
                            <div key={`regChangeType_${item.id}`}>
                                <div className="contextualHelp-RowDirection" style={{alignItems:"center"}}>
                                    <Radio value={item.id}>{item.value}</Radio>
                                    <div className="ml-n20">
                                        <Tooltip placement="bottom">
                                            <span>{item.helpMsg}</span>
                                        </Tooltip>
                                    </div>
                                </div>
                                {this.checkRegistrationOption(item, saveData.regChangeTypeRefId)}
                            </div>
                        ))}
                    </Radio.Group>
                </div>
            </div>
        )
    }

    footerView = () => (
        <div className="footer-view">
            <div className="row">
                <div className="col-sm">
                    <div className="reg-add-save-button">
                        <Button type="cancel-button" onClick={() => this.goBack()}>
                            {AppConstants.cancel}
                        </Button>
                    </div>
                </div>
                <div className="col-sm">
                    <div className="comp-buttons-view">
                        <Button className="publish-button" type="primary" htmlType="submit">
                            {AppConstants.confirm}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <Layout>
                    <Form
                        onFinish={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        <Content>
                            <Loader visible={this.props.deRegistrationState.onSaveLoad} />
                            <div className="formView">
                                {this.contentView()}
                            </div>
                        </Content>
                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        saveDeRegisterDataAction,
        updateDeregistrationData,
        getTransferCompetitionsAction,
        getDeRegisterDataAction
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        deRegistrationState: state.RegistrationChangeState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeRegistration);
