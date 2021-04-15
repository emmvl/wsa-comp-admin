import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Button, Table, Select, Input, Modal, Checkbox, Pagination, Tooltip, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import AppConstants from 'themes/appConstants';
import { isArrayNotEmpty } from 'util/helpers';
import { umpireCompetitionListAction } from 'store/actions/umpireAction/umpireCompetetionAction';
import InnerHorizontalMenu from 'pages/innerHorizontalMenu';
import DashboardLayout from 'pages/dashboardLayout';
import {
    getUmpirePaymentData,
    updateUmpirePaymentData,
    umpirePaymentTransferData,
    setPageSizeAction,
    setPageNumberAction,
} from '../../store/actions/umpireAction/umpirePaymentAction'
import {
    // getUmpireCompetiton,
    setUmpireCompition,
    getOrganisationData,
    setUmpireCompitionData,
    // getUmpireCompetitonData,
    // getLiveScoreUmpireCompition,
    // getLiveScoreUmpireCompitionData,
    setLiveScoreUmpireCompition,
    setLiveScoreUmpireCompitionData,
    // getPrevUrl,
} from 'util/sessionStorage';
import './umpire.css';
import Loader from '../../customComponents/loader';
import AppImages from "themes/appImages";
import moment from "moment";
import { exportFilesAction } from "store/actions/umpireAction/umpirePaymentAction";
import { isEqual } from 'lodash';
const { Content, Footer } = Layout;
const { Option } = Select;
const { confirm } = Modal
let this_obj = null;

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    const { pageSize = 10 } = this_obj.props.umpirePaymentState;
    const body = {
        paging: {
            limit: pageSize,
            offset: this_obj.state.offsetData,
        },
    };
    this_obj.setState({ sortBy, sortOrder });
    if (this_obj.state.selectedComp) this_obj.props.getUmpirePaymentData({ compId: this_obj.state.selectedComp, pagingBody: body, search: this_obj.state.searchText, sortBy: sortBy, sortOrder: sortOrder })
}

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [
    {
        title: AppConstants.firstName,
        dataIndex: 'firstName',
        key: 'First Name',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) => (
            <NavLink
                to={{
                    pathname: '/userPersonal',
                    state: {
                        userId: record.userId,
                        screenKey: 'umpire',
                        screen: '/umpirePayment',
                    },
                }}
            >
                {record.user && (
                    <span className="input-heading-add-another pt-0">{record.user.firstName}</span>
                )}
            </NavLink>
        ),
    },
    {
        title: AppConstants.lastName,
        dataIndex: 'lastName',
        key: 'Last Name',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (lastName, record) => (
            <NavLink
                to={{
                    pathname: '/userPersonal',
                    state: {
                        userId: record.userId,
                        screenKey: 'umpire',
                        screen: '/umpirePayment',
                    },
                }}
            >
                {record.user && (
                    <span className="input-heading-add-another pt-0">{record.user.lastName}</span>
                )}
            </NavLink>
        ),
    },
    {
        title: AppConstants.tableMatchID,
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (matchId) => (
            <NavLink
                to={{
                    pathname: '/matchDayMatchDetails',
                    state: { matchId, umpireKey: 'umpire', screenName: 'umpirePayment' },
                }}
            >
                <span className="input-heading-add-another pt-0">{matchId}</span>
            </NavLink>
        ),
    },
    {
        title: AppConstants.verifiedBy,
        dataIndex: 'verifiedBy',
        key: 'verifiedBy',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: AppConstants.status,
        dataIndex: 'makePayment',
        key: 'paymentStatus',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (paymentStatus, record) => {
            let status = record.paymentStatus
            const capitalized = status.replace(/^./, status[0].toUpperCase());
            return (
                <span>{capitalized}</span>
            )
        }
    },
    {
        title: AppConstants.timeDatePaid,
        dataIndex: 'approved_at',
        key: "approved_at",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (approved_at, record) => {
            return (
                approved_at &&
                <span>{moment(approved_at).format("DD/MM/YYYY HH:mm")}</span>
            )
        }
    },
    {
        title: "Authoriser",
        dataIndex: "approvedByUser",
        key: "approvedByUser",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (approvedByUser, record) => {
            return (
                approvedByUser &&
                <span>{approvedByUser.firstName + " " + approvedByUser.lastName}</span>
            )
        }
    },
    {
        title: AppConstants.pay,
        dataIndex: 'selectedValue',
        key: 'selectedValue',
        render: (selectedValue, record, index) => {
            return (
                ((record.user && record.user.stripeAccountId) || record.paymentStatus === 'paid') ? (
                    <Checkbox
                        className="single-checkbox"
                        checked={selectedValue}
                        disabled={record.paymentStatus === 'paid'}
                        onChange={(e) => this_obj.props.updateUmpirePaymentData({ data: e.target.checked, key: 'selectedValue', index, allData: record })}
                    />
                ) : (
                        <Tooltip
                            title="Please ask the user to set up their bank details"
                            placement="left"
                            trigger='hover'
                            autoAdjustOverflow
                            arrowPointAtCenter
                        >
                            <Checkbox className="single-checkbox" disabled />
                        </Tooltip>
                    )
            )
        }
    }
]

class UmpirePayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionid: null,
            searchText: "",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            year: "2019",
            rosterLoad: false,
            compArray: [],
            sortBy: null,
            sortOrder: null,
            offsetData: 0,
            paymentLoad: false
        }
        this_obj = this
    }

    isBecsSetupDone = () => {
        const orgData = getOrganisationData();
        const becsMandateId = orgData ? orgData.stripeBecsMandateId : null;
        return becsMandateId;
    }

    async componentDidMount() {
        if (!this.isBecsSetupDone()) {
            this.props.history.push("/orgBecsSetup");
        }
        let { organisationId, } = JSON.parse(localStorage.getItem("setOrganisationData"))
        this.props.umpireCompetitionListAction(null, null, organisationId, "USERS")
        const { umpirePaymentObject } = this.props.umpirePaymentState
        let page = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (umpirePaymentObject) {
            let selectedComp = umpirePaymentObject.data.compId
            let offset = umpirePaymentObject.data.pagingBody.paging.offset
            let searchText = umpirePaymentObject.data.search
            sortBy = umpirePaymentObject.data.sortBy
            sortOrder = umpirePaymentObject.data.sortOrder
            await this.setState({ offset, searchText, sortBy, sortOrder, selectedComp })
            const { pageSize = 10 } = this.props.umpirePaymentState;
            page = Math.floor(offset / pageSize) + 1;

            this.handlePageChange(page)
        } else {
            this.setState({ loading: true })
        }
    }

    componentDidUpdate(nextProps) {
        if (!isEqual(nextProps.umpireCompetitionState, this.props.umpireCompetitionState)) {
            if (this.state.loading === true && this.props.umpireCompetitionState.onLoad === false) {
                let compList = (this.props.umpireCompetitionState.umpireComptitionList 
                    && isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList)) 
                    ? this.props.umpireCompetitionState.umpireComptitionList : [];
                let firstComp = (compList && compList.length && compList[0].id) ? compList[0].id : 0;

                let compKey = (compList && compList.length) ? compList[0].competitionUniqueKey: null;
                let { sortBy, sortOrder, searchText } = this.state
                const { pageSize = 10 } = this.props.umpirePaymentState;

                const body = {
                    paging: {
                        offset: 0,
                        limit: pageSize,
                    },
                }

                if (firstComp) this.props.getUmpirePaymentData({ compId: firstComp, pagingBody: body, search: searchText, sortBy: sortBy, sortOrder: sortOrder })

                this.setState({
                    selectedComp: firstComp,
                    loading: false,
                    competitionUniqueKey: compKey,
                    compArray: compList,
                    venueLoad: true,
                });
            }
        }

        if (this.state.paymentLoad == true && this.props.umpirePaymentState.onPaymentLoad === false) {
            const { pageSize = 10 } = this.props.umpirePaymentState;
            const body = {
                paging: {
                    offset: 0,
                    limit: pageSize,
                },
            }
            if (this.state.selectedComp) this.props.getUmpirePaymentData({ compId: this.state.selectedComp, pagingBody: body, search: this.state.searchText, sortBy: this.state.sortBy, sortOrder: this.state.sortOrder })
            this.setState({ paymentLoad: false })
        }
    }

    changeHover(record, index, onHoverValue) {
        this.props.updateUmpirePaymentData({ data: onHoverValue, key: "hoverVisible", index: index })
    }

    handleShowSizeChange = async (page, pageSize) => {
        await this.props.setPageSizeAction(pageSize);
        this.handlePageChange(page);
    }

    handlePageChange = async (page) => {
        await this.props.setPageNumberAction(page);
        let { sortBy, sortOrder, searchText } = this.state
        const { pageSize = 10 } = this.props.umpirePaymentState;
        let offsetData = page ? pageSize * (page - 1) : 0;
        this.setState({ offsetData });

        const body = {
            paging: {
                offset: offsetData,
                limit: pageSize,
            },
        };
        if (this.state.selectedComp) {
            this.props.getUmpirePaymentData({ compId: this.state.selectedComp, pagingBody: body, search: searchText, sortBy: sortBy, sortOrder: sortOrder });
        }
    }

    contentView = () => {
        const { umpirePaymentList, onLoad, totalCount, currentPage, pageSize } = this.props.umpirePaymentState
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={onLoad || this.props.umpireCompetitionState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={umpirePaymentList}
                        pagination={false}
                        rowKey={(record) => `umpirePayments${record.matchId}${record.userId}`}
                    />
                </div>

                <div className="comp-dashboard-botton-view-mobile">
                    <div className="comp-dashboard-botton-view-mobile d-flex align-items-center justify-content-end w-100" />

                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination pb-2"
                            showSizeChanger
                            current={currentPage}
                            total={totalCount}
                            defaultCurrent={totalCount}
                            defaultPageSize={pageSize}
                            onChange={this.handlePageChange}
                            onShowSizeChange={this.handleShowSizeChange}                            
                        />
                    </div>
                </div>
            </div>
        )
    }

    onChangeComp = (compID) => {
        let selectedComp = compID ? compID.comp : 0;
        const { searchText, sortBy, sortOrder } = this.state;
        const { pageSize = 10 } = this.props.umpirePaymentState
        const body = {
            paging: {
                offset: 0,
                limit: pageSize,
            },
        }

        if (selectedComp) this.props.getUmpirePaymentData({ compId: selectedComp, pagingBody: body, search: searchText, sortBy: sortBy, sortOrder: sortOrder })
        this.setState({ selectedComp });

        let compObj = null;
        for (let i in this.state.compArray) {
            if (compID.comp === this.state.compArray[i].id) {
                compObj = this.state.compArray[i];
                break;
            }
        }

        setUmpireCompition(selectedComp);
        setUmpireCompitionData(JSON.stringify(compObj));

        setLiveScoreUmpireCompition(selectedComp);
        setLiveScoreUmpireCompitionData(JSON.stringify(compObj));
    };

    showConfirm = () => {
        confirm({
            title: AppConstants.makePaymentsConfirm,
            okText: AppConstants.yes,
            okType: AppConstants.primary,
            cancelText: AppConstants.no,
            mask: true,
            maskClosable: true,
            onOk() {
                this_obj.umpireTransferData(1)
            },
            onCancel() {

            },
        });
    };

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value, offsetData: 0 });

        const { selectedComp, sortBy, sortOrder, offsetData } = this.state;
        if (e.target.value === null || e.target.value === '') {
            const { pageSize = 10 } = this.props.umpirePaymentState;
            const body = {
                paging: {
                    offset: offsetData,
                    limit: pageSize,
                },
            };
            if (selectedComp) this.props.getUmpirePaymentData({ compId: selectedComp, pagingBody: body, search: e.target.value, sortBy: sortBy, sortOrder: sortOrder })
        }
    };

    // search key
    onKeyEnterSearchText = (e) => {
        this.setState({ offsetData: 0 });
        const { sortBy, sortOrder, searchText, offsetData, selectedComp } = this.state;
        const code = e.keyCode || e.which;
        if (code === 13) { // 13 is the enter keycode
            const { pageSize = 10} = this.props.umpirePaymentState;
            const body = {
                paging: {
                    offset: offsetData,
                    limit: pageSize,
                },
            };
            if (selectedComp) this.props.getUmpirePaymentData({ compId: selectedComp, pagingBody: body, search: searchText, sortBy, sortOrder })
        }
    };

    // on click of search icon
    onClickSearchIcon = () => {
        this.setState({ offsetData: 0 });
        const { sortBy, sortOrder, searchText, offsetData, selectedComp } = this.state;
        if (searchText === null || searchText === '') {
        } else {
            const { pageSize = 10 } = this.props.umpirePaymentState;
            const body = {
                paging: {
                    offset: offsetData,
                    limit: pageSize,
                },
            };
            if (selectedComp) this.props.getUmpirePaymentData({ compId: selectedComp, pagingBody: body, search: searchText, sortBy, sortOrder })
        }
    };

    headerView = () => (
        <div className="comp-player-grades-header-drop-down-view mt-4">
            <div className="fluid-width">
                <div className="row">
                    <div className="col-sm pt-1 d-flex align-content-center">
                        <span className="form-heading">
                            {AppConstants.umpirePayments}
                        </span>
                    </div>

                    <div className="col-sm-8 d-flex align-items-center justify-content-end w-100">
                        <div className="row">
                            <div className="col-sm pt-1">
                                <div className="comp-product-search-inp-width">
                                    <Input
                                        className="product-reg-search-input"
                                        onChange={(e) => this.onChangeSearchText(e)}
                                        placeholder="Search..."
                                        onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                        value={this.state.searchText}
                                        prefix={
                                            <SearchOutlined
                                                style={{ color: 'rgba(0,0,0,.25)', height: 16, width: 16 }}
                                                onClick={this.onClickSearchIcon}
                                            />
                                        }
                                        allowClear
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

    onExport = () => {
        let url = AppConstants.umpirePaymentExport + `competitionId=${this.state.selectedComp}`;
        this.props.exportFilesAction(url);
    };


    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        const { paymentStatus, onLoad} = this.props.umpirePaymentState
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        let isCompetitionAvailable = this.state.selectedComp ? false : true
        return (
            <div className="comp-player-grades-header-drop-down-view comp">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div style={{
                                width: '100%',
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                                <span className="year-select-heading">{AppConstants.competition}:</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-3"
                                    style={{ minWidth: 200, maxWidth: 250 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp || ""}
                                    loading={this.props.umpireCompetitionState.onLoad}
                                >
                                    {competition.map((item) => (
                                        <Option key={`competition_${item.id}`} value={item.id}>{item.longName}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm mr-5" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button
                                type="primary"
                                className="primary-add-comp-form button-margin-top-ump-payment mr-5"
                                onClick={this.onExport}
                                disabled={isCompetitionAvailable}
                            >
                                <div className="row">
                                    <div className="col-sm">
                                        <img
                                            className="export-image"
                                            src={AppImages.export}
                                            alt=""
                                        />
                                        {AppConstants.export}
                                    </div>
                                </div>
                            </Button>

                            <div
                                className="comp-dashboard-botton-view-mobile pb-3"
                            >
                                <Checkbox
                                    className="single-checkbox"
                                    checked={paymentStatus}
                                    disabled={onLoad || this.props.umpireCompetitionState.onLoad}
                                    onChange={(e) => this.props.updateUmpirePaymentData({ data: e.target.checked, key: 'allCheckBox' })}
                                >
                                    All
                                </Checkbox>
                            </div>
                        </div>

                        {/* <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-end' }} >
                            <div
                                className="comp-dashboard-botton-view-mobile"
                                style={{
                                    width: "fit-content",
                                    // marginRight: 30
                                    // display: 'contents',
                                    // display: "flex",
                                    // flexDirection: "column",
                                    // alignItems: "flex-end",
                                    // justifyContent: "flex-end",
                                    // alignContent: "center",
                                    // paddingRight: "35px"
                                }}
                            >
                                <Checkbox
                                    className="single-checkbox"
                                    checked={paymentStatus}
                                    onChange={(e) => this.props.updateUmpirePaymentData({ data: e.target.checked, key: 'allCheckBox' })}
                                >
                                    All
                                </Checkbox>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }

    umpireTransferData(statusId) {
        const { paymentTransferPostData } = this.props.umpirePaymentState;

        let data = {
            statusId: statusId,
            organisationUniqueKey: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            transfers: paymentTransferPostData,
        };

        if (paymentTransferPostData.length > 0) {
            this.props.umpirePaymentTransferData({ postData: data })
            this.setState({ paymentLoad: true })
        } else {
            message.config({
                duration: 1.5,
                maxCount: 1,
            });
            message.error('Please select an Umpire for the payment.');
        }
    }

    footerView = () => {
        const { paymentTransferPostData } = this.props.umpirePaymentState
        return (
            <div className="fluid-width paddingBottom56px">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <Button
                                onClick={() => this.props.updateUmpirePaymentData({ data: null, key: 'clearData' })}
                                className="cancelBtnWidth"
                                type="cancel-button"
                            >
                                {AppConstants.cancel}
                            </Button>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button onClick={() => this.umpireTransferData(0)} className="publish-button save-draft-text" type="primary">
                                {AppConstants.save}
                            </Button>
                            <Button
                                onClick={paymentTransferPostData.length > 0 ? this.showConfirm : () => this.umpireTransferData(1)}
                                className="publish-button margin-top-disabled-button"
                                type="primary"
                            >
                                {AppConstants.submit}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const {
            umpirePaymentList,
            // umpirePaymentObject
        } = this.props.umpirePaymentState
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="7" />
                <Loader visible={this.props.umpirePaymentState.onPaymentLoad} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                    <Footer>
                        {umpirePaymentList.length > 0 && this.footerView()}
                    </Footer>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        getUmpirePaymentData,
        updateUmpirePaymentData,
        umpirePaymentTransferData,
        exportFilesAction,
        setPageSizeAction,
        setPageNumberAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePaymentState: state.UmpirePaymentState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePayments);
