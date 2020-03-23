import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Select, Form, Modal ,Checkbox, message} from 'antd';
import './user.css';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from 'react-router-dom';
import AppImages from "../../themes/appImages"
import { bindActionCreators } from "redux";
import history from "../../util/history";
import { connect } from 'react-redux';
import {getAffiliateToOrganisationAction,saveAffiliateAction,updateOrgAffiliateAction,
    getUreAction, getRoleAction, getAffiliateOurOrganisationIdAction} from 
                "../../store/actions/userAction/userAction";
import ValidationConstants from "../../themes/validationConstant";
import { getCommonRefData } from '../../store/actions/commonAction/commonAction';
import { getUserId, getOrganisationData } from "../../util/sessionStorage";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const phoneRegExp = /^((\\+[1,9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

class UserOurOragnization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData().organisationUniqueKey,
            loggedInuserOrgTypeRefId: 0,
            loading: false,
            buttonPressed: "",
            getDataLoading: false,
            deleteModalVisible: false,
            currentIndex: 0,
            image: null

        }
        this.props.getCommonRefData();
        this.props.getRoleAction();
        //this.props.getUreAction();
      
       
        //this.addContact();
    }

    componentDidMount(){
        console.log("Component Did mount");
        this.referenceCalls(this.state.organisationId);
        this.apiCalls(this.state.organisationId);
    }
    componentDidUpdate(nextProps){
        console.log("Component componentDidUpdate");
       let userState = this.props.userState;
       let affiliateTo = this.props.userState.affiliateTo;
        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({
                    loading: false,
                })
            }
            if (this.state.buttonPressed == "save") {
                history.push('/userAffiliatesList');
            }
        }
        if (this.state.buttonPressed == "cancel") {
            history.push('/userAffiliatesList');
        }

        if(nextProps.userState.affiliateTo != affiliateTo)
        {
            if(userState.affiliateToOnLoad == false)
            {
                if(affiliateTo.organisationName != "" && affiliateTo.organisationTypeRefId!= 0)
                {
                    this.setState({
                    loggedInuserOrgTypeRefId: affiliateTo.organisationTypeRefId,
                    organisationName: affiliateTo.organisationName
                    })
                }
            }
        }

        if (nextProps.userState !== userState) {
            if (userState.affiliateOurOrgOnLoad === false && this.state.getDataLoading == true) {
                this.setState({
                    getDataLoading: false
                });
                this.setFormFieldValue();
            }
        }
    }
 
    referenceCalls = (organisationId) => {
        this.props.getAffiliateToOrganisationAction(organisationId);
    }

    apiCalls = (organisationId) => {
        this.props.getAffiliateOurOrganisationIdAction(organisationId);
        this.setState({getDataLoading: true});
    }

    setFormFieldValue = () => {
        let affiliate = this.props.userState.affiliateOurOrg;
        console.log("setFormFieldValue" + JSON.stringify(affiliate));
        this.props.form.setFieldsValue({
            name: affiliate.name,
            addressOne: affiliate.street1,
            suburb: affiliate.suburb,
            stateRefId: affiliate.stateRefId,
            postcode: affiliate.postalCode
        })
        let contacts = affiliate.contacts;
        console.log("contacts::" + contacts);
        if(contacts == null || contacts == undefined || contacts == "")
        {
            this.addContact();
        }
        this.updateContactFormFields(contacts);
        // (contacts || []).map((item, index) => {
        //     this.props.form.setFieldsValue({
        //         [`firstName${index}`]: item.firstName,
        //         [`lastName${index}`]: item.lastName,
        //         [`email${index}`]: item.email,
        //     });
        //     let permissions = item.permissions;
        //     permissions.map((perm, permIndex) => {
        //         this.props.form.setFieldsValue({
        //             [`permissions${index}`]: perm.roleId,
        //         });
        //     })
        // })
    }

    onChangeSetValue = (val, key) => {
        this.props.updateOrgAffiliateAction(val,key);
    }

    addContact = () => {
        let affiliate =  this.props.userState.affiliateOurOrg;
        let contacts = affiliate.contacts;
        let obj = {
            userId: 0,
            firstName: '',
            middleName: '',
            lastName:'',
            mobileNumber: '',
            email: '',
            permissions: []
        }
        contacts.push(obj);
        this.props.updateOrgAffiliateAction(contacts,"contacts");

    }

    deleteContact = (index) =>{
        this.setState({deleteModalVisible: true, currentIndex: index});
    }

    removeModalHandle = (key) => {
        if(key == "ok"){
            this.removeContact(this.state.currentIndex);
            this.setState({deleteModalVisible: false});
        }
        else{
            this.setState({deleteModalVisible: false});
        }
    }

    removeContact = (index) => {
        let affiliate =  this.props.userState.affiliateOurOrg;
        let contacts = affiliate.contacts;
        contacts.splice(index,1);
        this.updateContactFormFields(contacts);
        this.props.updateOrgAffiliateAction(contacts,"contacts");
    }

    updateContactFormFields = (contacts) => {
        contacts.map((item, index) => {
            this.props.form.setFieldsValue({
                [`firstName${index}`]: item.firstName,
                [`lastName${index}`]: item.lastName,
                [`email${index}`]: item.email,
            });
            let permissions = item.permissions;
            permissions.map((perm, permIndex) => {
                this.props.form.setFieldsValue({
                    [`permissions${index}`]: perm.roleId,
                });
            })
        })
    }

    onChangeContactSetValue = (val, key, index) => {
        let contacts =  this.props.userState.affiliateOurOrg.contacts;
        let contact = contacts[index];
        if(key == "roles")
        {
            let userRoleEntityId = 0;
            const userRoleEntity = contact.permissions.find(x=>x);
            if(userRoleEntity!= null && userRoleEntity!= undefined && userRoleEntity!= "")
            {
                userRoleEntityId = userRoleEntity.userRoleEntityId;
            }
            let permissions = []; 
            let obj = {
                userRoleEntityId: userRoleEntityId,
                roleId: val
            }
            permissions.push(obj);
            contact.permissions = permissions;

        }else{
            contact[key] = val;
        }
        
        this.props.updateOrgAffiliateAction(contacts,"contacts");
    };
    
    saveAffiliate = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log("err::" + err);
            if(!err)
            {
                console.log("**" + JSON.stringify(this.state.image));
                let affiliate = this.props.userState.affiliateOurOrg;
                
                if(affiliate.contacts == null || affiliate.contacts == undefined || affiliate.contacts.length == 0)
                {
                    message.error(ValidationConstants.affiliateContactRequired[0]);
                }
                else{

                    let data = affiliate.contacts.find(x=>x.permissions.find(y=> y.roleId == 2));
                    if(data == undefined || data == null || data == "")
                    {
                        message.error(ValidationConstants.affiliateContactRequired[0]);
                    }
                    else
                    {
                        let contacts = JSON.stringify(affiliate.contacts);

                        let formData = new FormData();
                        
                        if(this.state.image != null){
                            affiliate.organisationLogo = this.state.image;
                            affiliate.organisationLogoId = 0;
                        }
                        formData.append("organisationLogo", this.state.image);
                        formData.append("organisationLogoId", affiliate.organisationLogoId);
                        formData.append("affiliateId", affiliate.affiliateId);
                        formData.append("affiliateOrgId", affiliate.affiliateOrgId)
                        formData.append("organisationTypeRefId", affiliate.organisationTypeRefId)
                        formData.append("affiliatedToOrgId", affiliate.affiliatedToOrgId);
                        formData.append("organisationId", getOrganisationData().organisationUniqueKey);
                        formData.append("name", affiliate.name);
                        formData.append("street1", affiliate.street1);
                        formData.append("street2", affiliate.street2);
                        formData.append("suburb", affiliate.suburb);
                        formData.append("phoneNo", affiliate.phoneNo);
                        formData.append("city", affiliate.city);
                        formData.append("postalCode", affiliate.postalCode);
                        formData.append("stateRefId", affiliate.stateRefId);
                        formData.append("whatIsTheLowestOrgThatCanAddChild", affiliate.whatIsTheLowestOrgThatCanAddChild);
                        formData.append("contacts", contacts);
                        console.log("Req Body ::" + JSON.stringify(affiliate));
                        this.setState({ loading: true });
                        //this.props.saveAffiliateAction(affiliate);
                        this.props.saveAffiliateAction(formData);
                    }
                }
            }
            else{
                message.error(ValidationConstants.requiredMessage);
            }
        });
    }

    setImage = (data) => {
        if (data.files[0] !== undefined) {
            console.log("*****" +JSON.stringify(data.files[0]));
            this.setState({ image: data.files[0]})
            this.props.updateOrgAffiliateAction(URL.createObjectURL(data.files[0]), "logoUrl");
            this.props.updateOrgAffiliateAction(data.files[0], "organisationLogo");
            this.props.updateOrgAffiliateAction(0, "organisationLogoId");
        }
    };

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    logoIsDefaultOnchange = (value, key) => {
        console.log("value::" + value + "Key::"+key );
        this.props.updateOrgAffiliateAction(value, key);
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view" style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }} >
                    <Breadcrumb separator=" > ">

                        <NavLink to="/userAffiliatesList" >
                            <Breadcrumb.Item separator=">" className="breadcrumb-product">{AppConstants.affiliates}</Breadcrumb.Item>
                        </NavLink>
                        {/* <Breadcrumb.Item className="breadcrumb-product">{AppConstants.user}</Breadcrumb.Item> */}
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.ourOrganisation}</Breadcrumb.Item>
                    </Breadcrumb>
                </Header >
            </div>
        )
    }


    ////////form content view
    contentView = (getFieldDecorator) => {
        let affiliateToData = this.props.userState.affiliateTo;
        let affiliate = this.props.userState.affiliateOurOrg;
        const { stateList } = this.props.commonReducerState;
        if(affiliate.organisationTypeRefId === 0){
            if(affiliateToData.organisationTypes!= undefined && affiliateToData.organisationTypes.length > 0)
                affiliate.organisationTypeRefId = affiliateToData.organisationTypes[0].id;
        }

        console.log("affiliate.logoUrl::" + affiliate.logoUrl);
        
        return (
            <div className="content-view pt-4">
                <Form.Item >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: ValidationConstants.nameField[2] }],
                    })(
                        <InputWithHead
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.organisationName}
                            placeholder={AppConstants.organisationName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "name" )}
                            //value={affiliate.name}
                            setFieldsValue={affiliate.name}
                        />
                    )}
                </Form.Item>
                <InputWithHead required={"required-field pb-0 "} heading={AppConstants.organisationLogo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                <label>
                                    <img
                                        src={affiliate.logoUrl == null ? AppImages.circleImage  : affiliate.logoUrl}
                                        alt=""
                                        height="120"
                                        width="120"
                                        style={{ borderRadius: 60 }}
                                        name={'image'}
                                        onError={ev => {
                                            ev.target.src = AppImages.circleImage;
                                        }}
                                    />
                                </label>
                            </div>
                            <input
                                type="file"
                                id="user-pic"
                                style={{ display: 'none' }}
                                onChange={(evt) => this.setImage(evt.target)}
                            />

                        </div>
                        <div
                            className="col-sm"
                            style={{ display: "flex", justifyContent: 'center', alignItems: 'flex-start', flexDirection: "column", }}
                        >
                            <Checkbox
                                className="single-checkbox"
                                // defaultChecked={false}
                                checked={affiliate.logoIsDefault}
                                onChange={e =>
                                    this.logoIsDefaultOnchange(e.target.checked, "logoIsDefault")
                                }
                            >
                                {AppConstants.saveAsDefault}
                            </Checkbox>

                            {/* {this.state.isSetDefault == true && <Checkbox
                                className="single-checkbox ml-0"
                                checked={this.state.logoSetDefault}
                                onChange={e =>
                                    this.logoSaveAsDefaultOnchange(e.target.checked, "logoIsDefault")
                                }
                            >
                                {AppConstants.saveAsDefault}
                            </Checkbox>} */}

                        </div>
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.organisationType} />
                    </div>
                    <div className="col-sm" style={{ display: "flex", alignItems: "center" }}>
                        <InputWithHead heading={affiliate.organisationTypeRefName} />
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.affilatedTo} />
                    </div>
                    <div className="col-sm" style={{ display: "flex", alignItems: "center" }}>
                        <InputWithHead heading={affiliate.affiliatedToOrgName} />
                    </div>
                </div>

                <Form.Item >
                    {getFieldDecorator('addressOne', {
                        rules: [{ required: true, message: ValidationConstants.addressField[2] }],
                    })(
                        <InputWithHead required={"required-field pt-0 pb-0"}
                        heading={AppConstants.addressOne}
                        placeholder={AppConstants.addressOne}
                        name={AppConstants.addressOne}
                        onChange={(e) => this.onChangeSetValue(e.target.value, "street1" )} 
                        //value={affiliate.street1}
                        setFieldsValue={affiliate.street1}
                    />
                    )}
                </Form.Item>

                <InputWithHead
                    heading={AppConstants.addressTwo}
                    placeholder={AppConstants.addressTwo}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "street2" )} 
                    value={affiliate.street2}
                />

                <Form.Item >
                    {getFieldDecorator("suburb", {
                        rules: [{ required: true, message: ValidationConstants.suburbField[0] }],
                    })(
                        <InputWithHead
                            required={"required-field pt-3 pb-0"}
                            heading={AppConstants.suburb}
                            placeholder={AppConstants.suburb}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "suburb" )}
                            //value={affiliate.suburb}
                            setFieldsValue={affiliate.suburb}
                        />
                    )}
                </Form.Item>

                <InputWithHead
                    required={"required-field"}
                    heading={AppConstants.state}
                />

                <Form.Item >
                    {getFieldDecorator("stateRefId", {
                        rules: [{ required: true, message: ValidationConstants.stateField[0] }],
                    })(
                        <Select
                            style={{ width: "100%" }}
                            placeholder={AppConstants.select}
                            onChange={(e) => this.onChangeSetValue(e, "stateRefId" )}
                            //value={affiliate.stateRefId}
                            setFieldsValue={affiliate.stateRefId}

                        >
                            {stateList.length > 0 && stateList.map((item) => (
                                < Option value={item.id}> {item.name}</Option>
                            ))
                            }
                        </Select>
                    )}
                </Form.Item>


                <Form.Item >
                    {getFieldDecorator('postcode', {
                        rules: [{ required: true, message: ValidationConstants.postCodeField[0] }],
                    })(
                        <InputWithHead
                            required={"required-field"}
                            heading={AppConstants.postcode}
                            placeholder={AppConstants.postcode}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "postalCode" )} 
                            //value={affiliate.postalCode}
                            setFieldsValue={affiliate.postalCode}
                            maxLength={4}
                        />
                    )}
                </Form.Item>

                <InputWithHead heading={AppConstants.phoneNumber} placeholder={AppConstants.phoneNumber}
                        onChange={(e) => this.onChangeSetValue(e.target.value, "phoneNo" )} 
                        value={affiliate.phoneNo}
                    />
            </div>
        )
    }


    contacts = (getFieldDecorator) => {
        let affiliate = this.props.userState.affiliateOurOrg;
        let roles = this.props.userState.roles.filter(x=>x.applicableToWeb == 1);;
        return (
            <div className="discount-view pt-5">
                <span className="form-heading">{AppConstants.contacts}</span>
                {(affiliate.contacts || []).map((item, index) => (
                <div className="prod-reg-inside-container-view pt-4" key={"Contact" + (index+1)}>
                    <div className="row" >
                        <div className="col-sm" >
                            <span className="user-contact-heading">{AppConstants.contact + (index+1)}</span>
                        </div>
                        <div className="transfer-image-view pointer" onClick={() => this.deleteContact(index)}>
                            <span class="user-remove-btn" ><i class="fa fa-trash-o" aria-hidden="true"></i></span>
                            <span className="user-remove-text">
                                {AppConstants.remove}
                            </span>
                        </div>
                    </div>
    
                    <Form.Item >
                    {getFieldDecorator(`firstName${index}`, {
                        rules: [{ required: true, message: ValidationConstants.nameField[0] }]
                    })(
                        <InputWithHead
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.firstName}
                            placeholder={AppConstants.firstName}
                            onChange={(e) => this.onChangeContactSetValue(e.target.value, "firstName", index )}
                            //value={item.firstName}
                            setFieldsValue={item.firstName}
                        />
                    )}
                    </Form.Item>

                    <InputWithHead heading={AppConstants.middleName}
                        placeholder={AppConstants.middleName} 
                        onChange={(e) => this.onChangeContactSetValue(e.target.value, "middleName", index )}
                        value={item.middleName}
                        />

                 
                    <Form.Item >
                        {getFieldDecorator(`lastName${index}`, {
                            rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                        })(
                        <InputWithHead required={"required-field pt-0 pb-0"}
                        heading={AppConstants.lastName} placeholder={AppConstants.lastName} 
                            onChange={(e) => this.onChangeContactSetValue(e.target.value, "lastName", index )}
                            setFieldsValue={item.lastName}
                            />
                        )}
                    </Form.Item>

                    <Form.Item >
                    {getFieldDecorator(`email${index}`, {
                        rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                    })(
                        <InputWithHead
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.email}
                            placeholder={AppConstants.email}
                            onChange={(e) => this.onChangeContactSetValue(e.target.value, "email", index )}
                            //value={item.email}
                            setFieldsValue={item.email}
                        />
                    )}
                    </Form.Item>
                    
                    <InputWithHead heading={AppConstants.phoneNumber}
                        placeholder={AppConstants.phoneNumber} 
                        onChange={(e) => this.onChangeContactSetValue(e.target.value, "mobileNumber", index )}
                        value={item.mobileNumber}
                        />
  
                    <InputWithHead heading={AppConstants.permissionLevel} />
                    <Form.Item >
                    {getFieldDecorator(`permissions${index}`, {
                        rules: [{ required: true, message: ValidationConstants.rolesField[0] }],
                    })(
                        <Select
                            style={{ width: "100%", paddingRight: 1 }}
                            onChange={(e) => this.onChangeContactSetValue(e, "roles", index )}
                            setFieldsValue={item.roleId}
                            >
                            {(roles || []).map((role, index) => (
                            <Option key={role.id} value={role.id}>{role.description}</Option>
                            ))}
                        </Select>
                     )}
                     </Form.Item>
                </div >
                ))}
                 {this.deleteConfirmModalView()}
                <div className="transfer-image-view mt-2 pointer"  onClick={() => this.addContact()}>
                    <span className="user-remove-text">
                        + {AppConstants.addContact}
                    </span>
                </div>
            </div >
        )
    }

    deleteConfirmModalView = () => {
        return (
           <div>
             <Modal
               title="Affiliate"
               visible={this.state.deleteModalVisible}
               onOk={() => this.removeModalHandle("ok")}
               onCancel={() => this.removeModalHandle("cancel")}>
                 <p>Are you sure you want to remove the contact?.</p>
             </Modal>
           </div>
         );
   }

    ///footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button type="cancel-button" 
                                onClick={() => this.setState({ buttonPressed: "cancel" })}>
                                    {AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}
                                onClick={() => this.setState({ buttonPressed: "save" })}>
                                    {AppConstants.updateAffiliates}
                                </Button>
                            </div>
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
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu={"user"} userSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.saveAffiliate}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView" >
                                {this.contentView(getFieldDecorator)}
                            </div>
                            <div className="formView" >
                                {this.contacts(getFieldDecorator)}
                            </div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getAffiliateToOrganisationAction,
        saveAffiliateAction,
        updateOrgAffiliateAction,
        getAffiliateOurOrganisationIdAction,
        getCommonRefData,
        getUreAction,
        getRoleAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        userState: state.UserState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(UserOurOragnization));
