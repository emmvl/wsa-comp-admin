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
    message,
    Tooltip
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
    clearCompReducerDataAction,
    onInviteesSearchAction
} from "../../store/actions/registrationAction/competitionFeeAction";
import {
    competitionFeeInit, getVenuesTypeAction, clearFilter, searchVenueList,
    getCommonDiscountTypeTypeAction, getOnlyYearListAction
} from "../../store/actions/appAction";
import moment from "moment";
import history from "../../util/history";
import { isArrayNotEmpty, isNullOrEmptyString } from "../../util/helpers";
import ValidationConstants from "../../themes/validationConstant";
import { NavLink } from "react-router-dom";
import Loader from '../../customComponents/loader';
import { getUserId, getOrganisationData } from "../../util/sessionStorage"
import { getAffiliateToOrganisationAction } from "../../store/actions/userAction/userAction";
import CustumToolTip from 'react-png-tooltip'

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;
let this_Obj = null;
const genderArray = [{
    description: "Male",
    id: 2,
    name: "male",
},
{
    description: "Female",
    id: 2,
    name: "female",
}
]


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
                prefix="$"
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
                prefix="$"
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
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={fee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "fee", "seasonal")} />
        )
    },
    {
        title: "Competition GST",
        dataIndex: "gst",
        key: "gst",
        render: (gst, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={gst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "gst", "seasonal")} />
        )
    },

    {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: total => <Input style={{ width: 95 }} prefix="$" className="input-inside-table-fees" value={total} disabled={true} />
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
                prefix="$"
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
                prefix="$"
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
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={fee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "fee", "casual")} />
        )
    },
    {
        title: "Competition GST",
        dataIndex: "gst",
        key: "gst",
        render: (gst, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={gst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "gst", "casual")} />
        )
    },
    {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: total => <Input style={{ width: 95 }} prefix="$" className="input-inside-table-fees" value={total} disabled={true} />
    }
];


const playerSeasonalTableAssociation = [
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
                prefix="$"
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
                prefix="$"
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
            <Input prefix="$" type="number" disabled={true} className="input-inside-table-fees" value={fee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "fee", "seasonal")} />
        )
    },
    {
        title: "Competition GST",
        dataIndex: "gst",
        key: "gst",
        render: (gst, record, index) => (
            <Input prefix="$" type="number" disabled={true} className="input-inside-table-fees" value={gst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "gst", "seasonal")} />
        )
    },
    {
        title: "Association Fees (excl. GST)",
        dataIndex: "affiliateFee",
        key: "affiliateFee",
        render: (affiliateFee, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={affiliateFee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "affiliateFee", "seasonal")} />
        )
    },
    {
        title: "Association GST",
        dataIndex: "affiliateGst",
        key: "affiliateGst",
        render: (affiliateGst, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={affiliateGst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "affiliateGst", "seasonal")} />
        )
    },

    {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: total => <Input style={{ width: 95 }} prefix="$" className="input-inside-table-fees" value={total} disabled={true} />
    }
];



const playercasualTableAssociation = [
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
                prefix="$"
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
                prefix="$"
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
            <Input type="number" disabled={true} className="input-inside-table-fees" value={fee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "fee", "casual")} />
        )
    },
    {
        title: "Competition GST",
        dataIndex: "gst",
        key: "gst",
        render: (gst, record, index) => (
            <Input prefix="$" type="number" disabled={true} className="input-inside-table-fees" value={gst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "gst", "casual")} />
        )
    },
    {
        title: "Association Fees (excl. GST)",
        dataIndex: "affiliateFee",
        key: "affiliateFee",
        render: (affiliateFee, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={affiliateFee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "affiliateFee", "casual")} />
        )
    },
    {
        title: "Association GST",
        dataIndex: "affiliateGst",
        key: "affiliateGst",
        render: (affiliateGst, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={affiliateGst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "affiliateGst", "casual")} />
        )
    },
    {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: total => <Input style={{ width: 95 }} prefix="$" className="input-inside-table-fees" value={total} disabled={true} />
    }
];

const playerSeasonalTableClub = [
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
                prefix="$"
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
                prefix="$"
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
            <Input prefix="$" type="number" disabled={true} className="input-inside-table-fees" value={fee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "fee", "seasonal")} />
        )
    },
    {
        title: "Competition GST",
        dataIndex: "gst",
        key: "gst",
        render: (gst, record, index) => (
            <Input prefix="$" type="number" disabled={true} className="input-inside-table-fees" value={gst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "gst", "seasonal")} />
        )
    },
    {
        title: "Club Fees (excl. GST)",
        dataIndex: "affiliateFee",
        key: "affiliateFee",
        render: (affiliateFee, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={affiliateFee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "affiliateFee", "seasonal")} />
        )
    },
    {
        title: "Club GST",
        dataIndex: "affiliateGst",
        key: "affiliateGst",
        render: (affiliateGst, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={affiliateGst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "affiliateGst", "seasonal")} />
        )
    },

    {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: total => <Input style={{ width: 95 }} prefix="$" className="input-inside-table-fees" value={total} disabled={true} />
    }
];



const playercasualTableClub = [
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
                prefix="$"
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
                prefix="$"
                className="input-inside-table-fees"
                disabled={true}
                value={membershipGst}
            />
        )
    },
    {
        title: "Competition fees (excl. GST)",
        dataIndex: "fee",
        key: "fee",
        render: (fee, record, index) => (
            <Input prefix="$" type="number" disabled={true} className="input-inside-table-fees" value={fee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "fee", "casual")} />
        )
    },
    {
        title: "Competition GST",
        dataIndex: "gst",
        key: "gst",
        render: (gst, record, index) => (
            <Input prefix="$" type="number" disabled={true} className="input-inside-table-fees" value={gst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "gst", "casual")} />
        )
    },
    {
        title: "Club fees (excl. GST)",
        dataIndex: "affiliateFee",
        key: "affiliateFee",
        render: (affiliateFee, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={affiliateFee} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "affiliateFee", "casual")} />
        )
    },
    {
        title: "Club GST",
        dataIndex: "affiliateGst",
        key: "affiliateGst",
        render: (affiliateGst, record, index) => (
            <Input prefix="$" disabled={this_Obj.state.permissionState.allDisable} type="number" className="input-inside-table-fees" value={affiliateGst} onChange={(e) => this_Obj.onChangeDetails(e.target.value, index, record, "affiliateGst", "casual")} />
        )
    },

    {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: total => <Input style={{ width: 95 }} prefix="$" className="input-inside-table-fees" value={total} disabled={true} />
    }
];



const permissionObject = {
    compDetailDisable: false,
    regInviteesDisable: false,
    membershipDisable: false,
    divisionsDisable: false,
    feesTableDisable: false,
    paymentsDisable: false,
    discountsDisable: false,
    allDisable: false,
    isPublished: false
}

class RegistrationCompetitionFee extends Component {
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
            buttonPressed: "next",
            logoIsDefault: false,
            logoSetDefault: false,
            logoUrl: "",
            isSetDefaul: false,
            competitionIsUsed: false,
            isCreatorEdit: false, //////// user is owner of the competition than isCreatorEdit will be false 
            organisationTypeRefId: 0,
            isPublished: false,
            isRegClosed: false,
            tooltipVisibleDelete: false,
            tooltipVisibleDraft: false,
            tooltipVisiblePublish: false,
            roundsArray: [{ id: 3, value: 3 }, { id: 4, value: 4 }, { id: 5, value: 5 },
                { id: 6, value: 6 }, { id: 7, value: 7 }, { id: 8, value: 8 }, { id: 9, value: 9 },
                { id: 10, value: 10 }, { id: 11, value: 11 }, { id: 12, value: 12 }, { id: 13, value: 13 },
                { id: 14, value: 14 }, { id: 15, value: 15 }, { id: 16, value: 16 }, { id: 17, value: 17 },
                { id: 18, value: 18 }],
            permissionState: permissionObject,
            divisionTable: [
                {
                    title: "Division Name",
                    dataIndex: "divisionName",
                    key: "divisionName",
                    render: (divisionName, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (

                            <Form.Item >
                                {getFieldDecorator(`divisionName${record.parentIndex}${index}`, {
                                    rules: [{ required: true, message: ValidationConstants.divisionName }],
                                })(
                                    <Input className="input-inside-table-fees"
                                        required={"required-field pt-0 pb-0"}
                                        setFieldsValue={divisionName}
                                        onChange={e => this.divisionTableDataOnchange(e.target.value, record, index, "divisionName")}
                                        disabled={this.state.permissionState.divisionsDisable} />
                                )}
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "Gender Restriction",
                    dataIndex: "genderRestriction",
                    key: "genderRestriction",
                    filterDropdown: true,
                    filterIcon: () => {
                        return (

                            <CustumToolTip placement="bottom" background='#ff8237'>
                                <span>{AppConstants.genderRestrictionMsg}</span>
                            </CustumToolTip>


                        );
                    },
                    render: (genderRestriction, record, index) => (
                        <Checkbox
                            className="single-checkbox mt-1"
                            disabled={this.state.permissionState.divisionsDisable}
                            checked={genderRestriction}
                            onChange={e => this.divisionTableDataOnchange(e.target.checked, record, index, "genderRestriction")}
                        ></Checkbox>
                    )
                },
                {
                    dataIndex: "genderRefId",
                    key: "genderRefId",
                    // width:  ? "20%" : null,
                    render: (genderRefId, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (
                            record.genderRestriction &&
                            <Form.Item >
                                {getFieldDecorator(`genderRefId${record.parentIndex}${index}`,
                                    { rules: [{ required: true, message: ValidationConstants.genderRestriction }] })(
                                        <Select
                                            className='division-age-select'
                                            style={{ width: "100%", minWidth: 120, }}
                                            onChange={genderRefId => this.divisionTableDataOnchange(genderRefId, record, index, "genderRefId")}
                                            setFieldsValue={genderRefId}
                                            placeholder={"Select"}
                                            disabled={this.state.permissionState.divisionsDisable}
                                        >
                                            {this.props.commonReducerState.genderDataEnum.map(item => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.description}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                            </Form.Item>
                        )
                    }
                },

                {
                    title: "Age Restriction",
                    dataIndex: "ageRestriction",
                    key: "ageRestriction",
                    filterDropdown: true,
                    filterIcon: () => {
                        return (

                            <CustumToolTip placement="bottom" background='#ff8237'>
                                <span>{AppConstants.ageRestrictionMsg}</span>
                            </CustumToolTip>


                        );
                    },
                    render: (ageRestriction, record, index) => (
                        <Checkbox
                            className="single-checkbox mt-1"
                            checked={ageRestriction}
                            onChange={e => this.divisionTableDataOnchange(e.target.checked, record, index, "ageRestriction")}
                            disabled={this.state.permissionState.divisionsDisable}
                        ></Checkbox>
                    )
                },
                {
                    title: "DOB From",
                    dataIndex: "fromDate",
                    key: "fromDate",
                    width: "25%",
                    render: (fromDate, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (
                            <Form.Item >
                                {getFieldDecorator(`fromDate${record.parentIndex}${index}`,
                                    { rules: [{ required: record.ageRestriction, message: ValidationConstants.pleaseSelectDOBFrom }] })(
                                        <DatePicker
                                            size="large"
                                            className="comp-venue-time-datepicker"
                                            style={{ width: "100%", minWidth: 135 }}
                                            onChange={date => this.divisionTableDataOnchange(moment(date).format("YYYY-MM-DD"), record, index, "fromDate")}
                                            format={"DD-MM-YYYY"}
                                            showTime={false}
                                            disabled={!record.ageRestriction || this.state.permissionState.divisionsDisable}
                                            setFieldsValue={fromDate !== null && moment(fromDate)}
                                            disabledDate={d => !d || d.isSameOrAfter(record.toDate)
                                            }
                                        />
                                    )}
                            </Form.Item>
                        )
                    }
                },
                {
                    title: "DOB To",
                    dataIndex: "toDate",
                    width: "25%",
                    key: "toDate",
                    render: (toDate, record, index) => {
                        const { getFieldDecorator } = this.props.form;
                        return (
                            <Form.Item >
                                {getFieldDecorator(`toDate${record.parentIndex}${index}`,
                                    { rules: [{ required: record.ageRestriction, message: ValidationConstants.PleaseSelectDOBTo }] })(
                                        <DatePicker
                                            size="large"
                                            className="comp-venue-time-datepicker"
                                            style={{ width: "100%", minWidth: 135 }}
                                            onChange={date => this.divisionTableDataOnchange(moment(date).format("YYYY-MM-DD"), record, index, "toDate")}
                                            format={"DD-MM-YYYY"}
                                            showTime={false}
                                            disabled={!record.ageRestriction || this.state.permissionState.divisionsDisable}
                                            setFieldsValue={toDate !== null && moment(toDate)}
                                            // disabledDate={d => !d || d.isSameOrBefore(record.fromDate)
                                            // }
                                            disabledDate={d => moment(record.fromDate).isSameOrAfter(d, 'day')
                                            }
                                        />
                                    )}
                            </Form.Item>
                        )
                    }
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
                                onClick={() => !this.state.permissionState.divisionsDisable ? this.addRemoveDivision(index, record, "remove") : null}
                            />
                        </span>
                    )
                }
            ],
            divisionState: false

        };

        this_Obj = this;
        let competitionId = null
        competitionId = this.props.location.state ? this.props.location.state.id : null
        competitionId !== null && this.props.clearCompReducerDataAction("all")
    }

    componentDidUpdate(nextProps) {
        let competitionFeesState = this.props.competitionFeesState
        if (competitionFeesState.onLoad === false && this.state.loading === true) {
            this.setState({ loading: false })
            if (!competitionFeesState.error) {
                this.setState({
                    // loading: false,
                    competitionTabKey: JSON.stringify(JSON.parse(this.state.competitionTabKey) + 1),
                    logoSetDefault: false,
                    image: null
                })
            }
            if (this.state.buttonPressed == "save" || this.state.buttonPressed == "publish" || this.state.buttonPressed == "delete") {
                history.push('/registrationCompetitionList');
            }
        }
        if (nextProps.competitionFeesState !== competitionFeesState) {
            if (competitionFeesState.getCompAllDataOnLoad === false && this.state.getDataLoading == true) {
                let registrationInviteesRefId = 7
                let inviteeArray = competitionFeesState.competitionDetailData.invitees
                if (isArrayNotEmpty(inviteeArray)) {
                    let index = inviteeArray.findIndex(x => x.registrationInviteesRefId == 7 || x.registrationInviteesRefId == 8)
                    if (index > -1) {
                        registrationInviteesRefId = inviteeArray[index].registrationInviteesRefId
                    }
                }
                this.callAnyorgSearchApi(registrationInviteesRefId)
                let isPublished = competitionFeesState.competitionDetailData.statusRefId == 2 ? true : false

                let registrationCloseDate = competitionFeesState.competitionDetailData.registrationCloseDate
                    && moment(competitionFeesState.competitionDetailData.registrationCloseDate)
                let isRegClosed = registrationCloseDate ? !registrationCloseDate.isSameOrAfter(moment()) : false;

                let creatorId = competitionFeesState.competitionCreator
                let orgData = getOrganisationData()
                let organisationUniqueKey = orgData ? orgData.organisationUniqueKey : 0
                // let userId = getUserId();
                let isCreatorEdit = creatorId == organisationUniqueKey ? false : true;

                this.setPermissionFields(isPublished, isRegClosed, isCreatorEdit)

                this.setState({
                    getDataLoading: false,
                    profileImage: competitionFeesState.competitionDetailData.competitionLogoUrl,
                    competitionIsUsed: competitionFeesState.competitionDetailData.isUsed,
                    isPublished,
                    isRegClosed,
                    isCreatorEdit
                })
                this.setDetailsFieldValue()
            }
        }


        if (this.state.divisionState === true) {
            this.setState({ divisionState: false })
            this.setDetailsFieldValue()
        }
    }



    callAnyorgSearchApi = (registrationInviteesRefId) => {
        if (registrationInviteesRefId == 7) {
            this.props.onInviteesSearchAction("", 3)
        }
        if (registrationInviteesRefId == 8) {
            this.props.onInviteesSearchAction("", 4)
        }


    }


    ////disable or enable particular fields
    setPermissionFields = (isPublished, isRegClosed, isCreatorEdit) => {
        if (isPublished) {
            if (isRegClosed) {
                let permissionObject = {
                    compDetailDisable: true,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    divisionsDisable: true,
                    feesTableDisable: true,
                    paymentsDisable: true,
                    discountsDisable: true,
                    allDisable: true,
                    isPublished: true
                }
                this.setState({ permissionState: permissionObject })
                return
            }
            if (isCreatorEdit) {
                let permissionObject = {
                    compDetailDisable: true,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    divisionsDisable: true,
                    feesTableDisable: true,
                    paymentsDisable: true,
                    discountsDisable: false,
                    allDisable: false,
                    isPublished: true
                }
                this.setState({ permissionState: permissionObject })
            }
            else {
                let permissionObject = {
                    compDetailDisable: false,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    divisionsDisable: true,
                    feesTableDisable: true,
                    paymentsDisable: false,
                    discountsDisable: false,
                    allDisable: false,
                    isPublished: true
                }
                this.setState({ permissionState: permissionObject })
            }
        }
        else {
            let permissionObject = {
                compDetailDisable: false,
                regInviteesDisable: false,
                membershipDisable: false,
                divisionsDisable: false,
                feesTableDisable: false,
                paymentsDisable: false,
                discountsDisable: false,
                allDisable: false,
                isPublished: false
            }
            this.setState({ permissionState: permissionObject })
        }
    }

    componentDidMount() {
        let orgData = getOrganisationData()
        this.setState({ organisationTypeRefId: orgData.organisationTypeRefId })
        let competitionId = null
        competitionId = this.props.location.state ? this.props.location.state.id : null
        this.apiCalls(competitionId, orgData.organisationUniqueKey)
        this.setDetailsFieldValue()
        let checkVenueScreen = this.props.location.state ? this.props.location.state.venueScreen ?
            this.props.location.state.venueScreen : null : null
        checkVenueScreen ? window.scrollTo(0, 500) : window.scrollTo(0, 0)
    }

    ////alll the api calls
    apiCalls = (competitionId, organisationId) => {
        // this.props.getAffiliateToOrganisationAction(organisationId);
        this.props.getOnlyYearListAction(this.props.appState.yearList)
        this.props.getDefaultCompFeesLogoAction()
        this.props.competitionDiscountTypesAction()
        this.props.competitionFeeInit();
        this.props.paymentFeeDeafault()
        this.props.paymentSeasonalFee()
        this.props.getCommonDiscountTypeTypeAction()
        this.props.getVenuesTypeAction();
        if (competitionId !== null) {
            let hasRegistration = 1
            this.props.getAllCompetitionFeesDeatilsAction(competitionId, hasRegistration)
            this.setState({ getDataLoading: true })
        }
        else {
            let hasRegistration = 1
            this.props.getDefaultCompFeesMembershipProductTabAction(hasRegistration)
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
        let charityTitle = this.props.competitionFeesState.charityTitle
        let charityDescription = this.props.competitionFeesState.charityDescription
        let postCharityRoundUpData = JSON.parse(JSON.stringify(paymentDataArr.charityRoundUp))
        console.log("paymentDataArr", paymentDataArr.charityRoundUp, charityTitle, charityDescription)
        postCharityRoundUpData.map((item) => {
            item.charityRoundUpName = charityTitle
            item.charityRoundUpDescription = charityDescription
        })
        paymentDataArr.charityRoundUp = postCharityRoundUpData
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
                if (item.competitionTypeDiscountTypeRefId !== 3) {
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
        console.log("discountDataArr", discountDataArr)
        let finalOrgPostDiscountData = JSON.parse(JSON.stringify(discountDataArr))
        let orgData = getOrganisationData()
        let currentOrganisationId = orgData ? orgData.organisationId : 0
        let filterOrgPostDiscountData = finalOrgPostDiscountData.filter(x => x.organisationId == currentOrganisationId);
        console.log("filterOrgPostDiscountData", filterOrgPostDiscountData)
        let discountBody = {
            "competitionId": competitionId,
            "statusRefId": this.state.statusRefId,
            "competitionDiscounts": [
                {
                    "discounts": filterOrgPostDiscountData
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
            registrationCloseDate: compFeesState.competitionDetailData.registrationCloseDate && moment(compFeesState.competitionDetailData.registrationCloseDate),
            selectedVenues: compFeesState.selectedVenues,
            startDate: compFeesState.competitionDetailData.startDate && moment(compFeesState.competitionDetailData.startDate),
            endDate: compFeesState.competitionDetailData.endDate && moment(compFeesState.competitionDetailData.endDate),
            charityTitle: compFeesState.charityTitle,
            charityDescription: compFeesState.charityDescription,
        })
        let data = this.props.competitionFeesState.competionDiscountValue
        let discountData = data && data.competitionDiscounts !== null ? data.competitionDiscounts[0].discounts : []
        console.log("discountData", data.competitionDiscounts)
        discountData.length > 0 && discountData.map((item, index) => {
            let competitionMembershipProductTypeId = `competitionMembershipProductTypeId${index}`
            let membershipProductUniqueKey = `membershipProductUniqueKey${index}`
            let competitionTypeDiscountTypeRefId = `competitionTypeDiscountTypeRefId${index}`
            this.props.form.setFieldsValue({
                [competitionMembershipProductTypeId]: item.competitionMembershipProductTypeId,
                [membershipProductUniqueKey]: item.membershipProductUniqueKey,
                [competitionTypeDiscountTypeRefId]: item.competitionTypeDiscountTypeRefId,
            })
            let childDiscounts = item.childDiscounts !== null && item.childDiscounts.length > 0 ? item.childDiscounts : []
            childDiscounts.map((childItem, childindex) => {
                let childDiscountPercentageValue = `percentageValue${index} + ${childindex}`
                this.props.form.setFieldsValue({
                    [childDiscountPercentageValue]: childItem.percentageValue
                })
            })
        })
        let divisionData = this.props.competitionFeesState.competitionDivisionsData
        let divisionArray = divisionData !== null ? divisionData : []
        console.log("divisionArray", divisionArray)
        divisionArray.length > 0 && divisionArray.map((item, index) => {
            console.log(item)
            item.divisions.map((divItem, divIndex) => {
                let divisionName = `divisionName${index}${divIndex}`
                let genderRefId = `genderRefId${index}${divIndex}`
                let fromDate = `fromDate${index}${divIndex}`
                let toDate = `toDate${index}${divIndex}`
                this.props.form.setFieldsValue({
                    [divisionName]: divItem.divisionName,
                    [genderRefId]: divItem.genderRefId ? divItem.genderRefId : [],
                    [fromDate]: divItem.fromDate && moment(divItem.fromDate),
                    [toDate]: divItem.toDate && moment(divItem.toDate),
                });
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
                        } else {
                            feeSeasonalData = fee_data[i].seasonal.perType
                            feeCasualData = fee_data[i].casual.perType
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
                if (finalpostarray.length > 0) {
                    this.props.saveCompetitionFeeSection(finalpostarray, competitionId)
                    this.setState({ loading: true })
                }
                else {
                    message.error(ValidationConstants.feesCannotBeEmpty)
                }
            }
        })
    }

    checkDivisionEmpty(data) {
        for (let i in data) {
            if (data[i].divisions.length == 0) {
                return true
            }
        }
    }



    saveAPIsActionCall = (e) => {
        e.preventDefault();
        let tabKey = this.state.competitionTabKey
        let compFeesState = this.props.competitionFeesState
        let competitionId = compFeesState.competitionId
        let postData = compFeesState.competitionDetailData
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let nonPlayingDate = JSON.stringify(postData.nonPlayingDates)
                let venue = JSON.stringify(compFeesState.postVenues)
                // let invitees = compFeesState.postInvitees
                let invitees = compFeesState.affiliateArray.concat(compFeesState.anyOrgAffiliateArr)
                console.log(invitees, "compFeesState")
                if (tabKey == "1") {
                    if (compFeesState.competitionDetailData.competitionLogoUrl !== null && invitees.length > 0) {
                        let formData = new FormData();
                        formData.append("competitionUniqueKey", competitionId);
                        formData.append("name", postData.competitionName);
                        formData.append("yearRefId", values.yearRefId);
                        formData.append("description", postData.description);
                        formData.append("competitionTypeRefId", postData.competitionTypeRefId);
                        formData.append("competitionFormatRefId", postData.competitionFormatRefId);
                        formData.append("startDate", postData.startDate);
                        formData.append("endDate", postData.endDate);
                        if (postData.competitionFormatRefId == 4) {
                            if (postData.noOfRounds !== null && postData.noOfRounds !== '') formData.append("noOfRounds", postData.noOfRounds);
                        }
                        if (postData.roundInDays !== null && postData.roundInDays !== '') formData.append("roundInDays", postData.roundInDays);
                        if (postData.roundInHours !== null && postData.roundInHours !== '') formData.append("roundInHours", postData.roundInHours);
                        if (postData.roundInMins !== null && postData.roundInMins !== '') formData.append("roundInMins", postData.roundInMins);
                        if (postData.minimunPlayers !== null && postData.minimunPlayers !== '') formData.append("minimunPlayers", postData.minimunPlayers);
                        if (postData.maximumPlayers !== null && postData.maximumPlayers !== '') formData.append("maximumPlayers", postData.maximumPlayers);
                        formData.append("venues", venue);
                        formData.append("registrationCloseDate", postData.registrationCloseDate);
                        formData.append("statusRefId", this.state.isPublished ? 2 : this.state.statusRefId);
                        formData.append("nonPlayingDates", nonPlayingDate);
                        formData.append("invitees", JSON.stringify(invitees));
                        formData.append("logoSetAsDefault", this.state.logoSetDefault)
                        formData.append("hasRegistration", 1);
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
                        if (compFeesState.postInvitees.length == 0) {
                            message.error(ValidationConstants.pleaseSelectRegInvitees)
                        }
                        if (compFeesState.competitionDetailData.competitionLogoUrl == null) {
                            message.error(ValidationConstants.competitionLogoIsRequired)
                        }
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
                    let finalDivisionPayload = {
                        statusRefId: this.state.statusRefId,
                        divisions: payload
                    }
                    console.log("payload", finalDivisionPayload)

                    if (this.checkDivisionEmpty(divisionArrayData) == true) {
                        message.error(ValidationConstants.pleaseAddDivisionForMembershipProduct)
                    }
                    else {
                        this.props.saveCompetitionFeesDivisionAction(finalDivisionPayload, competitionId)
                        this.setState({ loading: true })
                    }
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
        this.props.divisionTableDataOnchangeAction(checked, record, index, keyword)
        this.setState({ divisionState: true })
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
                            {AppConstants.competitionFees}
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
            let files_ = data.files[0].type.split("image/")
            let fileType = files_[1]

            if (data.files[0].size > AppConstants.logo_size) {
                message.error(AppConstants.logoImageSize);
                return
            }

            if (fileType == `jpeg` || fileType == `png` || fileType == `gif`) {
                this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]), isSetDefaul: true })
                this.props.add_editcompetitionFeeDeatils(URL.createObjectURL(data.files[0]), "competitionLogoUrl")
                this.props.add_editcompetitionFeeDeatils(false, "logoIsDefault")

            } else {
                message.error(AppConstants.logoType);
                return
            }
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
        let compDetailDisable = this.state.permissionState.compDetailDisable
        return (
            <div className="fluid-width mt-3">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            placeholder={AppConstants.name}
                            value={item.name}
                            onChange={(e) => this.updateNonPlayingNames(e.target.value, index, "name")}
                            disabled={compDetailDisable}

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
                            disabled={compDetailDisable}

                        />
                    </div>
                    <div className="col-sm-2 transfer-image-view" onClick={() => !compDetailDisable ? this.props.add_editcompetitionFeeDeatils(index, "nonPlayingDataRemove") : null}>
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



    //// On change Invitees
    onInviteesChange(value) {
        console.log(value, 'value')
        let regInviteesselectedData = this.props.competitionFeesState.selectedInvitees
        let arr = [value]
        this.props.add_editcompetitionFeeDeatils(arr, "invitees")
        if (value == 7) {
            this.onInviteeSearch("", 3)
        }
        else if (value == 8) {
            this.onInviteeSearch("", 4)
        }
    }

    /////on change logo isdefault
    logoIsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(value, key)
        this.setState({ logoSetDefault: false, isSetDefaul: false, image: null })
    }
    // search venue  
    handleSearch = (value, data) => {
        const filteredData = data.filter(memo => {
            return memo.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        })
        this.props.searchVenueList(filteredData)
    };

    ////onChange save as default logo
    logoSaveAsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(false, key)
        this.setState({ logoSetDefault: value })
    }

    ////////form content view - fee details
    contentView = (getFieldDecorator) => {
        let appState = this.props.appState
        let detailsData = this.props.competitionFeesState
        let defaultCompFeesOrgLogo = detailsData.defaultCompFeesOrgLogo
        let compDetailDisable = this.state.permissionState.compDetailDisable
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
                                disabled={compDetailDisable}
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
                                        // alt="animated"
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
                                disabled={compDetailDisable}
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
                                disabled={compDetailDisable}
                            >
                                {AppConstants.useDefault}
                            </Checkbox>}

                            {this.state.isSetDefaul == true && <Checkbox
                                className="single-checkbox ml-0"
                                checked={this.state.logoSetDefault}
                                onChange={e =>
                                    this.logoSaveAsDefaultOnchange(e.target.checked, "logoIsDefault")
                                }
                                disabled={compDetailDisable}
                            >
                                {AppConstants.useAffiliateLogo}
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
                    disabled={compDetailDisable}
                />


                <div style={{ marginTop: 15 }} >
                    <InputWithHead required={"required-field pb-0 "} heading={AppConstants.venue} />
                    <Form.Item  >
                        {getFieldDecorator('selectedVenues', { rules: [{ required: true, message: ValidationConstants.pleaseSelectvenue }] })(
                            <Select
                                mode="multiple"
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={venueSelection => {
                                    this.onSelectValues(venueSelection, detailsData)
                                }}

                                // value={detailsData.selectedVenues}
                                placeholder={AppConstants.selectVenue}
                                filterOption={false}
                                onSearch={(value) => { this.handleSearch(value, appState.mainVenueList) }}
                                disabled={compDetailDisable}
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
                        )}
                    </Form.Item>
                </div>
                {compDetailDisable == false &&
                    <NavLink
                        to={{
                            pathname: `/competitionVenueAndTimesAdd`,
                            state: {
                                key: AppConstants.competitionFees,
                                id: this.props.location.state ? this.props.location.state.id : null
                            }
                        }}
                    >
                        <span className="input-heading-add-another">+{AppConstants.addVenue}</span>
                    </NavLink>
                }
                <span className="applicable-to-heading required-field">{AppConstants.typeOfCompetition}</span>
                <Form.Item  >
                    {getFieldDecorator('competitionTypeRefId', { initialValue: 1 }, { rules: [{ required: true, message: ValidationConstants.pleaseSelectCompetitionType }] })(
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionTypeRefId")}
                            setFieldsValue={detailsData.competitionTypeRefId}
                            disabled={compDetailDisable}
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
                            disabled={compDetailDisable}
                        >
                            {appState.competitionFormatTypes.length > 0 && appState.competitionFormatTypes.map(item => {
                                return (
                                    <div className='contextualHelp-RowDirection' >
                                        <Radio key={item.id} value={item.id}> {item.description}</Radio>

                                        <div style={{ marginLeft: -20, marginTop: -5 }}>
                                            <CustumToolTip background='#ff8237'>
                                                <span>{item.helpMsg}</span>
                                            </CustumToolTip>
                                        </div>
                                    </div>
                                );
                            })}
                        </Radio.Group>
                    )}
                </Form.Item>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead heading={AppConstants.compStartDate} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator('startDate',
                                    { rules: [{ required: true, message: ValidationConstants.startDateIsRequired }] })(
                                        <DatePicker
                                            size="large"
                                            style={{ width: "100%" }}
                                            onChange={date => this.dateOnChangeFrom(date, "startDate")}
                                            format={"DD-MM-YYYY"}
                                            showTime={false}
                                            // value={detailsData.competitionDetailData.startDate && moment(detailsData.competitionDetailData.startDate, "YYYY-MM-DD")}
                                            disabled={compDetailDisable}
                                        />
                                    )}
                            </Form.Item>
                        </div>
                        <div className="col-sm">
                            <InputWithHead heading={AppConstants.compCloseDate} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator('endDate',
                                    { rules: [{ required: true, message: ValidationConstants.endDateIsRequired }] })(
                                        <DatePicker
                                            size="large"
                                            style={{ width: "100%" }}
                                            onChange={date => this.dateOnChangeFrom(date, "endDate")}
                                            format={"DD-MM-YYYY"}
                                            showTime={false}
                                            disabledDate={d => !d || d.isBefore(detailsData.competitionDetailData.startDate)}
                                            disabled={compDetailDisable}
                                        />
                                    )}
                            </Form.Item>
                        </div>
                    </div>
                </div>
                {/* <div className="col-sm"> */}
                {detailsData.competitionDetailData.competitionFormatRefId == 4 &&
                    <div>
                        <InputWithHead heading={AppConstants.numberOfRounds} required={"required-field"} />
                        <Form.Item >
                            {getFieldDecorator('numberOfRounds',
                                { rules: [{ required: true, message: ValidationConstants.numberOfRoundsNameIsRequired }] })(
                                    <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                        placeholder={AppConstants.selectRound}
                                        onChange={(e) => this.props.add_editcompetitionFeeDeatils(e, "noOfRounds")}
                                        value={detailsData.competitionDetailData.noOfRounds}
                                        disabled={compDetailDisable}
                                    >
                                        {this.state.roundsArray.map(item => {
                                            return (
                                                <Option key={item.id} value={item.id}>{item.value}</Option>
                                            );
                                        })}
                                    </Select>
                                )}
                        </Form.Item>
                    </div>
                }
                {/* </div> */}
                <InputWithHead heading={AppConstants.timeBetweenRounds} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                placeholder={AppConstants.days}
                                value={detailsData.competitionDetailData.roundInDays}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInDays")}
                                disabled={compDetailDisable}

                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                placeholder={AppConstants.hours}
                                value={detailsData.competitionDetailData.roundInHours}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInHours")}
                                disabled={compDetailDisable}
                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                placeholder={AppConstants.mins}
                                value={detailsData.competitionDetailData.roundInMins}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInMins")}
                                disabled={compDetailDisable}

                            />
                        </div>
                    </div>
                </div>
                <InputWithHead heading={AppConstants.registration_close} required={"required-field"} />
                <Form.Item >
                    {getFieldDecorator('registrationCloseDate',
                        { rules: [{ required: true, message: ValidationConstants.registrationCloseDateIsRequired }] })(
                            <DatePicker
                                size="large"
                                placeholder={"Select Date"}
                                style={{ width: "100%" }}
                                onChange={date => this.dateOnChangeFrom(date, "registrationCloseDate")}
                                name={"registrationCloseDate"}
                                format={"DD-MM-YYYY"}
                                showTime={false}
                                disabled={compDetailDisable}
                            />
                        )}
                </Form.Item>

                <div className="inside-container-view pt-4">
                    <InputWithHead heading={AppConstants.nonPlayingDates} />
                    {detailsData.competitionDetailData.nonPlayingDates && detailsData.competitionDetailData.nonPlayingDates.map((item, index) =>
                        this.nonPlayingDateView(item, index))
                    }
                    <a>
                        <span onClick={() => !compDetailDisable ? this.addNonPlayingDate() : null} className="input-heading-add-another">
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
                                disabled={compDetailDisable}

                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                placeholder={AppConstants.maxNumber}
                                value={detailsData.competitionDetailData.maximumPlayers}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "maximumPlayers")}
                                disabled={compDetailDisable}

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
    }


    membershipProductView = () => {
        let membershipProductData = this.props.competitionFeesState.defaultCompFeesMembershipProduct
        let membershipProductArray = membershipProductData !== null ? membershipProductData : []
        let membershipDisable = this.state.permissionState.membershipDisable
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
                            disabled={membershipDisable}
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
        let membershipDisable = this.state.permissionState.membershipDisable
        return (
            <div  >
                {typeData.map((typeItem, typeIndex) =>
                    <div style={{ display: "-ms-flexbox", flexDirection: "column", justifyContent: "center" }} >
                        <Checkbox
                            className="single-checkbox pt-3"
                            checked={typeItem.isTypeSelected}
                            onChange={e => this.membershipTypeSelected(e.target.checked, index, typeIndex)}
                            key={typeIndex}
                            disabled={membershipDisable}
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
        let divisionsDisable = this.state.permissionState.divisionsDisable
        return (
            <div className="fees-view pt-5">
                <span className="form-heading" >{AppConstants.divisions}</span>
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
                            {item.isPlayingStatus == true ?
                                <div>
                                    <div className="table-responsive">
                                        <Table
                                            className="fees-table"
                                            columns={this.state.divisionTable}
                                            dataSource={item.divisions}
                                            pagination={false}
                                            Divider="false"
                                            key={index}
                                        />
                                    </div>
                                    <a>
                                        <span className="input-heading-add-another" onClick={() => !divisionsDisable ? this.addRemoveDivision(index, item, "add") : null}>+ {AppConstants.addDivision}</span>
                                    </a>
                                </div> :
                                  <span className="applicable-to-heading pt-0 pl-2">
                                  {AppConstants.nonPlayerDivisionMessage}
                              </span>}
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

    getOrgLevelForFeesTable = () => {
        const registrationInviteesRefIdObject = {
            [AppConstants.association]: 2,
            [AppConstants.club]: 3,
            [AppConstants.anyAssociation]: 7,
            [AppConstants.anyClub]: 8,
        }
        let detailData = this.props.competitionFeesState.competitionDetailData
        let inviteesArray = detailData.invitees
        let inviteeFilter = inviteesArray.filter((x => x.registrationInviteesRefId == 2 || x.registrationInviteesRefId == 3 || x.registrationInviteesRefId == 7 || x.registrationInviteesRefId == 8))
        console.log("inviteeFilter", inviteeFilter)
        let orgLevel = ""
        if (isArrayNotEmpty(inviteeFilter)) {
            let registrationInviteesRefId = inviteeFilter[0].registrationInviteesRefId
            orgLevel = Object.keys(registrationInviteesRefIdObject).find(key => registrationInviteesRefIdObject[key] === registrationInviteesRefId);
        }
        return orgLevel
    }

    seasonalFeesOnOrgLevel() {
        let isCreatorEdit = this.state.isCreatorEdit
        let orgLevel = this.getOrgLevelForFeesTable()
        console.log("orgLevel", orgLevel)
        if (isCreatorEdit && orgLevel == AppConstants.association) {
            return playerSeasonalTableAssociation
        }
        else if (isCreatorEdit && orgLevel == AppConstants.club) {
            return playerSeasonalTableClub
        }
        else if (isCreatorEdit && orgLevel == AppConstants.anyAssociation) {
            return playerSeasonalTableAssociation
        }
        else if (isCreatorEdit && orgLevel == AppConstants.anyClub) {
            return playerSeasonalTableClub
        }
        else {
            return playerSeasoTable
        }
    }

    casualFeesOnOrgLevel() {
        let isCreatorEdit = this.state.isCreatorEdit
        let orgLevel = this.getOrgLevelForFeesTable()
        if (isCreatorEdit && orgLevel == AppConstants.association) {
            return playercasualTableAssociation
        }
        else if (isCreatorEdit && orgLevel == AppConstants.club) {
            return playercasualTableClub
        }
        else if (isCreatorEdit && orgLevel == AppConstants.anyAssociation) {
            return playercasualTableAssociation
        }
        else if (isCreatorEdit && orgLevel == AppConstants.anyClub) {
            return playercasualTableClub
        }
        else {
            return playercasualTable
        }
    }

    feesView = () => {
        let allStates = this.props.competitionFeesState
        let feeDetails = allStates.competitionFeesData
        let feesTableDisable = this.state.permissionState.feesTableDisable
        return (
            <div className="fees-view pt-5">
                <span className="form-heading required-field">{AppConstants.fees}</span>
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
                                disabled={feesTableDisable}
                            >
                                <div className="fluid-width">
                                    <div className="row">
                                        <div className="col-sm-2">
                                            <div className='contextualHelp-RowDirection' >
                                                <Radio value={"allDivisions"}>{AppConstants.allDivisions}</Radio>
                                                <div style={{ marginLeft: -20 }}>
                                                    <CustumToolTip background='#ff8237'>
                                                        <span>{AppConstants.allDivisionsMsg}</span>
                                                    </CustumToolTip>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-sm-2"
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            <div className='contextualHelp-RowDirection' >
                                                <Radio value={"perDivision"}>{AppConstants.perDivision}</Radio>
                                                <div style={{ marginLeft: -20 }}>
                                                    <CustumToolTip background='#ff8237'>
                                                        <span>{AppConstants.perDivisionMsg}</span>
                                                    </CustumToolTip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Radio.Group>
                            <div style={{ marginTop: 5 }}>
                                <div style={{ marginTop: 5 }}>
                                    <Checkbox
                                        checked={item.isSeasonal}
                                        className="single-checkbox"
                                        disabled={feesTableDisable}
                                        onChange={e => {
                                            this.props.checkUncheckcompetitionFeeSction(e.target.checked, index, "isSeasonal")
                                        }
                                        }
                                    >
                                        {AppConstants.seasonalFee}
                                    </Checkbox>
                                </div>
                                {item.isSeasonal == true && (
                                    <div className="table-responsive mt-2">
                                        <Table
                                            className="fees-table"
                                            columns={this.seasonalFeesOnOrgLevel()}
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
                                        disabled={feesTableDisable}
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
                                            columns={this.casualFeesOnOrgLevel()}
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

    disableInvitee = (inItem) => {
        let orgLevelId = JSON.stringify(this.state.organisationTypeRefId)
        if (inItem.id == "2" && orgLevelId == "3") {
            return false
        }
        if (inItem.id == "3" && orgLevelId == "4") {
            return false
        }
        if (inItem.id == "2" && orgLevelId == "4") {
            return false
        }
        // if (inItem.id == "7" && orgLevelId == "3") {
        //     return false
        // }
        // if (inItem.id == "8" && orgLevelId == "4") {
        //     return false
        // }
        // if (inItem.id == "7" && orgLevelId == "4") {
        //     return false
        // }
        else {
            return true
        }
    }


    affiliateSearchOnchange = (affiliateOrgKey) => {
        this.props.add_editcompetitionFeeDeatils(affiliateOrgKey, "affiliateOrgKey")

    }


    onInviteeSearch = (value, inviteesType) => {
        console.log(value, "**** value")
        this.props.onInviteesSearchAction(value, inviteesType)
    }


    // ////////reg invitees search view for any organisation
    // affiliatesSearchInvitee = (subItem) => {
    //     let detailsData = this.props.competitionFeesState
    //     let seletedInvitee = detailsData.selectedInvitees.find(x => x);
    //     let associationAffilites = detailsData.associationAffilites
    //     let clubAffilites = detailsData.clubAffilites
    //     let regInviteesDisable = this.state.permissionState.regInviteesDisable
    //     if (subItem.id == 7 && seletedInvitee == 7) {
    //         return (
    //             < div >
    //                 <Select
    //                     mode="multiple"
    //                     style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
    //                     onChange={associationAffilite => {
    //                         this.affiliateSearchOnchange(associationAffilite)
    //                     }}
    //                     value={detailsData.affiliateOrgSelected}
    //                     placeholder={AppConstants.selectOrganisation}
    //                     filterOption={false}
    //                     onSearch={(value) => { this.onInviteeSearch(value, 3) }}
    //                     disabled={regInviteesDisable}
    //                     showSearch={true}
    //                     onBlur={() => this.onInviteeSearch("", 3)}
    //                 // loading={detailsData.searchLoad}
    //                 >
    //                     {associationAffilites.map((item) => {
    //                         return (
    //                             <Option
    //                                 key={item.organisationId}
    //                                 value={item.organisationId}>
    //                                 {item.name}</Option>
    //                         )
    //                     })}
    //                 </Select>
    //             </div>
    //         )
    //     }
    //     else if (subItem.id == 8 && seletedInvitee == 8) {

    //         return (

    //             < div >
    //                 <Select
    //                     mode="multiple"
    //                     style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
    //                     onChange={clubAffilite => {
    //                         // this.onSelectValues(venueSelection, detailsData)
    //                         this.affiliateSearchOnchange(clubAffilite)
    //                     }}

    //                     value={detailsData.affiliateOrgSelected}
    //                     placeholder={AppConstants.selectOrganisation}
    //                     filterOption={false}
    //                     // onSearch={(value) => { this.handleSearch(value, appState.mainVenueList) }}
    //                     onSearch={(value) => { this.onInviteeSearch(value, 4) }}
    //                     disabled={regInviteesDisable}
    //                     onBlur={() => this.onInviteeSearch("", 4)}
    //                 // loading={detailsData.searchLoad}
    //                 >
    //                     {clubAffilites.map((item) => {
    //                         return (
    //                             <Option
    //                                 key={item.organisationId}
    //                                 value={item.organisationId}>
    //                                 {item.name}</Option>
    //                         )
    //                     })}
    //                 </Select>
    //             </div>
    //         )
    //     }

    // }



    // regInviteesView = () => {
    //     let invitees = this.props.appState.registrationInvitees.length > 0 ? this.props.appState.registrationInvitees : [];
    //     let detailsData = this.props.competitionFeesState
    //     let seletedInvitee = detailsData.selectedInvitees.find(x => x);
    //     let orgLevelId = JSON.stringify(this.state.organisationTypeRefId)
    //     let regInviteesDisable = this.state.permissionState.regInviteesDisable
    //     console.log(this.props.competitionFeesState.postInvitees)
    //     return (
    //         <div className="fees-view pt-5">
    //             <span className="form-heading required-field">{AppConstants.registrationInvitees}</span>
    //             <div>
    //                 <Radio.Group
    //                     className="reg-competition-radio"
    //                     disabled={regInviteesDisable}
    //                     onChange={(e) => this.onInviteesChange(e.target.value)}
    //                     value={seletedInvitee}>
    //                     {(invitees || []).map((item, index) =>
    //                         (
    //                             <div>
    //                                 {item.subReferences.length == 0 ?
    //                                     <Radio value={item.id}>{item.description}</Radio>
    //                                     : <div>
    //                                         <div class="applicable-to-heading invitees-main">{orgLevelId == "4" && item.id == 1 ? "" : item.description}</div>
    //                                         {(item.subReferences).map((subItem, subIndex) => (
    //                                             <div style={{ marginLeft: '20px' }}>
    //                                                 {this.disableInvitee(subItem) &&
    //                                                     <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
    //                                                 }
    //                                                 {this.affiliatesSearchInvitee(subItem)}
    //                                             </div>
    //                                         ))}
    //                                     </div>
    //                                 }
    //                             </div>
    //                         ))
    //                     }
    //                 </Radio.Group>
    //             </div>
    //         </div >
    //     );
    // };


    ////////reg invitees search view for any organisation
    affiliatesSearchInvitee = (subItem, seletedInvitee) => {
        let detailsData = this.props.competitionFeesState
        let associationAffilites = detailsData.associationAffilites
        let clubAffilites = detailsData.clubAffilites
        const { associationLeague, clubSchool } = this.props.competitionFeesState
        let regInviteesDisable = this.state.permissionState.regInviteesDisable
        if (subItem.id == 7 && seletedInvitee == 7) {
            return (
                < div >
                    <Select
                        mode="multiple"
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={associationAffilite => {
                            this.props.add_editcompetitionFeeDeatils(associationAffilite, "associationAffilite")
                        }}
                        value={associationLeague}
                        placeholder={AppConstants.selectOrganisation}
                        filterOption={false}
                        onSearch={(value) => { this.onInviteeSearch(value, 3) }}
                        disabled={regInviteesDisable}
                        showSearch={true}
                        onBlur={() => isArrayNotEmpty(associationAffilites) == false ? this.onInviteeSearch("", 3) : null}
                        onFocus={() => isArrayNotEmpty(associationAffilites) == false ? this.onInviteeSearch("", 3) : null}
                        loading={detailsData.searchLoad}
                    >
                        {associationAffilites.map((item) => {
                            console.log(item, 'associationAffilites')
                            return (
                                <Option
                                    key={item.organisationId}
                                    value={item.organisationId}>
                                    {item.name}</Option>
                            )
                        })}
                    </Select>
                </div>
            )
        }
        else if (subItem.id == 8 && seletedInvitee == 8) {

            return (

                < div >
                    <Select
                        mode="multiple"
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={clubAffilite => {
                            // this.onSelectValues(venueSelection, detailsData)
                            this.props.add_editcompetitionFeeDeatils(clubAffilite, "clubAffilite")
                        }}

                        value={clubSchool}
                        placeholder={AppConstants.selectOrganisation}
                        filterOption={false}
                        onSearch={(value) => { this.onInviteeSearch(value, 4) }}
                        disabled={regInviteesDisable}
                        onBlur={() => this.onInviteeSearch("", 4)}
                        onBlur={() => isArrayNotEmpty(clubAffilites) == false ? this.onInviteeSearch("", 4) : null}
                        onFocus={() => isArrayNotEmpty(clubAffilites) == false ? this.onInviteeSearch("", 4) : null}
                        loading={detailsData.searchLoad}
                    >
                        {clubAffilites.map((item) => {
                            return (
                                <Option
                                    key={item.organisationId}
                                    value={item.organisationId}>
                                    {item.name}</Option>
                            )
                        })}
                    </Select>
                </div>
            )
        }

    }



    regInviteesView = () => {
        let invitees = this.props.appState.registrationInvitees.length > 0 ? this.props.appState.registrationInvitees : [];
        const { affiliateSelected, anyOrgSelected, otherSelected, nonSelected, affiliateNonSelected, anyOrgNonSelected } = this.props.competitionFeesState
        console.log(this.props.appState.registrationInvitees, 'invitees')
        let orgLevelId = JSON.stringify(this.state.organisationTypeRefId)
        let regInviteesDisable = this.state.permissionState.regInviteesDisable
        return (
            <div className="fees-view pt-5">
                <span className="form-heading required-field">{AppConstants.registrationInvitees}</span>
                <div>
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "affiliateSelected")}
                        disabled={regInviteesDisable}
                        value={affiliateSelected}
                    >
                        {(invitees || []).map((item, index) =>
                            (
                                index == 0
                                &&
                                <div>
                                    {item.subReferences.length == 0 ?
                                        <Radio value={item.id}>{item.description}</Radio>
                                        : <div>
                                            {(orgLevelId == "4" && item.id == 1) == false ?

                                                <div className='contextualHelp-RowDirection' >
                                                    <div class="applicable-to-heading invitees-main">{item.description}</div>
                                                    <div style={{ marginTop: 2 }}>
                                                        <CustumToolTip background='#ff8237'>
                                                            <span>{item.helpMsg}</span>
                                                        </CustumToolTip>
                                                    </div>
                                                </div>
                                                : null}
                                            {(item.subReferences).map((subItem, subIndex) => (
                                                subItem.id == 2
                                                    ?
                                                    <>
                                                        <div style={{ marginLeft: '20px' }}>
                                                            {this.disableInvitee(subItem) &&
                                                                <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                            }
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div style={{ marginLeft: '20px' }}>
                                                            {this.disableInvitee(subItem) &&
                                                                <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                            }
                                                        </div>
                                                        <div style={{ marginLeft: 20 }}>
                                                            {this.disableInvitee(subItem) &&
                                                                <Radio.Group
                                                                    onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "affiliateNonSelected")}
                                                                    disabled={regInviteesDisable}
                                                                    value={affiliateNonSelected}
                                                                >
                                                                    <Radio

                                                                        key={'none1'} value={'none1'}>{'None'}</Radio>
                                                                </Radio.Group>
                                                            }
                                                        </div>
                                                    </>

                                            ))}
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </Radio.Group>


                    <Radio.Group
                        className="reg-competition-radio mt-0"
                        // onChange={(e) => this.onInviteesChange(e.target.value)}
                        onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "anyOrgSelected")}
                        value={anyOrgSelected}
                        disabled={regInviteesDisable}
                    >
                        {(invitees || []).map((item, index) =>
                            (
                                index == 1
                                &&
                                <div>
                                    {item.subReferences.length == 0 ?
                                        <Radio value={item.id}>{item.description}</Radio>
                                        : <div>
                                            <div className='contextualHelp-RowDirection' >
                                                <div class="applicable-to-heading invitees-main">{item.description}</div>
                                                <div style={{ marginTop: 2 }}>
                                                    <CustumToolTip background='#ff8237'>
                                                        <span>{item.helpMsg}</span>
                                                    </CustumToolTip>
                                                </div>
                                            </div>
                                            {(item.subReferences).map((subItem, subIndex) => (
                                                <div style={{ marginLeft: '20px' }}>
                                                    <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                    {this.affiliatesSearchInvitee(subItem, anyOrgSelected)}
                                                </div>
                                            ))}
                                            <div style={{ marginLeft: 20 }}>
                                                <Radio.Group
                                                    onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "anyOrgNonSelected")}
                                                    value={anyOrgNonSelected}
                                                    disabled={regInviteesDisable}
                                                >
                                                    <Radio

                                                        key={'none2'} value={'none2'}>{'None'}</Radio>
                                                </Radio.Group>
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </Radio.Group>

                    <Radio.Group
                        className="reg-competition-radio mt-0"
                        onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "otherSelected")}
                        disabled={regInviteesDisable}
                        value={otherSelected}
                    >
                        {(invitees || []).map((item, index) =>
                            (
                                index > 1
                                &&
                                <div>
                                    {item.subReferences.length == 0 ?
                                        <div className='contextualHelp-RowDirection' >
                                            <Radio value={item.id}>{item.description}</Radio>
                                            <div style={{ marginLeft: -20, marginTop: 2 }}>
                                                <CustumToolTip background='#ff8237'>
                                                    <span>{item.helpMsg}</span>
                                                </CustumToolTip>
                                            </div>
                                        </div>
                                        : <div>
                                            <div class="applicable-to-heading invitees-main">{item.description}</div>
                                            {(item.subReferences).map((subItem, subIndex) => (
                                                <div style={{ marginLeft: '20px' }}>
                                                    <Radio
                                                        disabled={regInviteesDisable}
                                                        onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "none")}
                                                        key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            ))
                        }
                    </Radio.Group>


                </div>
            </div >
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

    checkIsSeasonal = (feeDetails) => {
        let isSeasonalValue = false
        for (let i in feeDetails) {
            if (feeDetails[i].isSeasonal == true) {
                isSeasonalValue = true
                break
            }
        }
        return isSeasonalValue
    }
    checkIsCasual = (feeDetails) => {
        let isCasuallValue = false
        for (let i in feeDetails) {
            if (feeDetails[i].isCasual == true) {
                isCasuallValue = true
                break
            }

        }
        return isCasuallValue
    }



    //payment Option View in tab 5
    paymentOptionsView = () => {
        let allStates = this.props.competitionFeesState
        let feeDetails = allStates.competitionFeesData
        let isSeasonal = this.checkIsSeasonal(feeDetails)
        let isCasual = this.checkIsCasual(feeDetails)
        let casualPayment = this.props.competitionFeesState.casualPaymentDefault
        let seasonalPayment = this.props.competitionFeesState.seasonalPaymentDefault
        let paymentData = this.props.competitionFeesState.competitionPaymentsData
        let selectedSeasonalFeeKey = this.props.competitionFeesState.SelectedSeasonalFeeKey
        let selectedCasualFeeKey = this.props.competitionFeesState.selectedCasualFeeKey
        let paymentsDisable = this.state.permissionState.paymentsDisable
        let seasonalExpendeKey = (selectedSeasonalFeeKey.includes("6") || selectedSeasonalFeeKey.includes("7") || selectedSeasonalFeeKey.includes("8")
            || selectedSeasonalFeeKey.includes(6) || selectedSeasonalFeeKey.includes(7) || selectedSeasonalFeeKey.includes(8)) ? "5" : null
        let casuallExpendeKey = (selectedCasualFeeKey.includes("6") || selectedCasualFeeKey.includes("7") || selectedCasualFeeKey.includes("8")
            || selectedCasualFeeKey.includes(6) || selectedCasualFeeKey.includes(7) || selectedCasualFeeKey.includes(8)) ? "5" : null
        console.log(seasonalExpendeKey)
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.paymentOptions}</span>
                {(isSeasonal == false && isCasual == false) &&
                    <span className="applicable-to-heading pt-0">
                        {AppConstants.please_Sel_Fee}
                    </span>
                }
                {isSeasonal == true &&
                    <div className="inside-container-view">
                        <div className='contextualHelp-RowDirection' >
                            <span className="form-heading">{AppConstants.seasonalFee}</span>
                            <div style={{ marginTop: 4 }}>
                                <CustumToolTip placement="top" background='#ff8237'>
                                    <span>{AppConstants.paymentSeasonalFeeMsg}</span>
                                </CustumToolTip>
                            </div>
                        </div>
                        <Tree
                            style={{ flexDirection: 'column' }}
                            className="tree-government-rebate tree-selection-icon"
                            checkable
                            expandedKeys={[seasonalExpendeKey]}
                            defaultCheckedKeys={[]}
                            checkedKeys={selectedSeasonalFeeKey}
                            onCheck={(e) => this.onChangeSeasonalFee(e, paymentData)}
                            disabled={paymentsDisable}
                        >
                            {this.seasonalDataTree(seasonalPayment)}
                        </Tree>
                    </div>
                }
                {isCasual == true && <div className="inside-container-view">
                    <div className='contextualHelp-RowDirection' >
                        <span className="form-heading">{AppConstants.casualFee}</span>
                        <div style={{ marginTop: 4 }}>
                            <CustumToolTip placement="top" background='#ff8237'>
                                <span>{AppConstants.paymentCausalFeeMsg}</span>
                            </CustumToolTip>
                        </div>
                    </div>
                    <Tree
                        style={{ flexDirection: 'column' }}
                        className="tree-government-rebate tree-selection-icon"
                        checkable
                        defaultExpandedKeys={[]}
                        defaultCheckedKeys={[]}
                        expandedKeys={[casuallExpendeKey]}
                        checkedKeys={selectedCasualFeeKey}
                        onCheck={(e) => this.onChangeCasualFee(e, paymentData)}
                        disabled={paymentsDisable}
                    >
                        {this.casualDataTree(casualPayment)}
                    </Tree>
                </div>
                }
                <div>
                </div>
            </div >
        );
    };


    //////charity voucher view
    charityVoucherView = (getFieldDecorator) => {
        let charityRoundUp = this.props.competitionFeesState.charityRoundUp
        let paymentData = this.props.competitionFeesState.competitionPaymentsData
        let paymentsDisable = this.state.permissionState.paymentsDisable
        let checkCharityArray = this.props.competitionFeesState.competitionPaymentsData.charityRoundUp
        return (
            <div className="advanced-setting-view pt-5">
                <div className='contextualHelp-RowDirection' >
                    <span className="form-heading">{AppConstants.charityRoundUp}</span>
                    <div style={{ marginTop: 4 }}>
                        <CustumToolTip placement="top" background='#ff8237'>
                            <span>{AppConstants.charityRoundUpMsg}</span>
                        </CustumToolTip>
                    </div>
                </div>
                <div className="inside-container-view">
                    {charityRoundUp.map((item, index) => {
                        return (
                            <div className="row">
                                <Checkbox
                                    className="single-checkbox mt-3"
                                    checked={item.isSelected}
                                    onChange={(e) => this.onChangeCharity(e.target.checked, index, "charityRoundUp")}
                                    disabled={paymentsDisable}
                                >
                                    {item.description}
                                </Checkbox>
                            </div>
                        )
                    })}
                </div>

                {checkCharityArray.length > 0 &&
                    <div>
                        <Form.Item >
                            {getFieldDecorator('charityTitle',
                                { rules: [{ required: true, message: ValidationConstants.charityTitleNameIsRequired }] })(
                                    <InputWithHead
                                        heading={AppConstants.title}
                                        placeholder={AppConstants.title}
                                        // value={charityTitle}
                                        disabled={paymentsDisable}
                                        onChange={(e) => this.props.updatePaymentOption(e.target.value, null, "title")}
                                    />
                                )}
                        </Form.Item>
                        <InputWithHead heading={AppConstants.description} />
                        <Form.Item >
                            {getFieldDecorator('charityDescription',
                                { rules: [{ required: true, message: ValidationConstants.charityDescriptionIsRequired }] })(
                                    <TextArea
                                        placeholder={AppConstants.addCharityDescription}
                                        allowClear
                                        // value={charityDescription}
                                        onChange={(e) => this.props.updatePaymentOption(e.target.value, null, "description")}
                                        disabled={paymentsDisable}
                                    />
                                )}
                        </Form.Item>
                    </div>
                }

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
        let discountsDisable = this.state.permissionState.discountsDisable
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
                                    disabled={discountsDisable}
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
        this.setDetailsFieldValue()
    }

    //On change membership product discount type
    onChangeMembershipProductDisType = (discountType, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts
        discountData[index].competitionTypeDiscountTypeRefId = discountType
        this.props.updatedDiscountDataAction(discountData)
        if (discountType == 3) {
            if (isArrayNotEmpty(discountData[index].childDiscounts) == false) {
                this.addRemoveChildDiscount(index, "add", -1)
            }
        }
    }

    discountViewChange = (item, index, getFieldDecorator) => {
        let childDiscounts = item.childDiscounts !== null && item.childDiscounts.length > 0 ? item.childDiscounts : []
        // let discountsDisable = this.state.permissionState.discountsDisable
        switch (item.competitionTypeDiscountTypeRefId) {

            case 1:
                return <div>
                    <InputWithHead heading={"Discount Type"} />
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
                        placeholder="Select"
                        value={item.discountTypeRefId}
                        disabled={this.checkDiscountDisable(item.organisationId)}
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
                                disabled={this.checkDiscountDisable(item.organisationId)}
                                suffix={JSON.stringify(item.discountTypeRefId) == "2" ? "%" : null}
                                type="number"
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.description}
                                placeholder={AppConstants.gernalDiscount}
                                onChange={(e) => this.onChangeDescription(e.target.value, index)}
                                value={item.description}
                                disabled={this.checkDiscountDisable(item.organisationId)}
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
                                    disabled={this.checkDiscountDisable(item.organisationId)}
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
                                    disabled={this.checkDiscountDisable(item.organisationId)}
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
                        disabled={this.checkDiscountDisable(item.organisationId)}
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
                        disabled={this.checkDiscountDisable(item.organisationId)}
                    />
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.percentageOff_FixedAmount}
                                placeholder={AppConstants.percentageOff_FixedAmount}
                                onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                value={item.amount}
                                disabled={this.checkDiscountDisable(item.organisationId)}
                                suffix={JSON.stringify(item.discountTypeRefId) == "2" ? "%" : null}
                                type="number"
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.description}
                                placeholder={AppConstants.gernalDiscount}
                                onChange={(e) => this.onChangeDescription(e.target.value, index)}
                                value={item.description}
                                disabled={this.checkDiscountDisable(item.organisationId)}
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
                                    disabled={this.checkDiscountDisable(item.organisationId)}
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
                                    disabled={this.checkDiscountDisable(item.organisationId)}
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
                                <Form.Item  >
                                    {getFieldDecorator(`percentageValue${index} + ${childindex}`,
                                        { rules: [{ required: true, message: ValidationConstants.pleaseEnterChildDiscountPercentage }] })(
                                            <InputWithHead
                                                heading={`Child ${childindex + 1}%`}
                                                placeholder={`Child ${childindex + 1}%`}
                                                onChange={(e) => this.onChangeChildPercent(e.target.value, index, childindex, childItem)}
                                                // value={childItem.percentageValue}
                                                disabled={this.checkDiscountDisable(item.organisationId)}
                                                type={"number"}
                                            />
                                        )}
                                </Form.Item>
                            </div>
                            {childindex > 0 &&
                                <div className="col-sm-2 delete-image-view pb-4"
                                    onClick={() => !this.checkDiscountDisable(item.organisationId) ? this.addRemoveChildDiscount(index, "delete", childindex) : null}>
                                    <span className="user-remove-btn">
                                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </span>
                                    <span className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                                </div>
                            }
                        </div>
                    ))}
                    <span className="input-heading-add-another"
                        onClick={() => !this.checkDiscountDisable(item.organisationId) ? this.addRemoveChildDiscount(index, "add", -1) : null}>
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
                        disabled={this.checkDiscountDisable(item.organisationId)}
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
                                disabled={this.checkDiscountDisable(item.organisationId)}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.description}
                                placeholder={AppConstants.gernalDiscount}
                                onChange={(e) => this.onChangeDescription(e.target.value, index)}
                                value={item.description}
                                disabled={this.checkDiscountDisable(item.organisationId)}
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
                                    disabled={this.checkDiscountDisable(item.organisationId)}

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
                                    disabled={this.checkDiscountDisable(item.organisationId)}

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
                        disabled={this.checkDiscountDisable(item.organisationId)}
                    />
                    <InputWithHead
                        heading={AppConstants.question}
                        placeholder={AppConstants.question}
                        onChange={(e) => this.onChangeQuestion(e.target.value, index)}
                        value={item.question}
                        disabled={this.checkDiscountDisable(item.organisationId)}
                    />
                    <InputWithHead heading={"Apply Discount if Answer is Yes"} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.applyDiscountQuestionCheck(e.target.value, index)}
                        value={JSON.stringify(JSON.parse(item.applyDiscount))}
                        disabled={this.checkDiscountDisable(item.organisationId)}
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
        if (keyWord == "delete") {
            this.setDetailsFieldValue()
        }
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

    ////to check discount fields would be enable or disable
    checkDiscountDisable = (organisationId) => {
        let discountsDisable = this.state.permissionState.discountsDisable
        let orgData = getOrganisationData()
        let currentOrganisationId = orgData ? orgData.organisationId : 0
        if (discountsDisable == false) {
            if (currentOrganisationId == organisationId) {
                return false
            }
            else {
                return true
            }
        }
        else {
            return true
        }
    }




    ////discount view inside the content
    discountView = (getFieldDecorator) => {
        let data = this.props.competitionFeesState.competionDiscountValue
        let discountData = data && data.competitionDiscounts !== null ? data.competitionDiscounts[0].discounts : []
        let membershipPrdArr = this.props.competitionFeesState.competitionMembershipProductData !== null ? this.props.competitionFeesState.competitionMembershipProductData : []
        let discountsDisable = this.state.permissionState.discountsDisable
        console.log("discountData", discountData)
        return (
            <div className="discount-view pt-5">
                <div className='contextualHelp-RowDirection' >
                    <span className="form-heading">{AppConstants.discounts}</span>
                    <div style={{ marginTop: 4 }}>
                        <CustumToolTip placement="bottom" background='#ff8237'>
                            <span>{AppConstants.discountMsg}</span>
                        </CustumToolTip>
                    </div>
                </div>
                {discountData.length > 0 && discountData.map((item, index) => (
                    <div className="prod-reg-inside-container-view">
                        <div className="transfer-image-view pt-2"
                            onClick={() => !this.checkDiscountDisable(item.organisationId) ? this.addRemoveDiscount("remove", index) : null}>
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                            <span className="user-remove-text mr-0">{AppConstants.remove}</span>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead required="pt-0" heading={"Discount Type"} />
                                <Form.Item  >
                                    {getFieldDecorator(`competitionTypeDiscountTypeRefId${index}`,
                                        { rules: [{ required: true, message: ValidationConstants.pleaseSelectDiscountType }] })(
                                            <Select
                                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                                onChange={discountTypeItem => this.onChangeMembershipProductDisType(discountTypeItem, index)}
                                                placeholder="Select"
                                                // value={item.competitionTypeDiscountTypeRefId !== 0 && item.competitionTypeDiscountTypeRefId}
                                                disabled={this.checkDiscountDisable(item.organisationId)}
                                            >
                                                {this.props.competitionFeesState.defaultDiscountType.map((discountTypeItem, discountTypeIndex) => {
                                                    return (
                                                        <Option key={"disType" + discountTypeItem.id} value={discountTypeItem.id}>
                                                            {discountTypeItem.description}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                </Form.Item>
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
                                                disabled={this.checkDiscountDisable(item.organisationId)}
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
                                            disabled={this.checkDiscountDisable(item.organisationId)}

                                        >
                                            {item.membershipProductTypes.length > 0 && item.membershipProductTypes.map(item => {
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
                        {this.discountViewChange(item, index, getFieldDecorator)}
                    </div>
                ))}

                < span className="input-heading-add-another" onClick={() => !discountsDisable ? this.addRemoveDiscount("add", -1) : null}>
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
            },
        });
    }

    deleteProduct = (competitionId) => {
        this.setState({ loading: true, buttonPressed: "delete" })
        this.props.regCompetitionListDeleteAction(competitionId)
    }


    buttonShowView() {
        if (this.state.isCreatorEdit) {
            return false
        } else {
            return true
        }
    }


    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let tabKey = this.state.competitionTabKey
        let competitionId = this.props.competitionFeesState.competitionId
        let isPublished = this.state.permissionState.isPublished
        let allDisable = this.state.permissionState.allDisable
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    {this.buttonShowView() ?
                        <div className="row">
                            <div className="col-sm">
                                <div className="reg-add-save-button">
                                    {competitionId ?
                                        <Tooltip style={{ height: "100%" }}
                                            onMouseEnter={() => this.setState({ tooltipVisibleDelete: isPublished ? true : false })}
                                            onMouseLeave={() => this.setState({ tooltipVisibleDelete: false })}
                                            visible={this.state.tooltipVisibleDelete}
                                            title={ValidationConstants.compIsPublished}>
                                            <Button
                                                disabled={isPublished}
                                                type="cancel-button"
                                                onClick={() => this.showDeleteConfirm()}>{AppConstants.delete}</Button>
                                        </Tooltip>
                                        : null}
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Tooltip style={{ height: "100%" }}
                                        onMouseEnter={() => this.setState({ tooltipVisibleDraft: isPublished ? true : false })}
                                        onMouseLeave={() => this.setState({ tooltipVisibleDraft: false })}
                                        visible={this.state.tooltipVisibleDraft}
                                        title={ValidationConstants.compIsPublished}>
                                        <Button
                                            className="save-draft-text" type="save-draft-text"
                                            disabled={isPublished}
                                            htmlType="submit"
                                            onClick={() => this.setState({ statusRefId: 1, buttonPressed: "save" })}>
                                            {AppConstants.saveAsDraft}
                                        </Button>
                                    </Tooltip>
                                    <Tooltip
                                        style={{ height: "100%" }}
                                        onMouseEnter={() =>
                                            this.setState({ tooltipVisiblePublish: (isPublished) && (tabKey === "2" || tabKey === "3") ? true : allDisable })}
                                        onMouseLeave={() => this.setState({ tooltipVisiblePublish: false })}
                                        visible={this.state.tooltipVisiblePublish}
                                        title={ValidationConstants.compIsPublished}>
                                        <Button
                                            className="publish-button"
                                            type="primary"
                                            htmlType="submit"
                                            disabled={tabKey === "1" || tabKey === "4" || tabKey === "5" || tabKey === "6" ? allDisable : isPublished}
                                            onClick={() => this.setState({
                                                statusRefId: tabKey == "6" && isPublished == true ? 3 : tabKey == "6" ? 2 : 1,
                                                buttonPressed: tabKey == "6" ? "publish" : "next"
                                            })}
                                            style={{ height: 48, width: 92.5 }}
                                        >
                                            {tabKey === "6" && isPublished == false
                                                ? AppConstants.publish
                                                : tabKey === "6" && isPublished == true
                                                    ? AppConstants.save
                                                    :
                                                    AppConstants.next}
                                        </Button>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        :
                        (tabKey == "4" || tabKey == "6") &&
                        <div className="row">
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button className="publish-button" type="primary"
                                        // disabled={allDisable}
                                        htmlType="submit" onClick={() => this.setState({
                                            statusRefId: tabKey == "6" && isPublished == true ? 3 : 2,
                                            // buttonPressed: "publish"
                                            buttonPressed: tabKey == "6" ? "publish" : "next"
                                        })}
                                    >
                                        {AppConstants.save}
                                    </Button>
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
        );

    };



    tabCallBack = (key) => {
        let competitionId = this.props.competitionFeesState.competitionId
        if (competitionId !== null && competitionId.length > 0) {
            this.setState({ competitionTabKey: key, divisionState: key == "3" ? true : false })
        }
        this.setDetailsFieldValue()
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        const { ...props } = this.props;
        console.log(this.props.competitionFeesState)
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"7"} />
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
                                    <TabPane tab={AppConstants.membership} key="2">
                                        <div className="tab-formView mt-5">{this.membershipProductView(getFieldDecorator)}</div>
                                        <div className="tab-formView mt-5">{this.membershipTypeView(getFieldDecorator)}</div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.divisions} key={"3"}>
                                        <div className="tab-formView">{this.divisionsView(getFieldDecorator)}</div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.fees} key={"4"}>
                                        <div className="tab-formView">{this.feesView(getFieldDecorator)}</div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.payments} key={"5"}>
                                        <div className="tab-formView">{this.paymentOptionsView(getFieldDecorator)}</div>
                                        <div className="tab-formView">{this.charityVoucherView(getFieldDecorator)}</div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.discounts} key={"6"}>
                                        <div className="tab-formView">{this.discountView(getFieldDecorator)}</div>
                                        <div className="tab-formView">{this.voucherView(getFieldDecorator)}</div>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <Loader visible={this.props.competitionFeesState.onLoad || this.state.getDataLoading} />
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
        searchVenueList,
        clearFilter,
        clearCompReducerDataAction,
        getAffiliateToOrganisationAction,
        onInviteesSearchAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(RegistrationCompetitionFee));
