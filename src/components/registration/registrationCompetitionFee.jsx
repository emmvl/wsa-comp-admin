import React, { Component, createRef } from 'react';
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
    Tooltip,
    Switch
} from 'antd';
import InputWithHead from '../../customComponents/InputWithHead';
import { captializedString } from "../../util/helpers"
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import AppImages from '../../themes/appImages';
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
    instalmentDateAction,
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
    onInviteesSearchAction,
    paymentMethodsDefaultAction
} from '../../store/actions/registrationAction/competitionFeeAction';
import {
    competitionFeeInit,
    getVenuesTypeAction,
    clearFilter,
    searchVenueList,
    getCommonDiscountTypeTypeAction,
    getOnlyYearListAction,
} from '../../store/actions/appAction';
import moment from 'moment';
import history from '../../util/history';
import { isArrayNotEmpty } from '../../util/helpers';
import ValidationConstants from '../../themes/validationConstant';
import { NavLink } from 'react-router-dom';
import Loader from '../../customComponents/loader';
import { /* getUserId, */ getOrganisationData } from '../../util/sessionStorage';
import { getAffiliateToOrganisationAction } from '../../store/actions/userAction/userAction';
import CustomToolTip from 'react-png-tooltip';
import { registrationRestrictionTypeAction } from '../../store/actions/commonAction/commonAction';
import { fixtureTemplateRoundsAction } from '../../store/actions/competitionModuleAction/competitionDashboardAction';
import { getCurrentYear } from 'util/permissions'
const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;
let this_Obj = null;

// const genderArray = [
//     {
//         description: 'Male',
//         id: 2,
//         name: 'male',
//     },
//     {
//         description: 'Female',
//         id: 2,
//         name: 'female',
//     },
// ];

const playerSeasonalTable = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipType',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipSeasonal',
        key: 'membershipSeasonal',
        width: 84,
        render: (membershipSeasonal) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipSeasonal}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            fee != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationFees',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            gst != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationGST',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={fee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'fee',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={gst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'gst',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: (total) => (
            <Input
                style={{ width: 95 }}
                prefix="$"
                className="input-inside-table-fees"
                value={total}
                disabled
            />
        ),
    },
];

const playerCasualTable = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipProductTypeName',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipCasual',
        key: 'membershipCasual',
        width: 84,
        render: (membershipCasual) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipCasual}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={fee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'fee',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={gst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'gst',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: (total) => (
            <Input
                style={{ width: 95 }}
                prefix="$"
                className="input-inside-table-fees"
                value={total}
                disabled
            />
        ),
    },
];

const playerSeasonalTableAssociation = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipType',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipSeasonal',
        key: 'membershipSeasonal',
        width: 84,
        render: (membershipSeasonal) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipSeasonal}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            fee != null ? (
                <Input
                    prefix="$"
                    disabled
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationFees',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            gst != null ? (
                <Input
                    prefix="$"
                    disabled
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationGST',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Affiliate Nomination Fees (excl. GST)',
        dataIndex: 'affNominationFees',
        key: 'affNominationFees',
        width: 84,
        render: (fee, record, index) => (
            (fee != null || record.teamRegChargeTypeRefId != 3) ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affNominationFees',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affNominationGST',
        key: 'affNominationGST',
        width: 84,
        render: (gst, record, index) => (
            (gst != null || record.teamRegChargeTypeRefId != 3) ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affNominationGST',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) => (
            <Input
                prefix="$"
                type="number"
                disabled
                className="input-inside-table-fees"
                value={fee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'fee',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) => (
            <Input
                prefix="$"
                type="number"
                disabled
                className="input-inside-table-fees"
                value={gst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'gst',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'Affiliate Fees (excl. GST)',
        dataIndex: 'affiliateFee',
        key: 'affiliateFee',
        width: 84,
        render: (affiliateFee, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={affiliateFee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'affiliateFee',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affiliateGst',
        key: 'affiliateGst',
        width: 84,
        render: (affiliateGst, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={affiliateGst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'affiliateGst',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: (total) => (
            <Input
                style={{ width: 95 }}
                prefix="$"
                className="input-inside-table-fees"
                value={total}
                disabled
            />
        ),
    },
];

const playerCasualTableAssociation = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipProductTypeName',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipCasual',
        key: 'membershipCasual',
        width: 84,
        render: (membershipCasual) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipCasual}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'Association Nomination Fees (excl. GST)',
        dataIndex: 'affNominationFees',
        key: 'affNominationFees',
        width: 84,
        render: (fee, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affNominationGST',
        key: 'affNominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) => (
            <Input
                type="number"
                disabled
                className="input-inside-table-fees"
                value={fee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'fee',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) => (
            <Input
                prefix="$"
                type="number"
                disabled
                className="input-inside-table-fees"
                value={gst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'gst',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'Affiliate Fees (excl. GST)',
        dataIndex: 'affiliateFee',
        key: 'affiliateFee',
        width: 84,
        render: (affiliateFee, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={affiliateFee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'affiliateFee',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affiliateGst',
        key: 'affiliateGst',
        width: 84,
        render: (affiliateGst, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={affiliateGst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'affiliateGst',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: (total) => (
            <Input
                style={{ width: 95 }}
                prefix="$"
                className="input-inside-table-fees"
                value={total}
                disabled
            />
        ),
    },
];

const playerSeasonalTableClub = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipType',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipSeasonal',
        key: 'membershipSeasonal',
        width: 84,
        render: (membershipSeasonal) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipSeasonal}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            fee != null ? (
                <Input
                    prefix="$"
                    disabled
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationFees',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            gst != null ? (
                <Input
                    prefix="$"
                    disabled
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationGST',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Affiliate Nomination Fees (excl. GST)',
        dataIndex: 'affNominationFees',
        key: 'affNominationFees',
        width: 84,
        render: (fee, record, index) => (
            fee != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affNominationFees',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affNominationGST',
        key: 'affNominationGST',
        width: 84,
        render: (gst, record, index) => (
            gst != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affNominationGST',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) => (
            <Input
                prefix="$"
                type="number"
                disabled
                className="input-inside-table-fees"
                value={fee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'fee',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) => (
            <Input
                prefix="$"
                type="number"
                disabled
                className="input-inside-table-fees"
                value={gst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'gst',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'Affiliate Fees (excl. GST)',
        dataIndex: 'affiliateFee',
        key: 'affiliateFee',
        width: 84,
        render: (affiliateFee, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={affiliateFee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'affiliateFee',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affiliateGst',
        key: 'affiliateGst',
        width: 84,
        render: (affiliateGst, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={affiliateGst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'affiliateGst',
                        'seasonal'
                    )
                }
            />
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: (total) => (
            <Input
                style={{ width: 95 }}
                prefix="$"
                className="input-inside-table-fees"
                value={total}
                disabled
            />
        ),
    },
];

const playerCasualTableClub = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipProductTypeName',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipCasual',
        key: 'membershipCasual',
        width: 84,
        render: (membershipCasual) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipCasual}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'Club Nomination Fees (excl. GST)',
        dataIndex: 'affNominationFees',
        key: 'affNominationFees',
        width: 84,
        render: (fee, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affNominationGST',
        key: 'affNominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'Competition fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) => (
            <Input
                prefix="$"
                type="number"
                disabled
                className="input-inside-table-fees"
                value={fee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'fee',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) => (
            <Input
                prefix="$"
                type="number"
                disabled
                className="input-inside-table-fees"
                value={gst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'gst',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'Affiliate fees (excl. GST)',
        dataIndex: 'affiliateFee',
        key: 'affiliateFee',
        width: 84,
        render: (affiliateFee, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={affiliateFee}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'affiliateFee',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affiliateGst',
        key: 'affiliateGst',
        width: 84,
        render: (affiliateGst, record, index) => (
            <Input
                prefix="$"
                disabled={this_Obj.state.permissionState.allDisable}
                type="number"
                className="input-inside-table-fees"
                value={affiliateGst}
                onChange={(e) =>
                    this_Obj.onChangeDetails(
                        e.target.value,
                        index,
                        record,
                        'affiliateGst',
                        'casual'
                    )
                }
            />
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: (total) => (
            <Input
                style={{ width: 95 }}
                prefix="$"
                className="input-inside-table-fees"
                value={total}
                disabled
            />
        ),
    },
];

const playerSeasonalTableTeamAssociation = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipType',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipSeasonal',
        key: 'membershipSeasonal',
        width: 84,
        render: (membershipSeasonal) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipSeasonal}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            ((fee != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationFees',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            ((gst != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationGST',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Affiliate Nomination Fees (excl. GST)',
        dataIndex: 'affNominationFees',
        key: 'affNominationFees',
        width: 84,
        render: (fee, record, index) => (
            ((fee != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affNominationFees',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affNominationGST',
        key: 'affNominationGST',
        width: 84,
        render: (gst, record, index) => (
            ((gst != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affNominationGST',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) =>
            fee != null ? (
                <Input
                    prefix="$"
                    type="number"
                    disabled
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'fee',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) =>
            gst != null ? (
                <Input
                    prefix="$"
                    type="number"
                    disabled
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'gst',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input
                        disabled
                        className="input-inside-table-fees"
                        value="N/A"
                    />
                ),
    },
    {
        title: 'Affiliate Fees (excl. GST)',
        dataIndex: 'affiliateFee',
        key: 'affiliateFee',
        width: 84,
        render: (affiliateFee, record, index) =>
            affiliateFee != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={affiliateFee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affiliateFee',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input
                        disabled
                        className="input-inside-table-fees"
                        value="N/A"
                    />
                ),
    },
    {
        title: 'GST',
        dataIndex: 'affiliateGst',
        key: 'affiliateGst',
        width: 84,
        render: (affiliateGst, record, index) =>
            affiliateGst != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={affiliateGst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affiliateGst',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input
                        disabled
                        className="input-inside-table-fees"
                        value="N/A"
                    />
                ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: () => (
            <Input
                disabled
                className="input-inside-table-fees"
                value="N/A"
            />
        ),
    },
];

const playerSeasonalTableTeamClub = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipType',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipSeasonal',
        key: 'membershipSeasonal',
        width: 84,
        render: (membershipSeasonal) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipSeasonal}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            ((fee != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationFees',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            ((gst != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationGST',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Affiliate Nomination Fees (excl. GST)',
        dataIndex: 'affNominationFees',
        key: 'affNominationFees',
        width: 84,
        render: (fee, record, index) => (
            ((fee != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affNominationFees',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affNominationGST',
        key: 'affNominationGST',
        width: 84,
        render: (gst, record, index) => (
            ((gst != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affNominationGST',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) =>
            fee != null ? (
                <Input
                    prefix="$"
                    type="number"
                    disabled
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'fee',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) =>
            gst != null ? (
                <Input
                    prefix="$"
                    type="number"
                    disabled
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'gst',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input
                        disabled
                        className="input-inside-table-fees"
                        value="N/A"
                    />
                ),
    },
    {
        title: 'Affiliate Fees (excl. GST)',
        dataIndex: 'affiliateFee',
        key: 'affiliateFee',
        width: 84,
        render: (affiliateFee, record, index) =>
            affiliateFee != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={affiliateFee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affiliateFee',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input
                        disabled
                        className="input-inside-table-fees"
                        value="N/A"
                    />
                ),
    },
    {
        title: 'GST',
        dataIndex: 'affiliateGst',
        key: 'affiliateGst',
        width: 84,
        render: (affiliateGst, record, index) =>
            affiliateGst != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={affiliateGst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affiliateGst',
                            'seasonal'
                        )
                    }
                />
            ) : (
                    <Input
                        disabled
                        className="input-inside-table-fees"
                        value="N/A"
                    />
                ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: () => (
            <Input
                disabled
                className="input-inside-table-fees"
                value="N/A"
            />
        ),
    },
];

const playerSeasonalTeamTable = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipType',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipSeasonal',
        key: 'membershipSeasonal',
        width: 84,
        render: (membershipSeasonal) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipSeasonal}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => {
            return (
                ((fee != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ?
                    (
                        <Input
                            prefix="$"
                            disabled={this_Obj.state.permissionState.allDisable}
                            type="number"
                            className="input-inside-table-fees"
                            value={fee}
                            onChange={(e) =>
                                this_Obj.onChangeDetails(
                                    e.target.value,
                                    index,
                                    record,
                                    'nominationFees',
                                    'seasonalTeam'
                                )
                            }
                        />
                    ) : (
                        <Input disabled className="input-inside-table-fees" value="N/A" />
                    )
            )
        },
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            ((gst != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'nominationGST',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) =>
            ((fee != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'fee',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input
                        disabled
                        className="input-inside-table-fees"
                        value="N/A"
                    />
                ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) =>
            ((gst != null || record.teamRegChargeTypeRefId != 3) && record.isPlayer == 1) ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'gst',
                            'seasonalTeam'
                        )
                    }
                />
            ) : (
                    <Input
                        disabled
                        className="input-inside-table-fees"
                        value="N/A"
                    />
                ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: () => (
            <Input
                disabled
                className="input-inside-table-fees"
                value="N/A"
            />
        ),
    },
];

const playerCasualTableTeamAssociation = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipProductTypeName',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipSeasonal',
        key: 'membershipSeasonal',
        width: 84,
        render: (membershipSeasonal) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipSeasonal}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'Association Nomination Fees (excl. GST)',
        dataIndex: 'affNominationFees',
        key: 'affNominationFees',
        width: 84,
        render: (fee, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affNominationGST',
        key: 'affNominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) => (
            fee != null ? (
                <Input
                    type="number"
                    disabled
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'fee',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) => (
            gst != null ? (
                <Input
                    prefix="$"
                    type="number"
                    disabled
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'gst',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Affiliate Fees (excl. GST)',
        dataIndex: 'affiliateFee',
        key: 'affiliateFee',
        width: 84,
        render: (affiliateFee, record, index) => (
            affiliateFee != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={affiliateFee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affiliateFee',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affiliateGst',
        key: 'affiliateGst',
        width: 84,
        render: (affiliateGst, record, index) => (
            affiliateGst != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={affiliateGst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affiliateGst',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: () => (
            <Input
                disabled
                className="input-inside-table-fees"
                value="N/A"
            />
        ),
    },
];

const playerCasualTableTeamClub = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipProductTypeName',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipSeasonal',
        key: 'membershipSeasonal',
        width: 84,
        render: (membershipSeasonal) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipSeasonal}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: () => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'Club Nomination Fees (excl. GST)',
        dataIndex: 'affNominationFees',
        key: 'affNominationFees',
        width: 84,
        render: (fee, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affNominationGST',
        key: 'affNominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'Competition fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) => (
            fee != null ? (
                <Input
                    prefix="$"
                    type="number"
                    disabled
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'fee',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) => (
            gst != null ? (
                <Input
                    prefix="$"
                    type="number"
                    disabled
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'gst',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Affiliate fees (excl. GST)',
        dataIndex: 'affiliateFee',
        key: 'affiliateFee',
        width: 84,
        render: (affiliateFee, record, index) => (
            affiliateFee != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={affiliateFee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affiliateFee',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'affiliateGst',
        key: 'affiliateGst',
        width: 84,
        render: (affiliateGst, record, index) => (
            affiliateGst != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={affiliateGst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'affiliateGst',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: () => (
            <Input
                disabled
                className="input-inside-table-fees"
                value="N/A"
            />
        ),
    },
];

const playerCasualTeamTable = [
    {
        title: 'Membership Type',
        dataIndex: 'membershipProductTypeName',
        key: 'membershipProductTypeName',
        width: 84,
        render: (membershipProductTypeName) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={membershipProductTypeName}
            />
        ),
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: 84,
        render: (division, record) => (
            <Input
                className="input-inside-table-fees"
                disabled
                value={
                    record.competitionMembershipProductDivisionId
                        ? record.divisionName
                        : 'N/A'
                }
            />
        ),
    },
    {
        title: 'Membership Fees (excl. GST)',
        dataIndex: 'membershipSeasonal',
        key: 'membershipSeasonal',
        width: 84,
        render: (membershipSeasonal) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipSeasonal}
            />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'membershipGst',
        key: 'membershipGst',
        width: 84,
        render: (membershipGst) => (
            <Input
                prefix="$"
                className="input-inside-table-fees"
                disabled
                value={membershipGst}
            />
        ),
    },
    {
        title: 'Nomination Fees (excl. GST)',
        dataIndex: 'nominationFees',
        key: 'nominationFees',
        width: 84,
        render: (fee, record, index) => (
            <Input disabled className="input-inside-table-fees" value="N/A" />
        ),
    },
    {
        title: 'GST',
        dataIndex: 'nominationGST',
        key: 'nominationGST',
        width: 84,
        render: (gst, record, index) => (
            <Input
                disabled
                className="input-inside-table-fees"
                value="N/A"
            />
        ),
    },
    {
        title: 'Competition Fees (excl. GST)',
        dataIndex: 'fee',
        key: 'fee',
        width: 84,
        render: (fee, record, index) => (
            fee != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={fee}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'fee',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'GST',
        dataIndex: 'gst',
        key: 'gst',
        width: 84,
        render: (gst, record, index) => (
            gst != null ? (
                <Input
                    prefix="$"
                    disabled={this_Obj.state.permissionState.allDisable}
                    type="number"
                    className="input-inside-table-fees"
                    value={gst}
                    onChange={(e) =>
                        this_Obj.onChangeDetails(
                            e.target.value,
                            index,
                            record,
                            'gst',
                            'casualTeam'
                        )
                    }
                />
            ) : (
                    <Input disabled className="input-inside-table-fees" value="N/A" />
                )
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: 96,
        render: () => (
            <Input
                disabled
                className="input-inside-table-fees"
                value="N/A"
            />
        ),
    },
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
    isPublished: false,
};

class RegistrationCompetitionFee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onYearLoad: false,
            value: 'NETSETGO',
            division: 'Division',
            discountCode: false,
            membershipProduct: ['Player', 'NetSetGo', 'Walking Netball', 'Fast Five'],
            membershipProductSelected: [],
            SeasonalFeeSelected: false,
            casualfeeSelected: false,
            walkingDivision: 'allDivisions',
            fastDivison: 'allDivisions',
            netSetGoDivision: 'allDivisions',
            playerDivision: 'allDivisions',
            netSetGO_SeasonalFee: false,
            walking_SeasonalFee: false,
            fast_SeasonalFee: false,
            netSetGO_casualfee: false,
            walking_casualfee: false,
            fast_casualfee: false,
            competitionTabKey: '1',
            profileImage: null,
            image: null,
            loading: false,
            getDataLoading: false,
            discountMembershipTypeData: [],
            statusRefId: 1,
            buttonPressed: 'next',
            logoIsDefault: false,
            logoSetDefault: false,
            logoUrl: '',
            isSetDefaul: false,
            competitionIsUsed: false,
            isCreatorEdit: false, //////// user is owner of the competition than isCreatorEdit will be false
            organisationTypeRefId: 0,
            isPublished: false,
            isRegClosed: false,
            tooltipVisibleDelete: false,
            tooltipVisibleDraft: false,
            tooltipVisiblePublish: false,
            roundsArray: [
                { id: 3, value: 3 },
                { id: 4, value: 4 },
                { id: 5, value: 5 },
                { id: 6, value: 6 },
                { id: 7, value: 7 },
                { id: 8, value: 8 },
                { id: 9, value: 9 },
                { id: 10, value: 10 },
                { id: 11, value: 11 },
                { id: 12, value: 12 },
                { id: 13, value: 13 },
                { id: 14, value: 14 },
                { id: 15, value: 15 },
                { id: 16, value: 16 },
                { id: 17, value: 17 },
                { id: 18, value: 18 },
            ],
            permissionState: permissionObject,
            divisionTable: [
                {
                    title: 'Division Name',
                    dataIndex: 'divisionName',
                    key: 'divisionName',
                    render: (divisionName, record, index) => {
                        return (
                            <Form.Item
                                name={`divisionName${record.parentIndex}${index}`}
                                rules={[{
                                    required: true,
                                    message: ValidationConstants.divisionName,
                                }]}
                            >
                                <Input
                                    className="input-inside-table-fees"
                                    required="required-field pt-0 pb-0"
                                    value={divisionName}
                                    onChange={(e) =>
                                        this.divisionTableDataOnchange(
                                            e.target.value,
                                            record,
                                            index,
                                            'divisionName'
                                        )
                                    }
                                    disabled={this.state.permissionState.divisionsDisable}
                                />
                            </Form.Item>
                        );
                    },
                },
                {
                    title: 'Gender Restriction',
                    dataIndex: 'genderRestriction',
                    key: 'genderRestriction',
                    filterDropdown: true,
                    filterIcon: () => {
                        return (
                            <CustomToolTip placement="bottom">
                                <span>{AppConstants.genderRestrictionMsg}</span>
                            </CustomToolTip>
                        );
                    },
                    render: (genderRestriction, record, index) => (
                        <Checkbox
                            className="single-checkbox mt-1"
                            disabled={this.state.permissionState.divisionsDisable}
                            checked={genderRestriction}
                            onChange={(e) =>
                                this.divisionTableDataOnchange(
                                    e.target.checked,
                                    record,
                                    index,
                                    'genderRestriction'
                                )
                            }
                        />
                    ),
                },
                {
                    dataIndex: 'genderRefId',
                    key: 'genderRefId',
                    // width:  ? "20%" : null,
                    render: (genderRefId, record, index) => {
                        const { getFieldDecorator } = this.formRef.current;
                        return (
                            record.genderRestriction && (
                                <Form.Item
                                    name={`genderRefId${record.parentIndex}${index}`}
                                    rules={[{
                                        required: true,
                                        message: ValidationConstants.genderRestriction,
                                    }]}
                                >
                                    <Select
                                        className="division-age-select"
                                        style={{ width: '100%', minWidth: 120 }}
                                        onChange={(genderRefId) =>
                                            this.divisionTableDataOnchange(
                                                genderRefId,
                                                record,
                                                index,
                                                'genderRefId'
                                            )
                                        }
                                        value={genderRefId}
                                        placeholder="Select"
                                        disabled={this.state.permissionState.divisionsDisable}
                                    >
                                        {this.props.commonReducerState.genderDataEnum.map((item) => (
                                            <Option key={'gender_' + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )
                        );
                    },
                },
                {
                    title: 'Age Restriction',
                    dataIndex: 'ageRestriction',
                    key: 'ageRestriction',
                    filterDropdown: true,
                    filterIcon: () => {
                        return (
                            <CustomToolTip placement="bottom">
                                <span>{AppConstants.ageRestrictionMsg}</span>
                            </CustomToolTip>
                        );
                    },
                    render: (ageRestriction, record, index) => (
                        <Checkbox
                            className="single-checkbox mt-1"
                            checked={ageRestriction}
                            onChange={(e) =>
                                this.divisionTableDataOnchange(
                                    e.target.checked,
                                    record,
                                    index,
                                    'ageRestriction'
                                )
                            }
                            disabled={this.state.permissionState.divisionsDisable}
                        />
                    ),
                },
                {
                    title: 'DOB From',
                    dataIndex: 'fromDate',
                    key: 'fromDate',
                    width: '25%',
                    render: (fromDate, record, index) => {
                        const { getFieldDecorator } = this.formRef.current;
                        return (
                            <Form.Item
                                name={`fromDate${record.parentIndex}${index}`}
                                rules={[{
                                    required: record.ageRestriction,
                                    message: ValidationConstants.pleaseSelectDOBFrom,
                                }]}
                            >
                                <DatePicker
                                    size="default"
                                    placeholder="dd-mm-yyyy"
                                    className="comp-venue-time-datepicker"
                                    style={{ width: '100%', minWidth: 135 }}
                                    onChange={(date) =>
                                        this.divisionTableDataOnchange(
                                            moment(date).format('YYYY-MM-DD'),
                                            record,
                                            index,
                                            'fromDate'
                                        )
                                    }
                                    format="DD-MM-YYYY"
                                    showTime={false}
                                    disabled={!record.ageRestriction || this.state.permissionState.divisionsDisable}
                                    value={fromDate !== null && moment(fromDate)}
                                    disabledDate={(d) => !d || d.isSameOrAfter(record.toDate)}
                                />
                            </Form.Item>
                        );
                    },
                },
                {
                    title: 'DOB To',
                    dataIndex: 'toDate',
                    width: '25%',
                    key: 'toDate',
                    render: (toDate, record, index) => {
                        const { getFieldDecorator } = this.formRef.current;
                        return (
                            <Form.Item
                                name={`toDate${record.parentIndex}${index}`}
                                rules={[{
                                    required: record.ageRestriction,
                                    message: ValidationConstants.PleaseSelectDOBTo,
                                }]}
                            >
                                <DatePicker
                                    size="default"
                                    placeholder="dd-mm-yyyy"
                                    className="comp-venue-time-datepicker"
                                    style={{ width: '100%', minWidth: 135 }}
                                    onChange={(date) =>
                                        this.divisionTableDataOnchange(
                                            moment(date).format('YYYY-MM-DD'),
                                            record,
                                            index,
                                            'toDate'
                                        )
                                    }
                                    format="DD-MM-YYYY"
                                    showTime={false}
                                    disabled={!record.ageRestriction || this.state.permissionState.divisionsDisable}
                                    value={toDate !== null && moment(toDate)}
                                    // disabledDate={d => !d || d.isSameOrBefore(record.fromDate)}
                                    disabledDate={(d) => moment(record.fromDate).isSameOrAfter(d, 'day')}
                                />
                            </Form.Item>
                        );
                    },
                },
                {
                    title: '',
                    dataIndex: 'clear',
                    key: 'clear',
                    render: (clear, record, index) => (
                        <span
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                cursor: 'pointer',
                            }}
                        >
                            <img
                                className="dot-image"
                                src={AppImages.redCross}
                                alt=""
                                width="16"
                                height="16"
                                onClick={() => !this.state.permissionState.divisionsDisable
                                    ? this.addRemoveDivision(index, record, 'remove')
                                    : null
                                }
                            />
                        </span>
                    ),
                },
            ],
            divisionState: false,
            affiliateOrgId: null,
            heroImage: null,
            yearRefId: null
        };

        this_Obj = this;
        let competitionId = null;
        competitionId = this.props.location.state ? this.props.location.state.id : null;
        competitionId !== null && this.props.clearCompReducerDataAction('all');


        this.formRef = createRef();
        // this.tableReference = React.createRef();
    }

    componentDidUpdate(nextProps) {
        let competitionFeesState = this.props.competitionFeesState;
        if (competitionFeesState.onLoad === false && this.state.loading === true) {
            this.setState({ loading: false });
            if (!competitionFeesState.error) {
                window.scrollTo(0, 0);
                let competitionTabKey = this.state.isCreatorEdit && this.state.competitionTabKey == "4"
                    ? "6"
                    : JSON.stringify(JSON.parse(this.state.competitionTabKey) + 1);
                this.setState({
                    // loading: false,
                    competitionTabKey,
                    logoSetDefault: false,
                    image: null,
                });
            }
            if (
                this.state.buttonPressed === 'save' ||
                this.state.buttonPressed === 'publish' ||
                this.state.buttonPressed === 'delete'
            ) {
                history.push('/registrationCompetitionList');
            }
            if (this.state.buttonPressed === "register") {
                this.navigateToRegistrationForm()
            }
        }

        if (nextProps.competitionFeesState !== competitionFeesState) {
            if (competitionFeesState.getCompAllDataOnLoad === false && this.state.getDataLoading) {
                let registrationInviteesRefId = 7;
                let inviteeArray = competitionFeesState.competitionDetailData.invitees;
                if (isArrayNotEmpty(inviteeArray)) {
                    let index = inviteeArray.findIndex(
                        (x) => x.registrationInviteesRefId == 7 || x.registrationInviteesRefId == 8
                    );
                    if (index > -1) {
                        registrationInviteesRefId = inviteeArray[index].registrationInviteesRefId;
                    }
                }
                this.callAnyorgSearchApi(registrationInviteesRefId);
                let isPublished = competitionFeesState.competitionDetailData.statusRefId == 2;

                let registrationCloseDate = competitionFeesState.competitionDetailData.registrationCloseDate &&
                    moment(competitionFeesState.competitionDetailData.registrationCloseDate);
                let isRegClosed = registrationCloseDate
                    ? !registrationCloseDate.isSameOrAfter(moment())
                    : false;

                let creatorId = competitionFeesState.competitionCreator;
                let orgData = getOrganisationData();
                let organisationUniqueKey = orgData ? orgData.organisationUniqueKey : 0;
                // let userId = getUserId();
                let isCreatorEdit = !(creatorId == organisationUniqueKey);

                this.setPermissionFields(isPublished, isRegClosed, isCreatorEdit);
                let competitionTabKey = isCreatorEdit ? "4" : this.state.competitionTabKey
                this.setState({
                    getDataLoading: false,
                    profileImage: competitionFeesState.competitionDetailData.competitionLogoUrl,
                    competitionIsUsed: competitionFeesState.competitionDetailData.isUsed,
                    isPublished,
                    isRegClosed,
                    isCreatorEdit,
                    competitionTabKey
                });
                this.setDetailsFieldValue();
            }
        }

        if (competitionFeesState.onLoad === false && this.state.divisionState === true) {
            setTimeout(() => {
                this.formRef.current && this.setDetailsFieldValue();
            }, 100);
            this.setState({ divisionState: false });
        }
        if (this.state.onYearLoad == true && this.props.appState.onLoad == false) {
            if (this.props.appState.yearList.length > 0) {
                let mainYearRefId = getCurrentYear(this.props.appState.yearList)
                this.props.add_editcompetitionFeeDeatils(mainYearRefId, "yearRefId")

                this.getMembershipDetails(mainYearRefId)

                this.setState({
                    onYearLoad: false,
                    yearRefId: mainYearRefId
                })
                this.formRef.current.setFieldsValue({
                    yearRefId: mainYearRefId
                });
                this.setDetailsFieldValue(mainYearRefId)
            }
        }
    }

    callAnyorgSearchApi = (registrationInviteesRefId) => {
        // if (registrationInviteesRefId == 7) {
        this.props.onInviteesSearchAction('', 3);
        // }
        // if (registrationInviteesRefId == 8) {
        this.props.onInviteesSearchAction('', 4);
        // }
    };

    /////navigate to RegistrationForm  after publishing the competition
    navigateToRegistrationForm = () => {
        let competitionFeesState = this.props.competitionFeesState
        let competitionDetailData = competitionFeesState.competitionDetailData;
        history.push('/registrationForm', {
            id: competitionDetailData.competitionUniqueKey,
            year: competitionDetailData.yearRefId,
            orgRegId: competitionFeesState.orgRegistrationId,
            compCloseDate: competitionDetailData.registrationCloseDate,
            compName: competitionDetailData.competitionName
        })
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
                    feesTableDisable: !isCreatorEdit ? false : true,
                    paymentsDisable: true,
                    discountsDisable: true,
                    allDisable: false,
                    isPublished: true,
                    compDatesDisable: !isCreatorEdit ? false : true
                };
                this.setState({ permissionState: permissionObject });
                return;
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
                    isPublished: true,
                    compDatesDisable: true
                };
                this.setState({ permissionState: permissionObject });
            } else {
                let permissionObject = {
                    compDetailDisable: false,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    divisionsDisable: true,
                    feesTableDisable: false,
                    paymentsDisable: false,
                    discountsDisable: false,
                    allDisable: false,
                    isPublished: true,
                    compDatesDisable: false
                };
                this.setState({ permissionState: permissionObject });
            }
        } else {
            let permissionObject = {
                compDetailDisable: false,
                regInviteesDisable: false,
                membershipDisable: false,
                divisionsDisable: false,
                feesTableDisable: false,
                paymentsDisable: false,
                discountsDisable: false,
                allDisable: false,
                isPublished: false,
                compDatesDisable: false
            };
            this.setState({ permissionState: permissionObject });
        }
    };

    componentDidMount() {
        let orgData = getOrganisationData();
        let competitionId = this.props.location.state ? this.props.location.state.id : null;
        let affiliateOrgId = this.props.location.state ? this.props.location.state.affiliateOrgId : null;
        this.setState({ organisationTypeRefId: orgData.organisationTypeRefId, affiliateOrgId });
        this.apiCalls(competitionId, orgData.organisationUniqueKey, affiliateOrgId);
        this.setDetailsFieldValue();
        let checkVenueScreen = this.props.location.state && this.props.location.state.venueScreen
            ? this.props.location.state.venueScreen
            : null;
        // setTimeout(() => {
        //     window.scrollTo(this.tableReference.offsetBottom,0);
        // },300)
    }

    ////all the api calls
    apiCalls = (competitionId, organisationId, affiliateOrgId) => {
        // this.props.getAffiliateToOrganisationAction(organisationId);
        this.props.getOnlyYearListAction(this.props.appState.yearList);
        this.setState({ onYearLoad: true })
        this.props.getDefaultCompFeesLogoAction();
        this.props.competitionDiscountTypesAction();
        this.props.competitionFeeInit();
        this.props.paymentFeeDeafault();
        this.props.paymentSeasonalFee();
        this.props.getCommonDiscountTypeTypeAction();
        this.props.getVenuesTypeAction("all");
        this.props.registrationRestrictionTypeAction();
        this.props.fixtureTemplateRoundsAction();
        this.props.paymentMethodsDefaultAction();

        // if (competitionId !== null) {
        //     let hasRegistration = 1;
        //     this.props.getAllCompetitionFeesDeatilsAction(
        //         competitionId,
        //         hasRegistration,
        //         "REG",
        //         affiliateOrgId,
        //         this.state.yearRefId
        //     );
        //     this.setState({ getDataLoading: true });
        // } else {
        //     let hasRegistration = 1;
        //     this.props.getDefaultCompFeesMembershipProductTabAction(hasRegistration);
        //     this.props.getDefaultCharity();
        // }

    };

    setYear = (e) => {
        this.setState({ yearRefId: e })
        this.getMembershipDetails(e)
    }

    getMembershipDetails = (yearRefId) => {
        let affiliateOrgId = this.props.location.state ? this.props.location.state.affiliateOrgId : null;
        let competitionId = this.props.location.state ? this.props.location.state.id : null;
        if (competitionId !== null) {
            let hasRegistration = 1;
            this.props.getAllCompetitionFeesDeatilsAction(
                competitionId,
                hasRegistration,
                "REG",
                affiliateOrgId,
                yearRefId
            );
            this.setState({ getDataLoading: true });
        } else {
            let hasRegistration = 1;
            this.props.getDefaultCompFeesMembershipProductTabAction(hasRegistration, yearRefId);
            this.props.getDefaultCharity();
        }
    }

    // for  save  payment
    paymentApiCall = (competitionId) => {
        let paymentDataArr = this.props.competitionFeesState.competitionPaymentsData;
        let selectedCasualPaymentArr = this.props.competitionFeesState.selectedCasualFee;
        let SelectedSeasonalPaymentArr = this.props.competitionFeesState.SelectedSeasonalFee;
        let selectedSeasonalTeamPaymentArr = this.props.competitionFeesState.selectedSeasonalTeamFee;
        let selectedCasualTeamPaymentArr = this.props.competitionFeesState.selectedCasualTeamFee;
        let selectedPaymentMethods = this.props.competitionFeesState.selectedPaymentMethods;

        let feeDetails = this.props.competitionFeesState.competitionFeesData;

        let isSeasonal = this.checkIsSeasonal(feeDetails);
        let isCasual = this.checkIsCasual(feeDetails);
        let isTeamSeasonal = this.checkIsTeamSeasonal(feeDetails);
        let isTeamCasual = this.checkIsTeamCasual(feeDetails);

        selectedCasualPaymentArr = selectedCasualPaymentArr.filter(x => x.isChecked && isCasual);
        SelectedSeasonalPaymentArr = SelectedSeasonalPaymentArr.filter(x => x.isChecked && isSeasonal);
        selectedSeasonalTeamPaymentArr = selectedSeasonalTeamPaymentArr.filter(x => x.isChecked && isTeamSeasonal);
        selectedCasualTeamPaymentArr = selectedCasualTeamPaymentArr.filter(x => x.isChecked && isTeamCasual);
        selectedPaymentMethods = selectedPaymentMethods.filter(x => x.isChecked);

        let selectedSeasonalInstalmentDates = this.props.competitionFeesState.selectedSeasonalInstalmentDates;
        let selectedTeamSeasonalInstalmentDates = this.props.competitionFeesState.selectedTeamSeasonalInstalmentDates;

        let paymentOptionData = selectedCasualPaymentArr.concat(
            SelectedSeasonalPaymentArr, selectedSeasonalTeamPaymentArr, selectedCasualTeamPaymentArr
        );
        paymentDataArr.paymentOptions = paymentOptionData;
        paymentDataArr.paymentMethods = selectedPaymentMethods;
        let charityTitle = this.props.competitionFeesState.charityTitle;
        let charityDescription = this.props.competitionFeesState.charityDescription;
        let postCharityRoundUpData = JSON.parse(
            JSON.stringify(paymentDataArr.charityRoundUp)
        );
        postCharityRoundUpData.map((item) => {
            item.charityRoundUpName = charityTitle;
            item.charityRoundUpDescription = charityDescription;
        });
        paymentDataArr.charityRoundUp = postCharityRoundUpData;
        paymentDataArr.instalmentDates = selectedSeasonalInstalmentDates.concat(selectedTeamSeasonalInstalmentDates);
        let isSeasonalUponReg = this.props.competitionFeesState.competitionDetailData["isSeasonalUponReg"];
        let isTeamSeasonalUponReg = this.props.competitionFeesState.competitionDetailData["isTeamSeasonalUponReg"];
        let teamSeasonalSchoolRegCode = this.props.competitionFeesState.competitionDetailData["teamSeasonalSchoolRegCode"];
        paymentDataArr["isSeasonalUponReg"] = isSeasonalUponReg != undefined ? isSeasonalUponReg : false;
        paymentDataArr["isTeamSeasonalUponReg"] = isTeamSeasonalUponReg != undefined ? isTeamSeasonalUponReg : false;
        paymentDataArr["teamSeasonalSchoolRegCode"] = teamSeasonalSchoolRegCode != undefined ? teamSeasonalSchoolRegCode : null;

        // selectedSeasonalFeeKey

        if (!selectedPaymentMethods.find(x => x.paymentMethodRefId == 1 || x.paymentMethodRefId == 2)) {
            message.error(ValidationConstants.pleaseSelectPaymentMethods);
            return;
        }

        if (SelectedSeasonalPaymentArr.find(x => x.paymentOptionRefId == 5)) {
            if (selectedSeasonalInstalmentDates.length === 0) {
                message.error(ValidationConstants.pleaseProvideInstalmentDate);
                return;
            } else if (selectedSeasonalInstalmentDates.length > 0) {
                let instalmentDate = selectedSeasonalInstalmentDates.find(x => x.instalmentDate == "")
                if (instalmentDate) {
                    message.error(ValidationConstants.pleaseProvideInstalmentDate);
                    return;
                }
            }
        }

        // selectedSeasonalTeamFeeKey

        if (selectedSeasonalTeamPaymentArr.find(x => x.paymentOptionRefId == 5)) {
            if (selectedTeamSeasonalInstalmentDates.length === 0) {
                message.error(ValidationConstants.pleaseProvideInstalmentDate);
                return;
            } else if (selectedTeamSeasonalInstalmentDates.length > 0) {
                let instalmentDate = selectedTeamSeasonalInstalmentDates.find(x => x.instalmentDate == "")
                if (instalmentDate) {
                    message.error(ValidationConstants.pleaseProvideInstalmentDate);
                    return;
                }
            }
        }
        if (selectedSeasonalTeamPaymentArr.find(x => x.paymentOptionRefId == 8)) {
            if (paymentDataArr.teamSeasonalSchoolRegCode.length === 0) {
                message.error(ValidationConstants.pleaseFillRegistration);
                this.setState({ loading: false });
                return;
            }
        }

        this.setState({ loading: true });
        this.props.competitionPaymentApi(paymentDataArr, competitionId, this.state.affiliateOrgId);
    };

    ////check the division objects does not contain empty division array
    checkDivisionEmpty(data) {
        if (isArrayNotEmpty(data)) {
            for (let i in data) {
                if (data[i].divisions.length === 0) {
                    return true;
                } else {
                    return false
                }
            }
        } else {
            return true;
        }
    }

    discountApiCall = (competitionId) => {
        // let govtVoucherData= this.props.competitionFeesState.competitionDiscountsData.govermentVouchers
        let govtVoucher = this.props.competitionFeesState.competitionDiscountsData.govermentVouchers;
        let discountDataArr = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;

        discountDataArr.map((item) => {
            if (item.childDiscounts) {
                if (item.childDiscounts.length === 0) {
                    item.childDiscounts = null;
                }
                if (item.competitionTypeDiscountTypeRefId !== 3) {
                    item.childDiscounts = null;
                }
            }
            item.applyDiscount = parseInt(item.applyDiscount);
            if (item.amount !== null) {
                if (item.amount.length > 0) {
                    item.amount = parseInt(item.amount);
                    // } else {
                    //   item['amount'] = null;
                }
            } else {
                item['amount'] = null;
            }
            return item;
        });
        let finalOrgPostDiscountData = JSON.parse(JSON.stringify(discountDataArr));
        let orgData = getOrganisationData();
        let currentOrganisationId = orgData ? orgData.organisationId : 0;
        let filterOrgPostDiscountData = finalOrgPostDiscountData.filter(
            (x) => x.organisationId == currentOrganisationId
        );

        let discountBody = {
            competitionId,
            statusRefId: this.state.statusRefId,
            competitionDiscounts: [
                {
                    discounts: filterOrgPostDiscountData,
                },
            ],
            govermentVouchers: govtVoucher,
        };
        let compFeesState = this.props.competitionFeesState;
        let fee_data = compFeesState.competitionFeesData;
        let divisionArrayData = compFeesState.competitionDivisionsData;

        let discountDuplicateError = false;
        let errMsg = null;
        let discountMap = new Map();
        for (let x of filterOrgPostDiscountData) {
            let key = null;
            if (x.competitionTypeDiscountTypeRefId == 2) {
                key = x.competitionMembershipProductTypeId + "#" + x.competitionTypeDiscountTypeRefId + "#" + x.discountCode;
            } else if (x.competitionTypeDiscountTypeRefId == 3) {
                key = x.competitionMembershipProductTypeId + "#" + x.competitionTypeDiscountTypeRefId;
            }

            // if (x.competitionTypeDiscountTypeRefId == 3) {
            if (discountMap.get(key) == undefined) {
                discountMap.set(key, 1);
            } else {
                if (x.competitionTypeDiscountTypeRefId == 3) {
                    errMsg = ValidationConstants.duplicateFamilyDiscountError;
                } else {
                    errMsg = ValidationConstants.duplicateDiscountError;
                }
                discountDuplicateError = true;
                break;
            }
            // }
        }

        if (discountDuplicateError) {
            message.config({ duration: 0.9, maxCount: 1 })
            message.error(errMsg);
        } else {
            if (this.state.statusRefId == 1) {
                this.props.regSaveCompetitionFeeDiscountAction(discountBody, competitionId, this.state.affiliateOrgId);
                this.setState({ loading: true });
            }
            if (this.state.statusRefId == 2 || this.state.statusRefId == 3) {
                if (divisionArrayData.length > 0 && this.checkDivisionEmpty(divisionArrayData) == false && fee_data.length > 0) {
                    this.props.regSaveCompetitionFeeDiscountAction(discountBody, competitionId, this.state.affiliateOrgId);
                    this.setState({ loading: true });
                } else {
                    if (this.checkDivisionEmpty(divisionArrayData)) {
                        message.config({ duration: 0.9, maxCount: 1 })
                        message.error(ValidationConstants.pleaseFillDivisionBeforePublishing);
                    } else if (fee_data.length === 0) {
                        message.error(ValidationConstants.pleaseFillFeesBeforePublishing);
                    }
                }
            }
        }
    };

    setDetailsFieldValue(yearRefId) {
        let compFeesState = this.props.competitionFeesState;
        this.formRef.current.setFieldsValue({
            competition_name: compFeesState.competitionDetailData.competitionName,
            numberOfRounds: compFeesState.competitionDetailData.noOfRounds,
            // yearRefId: compFeesState.competitionDetailData.yearRefId,
            yearRefId: this.state.yearRefId ? this.state.yearRefId : yearRefId,
            competitionTypeRefId: compFeesState.competitionDetailData.competitionTypeRefId,
            competitionFormatRefId: compFeesState.competitionDetailData.competitionFormatRefId,
            registrationCloseDate: compFeesState.competitionDetailData.registrationCloseDate && moment(compFeesState.competitionDetailData.registrationCloseDate),
            selectedVenues: compFeesState.selectedVenues,
            startDate: compFeesState.competitionDetailData.startDate && moment(compFeesState.competitionDetailData.startDate),
            endDate: compFeesState.competitionDetailData.endDate && moment(compFeesState.competitionDetailData.endDate),
            charityTitle: compFeesState.charityTitle,
            charityDescription: compFeesState.charityDescription,
        });
        let data = this.props.competitionFeesState.competionDiscountValue;
        let discountData = data && data.competitionDiscounts !== null
            ? data.competitionDiscounts[0].discounts
            : [];

        if (discountData.length > 0) {
            discountData.forEach((item, index) => {
                let competitionMembershipProductTypeId = `competitionMembershipProductTypeId${index}`;
                let membershipProductUniqueKey = `membershipProductUniqueKey${index}`;
                let competitionTypeDiscountTypeRefId = `competitionTypeDiscountTypeRefId${index}`;
                this.formRef.current.setFieldsValue({
                    [competitionMembershipProductTypeId]: item.competitionMembershipProductTypeId,
                    [membershipProductUniqueKey]: item.membershipProductUniqueKey,
                    [competitionTypeDiscountTypeRefId]: item.competitionTypeDiscountTypeRefId,
                });
                let childDiscounts = item.childDiscounts !== null && item.childDiscounts.length > 0
                    ? item.childDiscounts
                    : [];
                childDiscounts.forEach((childItem, childindex) => {
                    let childDiscountPercentageValue = `percentageValue${index}${childindex}`;
                    this.formRef.current.setFieldsValue({
                        [childDiscountPercentageValue]: childItem.percentageValue,
                    });
                });
            });
        }
        let divisionData = this.props.competitionFeesState.competitionDivisionsData;
        let divisionArray = divisionData !== null ? divisionData : [];
        if (divisionArray.length > 0) {
            divisionArray.forEach((item, index) => {
                item.divisions.forEach((divItem, divIndex) => {
                    let divisionName = `divisionName${index}${divIndex}`;
                    let genderRefId = `genderRefId${index}${divIndex}`;
                    let fromDate = `fromDate${index}${divIndex}`;
                    let toDate = `toDate${index}${divIndex}`;
                    this.formRef.current.setFieldsValue({
                        [divisionName]: divItem.divisionName,
                        [genderRefId]: divItem.genderRefId ? divItem.genderRefId : [],
                        [fromDate]: divItem.fromDate && moment(divItem.fromDate),
                        [toDate]: divItem.toDate && moment(divItem.toDate),
                    });
                });
            });
        }
    }

    saveCompFeesApiCall = (values) => {
        let compFeesState = this.props.competitionFeesState;
        let competitionId = compFeesState.competitionId;
        let finalPostData = [];
        let fee_data = compFeesState.competitionFeesData;
        let feeSeasonalData = [];
        let feeCasualData = [];
        let feeSeasonalTeamData = [];
        let feeCasualTeamData = [];
        let finalpostarray = [];

        for (let i in fee_data) {
            if (fee_data[i].isSeasonal && fee_data[i].isCasual) {
                if (fee_data[i].isAllType === 'allDivisions') {
                    feeSeasonalData = fee_data[i].seasonal.allType;
                    feeCasualData = fee_data[i].casual.allType;

                    for (let j in feeSeasonalData) {
                        for (let k in feeCasualData) {
                            if (
                                feeSeasonalData[j].competitionMembershipProductTypeId ==
                                feeCasualData[k].competitionMembershipProductTypeId
                            ) {
                                feeSeasonalData[j]['casualFees'] = feeCasualData[k].fee;
                                feeSeasonalData[j]['casualGST'] = feeCasualData[k].gst;
                                feeSeasonalData[j]['seasonalFees'] = feeSeasonalData[j].fee;
                                feeSeasonalData[j]['seasonalGST'] = feeSeasonalData[j].gst;
                                feeSeasonalData[j]['affiliateCasualFees'] = feeCasualData[k].affiliateFee;
                                feeSeasonalData[j]['affiliateCasualGST'] = feeCasualData[k].affiliateGst;
                                feeSeasonalData[j]['affiliateSeasonalFees'] = feeSeasonalData[j].affiliateFee;
                                feeSeasonalData[j]['affiliateSeasonalGST'] = feeSeasonalData[j].affiliateGst;
                                feeSeasonalData[j]['nominationSeasonalFee'] = feeSeasonalData[j].nominationFees;
                                feeSeasonalData[j]['nominationSeasonalGST'] = feeSeasonalData[j].nominationGST;
                                feeSeasonalData[j]['affNominationSeasonalFee'] = feeSeasonalData[j].affNominationFees;
                                feeSeasonalData[j]['affNominationSeasonalGST'] = feeSeasonalData[j].affNominationGST;

                                break;
                            }
                        }
                    }
                    if (fee_data[i].isTeamSeasonal) {
                        feeSeasonalTeamData = fee_data[i].seasonalTeam.allType;
                        for (let j in feeSeasonalData) {
                            for (let k in feeSeasonalTeamData) {
                                if (
                                    feeSeasonalData[j].competitionMembershipProductTypeId ==
                                    feeSeasonalTeamData[k].competitionMembershipProductTypeId
                                ) {
                                    feeSeasonalData[j]['teamSeasonalFees'] = feeSeasonalTeamData[k].fee;
                                    feeSeasonalData[j]['teamSeasonalGST'] = feeSeasonalTeamData[k].gst;
                                    feeSeasonalData[j]['affiliateTeamSeasonalFees'] = feeSeasonalTeamData[k].affiliateFee;
                                    feeSeasonalData[j]['affiliateTeamSeasonalGST'] = feeSeasonalTeamData[k].affiliateGst;
                                    if (fee_data[i].teamRegChargeTypeRefId != 3) {
                                        feeSeasonalData[j]['nominationTeamSeasonalFee'] = feeSeasonalTeamData[k].nominationFees;
                                        feeSeasonalData[j]['nominationTeamSeasonalGST'] = feeSeasonalTeamData[k].nominationGST;
                                        feeSeasonalData[j]['affNominationTeamSeasonalFee'] = feeSeasonalTeamData[k].affNominationFees;
                                        feeSeasonalData[j]['affNominationTeamSeasonalGST'] = feeSeasonalTeamData[k].affNominationGST;
                                    }

                                    break;
                                }
                            }
                        }
                    }

                    /* if (fee_data[i].isTeamCasual) {
                         feeCasualTeamData = fee_data[i].casualTeam.allType;
                         for (let j in feeSeasonalData) {
                             for (let k in feeCasualTeamData) {
                                 if (
                                     feeSeasonalData[j].competitionMembershipProductTypeId ==
                                     feeCasualTeamData[k].competitionMembershipProductTypeId
                                 ) {
                                     feeSeasonalData[j]['teamCasualFees'] = feeCasualTeamData[k].fee;
                                     feeSeasonalData[j]['teamCasualGST'] = feeCasualTeamData[k].gst;
                                     feeSeasonalData[j]['affiliateTeamCasualFees'] = feeCasualTeamData[k].affiliateFee;
                                     feeSeasonalData[j]['affiliateTeamCasualGST'] = feeCasualTeamData[k].affiliateGst;
                                     break;
                                 }
                             }
                         }
                     } */

                    finalPostData = [...feeSeasonalData];
                } else {
                    feeSeasonalData = fee_data[i].seasonal.perType;
                    feeCasualData = fee_data[i].casual.perType;

                    for (let j in feeSeasonalData) {
                        for (let k in feeCasualData) {
                            if (
                                feeSeasonalData[j].competitionMembershipProductTypeId ==
                                feeCasualData[k].competitionMembershipProductTypeId
                            ) {
                                feeSeasonalData[j]['casualFees'] = feeCasualData[j].fee;
                                feeSeasonalData[j]['casualGST'] = feeCasualData[j].gst;
                                feeSeasonalData[j]['seasonalFees'] = feeSeasonalData[j].fee;
                                feeSeasonalData[j]['seasonalGST'] = feeSeasonalData[j].gst;
                                feeSeasonalData[j]['affiliateCasualFees'] = feeCasualData[j].affiliateFee;
                                feeSeasonalData[j]['affiliateCasualGST'] = feeCasualData[j].affiliateGst;
                                feeSeasonalData[j]['affiliateSeasonalFees'] = feeSeasonalData[j].affiliateFee;
                                feeSeasonalData[j]['affiliateSeasonalGST'] = feeSeasonalData[j].affiliateGst;
                                feeSeasonalData[j]['nominationSeasonalFee'] = feeSeasonalData[j].nominationFees;
                                feeSeasonalData[j]['nominationSeasonalGST'] = feeSeasonalData[j].nominationGST;
                                feeSeasonalData[j]['affNominationSeasonalFee'] = feeSeasonalData[j].affNominationFees;
                                feeSeasonalData[j]['affNominationSeasonalGST'] = feeSeasonalData[j].affNominationGST;

                                break;
                            }
                        }
                    }
                    if (fee_data[i].isTeamSeasonal) {
                        feeSeasonalTeamData = fee_data[i].seasonalTeam.perType;
                        for (let j in feeSeasonalData) {
                            for (let k in feeSeasonalTeamData) {
                                if (
                                    feeSeasonalData[j].competitionMembershipProductTypeId ==
                                    feeSeasonalTeamData[k].competitionMembershipProductTypeId
                                ) {
                                    feeSeasonalData[j]['teamSeasonalFees'] = feeSeasonalTeamData[j]?.fee;
                                    feeSeasonalData[j]['teamSeasonalGST'] = feeSeasonalTeamData[j]?.gst;
                                    feeSeasonalData[j]['affiliateTeamSeasonalFees'] = feeSeasonalTeamData[j]?.affiliateFee;
                                    feeSeasonalData[j]['affiliateTeamSeasonalGST'] = feeSeasonalTeamData[j]?.affiliateGst;
                                    if (fee_data[i].teamRegChargeTypeRefId != 3) {
                                        feeSeasonalData[j]['nominationTeamSeasonalFee'] = feeSeasonalTeamData[j]?.nominationFees;
                                        feeSeasonalData[j]['nominationTeamSeasonalGST'] = feeSeasonalTeamData[j]?.nominationGST;
                                        feeSeasonalData[j]['affNominationTeamSeasonalFee'] = feeSeasonalTeamData[j]?.affNominationFees;
                                        feeSeasonalData[j]['affNominationTeamSeasonalGST'] = feeSeasonalTeamData[j]?.affNominationGST;
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    /* if (fee_data[i].isTeamCasual) {
                         feeCasualTeamData = fee_data[i].casualTeam.perType;
                         for (let j in feeSeasonalData) {
                             for (let k in feeCasualTeamData) {
                                 if (
                                     feeSeasonalData[j].competitionMembershipProductTypeId ==
                                     feeCasualTeamData[k].competitionMembershipProductTypeId
                                 ) {
                                     feeSeasonalData[j]['teamCasualFees'] = feeCasualTeamData[j]?.fee;
                                     feeSeasonalData[j]['teamCasualGST'] = feeCasualTeamData[j]?.gst;
                                     feeSeasonalData[j]['affiliateTeamCasualFees'] = feeCasualTeamData[j]?.affiliateFee;
                                     feeSeasonalData[j]['affiliateTeamCasualGST'] = feeCasualTeamData[j]?.affiliateGst;

                                     break;
                                 }
                             }
                         }
                     } */

                    finalPostData = [...feeSeasonalData];
                }
            } else if (fee_data[i].isSeasonal == true && fee_data[i].isCasual == false) {
                if (fee_data[i].isAllType === 'allDivisions') {
                    feeSeasonalData = fee_data[i].seasonal.allType;

                    if (fee_data[i].isTeamSeasonal == true) {
                        feeSeasonalTeamData = fee_data[i].seasonalTeam.allType;
                        for (let j in feeSeasonalData) {
                            for (let k in feeSeasonalTeamData) {
                                if (
                                    feeSeasonalData[j].competitionMembershipProductTypeId ==
                                    feeSeasonalTeamData[k].competitionMembershipProductTypeId
                                ) {
                                    feeSeasonalData[j]['seasonalFees'] = feeSeasonalData[j].fee;
                                    feeSeasonalData[j]['seasonalGST'] = feeSeasonalData[j].gst;
                                    feeSeasonalData[j]['affiliateSeasonalFees'] = feeSeasonalData[j].affiliateFee;
                                    feeSeasonalData[j]['affiliateSeasonalGST'] = feeSeasonalData[j].affiliateGst;
                                    feeSeasonalData[j]['teamSeasonalFees'] = feeSeasonalTeamData[k].fee;
                                    feeSeasonalData[j]['teamSeasonalGST'] = feeSeasonalTeamData[k].gst;
                                    feeSeasonalData[j]['affiliateTeamSeasonalFees'] = feeSeasonalTeamData[k].affiliateFee;
                                    feeSeasonalData[j]['affiliateTeamSeasonalGST'] = feeSeasonalTeamData[k].affiliateGst;
                                    feeSeasonalData[j]['nominationSeasonalFee'] = feeSeasonalData[j].nominationFees;
                                    feeSeasonalData[j]['nominationSeasonalGST'] = feeSeasonalData[j].nominationGST;
                                    feeSeasonalData[j]['affNominationSeasonalFee'] = feeSeasonalData[j].affNominationFees;
                                    feeSeasonalData[j]['affNominationSeasonalGST'] = feeSeasonalData[j].affNominationGST;
                                    if (fee_data[i].teamRegChargeTypeRefId != 3) {
                                        feeSeasonalData[j]['nominationTeamSeasonalFee'] = feeSeasonalTeamData[k].nominationFees;
                                        feeSeasonalData[j]['nominationTeamSeasonalGST'] = feeSeasonalTeamData[k].nominationGST;
                                        feeSeasonalData[j]['affNominationTeamSeasonalFee'] = feeSeasonalTeamData[k].affNominationFees;
                                        feeSeasonalData[j]['affNominationTeamSeasonalGST'] = feeSeasonalTeamData[k].affNominationGST;
                                    }

                                    break;
                                }
                            }
                        }
                    }

                    /*if (fee_data[i].isTeamCasual == true) {
                        feeCasualTeamData = fee_data[i].casualTeam.allType;
                        for (let j in feeSeasonalData) {
                            for (let k in feeCasualTeamData) {
                                if (
                                    feeSeasonalData[j].competitionMembershipProductTypeId ==
                                    feeCasualTeamData[k].competitionMembershipProductTypeId
                                ) {
                                    feeSeasonalData[j]['teamCasualFees'] = feeCasualTeamData[k].fee;
                                    feeSeasonalData[j]['teamCasualGST'] = feeCasualTeamData[k].gst;
                                    feeSeasonalData[j]['affiliateTeamCasualFees'] = feeCasualTeamData[k].affiliateFee;
                                    feeSeasonalData[j]['affiliateTeamCasualGST'] = feeCasualTeamData[k].affiliateGst;

                                    break;
                                }
                            }
                        }
                    } */

                    if (fee_data[i].isTeamSeasonal == false) {
                        finalPostData = [...feeSeasonalData];
                        finalPostData.map((item) => {
                            item['seasonalFees'] = item.fee;
                            item['seasonalGST'] = item.gst;
                            item['affiliateSeasonalFees'] = item.affiliateFee;
                            item['affiliateSeasonalGST'] = item.affiliateGst;
                            item['nominationSeasonalFee'] = item.nominationFees;
                            item['nominationSeasonalGST'] = item.nominationGST;
                            item['affNominationSeasonalFee'] = item.affNominationFees;
                            item['affNominationSeasonalGST'] = item.affNominationGST;
                        });
                    } else {
                        finalPostData = [...feeSeasonalData];
                    }
                } else {
                    feeSeasonalData = fee_data[i].seasonal.perType;

                    if (fee_data[i].isTeamSeasonal) {
                        feeSeasonalTeamData = fee_data[i].seasonalTeam.perType;
                        for (let j in feeSeasonalData) {
                            for (let k in feeSeasonalTeamData) {
                                if (
                                    feeSeasonalData[j].competitionMembershipProductTypeId ==
                                    feeSeasonalTeamData[k].competitionMembershipProductTypeId
                                ) {
                                    feeSeasonalData[j]['seasonalFees'] = feeSeasonalData[j].fee;
                                    feeSeasonalData[j]['seasonalGST'] = feeSeasonalData[j].gst;
                                    feeSeasonalData[j]['affiliateSeasonalFees'] = feeSeasonalData[j].affiliateFee;
                                    feeSeasonalData[j]['affiliateSeasonalGST'] = feeSeasonalData[j].affiliateGst;
                                    feeSeasonalData[j]['teamSeasonalFees'] = feeSeasonalTeamData[j].fee;
                                    feeSeasonalData[j]['teamSeasonalGST'] = feeSeasonalTeamData[j].gst;
                                    feeSeasonalData[j]['affiliateTeamSeasonalFees'] = feeSeasonalTeamData[j].affiliateFee;
                                    feeSeasonalData[j]['affiliateTeamSeasonalGST'] = feeSeasonalTeamData[j].affiliateGst;
                                    feeSeasonalData[j]['nominationSeasonalFee'] = feeSeasonalData[j].nominationFees;
                                    feeSeasonalData[j]['nominationSeasonalGST'] = feeSeasonalData[j].nominationGST;
                                    feeSeasonalData[j]['affNominationSeasonalFee'] = feeSeasonalData[j].affNominationFees;
                                    feeSeasonalData[j]['affNominationSeasonalGST'] = feeSeasonalData[j].affNominationGST;
                                    if (fee_data[i].teamRegChargeTypeRefId != 3) {
                                        feeSeasonalData[j]['nominationTeamSeasonalFee'] = feeSeasonalTeamData[j].nominationFees;
                                        feeSeasonalData[j]['nominationTeamSeasonalGST'] = feeSeasonalTeamData[j].nominationGST;
                                        feeSeasonalData[j]['affNominationTeamSeasonalFee'] = feeSeasonalTeamData[j].affNominationFees;
                                        feeSeasonalData[j]['affNominationTeamSeasonalGST'] = feeSeasonalTeamData[j].affNominationGST;
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    /*if (fee_data[i].isTeamCasual) {
                        feeCasualTeamData = fee_data[i].casualTeam.perType;
                        for (let j in feeSeasonalData) {
                            for (let k in feeCasualTeamData) {
                                if (
                                    feeSeasonalData[j].competitionMembershipProductTypeId ==
                                    feeCasualTeamData[k].competitionMembershipProductTypeId
                                ) {
                                    feeSeasonalData[j]['teamCasualFees'] = feeCasualTeamData[j].fee;
                                    feeSeasonalData[j]['teamCasualGST'] = feeCasualTeamData[j].gst;
                                    feeSeasonalData[j]['affiliateTeamCasualFees'] = feeCasualTeamData[j].affiliateFee;
                                    feeSeasonalData[j]['affiliateTeamCasualGST'] = feeCasualTeamData[j].affiliateGst;

                                    break;
                                }
                            }
                        }
                    } */

                    if (fee_data[i].isTeamSeasonal == false) {
                        finalPostData = [...feeSeasonalData];
                        finalPostData.map((item) => {
                            item['seasonalFees'] = item.fee;
                            item['seasonalGST'] = item.gst;
                            item['affiliateSeasonalFees'] = item.affiliateFee;
                            item['affiliateSeasonalGST'] = item.affiliateGst;
                            item['nominationSeasonalFee'] = item.nominationFees;
                            item['nominationSeasonalGST'] = item.nominationGST;
                            item['affNominationSeasonalFee'] = item.affNominationFees;
                            item['affNominationSeasonalGST'] = item.affNominationGST;
                        });
                    } else {
                        finalPostData = [...feeSeasonalData];
                    }
                }
            } else if (fee_data[i].isSeasonal == false && fee_data[i].isCasual) {
                if (fee_data[i].isAllType === 'allDivisions') {
                    feeCasualData = fee_data[i].casual.allType;

                    if (fee_data[i].isTeamSeasonal) {
                        feeSeasonalTeamData = fee_data[i].seasonalTeam.allType;
                        for (let j in feeCasualData) {
                            for (let k in feeSeasonalTeamData) {
                                if (
                                    feeCasualData[j].competitionMembershipProductTypeId ==
                                    feeSeasonalTeamData[k].competitionMembershipProductTypeId
                                ) {
                                    feeCasualData[j]['casualFees'] = feeCasualData[j].fee;
                                    feeCasualData[j]['casualGST'] = feeCasualData[j].gst;
                                    feeCasualData[j]['affiliateCasualFees'] = feeCasualData[j].affiliateFee;
                                    feeCasualData[j]['affiliateCasualGST'] = feeCasualData[j].affiliateGst;
                                    feeCasualData[j]['teamSeasonalFees'] = feeSeasonalTeamData[k].fee;
                                    feeCasualData[j]['teamSeasonalGST'] = feeSeasonalTeamData[k].gst;
                                    feeCasualData[j]['affiliateTeamSeasonalFees'] = feeSeasonalTeamData[k].affiliateFee;
                                    feeCasualData[j]['affiliateTeamSeasonalGST'] = feeSeasonalTeamData[k].affiliateGst;
                                    if (fee_data[i].teamRegChargeTypeRefId != 3) {
                                        feeCasualData[j]['nominationTeamSeasonalFee'] = feeSeasonalTeamData[k].nominationFees;
                                        feeCasualData[j]['nominationTeamSeasonalGST'] = feeSeasonalTeamData[k].nominationGST;
                                        feeCasualData[j]['affNominationTeamSeasonalFee'] = feeSeasonalTeamData[k].affNominationFees;
                                        feeCasualData[j]['affNominationTeamSeasonalGST'] = feeSeasonalTeamData[k].affNominationGST;
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    /* if (fee_data[i].isTeamCasual) {
                         feeCasualTeamData = fee_data[i].casualTeam.allType;
                         for (let j in feeCasualData) {
                             for (let k in feeCasualTeamData) {
                                 if (
                                     feeCasualData[j].competitionMembershipProductTypeId ==
                                     feeCasualTeamData[k].competitionMembershipProductTypeId
                                 ) {
                                     feeCasualData[j]['teamCasualFees'] = feeCasualTeamData[k].fee;
                                     feeCasualData[j]['teamCasualGST'] = feeCasualTeamData[k].gst;
                                     feeCasualData[j]['affiliateTeamCasualFees'] = feeCasualTeamData[k].affiliateFee;
                                     feeCasualData[j]['affiliateTeamCasualGST'] = feeCasualTeamData[k].affiliateGst;
                                     break;
                                 }
                             }
                         }
                     }
                     */
                    if (fee_data[i].isTeamSeasonal == false) {
                        finalPostData = [...feeCasualData];
                        finalPostData.map((item) => {
                            item['casualFees'] = item.fee;
                            item['casualGST'] = item.gst;
                            item['affiliateCasualFees'] = item.affiliateFee;
                            item['affiliateCasualGST'] = item.affiliateGst;
                        });
                    } else {
                        finalPostData = [...feeCasualData];
                    }
                } else {
                    feeCasualData = fee_data[i].casual.perType;

                    if (fee_data[i].isTeamSeasonal) {
                        feeSeasonalTeamData = fee_data[i].seasonalTeam.perType;
                        for (let j in feeCasualData) {
                            for (let k in feeSeasonalTeamData) {
                                if (
                                    feeCasualData[j].competitionMembershipProductTypeId ==
                                    feeSeasonalTeamData[k].competitionMembershipProductTypeId
                                ) {
                                    feeCasualData[j]['casualFees'] = feeCasualData[j].fee;
                                    feeCasualData[j]['casualGST'] = feeCasualData[j].gst;
                                    feeCasualData[j]['affiliateCasualFees'] = feeCasualData[j].affiliateFee;
                                    feeCasualData[j]['affiliateCasualGST'] = feeCasualData[j].affiliateGst;
                                    feeCasualData[j]['teamSeasonalFees'] = feeSeasonalTeamData[j].fee;
                                    feeCasualData[j]['teamSeasonalGST'] = feeSeasonalTeamData[j].gst;
                                    feeCasualData[j]['affiliateTeamSeasonalFees'] = feeSeasonalTeamData[j].affiliateFee;
                                    feeCasualData[j]['affiliateTeamSeasonalGST'] = feeSeasonalTeamData[j].affiliateGst;
                                    if (fee_data[i].teamRegChargeTypeRefId != 3) {
                                        feeCasualData[j]['nominationTeamSeasonalFee'] = feeSeasonalTeamData[j].nominationFees;
                                        feeCasualData[j]['nominationTeamSeasonalGST'] = feeSeasonalTeamData[j].nominationGST;
                                        feeCasualData[j]['affNominationTeamSeasonalFee'] = feeSeasonalTeamData[j].affNominationFees;
                                        feeCasualData[j]['affNominationTeamSeasonalGST'] = feeSeasonalTeamData[j].affNominationGST;
                                    }
                                    break;
                                }
                            }
                        }
                    }

                    if (fee_data[i].isTeamCasual) {
                        feeCasualTeamData = fee_data[i].casualTeam.perType;
                        for (let j in feeCasualData) {
                            for (let k in feeCasualTeamData) {
                                if (
                                    feeCasualData[j].competitionMembershipProductTypeId ==
                                    feeCasualTeamData[k].competitionMembershipProductTypeId
                                ) {
                                    feeCasualData[j]['teamCasualFees'] = feeCasualTeamData[j].fee;
                                    feeCasualData[j]['teamCasualGST'] = feeCasualTeamData[j].gst;
                                    feeCasualData[j]['affiliateTeamCasualFees'] = feeCasualTeamData[j].affiliateFee;
                                    feeCasualData[j]['affiliateTeamCasualGST'] = feeCasualTeamData[j].affiliateGst;

                                    break;
                                }
                            }
                        }
                    }

                    if (fee_data[i].isTeamSeasonal == false) {
                        finalPostData = [...feeCasualData];
                        finalPostData.map((item) => {
                            item['casualFees'] = item.fee;
                            item['casualGST'] = item.gst;
                            item['affiliateCasualFees'] = item.affiliateFee;
                            item['affiliateCasualGST'] = item.affiliateGst;
                        });
                    } else {
                        finalPostData = [...feeCasualData];
                    }
                }
            } else if (
                fee_data[i].isSeasonal == false &&
                fee_data[i].isCasual == false &&
                (fee_data[i].isTeamSeasonal && fee_data[i].isTeamCasual == false)
            ) {
                if (fee_data[i].isAllType === 'allDivisions') {
                    feeSeasonalTeamData = fee_data[i].seasonalTeam.allType;
                } else {
                    feeSeasonalTeamData = fee_data[i].seasonalTeam.perType;
                }
                finalPostData = [...feeSeasonalTeamData];
                finalPostData.map((item) => {
                    item['teamSeasonalFees'] = item.fee;
                    item['teamSeasonalGST'] = item.gst;
                    item['affiliateTeamSeasonalFees'] = item.affiliateFee;
                    item['affiliateTeamSeasonalGST'] = item.affiliateGst;
                    if (fee_data[i].teamRegChargeTypeRefId != 3) {
                        item['nominationTeamSeasonalFee'] = item.nominationFees;
                        item['nominationTeamSeasonalGST'] = item.nominationGST;
                        item['affNominationTeamSeasonalFee'] = item.affNominationFees;
                        item['affNominationTeamSeasonalGST'] = item.affNominationGST;
                    }
                });
            } else if (
                fee_data[i].isSeasonal == false &&
                fee_data[i].isCasual == false &&
                (fee_data[i].isTeamSeasonal == false && fee_data[i].isTeamCasual)
            ) {
                if (fee_data[i].isAllType === 'allDivisions') {
                    feeCasualTeamData = fee_data[i].casualTeam.allType;
                } else {
                    feeCasualTeamData = fee_data[i].casualTeam.perType;
                }
                finalPostData = [...feeCasualTeamData];
                finalPostData.map((item) => {
                    item['teamCasualFees'] = item.fee;
                    item['teamCasualGST'] = item.gst;
                    item['affiliateTeamCasualFees'] = item.affiliateFee;
                    item['affiliateTeamCasualGST'] = item.affiliateGst;
                });
            } else if (
                fee_data[i].isSeasonal == false &&
                fee_data[i].isCasual == false &&
                (fee_data[i].isTeamSeasonal && fee_data[i].isTeamCasual)
            ) {
                if (fee_data[i].isAllType === 'allDivisions') {
                    feeCasualTeamData = fee_data[i].casualTeam.allType;
                    feeSeasonalTeamData = fee_data[i].seasonalTeam.allType;

                    for (let j in feeSeasonalTeamData) {
                        for (let k in feeCasualTeamData) {
                            if (
                                feeSeasonalTeamData[j].competitionMembershipProductTypeId ==
                                feeCasualTeamData[k].competitionMembershipProductTypeId
                            ) {
                                feeSeasonalTeamData[j]['teamCasualFees'] = feeCasualTeamData[k].fee;
                                feeSeasonalTeamData[j]['teamCasualGST'] = feeCasualTeamData[k].gst;
                                feeSeasonalTeamData[j]['affiliateTeamCasualFees'] = feeCasualTeamData[k].affiliateFee;
                                feeSeasonalTeamData[j]['affiliateTeamCasualGST'] = feeCasualTeamData[k].affiliateGst;
                                feeSeasonalTeamData[j]['teamSeasonalFees'] = feeSeasonalTeamData[j].fee;
                                feeSeasonalTeamData[j]['teamSeasonalGST'] = feeSeasonalTeamData[j].gst;
                                feeSeasonalTeamData[j]['affiliateTeamSeasonalFees'] = feeSeasonalTeamData[j].affiliateFee;
                                feeSeasonalTeamData[j]['affiliateTeamSeasonalGST'] = feeSeasonalTeamData[j].affiliateGst;
                                if (fee_data[i].teamRegChargeTypeRefId != 3) {
                                    feeSeasonalTeamData[j]['nominationTeamSeasonalFee'] = feeSeasonalTeamData[j].nominationFees;
                                    feeSeasonalTeamData[j]['nominationTeamSeasonalGST'] = feeSeasonalTeamData[j].nominationGST;
                                    feeSeasonalTeamData[j]['affNominationTeamSeasonalFee'] = feeSeasonalTeamData[j].affNominationFees;
                                    feeSeasonalTeamData[j]['affNominationTeamSeasonalGST'] = feeSeasonalTeamData[j].affNominationGST;
                                }
                                break;
                            }
                        }
                    }
                } else {
                    feeCasualTeamData = fee_data[i].casualTeam.perType;
                    feeSeasonalTeamData = fee_data[i].seasonalTeam.perType;
                    for (let j in feeSeasonalTeamData) {
                        for (let k in feeCasualTeamData) {
                            if (
                                feeSeasonalTeamData[j].competitionMembershipProductTypeId ==
                                feeCasualTeamData[k].competitionMembershipProductTypeId
                            ) {
                                feeSeasonalTeamData[j]['teamCasualFees'] = feeCasualTeamData[j].fee;
                                feeSeasonalTeamData[j]['teamCasualGST'] = feeCasualTeamData[j].gst;
                                feeSeasonalTeamData[j]['affiliateTeamCasualFees'] = feeCasualTeamData[j].affiliateFee;
                                feeSeasonalTeamData[j]['affiliateTeamCasualGST'] = feeCasualTeamData[j].affiliateGst;
                                feeSeasonalTeamData[j]['teamSeasonalFees'] = feeSeasonalTeamData[j].fee;
                                feeSeasonalTeamData[j]['teamSeasonalGST'] = feeSeasonalTeamData[j].gst;
                                feeSeasonalTeamData[j]['affiliateTeamSeasonalFees'] = feeSeasonalTeamData[j].affiliateFee;
                                feeSeasonalTeamData[j]['affiliateTeamSeasonalGST'] = feeSeasonalTeamData[j].affiliateGst;
                                if (fee_data[i].teamRegChargeTypeRefId != 3) {
                                    feeSeasonalTeamData[j]['nominationTeamSeasonalFee'] = feeSeasonalTeamData[j].nominationFees;
                                    feeSeasonalTeamData[j]['nominationTeamSeasonalGST'] = feeSeasonalTeamData[j].nominationGST;
                                    feeSeasonalTeamData[j]['affNominationTeamSeasonalFee'] = feeSeasonalTeamData[j].affNominationFees;
                                    feeSeasonalTeamData[j]['affNominationTeamSeasonalGST'] = feeSeasonalTeamData[j].affNominationGST;
                                }
                                break;
                            }
                        }
                    }
                }

                finalPostData = [...feeSeasonalTeamData];
            }

            if (
                finalPostData != null &&
                finalPostData.length > 0 &&
                (fee_data[i].isSeasonal
                    || fee_data[i].isCasual
                    || fee_data[i].isTeamSeasonal
                    || fee_data[i].isTeamCasual)
            ) {
                finalPostData.forEach((item, index) => {
                    finalPostData[index]["isSeasonal"] = fee_data[i].isSeasonal;
                    finalPostData[index]["isCasual"] = fee_data[i].isCasual;
                    finalPostData[index]["isTeamSeasonal"] = fee_data[i].isTeamSeasonal;
                    finalPostData[index]["isTeamCasual"] = fee_data[i].isTeamCasual;
                    finalPostData[index]["teamRegChargeTypeRefId"] = fee_data[i].teamRegChargeTypeRefId;
                })

                let modifyArr = [...finalpostarray, ...finalPostData];
                finalpostarray = modifyArr;
            }
        }

        if (finalpostarray.length > 0) {
            this.props.saveCompetitionFeeSection(finalpostarray, competitionId, this.state.affiliateOrgId);
            this.setState({ loading: true });
        } else {
            message.error(ValidationConstants.feesCannotBeEmpty);
        }
    };

    saveAPIsActionCall = (values) => {
        let tabKey = this.state.competitionTabKey;
        let compFeesState = this.props.competitionFeesState;
        let competitionId = compFeesState.competitionId;
        let postData = compFeesState.competitionDetailData;

        let nonPlayingDate = JSON.stringify(postData.nonPlayingDates);
        let venue = JSON.stringify(compFeesState.postVenues);
        // let invitees = compFeesState.postInvitees
        let invitees = [];
        let anyOrgAffiliateArr = []
        if (compFeesState.associationChecked && compFeesState.anyOrgAssociationArr[0].inviteesOrg.length > 0) {
            anyOrgAffiliateArr = anyOrgAffiliateArr.concat(compFeesState.anyOrgAssociationArr)
        }
        if (compFeesState.clubChecked && compFeesState.anyOrgClubArr[0].inviteesOrg.length > 0) {
            anyOrgAffiliateArr = anyOrgAffiliateArr.concat(compFeesState.anyOrgClubArr)
        }
        if (compFeesState.affiliateArray != null && compFeesState.affiliateArray.length > 0) {
            invitees = compFeesState.affiliateArray.concat(anyOrgAffiliateArr);
        } else if (anyOrgAffiliateArr != null && anyOrgAffiliateArr.length > 0) {
            invitees = anyOrgAffiliateArr
        }

        if (tabKey == '1') {
            if (
                compFeesState.competitionDetailData.competitionLogoUrl !== null &&
                // compFeesState.competitionDetailData.heroImageUrl !== null &&
                invitees.length > 0
            ) {
                let formData = new FormData();
                formData.append('competitionUniqueKey', competitionId);
                formData.append('name', postData.competitionName);
                formData.append('yearRefId', values.yearRefId);
                formData.append('description', postData.description);
                formData.append('competitionTypeRefId', postData.competitionTypeRefId);
                formData.append('competitionFormatRefId', postData.competitionFormatRefId);
                formData.append('startDate', postData.startDate);
                formData.append('endDate', postData.endDate);
                if (postData.competitionFormatRefId == 4) {
                    if (postData.noOfRounds !== null && postData.noOfRounds !== '')
                        formData.append('noOfRounds', postData.noOfRounds);
                }
                if (postData.roundInDays !== null && postData.roundInDays !== '')
                    formData.append('roundInDays', postData.roundInDays);
                if (postData.roundInHours !== null && postData.roundInHours !== '')
                    formData.append('roundInHours', postData.roundInHours);
                if (postData.roundInMins !== null && postData.roundInMins !== '')
                    formData.append('roundInMins', postData.roundInMins);
                if (postData.minimunPlayers !== null && postData.minimunPlayers !== '')
                    formData.append('minimunPlayers', postData.minimunPlayers);
                if (postData.maximumPlayers !== null && postData.maximumPlayers !== '')
                    formData.append('maximumPlayers', postData.maximumPlayers);
                formData.append('venues', venue);
                formData.append('registrationCloseDate', postData.registrationCloseDate);
                formData.append('statusRefId', this.state.isPublished ? 2 : this.state.statusRefId);
                formData.append('nonPlayingDates', nonPlayingDate);
                formData.append('invitees', JSON.stringify(invitees));
                formData.append('logoSetAsDefault', this.state.logoSetDefault);
                formData.append('hasRegistration', 1);
                if (this.state.logoSetDefault) {
                    formData.append('organisationLogoId', compFeesState.defaultCompFeesOrgLogoData.id);
                }
                if (postData.logoIsDefault) {
                    formData.append('competitionLogoId', postData.competitionLogoId ? postData.competitionLogoId : 0);
                    formData.append('logoFileUrl', compFeesState.defaultCompFeesOrgLogo);
                    formData.append('competition_logo', compFeesState.defaultCompFeesOrgLogo);
                } else {
                    if (this.state.image !== null) {
                        formData.append('competition_logo', this.state.image);
                        formData.append('competitionLogoId', postData.competitionLogoId ? postData.competitionLogoId : 0);
                    } else {
                        formData.append('competitionLogoId', postData.competitionLogoId ? postData.competitionLogoId : 0);
                        formData.append('logoFileUrl', postData.competitionLogoUrl);
                        // formData.append("competition_logo", compFeesState.defaultCompFeesOrgLogo)
                    }
                }

                if (this.state.image) {
                    formData.append("uploadFileType", 1);
                } else if (this.state.heroImage) {
                    formData.append("uploadFileType", 2);
                    formData.append("competition_logo", this.state.heroImage);
                } else if (this.state.image && this.state.heroImage) {
                    formData.append("uploadFileType", 3);
                }

                formData.append('logoIsDefault', postData.logoIsDefault);
                this.props.saveCompetitionFeesDetailsAction(
                    formData,
                    compFeesState.defaultCompFeesOrgLogoData.id,
                    AppConstants.Reg,
                    this.state.affiliateOrgId
                );
                this.setState({ loading: true });
            } else {
                if (invitees.length === 0) {
                    message.error(ValidationConstants.pleaseSelectRegInvitees);
                }
                if (compFeesState.competitionDetailData.competitionLogoUrl == null) {
                    message.error(ValidationConstants.competitionLogoIsRequired);
                }
                // if (compFeesState.competitionDetailData.heroImageUrl == null) {
                //     message.error(ValidationConstants.heroImageIsRequired);
                // }
            }
        } else if (tabKey == '2') {
            let finalmembershipProductTypes = JSON.parse(
                JSON.stringify(
                    this.props.competitionFeesState.defaultCompFeesMembershipProduct
                )
            );
            let tempProductsArray = finalmembershipProductTypes.filter(
                (data) => data.isProductSelected === true
            );
            finalmembershipProductTypes = tempProductsArray;
            for (let i in finalmembershipProductTypes) {
                var filterArray = finalmembershipProductTypes[i].membershipProductTypes.filter(
                    (data) => data.isTypeSelected === true
                );
                finalmembershipProductTypes[i].membershipProductTypes = filterArray;
                // if (finalmembershipProductTypes[i].membershipProductTypes.length === 0) {
                //     finalmembershipProductTypes.splice(i, 1);
                // }
            }
            let arrayList = finalmembershipProductTypes.filter(x => x.membershipProductTypes.length > 0);
            let payload = {
                membershipProducts: arrayList,
            };
            this.props.saveCompetitionFeesMembershipTabAction(
                payload,
                competitionId,
                this.state.affiliateOrgId
            );
            this.setState({ loading: true, divisionState: true });
        } else if (tabKey == '3') {
            let divisionArrayData = compFeesState.competitionDivisionsData;
            let finalDivisionArray = [];
            for (let i in divisionArrayData) {
                finalDivisionArray = [
                    ...finalDivisionArray,
                    ...divisionArrayData[i].divisions,
                ];
            }
            let payload = finalDivisionArray;

            let finalDivisionPayload = {
                statusRefId: this.state.statusRefId,
                divisions: payload,
                registrationRestrictionTypeRefId: postData.registrationRestrictionTypeRefId == null
                    ? 1
                    : postData.registrationRestrictionTypeRefId,
            };

            if (this.checkDivisionEmpty(divisionArrayData)) {
                message.error(ValidationConstants.pleaseAddDivisionForMembershipProduct);
            } else {
                this.props.saveCompetitionFeesDivisionAction(
                    finalDivisionPayload,
                    competitionId,
                    this.state.affiliateOrgId
                );
                this.setState({ loading: true });
            }
        } else if (tabKey == '4') {
            this.saveCompFeesApiCall(values);
        } else if (tabKey == '5') {
            this.paymentApiCall(competitionId);
            //this.setState({ loading: true });
        } else if (tabKey == '6') {
            this.discountApiCall(competitionId);
        }
    };

    divisionTableDataOnchange(checked, record, index, keyword) {
        this.props.divisionTableDataOnchangeAction(checked, record, index, keyword);
        this.setState({ divisionState: true });
    }

    dateOnChangeFrom = (date, key) => {
        if (date !== null) {
            this.props.add_editcompetitionFeeDeatils(
                moment(date).format('YYYY-MM-DD'),
                key
            );
        }
    };

    AffiliatesLevel = (tree) => {
        const { TreeNode } = Tree;
        return tree.map((item, catIndex) => (
            <TreeNode title={this.advancedNode(item)} key={item.id}>
                {this.showSubAdvancedNode(item, catIndex)}
            </TreeNode>
        ));
    };

    advancedNode = (item) => {
        return <span>{item.description}</span>;
    };

    disableInviteeNode = (inItem) => {
        let orgLevelId = JSON.stringify(this.state.organisationTypeRefId);
        if (inItem.id == '2' && orgLevelId == '3') {
            return true;
        } else if (orgLevelId == '4') {
            return true;
        } else {
            return false;
        }
    };

    showSubAdvancedNode(item, catIndex) {
        const { TreeNode } = Tree;
        return item.subReferences.map((inItem) => (
            <TreeNode
                title={this.makeSubAdvancedNode(inItem)}
                key={inItem.id}
                disabled={this.disableInviteeNode(inItem)}
            />
        ));
    }

    makeSubAdvancedNode(item) {
        return <span>{item.description}</span>;
    }

    instalmentDate() {
        return (
            <div className="breadcrumb-add pb-2" style={{ fontSize: 16, cursor: "default" }}>
                {AppConstants.instalmentDate}
            </div>
        );
    }

    instalmentUponReg(key, value) {
        return (
            <div className="pt-4 pb-4">
                <Switch
                    onChange={(e) => this.props.instalmentDateAction(e, key)}
                    checked={value}
                    style={{ marginRight: 10 }}
                />
                {AppConstants.uponRegistration}
            </div>
        );
    }

    showInstalmentDate(selectedSeasonalInstalmentDatesArray, key) {
        return selectedSeasonalInstalmentDatesArray.map((selectedSeasonalInstalmentDatesArrayItem, index) => {
            return (
                this.getInstalmentDate(selectedSeasonalInstalmentDatesArray, selectedSeasonalInstalmentDatesArrayItem, index, key)
            );
        });
    }

    getInstalmentDate(selectedSeasonalInstalmentDatesArray, selectedSeasonalInstalmentDatesArrayItem, index, key) {
        let removeObj = {
            selectedSeasonalInstalmentDatesArray: selectedSeasonalInstalmentDatesArray,
            selectedSeasonalInstalmentDatesArrayItem: selectedSeasonalInstalmentDatesArrayItem,
            index
        }
        let instalmentDate = selectedSeasonalInstalmentDatesArrayItem.instalmentDate
        return (
            <div className="pt-3">
                <DatePicker
                    placeholder="dd-mm-yyyy"
                    format="DD-MM-YYYY"
                    showTime={false}
                    onChange={(e) => this.instalmentPaymentDateChange(e, selectedSeasonalInstalmentDatesArrayItem, key)}
                    value={(instalmentDate == "") ? null : moment(instalmentDate, 'YYYY-MM-DD')}
                />

                <span style={{ marginLeft: 8, cursor: 'pointer' }}>
                    <img
                        className="dot-image"
                        src={AppImages.redCross}
                        alt=""
                        width="16"
                        height="16"
                        onClick={(e) => this.props.instalmentDateAction(removeObj, "instalmentRemoveDate", key)}
                    />
                </span>
            </div>
        );
    }

    instalmentPaymentDateChange(instalmentDate, selectedSeasonalInstalmentDatesArrayItem, key) {
        let obj = {
            instalmentDate: (moment(instalmentDate).format("YYYY-MM-DD")),
            selectedSeasonalInstalmentDatesArrayItem: selectedSeasonalInstalmentDatesArrayItem,
        }
        if (instalmentDate !== null && instalmentDate !== "") {
            this.props.instalmentDateAction(obj, 'instalmentDateupdate', key);
        }
    }

    addInstalmentDateBtn(selectedSeasonalInstalmentDatesArray, key) {
        return (
            <span
                style={{ cursor: 'pointer', paddingTop: 0 }}
                onClick={(e) => this.props.instalmentDateAction(selectedSeasonalInstalmentDatesArray, "instalmentAddDate", key)}
                className="input-heading-add-another pt-4"
            >
                {AppConstants.addInstalmentDate}
            </span>
        );
    }

    teamSeasonalRegistrationcode(teamSeasonalSchoolRegCode) {
        return (
            <div className="input-reg-text">
                <InputWithHead
                    auto_complete="new-membershipTypeName"
                    // required="pt-0 mt-0"
                    heading={AppConstants.enterCode}
                    placeholder={AppConstants.enterCode}
                    style={{ width: "100%", background: "white", height: 48 }}
                    onChange={(e) => this.regCodeChange(e.target.value, "teamSeasonalSchoolRegCode")}
                    value={teamSeasonalSchoolRegCode}
                />
            </div>
        )
    }

    regCodeChange = (value, key) => {
        this.props.instalmentDateAction(value, key);
    }

    ///////view for breadcrumb
    headerView = () => (
        <div className="header-view">
            <Header
                className="form-header-view"
                style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Breadcrumb separator=" > ">
                    <Breadcrumb.Item className="breadcrumb-add">
                        {AppConstants.competitionFees}
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Header>
        </div>
    );

    dropdownView = () => {
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                style={{
                                    width: 'fit-content',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <span className="year-select-heading required-field">
                                    {AppConstants.year}:
                            </span>
                                <Form.Item
                                    name="yearRefId"
                                    rules={[{
                                        required: true,
                                        message: ValidationConstants.pleaseSelectYear,
                                    }]}
                                >
                                    <Select
                                        className="year-select reg-filter-select1 ml-2"
                                        style={{ maxWidth: 80 }}
                                        onChange={(e) => this.setYear(e)}
                                    // value= {this.state.yearRefId}
                                    >
                                        {this.props.appState.yearList.map((item) => (
                                            <Option key={'year_' + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    setImage = (data, key) => {
        if (data.files[0] !== undefined) {
            let files_ = data.files[0].type.split('image/');
            let fileType = files_[1];

            if (key === "competitionLogoUrl") {
                if (data.files[0].size > AppConstants.logo_size) {
                    message.error(AppConstants.logoImageSize);
                    return;
                }
                if (fileType === `jpeg` || fileType === `png` || fileType === `gif`) {
                    this.setState({
                        image: data.files[0],
                        profileImage: URL.createObjectURL(data.files[0]),
                        isSetDefaul: true,
                    });
                    this.props.add_editcompetitionFeeDeatils(
                        URL.createObjectURL(data.files[0]),
                        'competitionLogoUrl'
                    );
                    this.props.add_editcompetitionFeeDeatils(false, 'logoIsDefault');
                } else {
                    message.error(AppConstants.logoType);
                    return;
                }
            } else if (key === "heroImageUrl") {
                if (fileType === `jpeg` || fileType === `png` || fileType === `gif`) {
                    this.setState({
                        heroImage: data.files[0]
                    });
                    this.props.add_editcompetitionFeeDeatils(
                        URL.createObjectURL(data.files[0]),
                        'heroImageUrl'
                    );
                } else {
                    message.error(AppConstants.logoType);
                    return;
                }
            }
        }
    };

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/*');
        if (!!fileInput) {
            fileInput.click();
        }
    }

    selectHeroImage() {
        const fileInput = document.getElementById('hero-pic');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/*');
        if (!!fileInput) {
            fileInput.click();
        }
    }

    /// add-edit non playing dates and name
    updateNonPlayingNames(data, index, key) {
        let detailsData = this.props.competitionFeesState;
        let array = detailsData.competitionDetailData.nonPlayingDates;
        if (key === 'name') {
            array[index].name = data;
        } else {
            array[index].nonPlayingDate = data;
        }

        this.props.add_editcompetitionFeeDeatils(array, 'nonPlayingDates');
    }

    // Non playing dates view
    nonPlayingDateView(item, index) {
        let compDetailDisable = this.state.permissionState.compDetailDisable;
        return (
            <div className="fluid-width mt-3">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            auto_complete={`new-name${index}`}
                            placeholder={AppConstants.name}
                            value={item.name}
                            onChange={(e) => this.updateNonPlayingNames(e.target.value, index, 'name')}
                            disabled={compDetailDisable}
                        />
                    </div>
                    <div className="col-sm">
                        <DatePicker
                            className="comp-dashboard-botton-view-mobile"
                            size="default"
                            placeholder="dd-mm-yyyy"
                            style={{ width: '100%' }}
                            onChange={(date) => this.updateNonPlayingNames(date, index, 'date')}
                            format="DD-MM-YYYY"
                            showTime={false}
                            value={item.nonPlayingDate && moment(item.nonPlayingDate, 'YYYY-MM-DD')}
                            disabled={compDetailDisable}
                        />
                    </div>
                    <div
                        className="col-sm-2 transfer-image-view"
                        onClick={() =>
                            !compDetailDisable
                                ? this.props.add_editcompetitionFeeDeatils(index, 'nonPlayingDataRemove')
                                : null
                        }
                    >
                        <a className="transfer-image-view">
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true" />
                            </span>
                            <span className="user-remove-text mr-0">
                                {AppConstants.remove}
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    //On selection of venue
    onSelectValues(item, detailsData) {
        this.props.add_editcompetitionFeeDeatils(item, 'venues');
        this.props.clearFilter();
    }

    ///// Add Non Playing dates
    addNonPlayingDate() {
        let nonPlayingObject = {
            competitionNonPlayingDatesId: 0,
            name: '',
            nonPlayingDate: '',
        };
        this.props.add_editcompetitionFeeDeatils(nonPlayingObject, 'nonPlayingObjectAdd');
    }

    ///handle Invitees selection
    handleInvitees() {
        let detailsData = this.props.competitionFeesState.competitionDetailData;
        if (detailsData) {
            let selectedInvitees = detailsData.invitees;
            let selected = [];
            if (selectedInvitees.length > 0) {
                for (let i in selectedInvitees) {
                    selected.push(selectedInvitees[i].registrationInviteesRefId);
                }
            }
            return selected;
        } else {
            return [];
        }
    }

    //// On change Invitees
    onInviteesChange(value) {
        let regInviteesselectedData = this.props.competitionFeesState.selectedInvitees;
        let arr = [value];
        this.props.add_editcompetitionFeeDeatils(arr, 'invitees');
        if (value == 7) {
            this.onInviteeSearch('', 3);
        } else if (value == 8) {
            this.onInviteeSearch('', 4);
        }
    }

    /////on change logo isdefault
    logoIsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(value, key);
        this.setState({ logoSetDefault: false, isSetDefaul: false, image: null });
    };

    // search venue
    handleSearch = (value, data) => {
        const filteredData = data.filter((memo) => {
            return memo.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
        });
        this.props.searchVenueList(filteredData);
    };

    ////onChange save as default logo
    logoSaveAsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(false, key);
        this.setState({ logoSetDefault: value });
    };

    contentView = (getFieldDecorator) => {
        let roundsArray = this.props.competitionManagementState.fixtureTemplate;
        let appState = this.props.appState;
        let detailsData = this.props.competitionFeesState;
        let defaultCompFeesOrgLogo = detailsData.defaultCompFeesOrgLogo;
        let compDetailDisable = this.state.permissionState.compDetailDisable;
        let compDatesDisable = this.state.permissionState.compDatesDisable;
        return (
            <div className="content-view pt-4">
                <Form.Item
                    name="competition_name"
                    rules={[{
                        required: true,
                        message: ValidationConstants.competitionNameIsRequired,
                    }]}
                >
                    <InputWithHead
                        auto_complete="off"
                        required="required-field pb-1"
                        heading={AppConstants.competition_name}
                        placeholder={AppConstants.competition_name}
                        // value={detailsData.competitionDetailData.competitionName}
                        onChange={(e) =>
                            this.props.add_editcompetitionFeeDeatils(captializedString(
                                e.target.value),
                                'competitionName'
                            )
                        }
                        disabled={compDetailDisable}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            'competition_name': captializedString(i.target.value)
                        })}
                    />
                </Form.Item>

                <InputWithHead
                    required="required-field pb-1"
                    heading={AppConstants.competitionLogo}
                />

                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                <label>
                                    <img
                                        src={
                                            detailsData.competitionDetailData.competitionLogoUrl == null
                                                ? AppImages.circleImage
                                                : detailsData.competitionDetailData.competitionLogoUrl
                                        }
                                        // alt="animated"
                                        height="120"
                                        width="120"
                                        style={{ borderRadius: 60 }}
                                        name="image"
                                        onError={(ev) => {
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
                                onChange={(evt) => this.setImage(evt.target, "competitionLogoUrl")}
                            />
                        </div>
                        <div
                            className="col-sm"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                            }}
                        >
                            {defaultCompFeesOrgLogo !== null && (
                                <Checkbox
                                    className="single-checkbox"
                                    // defaultChecked={false}
                                    checked={detailsData.competitionDetailData.logoIsDefault}
                                    onChange={(e) =>
                                        this.logoIsDefaultOnchange(
                                            e.target.checked,
                                            'logoIsDefault'
                                        )
                                    }
                                    disabled={compDetailDisable}
                                >
                                    {AppConstants.useDefault}
                                </Checkbox>
                            )}

                            {this.state.isSetDefaul && (
                                <Checkbox
                                    className="single-checkbox ml-0"
                                    checked={this.state.logoSetDefault}
                                    onChange={(e) =>
                                        this.logoSaveAsDefaultOnchange(
                                            e.target.checked,
                                            'logoIsDefault'
                                        )
                                    }
                                    disabled={compDetailDisable}
                                >
                                    {AppConstants.useAffiliateLogo}
                                </Checkbox>
                            )}
                        </div>
                    </div>
                </div>

                <InputWithHead required="pb-1" heading={AppConstants.heroImageForCompetition} />
                <div className="reg-competition-hero-image-view" onClick={this.selectHeroImage}>
                    <div style={{ overflow: "hidden", minHeight: "150px", maxHeight: "287px" }}>
                        <img
                            src={
                                detailsData.competitionDetailData.heroImageUrl == null
                                    ? AppImages.circleImage
                                    : detailsData.competitionDetailData.heroImageUrl
                            }
                            name="image"
                            style={
                                detailsData.competitionDetailData.heroImageUrl == null
                                    ? {
                                        height: "120px",
                                        width: "120px"
                                    }
                                    : { width: "100%" }
                            }
                            onError={(ev) => {
                                ev.target.src = AppImages.circleImage;
                            }}
                        />
                        <input
                            disabled={compDetailDisable}
                            type="file"
                            id="hero-pic"
                            style={{ display: 'none' }}
                            onChange={(evt) => this.setImage(evt.target, "heroImageUrl")}
                        />
                    </div>
                    <span
                        style={
                            detailsData.competitionDetailData.heroImageUrl == null
                                ? {
                                    alignSelf: "center",
                                    marginLeft: "20px",
                                    color: "var(--app-bbbbc6)",
                                    fontSize: "13px"
                                }
                                : { display: "none" }
                        }
                    >
                        {AppConstants.heroImageSizeText}
                    </span>
                </div>

                <InputWithHead required="pb-1" heading={AppConstants.description} />
                <TextArea
                    placeholder={AppConstants.addShortNotes_registering}
                    allowClear
                    value={detailsData.competitionDetailData.description}
                    onChange={(e) =>
                        this.props.add_editcompetitionFeeDeatils(
                            e.target.value,
                            'description'
                        )
                    }
                    disabled={compDetailDisable}
                />

                <div style={{ marginTop: 15 }}>
                    <InputWithHead
                        required="required-field pb-1"
                        heading={AppConstants.venue}
                    />
                    <Form.Item
                        name="selectedVenues"
                        rules={[{
                            required: true,
                            message: ValidationConstants.pleaseSelectVenue,
                        }]}
                    >
                        <Select
                            mode="multiple"
                            style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                            onChange={(venueSelection) => {
                                this.onSelectValues(venueSelection, detailsData);
                            }}
                            // value={detailsData.selectedVenues}
                            placeholder={AppConstants.selectVenue}
                            filterOption={false}
                            onSearch={(value) => {
                                this.handleSearch(value, appState.mainVenueList);
                            }}
                            disabled={compDetailDisable}
                        >
                            {appState.venueList.map((item) => (
                                <Option key={'venue_' + item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                {compDetailDisable == false && (
                    <NavLink
                        to={{
                            pathname: `/competitionVenueAndTimesAdd`,
                            state: {
                                key: AppConstants.competitionFees,
                                id: this.props.location.state ? this.props.location.state.id : null,
                            },
                        }}
                    >
                        <span className="input-heading-add-another">
                            +{AppConstants.addVenue}
                        </span>
                    </NavLink>
                )}
                <span className="applicable-to-heading required-field pb-1">
                    {AppConstants.typeOfCompetition}
                </span>
                <Form.Item
                    name="competitionTypeRefId"
                    initialValue={1}
                    rules={[{
                        required: true,
                        message: ValidationConstants.pleaseSelectCompetitionType,
                    }]}
                >
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.props.add_editcompetitionFeeDeatils(
                                e.target.value,
                                'competitionTypeRefId'
                            )
                        }
                        value={detailsData.competitionTypeRefId}
                        disabled={compDetailDisable}
                    >
                        {appState.typesOfCompetition.map((item) => (
                            <Radio key={'competitionType_' + item.id} value={item.id}>
                                {' '}
                                {item.description}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>

                <span className="applicable-to-heading required-field pb-1">
                    {AppConstants.competitionFormat}
                </span>
                <Form.Item
                    name="competitionFormatRefId"
                    initialValue={1}
                    rules={[{
                        required: true,
                        message: ValidationConstants.pleaseSelectCompetitionFormat,
                    }]}
                >
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.props.add_editcompetitionFeeDeatils(
                                e.target.value,
                                'competitionFormatRefId'
                            )
                        }
                        value={detailsData.competitionFormatRefId}
                        disabled={compDetailDisable}
                    >
                        {appState.competitionFormatTypes.map((item) => (
                            <div className="contextualHelp-RowDirection">
                                <Radio key={'competitionFormat' + item.id} value={item.id}>
                                    {' '}
                                    {item.description}
                                </Radio>

                                <div className="mt-0 ml-25">
                                    <CustomToolTip>
                                        <span>{item.helpMsg}</span>
                                    </CustomToolTip>
                                </div>
                            </div>
                        ))}
                    </Radio.Group>
                </Form.Item>

                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.compStartDate}
                                required="required-field pb-1"
                            />
                            <Form.Item
                                name="startDate"
                                rules={[{
                                    required: true,
                                    message: ValidationConstants.startDateIsRequired,
                                }]}
                            >
                                <DatePicker
                                    size="default"
                                    placeholder="dd-mm-yyyy"
                                    style={{ width: '100%' }}
                                    onChange={(date) =>
                                        this.dateOnChangeFrom(date, 'startDate')
                                    }
                                    format="DD-MM-YYYY"
                                    showTime={false}
                                    // value={detailsData.competitionDetailData.startDate && moment(detailsData.competitionDetailData.startDate, "YYYY-MM-DD")}
                                    disabled={compDatesDisable}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.compCloseDate}
                                required="required-field pb-1"
                            />
                            <Form.Item
                                name="endDate"
                                rules={[{
                                    required: true,
                                    message: ValidationConstants.endDateIsRequired,
                                }]}
                            >
                                <DatePicker
                                    size="default"
                                    placeholder="dd-mm-yyyy"
                                    style={{ width: '100%' }}
                                    onChange={(date) => this.dateOnChangeFrom(date, 'endDate')}
                                    format="DD-MM-YYYY"
                                    showTime={false}
                                    disabledDate={(d) => !d || d.isBefore(detailsData.competitionDetailData.startDate)}
                                    disabled={compDatesDisable}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                {/* <div className="col-sm"> */}
                {detailsData.competitionDetailData.competitionFormatRefId == 4 && (
                    <div>
                        <InputWithHead
                            heading={AppConstants.numberOfRounds}
                            required="required-field pb-1"
                        />
                        <Form.Item
                            name="numberOfRounds"
                            rules={[{
                                required: true,
                                message: ValidationConstants.numberOfRoundsNameIsRequired,
                            }]}
                        >
                            <Select
                                style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                                placeholder={AppConstants.selectRound}
                                onChange={(e) =>
                                    this.props.add_editcompetitionFeeDeatils(e, 'noOfRounds')
                                }
                                value={detailsData.competitionDetailData.noOfRounds}
                                disabled={compDetailDisable}
                            >
                                {roundsArray.map((item) => (
                                    <Option key={'round_' + item.noOfRounds} value={item.noOfRounds}>
                                        {item.noOfRounds}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                )}
                {/* </div> */}
                <InputWithHead required="pb-1" heading={AppConstants.timeBetweenRounds} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.days}
                                value={detailsData.competitionDetailData.roundInDays}
                                onChange={(e) =>
                                    this.props.add_editcompetitionFeeDeatils(
                                        e.target.value,
                                        'roundInDays'
                                    )
                                }
                                disabled={compDetailDisable}
                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.hours}
                                value={detailsData.competitionDetailData.roundInHours}
                                onChange={(e) =>
                                    this.props.add_editcompetitionFeeDeatils(
                                        e.target.value,
                                        'roundInHours'
                                    )
                                }
                                disabled={compDetailDisable}
                            />
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.mins}
                                value={detailsData.competitionDetailData.roundInMins}
                                onChange={(e) =>
                                    this.props.add_editcompetitionFeeDeatils(
                                        e.target.value,
                                        'roundInMins'
                                    )
                                }
                                disabled={compDetailDisable}
                            />
                        </div>
                    </div>
                </div>
                <InputWithHead
                    heading={AppConstants.registration_close}
                    required="required-field pb-1"
                />
                <Form.Item
                    name="registrationCloseDate"
                    rules={[{
                        required: true,
                        message: ValidationConstants.registrationCloseDateIsRequired,
                    }]}
                >
                    <DatePicker
                        size="default"
                        placeholder="dd-mm-yyyy"
                        style={{ width: '100%' }}
                        onChange={(date) =>
                            this.dateOnChangeFrom(date, 'registrationCloseDate')
                        }
                        name={'registrationCloseDate'}
                        format="DD-MM-YYYY"
                        showTime={false}
                        disabled={compDatesDisable}
                    />
                </Form.Item>

                <div className="inside-container-view pt-4">
                    <InputWithHead required="pb-1" heading={AppConstants.nonPlayingDates} />
                    {detailsData.competitionDetailData.nonPlayingDates && detailsData.competitionDetailData.nonPlayingDates.map(
                        (item, index) => this.nonPlayingDateView(item, index)
                    )}
                    <a>
                        <span
                            onClick={() =>
                                !compDetailDisable ? this.addNonPlayingDate() : null
                            }
                            className="input-heading-add-another"
                        >
                            + {AppConstants.addAnotherNonPlayingDate}
                        </span>
                    </a>
                </div>

                <InputWithHead required="pb-1" heading={AppConstants.playerInEachTeam} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.minNumber}
                                value={detailsData.competitionDetailData.minimunPlayers}
                                onChange={(e) =>
                                    this.props.add_editcompetitionFeeDeatils(
                                        e.target.value,
                                        'minimunPlayers'
                                    )
                                }
                                disabled={compDetailDisable}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.maxNumber}
                                value={detailsData.competitionDetailData.maximumPlayers}
                                onChange={(e) =>
                                    this.props.add_editcompetitionFeeDeatils(
                                        e.target.value,
                                        'maximumPlayers'
                                    )
                                }
                                disabled={compDetailDisable}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    ////////on change function of membership product selection
    membershipProductSelected = (checked, index, membershipProductUniqueKey) => {
        this.props.membershipProductSelectedAction(
            checked,
            index,
            membershipProductUniqueKey
        );
    };

    ////membership types in competition fees onchange function
    membershipTypeSelected = (checked, membershipIndex, typeIndex) => {
        this.props.membershipTypeSelectedAction(
            checked,
            membershipIndex,
            typeIndex
        );
    };

    membershipProductView = () => {
        let membershipProductData = this.props.competitionFeesState.defaultCompFeesMembershipProduct;
        let membershipProductArray = membershipProductData !== null ? membershipProductData : [];
        let membershipDisable = this.state.permissionState.membershipDisable;
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.membershipProduct}</span>
                {membershipProductArray.map((item, index) => (
                    <div
                        style={{
                            display: '-ms-flexbox',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Checkbox
                            className="single-checkbox pt-3"
                            checked={item.isProductSelected}
                            onChange={(e) =>
                                this.membershipProductSelected(
                                    e.target.checked,
                                    index,
                                    item.membershipProductUniqueKey
                                )
                            }
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
        let typeData = isArrayNotEmpty(item.membershipProductTypes)
            ? item.membershipProductTypes
            : [];
        let membershipDisable = this.state.permissionState.membershipDisable;
        return (
            <div>
                {typeData.map((typeItem, typeIndex) => (
                    <div
                        style={{
                            display: '-ms-flexbox',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <Checkbox
                            className="single-checkbox pt-3"
                            checked={typeItem.isTypeSelected}
                            onChange={(e) => this.membershipTypeSelected(e.target.checked, index, typeIndex)}
                            key={typeIndex}
                            disabled={membershipDisable}
                        >
                            {typeItem.membershipProductTypeName}
                        </Checkbox>
                    </div>
                ))}
            </div>
        );
    };

    membershipTypeView = () => {
        let membershipTypesData = this.props.competitionFeesState.defaultCompFeesMembershipProduct;
        let membershipProductArray = membershipTypesData !== null ? membershipTypesData : [];
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.membershipTYpe}</span>
                {membershipProductArray.length === 0 && (
                    <span className="applicable-to-heading pt-0">
                        {AppConstants.please_Sel_mem_pro}
                    </span>
                )}

                {membershipProductArray.map((item, index) => item.isProductSelected && (
                    <div className="prod-reg-inside-container-view">
                        <span className="applicable-to-heading">
                            {item.membershipProductName}
                        </span>
                        {this.membershipTypeInnerView(item, index)}
                    </div>
                ))}
            </div>
        );
    };

    //////add or remove another division in the division tab
    addRemoveDivision = (index, item, keyword) => {
        this.props.addRemoveDivisionAction(index, item, keyword);
        this.setDetailsFieldValue();
    };

    divisionsView = () => {
        let divisionData = this.props.competitionFeesState.competitionDivisionsData;
        let divisionArray = divisionData !== null ? divisionData : [];
        let divisionsDisable = this.state.permissionState.divisionsDisable;
        let restrictionTypeMeta = this.props.commonReducerState.registrationTypeData;
        let detailsData = this.props.competitionFeesState.competitionDetailData;
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.registrationDivisions}</span>
                {divisionArray.length === 0 && (
                    <span className="applicable-to-heading pt-0">
                        {AppConstants.please_Sel_mem_pro}
                    </span>
                )}
                {divisionArray.map((item, index) => (
                    <div>
                        <div className="inside-container-view">
                            <span className="form-heading pt-2 pl-2">
                                {item.membershipProductName}
                                <span className="requiredSpan">*</span>
                            </span>
                            {item.isPlayingStatus ? (
                                <div>
                                    <div className="table-responsive">
                                        <Table
                                            className="fees-table"
                                            columns={this.state.divisionTable}
                                            dataSource={[...item.divisions]}
                                            pagination={false}
                                            Divider="false"
                                            key={index}
                                        />
                                    </div>
                                    <a>
                                        <span
                                            className="input-heading-add-another"
                                            onClick={() =>
                                                !divisionsDisable
                                                    ? this.addRemoveDivision(index, item, 'add')
                                                    : null
                                            }
                                        >
                                            + {AppConstants.addRegDivision}
                                        </span>
                                    </a>
                                </div>
                            ) : (
                                    <span className="applicable-to-heading pt-0 pl-2">
                                        {AppConstants.nonPlayerDivisionMessage}
                                    </span>
                                )}
                        </div>
                    </div>
                ))}
                <div className="inside-container-view">
                    <span className="form-heading pl-2">
                        {AppConstants.CompetitionRegistration}
                    </span>
                    <Radio.Group
                        className="reg-competition-radio"
                        disabled={divisionsDisable}
                        onChange={(e) =>
                            this.props.add_editcompetitionFeeDeatils(
                                e.target.value,
                                'registrationRestrictionTypeRefId'
                            )
                        }
                        value={
                            detailsData.registrationRestrictionTypeRefId == null
                                ? 1
                                : detailsData.registrationRestrictionTypeRefId
                        }
                    >
                        {restrictionTypeMeta.map((item) => (
                            <div className="contextualHelp-RowDirection">
                                <Radio key={'registrationRestrictionType_' + item.id} value={item.id}>
                                    {' '}
                                    {item.description}
                                </Radio>
                            </div>
                        ))}
                    </Radio.Group>
                </div>
            </div>
        );
    };

    ////// Edit fee details
    onChangeDetails(value, tableIndex, item, key, arrayKey) {
        this.props.add_editFee_deatialsScetion(
            value,
            tableIndex,
            item,
            key,
            arrayKey
        );
    }

    getOrgLevelForFeesTable = () => {
        const registrationInviteesRefIdObject = {
            [AppConstants.association]: 2,
            [AppConstants.club]: 3,
            [AppConstants.anyAssociation]: 7,
            [AppConstants.anyClub]: 8,
        };
        let detailData = this.props.competitionFeesState.competitionDetailData;
        let inviteesArray = detailData.invitees;
        let inviteeFilter = inviteesArray.filter(
            (x) =>
                x.registrationInviteesRefId == 2 ||
                x.registrationInviteesRefId == 3 ||
                x.registrationInviteesRefId == 7 ||
                x.registrationInviteesRefId == 8
        );

        let orgLevel = '';
        if (isArrayNotEmpty(inviteeFilter)) {
            let registrationInviteesRefId = inviteeFilter[0].registrationInviteesRefId;
            orgLevel = Object.keys(registrationInviteesRefIdObject).find(
                (key) => registrationInviteesRefIdObject[key] === registrationInviteesRefId
            );
        }
        return orgLevel;
    };

    seasonalFeesOnOrgLevel() {
        let isCreatorEdit = this.state.isCreatorEdit;
        let orgLevel = this.getOrgLevelForFeesTable();
        if (isCreatorEdit && orgLevel == AppConstants.association) {
            return playerSeasonalTableAssociation;
        } else if (isCreatorEdit && orgLevel == AppConstants.club) {
            return playerSeasonalTableClub;
        } else if (isCreatorEdit && orgLevel == AppConstants.anyAssociation) {
            return playerSeasonalTableAssociation;
        } else if (isCreatorEdit && orgLevel == AppConstants.anyClub) {
            return playerSeasonalTableClub;
        } else {
            return playerSeasonalTable;
        }
    }

    seasonalFeesTeamOnOrgTLevel() {
        let isCreatorEdit = this.state.isCreatorEdit;
        let orgLevel = this.getOrgLevelForFeesTable();
        if (isCreatorEdit && orgLevel == AppConstants.association) {
            return playerSeasonalTableTeamAssociation;
        } else if (isCreatorEdit && orgLevel == AppConstants.club) {
            return playerSeasonalTableTeamClub;
        } else if (isCreatorEdit && orgLevel == AppConstants.anyAssociation) {
            return playerSeasonalTableTeamAssociation;
        } else if (isCreatorEdit && orgLevel == AppConstants.anyClub) {
            return playerSeasonalTableTeamClub;
        } else {
            return playerSeasonalTeamTable;
        }
    }

    casualFeesTeamOnOrgTLevel() {
        let isCreatorEdit = this.state.isCreatorEdit;
        let orgLevel = this.getOrgLevelForFeesTable();
        if (isCreatorEdit && orgLevel == AppConstants.association) {
            return playerCasualTableTeamAssociation;
        } else if (isCreatorEdit && orgLevel == AppConstants.club) {
            return playerCasualTableTeamClub;
        } else if (isCreatorEdit && orgLevel == AppConstants.anyAssociation) {
            return playerCasualTableTeamAssociation;
        } else if (isCreatorEdit && orgLevel == AppConstants.anyClub) {
            return playerCasualTableTeamClub;
        } else {
            return playerCasualTeamTable;
        }
    }

    casualFeesOnOrgLevel() {
        let isCreatorEdit = this.state.isCreatorEdit;
        let orgLevel = this.getOrgLevelForFeesTable();
        if (isCreatorEdit && orgLevel == AppConstants.association) {
            return playerCasualTableAssociation;
        } else if (isCreatorEdit && orgLevel == AppConstants.club) {
            return playerCasualTableClub;
        } else if (isCreatorEdit && orgLevel == AppConstants.anyAssociation) {
            return playerCasualTableAssociation;
        } else if (isCreatorEdit && orgLevel == AppConstants.anyClub) {
            return playerCasualTableClub;
        } else {
            return playerCasualTable;
        }
    }

    feesView = () => {
        let allStates = this.props.competitionFeesState;
        let feeDetails = allStates.competitionFeesData;
        let feesTableDisable = this.state.permissionState.feesTableDisable;
        return (
            <div className="fees-view pt-5">
                <span className="form-heading required-field">{AppConstants.fees}</span>
                {feeDetails == null || (feeDetails.length === 0 && (
                    <span className="applicable-to-heading pt-0">
                        {AppConstants.please_Sel_mem_pro}
                    </span>
                ))}

                {feeDetails && feeDetails.map((item, index) => {
                    return (
                        <div className="inside-container-view">
                            <span className="form-heading pt-2 pl-2">
                                {item.membershipProductName}
                            </span>
                            <Radio.Group
                                className="reg-competition-radio"
                                onChange={(e) =>
                                    this.props.checkUncheckcompetitionFeeSction(
                                        e.target.value,
                                        index,
                                        'isAllType'
                                    )
                                }
                                value={item.isAllType}
                                disabled={feesTableDisable}
                            >
                                <div className="fluid-width">
                                    <div className="row">
                                        <div className="col-sm-2">
                                            <div className="contextualHelp-RowDirection">
                                                <Radio value="allDivisions">
                                                    {AppConstants.allDivisions}
                                                </Radio>
                                                <div className="ml-n10">
                                                    <CustomToolTip>
                                                        <span>{AppConstants.allDivisionsMsg}</span>
                                                    </CustomToolTip>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-sm-2"
                                            style={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            <div className="contextualHelp-RowDirection">
                                                <Radio value="perDivision">
                                                    {AppConstants.perDivision}
                                                </Radio>
                                                <div className="ml-n20">
                                                    <CustomToolTip>
                                                        <span>{AppConstants.perDivisionMsg}</span>
                                                    </CustomToolTip>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Radio.Group>
                            <div style={{ marginTop: 5 }}>
                                <div style={{ marginTop: 15 }}>
                                    <Checkbox
                                        checked={item.isIndividualReg}
                                        className="single-checkbox"
                                        style={{ fontSize: '16px' }}
                                        disabled={feesTableDisable}
                                        onChange={(e) => {
                                            this.props.checkUncheckcompetitionFeeSction(
                                                e.target.checked,
                                                index,
                                                'isIndividualReg'
                                            );
                                        }}
                                    >
                                        {AppConstants.individualRegistrations}
                                    </Checkbox>
                                </div>
                                {item.isIndividualReg && (
                                    <div>
                                        <div style={{ marginTop: 15 }}>
                                            <Checkbox
                                                style={{ marginLeft: '45px' }}
                                                checked={item.isSeasonal}
                                                className="single-checkbox"
                                                disabled={feesTableDisable}
                                                onChange={(e) => {
                                                    this.props.checkUncheckcompetitionFeeSction(
                                                        e.target.checked,
                                                        index,
                                                        'isSeasonal'
                                                    );
                                                }}
                                            >
                                                {AppConstants.seasonalFee}
                                            </Checkbox>
                                        </div>
                                        {item.isSeasonal && (
                                            <div className="table-responsive mt-2">
                                                <Table
                                                    className="fees-table"
                                                    columns={this.seasonalFeesOnOrgLevel()}
                                                    dataSource={
                                                        item.isAllType != 'allDivisions'
                                                            ? item.seasonal.perType
                                                            : item.seasonal.allType
                                                    }
                                                    pagination={false}
                                                    Divider="false"
                                                />
                                            </div>
                                        )}

                                        <div style={{ marginTop: 10 }}>
                                            <Checkbox
                                                style={{ marginLeft: '45px' }}
                                                checked={item.isCasual}
                                                className="single-checkbox"
                                                disabled={feesTableDisable}
                                                onChange={(e) =>
                                                    this.props.checkUncheckcompetitionFeeSction(
                                                        e.target.checked,
                                                        index,
                                                        'isCasual'
                                                    )
                                                }
                                            >
                                                {AppConstants.singleGameFee}
                                            </Checkbox>
                                        </div>

                                        {item.isCasual && (
                                            <div className="table-responsive mt-2">
                                                <Table
                                                    className="fees-table"
                                                    columns={this.casualFeesOnOrgLevel()}
                                                    dataSource={
                                                        item.isAllType != 'allDivisions'
                                                            ? item.casual.perType
                                                            : item.casual.allType
                                                    }
                                                    pagination={false}
                                                    Divider="false"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {(item.isAllType != 'allDivisions'
                                    ? item.seasonalTeam.perType
                                    : item.seasonalTeam.allType
                                ).length > 0 && (
                                        <div style={{ marginTop: 25 }}>
                                            {/* <div style={{ marginTop: 15 }}>
                                                <Checkbox
                                                    checked={item.isTeamReg}
                                                    className="single-checkbox"
                                                    style={{ fontSize: '16px' }}
                                                    disabled={feesTableDisable}
                                                    onChange={(e) => {
                                                        this.props.checkUncheckcompetitionFeeSction(
                                                            e.target.checked,
                                                            index,
                                                            'isTeamReg'
                                                        );
                                                    }}
                                                >
                                                    {AppConstants.teamRegistration}
                                                </Checkbox>
                                            </div> */}
                                            <div>
                                                <Checkbox
                                                    checked={item.isTeamSeasonal}
                                                    className="single-checkbox"
                                                    style={{ fontSize: '16px' }}
                                                    disabled={feesTableDisable}
                                                    onChange={(e) => {
                                                        this.props.checkUncheckcompetitionFeeSction(
                                                            e.target.checked,
                                                            index,
                                                            'isTeamSeasonal'
                                                        );
                                                    }}
                                                >
                                                    {AppConstants.teamRegistration}
                                                </Checkbox>
                                            </div>
                                            {item.isTeamSeasonal == 1 && (
                                                <div style={{ marginTop: 5 }}>
                                                    <Radio.Group
                                                        className="reg-competition-radio"
                                                        onChange={(e) =>
                                                            this.props.checkUncheckcompetitionFeeSction(
                                                                e.target.value,
                                                                index,
                                                                'teamRegChargeTypeRefId'
                                                            )
                                                        }
                                                        value={item.teamRegChargeTypeRefId}
                                                        disabled={feesTableDisable}
                                                    >
                                                        <div style={{ display: "flex" }}>
                                                            <Radio value={1}>{AppConstants.chargedForFullSeason}</Radio>
                                                            <div >
                                                                <Radio className="team-reg-radio-custom-style" value={item.teamRegChargeTypeRefId ? (item.teamRegChargeTypeRefId == 3 ? 3 : 2) : 2}>
                                                                    {AppConstants.chargedPerMatch}
                                                                </Radio>
                                                                {(item.teamRegChargeTypeRefId == 2 || item.teamRegChargeTypeRefId == 3) && (
                                                                    <div style={{ display: "flex" }}>
                                                                        <Radio className="team-reg-radio-custom-style" style={{ width: "50%" }} value={2}>{AppConstants.feesPaidAtEachMatchByUser}</Radio>
                                                                        <Radio className="team-reg-radio-custom-style" style={{ width: "50%" }} value={3}>{AppConstants.feesPaidAtEachMatchByPlayer}</Radio>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* <div className="fluid-width">
                                                            <div className="row">
                                                                <div className="col-sm-4">
                                                                    <div className="contextualHelp-RowDirection" style={{'flexDirection': 'column'}}>
                                                                        <Radio value={1}>
                                                                            {AppConstants.chargedForFullSeason}
                                                                        </Radio>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="col-sm-2"
                                                                    style={{ display: 'flex', alignItems: 'center' }}
                                                                >
                                                                    <div className="contextualHelp-RowDirection" style={{'flexDirection': 'column'}}>
                                                                        <Radio value={item.teamRegChargeTypeRefId ? (item.teamRegChargeTypeRefId == 3 ? 3 : 2) : 2 }>
                                                                            {AppConstants.chargedPerMatch}
                                                                        </Radio>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div
                                                                    className="col-sm-4"
                                                                    style={{ display: 'flex', alignItems: 'center' }}
                                                                />
                                                                <div
                                                                    className="col-sm-8"
                                                                    style={{ display: 'flex', alignItems: 'center', paddingLeft: '40px' }}
                                                                >
                                                                    {(item.teamRegChargeTypeRefId == 2 || item.teamRegChargeTypeRefId == 3) &&
                                                                        <div className="row">
                                                                            <div className="col-sm">
                                                                                <div className="contextualHelp-RowDirection">
                                                                                    <Radio value={2}>
                                                                                        {AppConstants.feesPaidAtEachMatchByUser}
                                                                                    </Radio>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="col-sm"
                                                                                style={{ display: 'flex', alignItems: 'center' }}
                                                                            >
                                                                                <div className="contextualHelp-RowDirection">
                                                                                    <Radio value={3}>
                                                                                        {AppConstants.feesPaidAtEachMatchByPlayer}
                                                                                    </Radio>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                    </Radio.Group>
                                                </div>
                                            )}
                                            {item.isTeamSeasonal && (
                                                <div className="table-responsive mt-2">
                                                    <Table
                                                        // ref= {(tableReference) => this.tableReference = tableReference}
                                                        className="fees-table"
                                                        columns={item.teamRegChargeTypeRefId == 3 ? this.casualFeesTeamOnOrgTLevel() : this.seasonalFeesTeamOnOrgTLevel()}
                                                        dataSource={
                                                            item.isAllType != 'allDivisions'
                                                                ? item.seasonalTeam.perType
                                                                : item.seasonalTeam.allType
                                                        }
                                                        pagination={false}
                                                        Divider="false"
                                                    />
                                                </div>
                                            )}

                                            {/* <div style={{ marginTop: 10 }}>
                                                <Checkbox
                                                    checked={item.isTeamCasual}
                                                    className="single-checkbox"
                                                    disabled={feesTableDisable}
                                                    onChange={(e) =>
                                                        this.props.checkUncheckcompetitionFeeSction(
                                                            e.target.checked,
                                                            index,
                                                            'isTeamCasual'
                                                        )
                                                    }
                                                >
                                                    {AppConstants.singleGamePerTeamMember}
                                                </Checkbox>
                                            </div>
                                            {item.isTeamCasual && (
                                                <div className="table-responsive mt-2">
                                                    <Table
                                                        className="fees-table"
                                                        columns={this.casualFeesTeamOnOrgTLevel()}
                                                        dataSource={
                                                            item.isAllType != 'allDivisions'
                                                                ? item.casualTeam.perType
                                                                : item.casualTeam.allType
                                                        }
                                                        pagination={false}
                                                        Divider="false"
                                                    />
                                                </div>
                                            )} */}
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
        let orgLevelId = JSON.stringify(this.state.organisationTypeRefId);
        if (inItem.id == '2' && orgLevelId == '3') {
            return false;
        }
        if (inItem.id == '3' && orgLevelId == '4') {
            return false;
        }
        if (inItem.id == '2' && orgLevelId == '4') {
            return false;
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
        return true;
    };

    affiliateSearchOnchange = (affiliateOrgKey) => {
        this.props.add_editcompetitionFeeDeatils(
            affiliateOrgKey,
            'affiliateOrgKey'
        );
    };

    onInviteeSearch = (value, inviteesType) => {
        this.props.onInviteesSearchAction(value, inviteesType);
    };

    // ////////reg invitees search view for any organisation
    // affiliatesSearchInvitee = (subItem) => {
    //     let detailsData = this.props.competitionFeesState
    //     let seletedInvitee = detailsData.selectedInvitees.find(x => x);
    //     let associationAffilites = detailsData.associationAffilites
    //     let clubAffilites = detailsData.clubAffilites
    //     let regInviteesDisable = this.state.permissionState.regInviteesDisable
    //     if (subItem.id == 7 && seletedInvitee == 7) {
    //         return (
    //             <div>
    //                 <Select
    //                     mode="multiple"
    //                     style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
    //                     onChange={associationAffilite => {
    //                         this.affiliateSearchOnchange(associationAffilite)
    //                     }}
    //                     value={detailsData.affiliateOrgSelected}
    //                     placeholder={AppConstants.selectOrganisation}
    //                     filterOption={false}
    //                     onSearch={(value) => {
    //                         this.onInviteeSearch(value, 3)
    //                     }}
    //                     disabled={regInviteesDisable}
    //                     showSearch
    //                     onBlur={() => this.onInviteeSearch("", 3)}
    //                     // loading={detailsData.searchLoad}
    //                 >
    //                     {associationAffilites.map((item) => (
    //                         <Option key={'organization_' + item.organisationId} value={item.organisationId}>
    //                             {item.name}
    //                         </Option>
    //                     ))}
    //                 </Select>
    //             </div>
    //         )
    //     } else if (subItem.id == 8 && seletedInvitee == 8) {
    //         return (
    //             <div>
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
    //                     onSearch={(value) => {
    //                         this.onInviteeSearch(value, 4)
    //                     }}
    //                     disabled={regInviteesDisable}
    //                     onBlur={() => this.onInviteeSearch("", 4)}
    //                     // loading={detailsData.searchLoad}
    //                 >
    //                     {clubAffilites.map((item) => (
    //                         <Option key={'organisation_' + item.organisationId} value={item.organisationId}>
    //                             {item.name}
    //                         </Option>
    //                     ))}
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
    //     return (
    //         <div className="fees-view pt-5">
    //             <span className="form-heading required-field">{AppConstants.registrationInvitees}</span>
    //             <div>
    //                 <Radio.Group
    //                     className="reg-competition-radio"
    //                     disabled={regInviteesDisable}
    //                     onChange={(e) => this.onInviteesChange(e.target.value)}
    //                     value={seletedInvitee}
    //                 >
    //                     {(invitees || []).map((item, index) => (
    //                         <div key={item.id}>
    //                             {item.subReferences.length === 0 ? (
    //                                 <Radio value={item.id}>{item.description}</Radio>
    //                             ) : (
    //                                 <div>
    //                                     <div className="applicable-to-heading invitees-main">
    //                                         {orgLevelId == "4" && item.id == 1 ? "" : item.description}
    //                                     </div>
    //                                     {(item.subReferences).map((subItem) => (
    //                                         <div key={subItem.id}  style={{ marginLeft: '20px' }}>
    //                                             {this.disableInvitee(subItem) && (
    //                                                 <Radio key={subItem.id} value={subItem.id}>{subItem.description}</Radio>
    //                                             )}
    //                                             {this.affiliatesSearchInvitee(subItem)}
    //                                         </div>
    //                                     ))}
    //                                 </div>
    //                             )}
    //                         </div>
    //                     ))}
    //                 </Radio.Group>
    //             </div>
    //         </div>
    //     );
    // };

    ////////reg invitees search view for any organisation
    affiliatesSearchInvitee = (subItem, seletedInvitee) => {
        let detailsData = this.props.competitionFeesState;
        let associationAffilites = detailsData.associationAffilites;
        let clubAffilites = detailsData.clubAffilites;
        const { associationLeague, clubSchool, associationChecked, clubChecked } = this.props.competitionFeesState;
        let regInviteesDisable = this.state.permissionState.regInviteesDisable;
        if (subItem.id == 7 && associationChecked) {
            return (
                <div>
                    <Select
                        mode="multiple"
                        style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                        onChange={(associationAffilite) => {
                            this.props.add_editcompetitionFeeDeatils(
                                associationAffilite,
                                'associationAffilite'
                            );
                        }}
                        value={associationLeague}
                        placeholder={AppConstants.selectOrganisation}
                        filterOption={false}
                        onSearch={(value) => {
                            this.onInviteeSearch(value, 3);
                        }}
                        disabled={regInviteesDisable}
                        showSearch
                        onBlur={() =>
                            isArrayNotEmpty(associationAffilites) == false
                                ? this.onInviteeSearch('', 3)
                                : null
                        }
                        onFocus={() =>
                            isArrayNotEmpty(associationAffilites) == false
                                ? this.onInviteeSearch('', 3)
                                : null
                        }
                        loading={detailsData.searchLoad}
                    >
                        {associationAffilites.map((item) => (
                            <Option key={'organisation_' + item.organisationId} value={item.organisationId}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
            );
        } else if (subItem.id == 8 && clubChecked) {
            return (
                <div>
                    <Select
                        mode="multiple"
                        style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                        onChange={(clubAffilite) => {
                            // this.onSelectValues(venueSelection, detailsData)
                            this.props.add_editcompetitionFeeDeatils(
                                clubAffilite,
                                'clubAffilite'
                            );
                        }}
                        value={clubSchool}
                        placeholder={AppConstants.selectOrganisation}
                        filterOption={false}
                        onSearch={(value) => {
                            this.onInviteeSearch(value, 4);
                        }}
                        disabled={regInviteesDisable}
                        // onBlur={() => this.onInviteeSearch('', 4)}
                        onBlur={() =>
                            isArrayNotEmpty(clubAffilites) == false
                                ? this.onInviteeSearch('', 4)
                                : null
                        }
                        onFocus={() =>
                            isArrayNotEmpty(clubAffilites) == false
                                ? this.onInviteeSearch('', 4)
                                : null
                        }
                        loading={detailsData.searchLoad}
                    >
                        {clubAffilites.map((item) => (
                            <Option key={'organisation_' + item.organisationId} value={item.organisationId}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </div>
            );
        }
    };

    regInviteesView = () => {
        let invitees = this.props.appState.registrationInvitees.length > 0
            ? this.props.appState.registrationInvitees
            : [];
        const {
            affiliateSelected,
            anyOrgSelected,
            otherSelected,
            affiliateNonSelected,
            anyOrgNonSelected,
            associationChecked,
            clubChecked
        } = this.props.competitionFeesState;
        let orgLevelId = JSON.stringify(this.state.organisationTypeRefId);
        let regInviteesDisable = this.state.permissionState.regInviteesDisable;
        return (
            <div className="fees-view pt-5">
                <span className="form-heading required-field">
                    {AppConstants.registrationInvitees}
                </span>
                <div>
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={(e) =>
                            this.props.add_editcompetitionFeeDeatils(e.target.value, 'affiliateSelected')
                        }
                        disabled={regInviteesDisable}
                        value={affiliateSelected}
                    >
                        {(invitees || []).map((item, index) =>
                            index === 0 && (
                                <div key={item.id}>
                                    {item.subReferences.length === 0 ? (
                                        <Radio value={item.id}>{item.description}</Radio>
                                    ) : (
                                            <div>
                                                {(orgLevelId == '4' && item.id == 1) == false && (
                                                    <div className="contextualHelp-RowDirection">
                                                        <div className="applicable-to-heading invitees-main">
                                                            {item.description}
                                                        </div>
                                                        <div className="mt-2">
                                                            <CustomToolTip>
                                                                <span>{item.helpMsg}</span>
                                                            </CustomToolTip>
                                                        </div>
                                                    </div>
                                                )}
                                                {item.subReferences.map((subItem) =>
                                                    subItem.id == 2 ? (
                                                        <div style={{ marginLeft: '20px' }}>
                                                            {this.disableInvitee(subItem) && (
                                                                <Radio key={subItem.id} value={subItem.id}>
                                                                    {subItem.description}
                                                                </Radio>
                                                            )}
                                                        </div>
                                                    ) : (
                                                            <>
                                                                <div style={{ marginLeft: '20px' }}>
                                                                    {this.disableInvitee(subItem) && (
                                                                        <Radio key={subItem.id} value={subItem.id}>
                                                                            {subItem.description}
                                                                        </Radio>
                                                                    )}
                                                                </div>
                                                                <div style={{ marginLeft: 20 }}>
                                                                    {this.disableInvitee(subItem) && (
                                                                        <Radio.Group
                                                                            onChange={(e) =>
                                                                                this.props.add_editcompetitionFeeDeatils(
                                                                                    e.target.value,
                                                                                    'affiliateNonSelected'
                                                                                )
                                                                            }
                                                                            disabled={regInviteesDisable}
                                                                            value={affiliateNonSelected}
                                                                        >
                                                                            <Radio key="none1" value="none1">
                                                                                None
                                                                    </Radio>
                                                                        </Radio.Group>
                                                                    )}
                                                                </div>
                                                            </>
                                                        )
                                                )}
                                            </div>
                                        )}
                                </div>
                            )
                        )}
                    </Radio.Group>

                    <Radio.Group
                        className="reg-competition-radio mt-0"
                        // onChange={(e) => this.onInviteesChange(e.target.value)}
                        onChange={(e) =>
                            this.props.add_editcompetitionFeeDeatils(e.target.value, 'anyOrgSelected')
                        }
                        value={anyOrgSelected}
                        disabled={regInviteesDisable}
                    >
                        {(invitees || []).map((item, index) =>
                            index === 1 && (
                                <div key={item.id}>
                                    {item.subReferences.length === 0 ? (
                                        <Radio value={item.id}>{item.description}</Radio>
                                    ) : (
                                            <div>
                                                <div className="contextualHelp-RowDirection">
                                                    <div className="applicable-to-heading invitees-main">
                                                        {item.description}
                                                    </div>
                                                    <div className="mt-2">
                                                        <CustomToolTip>
                                                            <span>{item.helpMsg}</span>
                                                        </CustomToolTip>
                                                    </div>
                                                </div>
                                                {/* {item.subReferences.map((subItem) => (
                                                <div style={{ marginLeft: '20px' }}>
                                                    <Radio key={subItem.id} value={subItem.id}>
                                                        {subItem.description}
                                                    </Radio>
                                                    {this.affiliatesSearchInvitee(subItem, anyOrgSelected)}
                                                </div>
                                            ))} */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        paddingLeft: 20
                                                    }}
                                                >
                                                    <Checkbox
                                                        className="single-checkbox-radio-style"
                                                        style={{ paddingTop: 8 }}
                                                        checked={associationChecked}
                                                        onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.checked, "associationChecked")}
                                                    >
                                                        {item.subReferences[0].description}
                                                    </Checkbox>

                                                    {this.affiliatesSearchInvitee(item.subReferences[0], anyOrgSelected)}

                                                    <Checkbox
                                                        className="single-checkbox-radio-style"
                                                        style={{ paddingTop: 13, marginLeft: 0 }}
                                                        checked={clubChecked}
                                                        onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.checked, "clubChecked")}
                                                    >
                                                        {item.subReferences[1].description}
                                                    </Checkbox>

                                                    {this.affiliatesSearchInvitee(item.subReferences[1], anyOrgSelected)}
                                                </div>

                                                <div style={{ marginLeft: 20 }}>
                                                    <Radio.Group
                                                        onChange={(e) =>
                                                            this.props.add_editcompetitionFeeDeatils(
                                                                e.target.value,
                                                                'anyOrgNonSelected'
                                                            )
                                                        }
                                                        value={anyOrgNonSelected}
                                                        disabled={regInviteesDisable}
                                                    >
                                                        <Radio key="none2" value="none2">
                                                            None
                                                    </Radio>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )
                        )}
                    </Radio.Group>

                    <Radio.Group
                        className="reg-competition-radio mt-0"
                        onChange={(e) =>
                            this.props.add_editcompetitionFeeDeatils(e.target.value, 'otherSelected')
                        }
                        disabled={regInviteesDisable}
                        value={otherSelected}
                    >
                        {(invitees || []).map((item, index) =>
                            index > 1 && (
                                <div key={item.id}>
                                    {item.subReferences.length === 0 ? (
                                        <div className="contextualHelp-RowDirection">
                                            <Radio value={item.id}>{item.description}</Radio>
                                            <div className="ml-n20 mt-2">
                                                <CustomToolTip>
                                                    <span>{item.helpMsg}</span>
                                                </CustomToolTip>
                                            </div>
                                        </div>
                                    ) : (
                                            <div>
                                                <div className="applicable-to-heading invitees-main">
                                                    {item.description}
                                                </div>
                                                {item.subReferences.map((subItem) => (
                                                    <div key={subItem.id} style={{ marginLeft: '20px' }}>
                                                        <Radio
                                                            disabled={regInviteesDisable}
                                                            onChange={(e) =>
                                                                this.props.add_editcompetitionFeeDeatils(
                                                                    e.target.value,
                                                                    'none'
                                                                )
                                                            }
                                                            key={subItem.id}
                                                            value={subItem.id}
                                                        >
                                                            {subItem.description}
                                                        </Radio>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            )
                        )}
                    </Radio.Group>
                </div>
            </div>
        );
    };

    onChangePaymentOptionFee(itemValue, index, key, subKey) {
        this.props.updatePaymentFeeOption(itemValue, key, index, subKey);
    }

    checkIsSeasonal = (feeDetails) => {
        let isSeasonalValue = false;
        for (let i in feeDetails) {
            if (feeDetails[i].isSeasonal) {
                isSeasonalValue = true;
                break;
            }
        }
        return isSeasonalValue;
    };

    checkIsTeamSeasonal = (feeDetails) => {
        let isSeasonalValue = false;
        for (let i in feeDetails) {
            if (feeDetails[i].teamRegChargeTypeRefId == 1 || feeDetails[i].teamRegChargeTypeRefId == 2) {
                isSeasonalValue = true;
                break;
            }
        }
        return isSeasonalValue;
    };

    checkIsTeamCasual = (feeDetails) => {
        let isCasualValue = false;
        for (let i in feeDetails) {
            if (feeDetails[i].teamRegChargeTypeRefId == 3) {
                isCasualValue = true;
                break;
            }
        }
        return isCasualValue;
    };

    checkIsCasual = (feeDetails) => {
        let isCasualValue = false;
        for (let i in feeDetails) {
            if (feeDetails[i].isCasual) {
                isCasualValue = true;
                break;
            }
        }
        return isCasualValue;
    };

    //payment Option View in tab 5
    paymentOptionsView = () => {
        let allStates = this.props.competitionFeesState;
        let competitionDetailData = allStates.competitionDetailData;
        let feeDetails = allStates.competitionFeesData;
        let isSeasonal = this.checkIsSeasonal(feeDetails);
        let isCasual = this.checkIsCasual(feeDetails);
        let isTeamSeasonal = this.checkIsTeamSeasonal(feeDetails);
        let isTeamCasual = this.checkIsTeamCasual(feeDetails);

        let selectedSeasonalFee = this.props.competitionFeesState.SelectedSeasonalFee;
        let selectedCasualFee = this.props.competitionFeesState.selectedCasualFee;
        let selectedSeasonalTeamFee = this.props.competitionFeesState.selectedSeasonalTeamFee;
        let selectedCasualTeamFee = this.props.competitionFeesState.selectedCasualTeamFee;
        let selectedPaymentMethods = this.props.competitionFeesState.selectedPaymentMethods;

        let isSeasonalUponReg = competitionDetailData.isSeasonalUponReg != undefined ? competitionDetailData.isSeasonalUponReg : false;
        let isTeamSeasonalUponReg = competitionDetailData.isTeamSeasonalUponReg != undefined ? competitionDetailData.isTeamSeasonalUponReg : false;
        let teamSeasonalSchoolRegCode = competitionDetailData.teamSeasonalSchoolRegCode != undefined ? competitionDetailData.teamSeasonalSchoolRegCode : null;

        let paymentsDisable = this.state.permissionState.paymentsDisable;
        let selectedSeasonalInstalmentDates = this.props.competitionFeesState.selectedSeasonalInstalmentDates;
        let selectedTeamSeasonalInstalmentDates = this.props.competitionFeesState.selectedTeamSeasonalInstalmentDates;

        return (
            <div className="tab-formView">
                <div>
                    <div className="inside-container-view">
                        <div className="contextualHelp-RowDirection">
                            <span className="form-heading">{AppConstants.paymentMethods}</span>
                        </div>

                        {(selectedPaymentMethods || []).map((item, index) => (
                            <div className="pt-4">
                                <Checkbox
                                    checked={item.isChecked}
                                    onChange={(e) => this.onChangePaymentOptionFee(e.target.checked, index, "paymentmethods", "isChecked")}
                                    className="single-checkbox mt-1"
                                    disabled={paymentsDisable}
                                >
                                    {item.description}
                                </Checkbox>
                            </div>
                        ))}
                    </div>
                    <div className="inside-container-view pt-5">
                        <span className="form-heading">{AppConstants.paymentOptions}</span>
                        {isSeasonal == false && isCasual == false && isTeamSeasonal == false && isTeamCasual == false && (
                            <span className="applicable-to-heading pt-0">
                                {AppConstants.please_Sel_Fee}
                            </span>
                        )}

                        <div className="inside-container-view">
                            <div className="contextualHelp-RowDirection">
                                <span className="form-heading">{AppConstants.nominationFee}</span>
                                {/* <div className="mt-5">
                                    <CustomToolTip placement="top">
                                        <span>{AppConstants.paymentSeasonalFeeMsg}</span>
                                    </CustomToolTip>
                                </div> */}
                            </div>
                            <Radio.Group
                                className="reg-competition-radio"
                                value={1}
                                disabled={paymentsDisable}
                            >
                                <Radio value={1}>{AppConstants.atPointOfRegistration}</Radio>
                                <div className="pl-2">{AppConstants.nominationFeeTeam}</div>
                            </Radio.Group>
                        </div>
                        {isSeasonal && (
                            <div className="inside-container-view">
                                <div className="contextualHelp-RowDirection">
                                    <span className="form-heading">{AppConstants.seasonalFee}</span>
                                    <div className="mt-4">
                                        <CustomToolTip placement="top">
                                            <span>{AppConstants.paymentSeasonalFeeMsg}</span>
                                        </CustomToolTip>
                                    </div>
                                </div>
                                {(selectedSeasonalFee || []).map((item, index) => (
                                    <div className="pt-4">
                                        <Checkbox
                                            checked={item.isChecked}
                                            onChange={(e) => this.onChangePaymentOptionFee(e.target.checked, index, "seasonalfee", "isChecked")}
                                            className="single-checkbox mt-1"
                                            disabled={paymentsDisable}
                                        >
                                            {item.description}
                                        </Checkbox>
                                        {item.paymentOptionRefId == 5 && item.isChecked && (
                                            <div className="inside-container-view ml-5">
                                                {this.instalmentDate()}
                                                {this.instalmentUponReg("isSeasonalUponReg", isSeasonalUponReg)}
                                                {this.showInstalmentDate(selectedSeasonalInstalmentDates, "seasonalfee")}
                                                {this.addInstalmentDateBtn(selectedSeasonalInstalmentDates, "seasonalfee")}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {isCasual && (
                            <div className="inside-container-view">
                                <div className="contextualHelp-RowDirection">
                                    <span className="form-heading">{AppConstants.singleGameFee}</span>
                                    <div className="mt-4">
                                        <CustomToolTip placement="top">
                                            <span>{AppConstants.paymentCausalFeeMsg}</span>
                                        </CustomToolTip>
                                    </div>
                                </div>
                                {(selectedCasualFee || []).map((item, index) => (
                                    <div className="pt-4">
                                        <Checkbox
                                            checked={item.isChecked}
                                            onChange={(e) => this.onChangePaymentOptionFee(e.target.checked, index, "casualfee", "isChecked")}
                                            className="single-checkbox mt-1"
                                            disabled={paymentsDisable}
                                        >
                                            {item.description}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        )}
                        {isTeamSeasonal && (
                            <div className="inside-container-view">
                                <div className="contextualHelp-RowDirection">
                                    <span className="form-heading">{AppConstants.teamSeasonalFee}</span>
                                    <div className="mt-4">
                                        <CustomToolTip placement="top">
                                            <span>{AppConstants.paymentSeasonalFeeMsg}</span>
                                        </CustomToolTip>
                                    </div>
                                </div>
                                {(selectedSeasonalTeamFee || []).map((item, index) => (
                                    <div className="pt-4">
                                        <Checkbox
                                            checked={item.isChecked}
                                            onChange={(e) => this.onChangePaymentOptionFee(e.target.checked, index, "seasonalteamfee", "isChecked")}
                                            className="single-checkbox mt-1"
                                            disabled={paymentsDisable}
                                        >
                                            {item.description}
                                        </Checkbox>
                                        {item.paymentOptionRefId == 5 && item.isChecked && (
                                            <div className="inside-container-view ml-5">
                                                {this.instalmentDate()}
                                                {this.instalmentUponReg("isTeamSeasonalUponReg", isTeamSeasonalUponReg)}
                                                {this.showInstalmentDate(selectedTeamSeasonalInstalmentDates, "seasonalteamfee")}
                                                {this.addInstalmentDateBtn(selectedTeamSeasonalInstalmentDates, "seasonalteamfee")}
                                            </div>
                                        )}
                                        {item.paymentOptionRefId == 8 && item.isChecked && (
                                            this.teamSeasonalRegistrationcode(teamSeasonalSchoolRegCode)
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {isTeamCasual && (
                            <div className="inside-container-view">
                                <div className="contextualHelp-RowDirection">
                                    <span className="form-heading">{AppConstants.teamSingleGameFee}</span>
                                    <div className="mt-4">
                                        <CustomToolTip placement="top">
                                            <span>{AppConstants.paymentCausalFeeMsg}</span>
                                        </CustomToolTip>
                                    </div>
                                </div>
                                {(selectedCasualTeamFee || []).map((item, index) => (
                                    <div className="pt-4">
                                        <Checkbox
                                            checked={item.isChecked}
                                            onChange={(e) => this.onChangePaymentOptionFee(e.target.checked, index, "casualteamfee", "isChecked")}
                                            className="single-checkbox mt-1"
                                            disabled={paymentsDisable}
                                        >
                                            {item.description}
                                        </Checkbox>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div />
                    </div>
                </div>
            </div>
        );
    };

    //////charity voucher view
    charityVoucherView = () => {
        let charityRoundUp = this.props.competitionFeesState.charityRoundUp;
        let paymentData = this.props.competitionFeesState.competitionPaymentsData;
        let paymentsDisable = this.state.permissionState.paymentsDisable;
        let checkCharityArray = this.props.competitionFeesState.competitionPaymentsData.charityRoundUp;
        return (
            <div className="advanced-setting-view pt-5">
                <div className="contextualHelp-RowDirection">
                    <span className="form-heading">{AppConstants.charityRoundUp}</span>
                    <div className="mt-4">
                        <CustomToolTip placement="top">
                            <span>{AppConstants.charityRoundUpMsg}</span>
                        </CustomToolTip>
                    </div>
                </div>
                <div className="inside-container-view">
                    {charityRoundUp.map((item, index) => {
                        return (
                            <div className="row">
                                <Checkbox
                                    className="single-checkbox mt-3"
                                    checked={item.isSelected}
                                    onChange={(e) =>
                                        this.onChangeCharity(e.target.checked, index, 'charityRoundUp')
                                    }
                                    disabled={paymentsDisable}
                                >
                                    {item.description}
                                </Checkbox>
                            </div>
                        );
                    })}
                </div>

                {checkCharityArray.length > 0 && (
                    <div>
                        <Form.Item
                            name="charityTitle"
                            rules={[{
                                required: true,
                                message: ValidationConstants.charityTitleNameIsRequired,
                            }]}
                        >
                            <InputWithHead
                                auto_complete="new-title"
                                heading={AppConstants.title}
                                placeholder={AppConstants.title}
                                // value={charityTitle}
                                disabled={paymentsDisable}
                                onChange={(e) =>
                                    this.props.updatePaymentOption(
                                        captializedString(e.target.value),
                                        null,
                                        'title'
                                    )
                                }
                                onBlur={(i) => this.formRef.current.setFieldsValue({
                                    'charityTitle': captializedString(i.target.value)
                                })}
                            />
                        </Form.Item>
                        <InputWithHead heading={AppConstants.description} />
                        <Form.Item
                            name="charityDescription"
                            rules={[{
                                required: true,
                                message: ValidationConstants.charityDescriptionIsRequired,
                            }]}
                        >
                            <TextArea
                                placeholder={AppConstants.addCharityDescription}
                                allowClear
                                // value={charityDescription}
                                onChange={(e) =>
                                    this.props.updatePaymentOption(
                                        e.target.value,
                                        null,
                                        'description'
                                    )
                                }
                                disabled={paymentsDisable}
                            />
                        </Form.Item>
                    </div>
                )}
            </div>
        );
    };

    //  for change the charity round up
    onChangeCharity(value, index, keyword) {
        this.props.updatePaymentOption(value, index, keyword);
    }

    ////government voucher view
    voucherView = () => {
        let govtVoucher = this.props.competitionFeesState.govtVoucher;
        let discountsDisable = this.state.permissionState.discountsDisable;
        return (
            <div className="advanced-setting-view pt-5">
                <span className="form-heading">{AppConstants.governmentVouchers}</span>
                <div className="inside-container-view">
                    {govtVoucher.map((item, index) => (
                        <div className="row">
                            <Checkbox
                                className="single-checkbox mt-3"
                                checked={item.isSelected}
                                onChange={(e) =>
                                    this.onChangeCharity(
                                        e.target.checked,
                                        index,
                                        'govermentVouchers'
                                    )
                                }
                                disabled={discountsDisable}
                            >
                                {item.description}
                            </Checkbox>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    //onChange membership type discount
    onChangeMembershipTypeDiscount = (discountMembershipType, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].competitionMembershipProductTypeId = discountMembershipType;
        this.props.updatedDiscountDataAction(discountData);
    };

    ////add or remove  discount in discount section
    addRemoveDiscount = (keyAction, index) => {
        this.props.addRemoveCompFeeDiscountAction(keyAction, index);
        setTimeout(() => {
            this.setDetailsFieldValue();
        }, 300);
    };

    //On change membership product discount type
    onChangeMembershipProductDisType = (discountType, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].competitionTypeDiscountTypeRefId = discountType;
        this.props.updatedDiscountDataAction(discountData);
        if (discountType == 3) {
            if (isArrayNotEmpty(discountData[index].childDiscounts) == false) {
                this.addRemoveChildDiscount(index, 'add', -1);
            }
        }
    };

    discountViewChange = (item, index) => {
        let childDiscounts = item.childDiscounts !== null && item.childDiscounts.length > 0
            ? item.childDiscounts
            : [];
        // let discountsDisable = this.state.permissionState.discountsDisable
        switch (item.competitionTypeDiscountTypeRefId) {
            case 1:
                return (
                    <div>
                        <InputWithHead heading="Discount Type" />
                        <Select
                            style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                            onChange={(discountType) => this.onChangeDiscountRefId(discountType, index)}
                            placeholder="Select"
                            value={item.discountTypeRefId}
                            disabled={this.checkDiscountDisable(item.organisationId)}
                        >
                            {this.props.appState.commonDiscountTypes.map((item) => (
                                <Option key={'discountType_' + item.id} value={item.id}>
                                    {item.description}
                                </Option>
                            ))}
                        </Select>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead
                                    auto_complete="new-number"
                                    heading={AppConstants.percentageOff_FixedAmount}
                                    placeholder={AppConstants.percentageOff_FixedAmount}
                                    onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                    value={item.amount}
                                    disabled={this.checkDiscountDisable(item.organisationId)}
                                    suffix={JSON.stringify(item.discountTypeRefId) == '2' ? '%' : null}
                                    type="number"
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead
                                    auto_complete="new-description"
                                    heading={AppConstants.description}
                                    placeholder={AppConstants.generalDiscount}
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
                                        size="default"
                                        placeholder="dd-mm-yyyy"
                                        style={{ width: '100%' }}
                                        onChange={(date) => this.onChangeDiscountAvailableFrom(date, index)}
                                        format="DD-MM-YYYY"
                                        showTime={false}
                                        value={item.availableFrom !== null && moment(item.availableFrom)}
                                        disabled={this.checkDiscountDisable(item.organisationId)}
                                    />
                                </div>
                                <div className="col-sm">
                                    <InputWithHead heading={AppConstants.availableTo} />
                                    <DatePicker
                                        size="default"
                                        placeholder="dd-mm-yyyy"
                                        style={{ width: '100%' }}
                                        disabledDate={this.disabledDate}
                                        disabledTime={this.disabledTime}
                                        onChange={(date) => this.onChangeDiscountAvailableTo(date, index)}
                                        format="DD-MM-YYYY"
                                        showTime={false}
                                        value={item.availableTo !== null && moment(item.availableTo)}
                                        disabled={this.checkDiscountDisable(item.organisationId)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <InputWithHead heading="Discount Type" />
                        <Select
                            style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                            onChange={(discountType) => this.onChangeDiscountRefId(discountType, index)}
                            placeholder="Select"
                            value={item.discountTypeRefId}
                            disabled={this.checkDiscountDisable(item.organisationId)}
                        >
                            {this.props.appState.commonDiscountTypes.map((item) => (
                                <Option key={'discountType_' + item.id} value={item.id}>
                                    {item.description}
                                </Option>
                            ))}
                        </Select>
                        <InputWithHead
                            auto_complete="new-code"
                            heading={AppConstants.code}
                            placeholder={AppConstants.code}
                            onChange={(e) => this.onChangeDiscountCode(e.target.value, index)}
                            value={item.discountCode}
                            disabled={this.checkDiscountDisable(item.organisationId)}
                        />
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead
                                    auto_complete="new-number"
                                    heading={AppConstants.percentageOff_FixedAmount}
                                    placeholder={AppConstants.percentageOff_FixedAmount}
                                    onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                    value={item.amount}
                                    disabled={this.checkDiscountDisable(item.organisationId)}
                                    suffix={JSON.stringify(item.discountTypeRefId) == '2' ? '%' : null}
                                    type="number"
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead
                                    auto_complete="new-description"
                                    heading={AppConstants.description}
                                    placeholder={AppConstants.generalDiscount}
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
                                        placeholder="dd-mm-yyyy"
                                        size="default"
                                        style={{ width: '100%' }}
                                        onChange={(date) => this.onChangeDiscountAvailableFrom(date, index)}
                                        format="DD-MM-YYYY"
                                        showTime={false}
                                        value={item.availableFrom !== null ? moment(item.availableFrom) : null}
                                        disabled={this.checkDiscountDisable(item.organisationId)}
                                    />
                                </div>
                                <div className="col-sm">
                                    <InputWithHead heading={AppConstants.availableTo} />
                                    <DatePicker
                                        placeholder="dd-mm-yyyy"
                                        size="default"
                                        style={{ width: '100%' }}
                                        disabledDate={this.disabledDate}
                                        disabledTime={this.disabledTime}
                                        onChange={(date) => this.onChangeDiscountAvailableTo(date, index)}
                                        format="DD-MM-YYYY"
                                        showTime={false}
                                        value={item.availableTo !== null ? moment(item.availableTo) : null}
                                        disabled={this.checkDiscountDisable(item.organisationId)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div>
                        {childDiscounts.map((childItem, childIndex) => (
                            <div className="row">
                                <div className="col-sm-10">
                                    <Form.Item
                                        name={`percentageValue${index}${childIndex}`}
                                        rules={[{
                                            required: true,
                                            message:
                                                ValidationConstants.pleaseEnterChildDiscountPercentage,
                                        }]}
                                    >
                                        <InputWithHead
                                            auto_complete="new-child"
                                            heading={`Family Participant ${childIndex + 1}%`}
                                            placeholder={`Family Participant ${childIndex + 1}%`}
                                            onChange={(e) =>
                                                this.onChangeChildPercent(
                                                    e.target.value,
                                                    index,
                                                    childIndex,
                                                    childItem
                                                )
                                            }
                                            // value={childItem.percentageValue}
                                            disabled={this.checkDiscountDisable(item.organisationId)}
                                            type="number"
                                        />
                                    </Form.Item>
                                </div>
                                {childIndex > 0 && (
                                    <div
                                        className="col-sm-2 delete-image-view pb-4"
                                        onClick={() =>
                                            !this.checkDiscountDisable(item.organisationId)
                                                ? this.addRemoveChildDiscount(index, 'delete', childIndex)
                                                : null
                                        }
                                    >
                                        <span className="user-remove-btn">
                                            <i className="fa fa-trash-o" aria-hidden="true" />
                                        </span>
                                        <span className="user-remove-text mr-0 mb-1">
                                            {AppConstants.remove}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}

                        <span
                            className="input-heading-add-another"
                            onClick={() =>
                                !this.checkDiscountDisable(item.organisationId)
                                    ? this.addRemoveChildDiscount(index, 'add', -1)
                                    : null
                            }
                        >
                            + {AppConstants.addChild}
                        </span>
                    </div>
                );

            case 4:
                return (
                    <div>
                        <InputWithHead heading="Discount Type" />
                        <Select
                            style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                            onChange={(discountType) => this.onChangeDiscountRefId(discountType, index)}
                            placeholder="Select"
                            value={item.discountTypeRefId}
                            disabled={this.checkDiscountDisable(item.organisationId)}
                        >
                            {this.props.appState.commonDiscountTypes.map((item) => (
                                <Option key={'discountType_' + item.id} value={item.id}>
                                    {item.description}
                                </Option>
                            ))}
                        </Select>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead
                                    auto_complete="new-percentageOff"
                                    heading={AppConstants.percentageOff_FixedAmount}
                                    placeholder={AppConstants.percentageOff_FixedAmount}
                                    onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                    value={item.amount}
                                    disabled={this.checkDiscountDisable(item.organisationId)}
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead
                                    auto_complete="new-gernalDiscount"
                                    heading={AppConstants.description}
                                    placeholder={AppConstants.generalDiscount}
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
                                        placeholder="dd-mm-yyyy"
                                        size="default"
                                        style={{ width: '100%' }}
                                        onChange={(date) => this.onChangeDiscountAvailableFrom(date, index)}
                                        format="DD-MM-YYYY"
                                        showTime={false}
                                        value={item.availableFrom !== null && moment(item.availableFrom)}
                                        disabled={this.checkDiscountDisable(item.organisationId)}
                                    />
                                </div>
                                <div className="col-sm">
                                    <InputWithHead heading={AppConstants.availableTo} />
                                    <DatePicker
                                        placeholder="dd-mm-yyyy"
                                        size="default"
                                        style={{ width: '100%' }}
                                        disabledDate={this.disabledDate}
                                        disabledTime={this.disabledTime}
                                        onChange={(date) => this.onChangeDiscountAvailableTo(date, index)}
                                        format="DD-MM-YYYY"
                                        showTime={false}
                                        value={item.availableTo !== null && moment(item.availableTo)}
                                        disabled={this.checkDiscountDisable(item.organisationId)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div>
                        <InputWithHead
                            auto_complete="new-description"
                            heading={AppConstants.description}
                            placeholder={AppConstants.description}
                            onChange={(e) => this.onChangeDescription(e.target.value, index)}
                            value={item.description}
                            disabled={this.checkDiscountDisable(item.organisationId)}
                        />
                        <InputWithHead
                            auto_complete="new-question"
                            heading={AppConstants.question}
                            placeholder={AppConstants.question}
                            onChange={(e) => this.onChangeQuestion(e.target.value, index)}
                            value={item.question}
                            disabled={this.checkDiscountDisable(item.organisationId)}
                        />
                        <InputWithHead heading={'Apply Discount if Answer is Yes'} />
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.applyDiscountQuestionCheck(e.target.value, index)}
                            value={JSON.stringify(JSON.parse(item.applyDiscount))}
                            disabled={this.checkDiscountDisable(item.organisationId)}
                        >
                            <Radio value="1">{AppConstants.yes}</Radio>
                            <Radio value="0">{AppConstants.no}</Radio>
                        </Radio.Group>
                    </div>
                );

            default:
                return <div />;
        }
    };

    addRemoveChildDiscount = (index, keyWord, childIndex) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;

        let childDisObject = {
            membershipFeesChildDiscountId: 0,
            percentageValue: '',
        };

        if (keyWord === 'add') {
            if (discountData[index].childDiscounts == null) {
                discountData[index].childDiscounts = []
            }
            discountData[index].childDiscounts.push(childDisObject);
        } else if (keyWord === 'delete') {
            discountData[index].childDiscounts.splice(childIndex, 1);
        }
        this.props.updatedDiscountDataAction(discountData);
        if (keyWord === 'delete') {
            setTimeout(() => {
                this.setDetailsFieldValue();
            }, 300)
        }
    };

    ////////onchange apply discount question radio button
    applyDiscountQuestionCheck = (applyDiscount, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].applyDiscount = applyDiscount;
        this.props.updatedDiscountDataAction(discountData);
    };

    ///////child  onchange in discount section
    onChangeChildPercent = (childPercent, index, childindex, childItem) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].childDiscounts[childindex].percentageValue = childPercent;
        discountData[index].childDiscounts[childindex].membershipFeesChildDiscountId = childItem.membershipFeesChildDiscountId;
        this.props.updatedDiscountDataAction(discountData);
    };

    ///onchange question in case of custom discount
    onChangeQuestion = (question, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].question = question;
        this.props.updatedDiscountDataAction(discountData);
    };

    /////onChange discount refId
    onChangeDiscountRefId = (discountType, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].discountTypeRefId = discountType;
        this.props.updatedDiscountDataAction(discountData);
    };

    //////onchange discount code
    onChangeDiscountCode = (discountCode, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].discountCode = discountCode;
        this.props.updatedDiscountDataAction(discountData);
    };

    ///onchange on text field percentage off
    onChangePercentageOff = (amount, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].amount = amount;
        this.props.updatedDiscountDataAction(discountData);
    };

    /////onChange discount description
    onChangeDescription = (description, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].description = description;
        this.props.updatedDiscountDataAction(discountData);
    };

    ////discount available from on change
    onChangeDiscountAvailableFrom = (date, index) => {
        let fromDate = moment(date).format('YYYY-MM-DD');
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].availableFrom = fromDate;
        this.props.updatedDiscountDataAction(discountData);
    };

    ////discount available to on change
    onChangeDiscountAvailableTo = (date, index) => {
        let toDate = moment(date).format('YYYY-MM-DD');
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].availableTo = toDate;
        this.props.updatedDiscountDataAction(discountData);
    };

    //discount membership product change
    onChangeMembershipProduct = (data, index) => {
        let discountData = this.props.competitionFeesState.competionDiscountValue.competitionDiscounts[0].discounts;
        discountData[index].membershipProductUniqueKey = data;
        this.props.updatedDiscountMemberPrd(data, discountData, index);
    };

    ////to check discount fields would be enable or disable
    checkDiscountDisable = (organisationId) => {
        let discountsDisable = this.state.permissionState.discountsDisable;
        let orgData = getOrganisationData();
        let currentOrganisationId = orgData ? orgData.organisationId : 0;
        if (discountsDisable == false) {
            if (currentOrganisationId == organisationId) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    };

    ////discount view inside the content
    discountView = (getFieldDecorator) => {
        let data = this.props.competitionFeesState.competionDiscountValue;
        let discountData = data && data.competitionDiscounts !== null
            ? data.competitionDiscounts[0].discounts
            : [];
        let membershipPrdArr = this.props.competitionFeesState.competitionMembershipProductData !== null
            ? this.props.competitionFeesState.competitionMembershipProductData
            : [];
        let discountsDisable = this.state.permissionState.discountsDisable;
        return (
            <div className="discount-view pt-5">
                <div className="contextualHelp-RowDirection">
                    <span className="form-heading">{AppConstants.discounts}</span>
                    <div className="mt-4">
                        <CustomToolTip placement="bottom">
                            <span>{AppConstants.discountMsg}</span>
                        </CustomToolTip>
                    </div>
                </div>
                {discountData.map((item, index) => (
                    <div className="prod-reg-inside-container-view">
                        <div
                            className="transfer-image-view pt-2"
                            onClick={() =>
                                !this.checkDiscountDisable(item.organisationId)
                                    ? this.addRemoveDiscount('remove', index)
                                    : null
                            }
                        >
                            <div className="pointer">
                                <span className="user-remove-btn">
                                    <i className="fa fa-trash-o" aria-hidden="true" />
                                </span>
                                <span className="user-remove-text mr-0">
                                    {AppConstants.remove}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead required="pt-0" heading="Discount Type" />
                                <Form.Item
                                    name={`competitionTypeDiscountTypeRefId${index}`}
                                    rules={[{
                                        required: true,
                                        message:
                                            ValidationConstants.pleaseSelectDiscountType,
                                    }]}
                                >
                                    <Select
                                        style={{
                                            width: '100%',
                                            paddingRight: 1,
                                            minWidth: 182,
                                        }}
                                        onChange={(discountTypeItem) =>
                                            this.onChangeMembershipProductDisType(discountTypeItem, index)
                                        }
                                        placeholder="Select"
                                        // value={item.competitionTypeDiscountTypeRefId !== 0 && item.competitionTypeDiscountTypeRefId}
                                        disabled={this.checkDiscountDisable(item.organisationId)}
                                    >
                                        {this.props.competitionFeesState.defaultDiscountType.map((discountTypeItem) => (
                                            <Option
                                                key={'discountType_' + discountTypeItem.id}
                                                value={discountTypeItem.id}
                                            >
                                                {discountTypeItem.description}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="col-sm">
                                <InputWithHead
                                    required="pt-0"
                                    heading={AppConstants.membershipProduct}
                                />
                                <Form.Item
                                    name={`membershipProductUniqueKey${index}`}
                                    rules={[{
                                        required: true,
                                        message:
                                            ValidationConstants.pleaseSelectMembershipProduct,
                                    }]}
                                >
                                    <Select
                                        style={{
                                            width: '100%',
                                            paddingRight: 1,
                                            minWidth: 182,
                                        }}
                                        placeholder="Select"
                                        // value={item.membershipProductUniqueKey}
                                        onChange={(item) => this.onChangeMembershipProduct(item, index)}
                                        disabled={this.checkDiscountDisable(item.organisationId)}
                                    >
                                        {membershipPrdArr && membershipPrdArr.membershipProducts && membershipPrdArr.membershipProducts.map((item) => (
                                            <Option
                                                key={'product_' + item.membershipProductUniqueKey}
                                                value={item.membershipProductUniqueKey}
                                            >
                                                {item.membershipProductName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>

                        <div>
                            <InputWithHead heading={AppConstants.membershipTypes} />
                            <Form.Item
                                name={`competitionMembershipProductTypeId${index}`}
                                rules={[{
                                    required: true,
                                    message:
                                        ValidationConstants.pleaseSelectMembershipTypes,
                                }]}
                            >
                                <Select
                                    style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                                    onChange={(discountMembershipType) =>
                                        this.onChangeMembershipTypeDiscount(
                                            discountMembershipType,
                                            index
                                        )
                                    }
                                    placeholder="Select"
                                    // value={item.competitionMembershipProductTypeId}
                                    disabled={this.checkDiscountDisable(item.organisationId)}
                                >
                                    {item.membershipProductTypes.map((item) => (
                                        <Option
                                            key={'productType_' + item.competitionMembershipProductTypeId}
                                            value={item.competitionMembershipProductTypeId}
                                        >
                                            {item.membershipProductTypeName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        {this.discountViewChange(item, index, getFieldDecorator)}
                    </div>
                ))}

                <span
                    className="input-heading-add-another"
                    onClick={() =>
                        !discountsDisable ? this.addRemoveDiscount('add', -1) : null
                    }
                >
                    + {AppConstants.addDiscount}
                </span>
            </div>
        );
    };

    //////delete the membership product
    showDeleteConfirm = () => {
        let competitionId = this.props.competitionFeesState.competitionId;
        let this_ = this;
        confirm({
            title: 'Are you sure delete this product?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                if (competitionId.length > 0) {
                    this_.deleteProduct(competitionId);
                }
            },
            onCancel() {
            },
        });
    };

    deleteProduct = (competitionId) => {
        this.setState({ loading: true, buttonPressed: 'delete' });
        this.props.regCompetitionListDeleteAction(competitionId);
    };

    buttonShowView() {
        if (this.state.isCreatorEdit) {
            return false;
        } else {
            return true;
        }
    }

    ////////next button view for navigation
    nextButtonView = () => {
        let tabKey = this.state.competitionTabKey;
        // let competitionId = this.props.competitionFeesState.competitionId;
        let isPublished = this.state.permissionState.isPublished;
        // let allDisable = this.state.permissionState.allDisable;
        return (
            <Button
                className="publish-button marginLeft24 margin-top-disabled-button"
                type="primary"
                // disabled={allDisable}
                htmlType="submit"
                onClick={() =>
                    this.setState({
                        statusRefId: (tabKey == '6' && isPublished) ? 3 : 2,
                        buttonPressed: tabKey == '6' ? 'register' : 'fees',
                    })
                }
            >
                {AppConstants.next}
            </Button>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let tabKey = this.state.competitionTabKey;
        let competitionId = this.props.competitionFeesState.competitionId;
        let isPublished = this.state.permissionState.isPublished;
        let allDisable = this.state.permissionState.allDisable;
        let invitees = this.props.competitionFeesState.competitionDetailData.invitees
        let directComp = isArrayNotEmpty(invitees) ? (invitees[0].registrationInviteesRefId == 5) : false
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    {this.buttonShowView() ? (
                        <div className="row">
                            <div className="col-sm">
                                <div className="reg-add-save-button">
                                    {competitionId && (
                                        <Tooltip
                                            style={{ height: '100%' }}
                                            onMouseEnter={() =>
                                                this.setState({
                                                    tooltipVisibleDelete: isPublished,
                                                })
                                            }
                                            onMouseLeave={() =>
                                                this.setState({ tooltipVisibleDelete: false })
                                            }
                                            visible={this.state.tooltipVisibleDelete}
                                            title={ValidationConstants.compIsPublished}
                                        >
                                            <Button
                                                disabled={isPublished}
                                                type="cancel-button"
                                                onClick={() => this.showDeleteConfirm()}
                                            >
                                                {AppConstants.delete}
                                            </Button>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Tooltip
                                        style={{ height: '100%' }}
                                        onMouseEnter={() =>
                                            this.setState({
                                                tooltipVisibleDraft: isPublished,
                                            })
                                        }
                                        onMouseLeave={() =>
                                            this.setState({ tooltipVisibleDraft: false })
                                        }
                                        visible={this.state.tooltipVisibleDraft}
                                        title={ValidationConstants.compIsPublished}
                                    >
                                        <Button
                                            className="save-draft-text"
                                            type="save-draft-text"
                                            disabled={isPublished}
                                            htmlType="submit"
                                            onClick={() =>
                                                this.setState({ statusRefId: 1, buttonPressed: 'save' })
                                            }
                                        >
                                            {AppConstants.saveAsDraft}
                                        </Button>
                                    </Tooltip>
                                    <Tooltip
                                        style={{ height: '100%' }}
                                        onMouseEnter={() =>
                                            this.setState({
                                                tooltipVisiblePublish: isPublished && (tabKey === '2' || tabKey === '3')
                                                    ? true
                                                    : allDisable,
                                            })
                                        }
                                        onMouseLeave={() =>
                                            this.setState({ tooltipVisiblePublish: false })
                                        }
                                        visible={this.state.tooltipVisiblePublish}
                                        title={ValidationConstants.compIsPublished}
                                    >
                                        <Button
                                            className="publish-button margin-top-disabled-button"
                                            style={{ display: "unset", width: "92.5px" }}
                                            type="primary"
                                            htmlType="submit"
                                            disabled={
                                                (tabKey === '1' || tabKey === '4' || tabKey === '5' || tabKey === '6')
                                                    ? allDisable
                                                    : isPublished
                                            }
                                            onClick={() =>
                                                this.setState({
                                                    statusRefId: tabKey == '6' && isPublished
                                                        ? 3
                                                        : tabKey == '6' ? 2 : 1,
                                                    buttonPressed: tabKey == '6' ? 'publish' : 'next',
                                                })
                                            }
                                        >
                                            {tabKey === '6' && !isPublished
                                                ? AppConstants.publish
                                                : tabKey === '6' && isPublished
                                                    ? AppConstants.save
                                                    : AppConstants.next}
                                        </Button>
                                    </Tooltip>
                                    {tabKey == '6' && directComp ? this.nextButtonView() : null}
                                </div>
                            </div>
                        </div>
                    ) : (
                            (tabKey == '4' || tabKey == '6') && (
                                <div className="row">
                                    <div className="col-sm">
                                        <div className="comp-buttons-view">
                                            <Button
                                                className="publish-button margin-top-disabled-button"
                                                type="primary"
                                                // disabled={allDisable}
                                                htmlType="submit"
                                                onClick={() =>
                                                    this.setState({
                                                        statusRefId: tabKey == '6' && isPublished ? 3 : 2,
                                                        // buttonPressed: "publish"
                                                        buttonPressed: tabKey == '6' ? 'publish' : 'next',
                                                    })
                                                }
                                            >
                                                {AppConstants.save}
                                            </Button>
                                            {this.nextButtonView()}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                </div>
            </div>
        );
    };

    tabCallBack = (key) => {
        let competitionId = this.props.competitionFeesState.competitionId;
        if (competitionId !== null && competitionId.length > 0) {
            this.setState({
                competitionTabKey: key,
                divisionState: key == '3',
            });
        }
        this.setDetailsFieldValue();
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />

                <InnerHorizontalMenu menu="registration" regSelectedKey="7" />

                <Layout>
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView()}

                        <Content>
                            <div className="tab-view" style={{ width: '75%' }}>
                                <Tabs
                                    activeKey={this.state.competitionTabKey}
                                    onChange={this.tabCallBack}
                                >
                                    <TabPane tab={AppConstants.details} key="1">
                                        <div className="tab-formView mt-5">
                                            {this.contentView()}
                                        </div>
                                        <div className="tab-formView mt-5">
                                            {this.regInviteesView()}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.membership} key="2">
                                        <div className="tab-formView mt-5">
                                            {this.membershipProductView()}
                                        </div>
                                        <div className="tab-formView mt-5">
                                            {this.membershipTypeView()}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.registrationDivisions} key="3">
                                        <div className="tab-formView">
                                            {this.divisionsView()}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.fees} key="4">
                                        <div className="tab-formView">
                                            {this.feesView()}
                                        </div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.payments} key="5">
                                        <div>
                                            {this.paymentOptionsView()}
                                        </div>
                                        {/* <div className="tab-formView">
                                            {this.charityVoucherView()}
                                        </div> */}
                                    </TabPane>
                                    <TabPane tab={AppConstants.discounts} key="6">
                                        <div className="tab-formView">
                                            {this.discountView()}
                                        </div>
                                        <div className="tab-formView">
                                            {this.voucherView()}
                                        </div>
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
    return bindActionCreators(
        {
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
            onInviteesSearchAction,
            registrationRestrictionTypeAction,
            fixtureTemplateRoundsAction,
            instalmentDateAction,
            paymentMethodsDefaultAction
        },
        dispatch
    );
}

function mapStateToProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState,
        competitionManagementState: state.CompetitionManagementState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationCompetitionFee);
