import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Input,
    Radio,
    Form
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { userProfileUpdateAction } from '../../store/actions/userAction/userAction'
import ValidationConstants from "../../themes/validationConstant";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { getCommonRefData , countryReferenceAction ,nationalityReferenceAction } from '../../store/actions/commonAction/commonAction';
import { bindActionCreators } from 'redux';
import history from '../../util/history'
import { isArrayNotEmpty, isNullOrEmptyString, captializedString } from '../../util/helpers';
 

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;


class UserProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId:'',
            userRegistrationId:'',
            street1: "",
            street2: "",
            email: '',
            suburb: '',
            state: '',
            firtsName: '',
            lastName: '',
            stateRefId:0,
            postalCode: '',
            mobileNumber:'',
            languages:'',
            nationalityRefId:0,
            countryRefId:0,
            displaySection: "0",
            loadValue: false,
            userData: {},
            titleLabel:"",
        }
        this.props.getCommonRefData();
        this.props.countryReferenceAction();
        this.props.nationalityReferenceAction();

    }

    componentDidMount() {
        
        if(this.props.history.location.state)
        {
            this.state.displaySection=this.props.history.location.state.modulefrom;
            this.state.userData = this.props.history.location.state.userData;
            this.state.street1 = this.state.userData.street1
            this.state.street2 = this.state.userData.street2
            this.state.email = this.state.userData.email
            this.state.suburb = this.state.userData.suburb
            this.state.stateRefId = this.state.userData.stateRefId
            this.state.postalCode = this.state.userData.postalCode
            this.state.mobileNumber = this.state.userData.mobileNumber
            this.state.languages = this.state.userData.languages
            this.state.emergencyContactName = this.state.userData.emergencyContactName
            this.state.emergencyContactNumber = this.state.userData.emergencyContactNumber
            this.state.nationalityRefId = this.state.userData.nationalityRefId
            this.state.countryRefId = this.state.userData.countryRefId
            this.state.firstName= this.state.userData.firstName
            this.state.lastName= this.state.userData.lastName
            console.log("JSON.stringify1::"+JSON.stringify(this.props))
            this.state.loadValue = true;
            
            let titleLabel="";
            if(this.state.displaySection=="1"){
                titleLabel="Edit Address"
            }else if(this.state.displaySection=="2"){
                titleLabel="Edit Primary"
            }else if(this.state.displaySection=="3"){
                titleLabel="Edit Emergency"
            }else if(this.state.displaySection=="4"){
                titleLabel="Edit Other Info"
            }else if(this.state.displaySection=="5"){
                titleLabel="Edit Medical"
            }
            this.state.titleLabel = titleLabel;
        }

     }

     componentDidUpdate(nextProps){
        if(this.state.loadValue)
        {
            this.setFormFieldValue();
            this.state.loadValue = false;
        }
    }

    setFormFieldValue = () => {
        let userData  = this.state.userData;
        this.props.form.setFieldsValue({
            street1: userData.street1,
            street2: userData.street2,
            email: userData.email,
            suburb: userData.suburb,
            state: userData.state,
            stateRefId: userData.stateRefId,
            postalCode: userData.postalCode,
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            languages: userData.languages,
            emergencyContactName: userData.emergencyContactName,
            emergencyContactNumber: userData.emergencyContactNumber,
            nationalityRefId: userData.nationalityRefId,
            countryRefId: userData.countryRefId,
        })
    }

    // setAddressData = (value,key) => {
    //     console.log("Object::"+value)
    //     key=value;
    // }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {this.state.titleLabel}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    addressEdit = (getFieldDecorator) => {
        let userData = this.state.userData
        const { stateList } = this.props.commonReducerState;

        return (
            <div className="pt-0" >
                {/* First and Last name row */}
                <div className='row'>
                    <div className="col-sm" >
                    <Form.Item >
                    {getFieldDecorator('street1', {
                        rules: [{ required: true, message: ValidationConstants.street1}],
                    })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.street1}
                            placeholder={AppConstants.street1}
                            name={'street1'}
                            setFieldsValue={userData.street1}
                            onChange={(e) => {this.state.street1 = e.target.value}}
                            />  
                    )}
                    </Form.Item>
                    </div>
                    <div className="col-sm" >  
                    <Form.Item >
                    {getFieldDecorator('street2', {
                        rules: [{ required: false }],
                    })(  
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.street2}
                            placeholder={AppConstants.street2}
                            name={'street2'}
                            setFieldsValue={userData.street2}
                            onChange={(e) => {this.state.street2 = e.target.value}}
                        />
                    )}
                    </Form.Item>
                    </div>
                </div>

                {/* DOB and Contact No. row */}
                <div className="row" >
                    <div className="col-sm" >
                    <Form.Item >
                    {getFieldDecorator('suburb', {
                        rules: [{ required: true, message: ValidationConstants.suburbField[0]}],
                    })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.suburbField}
                            placeholder={AppConstants.suburbField}
                            name={'suburb'}
                            setFieldsValue={userData.suburb}
                            onChange={(e) => {this.state.suburb = e.target.value}}
                        />
                    )}
                    </Form.Item>
                    </div>
                    <div className="col-sm" >
                        <div style={{paddingTop: "11px", paddingBottom: "9px"}}>
                            <InputWithHead required={"required-field"} heading={AppConstants.state}/>
                        </div>
                        <Form.Item >
                            {getFieldDecorator("stateRefId", {
                                rules: [{ required: true, message: ValidationConstants.stateField[0]}],
                            })(
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    placeholder={AppConstants.select_state}
                                    setFieldsValue={userData.stateRefId}
                                    name={'stateRefId'}
                                    onChange={(e) => {this.state.stateRefId = e}}
                                >
                                    {stateList.length > 0 && stateList.map((item) => (
                                        < Option value={item.id}> {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}
                        </Form.Item> 
                    </div>
                    
                </div>

                {/* PlayerId and Team Selection row */}
                <div className="row" >
                    <div className="col-sm" >
                    <Form.Item >
                    {getFieldDecorator('postalCode', {
                        rules: [{ required: true, message: ValidationConstants.postCodeField[0]}],
                    })(
                        <InputWithHead
                            heading={AppConstants.postCode}
                            placeholder={AppConstants.enterPostCode}
                            name={'postalCode'}
                            setFieldsValue={userData.postalCode}
                            onChange={(e) => {this.state.postalCode = e.target.value}}
                        />
                    )}
                    </Form.Item>
                    </div>
                    <div className="col-sm" >
                    <Form.Item >
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: ValidationConstants.emailField[0]}],
                    })(
                        <InputWithHead
                            heading={AppConstants.emailAdd}
                            placeholder={AppConstants.enterEmail}
                            name={'email'}
                            setFieldsValue={userData.email}
                            onChange={(e) => {this.state.email = e.target.value}}
                        />
                    )}
                    </Form.Item>
                    </div>
                </div>
            </div>
        );
    };


    primaryContactEdit = (getFieldDecorator) => {
        
        let userData = this.state.userData
        const { stateList } = this.props.commonReducerState;
        return (
            <div className="content-view pt-0" >
 
                {/* First and Last name row */}
                <div className='row'>
                    <div className="col-sm" >
                    <Form.Item >
                    {getFieldDecorator('firstName', {
                        rules: [{ required: true, message: ValidationConstants.firstName}],
                        })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.firstName}
                            placeholder={AppConstants.firstName}
                            name={'firstName'}
                            setFieldsValue={userData.firstName}
                            onChange={(e) => {this.state.firstName = e.target.value}}
                        />
                    )}
                    </Form.Item>
                    </div>
                    <div className="col-sm" >
                    <Form.Item >
                    {getFieldDecorator('lastName', {
                        rules: [{ required: false }],
                    })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.lastName}
                            placeholder={AppConstants.lastName}
                            name={'lastName'}
                            setFieldsValue={userData.lastName}
                            onChange={(e) => {this.state.lastName = e.target.value}}

                        />
                    )}
                    </Form.Item>
                    </div>
                </div>

                {/* DOB and Contact No. row */}
                <div className="row" >
                    <div className="col-sm" >
                    <Form.Item >
                    {getFieldDecorator('suburb', {
                        rules: [{ required: true, message: ValidationConstants.suburbField[0]}],
                    })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.suburbField}
                            placeholder={AppConstants.enter_suburbField}
                            name={'suburb'}
                            setFieldsValue={userData.suburb}
                            onChange={(e) => {this.state.suburb = e.target.value}}

                        />
                    )}
                    </Form.Item>
                    </div>
                    <div className="col-sm" >
                    
                        <div style={{paddingTop: "11px", paddingBottom: "9px"}}>
                            <InputWithHead required={"required-field"} heading={AppConstants.state} />
                        </div>
                        <Form.Item >
                            {getFieldDecorator("stateRefId", {
                                rules: [{ required: true, message: ValidationConstants.stateField[0]}],
                            })(
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    placeholder={AppConstants.select_state}
                                    // onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                                    setFieldsValue={userData.stateRefId}
                                    name={'stateRefId'}
                                    onChange={(e) => {this.state.stateRefId = e}}
                                >
                                    {stateList.length > 0 && stateList.map((item) => (
                                        < Option value={item.id}> {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}
                        </Form.Item> 
                    </div>
                </div>

                {/* PlayerId and Team Selection row */}
                <div className="row" >
                    <div className="col-sm" >
                    <Form.Item >
                        {getFieldDecorator('postalCode', {
                            rules: [{ required: true, message: ValidationConstants.postCodeField[0]}],
                        })(
                        <InputWithHead
                            heading={AppConstants.postCode}
                            placeholder={AppConstants.enterPostCode}
                            name={'postalCode'}
                            setFieldsValue={userData.postalCode}
                            onChange={(e) => {this.state.postalCode = e.target.value}}

                        />
                        )}
                    </Form.Item>
                    </div>
                    <div className="col-sm" >
                    <Form.Item >
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: ValidationConstants.emailField[0]}],
                        })(
                        <InputWithHead
                            heading={AppConstants.emailAdd}
                            placeholder={AppConstants.enterEmail}
                            name={'email'}
                            setFieldsValue={userData.email}
                            onChange={(e) => {this.state.email = e.target.value}}

                        />
                        )}
                    </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                    <Form.Item >
                        {getFieldDecorator('mobileNumber', {
                            rules: [{ required: true, message: ValidationConstants.contactField }],
                        })(
                        <InputWithHead
                            heading={AppConstants.phoneNumber}
                            placeholder={AppConstants.enter_phoneNumber}
                            name={'mobileNumber'}
                            setFieldsValue={userData.mobileNumber}
                            onChange={(e) => {this.state.mobileNumber = e.target.value}}

                        />
                        )}
                    </Form.Item>
                    </div>
                </div>
            </div>
        );
    };


    emergencyContactEdit = (getFieldDecorator) => {
        let userData = this.state.userData

        return (
            <div className="content-view pt-0">
 
                {/* First and Last name row */}
                <div className='row'>
                    <div className="col-sm" >
                    <Form.Item >
                        {getFieldDecorator('emergencyContactName', {
                            rules: [{ required: true, message: ValidationConstants.emergencyContactName[0] }],
                        })(
                        <InputWithHead
                            required={"required-field "}
                            heading={AppConstants.emergencyContactName}
                            placeholder={AppConstants.emergencyContactName}
                            name={'emergencyContactName'}
                            setFieldsValue={userData.emergencyContactName}
                            onChange={(e) => {this.state.emergencyContactName = e.target.value}}

                        />
                        )}
                    </Form.Item>
                    </div>
                    <div className="col-sm" >
                    <Form.Item >
                        {getFieldDecorator('emergencyContactNumber', {
                            rules: [{ required: true, message: ValidationConstants.emergencyContactNumber[0] }],
                        })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.emergencyContactMobile}
                            placeholder={AppConstants.emergencyContactMobile}
                            name={'emergencyContactNumber'}
                            setFieldsValue={userData.emergencyContactNumber}
                            onChange={(e) => {this.state.emergencyContactNumber = e.target.value}}

                        />
                        )}
                    </Form.Item>
                    </div>
                </div>
            </div>
        );
    };


    otherInfoEdit = (getFieldDecorator) => {
        let userData = this.state.userData
        console.log("new data::"+JSON.stringify(this.state.userData))
        const { countryList, nationalityList} = this.props.commonReducerState;

        return (
            <div className="content-view pt-0">
                <div className='row'>
                    <div className="col-sm" >
                        <div style={{paddingTop: "11px", paddingBottom: "10px"}}>
                            <InputWithHead heading={AppConstants.childCountry} required={"required-field pb-0"}/>
                        </div>
                        <Form.Item >
                        {getFieldDecorator('countryRefId',{
                                rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                            })(
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.childCountry}
                                    onChange={(e) => {this.state.countryRefId = e}}
                                    setFieldsValue={userData.countryRefId}
                                    name={'countryRefId'}>
                                    {countryList.length > 0 && countryList.map((country, index) => (
                                        < Option key={country.id} value={country.id}> {country.description}</Option>
                                    ))
                                    }
                                </Select>
                                )}
                        </Form.Item> 
                    </div>
                    <div className="col-sm" >
                        <div style={{paddingTop: "11px", paddingBottom: "10px"}}>
                            <InputWithHead heading={AppConstants.nationalityReference}  required={"required-field pb-0"}/>
                        </div>
                        <Form.Item >
                            {getFieldDecorator('nationalityRefId', {
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })(
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder={AppConstants.nationalityReference}
                                    onChange={(e) => {this.state.nationalityRefId = e}}
                                    setFieldsValue={userData.nationalityRefId}
                                    name={"nationalityRefId"}>
                                    {nationalityList.length > 0 && nationalityList.map((nation, index) => (
                                        < Option key={nation.id} value={nation.id}> {nation.description}</Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>

                    </div>
                </div>


                <div className="row" >
                    <div className="col-sm" >
                     <Form.Item >
                        {getFieldDecorator('languages', { 
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })( 
                                <InputWithHead
                                    required={"required-field pb-0"}
                                    heading={AppConstants.childLangSpoken}
                                    placeholder={AppConstants.childLangSpoken}
                                    onChange={(e) => {this.state.languages = e.target.value}}
                                    setFieldsValue={userData.languages}
                                    name={'languages'}
                                />
                             )}
                        </Form.Item> 
                    </div>
                    <div className="col-sm" >
                    </div>
                </div>
            </div>
        );
    };

    medicalEdit = (getFieldDecorator) => {
        // let registrationState = this.props.endUserRegistrationState;
        // let regSetting = registrationState.registrationSettings;
        let userData = this.state.userData

        return (
            <div className="formView pt-5" style={{paddingBottom : "40px"}}>
                 {/* <span className="form-heading"> {AppConstants.additionalInfoReqd} </span>    */}
                 <InputWithHead heading={AppConstants.existingMedConditions}  required={"required-field"}/>
                 <Form.Item>
                    {getFieldDecorator(`existingMedicalCondition`, {
                        rules: [{ required: true, message: ValidationConstants.existingMedicalCondition[0] }],
                    })(
                    <TextArea
                        placeholder={AppConstants.existingMedConditions}
                        // onChange={(e) => {this.state.existingMedicalCondition = e.target.value}}
                        // setFieldsValue={userData.existingMedicalCondition}
                        allowClear
                    />
                    )}
                 </Form.Item>    

                <InputWithHead heading={AppConstants.redularMedicalConditions}  required={"required-field"} />
                <Form.Item>
                    {getFieldDecorator(`regularMedication`, {
                        rules: [{ required: true, message: ValidationConstants.regularMedication[0] }],
                    })(
                    <TextArea
                        placeholder={AppConstants.redularMedicalConditions}
                        // onChange={(e) => {this.state.regularMedication = e.target.value}}
                        // setFieldsValue={userData.regularMedication}            
                        allowClear/>
                    )}
                </Form.Item> 
                <div>
                    <InputWithHead heading={AppConstants.haveDisability} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => {this.state.countryRefId = e.target.value}}
                        // setFieldsValue={userData.countryRefId}
                        >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                </div>
            </div>
        )
    }
    //////form content view
    contentView = (getFieldDecorator) => {

        return (
            <div className="content-view pt-0">
 
            {this.state.displaySection=="1"?
                <div>{this.addressEdit(getFieldDecorator)}</div>
            :null}

            {this.state.displaySection=="2"?
                <div>{this.primaryContactEdit(getFieldDecorator)}</div>
            :null} 

            {this.state.displaySection=="3"?
                <div>{this.emergencyContactEdit(getFieldDecorator)}</div>
            :null} 

            {this.state.displaySection=="4"?
                <div>{this.otherInfoEdit(getFieldDecorator)}</div>
            :null}

            {this.state.displaySection=="5"?
                <div>{this.medicalEdit(getFieldDecorator)}</div>
            :null}

            </div>
        );
    };

    onSaveClick = (e) => {

        let userState = this.props.userState;

        let section="";
        if(this.state.displaySection=="1"){
            section="address"
        }else if(this.state.displaySection=="2"){
            section="primary"
        }else if(this.state.displaySection=="3"){
            section="emergency"
        }else if(this.state.displaySection=="4"){
            section="other"
        }else if(this.state.displaySection=="5"){
            section="medical"
        }
        let obj = {
            section:section,
            userId: this.state.userData.userId,
            userRegistrationId: this.state.userData.userRegistrationId,
            street1: this.state.street1,
            street2: this.state.street2,
            suburb: this.state.suburb,
            postalCode: this.state.postalCode,
            stateRefId: this.state.stateRefId,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            mobileNumber: this.state.mobileNumber,
            languages: this.state.languages,
            emergencyContactName: this.state.emergencyContactName,
            emergencyContactNumber: this.state.emergencyContactNumber,
            nationalityRefId: this.state.nationalityRefId,
            countryRefId: this.state.countryRefId,
        }
        e.preventDefault();
        this.props.form.validateFields((obj) =>
        {
        });

        console.log("obj"+JSON.stringify(obj))
        this.props.userProfileUpdateDataAction(obj);

        if (userState.status == 1) {
            history.push('/userPersonal');
        }

    }


    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                            <NavLink to={{ pathname: `/userPersonal`,state: {userId : this.state.userData.userId,}}} >
                                <Button type="cancel-button">{AppConstants.cancel}</Button>
                            </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Form.Item>
                                    <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
                                        {AppConstants.save}
                                    </Button>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /////main render method
    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} onMenuHeadingClick ={()=>history.push("./userTextualDashboard")}/>
                <InnerHorizontalMenu menu={"user"} userSelectedKey={"5"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.onSaveClick}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                        </Content>

                        <Footer >{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        userProfileUpdateAction,
        getCommonRefData, 
        countryReferenceAction,
        nationalityReferenceAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        commonReducerState: state.CommonReducerState,
        userState: state.UserState,

    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(UserProfileEdit));


