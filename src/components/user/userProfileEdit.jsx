import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    DatePicker,
    Input,
    Radio,
    Form,
    message,
    Modal,
    Table,
    Typography,
    Checkbox,
    Upload
} from "antd";
import { InboxOutlined } from '@ant-design/icons';
import moment from 'moment';

import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import {
    addChildAction,
    addParentAction,
    userProfileUpdateAction,
} from '../../store/actions/userAction/userAction';
import ValidationConstants from "../../themes/validationConstant";
import {
    getCommonRefData, countryReferenceAction, nationalityReferenceAction,
    getGenderAction, disabilityReferenceAction, checkVenueDuplication,
    combinedAccreditationUmpieCoachRefrence, getDocumentType
} from '../../store/actions/commonAction/commonAction';
import history from '../../util/history';
import Loader from '../../customComponents/loader';
import { getAuthToken, getOrganisationData, getUserId } from "../../util/sessionStorage";
import { regexNumberExpression } from '../../util/helpers';
import PlacesAutocomplete from "../competition/elements/PlaceAutoComplete";
import UserAxiosApi from "../../store/http/userHttp/userAxiosApi";
import { getUserParentDataAction } from '../../store/actions/userAction/userAction';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
const { Text } = Typography;
const { Dragger } = Upload;

const columns = [
    {
        title: AppConstants.id,
        dataIndex: "id",
        key: "key",
    },
    {
        title: AppConstants.firstName,
        dataIndex: "firstName",
        key: "firstName",
    },
    {
        title: AppConstants.lastName,
        dataIndex: "lastName",
        key: "lastName",
    },
    {
        title: AppConstants.dateOfBirth,
        dataIndex: "dob",
        key: "dob",
    },
    {
        title: AppConstants.emailAdd,
        dataIndex: "email",
        key: "email",
    },
    {
        title: AppConstants.contactNumber,
        dataIndex: "mobile",
        key: "mobile",
    },
    {
        title: AppConstants.affiliate,
        dataIndex: "affiliate",
        key: "affiliate",
    },
];

class UserProfileEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            userRegistrationId: '',
            displaySection: "0",
            loadValue: false,
            saveLoad: false,
            tabKey: "3",
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            userData: {
                genderRefId: 0,
                firstName: "",
                lastName: "",
                mobileNumber: "",
                email: "",
                middleName: "",
                dateOfBirth: null,
                street1: "",
                street2: "",
                suburb: "",
                stateRefId: 0,
                postalCode: "",
                statusRefId: 0,
                emergencyFirstName: "",
                emergencyLastName: "",
                emergencyContactNumber: "",
                existingMedicalCondition: "",
                regularMedication: "",
                disabilityCareNumber: '',
                isDisability: 0,
                disabilityTypeRefId: 0,
                countryRefId: null,
                nationalityRefId: null,
                languages: "",
                childrenCheckNumber: "",
                childrenCheckExpiryDate: "",
                parentUserId: 0,
                childUserId: 0,
                accreditationLevelUmpireRefId: null,
                accreditationLevelCoachRefId: null,
                accreditationUmpireExpiryDate: null,
                accreditationCoachExpiryDate: null,
            },
            isSameEmail: false,
            showSameEmailOption: false,
            showParentEmailSelectbox: false,
            enableEmailInputbox: true,
            showEmailInputbox: true,
            titleLabel: "",
            section: "",
            isSameUserEmailChanged: false,
            hasErrorEmergency: false,
            hasErrorAddressNumber: false,
            venueAddressError: '',
            manualAddress: false,
            storedEmailAddress: null,
            // possible matches
            possibleMatches: [],
            isPossibleMatchShow: false,
            isLoading: false,
            parentMatchingId: 0,
            docType: '',
            docList: [],
            documentId: -1
        };
        this.confirmOpend = false;
        // this.props.getCommonRefData();
        this.props.countryReferenceAction();
        this.props.getDocumentType();
        this.props.nationalityReferenceAction();
        this.props.getGenderAction();
        this.props.disabilityReferenceAction();
        this.formRef = React.createRef();
        this.props.combinedAccreditationUmpieCoachRefrence();
    }

    async componentDidMount() {
        if (this.props.history.location.state) {
            let titleLabel = "";
            let section = "";
            const data = this.props.history.location.state.userData;
            const { moduleFrom, userData: {docType, docUrl} } = this.props.history.location.state;
            if (moduleFrom === "1") {
                titleLabel = `${AppConstants.edit} ${AppConstants.address}`;
                section = "address";
            } else if (moduleFrom === "2") {
                titleLabel = `${AppConstants.edit} ${AppConstants.parentOrGuardianDetail}`;
                section = "primary";
            } else if (moduleFrom === "3") {
                titleLabel = `${AppConstants.edit} ${AppConstants.emergencyContacts}`;
                section = "emergency";
            } else if (moduleFrom === "4") {
                titleLabel = `${AppConstants.edit} ${AppConstants.otherInformation}`;
                section = "other";
            } else if (moduleFrom === "5") {
                titleLabel = `${AppConstants.edit} ${AppConstants.medical}`;
                section = "medical";
                this.setState({ tabKey: "4" });
                if (data != null) {
                    if (data.disability != null && data.disability.length > 0) {
                        data.isDisability = data.disability[0].isDisability;
                        data.disabilityTypeRefId = data.disability[0].disabilityTypeRefId;
                        data.disabilityCareNumber = data.disability[0].disabilityCareNumber;
                        delete data.disability;
                    }
                }
            } else if (moduleFrom === "6") {
                titleLabel = `${AppConstants.edit} ${AppConstants.child}`;
                section = "child";
            } else if (moduleFrom === "7") {
                titleLabel = AppConstants.addChild;
                section = "child";
            } else if (moduleFrom === "8") {
                titleLabel = AppConstants.addParent_guardian;
                section = "primary";
            }
            const userDataTemp = this.state.userData;
            if (moduleFrom == 7 || moduleFrom == 8) {
                userDataTemp.userId = data.userId;
            }

            const showSameEmailOption = !!data.dateOfBirth && (moment().year() - moment(data.dateOfBirth).year() < 18)
            && ((titleLabel === AppConstants.edit + ' ' + AppConstants.address)
            || (titleLabel === AppConstants.edit + ' ' + AppConstants.child)
            || (titleLabel === AppConstants.addChild));

            if (moduleFrom !== "7" && moduleFrom !== '8') {
                await this.props.getUserParentDataAction(data.key);
            }
            const { parentData } = this.props.userState;
            let additionalSettings = {};
            if (showSameEmailOption) {
                const matchingData = parentData.find((parent) => {
                    return (parent.email?.toLowerCase() + '.' + data.firstName?.toLowerCase() === data.email?.toLowerCase());
                });
                if (matchingData) {
                    additionalSettings = {
                        ...additionalSettings,
                        showParentEmailSelectbox: true,
                        enableEmailInputbox: false,
                        showEmailInputbox: false,
                        isSameEmail: true,
                        parentMatchingId: matchingData.id,
                    };
                }
            }

            const personalEmail = this.props.userState.personalData.email;
            if ((personalEmail?.toLowerCase() + '.' + data.firstName?.toLowerCase()) === data.email?.toLowerCase()) {
                data['email'] = personalEmail;
                additionalSettings = {
                    ...additionalSettings,
                    isSameEmail: true,
                    enableEmailInputbox: false,
                }
            }

            additionalSettings = {
                ...additionalSettings,
                isSameEmail: data.isInActive
            }
            let docList = [];
            if (docUrl) {
                let filename = unescape(docUrl);
                filename = filename.slice(filename.indexOf('filename=')+9);
                docList = [{
                    uid: '1',
                    name: filename,
                    status: 'done',
                    url: docUrl,
                    thumbUrl: '',
                }];
            }
            setTimeout(() => {
                this.setState({
                    displaySection: moduleFrom,
                    userData: (moduleFrom != "7" && moduleFrom != "8") ? data : userDataTemp,
                    showSameEmailOption,
                    titleLabel,
                    section,
                    docType: docType ? docType : '',
                    docList: docList,
                    loadValue: true,
                    userRole: getOrganisationData().userRole,
                    ...additionalSettings,
                });
            }, 300);

            this.setSameEmail(this.state.userData)
        }
    }

    componentDidUpdate(nextProps) {
        if (this.state.loadValue) {
            this.setState({ loadValue: false });
            if (this.state.displaySection === "1") {
                this.setAddressFormFields();
            } else if (this.state.displaySection === "2") {
                this.setPrimaryContactFormFields();
            } else if (this.state.displaySection === "3") {
                this.setEmergencyFormField();
            } else if (this.state.displaySection === "4") {
                this.setOtherInfoFormField();
            } else if (this.state.displaySection === "6") {
                this.setPrimaryContactFormFields();
            }
        }
        const { userState } = this.props;
        if (userState.onUpUpdateLoad == false && this.state.saveLoad) {
            this.setState({ saveLoad: false });
            if (userState.status === 1) {
                if (this.state.isSameUserEmailChanged) {
                    this.logout();
                } else {
                    history.push({
                        pathname: '/userPersonal',
                        state: { tabKey: this.state.tabKey, userId: this.props.history.location.state.userData.userId },
                    });
                }
            } else if (userState.status === 4) {
                message.config({ duration: 1.5, maxCount: 1 });
                message.error(userState.userProfileUpdate);
            }
        }
    }

    logout = () => {
        try {
            localStorage.clear();
            history.push("/login");
        } catch (error) {
            console.log(`Error${error}`);
        }
    };

    setAddressFormFields = () => {
        const { userData } = this.state;
        this.setState({ storedEmailAddress: userData.email });
        this.formRef.current.setFieldsValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            dateOfBirth: ((userData.dateOfBirth != null && userData.dateOfBirth != '')
                ? moment(userData.dateOfBirth, "YYYY-MM-DD") : null),
            street1: userData.street1,
            email: userData.email,
            suburb: userData.suburb,
            stateRefId: userData.stateRefId,
            postalCode: userData.postalCode,
        });
    }

    setPrimaryContactFormFields = () => {
        const { userData } = this.state;
        this.formRef.current.setFieldsValue({
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            street1: userData.street1,
            email: userData.email,
            suburb: userData.suburb,
            stateRefId: userData.stateRefId,
            postalCode: userData.postalCode,
        });
    }

    setEmergencyFormField = () => {
        const { userData } = this.state;
        this.formRef.current.setFieldsValue({
            emergencyFirstName: userData.emergencyFirstName,
            emergencyLastName: userData.emergencyLastName,
            emergencyContactNumber: userData.emergencyContactNumber,
        });
    }

    setOtherInfoFormField = () => {
        const { userData } = this.state;
        const personalData = this.props.location.state ? this.props.location.state.personalData ? this.props.location.state.personalData : null : null;
        if (personalData) {
            userData.accreditationCoachExpiryDate = personalData.accreditationCoachExpiryDate;
            userData.accreditationLevelCoachRefId = personalData.accreditationLevelCoachRefId;
            userData.accreditationLevelUmpireRefId = personalData.accreditationLevelUmpireRefId;
            userData.accreditationUmpireExpiryDate = personalData.accreditationUmpireExpiryDate;
            this.formRef.current.setFieldsValue({
                [`accreditationLevelUmpireRefId`]: personalData.accreditationLevelUmpireRefId,
                [`accreditationLevelCoachRefId`]: personalData.accreditationLevelCoachRefId,
                [`accreditationUmpireExpiryDate`]: personalData.accreditationUmpireExpiryDate && moment(personalData.accreditationUmpireExpiryDate),
                [`accreditationCoachExpiryDate`]: personalData.accreditationCoachExpiryDate && moment(personalData.accreditationCoachExpiryDate),
            });
        }
        this.formRef.current.setFieldsValue({
            genderRefId: userData.genderRefId ? parseInt(userData.genderRefId) : null,
        });
    }

    setUserDataContactEmailDefault = () => {
        const personalEmail = this.props.userState.personalData.email;
        this.setUserDataContactEmail(personalEmail);
    }

    setUserDataContactEmail = async (email) => {
        let data = {...this.state.userData};
        data['email'] = email;
        await this.formRef.current.setFieldsValue({ email });
        await this.setState({ userData: data });
    }

    onChangeSetValue = async (value, key) => {
        let data = {...this.state.userData};
        let additionalSettings = {};
        if (key === "isDisability") {
            if (value === 0) {
                data.disabilityCareNumber = null;
                data.disabilityTypeRefId = null;
            }
        } else if (key === "dateOfBirth") {
            value = value && (moment(value).format("YYYY-MM-DD"));
            const age = moment().year() - moment(value).year();
            if (age < 18) {
                if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.child)
                || this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)
                || this.state.titleLabel === AppConstants.addChild) {
                    await this.setState({ showSameEmailOption: true });
                }
                if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.child)
                || this.state.titleLabel === AppConstants.addChild) {
                    data['email'] = this.props.userState.personalData.email;
                    await this.formRef.current.setFieldsValue({ "email": data["email"] });
                    additionalSettings = { ...additionalSettings, isSameEmail: true, enableEmailInputbox: false };
                }
            } else {
                if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.child)
                || this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)
                || this.state.titleLabel === AppConstants.addChild) {
                    await this.setState({
                        showSameEmailOption: false,
                        enableEmailInputbox: true,
                        isSameEmail: false
                    });
                }
            }
        } else if (key === "email" && this.state.section === "address") {
            if (data.userId == getUserId()) {
                this.setState({ isSameUserEmailChanged: true });
            } else {
                this.setState({ isSameUserEmailChanged: false });
            }
        } else if (key === "mobileNumber") {
            if (value.length === 10) {
                this.setState({
                    hasErrorAddressNumber: false,
                });
                value = regexNumberExpression(value);
            } else if (value.length < 10) {
                this.setState({
                    hasErrorAddressNumber: true,
                });
                value = regexNumberExpression(value);
            }

            if (regexNumberExpression(value) == undefined) {
                setTimeout(() => {
                    this.formRef.current.setFieldsValue({
                        mobileNumber: this.state.userData.mobileNumber,
                    });
                }, 300);
            }
        } else if (key === "emergencyContactNumber") {
            if (value.length === 10) {
                this.setState({
                    hasErrorEmergency: false,
                });
                value = regexNumberExpression(value);
            } else if (value.length < 10) {
                this.setState({
                    hasErrorEmergency: true,
                });
                value = regexNumberExpression(value);
            }

            if (regexNumberExpression(value) == undefined) {
                setTimeout(() => {
                    this.formRef.current.setFieldsValue({
                        emergencyContactNumber: this.state.userData.emergencyContactNumber,
                    });
                }, 300);
            }
        } else if (key === "parentEmail") {
            if (value === -1) {
                await this.setState({ enableEmailInputbox: true, showEmailInputbox: true });
                return;
            } else {
                const { parentData } = this.props.userState;
                const parent = parentData.find((item) => item.id === value);
                const updatedEmail = parent.email + '.' + data.firstName;
                await this.setState({ enableEmailInputbox: false, showEmailInputbox: false });
                key = "email";
                value = updatedEmail;
            }
        } else if (key === 'docType') {
            this.setState({docType: value});
        }

        if (key === 'accreditationLevelUmpireRefId') {
            data.accreditationUmpireExpiryDate = null;
            this.formRef.current.setFieldsValue({
                [`accreditationUmpireExpiryDate`]: null,
            });
        }

        if (key === 'accreditationLevelCoachRefId') {
            data.accreditationCoachExpiryDate = null;
            this.formRef.current.setFieldsValue({
                [`accreditationCoachExpiryDate`]: null,
            });
        }
        data[key] = value;

        this.setState({ userData: data, ...additionalSettings });
    }

    headerView = () => (
        <div className="header-view">
            <Header className="form-header-view d-flex bg-transparent align-items-center">
                <Breadcrumb separator=" > ">
                    <Breadcrumb.Item className="breadcrumb-add">
                        {this.state.titleLabel}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Header>
        </div>
    );

    handlePlacesAutocomplete = (data) => {
        const { stateListData } = this.props.commonReducerState;
        const address = data;
        const { userData } = this.state;
        this.props.checkVenueDuplication(address);

        if (!address || !address.addressOne || !address.suburb) {
            this.setState({
                venueAddressError: ValidationConstants.venueAddressDetailsError,
            });
        } else {
            this.setState({
                venueAddressError: '',
            });
        }

        this.setState({
            venueAddress: address,
        });
        const stateRefId = stateListData.length > 0 && address.state
            ? stateListData.find((state) => state.name === address.state).id
            : null;

        // this.formRef.current.setFieldsValue({
        //     state: address.state,
        //     addressOne: address.addressOne || null,
        //     suburb: address.suburb || null,
        //     postcode: address.postcode || null,
        // });
        if (address) {
            userData.street1 = address.addressOne;
            userData.stateRefId = stateRefId;
            userData.suburb = address.suburb;
            userData.postalCode = address.postcode;
        }
    };

    setSameEmail = async (userData) => {
        try{
            const { parentData } = this.props.userState;
            if(userData.isInActive){
                this.setState({isSameEmail: true})
                if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)) {
                    await this.setState({
                        showParentEmailSelectbox: true,
                        showEmailInputbox: false,
                        enableEmailInputbox: false,
                    });
                    await this.setUserDataContactEmail(parentData[0].email + '.' + this.state.userData.firstName);
                } else {
                    await this.setUserDataContactEmailDefault();
                    await this.setState({
                        enableEmailInputbox: false,
                    });
                }
            }
            else{
                this.setState({isSameEmail: false})
                if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)) {
                    await this.setUserDataContactEmailDefault();
                    await this.setState({
                        showParentEmailSelectbox: false,
                        showEmailInputbox: true,
                        enableEmailInputbox: true,
                    });
                } else {
                    await this.setState({
                        enableEmailInputbox: true,
                    })
                }
            }
        } catch(ex) {
            console.log("Error in setSameEmail::" +ex)
        }
    }

    addressEdit = () => {
        const { userData } = this.state;
        const { stateListData } = this.props.commonReducerState;
        const { hasErrorAddressNumber } = this.state;

        const state = (stateListData.length > 0 && userData.stateRefId)
            ? stateListData.find((state) => state.id == userData.stateRefId).name
            : null;

        let defaultVenueAddress = null;
        if (userData.street1) {
            defaultVenueAddress = `${userData.street1 && `${userData.street1},`
            } ${userData.suburb && `${userData.suburb},`
            } ${state && `${state},`
            } `;
        }

        const { parentData } = this.props.userState;

        return (
            <div className="pt-0">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name="firstName" rules={[{ required: true, message: ValidationConstants.firstName }]}>
                            <InputWithHead
                                auto_complete="new-firstName"
                                required="required-field"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                name="firstName"
                                value={userData?.firstName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item name="lastName" rules={[{ required: false }]}>
                            <InputWithHead
                                auto_complete="new-lastName"
                                required="required-field"
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.lastName}
                                name="lastName"
                                value={userData?.lastName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "lastName")}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            auto_complete="new-middleName"
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.middleName}
                            placeholder={AppConstants.middleName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "middleName")}
                            value={userData?.middleName}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.dob} />
                        <DatePicker
                            // size="large"
                            style={{ width: '100%' }}
                            onChange={(e) => this.onChangeSetValue(e, "dateOfBirth")}
                            format="DD-MM-YYYY"
                            showTime={false}
                            placeholder="dd-mm-yyyy"
                            name="dateOfBirth"
                            value={userData?.dateOfBirth != null && moment(userData.dateOfBirth)}
                        />
                    </div>
                </div>

                {/* todo: below needs to be properly handled. hiding it now */}
                {/* {(this.state.titleLabel === AppConstants.addChild) && ( */}
                {/*    <Checkbox */}
                {/*        className="single-checkbox" */}
                {/*        checked={this.state.isSameEmail} */}
                {/*        onChange={(e) => this.setState({ isSameEmail: e.target.checked })} */}
                {/*    > */}
                {/*        {this.state.titleLabel === AppConstants.addParent_guardian */}
                {/*            ? AppConstants.useChildEmail : AppConstants.useParentEmail} */}
                {/*    </Checkbox> */}
                {/* )} */}
                {/* {(this.state.titleLabel === AppConstants.addParent_guardian || this.state.titleLabel === AppConstants.addChild) && ( */}
                {/*    <Checkbox */}
                {/*        className="single-checkbox" */}
                {/*        checked={this.state.isSameEmail} */}
                {/*        onChange={(e) => this.setState({ isSameEmail: e.target.checked })} */}
                {/*    > */}
                {/*        {this.state.titleLabel === AppConstants.addParent_guardian */}
                {/*            ? AppConstants.useChildEmail : AppConstants.useParentEmail} */}
                {/*    </Checkbox> */}
                {/* )} */}

                <div className="row">
                    <div className="col-sm">
                        <Form.Item
                            name="mobileNumber"
                            rules={[{ required: true, message: ValidationConstants.contactField }]}
                            help={hasErrorAddressNumber && ValidationConstants.mobileLength}
                            validateStatus={hasErrorAddressNumber ? "error" : 'validating'}
                        >
                            <InputWithHead
                                auto_complete="new-mobileNumber"
                                required="required-field"
                                heading={AppConstants.contactMobile}
                                placeholder={AppConstants.contactMobile}
                                value={userData?.mobileNumber}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}
                                maxLength={10}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.contactEmail} />
                        {this.state.showParentEmailSelectbox && (
                            <Select
                                style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                                name="parentEmail"
                                onSelect={(e) => this.onChangeSetValue(e, "parentEmail")}
                                defaultValue={this.state.parentMatchingId ? this.state.parentMatchingId: parentData[0].id}
                            >
                                {parentData?.map((item) => (
                                    <Option key={item.id} value={item.id}>{item.firstName + " " + item.lastName}</Option>
                                ))}
                            </Select>
                        )}
                        {this.state.showEmailInputbox && (
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true, message: ValidationConstants.emailField[0],
                                    },
                                    {
                                        type: "email",
                                        pattern: new RegExp(AppConstants.emailExp),
                                        message: ValidationConstants.email_validation,
                                    },
                                ]}
                            >
                                <InputWithHead
                                    auto_complete="new-email"
                                    required="required-field"
                                    style={{ marginTop: this.state.showParentEmailSelectbox && "10px" }}
                                    placeholder={AppConstants.contactEmail}
                                    name="email"
                                    setFieldsValue={userData?.email}
                                    disabled={!this.state.enableEmailInputbox}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                                />
                            </Form.Item>
                        )}
                        {(userData.userId == getUserId() && this.state.isSameUserEmailChanged) && (
                            <div className="same-user-validation">
                                {ValidationConstants.emailField[2]}
                            </div>
                        )}
                        {this.state.showSameEmailOption && (
                            <Checkbox
                                className="single-checkbox"
                                checked={this.state.isSameEmail}
                                onChange={async (e) => {
                                    if (e.target.checked) {
                                        if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)) {
                                            await this.setState({
                                                showParentEmailSelectbox: true,
                                                showEmailInputbox: parentData.length == 1 ? true : false,
                                                enableEmailInputbox: parentData.length == 1 ? true : false,
                                            });
                                            await this.setUserDataContactEmail(!!parentData[0].email ? parentData[0].email + '.' + this.state.userData.firstName : '');
                                        } else {
                                            await this.setUserDataContactEmailDefault();
                                            await this.setState({
                                                enableEmailInputbox: false,
                                            });
                                        }
                                    } else {
                                        if (this.state.titleLabel === (AppConstants.edit + ' ' + AppConstants.address)) {
                                            await this.setUserDataContactEmailDefault();
                                            await this.setState({
                                                showParentEmailSelectbox: false,
                                                showEmailInputbox: true,
                                                enableEmailInputbox: true,
                                            });
                                        } else {
                                            await this.setState({
                                                enableEmailInputbox: true,
                                            })
                                        }
                                    }
                                    let userData = this.state.userData;
                                    userData.isInActive = e.target.checked ? 1 : 0;
                                    this.setState({ isSameEmail: e.target.checked, userData: userData });
                                }}
                            >
                                {AppConstants.useParentEmail}
                            </Checkbox>
                        )}
                    </div>
                </div>
                {!this.state.manualAddress && (
                    <PlacesAutocomplete
                        defaultValue={defaultVenueAddress && `${defaultVenueAddress}Australia`}
                        heading={AppConstants.addressSearch}
                        // required
                        error={this.state.venueAddressError}
                        onSetData={this.handlePlacesAutocomplete}
                    />
                )}

                <div
                    className="orange-action-txt"
                    style={{ marginTop: "10px" }}
                    onClick={() => this.setState({ manualAddress: !this.state.manualAddress })}
                >
                    {this.state.manualAddress ? AppConstants.returnAddressSearch : AppConstants.enterAddressManually}
                </div>

                {this.state.manualAddress && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                auto_complete="new-addressOne"
                                // required="required-field"
                                heading={AppConstants.addressOne}
                                placeholder={AppConstants.addressOne}
                                name="street1"
                                value={userData?.street1}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "street1")}
                            // readOnly
                            />

                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                auto_complete="new-addressTwo"
                                // style={{ marginTop: 9 }}
                                heading={AppConstants.addressTwo}
                                placeholder={AppConstants.addressTwo}
                                name="street2"
                                value={userData?.street2}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "street2")}
                            />
                        </div>
                    </div>
                )}

                {this.state.manualAddress && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                // style={{ marginTop: 9 }}
                                heading={AppConstants.suburb}
                                placeholder={AppConstants.suburb}
                                // required="required-field"
                                name="suburb"
                                value={userData?.suburb}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "suburb")}
                            // readOnly
                            />
                        </div>
                        <div className="col-sm">
                            <div>
                                <InputWithHead heading={AppConstants.stateHeading} />
                            </div>
                            <Select
                                style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                                placeholder={AppConstants.select}
                                // required="required-field"
                                value={userData.stateRefId}
                                name="stateRefId"
                                onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                            // readOnly
                            // disabled
                            >
                                {stateListData.map((item) => (
                                    <Option key={`state_${item.id}`} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                )}
                {this.state.manualAddress && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.postCode}
                                placeholder={AppConstants.postCode}
                                name="postalCode"
                                value={userData?.postalCode}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "postalCode")}
                            // readOnly
                            />
                        </div>
                        <div className="col-sm" />
                    </div>
                )}
            </div>
        );
    };

    primaryContactEdit = () => {
        const { userData } = this.state;
        const { stateList } = this.props.commonReducerState;
        return (
            <div className="content-view pt-0">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item name="firstName" rules={[{ required: true, message: ValidationConstants.firstName }]}>
                            <InputWithHead
                                auto_complete="new-firstName"
                                required="required-field"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                name="firstName"
                                value={userData.firstName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item name="lastName" rules={[{ required: false }]}>
                            <InputWithHead
                                auto_complete="new-lastName"
                                required="required-field"
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.lastName}
                                name="lastName"
                                value={userData.lastName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "lastName")}
                            />
                        </Form.Item>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.addressOne}
                            placeholder={AppConstants.addressOne}
                            name="street1"
                            value={userData.street1}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "street1")}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.addressTwo}
                            placeholder={AppConstants.addressTwo}
                            name="street2"
                            value={userData.street2}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "street2")}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.suburb}
                            placeholder={AppConstants.suburb}
                            name="suburb"
                            value={userData.suburb}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "suburb")}
                        />
                    </div>
                    <div className="col-sm">
                        <div>
                            <InputWithHead heading={AppConstants.stateHeading} />
                        </div>

                        <Select
                            className="w-100"
                            style={{ paddingRight: 1, minWidth: 182 }}
                            placeholder={AppConstants.select_state}
                            // onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                            value={userData.stateRefId}
                            name="stateRefId"
                            onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
                        >
                            {stateList.map((item) => (
                                <Option key={`state_${item.id}`} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* PlayerId and Team Selection row */}
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            // style={{ marginTop: 9 }}
                            heading={AppConstants.postCode}
                            placeholder={AppConstants.enterPostCode}
                            name="postalCode"
                            value={userData.postalCode}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "postalCode")}
                        />
                    </div>
                    <div className="col-sm">
                        <Form.Item name="email" rules={[{ required: true, message: ValidationConstants.emailField[0] }]}>
                            <InputWithHead
                                auto_complete="new-email"
                                heading={AppConstants.contactEmail}
                                placeholder={AppConstants.contactEmail}
                                name="email"
                                value={userData.email}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <Form.Item name="mobileNumber" rules={[{ required: true, message: ValidationConstants.contactField }]}>
                            <InputWithHead
                                auto_complete="new-mobileNumber"
                                heading={AppConstants.contactMobile}
                                placeholder={AppConstants.contactMobile}
                                name="mobileNumber"
                                value={userData.mobileNumber}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm" />
                </div>
            </div>
        );
    };

    emergencyContactEdit = () => {
        const { userData } = this.state;
        const { hasErrorEmergency } = this.state;
        return (
            <div className="content-view pt-0">
                {/* First and Last name row */}
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <Form.Item name="emergencyFirstName" rules={[{ required: true, message: ValidationConstants.emergencyContactName[0] }]}>
                            <InputWithHead
                                auto_complete="new-emergencyFirstName"
                                required="required-field"
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.firstName}
                                name="emergencyFirstName"
                                value={userData.emergencyFirstName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyFirstName")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Form.Item name="emergencyLastName" rules={[{ required: true, message: ValidationConstants.emergencyContactName[1] }]}>
                            <InputWithHead
                                auto_complete="new-emergencyLastName"
                                required="required-field"
                                heading={AppConstants.lastName}
                                placeholder={AppConstants.lastName}
                                name="emergencyLastName"
                                value={userData.emergencyLastName}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyLastName")}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Form.Item
                            name="emergencyContactNumber"
                            rules={[{ required: true, message: ValidationConstants.emergencyContactNumber[0] }]}
                            help={hasErrorEmergency && ValidationConstants.mobileLength}
                            validateStatus={hasErrorEmergency ? "error" : 'validating'}
                        >
                            <InputWithHead
                                auto_complete="new-emergencyContactName"
                                required="required-field"
                                heading={AppConstants.emergencyContactMobile}
                                placeholder={AppConstants.emergencyContactMobile}
                                name="emergencyContactNumber"
                                maxLength={10}
                                value={userData.emergencyContactNumber}
                                onChange={(e) => this.onChangeSetValue(e.target.value, "emergencyContactNumber")}
                            />
                        </Form.Item>
                    </div>
                </div>
            </div>
        );
    };

    otherInfoEdit = () => {
        const { userData } = this.state;
        const {
            countryList,
            // nationalityList,
            genderData,
            // accreditationUmpireList,
            umpireAccreditation,
            coachAccreditation,
        } = this.props.commonReducerState;
        return (
            <div className="content-view pt-0">
                <div className="row">
                    <div className="col-sm">
                        <div style={{ paddingTop: 11, paddingBottom: 10 }}>
                            <InputWithHead heading={AppConstants.gender} required="required-field" />
                            <Form.Item name="genderRefId" rules={[{ required: true, message: ValidationConstants.genderField }]}>
                                <Radio.Group
                                    className="reg-competition-radio"
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "genderRefId")}
                                    value={userData.genderRefId}
                                >
                                    {(genderData || []).map((gender) => (
                                        <Radio key={`gender_${gender.id}`} value={gender.id}>
                                            {gender.description}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>
                        </div>

                        <div>
                            <InputWithHead heading={AppConstants.nationalAccreditationLevelUmpireQ} required="required-field" />
                            <Form.Item name="accreditationLevelUmpireRefId" rules={[{ required: true, message: ValidationConstants.accreditationLevelUmpire }]}>
                                <Radio.Group
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "accreditationLevelUmpireRefId")}
                                // setFieldsValue={userData.accreditationLevelUmpireRefId}
                                >
                                    {(umpireAccreditation || []).map((accreditaiton, accreditationIndex) => (
                                        <Radio style={{ marginBottom: "10px" }} key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>

                            {(userData.accreditationLevelUmpireRefId != 1 && userData.accreditationLevelUmpireRefId != null) && (
                                <Form.Item name="accreditationUmpireExpiryDate" rules={[{ required: true, message: ValidationConstants.expiryDateRequire }]}>
                                    <DatePicker
                                        size="large"
                                        placeholder={AppConstants.expiryDate}
                                        style={{ width: "100%", marginTop: "20px" }}
                                        onChange={(e, f) => this.onChangeSetValue((moment(e).format("YYYY-MM-DD")), "accreditationUmpireExpiryDate")}
                                        format="DD-MM-YYYY"
                                        showTime={false}
                                        // value={userData.accreditationUmpireExpiryDate && moment(userData.accreditationUmpireExpiryDate)}
                                        disabledDate={(d) => !d || d.isSameOrBefore(new Date())}
                                    />
                                </Form.Item>
                            )}
                        </div>

                        <div>
                            <InputWithHead heading={AppConstants.nationalAccreditationLevelCoachQ} required="required-field" />
                            <Form.Item name="accreditationLevelCoachRefId" rules={[{ required: true, message: ValidationConstants.accreditationLevelCoach }]}>
                                <Radio.Group
                                    style={{ display: "flex", flexDirection: "column" }}
                                    className="registration-radio-group"
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "accreditationLevelCoachRefId")}
                                // setFieldsValue={userData.accreditationLevelCoachRefId}
                                >
                                    {(coachAccreditation || []).map((accreditaiton, accreditationIndex) => (
                                        <Radio style={{ marginBottom: "10px" }} key={accreditaiton.id} value={accreditaiton.id}>{accreditaiton.description}</Radio>
                                    ))}
                                </Radio.Group>
                            </Form.Item>

                            {(userData.accreditationLevelCoachRefId != 1 && userData.accreditationLevelCoachRefId != null) && (
                                <Form.Item name="accreditationCoachExpiryDate" rules={[{ required: true, message: ValidationConstants.expiryDateRequire }]}>
                                    <DatePicker
                                        size="large"
                                        placeholder={AppConstants.expiryDate}
                                        style={{ width: "100%", marginTop: "20px" }}
                                        // onChange={(e, f) => this.onChangeSetValue(e, "accreditationCoachExpiryDate")}
                                        onChange={(e, f) => this.onChangeSetValue((moment(e).format("YYYY-MM-DD")), "accreditationCoachExpiryDate")}
                                        format="DD-MM-YYYY"
                                        showTime={false}
                                        // value={userData.accreditationCoachExpiryDate && moment(userData.accreditationCoachExpiryDate)}
                                        disabledDate={(d) => !d || d.isSameOrBefore(new Date())}
                                    />
                                </Form.Item>
                            )}
                        </div>
                    </div>
                </div>
                {userData.userRegistrationId != null && (
                    <div>
                        <div className="row">
                            <div className="col-sm">
                                <div style={{ paddingTop: 11, paddingBottom: 10 }}>
                                    <InputWithHead heading={AppConstants.childCountry} />
                                </div>
                                <Select
                                    className="w-100"
                                    placeholder={AppConstants.childCountry}
                                    onChange={(e) => this.onChangeSetValue(e, "countryRefId")}
                                    value={userData.countryRefId}
                                    name="countryRefId"
                                >
                                    {countryList.map((country) => (
                                        <Option key={`country_${country.id}`} value={country.id}>
                                            {country.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        {/*
                        <div className="row">
                            <div className="col-sm">
                                <div style={{paddingTop: 11, paddingBottom: 10}}>
                                    <InputWithHead heading={AppConstants.nationalityReference} />
                                </div>
                                <Select
                                    className="w-100"
                                    placeholder={AppConstants.nationalityReference}
                                    onChange={(e) => {this.onChangeSetValue(e, "nationalityRefId")}}
                                    value={userData.nationalityRefId}
                                    name="nationalityRefId"
                                >
                                    {nationalityList.map((nation) => (
                                        <Option key={'nationality_' + nation.id} value={nation.id}>
                                            {nation.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead
                                    heading={AppConstants.childLangSpoken}
                                    placeholder={AppConstants.childLangSpoken}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "languages")}
                                    value={userData.languages}
                                    name={'languages'}
                                />
                            </div>
                        </div>
                        */}
                    </div>
                )}
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            heading={AppConstants.childrenNumber}
                            placeholder={AppConstants.childrenNumber}
                            onChange={(e) => this.onChangeSetValue(e.target.value, "childrenCheckNumber")}
                            value={userData.childrenCheckNumber}
                            name="childrenCheckNumber"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.checkExpiryDate} />
                        <DatePicker
                            // size="large"
                            style={{ width: '100%', marginTop: 9, minHeight: 50 }}
                            onChange={(e) => this.onChangeSetValue(e, "childrenCheckExpiryDate")}
                            format="DD-MM-YYYY"
                            showTime={false}
                            value={userData.childrenCheckExpiryDate !== null && moment(userData.childrenCheckExpiryDate)}
                            placeholder="dd-mm-yyyy"
                            name="childrenCheckExpiryDate"
                        />
                    </div>
                </div>
            </div>
        );
    };

    documentUpload = () => {
        const { userData, docList } = this.state;
        const { docTypes } = this.props.commonReducerState;

        const beforeUpload = (file) => {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            } else {
                this.setState(state => ({
                    docList: [file],
                    isLoading: true
                }));
            }
            return isLt2M;
        }
        const onCustomUpload = async (data) => {
            console.log(data);
            try {
                let ret = await UserAxiosApi.getUserModuleUploadDocument({file: data.file});
                if (ret.result.data.status === 'done') {
                    let bucket = ret.result.data.url.match(/(?:https:\/\/).*?(?=.s3)/)[0];
                    bucket = bucket.slice(8);
                    let filename = unescape(ret.result.data.url);
                    filename = filename.slice(filename.indexOf('.com')+5);
                    docList[0].url = `${process.env.REACT_APP_COMMON_API_URL}/file/download?bucket=${bucket}&filename=${filename}`;
                    return data.onSuccess();
                } else {
                    data.onError();
                }
            } catch (e) {
                data.onError();
            }
            this.setState({docList: []});
        }
        const onChange = (info) => {        
            if (info.file.status !== 'uploading') {
                
            }
            if (info.file.status === 'done') {
                message.success(`File was uploaded successfully`);
                this.setState({isLoading: false});
            } else if (info.file.status === 'error') {
                message.error(`Uploading was failed.`);
                this.setState({isLoading: false});
            }
        }
        const props = {
            customRequest: onCustomUpload,
            name: 'file',
            maxCount: 1,
            accept: '.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.csv',
            onRemove: file => {
                this.setState({
                    docList: [],
                });
            },
            beforeUpload: beforeUpload,
            onChange: onChange,
            fileList: docList
        };

        return ( <div> 
            <Loader visible={this.state.isLoading} />
            <div className="row">
                <div className="col-sm-12 col-md-6">
                    <InputWithHead heading={AppConstants.documentType} />
                    <Select defaultValue={this.state.docType} onSelect={(e) => this.onChangeSetValue(e, 'docType')} style={{width: '100%'}}>
                        {docTypes.map(doctype => (
                            <Option key={doctype.name}>{doctype.description}</Option>
                        ))}
                    </Select>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <InputWithHead heading={AppConstants.documentUrl} />
                    <div>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Selected file must be less then 2 MB and jpg, jpeg, png, webp, pdf, doc, docx, xls, xlsx formats are supported.
                            </p>
                        </Dragger>
                    </div>
                </div>
            </div>
        </div>);
    }

    medicalEdit = () => {
        const { userData } = this.state;
        const { disabilityList } = this.props.commonReducerState;

        return (
            <div className="formView pt-5" style={{ paddingBottom: "40px" }}>
                {/* <span className="form-heading"> {AppConstants.additionalInfoReqd} </span>    */}
                <InputWithHead heading={AppConstants.existingMedConditions} />
                <TextArea
                    placeholder={AppConstants.existingMedConditions}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "existingMedicalCondition")}
                    value={userData.existingMedicalCondition}
                    allowClear
                />

                <InputWithHead heading={AppConstants.regularMedicalConditions} />
                <TextArea
                    placeholder={AppConstants.regularMedicalConditions}
                    onChange={(e) => this.onChangeSetValue(e.target.value, "regularMedication")}
                    value={userData.regularMedication}
                    allowClear
                />

                <div>
                    <InputWithHead heading={AppConstants.haveDisability} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.onChangeSetValue(e.target.value, "isDisability")}
                        value={userData.isDisability}
                    >
                        <Radio value={1}>{AppConstants.yes}</Radio>
                        {userData.isDisability == 1 && (
                            <div style={{ marginLeft: 25 }}>
                                <InputWithHead
                                    auto_complete="new-disabilityCareNumber"
                                    heading={AppConstants.disabilityCareNumber}
                                    placeholder={AppConstants.disabilityCareNumber}
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "disabilityCareNumber")}
                                    value={userData.disabilityCareNumber}
                                />
                                <InputWithHead heading={AppConstants.typeOfDisability} />
                                <Radio.Group
                                    className="reg-competition-radio"
                                    onChange={(e) => this.onChangeSetValue(e.target.value, "disabilityTypeRefId")}
                                    value={userData.disabilityTypeRefId}
                                >
                                    {(disabilityList || []).map((dis) => (
                                        <Radio key={`disabilityType_${dis.id}`} value={dis.id}>{dis.description}</Radio>
                                    ))}
                                </Radio.Group>
                            </div>
                        )}
                        <Radio value={0}>{AppConstants.no}</Radio>
                    </Radio.Group>
                </div>
            </div>
        );
    }

    addParentOrChild = () => (
        <div className="content-view pt-0">
            <div className="row">
                <div className="col-sm">
                    <Form.Item name="firstName" rules={[{ required: true, message: ValidationConstants.firstName }]}>
                        <InputWithHead
                            auto_complete="new-firstName"
                            required="required-field"
                            heading={AppConstants.firstName}
                            placeholder={AppConstants.firstName}
                            name="firstName"
                            onChange={(e) => this.onChangeSetValue(e.target.value, "firstName")}
                        />
                    </Form.Item>
                </div>
                <div className="col-sm">
                    <Form.Item name="lastName" rules={[{ required: false }]}>
                        <InputWithHead
                            auto_complete="new-lastName"
                            required="required-field"
                            heading={AppConstants.lastName}
                            placeholder={AppConstants.lastName}
                            name="lastName"
                            onChange={(e) => this.onChangeSetValue(e.target.value, "lastName")}
                        />
                    </Form.Item>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Form.Item name="email" rules={[{ required: true, message: ValidationConstants.emailField[0] }]}>
                        <InputWithHead
                            auto_complete="new-email"
                            heading={AppConstants.emailAdd}
                            placeholder={AppConstants.emailAdd}
                            name="email"
                            onChange={(e) => this.onChangeSetValue(e.target.value, "email")}
                        />
                    </Form.Item>
                </div>
                <div className="col-sm">
                    <InputWithHead heading={AppConstants.dob} />
                    <DatePicker
                        // size="large"
                        style={{ width: '100%' }}
                        onChange={(e) => this.onChangeSetValue(e, "dateOfBirth")}
                        format="DD-MM-YYYY"
                        showTime={false}
                        placeholder="dd-mm-yyyy"
                        name="dateOfBirth"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <Form.Item name="mobileNumber" rules={[{ required: true, message: ValidationConstants.contactField }]}>
                        <InputWithHead
                            auto_complete="new-mobileNumber"
                            heading={AppConstants.contactMobile}
                            placeholder={AppConstants.contactMobile}
                            name="mobileNumber"
                            onChange={(e) => this.onChangeSetValue(e.target.value, "mobileNumber")}
                        />
                    </Form.Item>
                </div>
            </div>
        </div>
    )

    contentView = () => {
        const { displaySection } = this.state;
        return (
            <div className="content-view pt-0">
                {(displaySection === "1" || displaySection === "2" || displaySection === "6" || displaySection === "7" || displaySection === "8") && <div>{this.addressEdit()}</div>}
                {/* {(displaySection === "2" ) && <div>{this.primaryContactEdit()}</div>} */}
                {displaySection === "3" && <div>{this.emergencyContactEdit()}</div>}
                {displaySection === "4" && <div>{this.otherInfoEdit()}</div>}
                {displaySection === "5" && <div>{this.medicalEdit()}</div>}
                {displaySection === "9" && <div>{this.documentUpload()}</div>}
                {/* {(displaySection === "7" || displaySection === "8") && <div>{this.addParentOrChild()}</div>} */}
            </div>
        );
    };

    // actual function to call saving a child / parent
    addChildOrParent = (selectedMatch) => async () => {
        // if match is not selected, save the user data from the form
        const { isPossibleMatchShow, titleLabel, tabKey, isSameEmail, userData } = this.state;

        const userToAdd = selectedMatch || userData;
        const { userId } = this.props.history.location.state.userData;
        const sameEmail = (isSameEmail || userData.email === this.props.history.location.state.userData.email) ? 1 : 0;

        if (isPossibleMatchShow)
            this.setState({ isLoading: true });
        if (titleLabel === AppConstants.addChild) {
            try {
                const { status } = await UserAxiosApi.addChild({ userId, sameEmail, body: userToAdd });
                if ([1, 4].includes(status)) {
                    history.push({
                        pathname: '/userPersonal',
                        state: { tabKey: tabKey, userId: this.props.history.location.state.userData.userId },
                    });
                }
            } catch (e) {
                console.error(e);
            }
        } else if (titleLabel === AppConstants.addParent_guardian) {
            try {
                const { status } = await UserAxiosApi.addParent({ userId, sameEmail, body: userToAdd });
                if ([1, 4].includes(status)) {
                    history.push({
                        pathname: '/userPersonal',
                        state: { tabKey: tabKey, userId: this.props.history.location.state.userData.userId },
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
        if (isPossibleMatchShow)
            this.setState({ isLoading: false });
        // this.setState({ saveLoad: true });
    };

    // possible matches view
    // ideally this should be separate from the user profile view
    possibleMatchesDetailView = (matches) => {
        let selectedMatch = null;

        const rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                if (selectedRows.length) {
                    selectedMatch = selectedRows[0];
                }
            },
            getCheckboxProps: (record) => ({
                name: record.name,
            }),
        };

        const dataSource = matches.map((u) => ({
            key: u.id,
            id: u.id,
            firstName: u.firstName,
            lastName:  u.lastname,
            dob: !!u.dateOfBirth ? moment(u.dateOfBirth).format('DD/MM/YYYY') : null,
            email: u.email,
            mobile: u.mobileNumber,
            affiliate: u.affiliates && u.affiliates.length ? u.affiliates.join(', ') : '',
        }));

        const onCancel = () => {
            this.setState({ isPossibleMatchShow: false });
        };

        return (
            <div className="comp-dash-table-view mt-5">
                <Loader visible={this.state.isLoading} />
                <h2>{AppConstants.possibleMatches}</h2>
                <Text type="secondary">
                    {AppConstants.possibleMatchesDescription}
                </Text>
                <div className="table-responsive home-dash-table-view mt-3">
                    <Table
                        rowSelection={{
                            ...rowSelection,
                        }}
                        className="home-dashboard-table"
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                    />
                </div>
                <div className="d-flex align-items-center justify-content-between mt-4">
                    <Button onClick={onCancel}>{AppConstants.cancel}</Button>
                    <Button type="primary" onClick={this.addChildOrParent(selectedMatch)}>{AppConstants.next}</Button>
                </div>
            </div>
        );
    };

    onSaveClick = () => {
        if (this.confirmOpend) return;

        this.confirmOpend = true;

        const { saveAction } = this;
        if (this.state.isSameEmail || this.state.userData.email === this.props.history.location.state.userData.email) {
            let electionMsg = '';
            if (this.state.titleLabel === AppConstants.addChild) {
                electionMsg = AppConstants[this.state.userRole === 'admin' ? 'childMsg2Admin' : 'childMsg2Parent'];
            } else if (this.state.titleLabel === AppConstants.addParent_guardian) {
                electionMsg = AppConstants[this.state.userRole === 'admin' ? 'parentMsg2Admin' : 'parentMsg2Child'];
            }
            if (electionMsg != "") {
                confirm({
                    content: electionMsg,
                    okText: 'Continue',
                    okType: AppConstants.primary,
                    cancelText: AppConstants.cancel,
                    onOk: () => {
                        saveAction();
                        this.confirmOpend = false;
                    },
                    onCancel: () => {
                        this.confirmOpend = false;
                    },
                });
            } else {
                saveAction();
                this.confirmOpend = false;
            }
        } else {
            saveAction();
            this.confirmOpend = false;
        }
    };

    saveAction = async () => {
        const data = this.state.userData;
        data.section = this.state.section;
        data.organisationId = this.state.organisationId;
        const { storedEmailAddress } = this.state;

        if (this.state.venueAddressError) {
            message.config({ duration: 1.5, maxCount: 1 });
            message.error(this.state.venueAddressError);
            return;
        }

        if (this.state.displaySection == 8 && !data.parentUserId) {
            data.parentUserId = 0;
        } else if (this.state.displaySection == 7 && !data.childUserId) {
            data.childUserId = 0;
        } if (this.state.hasErrorAddressNumber == true || this.state.hasErrorEmergency == true) {
            return false;
        } else if (this.state.displaySection == 9) {
            let {docType, docList} = this.state;
            let { docTypes } = this.props.commonReducerState;
            let documentId =  this.props.history.location.state.userData.documentId || this.state.documentId || -1;

            if (!docType || docList.length === 0) return;
            
            this.setState({isLoading: true});
            let payload = {
                userId: data.userId,
                organisationUniqueKey: data.organisationId,
                dateUploaded: new Date(),
                docType: docType,
                docTypeDescription: docTypes.filter(dt => dt.name === docType)[0].description,
                docUrl: docList[0].url,
                documentId: documentId !== -1 ? documentId : undefined
            }
            let ret = await UserAxiosApi.addUserModuleDocuments(payload);
            if (!!ret.result.data.documentId) {
                this.setState({documentId: ret.result.data.documentId});
                message.success(`Document was saved successfully`);
                setTimeout(() => {
                    history.goBack();
                }, 1000);
            } else {
                message.success(`Document uploading was failed`);;
            }
            this.setState({isLoading: false});
            return;
        }

        if (this.state.isSameEmail) {
            data.mobileNumber = this.props.history.location.state.userData.mobileNumber;
            if (this.state.titleLabel === AppConstants.addChild || this.state.titleLabel === AppConstants.edit + ' ' + AppConstants.child ) {
                data["email"] = this.props.userState.personalData.email + '.' + data.firstName;
            }

            if (this.state.titleLabel === AppConstants.edit + ' ' + AppConstants.address) {
                data["email"] += '.' + data.firstName;
            }
        }

        data["email"] = data["email"]?.toLowerCase();

        // judging whether the flow is on addChild / addParent based on `titleLabel` (possible refactor)

        if (this.state.titleLabel === AppConstants.addChild || this.state.titleLabel === AppConstants.addParent_guardian) {
            const { status, result: { data: possibleMatches } } = await UserAxiosApi.findPossibleMerge(data);
            if ([1, 4].includes(status)) {
                if ( possibleMatches.length === 0) {
                    await this.addChildOrParent(null)();
                } else {
                    this.setState({ isPossibleMatchShow: true, possibleMatches });
                }
            }
        } else {
            if (this.state.displaySection === "1") {
                data.emailUpdated = storedEmailAddress === data.email ? 0 : 1;
                this.props.userProfileUpdateAction(data);
            } else {
                this.props.userProfileUpdateAction(data);
            }
            this.setState({ saveLoad: true });
        }
    };

    footerView = (isSubmitting) => (
        <div className="fluid-width">
            <div className="footer-view">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            <NavLink to={{ pathname: `/userPersonal`, state: { tabKey: this.state.tabKey, userId: this.props.history.location.state.userData.userId } }}>
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

    onFinishFailed = (errorInfo) => {
        message.config({ maxCount: 1, duration: 1.5 });
        message.error(ValidationConstants.plzReviewPage);
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={AppConstants.user}
                    menuName={AppConstants.user}
                    onMenuHeadingClick={() => history.push("./userTextualDashboard")}
                />

                <InnerHorizontalMenu menu="user" userSelectedKey="5" />

                <Layout>
                    {!this.state.isPossibleMatchShow ? (
                        <>
                            {this.headerView()}
                            <Form
                                ref={this.formRef}
                                autoComplete="off"
                                onFinish={this.onSaveClick}
                                noValidate="noValidate"
                                onFinishFailed={this.onFinishFailed}
                            >
                                <Content>
                                    <div className="formView">{this.contentView()}</div>
                                    <Loader visible={
                                        this.props.userState.onUpUpdateLoad
                                        || this.props.commonReducerState.onLoad
                                    }
                                    />
                                </Content>

                                <Footer>{this.footerView()}</Footer>
                            </Form>
                        </>
                    ) : (
                        this.possibleMatchesDetailView(this.state.possibleMatches)
                    )}
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addChildAction,
        addParentAction,
        userProfileUpdateAction,
        getCommonRefData,
        getDocumentType,
        countryReferenceAction,
        nationalityReferenceAction,
        getGenderAction,
        disabilityReferenceAction,
        checkVenueDuplication,
        combinedAccreditationUmpieCoachRefrence,
        getUserParentDataAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        commonReducerState: state.CommonReducerState,
        userState: state.UserState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEdit);
