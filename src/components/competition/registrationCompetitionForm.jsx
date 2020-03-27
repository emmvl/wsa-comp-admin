import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Input,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Table,
    Tree,
    Radio,
    Tabs,
    Form,
    Modal,
    message
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getAllCompetitionFeesDeatilsAction,
    saveCompetitionFeesDetailsAction,
    saveCompetitionFeesMembershipTabAction,
    getDefaultCompFeesMembershipProductTabAction,
    membershipProductSelectedAction,
    membershipTypeSelectedAction,
    saveCompetitionFeesDivisionAction,
    divisionTableDataOnchangeAction,
    addRemoveDivisionAction,
    updatePaymentOption,
    updatePaymentFeeOption,
    paymentFeeDeafault,
    paymentSeasonalFee,
    competitionPaymentApi,
    addRemoveCompFeeDiscountAction,
    add_editcompetitionFeeDeatils,
    checkUncheckcompetitionFeeSction,
    add_editFee_deatialsScetion,
    saveCompetitionFeeSection,
    updatedDiscountDataAction,
    updatedDiscountMemberPrd,
    regSaveCompetitionFeeDiscountAction,
    competitionDiscountTypesAction,
    regCompetitionListDeleteAction,
    getDefaultCharity,
    getDefaultCompFeesLogoAction,
    clearCompReducerDataAction
} from "../../store/actions/registrationAction/competitionFeeAction";
import {
    competitionFeeInit, getVenuesTypeAction,
    getCommonDiscountTypeTypeAction, getOnlyYearListAction,
    clearFilter, searchVenueList,
} from "../../store/actions/appAction";
import moment from "moment";
import history from "../../util/history";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../util/helpers";
import ValidationConstants from "../../themes/validationConstant";
import { NavLink } from "react-router-dom";
import Loader from '../../customComponents/loader';
import { venueListAction, getCommonRefData, } from '../../store/actions/commonAction/commonAction'
import { getUserId, getOrganisationData } from "../../util/sessionStorage"


const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;
let this_Obj = null;

const divisionTable = [
    {
        title: "Division Name",
        dataIndex: "divisionName",
        key: "divisionName",
        render: (divisionName, record, index) => (
            <Input className="input-inside-table-fees"
                value={divisionName}
                onChange={e => this_Obj.divisionTableDataOnchange(e.target.value, record, index, "divisionName")}
                disabled={this_Obj.state.isCreatorEdit} />
        )
    },

    {
        title: "Age Restriction",
        dataIndex: "ageRestriction",
        key: "ageRestriction",

        render: (ageRestriction, record, index) => (
            <Checkbox
                className="single-checkbox mt-1"
                checked={ageRestriction}
                onChange={e => this_Obj.divisionTableDataOnchange(e.target.checked, record, index, "ageRestriction")}
                disabled={this_Obj.state.isCreatorEdit}
            ></Checkbox>
        )
    },
    {
        title: "DOB From",
        dataIndex: "fromDate",
        key: "fromDate",
        width: "25%",
        render: (fromDate, record, index) => (
            <DatePicker
                size="large"
                className="comp-venue-time-datepicker"
                style={{ width: "100%", minWidth: 135 }}
                onChange={date => this_Obj.divisionTableDataOnchange(moment(date).format("YYYY-MM-DD"), record, index, "fromDate")}
                format={"DD-MM-YYYY"}
                showTime={false}
                disabled={!record.ageRestriction}
                value={fromDate !== null && moment(fromDate)}
            />
        )
    },
    {
        title: "DOB To",
        dataIndex: "toDate",
        width: "25%",
        key: "toDate",
        render: (toDate, record, index) => (
            <DatePicker
                size="large"
                className="comp-venue-time-datepicker"
                style={{ width: "100%", minWidth: 135 }}
                onChange={date => this_Obj.divisionTableDataOnchange(moment(date).format("YYYY-MM-DD"), record, index, "toDate")}
                format={"DD-MM-YYYY"}
                showTime={false}
                disabled={!record.ageRestriction}
                value={toDate !== null && moment(toDate)}
            />
        )
    },
    {
        title: "",
        dataIndex: "clear",
        key: "clear",
        render: (clear, record, index) => (
            <span style={{ display: "flex", justifyContent: "center", width: "100%", cursor: "pointer" }}>
                <img
                    className="dot-image"
                    src={AppImages.redCross}
                    alt=""
                    width="16"
                    height="16"
                    onClick={() => !this_Obj.state.isCreatorEdit ? this_Obj.addRemoveDivision(index, record, "remove") : null}
                />
            </span>
        )
    }
];


const playerSeasoTable = [
    {
        title: "Membership Type",
        dataIndex: "membershipProductTypeName",
        key: "membershipType",
        render: membershipProductTypeName => (
            <Input
                className="input-inside-table-fees"
                disabled={true}
                value={membershipProductTypeName}
            />
        )
    },

    {
        title: "Division",
        dataIndex: "division",
        key: "division",
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled={true}
                value={record.competitionMembershipProductDivisionId ? record.divisionName : "N/A"}
            />
        )
    },
    {
        title: "Membership Fees (excl. GST)",
        dataIndex: "membershipSeasonal",
        key: "membershipSeasonal",
        render: (membershipSeasonal, record) => (
            <Input
                className="input-inside-table-fees"
                disabled={true}
                value={membershipSeasonal}
            />
        )
    },
    {
        title: "Membership GST",
        dataIndex: "membershipGst",
        key: "membershipGst",
        render: (membershipGst, record) => (
            <Input
                className="input-inside-table-fees"
                disabled={true}
                value={membershipGst}
            />
        )
    },
    {
        title: "Competition Fees (excl. GST)",
        dataIndex: "fee",
        key: "fee",
        render: (fee, record, index) => (
            <Input type="number" className="input-inside-table-fees" value={fee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "fee", "seasonal")} />
        )
    },
    {
        title: "Competition GST",
        dataIndex: "gst",
        key: "gst",
        render: (gst, record, index) => (
            <Input type="number" className="input-inside-table-fees" value={gst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "gst", "seasonal")} />
        )
    },

    {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: total => <Input className="input-inside-table-fees" value={total} disabled={true} />
    }
];



const playercasualTable = [
    {
        title: "Membership Type",
        dataIndex: "membershipProductTypeName",
        key: "membershipProductTypeName",
        render: membershipProductTypeName => (
            <Input
                className="input-inside-table-fees"
                disabled={true}
                value={membershipProductTypeName}
            />
        )
    },

    {
        title: "Division",
        dataIndex: "division",
        key: "division",
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled={true}
                value={record.competitionMembershipProductDivisionId ? record.divisionName : "N/A"}
            />
        )
    },
    {
        title: "Membership Fees (excl. GST)",
        dataIndex: "membershipCasual",
        key: "membershipCasual",
        render: (membershipCasual, record) => (
            <Input
                className="input-inside-table-fees"
                disabled={true}
                value={membershipCasual}
            />
        )
    },
    {
        title: "Membership GST",
        dataIndex: "membershipGst",
        key: "membershipGst",
        render: (membershipGst, record) => (
            <Input
                className="input-inside-table-fees"
                disabled={true}
                value={membershipGst}
            />
        )
    },
    {
        title: "Competition Fees (excl. GST)",
        dataIndex: "fee",
        key: "fee",
        render: (fee, record, index) => (
            <Input type="number" className="input-inside-table-fees" value={fee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "fee", "casual")} />
        )
    },
    {
        title: "Competition GST",
        dataIndex: "gst",
        key: "gst",
        render: (gst, record, index) => (
            <Input type="number" className="input-inside-table-fees" value={gst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "gst", "casual")} />
        )
    },



    {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: total => <Input className="input-inside-table-fees" value={total} disabled={true} />
    }
];

class RegistrationCompetitionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "NETSETGO",
            division: "Division",
            discountCode: false,
            membershipProduct: ["Player", "NetSetGo", "Walking Netball", "Fast Five"],
            membershipProductSelected: [],
            SeasonalFeeSelected: false,
            casualfeeSelected: false,
            walkingDivision: "allDivisions",
            fastDivison: "allDivisions",
            netSetGoDivision: "allDivisions",
            playerDivision: "allDivisions",
            netSetGO_SeasonalFee: false,
            walking_SeasonalFee: false,
            fast_SeasonalFee: false,
            netSetGO_casualfee: false,
            walking_casualfee: false,
            fast_casualfee: false,
            competitionTabKey: "1",
            profileImage: null,
            image: null,
            loading: false,
            getDataLoading: false,
            discountMembershipTypeData: [],
            statusRefId: 1,
            visible: false,
            buttonPressed: "next",
            logoIsDefault: false,
            logoSetDefault: false,
            logoUrl: "",
            isSetDefaul: false,
            competitionIsUsed: false,
            organisationTypeRefId: 0,
            isCreatorEdit: false, //////// user is owner of the competition than isCreatorEdit will be false 
        };
        this_Obj = this;
        this.props.clearCompReducerDataAction("all")

    }
    componentDidUpdate(nextProps) {
        let competitionFeesState = this.props.competitionFeesState
        let competitionId = null
        competitionId = this.props.location.state ? this.props.location.state.id : null
        if (competitionFeesState.onLoad === false && this.state.loading === true) {
            this.setState({ loading: false })
            if (!competitionFeesState.error) {
                this.setState({
                    competitionTabKey: competitionId == null ? JSON.stringify(JSON.parse(this.state.competitionTabKey) + 1) :
                        JSON.stringify(JSON.parse(this.state.competitionTabKey) + 2),
                    logoSetDefault: false,
                    image: null
                })
            }
            if (this.state.buttonPressed == "save" || this.state.buttonPressed == "publish" || this.state.buttonPressed == "delete") {
                history.push('/competitionDashboard');
            }
        }
        if (nextProps.competitionFeesState !== competitionFeesState) {
            if (competitionFeesState.getCompAllDataOnLoad === false && this.state.getDataLoading == true) {
                this.setState({
                    getDataLoading: false,
                    profileImage: competitionFeesState.competitionDetailData.competitionLogoUrl,
                    competitionIsUsed: competitionFeesState.competitionDetailData.isUsed
                })
                this.setDetailsFieldValue()
                let creatorId = competitionFeesState.competitionCreator
                let userId = getUserId();
                if (creatorId == userId) {
                    this.setState({ isCreatorEdit: false })
                } else {
                    this.setState({ isCreatorEdit: true })
                }
            }
        }

    }


    componentDidMount() {
        let orgData = getOrganisationData()
        this.setState({ organisationTypeRefId: orgData.organisationTypeRefId })
        let competitionId = null
        competitionId = this.props.location.state ? this.props.location.state.id : null
        this.apiCalls(competitionId)
        this.setDetailsFieldValue()
    }

    ////alll the api calls
    apiCalls = (competitionId) => {
        this.props.getOnlyYearListAction(this.props.appState.yearList)
        this.props.getDefaultCompFeesLogoAction()
        this.props.competitionDiscountTypesAction()
        this.props.competitionFeeInit();
        this.props.paymentFeeDeafault()
        this.props.paymentSeasonalFee()
        this.props.getCommonDiscountTypeTypeAction()
        this.props.getVenuesTypeAction();
        this.props.venueListAction();
        if (competitionId !== null) {
            this.props.getAllCompetitionFeesDeatilsAction(competitionId)
            this.setState({ getDataLoading: true })
        }
        else {
            this.props.getDefaultCompFeesMembershipProductTabAction()
            this.props.getDefaultCharity()
        }
    }

    // for  save  payment   
    paymentApiCall = (competitionId) => {
        let paymentDataArr = this.props.competitionFeesState.competitionPaymentsData
        let selectedCasualPaymentArr = this.props.competitionFeesState.selectedCasualFee
        let SelectedSeasonalPaymentArr = this.props.competitionFeesState.SelectedSeasonalFee
        let paymentOptionData = selectedCasualPaymentArr.concat(SelectedSeasonalPaymentArr)
        paymentDataArr.paymentOptions = paymentOptionData
        this.props.competitionPaymentApi(paymentDataArr, competitionId)
    }

    discountApiCall = (competitionId) => {
        // let govtVoucherData= this.props.competitionFeesState.competitionDiscountsData.govermentVouchers
        let govtVoucher = this.props.competitionFeesState.competitionDiscountsData.govermentVouchers
        let discountDataArr = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts

        discountDataArr.map((item) => {
            if (item.childDiscounts) {
                if (item.childDiscounts.length == 0) {
                    item.childDiscounts = null
                }
            }
            item.applyDiscount = parseInt(item.applyDiscount)
            if (item.amount !== null) {
                if (item.amount.length > 0) {
                    item.amount = parseInt(item.amount)
                }
                else {
                    item['amount'] = null
                }
            }
            else {
                item['amount'] = null
            }
            return item
        })

        let discountBody = {
            "competitionId": competitionId,
            "statusRefId": this.state.statusRefId,
            "competitionDiscounts": [
                {
                    "discounts": discountDataArr
                }
            ],
            "govermentVouchers": govtVoucher
        }
        this.props.regSaveCompetitionFeeDiscountAction(discountBody, competitionId)
    }

    setDetailsFieldValue() {
        let compFeesState = this.props.competitionFeesState
        this.props.form.setFieldsValue({
            competition_name: compFeesState.competitionDetailData.competitionName,
            numberOfRounds: compFeesState.competitionDetailData.noOfRounds,
            yearRefId: compFeesState.competitionDetailData.yearRefId,
            competitionTypeRefId: compFeesState.competitionDetailData.competitionTypeRefId,
            competitionFormatRefId: compFeesState.competitionDetailData.competitionFormatRefId,
        })
        let data = this.props.competitionFeesState.competionDiscountValue
        let discountData = data && data.competitionDiscounts !== null ? data.competitionDiscounts[0].discounts : []
        discountData.map((item, index) => {
            let competitionMembershipProductTypeId = `competitionMembershipProductTypeId${index}`
            let membershipProductUniqueKey = `membershipProductUniqueKey${index}`
            this.props.form.setFieldsValue({
                [competitionMembershipProductTypeId]: item.competitionMembershipProductTypeId,
                [membershipProductUniqueKey]: item.membershipProductUniqueKey,
            })
        })
    }



    saveCompFeesApiCall = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let compFeesState = this.props.competitionFeesState
                let competitionId = compFeesState.competitionId
                let finalPostData = []
                let fee_data = compFeesState.competitionFeesData
                let feeSeasonalData = []
                let feeCasualData = []
                let finalpostarray = []
                for (let i in fee_data) {
                    if (fee_data[i].isSeasonal == true && fee_data[i].isCasual == true) {
                        if (fee_data[i].isAllType == "allDivisions") {
                            feeSeasonalData = fee_data[i].seasonal.allType
                            feeCasualData = fee_data[i].casual.allType
                            for (let j in feeSeasonalData) {
                                for (let k in feeCasualData) {

                                    if (feeSeasonalData[j].competitionMembershipProductTypeId == feeCasualData[k].competitionMembershipProductTypeId) {
                                        feeSeasonalData[j]["casualFees"] = feeCasualData[k].fee
                                        feeSeasonalData[j]["casualGST"] = feeCasualData[k].gst
                                        feeSeasonalData[j]["seasonalFees"] = feeSeasonalData[j].fee
                                        feeSeasonalData[j]["seasonalGST"] = feeSeasonalData[j].gst
                                        feeSeasonalData[j]["affiliateCasualFees"] = feeCasualData[k].affiliateFee
                                        feeSeasonalData[j]["affiliateCasualGST"] = feeCasualData[k].affiliateGst
                                        feeSeasonalData[j]["affiliateSeasonalFees"] = feeSeasonalData[j].affiliateFee
                                        feeSeasonalData[j]["affiliateSeasonalGST"] = feeSeasonalData[j].affiliateGst
                                        break;
                                    }
                                }
                            }
                            finalPostData = [...feeSeasonalData]
                            console.log(finalPostData)
                        } else {
                            feeSeasonalData = fee_data[i].seasonal.perType
                            feeCasualData = fee_data[i].casual.perType
                            console.log("feeSeasonalData", feeSeasonalData, "feeCasualData", feeCasualData)
                            for (let j in feeSeasonalData) {
                                for (let k in feeCasualData) {

                                    if (feeSeasonalData[j].competitionMembershipProductTypeId == feeCasualData[k].competitionMembershipProductTypeId) {
                                        feeSeasonalData[j]["casualFees"] = feeCasualData[j].fee
                                        feeSeasonalData[j]["casualGST"] = feeCasualData[j].gst
                                        feeSeasonalData[j]["seasonalFees"] = feeSeasonalData[j].fee
                                        feeSeasonalData[j]["seasonalGST"] = feeSeasonalData[j].gst
                                        feeSeasonalData[j]["affiliateCasualFees"] = feeCasualData[j].affiliateFee
                                        feeSeasonalData[j]["affiliateCasualGST"] = feeCasualData[j].affiliateGst
                                        feeSeasonalData[j]["affiliateSeasonalFees"] = feeSeasonalData[j].affiliateFee
                                        feeSeasonalData[j]["affiliateSeasonalGST"] = feeSeasonalData[j].affiliateGst
                                        break;
                                    }
                                }
                            }
                            finalPostData = [...feeSeasonalData]
                        }
                    }


                    else if (fee_data[i].isSeasonal == true && fee_data[i].isCasual == false) {

                        if (fee_data[i].isAllType == "allDivisions") {
                            feeSeasonalData = fee_data[i].seasonal.allType
                            finalPostData = [...feeSeasonalData]
                        } else {
                            feeSeasonalData = fee_data[i].seasonal.perType
                            finalPostData = [...feeSeasonalData]
                        }

                        finalPostData.map((item) => {
                            item["seasonalFees"] = (item.fee)
                            item["seasonalGST"] = (item.gst)
                            item["affiliateSeasonalFees"] = (item.affiliateFee)
                            item["affiliateSeasonalGST"] = (item.affiliateGst)
                        })
                    }

                    else if (fee_data[i].isSeasonal == false && fee_data[i].isCasual == true) {

                        if (fee_data[i].isAllType == "allDivisions") {
                            feeCasualData = fee_data[i].casual.allType
                            finalPostData = [...feeCasualData]
                        } else {
                            feeCasualData = fee_data[i].casual.perType
                            finalPostData = [...feeCasualData]
                        }

                        finalPostData.map((item) => {
                            item["casualFees"] = (item.fee)
                            item["casualGST"] = (item.gst)
                            item["affiliateCasualFees"] = (item.affiliateFee)
                            item["affiliateCasualGST"] = (item.affiliateGst)
                        })
                    }
                    else {
                        // alert("check fees")
                    }
                    let modifyArr = [...finalpostarray, ...finalPostData]
                    finalpostarray = modifyArr
                }
                this.props.saveCompetitionFeeSection(finalpostarray, competitionId)
                this.setState({ loading: true })
            }
        })
    }



    saveAPIsActionCall = (e) => {
        e.preventDefault();
        let tabKey = this.state.competitionTabKey
        let compFeesState = this.props.competitionFeesState
        let competitionId = compFeesState.competitionId
        let postData = compFeesState.competitionDetailData
        console.log("postData", postData)
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let nonPlayingDate = JSON.stringify(postData.nonPlayingDates)
                let venue = JSON.stringify(compFeesState.postVenues)
                let invitees = JSON.stringify(compFeesState.postInvitees)
                if (tabKey == "1") {
                    if (compFeesState.competitionDetailData.competitionLogoUrl !== null) {
                        let formData = new FormData();
                        formData.append("competitionUniqueKey", competitionId);
                        formData.append("name", postData.competitionName);
                        formData.append("yearRefId", values.yearRefId);
                        formData.append("description", postData.description);
                        formData.append("competitionTypeRefId", postData.competitionTypeRefId);
                        formData.append("competitionFormatRefId", postData.competitionFormatRefId);
                        formData.append("startDate", postData.startDate);
                        if (postData.noOfRounds !== null && postData.noOfRounds !== '') formData.append("noOfRounds", postData.noOfRounds);
                        if (postData.roundInDays !== null && postData.roundInDays !== '') formData.append("roundInDays", postData.roundInDays);
                        if (postData.roundInHours !== null && postData.roundInHours !== '') formData.append("roundInHours", postData.roundInHours);
                        if (postData.roundInMins !== null && postData.roundInMins !== '') formData.append("roundInMins", postData.roundInMins);
                        if (postData.minimunPlayers !== null && postData.minimunPlayers !== '') formData.append("minimunPlayers", postData.minimunPlayers);
                        if (postData.maximumPlayers !== null && postData.maximumPlayers !== '') formData.append("maximumPlayers", postData.maximumPlayers);
                        formData.append("venues", venue);
                        formData.append("registrationCloseDate", postData.registrationCloseDate);
                        formData.append("statusRefId", this.state.statusRefId);
                        formData.append("nonPlayingDates", nonPlayingDate);
                        formData.append("invitees", invitees);
                        formData.append("logoSetAsDefault", this.state.logoSetDefault)
                        if (this.state.logoSetDefault) {
                            formData.append("organisationLogoId", compFeesState.defaultCompFeesOrgLogoData.id)
                        }
                        if (postData.logoIsDefault == true) {
                            formData.append("competitionLogoId", postData.competitionLogoId ? postData.competitionLogoId : 0);
                            formData.append("logoFileUrl", compFeesState.defaultCompFeesOrgLogo);
                            formData.append("competition_logo", compFeesState.defaultCompFeesOrgLogo)
                        }
                        else {
                            if (this.state.image !== null) {
                                formData.append("competition_logo", this.state.image)
                                formData.append("competitionLogoId", postData.competitionLogoId ? postData.competitionLogoId : 0);
                            } else {
                                formData.append("competitionLogoId", postData.competitionLogoId ? postData.competitionLogoId : 0);
                                formData.append("logoFileUrl", postData.competitionLogoUrl);
                                // formData.append("competition_logo", compFeesState.defaultCompFeesOrgLogo)
                            }
                        }
                        formData.append("logoIsDefault", postData.logoIsDefault)
                        this.props.saveCompetitionFeesDetailsAction(formData, compFeesState.defaultCompFeesOrgLogoData.id)
                        this.setState({ loading: true })
                    } else {
                        message.error(ValidationConstants.competitionLogoIsRequired)
                    }
                }
                else if (tabKey == "2") {
                    let finalmembershipProductTypes = JSON.parse(JSON.stringify(this.props.competitionFeesState.defaultCompFeesMembershipProduct))
                    let tempProductsArray = finalmembershipProductTypes.filter(
                        data => data.isProductSelected === true
                    )
                    finalmembershipProductTypes = tempProductsArray
                    for (let i in finalmembershipProductTypes) {
                        var filterArray = finalmembershipProductTypes[i].membershipProductTypes.filter(
                            data => data.isTypeSelected === true,
                        );
                        finalmembershipProductTypes[i].membershipProductTypes = filterArray
                        if (finalmembershipProductTypes[i].membershipProductTypes.length == 0) {
                            finalmembershipProductTypes.splice(i, 1)
                        }
                    }
                    let payload =
                    {
                        "membershipProducts": finalmembershipProductTypes

                    }
                    this.props.saveCompetitionFeesMembershipTabAction(payload, competitionId)
                    this.setState({ loading: true })

                }
                else if (tabKey == "3") {
                    let divisionArrayData = compFeesState.competitionDivisionsData
                    let finalDivisionArray = []
                    for (let i in divisionArrayData) {
                        finalDivisionArray = [...finalDivisionArray, ...divisionArrayData[i].divisions]
                    }
                    let payload = finalDivisionArray
                    this.props.saveCompetitionFeesDivisionAction(payload, competitionId)
                    this.setState({ loading: true })
                }
                else if (tabKey == "4") {
                    this.saveCompFeesApiCall(e)
                }
                else if (tabKey == "5") {
                    this.paymentApiCall(competitionId)
                    this.setState({ loading: true })
                }
                else if (tabKey == "6") {
                    this.discountApiCall(competitionId)
                    this.setState({ loading: true })
                }

            }
        });
    }




    onChange(checkedValues) {
        console.log("checked = ", checkedValues);
    }

    divisionTableDataOnchange(checked, record, index, keyword) {
        console.log("checked, record", "index", checked, record, index, keyword)
        this.props.divisionTableDataOnchangeAction(checked, record, index, keyword)
    }

    dateOnChangeFrom = (date, key) => {
        if (date !== null) {
            this.props.add_editcompetitionFeeDeatils((moment(date).format("YYYY-MM-DD")), key)
        }
    };



    AffiliatesLevel = tree => {
        const { TreeNode } = Tree;
        return tree.map((item, catIndex) => {
            return (
                <TreeNode title={this.advancedNode(item)} key={item.id}>
                    {this.showSubAdvancedNode(item, catIndex)}
                </TreeNode>
            );
        });
    };

    advancedNode = item => {
        return <span>{item.description}</span>;
    };

    disableInviteeNode = (inItem) => {
        let orgLevelId = JSON.stringify(this.state.organisationTypeRefId)
        if (inItem.id == "2" && orgLevelId == "3") {
            return true
        }
        else if (orgLevelId == "4") {
            return true
        }
        else {
            return false
        }
    }

    showSubAdvancedNode(item, catIndex) {
        const { TreeNode } = Tree;
        return item.subReferences.map((inItem, scatIndex) => {
            return (
                <TreeNode
                    title={this.makeSubAdvancedNode(inItem)}
                    key={inItem.id}
                    disabled={this.disableInviteeNode(inItem)}
                ></TreeNode>
            );
        });
    }

    makeSubAdvancedNode(item) {
        return <span>{item.description}</span>;
    }


    // for creation casual fee tree parent data
    casualDataTree = tree => {
        const { TreeNode } = Tree;
        return tree.map((item, catIndex) => {
            return (
                <TreeNode
                    title={this.casualDataNode(item)}
                    key={item.id}
                    defaultCheckedKeys={"Government Rebate"}
                >
                    {this.showSubCasualDataNode(item, catIndex)}
                </TreeNode>
            );
        });
    };
    // for getting casual fee tree parent name
    casualDataNode = item => {
        return <span>{item.description}</span>;
    };
    // for creation casual fee tree child data
    showSubCasualDataNode(item, catIndex) {
        const { TreeNode } = Tree;
        return item.subReferences.map((inItem, scatIndex) => {
            return (
                <TreeNode
                    title={this.makeSubCasualDataNode(inItem)}
                    key={inItem.id}
                >

                </TreeNode>
            );
        });
    }
    // for getting casual fee tree child name
    makeSubCasualDataNode(item) {
        return <span>{item.description}</span>;
    }

    // for creation seasonal fee tree parent data
    seasonalDataTree = tree => {
        const { TreeNode } = Tree;
        return tree.map((item, catIndex) => {
            return (
                <TreeNode title={this.SeasonsalDataNode(item)} key={item.id}>
                    {this.SeasonalDataAdvancedNode(item, catIndex)}
                </TreeNode>
            );
        });
    };
    // for getting seasonal fee tree parent name
    SeasonsalDataNode = item => {
        return <span>{item.description}</span>;
    };
    // / for creation seasonal fee tree child data
    SeasonalDataAdvancedNode(item, catIndex) {
        const { TreeNode } = Tree;
        return item.subReferences.map((inItem, scatIndex) => {
            return (
                <TreeNode
                    title={this.SeasonalTreeSubAdvancedNode(inItem)}
                    key={inItem.id}
                >
                    {/* {this.showParentSeasonalDataNode(inItem, catIndex, scatIndex)} */}
                </TreeNode>
            );
        });
    }
    // / for getting seasonal fee tree child name
    SeasonalTreeSubAdvancedNode(item) {
        return <span>{item.description}</span>;
    }

    ///////view for breadcrumb
    headerView = () => {
        let competitionId = null
        competitionId = this.props.location.state ? this.props.location.state.id : null
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
                            {competitionId == null ? AppConstants.addCompetition : AppConstants.editCompetition}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    dropdownView = (getFieldDecorator) => {
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                style={{
                                    width: "fit-content",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <span className="year-select-heading required-field">
                                    {AppConstants.year}:
                </span>
                                <Form.Item  >
                                    {getFieldDecorator('yearRefId', { initialValue: 1 },
                                        { rules: [{ required: true, message: ValidationConstants.pleaseSelectYear }] })(
                                            <Select
                                                className="year-select"
                                            >
                                                {this.props.appState.yearList.map(item => {
                                                    return (
                                                        <Option key={"yearRefId" + item.id} value={item.id}>
                                                            {item.description}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    setImage = (data) => {
        if (data.files[0] !== undefined) {
            console.log("*****" + JSON.stringify(data.files[0]));
            this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]), isSetDefaul: true })
            this.props.add_editcompetitionFeeDeatils(URL.createObjectURL(data.files[0]), "competitionLogoUrl")
            this.props.add_editcompetitionFeeDeatils(false, "logoIsDefault")
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
    /// add-edit non playing dates and name 
    updateNonPlayingNames(data, index, key) {
        let detailsData = this.props.competitionFeesState
        let array = detailsData.competitionDetailData.nonPlayingDates
        if (key == "name") {
            array[index].name = data
        } else {
            array[index].nonPlayingDate = data
        }
        this.props.add_editcompetitionFeeDeatils(array, "nonPlayingDates")
    }


    // Non playing dates view
    nonPlayingDateView(item, index) {
        let isCreatorEdit = this.state.isCreatorEdit
        return (
            <div className="fluid-width mt-3">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            placeholder={AppConstants.name}
                            value={item.name}
                            onChange={(e) => this.updateNonPlayingNames(e.target.value, index, "name")}
                            disabled={isCreatorEdit}

                        />
                    </div>
                    <div className="col-sm">
                        <DatePicker
                            className="comp-dashboard-botton-view-mobile"
                            size="large"
                            style={{ width: "100%" }}
                            onChange={date => this.updateNonPlayingNames(date, index, "date")}
                            format={"DD-MM-YYYY"}
                            showTime={false}
                            value={item.nonPlayingDate && moment(item.nonPlayingDate, "YYYY-MM-DD")}
                            disabled={isCreatorEdit}

                        />
                    </div>
                    <div className="col-sm-2 transfer-image-view" onClick={() => !this.state.isCreatorEdit ? this.props.add_editcompetitionFeeDeatils(index, "nonPlayingDataRemove") : null}>
                        <a className="transfer-image-view">
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                            <span className="user-remove-text mr-0">{AppConstants.remove}</span>
                        </a>
                    </div>
                </div>
            </div>
        )
    }


    //On selection of venue
    onSelectValues(item, detailsData) {
        this.props.add_editcompetitionFeeDeatils(item, "venues")
        this.props.clearFilter()
    }

    ///// Add Non Playing dates
    addNonPlayingDate() {
        let nonPlayingObject = {
            "competitionNonPlayingDatesId": 0,
            "name": "",
            "nonPlayingDate": ""
        }
        this.props.add_editcompetitionFeeDeatils(nonPlayingObject, "nonPlayingObjectAdd")
    }

    ///handle Invitees selection
    handleInvitees() {
        let detailsData = this.props.competitionFeesState.competitionDetailData

        if (detailsData) {
            let selectedInvitees = detailsData.invitees
            let selected = []
            if (selectedInvitees.length > 0) {
                for (let i in selectedInvitees) {
                    selected.push(selectedInvitees[i].registrationInviteesRefId)
                }
            }

            return selected

        } else {
            return []
        }

    }



    // //// On change Invitees
    // onInviteesChange(value) {
    //     let regInviteesselectedData = this.props.competitionFeesState.selectedInvitees
    //     let upcomingData = [...value]
    //     let orgLevelId = JSON.stringify(this.state.organisationTypeRefId)
    //     if (orgLevelId == "1" || orgLevelId == "2") {
    //         let index = upcomingData.findIndex(x => x == "1")
    //         if (index > -1) {
    //             upcomingData.splice(index, 1)
    //             let clubIndex = upcomingData.findIndex(x => x == "3")

    //             if (clubIndex > -1) {
    //                 upcomingData.splice(clubIndex, 1)
    //             }

    //         }
    //     }
    //     let associationIndex = regInviteesselectedData.findIndex(x => x == "2")
    //     if (associationIndex > -1) {
    //         let index = upcomingData.findIndex(x => x == "2")
    //         if (index > -1) {
    //             upcomingData.splice(index, 1)
    //         }
    //         let mainIndex = upcomingData.findIndex(x => x == "1")
    //         if (mainIndex > -1) {
    //             upcomingData.splice(mainIndex, 1)
    //         }
    //     }
    //     let clubIndex = regInviteesselectedData.findIndex(x => x == "3")
    //     if (clubIndex > -1) {
    //         let index = upcomingData.findIndex(x => x == "3")
    //         if (index > -1) {
    //             upcomingData.splice(index, 1)
    //         }
    //         let mainIndex = upcomingData.findIndex(x => x == "1")
    //         if (mainIndex > -1) {
    //             upcomingData.splice(mainIndex, 1)
    //         }
    //     }
    //     let directIndex = regInviteesselectedData.findIndex(x => x == "5")
    //     if (directIndex > -1) {
    //         let index = upcomingData.findIndex(x => x == "5")
    //         if (index > -1) {
    //             upcomingData.splice(index, 1)
    //         }
    //         let mainIndex = upcomingData.findIndex(x => x == "1")
    //         if (mainIndex > -1) {
    //             upcomingData.splice(mainIndex, 1)
    //         }
    //     }
    //     let notApplIndex = regInviteesselectedData.findIndex(x => x == "6")
    //     if (notApplIndex > -1) {
    //         let index = upcomingData.findIndex(x => x == "6")
    //         if (index > -1) {
    //             upcomingData.splice(index, 1)
    //         }
    //         let mainIndex = upcomingData.findIndex(x => x == "1")
    //         if (mainIndex > -1) {
    //             upcomingData.splice(mainIndex, 1)
    //         }
    //     }
    //     this.props.add_editcompetitionFeeDeatils(upcomingData, "invitees")
    // }


    //// On change Invitees
    onInviteesChange(value) {
        let regInviteesselectedData = this.props.competitionFeesState.selectedInvitees
        console.log("value" + value);
        let arr = [value]
        // let upcomingData = [...value]
        // let associationIndex = regInviteesselectedData.findIndex(x => x == "2")
        // if (associationIndex > -1) {
        //     let index = upcomingData.findIndex(x => x == "2")
        //     if (index > -1) {
        //         upcomingData.splice(index, 1)
        //     }
        //     let mainIndex = upcomingData.findIndex(x => x == "1")
        //     if (mainIndex > -1) {
        //         upcomingData.splice(mainIndex, 1)
        //     }
        // }
        // let clubIndex = regInviteesselectedData.findIndex(x => x == "3")
        // if (clubIndex > -1) {
        //     let index = upcomingData.findIndex(x => x == "3")
        //     if (index > -1) {
        //         upcomingData.splice(index, 1)
        //     }
        //     let mainIndex = upcomingData.findIndex(x => x == "1")
        //     if (mainIndex > -1) {
        //         upcomingData.splice(mainIndex, 1)
        //     }
        // }
        // this.props.add_editcompetitionFeeDeatils(upcomingData, "invitees")
        this.props.add_editcompetitionFeeDeatils(arr, "invitees")
    }


    /////on change logo isdefault
    logoIsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(value, key)
        this.setState({ logoSetDefault: false, isSetDefaul: false, image: null })
    }



    ////onChange save as default logo
    logoSaveAsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(false, key)
        this.setState({ logoSetDefault: value })
    }



    handleSearch = (value, data) => {
        const filteredData = data.filter(memo => {
            return memo.name.indexOf(value) > -1
        })
        this.props.searchVenueList(filteredData)

    };

    ///////form content view - fee details
    contentView = (getFieldDecorator) => {
        let appState = this.props.appState
        const { venueList, mainVenueList } = this.props.commonReducerState
        let detailsData = this.props.competitionFeesState
        let defaultCompFeesOrgLogo = detailsData.defaultCompFeesOrgLogo
        let isCreatorEdit = this.state.isCreatorEdit
        console.log(detailsData.competitionDetailData)
        return (
            <div className="content-view pt-4">
                <Form.Item >
                    {getFieldDecorator('competition_name',
                        { rules: [{ required: true, message: ValidationConstants.competitionNameIsRequired }] })(
                            <InputWithHead
                                required={"required-field pb-0 "}
                                heading={AppConstants.competition_name}
                                placeholder={AppConstants.competition_name}
                                // setFieldsValue={}
                                // value={detailsData.competitionDetailData.competitionName}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionName")}
                                disabled={isCreatorEdit}
                            />
                        )}
                </Form.Item>
                <InputWithHead required={"required-field pb-0 "} heading={AppConstants.competitionLogo} />

                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                <label>
                                    <img
                                        src={detailsData.competitionDetailData.competitionLogoUrl == null ? AppImages.circleImage : detailsData.competitionDetailData.competitionLogoUrl}
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
                                disabled={isCreatorEdit}
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

                            {defaultCompFeesOrgLogo !== null && <Checkbox
                                className="single-checkbox"
                                // defaultChecked={false}
                                checked={detailsData.competitionDetailData.logoIsDefault}
                                onChange={e =>
                                    this.logoIsDefaultOnchange(e.target.checked, "logoIsDefault")
                                }
                                disabled={isCreatorEdit}
                            >
                                {AppConstants.useDefault}
                            </Checkbox>}

                            {this.state.isSetDefaul == true && <Checkbox
                                className="single-checkbox ml-0"
                                checked={this.state.logoSetDefault}
                                onChange={e =>
                                    this.logoSaveAsDefaultOnchange(e.target.checked, "logoIsDefault")
                                }
                                disabled={isCreatorEdit}
                            >
                                {AppConstants.saveAsDefault}
                            </Checkbox>}

                        </div>
                    </div>
                </div>

                <InputWithHead heading={AppConstants.description} />

                <TextArea
                    placeholder={AppConstants.addShortNotes_registering}
                    allowClear
                    value={detailsData.competitionDetailData.description}
                    onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "description")}
                    disabled={isCreatorEdit}
                />

                <div style={{ marginTop: 15 }}>
                    <InputWithHead required={"required-field pb-0 "} heading={AppConstants.venue} />
                    <Select
                        mode="multiple"
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={venueSelection => {
                            this.onSelectValues(venueSelection, detailsData)

                        }}

                        value={detailsData.selectedVenues}
                        placeholder={AppConstants.selectVenue}
                        filterOption={false}
                        onSearch={(value) => { this.handleSearch(value, appState.mainVenueList) }}
                        disabled={isCreatorEdit}
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

                </div>
                <NavLink
                    to={{ pathname: `/competitionVenueAndTimesAdd`, state: { key: AppConstants.competitionFees } }}
                >
                    <span className="input-heading-add-another">+{AppConstants.addVenue}</span>
                </NavLink>
                <span className="applicable-to-heading required-field">{AppConstants.typeOfCompetition}</span>
                <Form.Item  >
                    {getFieldDecorator('competitionTypeRefId', { initialValue: 1 }, { rules: [{ required: true, message: ValidationConstants.pleaseSelectCompetitionType }] })(
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionTypeRefId")}
                            setFieldsValue={detailsData.competitionTypeRefId}
                            disabled={isCreatorEdit}

                        >
                            {appState.typesOfCompetition.length > 0 && appState.typesOfCompetition.map(item => {
                                return (
                                    <Radio key={item.id} value={item.id}> {item.description}</Radio>
                                );
                            })}
                        </Radio.Group>
                    )}
                </Form.Item>


                <span className="applicable-to-heading required-field">{AppConstants.competitionFormat}</span>
                <Form.Item  >
                    {getFieldDecorator('competitionFormatRefId', { initialValue: 1 }, { rules: [{ required: true, message: ValidationConstants.pleaseSelectCompetitionFormat }] })(
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionFormatRefId")}
                            // setFieldsValue={1}
                            setFieldsValue={detailsData.competitionFormatRefId}
                            disabled={isCreatorEdit}

                        >
                            {appState.competitionFormatTypes.length > 0 && appState.competitionFormatTypes.map(item => {
                                return (
                                    <Radio key={item.id} value={item.id}> {item.description}</Radio>
                                );
                            })}
                        </Radio.Group>
                    )}
                </Form.Item>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead heading={AppConstants.startDate} />

                            <DatePicker
                                size="large"
                                style={{ width: "100%" }}
                                onChange={date => this.dateOnChangeFrom(date, "startDate")}
                                format={"DD-MM-YYYY"}
                                showTime={false}
                                value={detailsData.competitionDetailData.startDate && moment(detailsData.competitionDetailData.startDate, "YYYY-MM-DD")}
                                disabled={isCreatorEdit}

                            />

                        </div>
                        <div className="col-sm">
                            <Form.Item >
                                {getFieldDecorator('numberOfRounds',
                                    { rules: [{ required: true, message: ValidationConstants.numberOfRoundsNameIsRequired }] })(
                                        <InputWithHead
                                            required={"required-field pt-0"}
                                            heading={AppConstants.numberOfRounds}
                                            placeholder={AppConstants.numberOfRounds}
                                            value={detailsData.competitionDetailData.noOfRounds}
                                            onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "noOfRounds")}
                                            disabled={isCreatorEdit}

                                        />
                                    )}
                            </Form.Item>
                        </div>
                    </div>
                </div>
                <InputWithHead heading={AppConstants.timeBetweenRounds} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                placeholder={AppConstants.days}
                                value={detailsData.competitionDetailData.roundInDays}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInDays")}
                                disabled={isCreatorEdit}

                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                placeholder={AppConstants.hours}
                                value={detailsData.competitionDetailData.roundInHours}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInHours")}
                                disabled={isCreatorEdit}

                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                placeholder={AppConstants.mins}
                                value={detailsData.competitionDetailData.roundInMins}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInMins")}
                                disabled={isCreatorEdit}

                            />
                        </div>
                    </div>
                </div>
                <InputWithHead heading={AppConstants.registration_close} />
                <DatePicker
                    size="large"
                    style={{ width: "100%" }}
                    onChange={date => this.dateOnChangeFrom(date, "registrationCloseDate")}
                    format={"DD-MM-YYYY"}
                    showTime={false}
                    value={detailsData.competitionDetailData.registrationCloseDate && moment(detailsData.competitionDetailData.registrationCloseDate)}
                    disabled={isCreatorEdit}

                />
                <div className="inside-container-view pt-4">
                    <InputWithHead heading={AppConstants.nonPlayingDates} />
                    {detailsData.competitionDetailData.nonPlayingDates && detailsData.competitionDetailData.nonPlayingDates.map((item, index) =>
                        this.nonPlayingDateView(item, index))
                    }
                    <a>
                        <span onClick={() => !this.state.isCreatorEdit ? this.addNonPlayingDate() : null} className="input-heading-add-another">
                            + {AppConstants.addAnotherNonPlayingDate}
                        </span>
                    </a>
                </div>
                <InputWithHead heading={AppConstants.playerInEachTeam} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                placeholder={AppConstants.minNumber}
                                value={detailsData.competitionDetailData.minimunPlayers}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "minimunPlayers")}
                                disabled={isCreatorEdit}

                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                placeholder={AppConstants.maxNumber}
                                value={detailsData.competitionDetailData.maximumPlayers}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "maximumPlayers")}
                                disabled={isCreatorEdit}

                            />
                        </div>
                    </div>
                </div>

            </div >
        );
    };

    ////////on change function of membership product selection 
    membershipProductSelected = (checked, index, membershipProductUniqueKey) => {
        this.props.membershipProductSelectedAction(checked, index, membershipProductUniqueKey)
    }

    ////membership types in competition fees onchhange function
    membershipTypeSelected = (checked, membershipIndex, typeIndex) => {
        this.props.membershipTypeSelectedAction(checked, membershipIndex, typeIndex)
        console.log("checked, membershipIndex, typeIndex", checked, membershipIndex, typeIndex)
    }


    membershipProductView = () => {
        let membershipProductData = this.props.competitionFeesState.defaultCompFeesMembershipProduct
        console.log("defaultCompFeesMembershipProduct", membershipProductData)
        let membershipProductArray = membershipProductData !== null ? membershipProductData : []
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.membershipProduct}</span>
                {membershipProductArray.map((item, index) => (
                    <div style={{
                        display: "-ms-flexbox",
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                        <Checkbox
                            className="single-checkbox pt-3"
                            checked={item.isProductSelected}
                            onChange={e => this.membershipProductSelected(e.target.checked, index, item.membershipProductUniqueKey)}
                            key={index}
                        >
                            {item.membershipProductName}
                        </Checkbox>
                    </div>
                ))}
            </div>
        );
    };


    membershipTypeInnerView = (item, index) => {
        let typeData = isArrayNotEmpty(item.membershipProductTypes) ? item.membershipProductTypes : []
        return (
            <div  >
                {typeData.map((typeItem, typeIndex) =>
                    <div style={{ display: "-ms-flexbox", flexDirection: "column", justifyContent: "center" }} >
                        <Checkbox
                            className="single-checkbox pt-3"
                            checked={typeItem.isTypeSelected}
                            onChange={e => this.membershipTypeSelected(e.target.checked, index, typeIndex)}
                            key={typeIndex}
                        >
                            {typeItem.membershipProductTypeName}
                        </Checkbox>
                    </div>
                )}
            </div>
        )
    }



    membershipTypeView = () => {
        let membershipTypesData = this.props.competitionFeesState.defaultCompFeesMembershipProduct
        console.log("membershipTypesData", membershipTypesData)
        let membershipProductArray = membershipTypesData !== null ? membershipTypesData : []
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.membershipTYpe}</span>
                {membershipProductArray.length == 0 && (
                    <span className="applicable-to-heading pt-0">
                        {AppConstants.please_Sel_mem_pro}
                    </span>
                )}

                {membershipProductArray.map((item, index) => (
                    item.isProductSelected ?
                        <div className="prod-reg-inside-container-view" >
                            <span className="applicable-to-heading">
                                {item.membershipProductName}
                            </span>
                            {this.membershipTypeInnerView(item, index)}

                        </div> : null
                ))}
            </div>

        )
    }

    //////add or remove another division inthe divsision tab
    addRemoveDivision = (index, item, keyword) => {
        this.props.addRemoveDivisionAction(index, item, keyword)
    }





    divisionsView = () => {
        let divisionData = this.props.competitionFeesState.competitionDivisionsData
        let divisionArray = divisionData !== null ? divisionData : []
        return (
            <div className="fees-view pt-5">
                <span className="form-heading required-field" >{AppConstants.divisions}</span>
                {divisionArray.length == 0 && (
                    <span className="applicable-to-heading pt-0">
                        {AppConstants.please_Sel_mem_pro}
                    </span>
                )}
                {divisionArray.map((item, index) =>
                    <div>
                        <div className="inside-container-view">
                            <span className="form-heading pt-2 pl-2">
                                {item.membershipProductName}
                            </span>
                            <div className="table-responsive">
                                <Table
                                    className="fees-table"
                                    columns={divisionTable}
                                    dataSource={item.divisions}
                                    pagination={false}
                                    Divider="false"
                                />
                            </div>
                            <a>
                                <span className="input-heading-add-another" onClick={() => !this.state.isCreatorEdit ? this.addRemoveDivision(index, item, "add") : null}>+ {AppConstants.addDivision}</span>
                            </a>
                        </div>
                    </div>
                )}

            </div>
        );
    };


    ////// Edit fee details
    onChangeDetails(value, tableIndex, item, key, arrayKey) {
        this.props.add_editFee_deatialsScetion(value, tableIndex, item, key, arrayKey)

    }


    feesView = () => {
        let allStates = this.props.competitionFeesState
        let feeDetails = allStates.competitionFeesData
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.fees}</span>
                {feeDetails == null || feeDetails.length == 0 && (
                    <span className="applicable-to-heading pt-0">
                        {AppConstants.please_Sel_mem_pro}
                    </span>
                )}

                {feeDetails && feeDetails.map((item, index) => {
                    return (
                        <div className="inside-container-view">
                            <span className="form-heading pt-2 pl-2">
                                {item.membershipProductName}
                            </span>
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={e => this.props.checkUncheckcompetitionFeeSction(e.target.value, index, "isAllType")}
                                value={item.isAllType}
                            // defaultValue={"allDivisions"}
                            >
                                <div className="fluid-width">
                                    <div className="row">
                                        <div className="col-sm-2">
                                            <Radio value={"allDivisions"}>{AppConstants.allDivisions}</Radio>
                                        </div>
                                        <div
                                            className="col-sm-2"
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            <Radio value={"perDivision"}>{AppConstants.perDivision}</Radio>
                                        </div>
                                    </div>
                                </div>
                            </Radio.Group>
                            <div style={{ marginTop: 5 }}>
                                <div style={{ marginTop: 5 }}>
                                    <Checkbox
                                        checked={item.isSeasonal}
                                        className="single-checkbox"
                                        onChange={e => {
                                            this.props.checkUncheckcompetitionFeeSction(e.target.checked, index, "isSeasonal")
                                        }
                                            // this.setState({
                                            //     SeasonalFeeSelected: !this.state.SeasonalFeeSelected
                                            // })
                                        }
                                    >
                                        {AppConstants.seasonalFee}
                                    </Checkbox>
                                </div>
                                {item.isSeasonal == true && (
                                    <div className="table-responsive mt-2">
                                        <Table
                                            className="fees-table"
                                            columns={playerSeasoTable}
                                            dataSource={
                                                item.isAllType != "allDivisions"
                                                    ? item.seasonal.perType
                                                    : item.seasonal.allType
                                            }
                                            pagination={false}
                                            Divider="false"
                                        />
                                    </div>
                                )}

                                <div style={{ marginTop: 5 }}>
                                    <Checkbox
                                        checked={item.isCasual}
                                        className="single-checkbox"
                                        onChange={e =>
                                            this.props.checkUncheckcompetitionFeeSction(e.target.checked, index, "isCasual")
                                        }
                                    >
                                        {AppConstants.casualFee}
                                    </Checkbox>
                                </div>

                                {item.isCasual == true && (
                                    <div className="table-responsive mt-2">
                                        <Table
                                            className="fees-table"
                                            columns={playercasualTable}
                                            dataSource={
                                                item.isAllType != "allDivisions"
                                                    ? item.casual.perType
                                                    : item.casual.allType
                                            }
                                            pagination={false}
                                            Divider="false"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    };

    // regInviteesView = () => {
    //     let invitees = this.props.appState.registrationInvitees.length > 0 ? this.props.appState.registrationInvitees : []
    //     let detailsData = this.props.competitionFeesState
    //     let isCreatorEdit = this.state.isCreatorEdit
    //     return (
    //         <div className="fees-view pt-5">
    //             <span className="form-heading">{AppConstants.registrationInvitees}</span>
    //             <div>
    //                 <Tree
    //                     className="tree-government-rebate"
    //                     style={{ flexDirection: 'column' }}
    //                     checkable
    //                     checkedKeys={[...detailsData.selectedInvitees]}
    //                     onCheck={(e) => this.onInviteesChange(e)}
    //                     disabled={isCreatorEdit}
    //                 >
    //                     {this.AffiliatesLevel(invitees)}
    //                 </Tree>
    //             </div>
    //         </div>
    //     );
    // };

    regInviteesView = () => {

        let invitees = this.props.appState.registrationInvitees.length > 0 ? this.props.appState.registrationInvitees : [];
        console.log("invitees" + JSON.stringify(invitees));
        let detailsData = this.props.competitionFeesState
        console.log("********" + JSON.stringify(detailsData.selectedInvitees));
        let isCreatorEdit = this.state.isCreatorEdit;
        let seletedInvitee = detailsData.selectedInvitees.find(x => x);
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.registrationInvitees}</span>
                <div>
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.onInviteesChange(e.target.value)}
                        value={seletedInvitee}>
                        {(invitees || []).map((item, index) =>
                            (
                                <div>
                                    {item.subReferences.length == 0 ?
                                        <Radio value={item.id}>{item.description}</Radio>
                                        : <div>
                                            <div class="applicable-to-heading invitees-main">{item.description}</div>
                                            {(item.subReferences).map((subItem, subIndex) => (
                                                <div style={{ marginLeft: '20px' }}>
                                                    <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </Radio.Group>
                    {/* <Tree
                        className="tree-government-rebate"
                        style={{ flexDirection: 'column' }}
                        checkable
                        checkedKeys={[...detailsData.selectedInvitees]}
                        onCheck={(e) => this.onInviteesChange(e)}
                        disabled={isCreatorEdit}
                    >
                        {this.AffiliatesLevel(invitees)}
                    </Tree> */}
                </div>
            </div>
        );
    };


    //on change of casual fee payment option
    onChangeCasualFee(itemValue, paymentData) {
        this.props.updatePaymentFeeOption(itemValue, "casualfee")
    }



    //on change of casual fee payment option
    onChangeSeasonalFee(itemValue, paymentData) {
        this.props.updatePaymentFeeOption(itemValue, "seasonalfee")
    }



    //payment Option View in tab 5
    paymentOptionsView = () => {
        let casualPayment = this.props.competitionFeesState.casualPaymentDefault
        let seasonalPayment = this.props.competitionFeesState.seasonalPaymentDefault
        let paymentData = this.props.competitionFeesState.competitionPaymentsData
        let selectedSeasonalFeeKey = this.props.competitionFeesState.SelectedSeasonalFeeKey
        let selectedCasualFeeKey = this.props.competitionFeesState.selectedCasualFeeKey

        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.paymentOptions}</span>
                <div className="mt-3">
                    <span className="home-dash-left-text">{AppConstants.casualFee}</span>
                    <Tree
                        style={{ flexDirection: 'column' }}
                        className="tree-government-rebate"
                        checkable
                        defaultExpandedKeys={[]}
                        defaultCheckedKeys={[]}
                        checkedKeys={selectedCasualFeeKey}
                        onCheck={(e) => this.onChangeCasualFee(e, paymentData)}
                    >
                        {this.casualDataTree(casualPayment)}
                    </Tree>
                </div>
                <div className="mt-3">
                    <span className="home-dash-left-text">{AppConstants.seasonalFee}</span>
                    <Tree
                        style={{ flexDirection: 'column' }}
                        className="tree-government-rebate"
                        checkable
                        defaultExpandedKeys={[]}
                        defaultCheckedKeys={[]}
                        checkedKeys={selectedSeasonalFeeKey}
                        onCheck={(e) => this.onChangeSeasonalFee(e, paymentData)}
                    >
                        {this.seasonalDataTree(seasonalPayment)}
                    </Tree>
                </div>
                <div>
                </div>
            </div >
        );
    };


    //////charity voucher view
    charityVoucherView = () => {
        let charityRoundUp = this.props.competitionFeesState.charityRoundUp
        let paymentData = this.props.competitionFeesState.competitionPaymentsData
        return (
            <div className="advanced-setting-view pt-5">
                <span className="form-heading">{AppConstants.charityRoundUp}</span>
                <div className="inside-container-view">
                    {charityRoundUp.map((item, index) => {
                        return (
                            <div className="row">
                                <Checkbox
                                    className="single-checkbox mt-3"
                                    checked={item.isSelected}
                                    onChange={(e) => this.onChangeCharity(e.target.checked, index, "charityRoundUp")}
                                >
                                    {item.description}
                                </Checkbox>

                            </div>

                        )
                    })}

                </div>
            </div >
        );
    };



    //  for change the charity round up
    onChangeCharity(value, index, keyword) {
        this.props.updatePaymentOption(value, index, keyword)
    }


    ////governement voucher view
    voucherView = () => {
        let govtVoucher = this.props.competitionFeesState.govtVoucher
        return (
            <div className="advanced-setting-view pt-5">
                <span className="form-heading">{AppConstants.governmentVouchers}</span>
                <div className="inside-container-view">
                    {govtVoucher.length > 0 && govtVoucher.map((item, index) => {
                        return (
                            <div className="row">
                                <Checkbox
                                    className="single-checkbox mt-3"
                                    checked={item.isSelected}
                                    onChange={(e) => this.onChangeCharity(e.target.checked, index, "govermentVouchers")}
                                >
                                    {item.description}
                                </Checkbox>
                            </div>
                        )
                    })

                    }
                </div>
            </div>
        );
    };

    //onChange membership type  discount
    onChangeMembershipTypeDiscount = (discountMembershipType, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].competitionMembershipProductTypeId = discountMembershipType
        this.props.updatedDiscountDataAction(discountData)
    }

    ////add  or remove  discount in discount section
    addRemoveDiscount = (keyAction, index) => {
        this.props.addRemoveCompFeeDiscountAction(keyAction, index)
    }

    //On change membership product discount type
    onChangeMembershipProductDisType = (discountType, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].competitionTypeDiscountTypeRefId = discountType
        this.props.updatedDiscountDataAction(discountData)
    }

    discountViewChange = (item, index) => {
        let childDiscounts = item.childDiscounts !== null && item.childDiscounts.length > 0 ? item.childDiscounts : []
        switch (item.competitionTypeDiscountTypeRefId) {

            case 1:
                return <div>
                    <InputWithHead heading={"Discount Type"} />
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
                        placeholder="Select"
                        value={item.discountTypeRefId}
                    >
                        {this.props.appState.commonDiscountTypes.map(item => {
                            return (
                                <Option key={"discountType" + item.id} value={item.id}>
                                    {item.description}
                                </Option>
                            );
                        })}
                    </Select>
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.percentageOff_FixedAmount}
                                placeholder={AppConstants.percentageOff_FixedAmount}
                                onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                value={item.amount}
                                suffix={item.discountTypeRefId == "2" ? "%" : null}
                                type="number"
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.description}
                                placeholder={AppConstants.gernalDiscount}
                                onChange={(e) => this.onChangeDescription(e.target.value, index)}
                                value={item.description}
                            />
                        </div>
                    </div>
                    <div className="fluid-width">
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableFrom} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.onChangeDiscountAvailableFrom(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableFrom !== null && moment(item.availableFrom)}
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableTo} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={this.disabledDate}
                                    disabledTime={this.disabledTime}
                                    onChange={date => this.onChangeDiscountAvailableTo(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableTo !== null && moment(item.availableTo)}

                                />
                            </div>
                        </div>
                    </div>
                </div>


            case 2:
                return <div>
                    <InputWithHead heading={"Discount Type"} />
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
                        placeholder="Select"
                        value={item.discountTypeRefId}
                    >
                        {this.props.appState.commonDiscountTypes.map(item => {
                            return (
                                <Option key={"discountType" + item.id} value={item.id}>
                                    {item.description}
                                </Option>
                            );
                        })}
                    </Select>
                    <InputWithHead
                        heading={AppConstants.code}
                        placeholder={AppConstants.code}
                        onChange={(e) => this.onChangeDiscountCode(e.target.value, index)}
                        value={item.discountCode}
                    />
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.percentageOff_FixedAmount}
                                placeholder={AppConstants.percentageOff_FixedAmount}
                                onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                value={item.amount}
                                suffix={item.discountTypeRefId == "2" ? "%" : null}
                                type="number"
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.description}
                                placeholder={AppConstants.gernalDiscount}
                                onChange={(e) => this.onChangeDescription(e.target.value, index)}
                                value={item.description}
                            />
                        </div>
                    </div>

                    <div className="fluid-width">
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableFrom} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.onChangeDiscountAvailableFrom(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableFrom !== null ? moment(item.availableFrom) : null}
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableTo} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={this.disabledDate}
                                    disabledTime={this.disabledTime}
                                    onChange={date => this.onChangeDiscountAvailableTo(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableTo !== null ? moment(item.availableTo) : null}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            case 3:
                return <div>
                    {childDiscounts.map((childItem, childindex) => (
                        <div className="row">
                            <div className="col-sm-10">
                                <InputWithHead
                                    heading={`Child ${childindex + 1}%`}
                                    placeholder={`Child ${childindex + 1}%`}
                                    onChange={(e) => this.onChangeChildPercent(e.target.value, index, childindex, childItem)}
                                    value={childItem.percentageValue}
                                />
                            </div>
                            <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.addRemoveChildDiscount(index, "delete", childindex)}>
                                <span className="user-remove-btn">
                                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </span>
                                <span className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                            </div>
                        </div>
                    ))}
                    <span className="input-heading-add-another" onClick={() => this.addRemoveChildDiscount(index, "add", -1)}>
                        + {AppConstants.addChild}
                    </span>
                </div>

            case 4:
                return <div>
                    <InputWithHead heading={"Discount Type"} />
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
                        placeholder="Select"
                        value={item.discountTypeRefId}
                    >
                        {this.props.appState.commonDiscountTypes.map(item => {
                            return (
                                <Option key={"discountType" + item.id} value={item.id}>
                                    {item.description}
                                </Option>
                            );
                        })}
                    </Select>
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.percentageOff_FixedAmount}
                                placeholder={AppConstants.percentageOff_FixedAmount}
                                onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                value={item.amount}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.description}
                                placeholder={AppConstants.gernalDiscount}
                                onChange={(e) => this.onChangeDescription(e.target.value, index)}
                                value={item.description}
                            />
                        </div>
                    </div>

                    <div className="fluid-width">
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableFrom} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.onChangeDiscountAvailableFrom(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableFrom !== null && moment(item.availableFrom)}

                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableTo} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={this.disabledDate}
                                    disabledTime={this.disabledTime}
                                    onChange={date => this.onChangeDiscountAvailableTo(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableTo !== null && moment(item.availableTo)}

                                />
                            </div>
                        </div>
                    </div>
                </div>


            case 5:
                return <div>
                    <InputWithHead
                        heading={AppConstants.description}
                        placeholder={AppConstants.description}
                        onChange={(e) => this.onChangeDescription(e.target.value, index)}
                        value={item.description}
                    />
                    <InputWithHead
                        heading={AppConstants.question}
                        placeholder={AppConstants.question}
                        onChange={(e) => this.onChangeQuestion(e.target.value, index)}
                        value={item.question}
                    />
                    <InputWithHead heading={"Apply Discount if Answer is Yes"} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.applyDiscountQuestionCheck(e.target.value, index)}
                        value={item.applyDiscount}
                    >
                        <Radio value={"1"}>{AppConstants.yes}</Radio>
                        <Radio value={"0"}>{AppConstants.no}</Radio>
                    </Radio.Group>
                </div>;
            default:
                return <div></div>;
        }
    }
    addRemoveChildDiscount = (index, keyWord, childindex) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        let childDisObject = {
            "membershipFeesChildDiscountId": 0,
            "percentageValue": ""
        }
        if (keyWord == "add") {
            discountData[index].childDiscounts.push(childDisObject)
        }
        else if (keyWord == "delete") {
            discountData[index].childDiscounts.splice(childindex, 1)
        }
        this.props.updatedDiscountDataAction(discountData)
    }

    ////////onchange apply discount question radio button
    applyDiscountQuestionCheck = (applyDiscount, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].applyDiscount = applyDiscount
        this.props.updatedDiscountDataAction(discountData)
    }


    ///////child  onchange in discount section
    onChangeChildPercent = (childPercent, index, childindex, childItem) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].childDiscounts[childindex].percentageValue = childPercent
        discountData[index].childDiscounts[childindex].membershipFeesChildDiscountId = childItem.membershipFeesChildDiscountId
        this.props.updatedDiscountDataAction(discountData)
    }

    ///onchange question in case of custom discount
    onChangeQuestion = (question, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].question = question
        this.props.updatedDiscountDataAction(discountData)
    }

    /////onChange discount refId
    onChangeDiscountRefId = (discountType, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].discountTypeRefId = discountType
        this.props.updatedDiscountDataAction(discountData)
    }

    //////onchange discount code
    onChangeDiscountCode = (discountCode, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].discountCode = discountCode
        this.props.updatedDiscountDataAction(discountData)
    }

    ///onchange on text field percentage off
    onChangePercentageOff = (amount, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].amount = amount
        this.props.updatedDiscountDataAction(discountData)
    }

    /////onChange discount description
    onChangeDescription = (description, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].description = description
        this.props.updatedDiscountDataAction(discountData)
    }

    ////discount available from on change
    onChangeDiscountAvailableFrom = (date, index) => {
        let fromDate = moment(date).format("YYYY-MM-DD")
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].availableFrom = fromDate
        this.props.updatedDiscountDataAction(discountData)
    }

    ////discount available to on change
    onChangeDiscountAvailableTo = (date, index) => {
        let toDate = moment(date).format("YYYY-MM-DD")
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].availableTo = toDate
        this.props.updatedDiscountDataAction(discountData)
    }
    //discount membership product change
    onChangeMembershipProduct = (data, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].membershipProductUniqueKey = data
        this.props.updatedDiscountMemberPrd(data, discountData, index)
    }


    ////discount view inside the content
    discountView = (getFieldDecorator) => {
        let data = this.props.competitionFeesState.competionDiscountValue
        let discountData = data && data.competitionDiscounts !== null ? data.competitionDiscounts[0].discounts : []
        let membershipPrdArr = this.props.competitionFeesState.competitionMembershipProductData !== null ? this.props.competitionFeesState.competitionMembershipProductData : []
        return (
            <div className="discount-view pt-5">
                <span className="form-heading">{AppConstants.discounts}</span>
                {discountData.length > 0 && discountData.map((item, index) => (
                    <div className="prod-reg-inside-container-view">
                        <div className="transfer-image-view pt-2" onClick={() => this.addRemoveDiscount("remove", index)}>
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                            <span className="user-remove-text mr-0">{AppConstants.remove}</span>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead required="pt-0" heading={"Discount Type"} />
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={discountTypeItem => this.onChangeMembershipProductDisType(discountTypeItem, index)}
                                    placeholder="Select"
                                    value={item.competitionTypeDiscountTypeRefId !== 0 && item.competitionTypeDiscountTypeRefId}
                                >
                                    {this.props.competitionFeesState.defaultDiscountType.map((discountTypeItem, discountTypeIndex) => {
                                        return (
                                            <Option key={"disType" + discountTypeItem.id} value={discountTypeItem.id}>
                                                {discountTypeItem.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>

                            <div className="col-sm">
                                <InputWithHead
                                    required="pt-0"
                                    heading={AppConstants.membershipProduct}
                                />
                                <Form.Item  >
                                    {getFieldDecorator(`membershipProductUniqueKey${index}`,
                                        { rules: [{ required: true, message: ValidationConstants.pleaseSelectMembershipProduct }] })(
                                            <Select
                                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                                placeholder={"Select"}
                                                // value={item.membershipProductUniqueKey}
                                                onChange={item => this.onChangeMembershipProduct(item, index)}
                                            >
                                                {membershipPrdArr && membershipPrdArr.membershipProducts && membershipPrdArr.membershipProducts.map(item => {
                                                    return (
                                                        <Option key={item.membershipProductUniqueKey} value={item.membershipProductUniqueKey}>
                                                            {item.membershipProductName}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                </Form.Item>
                            </div>
                        </div>


                        <div >
                            <InputWithHead
                                heading={AppConstants.membershipTypes}
                            />
                            <Form.Item  >
                                {getFieldDecorator(`competitionMembershipProductTypeId${index}`,
                                    { rules: [{ required: true, message: ValidationConstants.pleaseSelectMembershipTypes }] })(
                                        <Select
                                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                            onChange={discountMembershipType =>
                                                this.onChangeMembershipTypeDiscount(discountMembershipType, index)
                                            }
                                            placeholder={"Select"}
                                        // value={item.competitionMembershipProductTypeId}
                                        >
                                            {item.membershipProductTypes.map(item => {
                                                return (
                                                    <Option key={item.competitionMembershipProductTypeId} value={item.competitionMembershipProductTypeId}>
                                                        {item.membershipProductTypeName}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                            </Form.Item>
                        </div>
                        {this.discountViewChange(item, index)}
                    </div>
                ))}

                < span className="input-heading-add-another" onClick={() => this.addRemoveDiscount("add", -1)}>
                    + {AppConstants.addDiscount}
                </span>

            </div >
        );
    };


    //////delete the membership product
    showDeleteConfirm = () => {
        let competitionId = this.props.competitionFeesState.competitionId
        let this_ = this
        confirm({
            title: 'Are you sure delete this product?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                if (competitionId.length > 0) {
                    this_.deleteProduct(competitionId)
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    deleteProduct = (competitionId) => {
        this.setState({ loading: true, buttonPressed: "delete" })
        this.props.regCompetitionListDeleteAction(competitionId)
    }



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let tabKey = this.state.competitionTabKey
        let competitionId = this.props.competitionFeesState.competitionId
        let statusRefId = this.props.competitionFeesState.competitionDetailData.statusRefId ?
            this.props.competitionFeesState.competitionDetailData.statusRefId : 1
        console.log("statusRefId", statusRefId)
        return (
            <div className="fluid-width">
                {/* {!this.state.competitionIsUsed && */}
                {statusRefId == 1 &&
                    <div className="footer-view">
                        <div className="row">
                            <div className="col-sm">
                                <div className="reg-add-save-button">
                                    {competitionId ?
                                        <Button type="cancel-button" onClick={() => this.showDeleteConfirm()}>{AppConstants.delete}</Button>
                                        : null}
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button className="save-draft-text" type="save-draft-text"
                                        htmlType="submit" onClick={() => this.setState({ statusRefId: 1, buttonPressed: "save" })}>
                                        {AppConstants.saveAsDraft}
                                    </Button>
                                    <Button className="publish-button" type="primary"
                                        htmlType="submit" onClick={() => this.setState({
                                            statusRefId: tabKey == "6" ? 2 : 1,
                                            buttonPressed: tabKey == "6" ? "publish" : "next"
                                        })}
                                    >
                                        {tabKey === "6"
                                            ? AppConstants.publish
                                            : AppConstants.next}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );

    };

    //////footer view containing all the buttons like submit and cancel
    editFooterView = () => {
        let tabKey = this.state.competitionTabKey
        let competitionId = this.props.competitionFeesState.competitionId
        let statusRefId = this.props.competitionFeesState.competitionDetailData.statusRefId ?
            this.props.competitionFeesState.competitionDetailData.statusRefId : 1
        return (
            <div className="fluid-width">
                {statusRefId == 1 &&
                    <div className="footer-view">
                        <div className="row">
                            <div className="col-sm">
                                <div className="reg-add-save-button">
                                    <Button type="cancel-button" onClick={() => history.push('/competitionDashboard')} >{AppConstants.cancel}</Button>
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button className="publish-button" type="primary"
                                        htmlType="submit" onClick={() => this.setState({
                                            statusRefId: tabKey == "3" ? 2 : 1,
                                            buttonPressed: tabKey == "3" ? "publish" : "next"
                                        })}
                                    >
                                        {tabKey === "3"
                                            ? AppConstants.save
                                            : AppConstants.next}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>
        );

    };



    tabCallBack = (key) => {
        let competitionId = this.props.competitionFeesState.competitionId
        if (competitionId !== null && competitionId.length > 0) {
            this.setState({ competitionTabKey: key })
        }
        this.setDetailsFieldValue()
    }




    render() {
        const { getFieldDecorator } = this.props.form;
        console.log(this.props.competitionFeesState)
        let competitionId = null
        competitionId = this.props.location.state ? this.props.location.state.id : null
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.competitions}
                    menuName={AppConstants.competitions}
                />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"1"} />
                <Layout>
                    <Form
                        onSubmit={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView(
                            getFieldDecorator
                        )}
                        <Content>
                            <div className="tab-view">
                                <Tabs activeKey={this.state.competitionTabKey} onChange={this.tabCallBack}>
                                    <TabPane tab={AppConstants.details} key="1">
                                        <div className="tab-formView mt-5">{this.contentView(getFieldDecorator)}</div>
                                        <div className="tab-formView mt-5">{this.regInviteesView(getFieldDecorator)}</div>
                                    </TabPane>
                                    {competitionId == null &&
                                        <TabPane tab={AppConstants.membership} key="2">
                                            <div className="tab-formView mt-5">{this.membershipProductView(getFieldDecorator)}</div>
                                            <div className="tab-formView mt-5">{this.membershipTypeView(getFieldDecorator)}</div>
                                        </TabPane>
                                    }
                                    <TabPane tab={AppConstants.divisions} key={"3"}>
                                        <div className="tab-formView">{this.divisionsView(getFieldDecorator)}</div>
                                    </TabPane>
                                    {competitionId == null &&
                                        <TabPane tab={AppConstants.fees} key={"4"}>
                                            <div className="tab-formView">{this.feesView(getFieldDecorator)}</div>
                                        </TabPane>}
                                    {competitionId == null &&
                                        <TabPane tab={AppConstants.payments} key={"5"}>
                                            <div className="tab-formView">{this.paymentOptionsView(getFieldDecorator)}</div>
                                            <div className="tab-formView">{this.charityVoucherView(getFieldDecorator)}</div>
                                        </TabPane>}
                                    {competitionId == null &&
                                        <TabPane tab={AppConstants.discounts} key={"6"}>
                                            <div className="tab-formView">{this.discountView(getFieldDecorator)}</div>
                                            <div className="tab-formView">{this.voucherView(getFieldDecorator)}</div>
                                        </TabPane>}
                                </Tabs>
                            </div>
                            <Loader visible={this.props.competitionFeesState.onLoad || this.state.getDataLoading} />
                        </Content>
                        <Footer>{competitionId == null ? this.footerView() : this.editFooterView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        competitionFeeInit,
        getVenuesTypeAction,
        getAllCompetitionFeesDeatilsAction,
        saveCompetitionFeesDetailsAction,
        saveCompetitionFeesMembershipTabAction,
        getDefaultCompFeesMembershipProductTabAction,
        membershipProductSelectedAction,
        membershipTypeSelectedAction,
        saveCompetitionFeesDivisionAction,
        divisionTableDataOnchangeAction,
        addRemoveDivisionAction,
        updatePaymentOption,
        updatePaymentFeeOption,
        paymentFeeDeafault,
        paymentSeasonalFee,
        competitionPaymentApi,
        addRemoveCompFeeDiscountAction,
        add_editcompetitionFeeDeatils,
        checkUncheckcompetitionFeeSction,
        add_editFee_deatialsScetion,
        saveCompetitionFeeSection,
        competitionDiscountTypesAction,
        updatedDiscountDataAction,
        getCommonDiscountTypeTypeAction,
        updatedDiscountMemberPrd,
        regSaveCompetitionFeeDiscountAction,
        regCompetitionListDeleteAction,
        getDefaultCharity,
        getDefaultCompFeesLogoAction,
        getOnlyYearListAction,
        clearCompReducerDataAction,
        searchVenueList,
        venueListAction,
        clearFilter
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(RegistrationCompetitionForm));
