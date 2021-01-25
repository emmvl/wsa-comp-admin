import React, { Component } from "react";
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {
    Layout, Breadcrumb, Button, Select, Form, Modal,
    Checkbox, message, Tabs, Table, Radio, Input
} from 'antd';

import './user.css';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages"
import history from "../../util/history";
import {
    getAffiliateToOrganisationAction, saveAffiliateAction, updateOrgAffiliateAction,
    getUreAction, getRoleAction, getAffiliateOurOrganisationIdAction,
    getOrganisationPhotoAction, saveOrganisationPhotoAction, deleteOrganisationPhotoAction,
    deleteOrgContact, updateCharityValue, updateCharityAction, updateTermsAndConditionAction
} from "../../store/actions/userAction/userAction";
import ValidationConstants from "../../themes/validationConstant";
import { getCommonRefData, getPhotoTypeAction } from '../../store/actions/commonAction/commonAction';
import { getUserId, getOrganisationData } from "../../util/sessionStorage";
import Loader from '../../customComponents/loader';
import ImageLoader from '../../customComponents/ImageLoader'
import { captializedString, isImageFormatValid, isImageSizeValid } from "../../util/helpers"
import PlacesAutocomplete from '../competition/elements/PlaceAutoComplete';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

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

class UserOurOrganization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            loggedInuserOrgTypeRefId: 0,
            loading: false,
            photoLoading: false,
            photoDeleteLoading: false,
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
            sourcePage: "AFF",
            termsAndCondititionFile: null,
            organisationTypeRefId: 0,
            affiliateAddressError: '',
        }
        _this = this;
        this.props.getCommonRefData();
        this.props.getRoleAction();
        this.formRef = React.createRef();
    }

    async componentDidMount() {
        if (this.props.location.state != null && this.props.location.state != undefined) {
            let isEditable = this.props.location.state.isEditable;
            let affiliateOrgId = this.props.location.state.affiliateOrgId;
            let sourcePage = this.props.location.state.sourcePage;
            let organisationTypeRefId = this.props.location.state.organisationTypeRefId;
            await this.setState({
                organisationId: affiliateOrgId,
                isEditable: isEditable, sourcePage: sourcePage,
                organisationTypeRefId: organisationTypeRefId
            })
        }

        this.referenceCalls(this.state.organisationId);
        this.apiCalls(this.state.organisationId);
    }

    componentDidUpdate(nextProps) {
        let userState = this.props.userState;
        let affiliateTo = this.props.userState.affiliateTo;
        let obj = { organisationId: this.state.organisationId }
        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({
                    loading: false,
                })
            }
            if (userState.status == 1 && this.state.buttonPressed === "save") {
                if (this.state.isSameUserEmailChanged) {
                    this.logout();
                } else {
                    // history.push('/userAffiliatesList');
                }
            }
        }

        if (nextProps.userState != userState) {
            if (userState.onSaveOrgPhotoLoad == false && this.state.photoLoading == true) {
                this.setState({
                    isEditView: false, orgPhotosImg: null, orgPhotosImgSend: null, buttonPressed: "",
                    photoLoading: false
                });

                this.props.getOrganisationPhotoAction(obj);
            }
            if (userState.onDeleteOrgPhotoLoad == false && this.state.photoDeleteLoading == true) {
                this.setState({ isEditView: false, orgPhotosImg: null, orgPhotosImgSend: null, buttonPressed: "", photoDeleteLoading: false });
                this.props.getOrganisationPhotoAction(obj);
            }
        }

        if (this.state.buttonPressed === "cancel") {
            if (this.state.sourcePage == "DIR") {
                history.push('/affiliateDirectory');
            } else {
                history.push('/userAffiliatesList');
            }
        }

        if (nextProps.userState.affiliateTo != affiliateTo) {
            if (userState.affiliateToOnLoad == false) {
                if (affiliateTo.organisationName != "" && affiliateTo.organisationTypeRefId != 0) {
                    this.setState({
                        loggedInuserOrgTypeRefId: affiliateTo.organisationTypeRefId,
                        organisationName: affiliateTo.organisationName
                    })
                }
            }
        }

        if (nextProps.userState !== userState) {
            if (userState.affiliateOurOrgOnLoad === false && this.state.getDataLoading) {
                this.setState({
                    getDataLoading: false
                });
                this.setFormFieldValue();
            }
        }
    }

    logout = () => {
        try {
            localStorage.clear();
            history.push("/login");
        } catch (error) {
            console.log("Error" + error);
        }
    };

    referenceCalls = (organisationId) => {
        this.props.getPhotoTypeAction();
        this.props.getAffiliateToOrganisationAction(organisationId);
    }

    apiCalls = (organisationId) => {
        this.props.getAffiliateOurOrganisationIdAction(organisationId);
        this.setState({ getDataLoading: true });
    }

    setFormFieldValue = () => {
        let affiliate = this.props.userState.affiliateOurOrg;
        this.formRef.current.setFieldsValue({
            name: affiliate.name,
            addressOne: affiliate.street1,
            suburb: affiliate.suburb,
            stateRefId: affiliate.stateRefId,
            postcode: affiliate.postalCode,
            orgEmail: affiliate.email
        })

        let contacts = affiliate.contacts;
        if (contacts == null || contacts == undefined || contacts == "") {
            this.addContact();
        }

        if (contacts != null && contacts != undefined) {
            this.updateContactFormFields(contacts);
        }
    }

    onChangeSetValue = (val, key) => {
        this.props.updateOrgAffiliateAction(val, key);
    }

    addContact = () => {
        let affiliate = this.props.userState.affiliateOurOrg;
        let contacts = affiliate.contacts;
        let obj = {
            userId: 0,
            firstName: '',
            middleName: '',
            lastName: '',
            mobileNumber: '',
            email: '',
            isSameUser: true,
            permissions: []
        }
        if (contacts != undefined && contacts != null) {
            contacts.push(obj);
            this.props.updateOrgAffiliateAction(contacts, "contacts");
        }
    }

    deleteContact = (index) => {
        this.setState({ deleteModalVisible: true, currentIndex: index });
    }

    removeModalHandle = (key) => {
        if (key === "ok") {
            this.removeContact(this.state.currentIndex);
            this.setState({ deleteModalVisible: false });
        } else {
            this.setState({ deleteModalVisible: false });
        }
    }

    removeContact = (index) => {
        let affiliate = this.props.userState.affiliateOurOrg;
        let contacts = affiliate.contacts;
        if (contacts != null && contacts != undefined) {
            let contact = contacts[index];
            contacts.splice(index, 1);
            this.updateContactFormFields(contacts);
            this.props.updateOrgAffiliateAction(contacts, "contacts");
            let obj = {
                id: contact.userId,
                organisationId: this.state.organisationId
            }
            this.props.deleteOrgContact(obj);
        }
    }

    updateContactFormFields = (contacts) => {
        contacts.map((item, index) => {
            this.formRef.current.setFieldsValue({
                [`firstName${index}`]: item.firstName,
                [`lastName${index}`]: item.lastName,
                [`email${index}`]: item.email,
            });
            item['isSameUser'] = getUserId() == item.userId;
            if (item.userId == getUserId()) {
                this.setState({ isSameUserEmailId: item.email });
            }
            let permissions = item.permissions;
            permissions.map((perm) => {
                this.formRef.current.setFieldsValue({
                    [`permissions${index}`]: perm.roleId,
                });
            })
        })
    }

    onChangeContactSetValue = (val, key, index) => {
        let contacts = this.props.userState.affiliateOurOrg.contacts;
        let contact = contacts[index];
        if (key == "roles") {
            let userRoleEntityId = 0;
            const userRoleEntity = contact.permissions.find(x => x);
            if (userRoleEntity != null && userRoleEntity != undefined && userRoleEntity != "") {
                userRoleEntityId = userRoleEntity.userRoleEntityId;
            }
            let permissions = [];
            let obj = {
                userRoleEntityId: userRoleEntityId,
                roleId: val
            }
            permissions.push(obj);
            contact.permissions = permissions;
        } else if (key == "email") {
            if (contact.isSameUser && contact.userId != 0) {
                if (val != this.state.isSameUserEmailId) {
                    this.setState({ isSameUserEmailChanged: true });
                } else {
                    this.setState({ isSameUserEmailChanged: false });
                }
            }
            contact[key] = val;
        } else {
            contact[key] = val;
        }

        this.props.updateOrgAffiliateAction(contacts, "contacts");
    };

    setImage = (data) => {
        if (data.files[0] !== undefined) {
            let file = data.files[0]
            let extension = file.name.split('.').pop().toLowerCase();
            let imageSizeValid = isImageSizeValid(file.size)
            let isSuccess = isImageFormatValid(extension);
            if (!isSuccess) {
                message.error(AppConstants.logo_Image_Format);
                return
            }
            if (!imageSizeValid) {
                message.error(AppConstants.logo_Image_Size);
                return
            }
            this.setState({ image: data.files[0] })
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
            let file = data.files[0]
            let extension = file.name.split('.').pop().toLowerCase();
            let imageSizeValid = isImageSizeValid(file.size)
            let isSuccess = isImageFormatValid(extension);
            if (!isSuccess) {
                message.error(AppConstants.logo_Image_Format);
                return
            }
            if (!imageSizeValid) {
                message.error(AppConstants.logo_Image_Size);
                return
            }
            let tableRow = this.state.tableRecord;
            tableRow.photoUrl = null;
            this.setState({ tableRecord: tableRow, orgPhotosImgSend: data.files[0], orgPhotosImg: URL.createObjectURL(data.files[0]), timeout: 2000 })
            setTimeout(() => {
                this.setState({ timeout: null })
            }, 1000);
        }
    };

    tabCallBack = (key) => {
        this.setState({ organisationTabKey: key })
        if (key == "2") {
            let obj = { organisationId: this.state.organisationId }
            this.setState({ isEditView: false });
            this.props.getOrganisationPhotoAction(obj);
        }
    }

    editPhotos = async (record) => {
        await this.setState({ tableRecord: record, isEditView: true });

        this.formRef.current.setFieldsValue({
            photoTypeRefId: record.photoTypeRefId
        })
    }

    removePhoto = () => {
        let obj = this.state.tableRecord;
        obj.photoUrl = null;
        this.setState({ orgPhotosImg: null, orgPhotosImgSend: null, tableRecord: obj })
    }

    deletePhotos = async (record) => {
        await this.setState({ tableRecord: record, orgPhotoModalVisible: true });
    }

    addPhoto = () => {
        try {
            let obj = {
                id: 0,
                photoTypeRefId: null,
                photoUrl: null
            }
            this.setState({ isEditView: true, tableRecord: obj, orgPhotosImg: null, orgPhotosImgSend: null });
        } catch (ex) {
            console.log("Error in addPhoto::" + ex);
        }
    }

    cancelEditView = () => {
        let obj = {
            id: 0,
            photoTypeRefId: null,
            photoUrl: null
        }

        this.setState({
            isEditView: false, tableRecord: obj,
            orgPhotosImg: null, orgPhotosImgSend: null
        });
    }

    setOrgPhotoValue = (e) => {
        let obj = this.state.tableRecord;
        obj.photoTypeRefId = e;
        this.setState({ tableRecord: obj });
    }

    deleteOrgPhotoModalHandle = (key) => {
        if (key === "ok") {
            let payload = {
                id: this.state.tableRecord.id
            }
            this.setState({ photoDeleteLoading: true, buttonPressed: "deletePhotos" });
            this.props.deleteOrganisationPhotoAction(payload);
        }

        this.setState({ orgPhotoModalVisible: false });
    }

    handleForce = data => {
        this.setState({ termsAndCondititionFile: data.target.files[0] })
    };

    onChangesetCharity = (value, index, key) => {
        this.props.updateCharityValue(value, index, key);
    }

    saveAffiliate = (values) => {
        let tabKey = this.state.organisationTabKey;
        if (this.state.affiliateAddressError) {
            message.error(this.state.affiliateAddressError);
            return;
        }
        if (tabKey == "1") {
            let affiliate = this.props.userState.affiliateOurOrg;

            if (affiliate.contacts == null || affiliate.contacts == undefined || affiliate.contacts.length === 0) {
                message.error(ValidationConstants.affiliateContactRequired[0]);
            } else {
                let data = affiliate.contacts.find(x => x.permissions.find(y => y.roleId == 2));
                if (data == undefined || data == null || data == "") {
                    message.error(ValidationConstants.affiliateContactRequired[0]);
                } else {
                    let contacts = JSON.stringify(affiliate.contacts);

                    let formData = new FormData();

                    if (this.state.image != null) {
                        affiliate.organisationLogo = this.state.image;
                        affiliate.organisationLogoId = 0;
                    }
                    // let termsAndConditionsValue = null;
                    // if(affiliate.termsAndConditionsRefId == 1){
                    //     termsAndConditionsValue = affiliate.termsAndConditionsLink;
                    // }
                    // if(this.state.termsAndCondititionFile == null && affiliate.termsAndConditionsRefId == 2){
                    //     termsAndConditionsValue = affiliate.termsAndConditionsFile;
                    // }

                    formData.append("email", affiliate.email ? affiliate.email : '');
                    formData.append("organisationLogo", this.state.image);
                    formData.append("organisationLogoId", affiliate.organisationLogoId);
                    formData.append("affiliateId", affiliate.affiliateId);
                    formData.append("affiliateOrgId", affiliate.affiliateOrgId)
                    formData.append("organisationTypeRefId", affiliate.organisationTypeRefId)
                    formData.append("affiliatedToOrgId", affiliate.affiliatedToOrgId);
                    formData.append("organisationId", getOrganisationData() ? getOrganisationData().organisationUniqueKey : null);
                    formData.append("name", affiliate.name);
                    formData.append("street1", affiliate.street1);
                    formData.append("street2", affiliate.street2);
                    formData.append("suburb", affiliate.suburb);
                    formData.append("phoneNo", affiliate.phoneNo);
                    formData.append("city", affiliate.city);
                    formData.append("postalCode", affiliate.postalCode);
                    formData.append("stateRefId", affiliate.stateRefId);
                    formData.append("whatIsTheLowestOrgThatCanAddChild", affiliate.whatIsTheLowestOrgThatCanAddChild);
                    formData.append("logoIsDefault", affiliate.logoIsDefault ? 1 : 0);
                    formData.append("contacts", contacts);
                    this.setState({ loading: true });
                    this.props.saveAffiliateAction(formData);
                }
            }
        } else if (tabKey == "2") {
            let tableRowData = this.state.tableRecord;
            let formData = new FormData();
            if (this.state.orgPhotosImgSend === null && tableRowData.photoUrl === null) {
                message.error(ValidationConstants.organisationPhotoRequired)
                return
            }
            formData.append("organisationPhoto", this.state.orgPhotosImgSend);
            formData.append("organisationPhotoId", tableRowData.id);
            formData.append("photoTypeRefId", tableRowData.photoTypeRefId);
            formData.append("photoUrl", tableRowData.photoUrl);
            formData.append("organisationId", getOrganisationData() ? getOrganisationData().organisationUniqueKey : null);

            this.setState({ photoLoading: true });
            this.props.saveOrganisationPhotoAction(formData);
        }
    }

    updateTermsAndCondition = () => {
        let affiliate = this.props.userState.affiliateOurOrg;
        let formData = new FormData();
        let termsAndConditionsValue = null;
        if (affiliate.termsAndConditionsRefId == 1) {
            termsAndConditionsValue = affiliate.termsAndConditionsLink;
        }
        if (this.state.termsAndCondititionFile == null && affiliate.termsAndConditionsRefId == 2) {
            termsAndConditionsValue = affiliate.termsAndConditionsFile;
        }
        formData.append("organisationId", getOrganisationData() ? getOrganisationData().organisationUniqueKey : null);
        formData.append("termsAndConditionsRefId", affiliate.termsAndConditionsRefId);
        formData.append("termsAndConditions", termsAndConditionsValue ? termsAndConditionsValue : "");
        formData.append("termsAndCondition", this.state.termsAndCondititionFile ? this.state.termsAndCondititionFile : "");

        this.setState({ loading: true });
        this.props.updateTermsAndConditionAction(formData);
        this.setState({ termsAndCondititionFile: null });
    }

    updateCharity = () => {
        let affiliate = this.props.userState.affiliateOurOrg;
        let charityRoundUpArr = affiliate.charityRoundUp.filter(x => x.isSelected);

        let payload = {
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            charityRoundUp: charityRoundUpArr,
            charity: affiliate.charity
        }
        this.setState({ loading: true });
        this.props.updateCharityAction(payload);
    }

    headerView = () => (
        <div className="header-view">
            <Header className="form-header-view d-flex align-items-center bg-transparent">
                {this.state.sourcePage == "AFF" ? (
                    <Breadcrumb separator=" > ">
                        <NavLink to="/userAffiliatesList">
                            <Breadcrumb.Item separator=" > " className="breadcrumb-product">{AppConstants.affiliates}</Breadcrumb.Item>
                        </NavLink>
                        {/* <Breadcrumb.Item className="breadcrumb-product">{AppConstants.user}</Breadcrumb.Item> */}
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.ourOrganisation}</Breadcrumb.Item>
                    </Breadcrumb>
                ) : (
                        <NavLink to="/affiliatedirectory">
                            <span className="breadcrumb-product">{AppConstants.affiliates}</span>
                        </NavLink>
                    )}
            </Header>
        </div>
    );

    handlePlacesAutocomplete = (data) => {
        const { stateList } = this.props.commonReducerState;
        const address = data;

        if (!address || !address.addressOne || !address.suburb) {
            this.setState({
                affiliateAddressError: ValidationConstants.affiliateAddressDetailError,
            })
        } else {
            this.setState({
                affiliateAddressError: ''
            })
        }

        this.setState({
            affiliateAddress: address,
        });

        const stateRefId = stateList.length > 0 && address.state
            ? stateList.find((state) => state.name === address.state).id
            : null;

        this.formRef.current.setFieldsValue({
            stateRefId,
            addressOne: address.addressOne || null,
            suburb: address.suburb || null,
            postcode: address.postcode || null,
        });

        if (address.addressOne) {
            this.props.updateOrgAffiliateAction(stateRefId, 'stateRefId');
            this.props.updateOrgAffiliateAction(address.addressOne, 'street1');
            this.props.updateOrgAffiliateAction(address.suburb, 'suburb');
            this.props.updateOrgAffiliateAction(address.postcode, 'postalCode');
            this.props.updateOrgAffiliateAction(address.lat, 'lat');
            this.props.updateOrgAffiliateAction(address.lng, 'lng');
        }
    };

    contentView = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        let affiliate = this.props.userState.affiliateOurOrg;
        const { stateList } = this.props.commonReducerState;
        if (affiliate.organisationTypeRefId === 0) {
            if (affiliateToData.organisationTypes != undefined && affiliateToData.organisationTypes.length > 0)
                affiliate.organisationTypeRefId = affiliateToData.organisationTypes[0].id;
        }

        const state = stateList.length > 0 && affiliate.stateRefId
            ? stateList.find((state) => state.id === affiliate.stateRefId).name
            : null;

        let defaultAffiliateAddress = `${affiliate.street1 ? `${affiliate.street1},` : ''
            } ${affiliate.suburb ? `${affiliate.suburb},` : ''
            } ${state ? `${state},` : ''
            } Australia`;

        return (
            <div className="content-view pt-4">
                <Form.Item name='name' rules={[{ required: true, message: ValidationConstants.nameField[2] }]}>
                    <InputWithHead
                        auto_complete="off"
                        required="required-field pt-0"
                        heading={AppConstants.organisationName}
                        placeholder={AppConstants.organisationName}
                        onChange={(e) => this.onChangeSetValue(e.target.value, "name")}
                        disabled={!this.state.isEditable}
                        value={affiliate.name}
                    />
                </Form.Item>
                <InputWithHead required="required-field" heading={AppConstants.organisationLogo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view"
                                onClick={() => this.selectImage()}
                            >
                                <label>
                                    {/* <input
                                        src={affiliate.logoUrl == null ? AppImages.circleImage : affiliate.logoUrl}
                                        // alt=""
                                        height="120"
                                        width="120"
                                        type="image"
                                        disabled={!this.state.isEditable}
                                        style={{ borderRadius: 60, height: 120, widows: 120 }}
                                        name="image"
                                        onError={ev => {
                                            ev.target.src = AppImages.circleImage;
                                        }}
                                    /> */}
                                    <img
                                        src={affiliate.logoUrl == null ? AppImages.circleImage : affiliate.logoUrl}
                                        height={'120'}
                                        width={'120'}
                                        style={{
                                            borderRadius: 60
                                        }}
                                        alt=""
                                    />
                                </label>
                            </div>
                            <input
                                type="file"
                                id="user-pic"
                                className="d-none"
                                onChange={(evt) => this.setImage(evt.target)}
                                onClick={(event) => {
                                    event.target.value = null
                                }}
                            />
                        </div>
                        <div className="col-sm d-flex justify-content-center align-items-start flex-column">
                            <Checkbox
                                className="single-checkbox"
                                // defaultChecked={false}
                                checked={affiliate.logoIsDefault}
                                disabled={!this.state.isEditable}
                                onChange={e =>
                                    this.logoIsDefaultOnchange(e.target.checked, "logoIsDefault")
                                }
                            >
                                {AppConstants.saveAsDefault}
                            </Checkbox>

                            {/* {this.state.isSetDefault && <Checkbox
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
                    <span className="image-size-format-text">
                        {AppConstants.imageSizeFormatText}
                    </span>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.organisationType} />
                    </div>
                    <div className="col-sm d-flex align-items-center">
                        <InputWithHead heading={affiliate.organisationTypeRefName} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.affiliatedTo} />
                    </div>
                    <div className="col-sm d-flex align-items-center">
                        <InputWithHead heading={affiliate.affiliatedToOrgName} />
                    </div>
                </div>

                <Form.Item className="formLineHeight" name="affiliateAddress">
                    <PlacesAutocomplete
                        defaultValue={defaultAffiliateAddress}
                        heading={AppConstants.affiliateAddressAddressSelect}
                        required
                        error={this.state.affiliateAddressError}
                        onSetData={this.handlePlacesAutocomplete}
                    />
                </Form.Item>

                <InputWithHead
                    auto_complete='new-phone'
                    maxLength={10}
                    heading={AppConstants.phoneNumber}
                    placeholder={AppConstants.phoneNumber}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "phoneNo")}
                    value={affiliate.phoneNo}
                    disabled={!this.state.isEditable}
                />

                <InputWithHead
                    heading={AppConstants.email}
                    placeholder={AppConstants.email}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                    value={affiliate.email}
                    disabled={!this.state.isEditable}
                    auto_complete='new-email'
                />
            </div>
        )
    }

    contacts = () => {
        let affiliate = this.props.userState.affiliateOurOrg;
        let roles = this.props.userState.roles.filter(x => x.applicableToWeb == 1);
        return (
            <div className="discount-view pt-5">
                <span className="form-heading">{AppConstants.contacts}</span>
                {(affiliate.contacts || []).map((item, index) => (
                    <div className="prod-reg-inside-container-view pt-4" key={"Contact" + (index + 1)}>
                        <div className="row">
                            <div className="col-sm">
                                <span className="user-contact-heading">{AppConstants.contact + (index + 1)}</span>
                            </div>
                            {(!this.state.isEditable || affiliate.contacts.length === 1) ? null :
                                <div className="transfer-image-view pointer" onClick={() => this.deleteContact(index)}>
                                    <span className="user-remove-btn"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                                    <span className="user-remove-text">
                                        {AppConstants.remove}
                                    </span>
                                </div>
                            }
                        </div>

                        <Form.Item name={`firstName${index}`} rules={[{ required: true, message: ValidationConstants.nameField[0] }]}>
                            <InputWithHead
                                auto_complete='new-firstName'
                                required="required-field"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                onChange={(e) => this.onChangeContactSetValue(e.target.value, "firstName", index)}
                                // value={item.firstName}
                                value={item.firstName}
                                disabled={!this.state.isEditable}
                            />
                        </Form.Item>

                        <InputWithHead
                            heading={AppConstants.middleName}
                            placeholder={AppConstants.middleName}
                            onChange={(e) => this.onChangeContactSetValue(e.target.value, "middleName", index)}
                            value={item.middleName}
                            disabled={!this.state.isEditable}
                            auto_complete='new-middleName'
                        // required="pt-0"
                        />

                        <Form.Item name={`lastName${index}`} rules={[{ required: true, message: ValidationConstants.nameField[1] }]}>
                            <InputWithHead
                                required="required-field "
                                heading={AppConstants.lastName} placeholder={AppConstants.lastName}
                                onChange={(e) => this.onChangeContactSetValue(e.target.value, "lastName", index)}
                                value={item.lastName}
                                disabled={!this.state.isEditable}
                                auto_complete='new-lastName'
                            />
                        </Form.Item>

                        <Form.Item name={`email${index}`} rules={[
                            {
                                required: true,
                                message: ValidationConstants.emailField[0]
                            },
                            {
                                type: "email",
                                pattern: new RegExp(AppConstants.emailExp),
                                message: ValidationConstants.email_validation
                            }
                        ]}>
                            <InputWithHead
                                auto_complete='new-email'
                                required="required-field"
                                heading={AppConstants.email}
                                placeholder={AppConstants.email}
                                disabled={!item.isSameUser || !this.state.isEditable}
                                onChange={(e) => this.onChangeContactSetValue(e.target.value, "email", index)}
                                // value={item.email}
                                value={item.email}
                            />
                        </Form.Item>
                        {(item.isSameUser && this.state.isSameUserEmailChanged) && (
                            <div className="same-user-validation">
                                {ValidationConstants.emailField[2]}
                            </div>
                        )}

                        <InputWithHead
                            heading={AppConstants.phoneNumber}
                            placeholder={AppConstants.phoneNumber}
                            onChange={(e) => this.onChangeContactSetValue(e.target.value, "mobileNumber", index)}
                            value={item.mobileNumber}
                            maxLength={10}
                            disabled={!this.state.isEditable}
                            auto_complete='new-phoneNumber'
                        />
                        {this.state.isEditable && (
                            <div>
                                <InputWithHead
                                    heading={AppConstants.permissionLevel}
                                    conceptulHelp
                                    conceptulHelpMsg={AppConstants.ourOrgPermissionLevelMsg}
                                    marginTop={5}
                                />
                                <Form.Item name={`permissions${index}`} rules={[{ required: true, message: ValidationConstants.rolesField[0] }]}>
                                    <Select
                                        style={{ width: '100%', paddingRight: 1 }}
                                        onChange={(e) => this.onChangeContactSetValue(e, "roles", index)}
                                        value={item.roleId}
                                    >
                                        {(roles || []).map((role) => (
                                            <Option key={'role_' + role.id} value={role.id}>{role.description}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        )}
                    </div>
                ))}
                {this.deleteConfirmModalView()}
                {this.state.isEditable && (
                    <div className="transfer-image-view mt-2 pointer" onClick={() => this.addContact()}>
                        <span className="user-remove-text">
                            + {AppConstants.addContact}
                        </span>
                    </div>
                )}
                {/* {(userState.error && userState.status == 4) && (
                    <div style={{ color: 'red' }}>{userState.error.result.data.message}</div>
                )} */}
            </div>
        )
    }

    termsAndConditionsView = () => {
        let affiliate = this.props.userState.affiliateOurOrg;
        return (
            <div className="discount-view pt-5">
                <span className="form-heading">{AppConstants.termsAndConditions}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onChangeSetValue(e.target.value, "termsAndConditionsRefId")}
                    value={affiliate.termsAndConditionsRefId}
                >
                    <Radio value={2}>{AppConstants.fileUploadPdf}</Radio>
                    {affiliate.termsAndConditionsRefId === 2 && (
                        <div className="pl-5 pb-5 pt-4">
                            <label className="pt-2">
                                <input
                                    className="pt-2 pb-2 pointer"
                                    type="file"
                                    id="teamImport"
                                    ref={(input) => { this.filesInput = input }}
                                    name="file"
                                    // icon="file text outline"
                                    // iconPosition="left"
                                    // label="Upload PDF"
                                    // labelPosition="right"
                                    placeholder="UploadPDF..."
                                    onChange={this.handleForce}
                                    accept=".pdf"
                                />
                            </label>
                            <div className="pt-4">
                                <div className="row">
                                    <div className="col-sm" style={{ whiteSpace: 'break-spaces' }}>
                                        <a className="user-reg-link" href={affiliate.termsAndConditions} target='_blank' rel="noopener noreferrer">
                                            {affiliate.termsAndConditionsFile}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <Radio value={1}>{AppConstants.link}</Radio>
                    {affiliate.termsAndConditionsRefId === 1 && (
                        <div className=" pl-5 pb-5">
                            <InputWithHead
                                auto_complete='new-termsAndConditions'
                                placeholder={AppConstants.termsAndConditions}
                                value={affiliate.termsAndConditionsLink}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "termsAndConditionsLink")}
                            />
                        </div>
                    )}
                </Radio.Group>
            </div>
        )
    }

    deleteConfirmModalView = () => (
        <div>
            <Modal
                title="Affiliate"
                visible={this.state.deleteModalVisible}
                onOk={() => this.removeModalHandle('ok')}
                onCancel={() => this.removeModalHandle('cancel')}
            >
                <p>Are you sure you want to remove the contact?.</p>
            </Modal>
        </div>
    );

    ////// Photos//////
    photosHeaderView = () => (
        <Header className="comp-venue-courts-header-view" style={{ paddingLeft: '4%', paddingRight: '4%', paddingTop: '3%' }}>
            <div className="row">
                <div className="col-sm d-flex align-content-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.photos}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                {this.state.isEditable && (
                    <div className="col-sm live-form-view-button-container d-flex justify-content-end">
                        <Button className="primary-add-comp-form" type="primary" onClick={() => this.addPhoto()}>
                            {`+ ${AppConstants.addPhoto}`}
                        </Button>
                    </div>
                )}
            </div>
        </Header>
    );

    photosEditHeaderView = () => {
        const id = this.state.tableRecord.id;
        return (
            <Header className="comp-venue-courts-header-view" style={{ paddingLeft: '4%', paddingRight: '4%', paddingTop: '3%' }}>
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{id != 0 ? AppConstants.editPhoto : AppConstants.addPhoto}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        )
    }

    photosListView = () => {
        let { orgPhotosList } = this.props.userState;
        return (
            <div className="content-view">
                <Table
                    className="home-dashboard-table"
                    // loading={this.props.userState.onLoad && true}
                    columns={columns}
                    dataSource={orgPhotosList}
                    showHeader={false}
                    pagination={false}
                />
            </div>
        )
    }

    photosRemoveBtnView = (record) => {
        return (
            <div className="mb-3">
                {/* <div className="col-sm"> */}
                <div className="comp-dashboard-botton-view-mobile d-flex align-items-center justify-content-end w-100">
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
                        src={photosUrl}
                    />
                </div>
                <div className="row">
                    <div className="col-sm pt-1">
                        <InputWithHead heading={AppConstants.category} />
                        <span>{record.photoType}</span>
                    </div>
                </div>
            </div>
        )
    };

    photosAddEditView = () => {
        try {
            const photoUrl = this.state.tableRecord != null ? this.state.tableRecord.photoUrl : null;
            const { photoTypeData } = this.props.commonReducerState;
            return (
                <div className="content-view pt-2">
                    <ImageLoader
                        className="banner-image"
                        height
                        width
                        borderRadius
                        timeout={this.state.timeout}
                        src={photoUrl ? photoUrl : this.state.orgPhotosImg}
                    />
                    <div>
                        <div className="row">
                            <div className="col-sm">
                                <span className="user-contact-heading required-field">{AppConstants.uploadImage}</span>
                                <div onClick={this.onSelectPhotos}>
                                </div>
                                {/* <Form.Item name='photosImage' rules={[{ required: photoUrl ? false : true, message: ValidationConstants.organisationPhotoRequired }]}> */}
                                <input
                                    required="pb-0"
                                    type="file"
                                    id="photos-pic"
                                    accept="image/*"
                                    onChange={(evt) => {
                                        this.setPhotosImage(evt.target)
                                        // this.setState({ timeout: 1000 })
                                        // setTimeout(() => {
                                        //     this.setState({ timeout: null })
                                        // }, 1000);
                                    }}
                                    onClick={(event) => event.target.value = null}
                                />
                                {/* </Form.Item> */}
                                <span className="form-err">{this.state.imageError}</span>
                            </div>
                            <div className="col-sm pt-1">
                                <InputWithHead heading={AppConstants.category} required="required-field" />
                                <Form.Item name="photoTypeRefId" rules={[{ required: true, message: ValidationConstants.photoTypeRequired }]}>
                                    <Select
                                        style={{ width: '100%', paddingRight: 1 }}
                                        onChange={(e) => this.setOrgPhotoValue(e)}
                                        value={this.state.tableRecord.photoTypeRefId}
                                    >
                                        {(photoTypeData || []).map((photo) => (
                                            <Option key={`photoType_${photo.id}`} value={photo.id}>
                                                {photo.description}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <span className="image-size-format-text">
                        {AppConstants.imageSizeFormatText}
                    </span>
                </div>
            );
        } catch (ex) {
            console.log(`Error in photosAddEditView::${ex}`);
        }
    }

    photosEditViewRemoveBtnView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="col-sm">
                    <div className="comp-dashboard-botton-view-mobile d-flex align-items-center justify-content-end w-100">
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
                <div className="footer-view" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button type="cancel-button" onClick={() => this.cancelEditView()}>
                                    {AppConstants.cancel}
                                </Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button
                                    className="user-approval-button" type="primary" htmlType="submit"
                                    disabled={isSubmitting}
                                    onClick={() => this.setState({ buttonPressed: "savePhotos" })}
                                >
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
                    onCancel={() => this.deleteOrgPhotoModalHandle("cancel")}
                >
                    <p>Are you sure you want to remove the organisation photo?</p>
                </Modal>
            </div>
        );
    }

    //////charity voucher view
    charityVoucherView = () => {
        let affiliate = this.props.userState.affiliateOurOrg;
        let charityRoundUp = affiliate.charityRoundUp;
        let checkCharityArray = affiliate.charity;
        return (
            <div className="advanced-setting-view pt-5">
                {/* <div className="contextualHelp-RowDirection">
                    <span className="form-heading">{AppConstants.charityRoundUp}</span>
                    <div style={{ marginTop: 4 }}>
                        <CustomToolTip placement="top">
                            <span>{AppConstants.charityRoundUpMsg}</span>
                        </CustomToolTip>
                    </div>
                </div> */}
                {(checkCharityArray || []).map((item, index) => (
                    <div>
                        {/* <Form.Item
                            name='charityTitle'
                            rules={[{
                                required: true,
                                message: ValidationConstants.charityTitleNameIsRequired,
                            }]}
                        > */}
                        <InputWithHead
                            auto_complete='new-title'
                            heading={AppConstants.title}
                            placeholder={AppConstants.title}
                            value={item.name}
                            onChange={(e) => this.onChangesetCharity(captializedString(e.target.value), index, 'name')}
                        />
                        {/* </Form.Item> */}
                        <InputWithHead heading={AppConstants.description} />
                        {/* <Form.Item
                            name='charityDescription'
                            rules={[{
                                required: true,
                                message: ValidationConstants.charityDescriptionIsRequired,
                            }]}
                        > */}
                        <TextArea
                            placeholder={AppConstants.addCharityDescription}
                            value={item.description}
                            allowClear
                            onChange={(e) => this.onChangesetCharity(e.target.value, index, 'description')}
                        />
                        {/* </Form.Item> */}
                    </div>
                ))}
                <div className="inside-container-view">
                    <span className="form-heading">{AppConstants.roundUp}</span>
                    {charityRoundUp.map((item, index) => (
                        <div className="row ml-0" key={index}>
                            <Checkbox
                                className="single-checkbox mt-3"
                                checked={item.isSelected}
                                onChange={(e) => this.onChangesetCharity(e.target.checked, index, 'charityRoundUp')}
                            >
                                {item.description}
                            </Checkbox>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    //////////////End Photos ///////////////////
    ///footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button type="cancel-button" onClick={() => this.setState({ buttonPressed: "cancel" })}>
                                    {AppConstants.cancel}
                                </Button>
                            </div>
                        </div>
                        {this.state.isEditable && (
                            <div className="col-sm">
                                {this.state.organisationTabKey === "1" && (
                                    <div className="comp-buttons-view">
                                        <Button
                                            className="user-approval-button"
                                            type="primary"
                                            htmlType="submit"
                                            disabled={isSubmitting}
                                            onClick={() => this.setState({ buttonPressed: "save" })}
                                        >
                                            {AppConstants.updateAffiliates}
                                        </Button>
                                    </div>
                                )}
                                {this.state.organisationTabKey === "3" && (
                                    <div className="comp-buttons-view">
                                        <Button
                                            className="user-approval-button"
                                            type="primary"
                                            htmlType="button"
                                            disabled={isSubmitting}
                                            onClick={() => this.updateTermsAndCondition()}
                                        >
                                            {AppConstants.updateAffiliates}
                                        </Button>
                                    </div>
                                )}
                                {this.state.organisationTabKey === "4" && (
                                    <div className="comp-buttons-view">
                                        <Button
                                            className="user-approval-button"
                                            type="primary"
                                            htmlType="button"
                                            disabled={isSubmitting}
                                            onClick={() => this.updateCharity()}
                                        >
                                            {AppConstants.updateAffiliates}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        let userState = this.props.userState;
        const photoUrl = this.state.tableRecord != null ? this.state.tableRecord.photoUrl : null;
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu="user" userSelectedKey="3" />
                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.saveAffiliate}

                        onFinishFailed={(err) => {
                            this.formRef.current.scrollToField(err.errorFields[0].name);
                            message.error(ValidationConstants.requiredMessage);
                        }}
                        noValidate="noValidate"
                    >
                        <Content>
                            <div className="tab-view">
                                <Tabs activeKey={this.state.organisationTabKey} onChange={this.tabCallBack}>
                                    <TabPane tab={AppConstants.general} key="1">
                                        <div className="tab-formView mt-5">
                                            {this.contentView()}
                                        </div>
                                        <div className="tab-formView mt-5">
                                            {this.contacts()}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.photos} key="2">
                                        <div>{AppConstants.orgPhotosText}</div>
                                        <div className="tab-formView mt-5">
                                            {!this.state.isEditView ? (
                                                <div>
                                                    {this.photosHeaderView()}
                                                    {this.photosListView()}
                                                </div>
                                            ) : (
                                                    <div>
                                                        {this.photosEditHeaderView()}
                                                        {(photoUrl || this.state.orgPhotosImg) && this.photosEditViewRemoveBtnView()}
                                                        {this.photosAddEditView()}
                                                    </div>
                                                )}
                                        </div>
                                        {this.state.isEditView && (
                                            <div>{this.photosEditViewFooterView()}</div>
                                        )}
                                        {this.orgPhotoDeleteConfirmModalView()}
                                    </TabPane>
                                    <TabPane tab={AppConstants.termsAndCond} key="3">
                                        <div className="tab-formView mt-5">
                                            {this.termsAndConditionsView()}
                                        </div>
                                    </TabPane>
                                    {((getOrganisationData() && getOrganisationData().organisationTypeRefId == 2 && this.state.sourcePage != "DIR") ||
                                        (this.state.organisationTypeRefId == 2 && this.state.sourcePage == "DIR")) && (
                                            <TabPane tab={AppConstants.charity} key="4">
                                                <div className="tab-formView mt-5">
                                                    {this.charityVoucherView()}
                                                </div>
                                            </TabPane>
                                        )}
                                </Tabs>
                            </div>
                            <Loader visible={userState.onLoad} />
                        </Content>
                        {(this.state.organisationTabKey == "1" || this.state.organisationTabKey == "3" || this.state.organisationTabKey == "4") && (
                            <Footer>{this.footerView()}</Footer>
                        )}
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAffiliateToOrganisationAction,
        saveAffiliateAction,
        updateOrgAffiliateAction,
        getAffiliateOurOrganisationIdAction,
        getCommonRefData,
        getUreAction,
        getRoleAction,
        getPhotoTypeAction,
        getOrganisationPhotoAction,
        saveOrganisationPhotoAction,
        deleteOrganisationPhotoAction,
        deleteOrgContact,
        updateCharityValue,
        updateCharityAction,
        updateTermsAndConditionAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOurOrganization);
