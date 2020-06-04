import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Select, Form, Modal ,Checkbox, message, Tabs,Table} from 'antd';
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
    getUreAction, getRoleAction, getAffiliateOurOrganisationIdAction,
    getOrganiationPhotoAction, saveOrganiationPhotoAction, deleteOrganiationPhotoAction,
    deleteOrgContact} from 
                "../../store/actions/userAction/userAction";
import ValidationConstants from "../../themes/validationConstant";
import { getCommonRefData, getPhotoTypeAction } from '../../store/actions/commonAction/commonAction';
import { getUserId, getOrganisationData } from "../../util/sessionStorage";
import Loader from '../../customComponents/loader';
import ImageLoader from '../../customComponents/ImageLoader'


const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const phoneRegExp = /^((\\+[1,9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

var _this = null
const columns = [

    {
        dataIndex: 'photoUrl',
        key: 'photoUrl',
        render: (photoUrl, record) => {

            return (
                <div>
                    {_this.state.isEditable && _this.photosRemoveBtnView(record)}
                    {_this.photosImageView(photoUrl, record)}
                </div>
            )
        }
    },
]

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
            image: null,
            isSameUserEmailId: "",
            isSameUserEmailChanged: false,
            organisationTabKey: "1",
            timeout: null,
            orgPhotosImg: null,
            orgPhotosImgSend: null,
            imageError: "",
            tableRecord: null,
            isEditView: false,
            orgPhotoModalVisible: false,
            isEditable: true,
            sourcePage: "AFF"
        }
        _this = this;
        this.props.getCommonRefData();
        this.props.getRoleAction();
        //this.props.getUreAction();
      
       
        //this.addContact();
    }

    async componentDidMount(){
      //  console.log("Component Did mount");
        if(this.props.location.state!= null && this.props.location.state!= undefined){
            let isEditable = this.props.location.state.isEditable;
            let affiliateOrgId = this.props.location.state.affiliateOrgId;
            let sourcePage = this.props.location.state.sourcePage;
           
            await this.setState({organisationId: affiliateOrgId, isEditable: isEditable, sourcePage: sourcePage})
        }
        
        this.referenceCalls(this.state.organisationId);
        this.apiCalls(this.state.organisationId);
    }

    componentDidUpdate(nextProps){
       // console.log("Component componentDidUpdate");
       let userState = this.props.userState;
       let commonState = this.props.commonReducerState;
       let affiliateTo = this.props.userState.affiliateTo;
       let obj = {organisationId: this.state.organisationId}
        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({
                    loading: false,
                })
            }
            if (userState.status == 1 && this.state.buttonPressed == "save") {
                if(this.state.isSameUserEmailChanged){
                    this.logout();
                }
                else{
                    history.push('/userAffiliatesList');
                }
            }
            if (userState.status == 1 && this.state.buttonPressed == "savePhotos") {
               this.setState({isEditView: false, orgPhotosImg: null, orgPhotosImgSend: null});
               
               this.props.getOrganiationPhotoAction(obj);
            }
            if (userState.status == 1 && this.state.buttonPressed == "deletePhotos") {
                this.setState({isEditView: false, orgPhotosImg: null, orgPhotosImgSend: null});
                this.props.getOrganiationPhotoAction(obj);
             }
        }
        if (this.state.buttonPressed == "cancel") {
            if(this.state.sourcePage == "DIR"){
                history.push('/affiliateDirectory');
            }
            else{
                history.push('/userAffiliatesList');
            }
           
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

    logout = async () => {
        await localStorage.clear();
        history.push("/");
      };
 
    referenceCalls = (organisationId) => {
        this.props.getPhotoTypeAction();
        this.props.getAffiliateToOrganisationAction(organisationId);
    }

    apiCalls = (organisationId) => {
        this.props.getAffiliateOurOrganisationIdAction(organisationId);
        this.setState({getDataLoading: true});
    }

    setFormFieldValue = () => {
        let affiliate = this.props.userState.affiliateOurOrg;
        //console.log("setFormFieldValue" + JSON.stringify(affiliate));
        this.props.form.setFieldsValue({
            name: affiliate.name,
            addressOne: affiliate.street1,
            suburb: affiliate.suburb,
            stateRefId: affiliate.stateRefId,
            postcode: affiliate.postalCode
        })
        let contacts = affiliate.contacts;
       // console.log("contacts::" + contacts);
        if(contacts == null || contacts == undefined || contacts == "")
        {
            this.addContact();
        }

        if(contacts!= null && contacts!= undefined)
        {
            this.updateContactFormFields(contacts);
        }
        
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
            isSameUser: true,
            permissions: []
        }
        if(contacts!=undefined && contacts!= null)
        {
            contacts.push(obj);
            this.props.updateOrgAffiliateAction(contacts,"contacts");
        }
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
        if(contacts!= null && contacts!= undefined)
        {
            let contact = contacts[index];
            contacts.splice(index,1);
            this.updateContactFormFields(contacts);
            this.props.updateOrgAffiliateAction(contacts,"contacts");
            let obj = {
                id: contact.userId,
                organisationId: this.state.organisationId
            }
            this.props.deleteOrgContact(obj);
        }
    }

    updateContactFormFields = (contacts) => {
        contacts.map((item, index) => {
            this.props.form.setFieldsValue({
                [`firstName${index}`]: item.firstName,
                [`lastName${index}`]: item.lastName,
                [`email${index}`]: item.email,
            });
            item['isSameUser'] =  getUserId() == item.userId ? true: false;
            if(item.userId == getUserId())
            {
                this.setState({isSameUserEmailId: item.email});
            }
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

        }
        else if(key == "email")
        {
            if(contact.isSameUser && contact.userId!= 0)
            {
                if(val != this.state.isSameUserEmailId)
                {
                    this.setState({isSameUserEmailChanged: true});
                }
                else{
                    this.setState({isSameUserEmailChanged: false});
                }
            }
            contact[key] = val;
        }
        else{
            contact[key] = val;
        }
        
        this.props.updateOrgAffiliateAction(contacts,"contacts");
    };
    
    saveAffiliate = (e) => {
        e.preventDefault();
        let tabKey = this.state.organisationTabKey;
        this.props.form.validateFields((err, values) => {
            console.log("err::" + err);
            if(!err)
            {
                if(tabKey == "1"){
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
                else if (tabKey == "2"){
                    let tableRowData = this.state.tableRecord;
                    let formData = new FormData();
                    formData.append("organisationPhoto", this.state.orgPhotosImgSend);
                    formData.append("organisationPhotoId", tableRowData.id);
                    formData.append("photoTypeRefId", tableRowData.photoTypeRefId);
                    formData.append("photoUrl", tableRowData.photoUrl);
                    formData.append("organisationId",  getOrganisationData().organisationUniqueKey);

                    console.log("&&&&&&& 2222222" + JSON.stringify(tableRowData));
                    console.log("&&&&&&& 2222222" + this.state.orgPhotosImgSend);
                     this.setState({ loading: true });
                     this.props.saveOrganiationPhotoAction(formData);
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

    onSelectPhotos = (data) => {
        const fileInput = document.getElementById('photos-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
       
    }

    setPhotosImage = (data) => {
        if (data.files[0] !== undefined) {
            let tableRow = this.state.tableRecord;
            tableRow.photoUrl = null;
            this.setState({tableRecord: tableRow, orgPhotosImgSend: data.files[0], orgPhotosImg: URL.createObjectURL(data.files[0]) })
        }
    };

    tabCallBack = (key) => {
        this.setState({ organisationTabKey: key})
        if(key == "2"){
            let obj = {organisationId: this.state.organisationId}
            this.setState({isEditView: false});
            this.props.getOrganiationPhotoAction(obj);
        }
    }

    editPhotos = async(record) =>{
        await this.setState({ tableRecord: record, isEditView: true  });

        this.props.form.setFieldsValue({
            photoTypeRefId: record.photoTypeRefId
        })
    }

    removePhoto = () => {
        let obj = this.state.tableRecord;
        obj.photoUrl = null;
        this.setState({ orgPhotosImg: null, orgPhotosImgSend: null, tableRecord: obj })
    }

    deletePhotos = async (record) =>{
        await this.setState({ tableRecord: record, orgPhotoModalVisible: true});
    }

    addPhoto =() =>{
        let obj = {
            id: 0,
            photoTypeRefId: null,
            photoUrl:null
        }
        this.setState({isEditView: true, tableRecord: obj, orgPhotosImg: null, orgPhotosImgSend: null});
    }

    cancelEditView = () =>{
        let obj = {
            id: 0,
            photoTypeRefId: null,
            photoUrl:null
        }

        this.setState({isEditView: false, tableRecord: obj, 
            orgPhotosImg: null, orgPhotosImgSend: null});
    }

    setOrgPhotoValue = (e)=>{
        let obj = this.state.tableRecord;
        obj.photoTypeRefId = e;
        this.setState({tableRecord: obj});
    }

    deleteOrgPhotoModalHandle = (key) => {
        if(key == "ok"){
           let payload = {
               id: this.state.tableRecord.id
           }
           this.setState({ loading: true, buttonPressed: "deletePhotos" });
           this.props.deleteOrganiationPhotoAction(payload);
        }
        
        this.setState({orgPhotoModalVisible: false});
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
                    heading={AppConstants.stateHeading}
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
        let userState = this.props.userState;
        let affiliate = this.props.userState.affiliateOurOrg;
        let roles = this.props.userState.roles.filter(x=>x.applicableToWeb == 1);
        return (
            <div className="discount-view pt-5">
                <span className="form-heading">{AppConstants.contacts}</span>
                {(affiliate.contacts || []).map((item, index) => (
                <div className="prod-reg-inside-container-view pt-4" key={"Contact" + (index+1)}>
                    <div className="row" >
                        <div className="col-sm" >
                            <span className="user-contact-heading">{AppConstants.contact + (index+1)}</span>
                        </div>
                        {(!this.state.isEditable || affiliate.contacts.length == 1) ? null :
                        <div className="transfer-image-view pointer" onClick={() => this.deleteContact(index)}>
                            <span class="user-remove-btn" ><i class="fa fa-trash-o" aria-hidden="true"></i></span>
                            <span className="user-remove-text">
                                {AppConstants.remove}
                            </span>
                        </div>
                        }
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
                            disabled={!item.isSameUser}
                            onChange={(e) => this.onChangeContactSetValue(e.target.value, "email", index )}
                            //value={item.email}
                            setFieldsValue={item.email}
                        />
                    )}
                    </Form.Item>
                    {(item.isSameUser && this.state.isSameUserEmailChanged) ?
                        <div className="same-user-validation"> 
                            {ValidationConstants.emailField[2] }
                        </div>
                     : null}
                    
                    
                    <InputWithHead heading={AppConstants.phoneNumber}
                        placeholder={AppConstants.phoneNumber} 
                        onChange={(e) => this.onChangeContactSetValue(e.target.value, "mobileNumber", index )}
                        value={item.mobileNumber}
                        />
                    {this.state.isEditable && 
                    <div>   
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
                     </div>}
                </div >
                ))}
                 {this.deleteConfirmModalView()}
                 {this.state.isEditable &&
                    <div className="transfer-image-view mt-2 pointer"  onClick={() => this.addContact()}>
                        <span className="user-remove-text">
                            + {AppConstants.addContact}
                        </span>
                    </div>
                }
                {
                    (userState.error && userState.status == 4) ? 
                    <div style={{color:'red'}}>{userState.error.result.data.message}</div> : null
                }
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

   ////// Photos//////
    photosHeaderView = () => {
        return (
            <Header className="comp-venue-courts-header-view" style={{paddingLeft: '4%', paddingRight: '4%', paddingTop: '3%' }} >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.photos}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    {this.state.isEditable && 
                        <div className="col-sm live-form-view-button-container" style={{ display: "flex", justifyContent: "flex-end" }} >
                            <Button className="primary-add-comp-form " type="primary" onClick={() => this.addPhoto()}>{"+" + AppConstants.addPhoto}</Button>
                    </div> }
                </div>
            </Header >
        )
    }

    photosEditHeaderView = () => {
        const id = this.state.tableRecord.id;
        return (
            <Header className="comp-venue-courts-header-view" style={{paddingLeft: '4%', paddingRight: '4%', paddingTop: '3%' }} >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{id!= 0? AppConstants.editPhoto : AppConstants.addPhoto}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }

    photosListView = () =>{
            let { orgPhotosList } = this.props.userState;
            return (
                <div className="content-view">
                    <Table
                        className="home-dashboard-table"
                       // loading={this.props.userState.onLoad == true && true}
                        columns={columns}
                        dataSource={orgPhotosList}
                        showHeader={false}
                        pagination={false} />
                </div>
            )
    }

    photosRemoveBtnView = (record) => {
    return (
        <div className="mb-3">
            {/* <div className="col-sm"> */}
            <div
                className="comp-dashboard-botton-view-mobile"
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <Button onClick={() => this.editPhotos(record)} className="primary-add-comp-form ml-5" type="primary">
                        {AppConstants.edit}
                </Button>
                <Button onClick={() => this.deletePhotos(record)} className="primary-add-comp-form ml-5" type="primary">
                    {AppConstants.remove}
                </Button>
            </div>
        </div>
        // </div>
        );
    };

    photosImageView(photosUrl, record) {
        return (
            <div>
                <div>
                    <ImageLoader
                        className="banner-image"
                        height
                        width
                        borderRadius
                        timeout={this.state.timeout}
                        src={photosUrl} />
                </div>
                <div className="row">
                    <div className="col-sm pt-1">
                        <InputWithHead heading={AppConstants.category}/>
                        <span>{record.photoType}</span>
                    </div>
                </div>
            </div>
        )
    };

    photosAddEditView = (getFieldDecorator) => {
        const photoUrl = this.state.tableRecord!= null ?  this.state.tableRecord.photoUrl : null;
        const {photoTypeData} = this.props.commonReducerState;
        return (
            <div className="content-view pt-2">
                <ImageLoader
                    className="banner-image"
                    height
                    width
                    borderRadius
                    timeout={this.state.timeout}
                    src={photoUrl ? photoUrl : this.state.orgPhotosImg} />
                <div>
                    <div className="row">
                        <div className="col-sm" >
                            <span className="user-contact-heading required-field">{AppConstants.uploadImage}</span>
                            <div onClick={this.onSelectPhotos}>
                            </div>
                            <Form.Item>
                                {getFieldDecorator('photosImage', {
                                    rules: [{ required: photoUrl ? false : true, message: ValidationConstants.organisationPhotoRequired }]
                                })(
                                    <input
                                        required={"pb-0"}
                                        type="file"
                                        id="photos-pic"
                                        onChange={(evt) => {
                                            this.setPhotosImage(evt.target)
                                            this.setState({ timeout: 1000 })
                                            setTimeout(() => {
                                                this.setState({ timeout: null })
                                            }, 1000);
                                        }} />
                                )}
                            </Form.Item>
                            <span className="form-err">{this.state.imageError}</span>
                        </div>
                        <div className="col-sm pt-1">
                            <InputWithHead  heading={AppConstants.category}  required={"required-field"}/>
                            <Form.Item>
                                {getFieldDecorator('photoTypeRefId', {
                                    rules: [{ required: true, message: ValidationConstants.photoTypeRequired }]
                                })(
                                    <Select
                                    style={{ width: "100%", paddingRight: 1 }}
                                    onChange={(e) => this.setOrgPhotoValue(e)}
                                    setFieldsValue={this.state.tableRecord.photoTypeRefId}
                                    >
                                    {(photoTypeData || []).map((photo, index) => (
                                    <Option key={photo.id} value={photo.id}>{photo.description}</Option>
                                    ))}
                                </Select>
                                )}
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    photosEditViewRemoveBtnView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="col-sm">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }}
                    >
                        <Button onClick={() => this.removePhoto()} className="primary-add-comp-form ml-5" type="primary">
                            {AppConstants.remove}
                        </Button>

                    </div>
                </div>
            </div>
        );
    };

    photosEditViewFooterView = (isSubmitting) => {
        let tableRecord = this.state.tableRecord;
        return (
            <div className="fluid-width">
                <div className="footer-view" style={{paddingLeft: '0px', paddingRight: '0px'}}>
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button type="cancel-button" 
                                onClick={() => this.cancelEditView()}>
                                    {AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}
                                onClick={() => this.setState({ buttonPressed: "savePhotos" })}>
                                    {tableRecord.id == 0 ? AppConstants.add : AppConstants.updateAffiliates}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    orgPhotoDeleteConfirmModalView = () => {
        return (
           <div>
             <Modal
               title="Organisation Photos"
               visible={this.state.orgPhotoModalVisible}
               onOk={() => this.deleteOrgPhotoModalHandle("ok")}
               onCancel={() => this.deleteOrgPhotoModalHandle("cancel")}>
                 <p>Are you sure you want to remove the organisation photo?</p>
             </Modal>
           </div>
         );
   }

    //////////////End Photos ///////////////////
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
                        {this.state.isEditable &&
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}
                                onClick={() => this.setState({ buttonPressed: "save" })}>
                                    {AppConstants.updateAffiliates}
                                </Button>
                            </div>
                        </div> }
                    </div>
                </div>
            </div>
        );
    };
    
    render() {
        let userState = this.props.userState;
        const { getFieldDecorator } = this.props.form;
        const photoUrl = this.state.tableRecord!= null ?  this.state.tableRecord.photoUrl : null;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu={"user"} userSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        autocomplete="off"
                        onSubmit={this.saveAffiliate}
                        noValidate="noValidate">
                        <Content>
                            <div className="tab-view">
                            <Tabs activeKey={this.state.organisationTabKey} onChange={this.tabCallBack}>
                                    <TabPane tab={AppConstants.general} key="1">
                                        <div className="tab-formView mt-5" >
                                            {this.contentView(getFieldDecorator)}
                                        </div>
                                        <div className="tab-formView mt-5" >
                                            {this.contacts(getFieldDecorator)}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.photos} key="2">
                                        <div>{AppConstants.orgPhotosText}</div>
                                        <div className="tab-formView mt-5" >
                                           {!this.state.isEditView ? 
                                                <div>
                                                    
                                                    {this.photosHeaderView()}
                                                    {this.photosListView()} 
                                                </div> :
                                                <div>
                                                    {this.photosEditHeaderView()}
                                                    {(photoUrl || this.state.orgPhotosImg) && this.photosEditViewRemoveBtnView()}
                                                    {this.photosAddEditView(getFieldDecorator)}
                                                </div>
                                            }
                                        </div>
                                        {this.state.isEditView ? 
                                            <div>{this.photosEditViewFooterView()}</div> : null
                                        }
                                        {this.orgPhotoDeleteConfirmModalView()}
                                    </TabPane>
                                </Tabs>
                            </div>
                            <Loader visible={userState.onLoad} />
                        </Content>
                        {this.state.organisationTabKey == "1" ? 
                            <Footer>{this.footerView()}</Footer>
                            : null 
                        }
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
        getRoleAction,
        getPhotoTypeAction,
        getOrganiationPhotoAction,
        saveOrganiationPhotoAction,
        deleteOrganiationPhotoAction,
        deleteOrgContact
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
