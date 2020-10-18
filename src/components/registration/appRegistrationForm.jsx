import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Input,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Radio, Form, Modal
} from "antd";
 import "./product.scss";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import {getUreAction} from "../../store/actions/userAction/userAction";
import ValidationConstants from "../../themes/validationConstant";
import {
    getCommonRefData,
    favouriteTeamReferenceAction,
    firebirdPlayerReferenceAction,
    registrationOtherInfoReferenceAction,
    countryReferenceAction,
    nationalityReferenceAction,
    heardByReferenceAction,
    playerPositionReferenceAction,
} from '../../store/actions/commonAction/commonAction';
import {
    saveEndUserRegistrationAction,
    updateEndUserRegisrationAction,
    orgRegistrationRegSettingsEndUserRegAction,
    membershipProductEndUserRegistrationAction,
} from '../../store/actions/registrationAction/endUserRegistrationAction';
import { getAge,deepCopyFunction} from '../../util/helpers';
import { bindActionCreators } from "redux";
const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const membershipProducts = [
    {
        competitionMembershipProductTypeId: 1, name: "Competitive Player", competitionMembershipProductDivisionId: 1,
        divisions: [{
            competitionMembershipProductDivisionId: 1,
            divisionName: "AR1",
            fromDate: null,
            toDate: null
        }, {
            competitionMembershipProductDivisionId: 5,
            divisionName: "AR5",
            fromDate: '1995-01-01',
            toDate: '2020-12-31'
        }], divisionName: "AR1", isPlayer: 1, isDisabled: false
    },
    {
        competitionMembershipProductTypeId: 2, name: "Social Player", competitionMembershipProductDivisionId: 2,
        divisions: [{
            competitionMembershipProductDivisionId: 2,
            divisionName: "AR2",
            fromDate: null,
            toDate: null
        }, {
            competitionMembershipProductDivisionId: 6,
            divisionName: "AR6",
            fromDate: '1995-01-01',
            toDate: '2020-12-31'
        }], divisionName: "AR2", isPlayer: 1, isDisabled: false
    },
    // {competitionMembershipProductTypeId: 3, name: "Coach", competitionMembershipProductDivisionId: 3, divisionName: "AR3",  isPlayer: 0, isDisabled: false },
    // {competitionMembershipProductTypeId: 4, name: "Umpire", competitionMembershipProductDivisionId: 4, divisionName: "AR4",  isPlayer: 0, isDisabled: false }
];

class AppRegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            agreeTerm: false,
            registeringYourself: 0,
            competitionUniqueKey: "779a053e-ab96-44a1-b26f-c433c8580a5a",
            organisationUniqueKey: "0b3ae01e-885d-40ef-9a07-a94c870133e1",
            competitionName: "NWA Winter 2020",
            showChildrenCheckNumber: false,
            volunteerList: [],
            modalVisible: false,
            modalKey: "",
            modalMessage: "",
            participantIndex: 0,
            productIndex: 0,
            subIndex: 0,
            buttonPressed: "",
        };

        this.props.getCommonRefData();
        this.props.firebirdPlayerReferenceAction();
        this.props.favouriteTeamReferenceAction();
        this.props.registrationOtherInfoReferenceAction();
        this.props.countryReferenceAction();
        this.props.nationalityReferenceAction();
        this.props.heardByReferenceAction();
        this.props.playerPositionReferenceAction();
    }

    componentDidMount() {
        let payload = {
            competitionUniqueKey: this.state.competitionUniqueKey,
            organisationUniqueKey: this.state.organisationUniqueKey
        }

        this.props.orgRegistrationRegSettingsEndUserRegAction(payload);
        this.props.membershipProductEndUserRegistrationAction(payload);
    }

    componentDidUpdate(nextProps) {
        let commonReducerState = this.props.commonReducerState;
        if (nextProps.commonReducerState !== commonReducerState) {
            if (commonReducerState.registrationOtherInfoOnLoad === false) {
                commonReducerState.registrationOtherInfoList.forEach(function (element) {
                    element.isActive = false;
                });
                this.setState({ volunteerList: commonReducerState.registrationOtherInfoList });
            }
        }
    }

    setImage = (data, index, key) => {
        if (data.files[0] !== undefined) {
            let registrationState = this.props.endUserRegistrationState;
            let registrationDetail = registrationState.registrationDetail;
            let userRegistrations = registrationDetail.userRegistrations;
            let userRegistration = userRegistrations[index];
            userRegistration[key] = data.files[0];
            userRegistration["profileUrl"] = URL.createObjectURL(data.files[0]);
            this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
        }
    };

    selectImage(index) {
        const fileInput = document.getElementById('user-pic' + index);
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    addParticipant = (registeringYourself) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let membershipProductInfo = registrationState.membershipProductInfo;
        let friendObj = {
            friendId: 0,
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: ""
        }
        let referFriendObj = {
            friendId: 0,
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: ""
        }
        let participantObj = {
            tempParticipantId: userRegistrations.length + 1,
            isVoucherAdded: false,
            whoAreYouRegistering: 0,
            whatTypeOfRegistration: 0,
            userId: 0,
            competitionMembershipProductTypeId: null,
            competitionMembershipProductDivisionId: 0,
            divisionName: "",
            genderRefId: 1,
            dateOfBirth: "",
            firstName: "",
            middleName: "",
            lastName: "",
            mobileNumber: "",
            email: "",
            reEnterEmail: "",
            street1: "",
            street2: "",
            suburb: "",
            stateRefId: 1,
            postalCode: "",
            statusRefId: 0,
            emergencyContactName: "",
            emergencyContactNumber: "",
            isPlayer: 0,
            userRegistrationId: 0,
            playedBefore: 0,
            playedYear: null,
            playedClub: "",
            playedGrade: "",
            lastCaptainName: "",
            existingMedicalCondition: "",
            regularMedication: "",
            heardByRefId: 0,
            heardByOther: "",
            favouriteTeamRefId: null,
            favouriteFireBird: null,
            isConsentPhotosGiven: 0,
            participantPhoto: null,
            profileUrl: null,
            voucherLink: "",
            isDisability: 0,
            playerId: 0,
            position1: null,
            position2: null,
            parentOrGuardian: {
                userId: 0,
                firstName: "",
                lastName: "",
                mobileNumber: "",
                email: "",
                street1: "",
                street2: "",
                suburb: "",
                stateRefId: 1,
                postalCode: "",
                isSameAddress: 0,
                reEnterEmail: ""
            },
            friends: [],
            referFriends: [],
            products: [],
            membershipProducts: []
        }

        if (registeringYourself === 1) {
            participantObj.friends.push(friendObj);
            participantObj.referFriends.push(referFriendObj);
            participantObj.isPlayer = 1;
            if (registrationDetail.vouchers.length === 0) {
                this.addVoucher();
            }
        } else if (registeringYourself === 2) {
            participantObj.isPlayer = 0;
        } else {
            participantObj.isPlayer = -1;
        }

        let newMembershipProducts = deepCopyFunction(membershipProductInfo.membershipProducts); // Deep Copy
        participantObj.membershipProducts = newMembershipProducts;

        userRegistrations.push(participantObj);
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    addProduct = (index) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let product = {
            divisionName: "",
            isPlayer: 0,
            position1: null,
            position2: null,
            competitionMembershipProductTypeId: null,
            competitionMembershipProductDivisionId: null,
            friends: [],
            referFriends: []
        }
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = registrationDetail.userRegistrations[index];
        let products = userRegistration.products;
        products.push(product);
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    addVoucher = () => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let vouchers = registrationDetail.vouchers;
        let voucher = {
            tempParticipantId: null,
            voucherLink: ""
        }
        vouchers.push(voucher);
        this.props.updateEndUserRegisrationAction(vouchers, "vouchers");
    }

    addFriend = (index, key, participantOrProduct, prodIndex) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index];

        let friendObj = {
            friendId: 0,
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: ""
        }
        if (participantOrProduct === "participant") {
            if (key === "friend") {
                userRegistration.friends.push(friendObj);
            } else if (key === "referFriend") {
                userRegistration.referFriends.push(friendObj);
            }
        } else if (participantOrProduct === "product") {
            let product = userRegistration.products[prodIndex];
            if (key === "friend") {
                product.friends.push(friendObj);
            } else if (key === "referFriend") {
                product.referFriends.push(friendObj);
            }
        }

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetRegistrationValue = (value, key) => {
        if (key === "whatTypeOfRegistration") {
            this.setState({ whatTypeOfRegistration: value });
        }

        this.props.updateEndUserRegisrationAction(value, key);
    }

    onChangeSetParticipantValue = (value, key, index) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index];
        if (key === "playedBefore" && value == 0) {
            userRegistration["playedYear"] = 0;
            userRegistration["playedClub"] = "";
            userRegistration["playedGrade"] = "";
        } else if (key === "competitionMembershipProductTypeId") {
            let memProd = userRegistration.membershipProducts.find(x => x.competitionMembershipProductTypeId === value);
            let divisionId = 0;
            let divisionName = "";
            let memDivision = memProd.divisions.find(x => x.fromDate != null && x.toDate != null
                && new Date(userRegistration.dateOfBirth) >= new Date(x.fromDate) && new Date(userRegistration.dateOfBirth) <= new Date(x.toDate));
            if (memDivision != null && memDivision != "" && memDivision != undefined) {
                divisionId = memDivision.competitionMembershipProductDivisionId;
                divisionName = memDivision.divisionName;
            } else {
                let memDivision = memProd.divisions.find(x => x.fromDate == null && x.toDate == null);
                if (memDivision != null && memDivision != "" && memDivision != undefined) {
                    divisionId = memDivision.competitionMembershipProductDivisionId;
                    divisionName = memDivision.divisionName;
                }
            }
            userRegistration["competitionMembershipProductDivisionId"] = divisionId;
            userRegistration["divisionName"] = divisionName;
            userRegistration["isPlayer"] = memProd.isPlayer;
            // Enable the existing one and disable the new one
            let oldMemProd = userRegistration.membershipProducts.find(x => x.competitionMembershipProductTypeId === userRegistration.competitionMembershipProductTypeId);
            if (oldMemProd != null && oldMemProd != "" && oldMemProd != undefined) {
                oldMemProd.isDisabled = false;
            }
            memProd.isDisabled = true;
        } else if (key === "whatTypeOfRegistration") {
            if (value === 1) {
                let friendObj = {
                    friendId: 0,
                    firstName: "",
                    lastName: "",
                    email: "",
                    mobileNumber: ""
                }
                let referFriendObj = {
                    friendId: 0,
                    firstName: "",
                    lastName: "",
                    email: "",
                    mobileNumber: ""
                }
                userRegistration["isPlayer"] = 1;
                userRegistration.friends.push(friendObj);
                userRegistration.referFriends.push(referFriendObj);
            } else {
                userRegistration["isPlayer"] = 0;
            }
        }
        userRegistration[key] = value;
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetParentValue = (value, key, index) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index];
        userRegistration.parentOrGuardian[key] = value;

        if (key === "isSameAddress") {
            if (value === true || value === 1) {
                userRegistration.parentOrGuardian["street1"] = userRegistration.street1;
                userRegistration.parentOrGuardian["street2"] = userRegistration.street2;
                userRegistration.parentOrGuardian["suburb"] = userRegistration.suburb;
                userRegistration.parentOrGuardian["stateRefId"] = userRegistration.stateRefId;
                userRegistration.parentOrGuardian["postalCode"] = userRegistration.postalCode;
            } else {
                userRegistration.parentOrGuardian["street1"] = null;
                userRegistration.parentOrGuardian["street2"] = null;
                userRegistration.parentOrGuardian["suburb"] = null;
                userRegistration.parentOrGuardian["stateRefId"] = null;
                userRegistration.parentOrGuardian["postalCode"] = null;
            }
        }

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetProdMemberTypeValue = (value, index, prodIndex) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index];
        let product = userRegistration.products[prodIndex];

        let memProd = userRegistration.membershipProducts.find(x => x.competitionMembershipProductTypeId === value);

        let divisionId = 0;
        let divisionName = "";
        let memDivision = memProd.divisions.find(x => x.fromDate != null && x.toDate != null
            && new Date(userRegistration.dateOfBirth) >= new Date(x.fromDate) && new Date(userRegistration.dateOfBirth) <= new Date(x.toDate));
        if (memDivision != null && memDivision != "" && memDivision != undefined) {
            divisionId = memDivision.competitionMembershipProductDivisionId;
            divisionName = memDivision.divisionName;
        } else {
            let memDivision = memProd.divisions.find(x => x.fromDate == null && x.toDate == null);
            if (memDivision != null && memDivision != "" && memDivision != undefined) {
                divisionId = memDivision.competitionMembershipProductDivisionId;
                divisionName = memDivision.divisionName;
            }
        }

        product["isPlayer"] = memProd.isPlayer;
        product["competitionMembershipProductTypeId"] = memProd.competitionMembershipProductTypeId;
        product["competitionMembershipProductDivisionId"] = divisionId;
        product["divisionName"] = divisionName;

        // Enable the existing one and disable the new one
        let oldMemProd = userRegistration.membershipProducts.find(x => x.competitionMembershipProductTypeId === product.competitionMembershipProductTypeId);
        if (oldMemProd != null && oldMemProd != "" && oldMemProd != undefined) {
            oldMemProd.isDisabled = false;
        }
        memProd.isDisabled = true;

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");

        if (memProd.isPlayer) {
            this.addFriend(index, "friend", "product", prodIndex);
            this.addFriend(index, "referFriend", "product", prodIndex);
        }
    }

    onChangeSetVolunteerValue = (value, index) => {
        let volunteerList = [...this.state.volunteerList];
        volunteerList[index].isActive = value;

        let filterList = volunteerList.filter(x => (x.id === 1 && x.isActive) || (x.id == 3 && x.isActive));
        if (filterList != null && filterList != "" && filterList != undefined) {
            this.setState({ showChildrenCheckNumber: true });
        } else {
            this.setState({ showChildrenCheckNumber: false });
        }
        this.setState({ volunteerList: volunteerList });
    }

    onChangeSetValue = (e, index, participantOrProduct, productIndex, key, subIndex, subKey) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[index];
        if (participantOrProduct === "participant") {
            if (key === "positions") {
                userRegistration[subKey] = e;
            } else if (key === "friend") {
                let friend = userRegistration.friends[subIndex];
                friend[subKey] = e;
            } else if (key === "referFriend") {
                let referFriend = userRegistration.referFriends[subIndex];
                referFriend[subKey] = e;
            }
        } else {
            let product = userRegistration.products[productIndex];
            if (key === "positions") {
                product[subKey] = e;
            } else if (key === "friend") {
                let friend = product.friends[subIndex];
                friend[subKey] = e;
            } else if (key === "referFriend") {
                let referFriend = product.referFriends[subIndex];
                referFriend[subKey] = e;
            }
        }

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    onChangeSetRegYourself = (e) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        // let userRegistrations = registrationDetail.userRegistrations;
        //clearing up the existing participants
        let newUserRegistration = [];
        let vouchers = [];
        this.props.updateEndUserRegisrationAction(newUserRegistration, "userRegistrations");
        this.props.updateEndUserRegisrationAction(vouchers, "vouchers");
        this.setState({ registeringYourself: e });
        this.addParticipant(e);
    }

    onChangeSetVoucherValue = (value, key, index) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let vouchers = registrationDetail.vouchers;
        let voucher = vouchers[index];
        let oldTempParticipantId = voucher.tempParticipantId;

        if (key === "tempParticipantId") {
            let oldTempParticipant = userRegistrations.find(x => x.tempParticipantId === oldTempParticipantId);
            if (oldTempParticipant != null && oldTempParticipant != undefined && oldTempParticipant != "") {
                oldTempParticipant.isVoucherAdded = false;
            }

            let newTempParticipant = userRegistrations.find(x => x.tempParticipantId === value);
            newTempParticipant.isVoucherAdded = true;
        }

        voucher[key] = value;

        this.props.updateEndUserRegisrationAction(vouchers, "vouchers");
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    deleteEnableOrDisablePopup = (key, value, participantIndex, productIndex, subIndex, message, subKey) => {
        let modalKey = key;
        let modalMessage = message;
        if (subKey != null) {
            modalKey = key + subKey;
        }
        if (key === "participant" && subKey == null) {
            modalMessage = AppConstants.participantDeleteConfirmMsg;
        } else if (key === "product" && subKey == null) {
            modalMessage = AppConstants.productDeleteConfirmMsg;
        }
        this.setState({
            modalVisible: value,
            participantIndex: participantIndex,
            productIndex: productIndex,
            subIndex: subIndex,
            modalMessage: modalMessage,
            modalKey: modalKey
        });
    }

    removeModalPopup = (modalOption) => {
        if (modalOption === "ok") {
            if (this.state.modalKey === "participant") {
                this.removeParticipant();
            } else if (this.state.modalKey === "product") {
                this.removeProduct();
            } else if (
                this.state.modalKey === "participantFriend" ||
                this.state.modalKey === "participantReferFriend" ||
                this.state.modalKey === "productFriend" || this.state.modalKey === "productReferFriend"
            ) {
                this.removeFriend();
            } else if (this.state.modalKey === "registrationOption") {
                this.removeRegistration();
            } else if (this.state.modalKey === "voucher") {
                this.removeVoucher();
            }
        }
        this.setState({ modalVisible: false });
    }

    removeParticipant = () => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[this.state.participantIndex];
        let vouchers = registrationDetail.vouchers;

        let deletedTempParticipant = vouchers.find(x => x.tempParticipantId === userRegistration.tempParticipantId);

        if (deletedTempParticipant != null && deletedTempParticipant != "" && deletedTempParticipant != undefined) {
            let newVouchers = vouchers.filter(x => x.tempParticipantId != userRegistration.tempParticipantId);
            if (newVouchers != null && newVouchers != "" && newVouchers != undefined) {
                this.props.updateEndUserRegisrationAction(newVouchers, "vouchers");
            } else {
                this.props.updateEndUserRegisrationAction([], "vouchers");
            }
        }

        userRegistrations.splice(this.state.participantIndex, 1);

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    removeProduct = () => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[this.state.participantIndex];
        let product = userRegistration.products[this.state.productIndex];
        userRegistration.products.splice(this.state.productIndex, 1);

        // Enable the existing one
        let memProd = userRegistration.membershipProducts.find(x => x.competitionMembershipProductTypeId === product.competitionMembershipProductTypeId);
        if (memProd != null && memProd != "" && memProd != undefined) {
            memProd.isDisabled = false;
        }

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    removeFriend = () => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let userRegistration = userRegistrations[this.state.participantIndex];
        if (this.state.modalKey === "participantFriend") {
            userRegistration.friends.splice(this.state.subIndex, 1);
        } else if (this.state.modalKey === "participantReferFriend") {
            userRegistration.referFriends.splice(this.state.subIndex, 1);
        } else if (this.state.modalKey === "productFriend") {
            userRegistration.products[this.state.productIndex].friends.splice(this.state.subIndex, 1);
        } else if (this.state.modalKey === "productReferFriend") {
            userRegistration.products[this.state.productIndex].referFriends.splice(this.state.subIndex, 1);
        }

        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    removeRegistration = () => {

    }

    removeVoucher = (modalOption) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let vouchers = registrationDetail.vouchers;
        let voucher = vouchers[this.state.subIndex];

        let tempParticipant = userRegistrations.find(x => x.tempParticipantId === voucher.tempParticipantId);
        if (tempParticipant != null && tempParticipant != "" && tempParticipant != undefined) {
            tempParticipant.isVoucherAdded = false;
        }

        vouchers.splice(this.state.subIndex, 1);
        this.props.updateEndUserRegisrationAction(vouchers, "vouchers");
        this.props.updateEndUserRegisrationAction(userRegistrations, "userRegistrations");
    }

    saveRegistrationForm = (e) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        registrationDetail.organisationUniqueKey = this.state.organisationUniqueKey;
        registrationDetail.competitionUniqueKey = this.state.competitionUniqueKey;
        let formData = new FormData();
        for (let x = 0; x < userRegistrations.length; x++) {
            let userRegistration = userRegistrations[x];
            formData.append("participantPhoto", userRegistration.participantPhoto);
        }

        formData.append("registrationDetail", JSON.stringify(registrationDetail));

        this.props.saveEndUserRegistrationAction(formData);
    }

    ///////view for breadcrumb
    headerView = () => (
        <div className="header-view">
            <Header
                className="form-header-view"
                style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "flex-start"
                }}
            >
                <Breadcrumb
                    style={{ alignItems: "center", alignSelf: "center" }}
                    separator=" > "
                >
                    {/* <NavLink to="/registration">
                        <Breadcrumb.Item className="breadcrumb-product">Products</Breadcrumb.Item>
                    </NavLink> */}
                    <Breadcrumb.Item className="breadcrumb-add">
                        {AppConstants.appRegoForm}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Header>
        </div>
    );

    registeringYourselfView = () => (
        <div className="formView content-view pt-5">
            <span className="form-heading">{AppConstants.registration}</span>
            <InputWithHead heading={AppConstants.areYouRegisteringYourself} />
            <Radio.Group
                className="reg-competition-radio"
                onChange={(e) => this.onChangeSetRegYourself(e.target.value)}
                value={this.state.registeringYourself}
            >
                <Radio value={1}>{AppConstants.yesAsAPlayer}</Radio>
                <Radio value={2}>{AppConstants.yesAsANonPlayer}</Radio>
                <Radio value={3}>{AppConstants.registeringSomeoneElse}</Radio>
            </Radio.Group>
        </div>
    );

    registrationQuestionView = (item, index) => (
        <div className="formView content-view pt-5">
             <span className="form-heading"> {AppConstants.registration}</span>
             {this.state.registeringYourself == 3 && (
                 <div>
                    <InputWithHead heading={AppConstants.whoAreYouRegistering} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={ (e) => this.onChangeSetParticipantValue(e.target.value, "whoAreYouRegistering", index)}
                        value={item.whoAreYouRegistering}
                    >
                        <Radio value={1}>{AppConstants.child}</Radio>
                        <Radio value={2}>{AppConstants.other}</Radio>
                        <Radio value={3}>{AppConstants.team}</Radio>
                    </Radio.Group>

                    <InputWithHead heading={AppConstants.whatTypeOfRegistration} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={ (e) => this.onChangeSetParticipantValue(e.target.value, "whatTypeOfRegistration", index)}
                        value={item.whatTypeOfRegistration}
                    >
                        <Radio value={1}>{AppConstants.playerHeading}</Radio>
                        <Radio value={2}>{AppConstants.nonPlayer}</Radio>
                    </Radio.Group>
                </div>
            )}

            <InputWithHead heading={AppConstants.gender} required="required-field" />
            <Form.Item
                name={`genderRefId${index}`}
                rules={[{ required: true, message: ValidationConstants.genderField }]}
            >
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "genderRefId", index)}
                    // value={item.genderRefId}
                    value={item.genderRefId}
                >
                    <Radio value={1}>{AppConstants.female}</Radio>
                    <Radio value={2}>{AppConstants.male}</Radio>
                    <Radio value={3}>{AppConstants.unspecified}</Radio>
                </Radio.Group>
            </Form.Item>

            <InputWithHead heading={AppConstants.dob} required="required-field" />
            <Form.Item
                name={`dateOfBirth${index}`}
                rules={[{ required: true, message: ValidationConstants.dateOfBirth }]}
            >
                <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    onChange={e => this.onChangeSetParticipantValue(e, "dateOfBirth", index)}
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    name="Dob"
                />
            </Form.Item>
        </div>
    );

    membershipProductView = (item, index) => {
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let membershipProdecutInfo = this.props.endUserRegistrationState.membershipProductInfo;
        return (
            <div className="formView content-view pt-5">
             <span className="form-heading">{AppConstants.competitionMembershipProductDivision}</span>
                {index == 0 && (
                    <InputWithHead
                        heading={AppConstants.enterPostCode}
                        placeholder={AppConstants.enterPostCode}
                        onChange={(e) => this.onChangeSetRegistrationValue(e.target.value, "postalCode")}
                        value={registrationDetail.postalCode}
                        maxLength={4}
                    />
                )}
                {index == 0 && (
                    <InputWithHead
                        heading={AppConstants.alternate_location}
                        placeholder={AppConstants.alternate_location}
                        onChange={(e) => this.onChangeSetRegistrationValue(e.target.value, "alternativeLocation")}
                        value={registrationDetail.alternativeLocation}
                    />
                )}

                <InputWithHead heading={AppConstants.competition_name} />
                <div style={{ display: 'flex' }} className="applicable-to-text">
                    <div>{membershipProdecutInfo.competitionName}</div>
                    {index == 0 && (
                        <div className="another-competition">Find Another Competition</div>
                    )}
                </div>

                {index == 0 && (
                    <div>
                        <InputWithHead heading={AppConstants.specialNotes} />
                        <div className="applicable-to-text">{membershipProdecutInfo.specialNote}</div>
                        <InputWithHead heading={AppConstants.training} />
                        <div className="applicable-to-text">{membershipProdecutInfo.training}</div>
                    </div>
                )}

                <InputWithHead heading={AppConstants.membershipProduct} required="required-field" />
                <Form.Item
                    name={`competitionMembershipProductTypeId${index}`}
                    rules={[{ required: true, message: ValidationConstants.membershipProductRequired }]}
                >
                    <Select
                        style={{ width: "100%", paddingRight: 1 }}
                        onChange={(e) => this.onChangeSetParticipantValue(e, "competitionMembershipProductTypeId", index )}
                        value={item.competitionMembershipProductTypeId}
                    >
                        {(item.membershipProducts || []).map((mem, index) => (
                            <Option
                                key={mem.competitionMembershipProductTypeId}
                                value={mem.competitionMembershipProductTypeId}
                                disabled={mem.isDisabled}
                            >
                                {mem.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <InputWithHead heading={AppConstants.divisions} />
                <div className="applicable-to-text">{item.divisionName}</div>
                {/* <Select
                    style={{ width: "100%", paddingRight: 1 }}
                    onChange={(e) => this.onChangeSetValue(e, "" )}
                >
                    {(divisions || []).map((division, index) => (
                        <Option key={division.id} value={division.id}>{division.name}</Option>
                    ))}
                </Select> */}
            </div>
        )
    }

    participantDetailView = (item, index) => {
        const { stateList } = this.props.commonReducerState;
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading">{AppConstants.participantDetails}</span>
                <Form.Item
                    name={`participantFirstName${index}`}
                    rules={[{ required: true, message: ValidationConstants.nameField[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.participant_firstName}
                        placeholder={AppConstants.participant_firstName}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "firstName",index )}
                        value={item.firstName}
                    />
                </Form.Item>

                <InputWithHead
                    heading={AppConstants.participant_middleName}
                    placeholder={AppConstants.participant_middleName}
                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "middleName", index )}
                    value={item.middleName}
                />

                <Form.Item
                    name={`participantLastName${index}`}
                    rules={[{ required: true, message: ValidationConstants.nameField[1] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.participant_lastName}
                        placeholder={AppConstants.participant_lastName}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "lastName", index )}
                        value={item.lastName}
                    />
                </Form.Item>
                <Form.Item
                    name={`participantMobileNumber${index}`}
                    rules={[{ required: true, message: ValidationConstants.contactField }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.contactMobile}
                        placeholder={AppConstants.contactMobile}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "mobileNumber", index )}
                        value={item.mobileNumber}
                    />
                </Form.Item>
                <Form.Item
                    name={`participantEmail${index}`}
                    rules={[{ required: true, message: ValidationConstants.emailField[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.contactEmail}
                        placeholder={AppConstants.contactEmail}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "email", index )}
                        value={item.email}
                    />
                </Form.Item>
                <Form.Item
                    name={`participantReEnterEmail${index}`}
                    rules={[{ required: true, message: ValidationConstants.emailField[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.reenterEmail}
                        placeholder={AppConstants.reenterEmail}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "reEnterEmail", index )}
                        value={item.reEnterEmail}
                    />
                </Form.Item>
                <InputWithHead heading={AppConstants.photo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="reg-competition-logo-view" onClick={ () => this.selectImage(index)}>
                                <label>
                                    <img
                                        src={item.profileUrl == null ? AppImages.circleImage  : item.profileUrl}
                                        alt=""
                                        height="120"
                                        width="120"
                                        style={{ borderRadius: 60 }}
                                        name="image"
                                        onError={ev => {
                                            ev.target.src = AppImages.circleImage;
                                        }}
                                    />
                                </label>
                            </div>
                            <input
                                type="file"
                                id= {"user-pic" + index}
                                style={{ display: 'none' }}
                                onChange={(evt) => this.setImage(evt.target, index, "participantPhoto")}
                            />
                        </div>
                        <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                            <InputWithHead heading={AppConstants.takePhoto} />
                        </div>
                        <div className="col-sm-1" style={{ display: "flex", alignItems: "center" }}>
                            <InputWithHead heading={AppConstants.or} />
                        </div>
                        <div className="col-sm-2" style={{ display: "flex", alignItems: "center" }}>
                            <InputWithHead heading={AppConstants.uploadPhoto} />
                        </div>
                    </div>
                </div>

                <span className="applicable-to-heading" style={{ fontSize: '18px' }}>{AppConstants.address}</span>
                <Form.Item
                    name={`participantStreet1${index}`}
                    rules={[{ required: true, message: ValidationConstants.addressField }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.addressOne}
                        placeholder={AppConstants.addressOne}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "street1", index )}
                        value={item.street1}
                    />
                </Form.Item>
                <InputWithHead
                    heading={AppConstants.addressTwo}
                    placeholder={AppConstants.addressTwo}
                    onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "street2", index )}
                    value={item.street2}
                />
                <Form.Item
                    name={`participantSuburb${index}`}
                    rules={[{ required: true, message: ValidationConstants.suburbField[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.suburb}
                        placeholder={AppConstants.suburb}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "suburb", index )}
                        value={item.suburb}
                    />
                </Form.Item>

                <InputWithHead heading={AppConstants.stateHeading} required="required-field" />
                <Form.Item
                    name={`participantStateRefId${index}`}
                    rules={[{ required: true, message: ValidationConstants.stateField[0] }]}
                >
                    <Select
                        style={{ width: "100%" }}
                        placeholder={AppConstants.select}
                        onChange={(e) => this.onChangeSetParticipantValue(e, "stateRefId", index )}
                        value={item.stateRefId}
                    >
                        {stateList.length > 0 && stateList.map((item) => (
                            <Option key={item.id} value={item.id}> {item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name={`participantPostalCode${index}`}
                    rules={[{ required: true, message: ValidationConstants.postCodeField[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.postcode}
                        placeholder={AppConstants.postcode}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "postalCode", index )}
                        value={item.postalCode}
                    />
                </Form.Item>

                <Form.Item
                    name={`participantEmergencyContactName${index}`}
                    rules={[{ required: true, message: ValidationConstants.emergencyContactName[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.emergencyContactName}
                        placeholder={AppConstants.emergencyContactName}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "emergencyContactName", index)}
                        value={item.emergencyContactName}
                    />
                </Form.Item>

                <Form.Item
                    name={`participantEmergencyContactNumber${index}`}
                    rules={[{ required: true, message: ValidationConstants.emergencyContactNumber[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.emergencyContactMobile}
                        placeholder={AppConstants.emergencyContactMobile}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "emergencyContactNumber", index)}
                        value={item.emergencyContactNumber}
                    />
                </Form.Item>
            </div>
        )
    }

    parentGuardianView = (item, index) => {
        const { stateList } = this.props.commonReducerState;
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading">
                    {AppConstants.parents_guardians}
                </span>
                <Form.Item
                    name={`parentFirstName${index}`}
                    rules={[{ required: true, message: ValidationConstants.nameField[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.firstName}
                        placeholder={AppConstants.firstName}
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "firstName", index)}
                        value={item.parentOrGuardian.firstName}
                    />
                </Form.Item>

                <Form.Item
                    name={`parentLastName${index}`}
                    rules={[{ required: true, message: ValidationConstants.nameField[1] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.lastName}
                        placeholder={AppConstants.lastName}
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "lastName", index)}
                        value={item.parentOrGuardian.lastName}
                    />
                </Form.Item>
                <Form.Item
                    name={`parentLastName${index}`}
                    rules={[{ required: true, message: ValidationConstants.contactField[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.mobile}
                        placeholder={AppConstants.mobile}
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "mobileNumber", index)}
                        value={item.parentOrGuardian.mobileNumber}
                    />
                </Form.Item>
                <Form.Item
                    name={`parentEmail${index}`}
                    rules={[{ required: true, message: ValidationConstants.emailField[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.email}
                        placeholder={AppConstants.email}
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "email", index)}
                        value={item.parentOrGuardian.email}
                    />
                </Form.Item>
                <Form.Item
                    name={`parentReEnterEmail${index}`}
                    rules={[{ required: true, message: ValidationConstants.emailField[0] }]}
                >
                    <InputWithHead
                        required="required-field pt-0 pb-0"
                        heading={AppConstants.reenterEmail}
                        placeholder={AppConstants.reenterEmail}
                        onChange={(e) => this.onChangeSetParentValue(e.target.value, "reEnterEmail", index)}
                        value={item.parentOrGuardian.reEnterEmail}
                    />
                </Form.Item>
                <Checkbox
                    className="single-checkbox"
                    checked={item.parentOrGuardian.isSameAddress}
                    onChange={e => this.onChangeSetParentValue(e.target.checked, "isSameAddress", index)}
                >
                    {AppConstants.sameAddress}
                </Checkbox>
                {!item.parentOrGuardian.isSameAddress && (
                    <div>
                        <span className="applicable-to-heading" style={{ fontSize: '18px' }}>
                            {AppConstants.address}
                        </span>
                        <Form.Item
                            name={`parentStreet1${index}`}
                            rules={[{ required: true, message: ValidationConstants.addressField[0] }]}
                        >
                            <InputWithHead
                                required="required-field pt-0 pb-0"
                                heading={AppConstants.addressOne}
                                placeholder={AppConstants.addressOne}
                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "street1", index)}
                                value={item.parentOrGuardian.street1}
                            />
                        </Form.Item>
                        <InputWithHead
                            heading={AppConstants.addressTwo}
                            placeholder={AppConstants.addressTwo}
                            onChange={(e) => this.onChangeSetParentValue(e.target.value, "street2", index)}
                            value={item.parentOrGuardian.street2}
                        />
                        <Form.Item
                            name={`parentSuburb${index}`}
                            rules={[{ required: true, message: ValidationConstants.suburbField[0] }]}
                        >
                            <InputWithHead
                                required="required-field pt-0 pb-0"
                                heading={AppConstants.suburb}
                                placeholder={AppConstants.suburb}
                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "suburb", index)}
                                value={item.parentOrGuardian.suburb}
                            />
                        </Form.Item>

                        <InputWithHead heading={AppConstants.stateHeading} required="required-field" />
                        <Form.Item
                            name={`parentStateRefId${index}`}
                            rules={[{ required: true, message: ValidationConstants.stateField[0] }]}
                        >
                            <Select
                                style={{ width: "100%" }}
                                placeholder={AppConstants.select}
                                onChange={(e) => this.onChangeSetParentValue(e, "stateRefId", index)}
                                value={item.parentOrGuardian.stateRefId}
                            >
                                {stateList.length > 0 && stateList.map((item) => (
                                    <Option key={item.id} value={item.id}> {item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name={`parentPostalCode${index}`}
                            rules={[{ required: true, message: ValidationConstants.postCodeField[0] }]}
                        >
                            <InputWithHead
                                required="required-field pt-0 pb-0"
                                heading={AppConstants.postcode}
                                placeholder={AppConstants.postcode}
                                onChange={(e) => this.onChangeSetParentValue(e.target.value, "postalCode", index)}
                                value={item.parentOrGuardian.postalCode}
                                maxLength={4}
                            />
                        </Form.Item>
                    </div>
                )}
                {/* <span className="input-heading-add-another">
                    + {AppConstants.addParent_guardian}
                </span> */}
            </div>
        )
    }

    additionalPersonalInfoView = (item, index) => {
        let registrationState = this.props.endUserRegistrationState;
        let regSetting = registrationState.registrationSettings;
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading">
                    {AppConstants.additionalPersonalInfoReqd}
                </span>
                {regSetting.played_before === 1 && (
                    <div>
                        <span className="applicable-to-heading">
                            {AppConstants.haveYouEverPlayed}
                        </span>
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedBefore", index)}
                            value={item.playedBefore}
                        >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            {item.playedBefore && (
                                <div className="pl-5 pb-5">
                                    <InputWithHead
                                        heading={AppConstants.year}
                                        placeholder={AppConstants.year}
                                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedYear", index)}
                                        value={item.playedYear}
                                        maxLength={4}
                                    />

                                    <InputWithHead
                                        heading={AppConstants.clubOther}
                                        placeholder={AppConstants.clubOther}
                                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedClub", index)}
                                        value={item.playedClub}
                                    />

                                    <InputWithHead
                                        heading={AppConstants.grade}
                                        placeholder={AppConstants.grade}
                                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "playedGrade", index)}
                                        value={item.playedGrade}
                                    />
                                </div>
                            )}
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                    </div>
                )}
                {regSetting.last_captain === 1 && (
                    <div>
                        <span className="applicable-to-heading">
                            {AppConstants.lastCaptainName}
                        </span>
                        <InputWithHead
                            heading={AppConstants.fullName}
                            placeholder={AppConstants.lastCaptainName}
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "lastCaptainName", index)}
                            value={item.lastCaptainName}
                        />
                    </div>
                )}
            </div>
        )
    }

    playerPosition = (item, index, participantOrProduct, productIndex) => {
        const { playerPositionList } = this.props.commonReducerState;
        let subIndex = 0;
        return (
            <div className="formView content-view pt-5">
                <InputWithHead heading={AppConstants.indicatePreferredPlayerPosition} />

                <InputWithHead heading={AppConstants.position1} />
                <Select
                    style={{ width: "100%", paddingRight: 1 }}
                    onChange={(e) => this.onChangeSetValue(e, index, participantOrProduct, productIndex, "positions", subIndex, "position1")}
                    value={item.position1}
                >
                    {(playerPositionList || []).map((play1, index) => (
                        <Option key={play1.id} value={play1.id}>{play1.name}</Option>
                    ))}
                </Select>

                <InputWithHead heading={AppConstants.position2} />
                <Select
                    style={{ width: "100%", paddingRight: 1 }}
                    onChange={(e) => this.onChangeSetValue(e, index, participantOrProduct, productIndex, "positions", subIndex, "position2")}
                    value={item.position2}
                >
                    {(playerPositionList || []).map((play2, index) => (
                        <Option key={play2.id} value={play2.id}>{play2.name}</Option>
                    ))}
                </Select>
            </div>
        )
    }

    playWithFriendView = (item, index, participantOrProduct, productIndex) => {
        // const styles = { marginTop: '30px', width: '100%' };
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading">{AppConstants.playWithFriend}</span>
                <span className="form-heading" style={{ fontSize: "10px" }}>{AppConstants.playWithFriendSubtitle}</span>

                {(item.friends || []).map((friend, friendIndex) => (
                    <div key={"friend" + friendIndex} className="inside-container-view pt-0">
                        <div className="row">
                            <div className="col-sm">
                                <span className="user-contact-heading">{"FRIEND " + (friendIndex + 1)}</span>
                            </div>
                            <div
                                className="transfer-image-view pointer"
                                onClick={() => this.deleteEnableOrDisablePopup(participantOrProduct, true, index, productIndex, friendIndex, AppConstants.friendDeleteConfirmMsg, "Friend")}
                            >
                                <span className="user-remove-btn">
                                    <i className="fa fa-trash-o" aria-hidden="true" />
                                </span>
                                <span className="user-remove-text">
                                    {AppConstants.remove}
                                </span>
                            </div>
                        </div>
                        <InputWithHead
                            heading={AppConstants.firstName}
                            placeholder={AppConstants.firstName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "firstName")}
                            value={friend.firstName}
                        />
                        <InputWithHead
                            heading={AppConstants.lastName}
                            placeholder={AppConstants.lastName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "lastName")}
                            value={friend.lastName}
                        />
                        <InputWithHead
                            heading={AppConstants.email}
                            placeholder={AppConstants.email}
                            onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "email")}
                            value={friend.email}
                        />
                        <InputWithHead
                            heading={AppConstants.mobile}
                            placeholder={AppConstants.mobile}
                            onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "friend", friendIndex, "mobileNumber")}
                            value={friend.mobileNumber}
                        />
                    </div>
                ))}
                <span
                    className="input-heading-add-another pointer"
                    onClick={() => this.addFriend(index, "friend", participantOrProduct, productIndex)}
                >
                    + {AppConstants.addfriend}
                </span>
            </div>
        )
    }

    referAFriendView = (item, index, participantOrProduct, productIndex) => {
        // const styles = { marginTop: '30px', width: '100%' };
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading">{AppConstants.referfriend}</span>
                <span className="form-heading" style={{ fontSize: "10px" }}>{AppConstants.friendLiketoPlay}</span>

                {(item.referFriends || []).map((friend, friendIndex) => (
                    <div key={"referFriend" + friendIndex} className="inside-container-view pt-0">
                        <div className="row">
                            <div className="col-sm">
                                <span className="user-contact-heading">{"FRIEND " + (friendIndex + 1)}</span>
                            </div>
                            <div
                                className="transfer-image-view pointer"
                                onClick={() => this.deleteEnableOrDisablePopup(participantOrProduct, true, index, productIndex, friendIndex, AppConstants.friendDeleteConfirmMsg, "ReferFriend")}
                            >
                                <span className="user-remove-btn">
                                    <i className="fa fa-trash-o" aria-hidden="true" />
                                </span>
                                <span className="user-remove-text">
                                    {AppConstants.remove}
                                </span>
                            </div>
                        </div>
                        <InputWithHead
                            heading={AppConstants.firstName}
                            placeholder={AppConstants.firstName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "firstName")}
                            value={friend.firstName}
                        />
                        <InputWithHead
                            heading={AppConstants.lastName}
                            placeholder={AppConstants.lastName}
                            onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "lastName")}
                            value={friend.lastName}
                        />
                        <InputWithHead
                            heading={AppConstants.email}
                            placeholder={AppConstants.email}
                            onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "email")}
                            value={friend.email}
                        />
                        <InputWithHead
                            heading={AppConstants.mobile}
                            placeholder={AppConstants.mobile}
                            onChange={(e) => this.onChangeSetValue(e.target.value, index, participantOrProduct, productIndex, "referFriend", friendIndex, "mobileNumber")}
                            value={friend.mobileNumber}
                        />
                    </div>
                ))}
                <span
                    className="input-heading-add-another pointer"
                    onClick={() => this.addFriend(index, "referFriend", participantOrProduct, productIndex)}
                >
                    + {AppConstants.addfriend}
                </span>
            </div>
        )
    }

    additionalInfoView = (item, index) => {
        let registrationState = this.props.endUserRegistrationState;
        let regSetting = registrationState.registrationSettings;
        const { favouriteTeamsList, firebirdPlayerList, heardByList } = this.props.commonReducerState;
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading"> {AppConstants.additionalInfoReqd} </span>
                <InputWithHead heading={AppConstants.existingMedConditions} required="required-field" />
                <Form.Item name={`existingMedicalCondition${index}`}
                           rules={[{ required: true, message: ValidationConstants.existingMedicalCondition[0] }]}>
                    <TextArea
                        placeholder={AppConstants.existingMedConditions}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "existingMedicalCondition", index)}
                        value={item.existingMedicalCondition}
                        allowClear
                    />
                </Form.Item>

                <InputWithHead heading={AppConstants.redularMedicalConditions} required="required-field" />
                <Form.Item name={`regularMedication${index}`}
                           rules={[{ required: true, message: ValidationConstants.regularMedication[0] }]}>
                    <TextArea
                        placeholder={AppConstants.redularMedicalConditions}
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "regularMedication", index)}
                        value={item.regularMedication}
                        allowClear
                    />
                </Form.Item>
                <InputWithHead heading={AppConstants.hearAbouttheCompition} required="required-field" />
                <Form.Item name={`heardByRefId${index}`}
                           rules={[{ required: true, message: ValidationConstants.heardBy[0] }]}>
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "heardByRefId", index)}
                        value={item.heardByRefId}
                    >
                        {(heardByList || []).map((heard, index) => (
                            <Radio key={heard.id} value={heard.id}>{heard.description}</Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>
                {item.heardByRefId == 5 && (
                    <div className="pl-5 pr-5">
                        <InputWithHead
                            placeholder={AppConstants.other}
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "heardByOther", index)}
                            value={item.heardByOther}
                        />
                    </div>
                )}

                <InputWithHead heading={AppConstants.favouriteTeam} required="required-field" />
                <Form.Item name={`favouriteTeamRefId${index}`}
                           rules={[{ required: true, message: ValidationConstants.favoriteTeamField[0] }]}>
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={(e) => this.onChangeSetParticipantValue(e, "favouriteTeamRefId", index)}
                        value={item.favouriteTeamRefId}
                    >
                        {(favouriteTeamsList || []).map((fav, index) => (
                            <Option key={fav.id} value={fav.id}>{fav.description}</Option>
                        ))}
                    </Select>
                </Form.Item>

                {item.favouriteTeamRefId === 6 && regSetting.attended_state_game === 1 ? (
                    <div>
                        <InputWithHead heading={AppConstants.who_fav_bird} required="required-field" />
                        <Form.Item name={`favouriteFireBird${index}`} rules={[{
                            required: item.favouriteTeamRefId === 6,
                            message: ValidationConstants.firebirdField[0]
                        }]}>
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(e) => this.onChangeSetParticipantValue(e, "favouriteFireBird", index)}
                                value={item.favouriteFireBird}
                            >
                                {(firebirdPlayerList || []).map((fire, index) => (
                                    <Option key={fire.id} value={fire.id}>{fire.description}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                ) : null}

                {regSetting.photo_consent === 1 && (
                    <Checkbox
                        className="single-checkbox pt-3"
                        onChange={(e) => this.onChangeSetParticipantValue(e.target.checked, "isConsentPhotosGiven", index)}
                        checked={item.isConsentPhotosGiven}
                    >
                        {AppConstants.consentForPhotos}
                    </Checkbox>
                )}

                {regSetting.disability === 1 && (
                    <div>
                        <InputWithHead heading={AppConstants.haveDisability} />
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.onChangeSetParticipantValue(e.target.value, "isDisability", index)}
                            value={item.isDisability}
                        >
                            <Radio value={1}>{AppConstants.yes}</Radio>
                            <Radio value={0}>{AppConstants.no}</Radio>
                        </Radio.Group>
                    </div>
                )}
            </div>
        )
    }

    otherInfoReqdView = () => {
        let registrationState = this.props.endUserRegistrationState;
        const { countryList, nationalityList } = this.props.commonReducerState;
        let registrationDetail = this.props.endUserRegistrationState.registrationDetail;
        let regSetting = registrationState.registrationSettings;
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading">
                    {AppConstants.OtherInfoReqd}
                </span>
                {regSetting.club_volunteer === 1 && (
                    <div>
                        <span className="applicable-to-heading">
                            {AppConstants.yourSupportImportant}{" "}
                        </span>
                        <div className="fluid-width">
                            <div className="row">
                                <div className="col-sm">
                                    {(this.state.volunteerList || []).map((info, index) => (
                                        <div key={info.id} style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center"
                                        }}>
                                            <Checkbox
                                                className="single-checkbox" checked={info.isActive}
                                                onChange={(e) => this.onChangeSetVolunteerValue(e.target.checked, index)}
                                            >
                                                {info.description}
                                            </Checkbox>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {this.state.showChildrenCheckNumber && (
                    <InputWithHead
                        heading={AppConstants.childrenCheckNumberInfo}
                        placeholder={AppConstants.childrenNumber}
                        onChange={(e) => this.onChangeSetRegistrationValue(e.target.value, "childrenCheckNumber")}
                        value={registrationDetail.registrationDetail}
                    />
                )}

                {regSetting.country === 1 && (
                    <div>
                        <InputWithHead heading={AppConstants.childCountry} />
                        <Select
                            style={{ width: "100%" }}
                            placeholder={AppConstants.select}
                            onChange={(e) => this.onChangeSetRegistrationValue(e, "countryRefId")}
                            value={registrationDetail.countryRefId}
                        >
                            {countryList.length > 0 && countryList.map((country) => (
                                <Option key={country.id} value={country.id}>{country.description}</Option>
                            ))}
                        </Select>
                    </div>
                )}

                {regSetting.nationality === 1 && (
                    <div>
                        <InputWithHead heading={AppConstants.childNationality} />
                        <Select
                            style={{ width: "100%" }}
                            placeholder={AppConstants.select}
                            onChange={(e) => this.onChangeSetRegistrationValue(e, "nationalityRefId")}
                            value={registrationDetail.nationalityRefId}
                        >
                            {nationalityList.length > 0 && nationalityList.map((nation) => (
                                <Option key={nation.id} value={nation.id}>{nation.description}</Option>
                            ))}
                        </Select>
                    </div>
                )}
                {regSetting.language === 1 && (
                    <InputWithHead
                        heading={AppConstants.childLangSpoken}
                        placeholder={AppConstants.childLangSpoken}
                        onChange={(e) => this.onChangeSetRegistrationValue(e.target.value, "languages")}
                        value={registrationDetail.languages}
                    />
                )}
            </div>
        )
    }

    uniformAndMerchandise = () => {
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading pb-4">
                    {AppConstants.uniformAndMerchandise}
                </span>
            </div>
        )
    }

    voucherView = () => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let isPlayerAvailable = userRegistrations.find(x => x.isPlayer === 1);
        return (
            <div>
                {isPlayerAvailable && (
                    <div className="advanced-setting-view formView pt-5">
                        <span className="form-heading">{AppConstants.vouchers}</span>
                        {(registrationDetail.vouchers || []).map((voc, index) => (
                            <div key={voc.tempParticipantId} className="inside-container-view pt-0">
                                <div className="row">
                                    <div className="col-sm">
                                        <span className="user-contact-heading">{"VOUCHER " + (index + 1)}</span>
                                    </div>
                                    <div className="transfer-image-view pointer" onClick={() =>
                                        this.deleteEnableOrDisablePopup("voucher", true, 0, 0, index, AppConstants.voucherDeleteConfirmMsg)}>
                                        <span className="user-remove-btn"><i className="fa fa-trash-o"
                                                                             aria-hidden="true" /></span>
                                        <span className="user-remove-text">
                                            {AppConstants.remove}
                                        </span>
                                    </div>
                                </div>
                                <InputWithHead
                                    heading={AppConstants.voucherLink}
                                    placeholder={AppConstants.voucherLink}
                                    onChange={(e) => this.onChangeSetVoucherValue(e.target.value, "voucherLink", index)}
                                    value={voc.voucherLink}
                                />
                                <InputWithHead heading={AppConstants.participant} />
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={(e) => this.onChangeSetVoucherValue(e, "tempParticipantId", index)}
                                    value={voc.tempParticipantId}
                                >
                                    {(userRegistrations || []).map((item, partIndex) => (
                                        <Option key={item.tempParticipantId} value={item.tempParticipantId}
                                                disabled={item.isVoucherAdded}>
                                            {item.firstName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        ))}
                        <span className="input-heading-add-another pointer" onClick={() => this.addVoucher()}>
                            + {AppConstants.addvoucher}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    membershipProductProductView = (item, prod, prodIndex, index) => {
        return (
            <div className="formView content-view pt-5">
                <span className="form-heading"> {AppConstants.competitionMembershipProductDivision}</span>

                <InputWithHead heading={AppConstants.competition_name} />
                <div style={{ display: 'flex' }} className="applicable-to-text">
                    <div>{this.state.competitionName}</div>
                </div>

                <InputWithHead heading={AppConstants.membershipProduct} />
                <Select
                    style={{ width: "100%", paddingRight: 1 }}
                    onChange={(e) => this.onChangeSetProdMemberTypeValue(e, index, prodIndex)}
                    value={prod.competitionMembershipProductTypeId}
                >
                    {(item.membershipProducts || []).map((mem, index) => (
                        <Option
                            key={mem.competitionMembershipProductTypeId}
                            value={mem.competitionMembershipProductTypeId}
                            disabled={mem.isDisabled}
                        >
                            {mem.name}
                        </Option>
                    ))}
                </Select>

                <InputWithHead heading={AppConstants.divisions} />
                <InputWithHead heading={prod.divisionName} />
            </div>
        )
    }

    dividerTextView = (text, styles, playerOrProduct, index, prodIndex) => {
        return (
            <div className="form-heading formView end-user-divider-header" style={styles}>
                <div className="end-user-divider-side" style={{ width: '75px' }} />
                <div className="end-user-divider-text">{text}</div>
                <div className="end-user-divider-side" style={{ flexGrow: '1' }} />
                <div
                    className="transfer-image-view pointer"
                    style={{ paddingLeft: '33px' }}
                    onClick={() => this.deleteEnableOrDisablePopup(playerOrProduct, true, index, prodIndex, 0, "", null)}
                >
                    <span className="user-remove-btn"><i className="fa fa-trash-o" aria-hidden="true" /></span>
                    <span className="user-remove-text">
                        {AppConstants.remove}
                    </span>
                </div>
            </div>
        )
    }

    removeModalView = () => {
        return (
            <div>
                <Modal
                    title="End User Registration"
                    visible={this.state.modalVisible}
                    onOk={() => this.removeModalPopup("ok")}
                    onCancel={() => this.removeModalPopup("cancel")}
                >
                    <p>{this.state.modalMessage}</p>
                </Modal>
            </div>
        );
    }

    contentView = () => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        let regSetting = registrationState.registrationSettings;
        const styles = { paddingTop: '10px', marginBottom: '15px' };
        const stylesProd = { paddingTop: '20px', marginBottom: '20px' };
        return (
            <div>
                <div style={{ marginBottom: "20px" }}>
                    {this.registeringYourselfView()}
                </div>

                {(userRegistrations || []).map((item, index) => (
                    <div key={"userReg" + index}>
                        {this.dividerTextView("PARTICIPANT " + (index + 1), styles, "participant", index, -1)}
                        <div style={{ marginBottom: "20px" }}>
                            {this.registrationQuestionView(item, index)}
                        </div>
                        {item.isPlayer != -1 && (
                            <div>
                                <div style={{ marginBottom: "20px" }}>
                                    {this.membershipProductView(item, index)}
                                </div>
                                <div style={{ marginBottom: "20px" }}>
                                    {this.participantDetailView(item, index)}
                                </div>
                                {(getAge(item.dateOfBirth) <= 18) && (
                                    <div style={{ marginBottom: "20px" }}>
                                        {this.parentGuardianView(item, index)}
                                    </div>
                                )}
                                {regSetting.last_captain === 1 || regSetting.played_before === 1 && (
                                    <div style={{ marginBottom: "20px" }}>
                                        {this.additionalPersonalInfoView(item, index)}
                                    </div>
                                )}
                                {item.isPlayer === 1 && (
                                    <div>
                                        {regSetting.nominate_positions === 1 && (
                                            <div style={{ marginBottom: "20px" }}>
                                                {this.playerPosition(item, index, "participant", index)}
                                            </div>
                                        )}
                                        {regSetting.play_friend == 1 && (
                                            <div style={{ marginBottom: "20px" }}>
                                                {this.playWithFriendView(item, index, "participant", index)}
                                            </div>
                                        )}
                                        {regSetting.refer_friend === 1 && (
                                            <div style={{ marginBottom: "10px" }}>
                                                {this.referAFriendView(item, index, "participant", index)}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {(item.products || []).map((prod, prodIndex) => (
                                    <div key={"prod" + prodIndex}>
                                        {this.dividerTextView("PARTICIPANT " + (index + 1) + " - MEMBERSHIP " + (prodIndex + 1), stylesProd, "product", index, prodIndex)}
                                        <div>
                                            {this.membershipProductProductView(item, prod, prodIndex, index)}
                                        </div>
                                        {prod.isPlayer && (
                                            <div>
                                                {regSetting.nominate_positions === 1 && (
                                                    <div style={{ marginBottom: "20px" }}>
                                                        {this.playerPosition(prod, index, "product", prodIndex)}
                                                    </div>
                                                )}
                                                {regSetting.play_friend === 1 && (
                                                    <div style={{ marginBottom: "20px" }}>
                                                        {this.playWithFriendView(prod, index, "product", prodIndex)}
                                                    </div>
                                                )}
                                                {regSetting.refer_friend === 1 && (
                                                    <div style={{ marginBottom: "40px" }}>
                                                        {this.referAFriendView(prod, index, "product", prodIndex)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="formView" style={{ background: "none", marginBottom: "30px" }}>
                                    <span className="input-heading-add-another pointer"
                                          onClick={() => this.addProduct(index)}>
                                        + {AppConstants.addAnotherProduct}
                                    </span>
                                </div>
                                <div style={{ marginBottom: "20px" }}>
                                    {this.additionalInfoView(item, index)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {this.state.registeringYourself != 0 && userRegistrations.length > 0 && userRegistrations[0].isPlayer != -1 ? (
                    <div>
                        <div className="formView" style={{ background: "none", marginBottom: "40px" }}>
                            <span className="input-heading-add-another pointer"
                                  onClick={() => this.addParticipant(this.state.registeringYourself)}>
                                + {AppConstants.addAnotherParticipant}
                            </span>
                        </div>
                        {(regSetting.language === 1 || regSetting.nationality == 1 || regSetting.country === 1 || regSetting.club_volunteer === 1) && (
                            <div style={{ marginBottom: "20px" }}>
                                {this.otherInfoReqdView()}
                            </div>
                        )}
                        {regSetting.shop === 1 && (
                            <div style={{ marginBottom: "20px" }}>
                                {this.uniformAndMerchandise()}
                            </div>
                        )}
                        {regSetting.voucher === 1 && (
                            <div>
                                {this.voucherView()}
                            </div>
                        )}
                        <Form.Item name='termsAndCondition'
                                   rules={[{ required: true, message: ValidationConstants.termsAndCondition[0] }]}>
                            <div className="formView" style={{ background: "none" }}>
                                <Checkbox
                                    className="single-checkbox pt-3"
                                    checked={this.state.agreeTerm}
                                    onChange={e => this.setState({ agreeTerm: e.target.checked })}
                                >
                                    {AppConstants.agreeTerm}
                                    <span className="app-reg-terms">
                                        {AppConstants.termsAndConditions}{" "}
                                    </span>
                                </Checkbox>
                            </div>
                        </Form.Item>
                    </div>
                ) : null}
                {this.removeModalView()}
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        let registrationState = this.props.endUserRegistrationState;
        let registrationDetail = registrationState.registrationDetail;
        let userRegistrations = registrationDetail.userRegistrations;
        return (
            <div className="fluid-width">
                {this.state.registeringYourself != 0 && userRegistrations.length > 0 && userRegistrations[0].isPlayer != -1 ? (
                    <div className="footer-view">
                        <div className="row">
                            <div className="col-sm">
                                <div className="reg-add-save-button" />
                            </div>
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button
                                        className="save-draft-text" type="save-draft-text"
                                        onClick={() => this.setState({ buttonPressed: "save" })}
                                    >
                                        {AppConstants.reviewOrder}
                                    </Button>
                                    <Button
                                        className="open-reg-button"
                                        htmlType="submit"
                                        type="primary"
                                        disabled={isSubmitting}
                                        onClick={() => this.setState({ buttonPressed: "save" })}
                                    >
                                        {AppConstants.checkOptions}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu/>
                <Layout>
                    {this.headerView()}

                    <Form onFinish={this.saveRegistrationForm} noValidate="noValidate">
                        <Content>
                            <div>
                                {this.contentView()}
                            </div>
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUreAction,
        getCommonRefData,
        favouriteTeamReferenceAction,
        firebirdPlayerReferenceAction,
        registrationOtherInfoReferenceAction,
        countryReferenceAction,
        nationalityReferenceAction,
        heardByReferenceAction,
        playerPositionReferenceAction,
        updateEndUserRegisrationAction,
        orgRegistrationRegSettingsEndUserRegAction,
        membershipProductEndUserRegistrationAction,
        saveEndUserRegistrationAction
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        endUserRegistrationState: state.EndUserRegistrationState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppRegistrationForm);
