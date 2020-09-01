import React, { Component } from "react";
import { Layout, Breadcrumb, Form, Select, Button, Radio } from 'antd';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import history from '../../util/history'
import InputWithHead from "../../customComponents/InputWithHead";
import Loader from '../../customComponents/loader';
import ValidationConstants from "../../themes/validationConstant";
import Tooltip from 'react-png-tooltip'
import {getDeRegisterDataAction,updateDeregistrationData} from '../../store/actions/registrationAction/registrationChangeAction'

const { Header, Footer, Content } = Layout;
const { Option } = Select;
let this_Obj = null;

class DeRegistration extends Component {
    constructor(props) {
        super(props);
        this_Obj = this;
        this.state = {
            registrationOption: 0,
            userId: 0,
            loading: false,
            saveLoad: false
        }
    }

    componentDidMount(){
        let userId = this.props.location.state ? this.props.location.state.userId : null;
        this.setState({userId});
        this.apiCall(userId);
    }

    componentDidUpdate(nextProps){

        let deRegisterState = this.props.deRegistrationState;
        // if(this.state.loading == true && deRegisterState.onDeRegisterLoad == false){
        //     this.setState({loading:false});
        //     this.setFormFields();
        // }
        // if(deRegisterState.reloadFormData == 1){
        //   //  console.log("$$$$$$$$$$$$$4");
        //     this.props.updateDeregistrationData(0,'reloadFormData');
        //     this.setFormFields();
        // }

        if(this.state.saveLoad == true && deRegisterState.onSaveLoad == false){
            history.push({pathname:'/userPersonal', state: {tabKey: "5", userId: this.state.userId}});
        }
    }

    apiCall(userId){
        this.props.getDeRegisterDataAction(userId);
        this.setState({loading: true});
    }

    setFormFields = () => {
        let deRegisterState = this.props.deRegistrationState;
        let saveData = deRegisterState.saveData;
        this.props.form.setFieldsValue({
            [`userId`]:  saveData.userId,
            [`organisationId`]: saveData.organisationId,
            [`email`]:  saveData.email,
            [`mobileNumber`]:  saveData.mobileNumber,
            [`competitionId`]:  saveData.competitionId,
            [`membershipMappingId`]: saveData.membershipMappingId
        });
    }

    goBack = () =>{
        history.push({pathname:'/userPersonal', state: {tabKey: "5", userId: this.state.userId}});
    }

    saveAPIsActionCall = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                let deRegisterState = this.props.deRegistrationState;
                let saveData = deRegisterState.saveData;
                
                this.props.saveDeRegisterDataAction(saveData);
                this.setState({saveLoad: true});
            }
        })
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.registrationChange}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }
    ///checkDeRegistrationOption
    checkDeRegistrationOption = (subItem, selectedOption) => {
        console.log(subItem, selectedOption)
        const { saveData, deRegistionOther } = this.props.deRegistrationState
        if (subItem.id == 5 && selectedOption == 5) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        placeholder={AppConstants.other}
                        value={saveData.deRegisterOther}
                        onChange={(e) => this.props.updateDeregistrationData(e.target.value, "deRegisterOther", 'deRegister')}
                    />
                </div>
            )
        }
    }

    ////checkMainRegistrationOption
    checkMainRegistrationOption = (subItem, selectedOption) => {
        console.log(subItem, selectedOption)
        const {saveData, deRegistionOption } = this.props.deRegistrationState
        if (subItem.id == 1 && selectedOption == 1) {
        } else if (subItem.id == 2 && selectedOption == 2) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        heading={AppConstants.reasonRegisterTitle}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.props.updateDeregistrationData(
                                e.target.value,
                                'reasonTypeRefId',
                                'deRegister'
                            )
                        }
                        value={saveData.reasonTypeRefId}
                    >
                        {(deRegistionOption || []).map(
                            (item, index) => {
                                return (
                                    <div key={"register" + index}>
                                        <Radio value={item.id}>{item.value}</Radio>
                                        {this.checkDeRegistrationOption(
                                            item,
                                            saveData.reasonTypeRefId
                                        )}
                                    </div>
                                )
                            }

                        )}
                    </Radio.Group>

                </div>
            )
        }
    }

    //checkTransferOption
    checkTransferOption = (subItem, selectedOption) => {
        const { saveData, transferOther } = this.props.deRegistrationState
        if (subItem.id == 3 && selectedOption == 3) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        placeholder={AppConstants.other}
                        value={saveData.transafer.transferOther}
                        onChange={(e) => this.props.updateDeregistrationData(e.target.value, "transferOther", 'transfer')}
                    />
                </div>
            )
        }
    }

    ///checkRegistrationOption
    checkRegistrationOption = (subItem, selectedOption) => {
        console.log(subItem, selectedOption)
        const {saveData, DeRegistionMainOption, transferOption } = this.props.deRegistrationState
        if (subItem.id == 1 && selectedOption == 1) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        required={"pt-0"}
                        heading={AppConstants.takenCourtforTraining}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.props.updateDeregistrationData(
                                e.target.value,
                                'deRegistrationOptionId',
                                'deRegister'
                            )
                        }

                        value={saveData.deRegistrationOptionId}
                    >
                        {(DeRegistionMainOption || []).map(
                            (item, index) => {
                                return (
                                    <div key={"register" + index}>
                                        <Radio value={item.id}>{item.value}</Radio>
                                        {this.checkMainRegistrationOption(
                                            item,
                                            saveData.deRegistrationOptionId
                                        )}
                                    </div>
                                )
                            }

                        )}
                    </Radio.Group>

                </div>
            )
        }
        else if (subItem.id == 2 && selectedOption == 2) {
            return (
                <div className="ml-5">
                    <InputWithHead
                        style={{ width: "100%", paddingRight: 1 }}
                        heading={AppConstants.organisationName}
                        placeholder={AppConstants.organisationName}
                        required={"required-field"} 
                        // onChange={(e) => this.onChangeSetParticipantValue(e, "competitionUniqueKey", index)}
                    />

                    <InputWithHead
                        heading={AppConstants.competition_name}
                        required={"required-field"}
                        placeholder={AppConstants.competition_name}
                        style={{ width: "100%", paddingRight: 1 }}
                        // onChange={(e) => this.onChangeSetParticipantValue(e, "competitionUniqueKey", index)}
                    />

                    <InputWithHead
                        required={"pt-3"}
                        heading={AppConstants.reasonForTransfer}
                    />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.props.updateDeregistrationData(
                                e.target.value,
                                'reasonTypeRefId',
                                'transfer'
                            )
                        }
                        value={saveData.transfer.reasonTypeRefId}
                    >
                        {(transferOption || []).map(
                            (item, index) => {
                                return (
                                    <div key={"transferOption" + index}>
                                        <Radio value={item.id}>{item.value}</Radio>
                                        {this.checkTransferOption(
                                            item,
                                            saveData.transfer.reasonTypeRefId
                                        )}
                                    </div>
                                )
                            }

                        )}
                    </Radio.Group>

                </div>
            )
        }

    }


    ////////form content view
    contentView = (getFieldDecorator) => {
        const { saveData,registrationSelection} = this.props.deRegistrationState
        return (
            <div className="content-view pt-5">
                <Form.Item >
                    {getFieldDecorator(`userId`, {
                        rules: [{ required: true, message: ValidationConstants.userNameRequired }],
                    })(
                        <InputWithHead
                            heading={AppConstants.username}
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "userId", "deRegister")}
                            //setFieldsValue={saveData.userId}
                            placeholder={'User Name'}/>
                        
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`organisationId`, {
                        rules: [{ required: true, message: ValidationConstants.organisationName }],
                    })(
                        <InputWithHead
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.organisationName} 
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "organisationId", "deRegister")}
                            //setFieldsValue={saveData.organisationId}
                            placeholder={'Organisation Name'}/>
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`competitionId`, {
                        rules: [{ required: true, message: ValidationConstants.competitionRequired }],
                    })(
                        <InputWithHead
                            heading={AppConstants.competition_name}
                            style={{ width: "100%", paddingRight: 1 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "competitionId", "deRegister")}
                            //setFieldsValue={saveData.competitionId}
                            placeholder={'Competition Name'}/>
                    )}
                </Form.Item>
                <Form.Item >
                    {getFieldDecorator(`membershipMappingId`, {
                        rules: [{ required: true, message: ValidationConstants.pleaseSelectMembershipTypes }],
                    })(
                        <InputWithHead
                            heading={AppConstants.membershipTypes}
                            style={{ width: "100%", paddingRight: 1, marginBottom: 15 }}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "membershipMappingId", "deRegister")}
                            //setFieldsValue={saveData.membershipMappingId}
                            placeholder={AppConstants.membershipTypes}/>
                    )}
                </Form.Item>
                {/* <Form.Item >
                    {getFieldDecorator(`teamId`, {
                        rules: [{ required: true, message: ValidationConstants.teamRequired }],
                    })( */}
                        <InputWithHead
                            heading={AppConstants.teamName}
                            style={{ width: "100%", paddingRight: 1 , marginTop: 15}}
                            required={"required-field pt-0 pb-0"}
                            className="input-inside-table-venue-court team-mem_prod_type"
                            onChange={(e) => this.props.updateDeregistrationData(e, "teamId", "deRegister")}
                            //value={saveData.teamId}
                            placeholder={AppConstants.membershipTypes}/>
                {/* //     )}
                // </Form.Item> */}

                <Form.Item>
                    {getFieldDecorator('mobileNumber', { rules: [{ required: true, message: ValidationConstants.pleaseEnterMobileNumber }] })(
                        <InputWithHead
                            required={"pt-0"}
                            heading={AppConstants.mobileNumber}
                            placeholder={AppConstants.mobileNumber}
                            //setFieldsValue={saveData.mobileNumber}
                            onChange={(e) => this.props.updateDeregistrationData(e.target.value, "mobileNumber", "deRegister")}
                        />
                    )}
                </Form.Item>
                
                <Form.Item  >
                    {getFieldDecorator('email', { rules: [{ required: true, message: ValidationConstants.emailField[0] }] })(
                        <InputWithHead
                            required={"pt-0"}
                            heading={AppConstants.emailAdd}
                            placeholder={AppConstants.emailAdd}
                            //setFieldsValue={saveData.email}
                            onChange={(e) => this.props.updateDeregistrationData(e.target.value, "email")}
                        />
                    )}
                </Form.Item>
                <InputWithHead heading={AppConstants.whatRegistrationChange}/>
                <div>
                    <Radio.Group
                        className="reg-competition-radio"
                        style={{ overflow: "visible" }}
                        onChange={(e) =>
                            this.props.updateDeregistrationData(
                                e.target.value,
                                'regChangeTypeRefId',
                                'deRegister'
                            )}
                        //value={saveData.regChangeTypeRefId}
                    >
                        {(registrationSelection || []).map(
                            (item, index) => {
                                return (
                                    <div key={"register" + index}>
                                        <div className="contextualHelp-RowDirection" >
                                            <Radio value={item.id}>{item.value}</Radio>
                                            <div style={{ marginLeft: -20 }}>
                                                <Tooltip placement='bottom' background="#ff8237">
                                                    <span>{item.helpMsg}</span>
                                                </Tooltip>
                                            </div>
                                        </div>
                                        {this.checkRegistrationOption(
                                            item,
                                            saveData.regChangeTypeRefId
                                        )}
                                    </div>
                                )
                            }
                        )}
                    </Radio.Group>
                </div>

            </div >
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="footer-view">
                <div className="row"> 
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            <Button
                                type="cancel-button"
                                onClick={() => this.goBack()}>{AppConstants.cancel}</Button>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button className="publish-button" type="primary"
                                htmlType="submit">
                                {AppConstants.confirm}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <Layout>
                    <Form
                        onSubmit={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        <Content>
                            {/* <Loader visible={this.props.deRegistrationState.onLoad || 
                            this.props.deRegistrationState.onDeRegisterLoad || 
                            this.props.deRegistrationState.onSaveLoad} /> */}
                            <div className="formView">
                                {this.contentView(getFieldDecorator)}
                            </div>
                        </Content>
                        <Footer>
                            {this.footerView(getFieldDecorator)}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDeRegisterDataAction,
        updateDeregistrationData
    }, dispatch);
}

function mapStatetoProps(state) {
    return {
        deRegistrationState: state.RegistrationChangeState
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(DeRegistration));