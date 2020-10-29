import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout, Button, Table, Select, Input, Modal, Checkbox, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import AppConstants from "themes/appConstants";
import { isArrayNotEmpty } from "util/helpers";
import { umpireCompetitionListAction } from "store/actions/umpireAction/umpireCompetetionAction";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";
import { getUmpirePaymentData, updateUmpirePaymentData } from '../../store/actions/umpireAction/umpirePaymentAction'

import "./umpire.css";

const { Content, Footer } = Layout;
const { Option } = Select;
const { confirm } = Modal
let this_obj = null;

function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [
    {
        title: "First Name",
        dataIndex: "firstName",
        key: "First Name",
        sorter: true,
        render: (firstName, recod) => <span className="input-heading-add-another pt-0">{recod.user && recod.user.firstName}</span>
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "Last Name",
        sorter: true,
        render: (lastName, recod) => <span className="input-heading-add-another pt-0">{recod.user && recod.user.lastName}</span>
    },
    {
        title: "Match ID",
        dataIndex: "matchId",
        key: "matchId",
        sorter: (a, b) => tableSort(a, b, "matchId"),
        render: (matchId) => <span className="input-heading-add-another pt-0">{matchId}</span>
    },
    {
        title: "Verified By",
        dataIndex: "verifiedBy",
        key: "verifiedBy",
        sorter: (a, b) => tableSort(a, b, "verifiedBy"),
    },
    {
        title: "Make Payment",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => tableSort(a, b, "status"),
        render: (status) => <span>{status ? status : 'Unpaid'}</span>
    },
    {
        title: "Pay",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        render: (paymentStatus, record, index) => <Checkbox
            className="single-checkbox"
            checked={paymentStatus ? paymentStatus : false}
        // onChange={(e) => this_obj.props.updateUmpirePaymentData({ data: e.target.checked, key: "paymentStatus", index: index })}
        >
        </Checkbox>
    }
]

const data = []

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
            roasterLoad: false,
            compArray: []
        }
        this_obj = this
    }

    componentDidMount() {
        let { organisationId, } = JSON.parse(localStorage.getItem("setOrganisationData"))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, "USERS")
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading === true && this.props.umpireCompetitionState.onLoad === false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id
                let compData = compList.length > 0 && compList[0]

                const body =
                {
                    paging: {
                        offset: 0,
                        limit: 10,
                    },
                }

                // this.props.getUmpirePaymentData({ compId: firstComp, pagingBody: body })
                this.setState({ selectedComp: firstComp, loading: false })
            }
        }
    }

    handlePageChange = (page) => {
        let { sortBy, sortOrder } = this.state
        let offsetData = page ? 10 * (page - 1) : 0;
        this.setState({ offsetData });

        const body = {
            paging: {
                offset: offsetData,
                limit: 10,
            },
        };
        // this.props.getUmpirePaymentData({ compId: this.state.selectedComp, pagingBody: body })
    }



    contentView = () => {
        const { umpirePaymentList, onLoad, totalCount, currentPage } = this.props.umpirePaymentState
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={umpirePaymentList}
                        pagination={false}
                        rowKey={(record, index) => "umpirePayments" + record.matchId + index}
                    />
                </div>

                <div className="comp-dashboard-botton-view-mobile">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}>
                    </div>

                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            total={totalCount}
                            defaultPageSize={10}
                            onChange={this.handlePageChange}
                            current={currentPage}
                        />
                    </div>
                </div>
            </div>
        )
    }

    onChangeComp = (compID) => {
        let selectedComp = compID.comp;
        const body =
        {
            paging: {
                offset: 0,
                limit: 10,
            },
        }

        // this.props.getUmpirePaymentData({ compId: selectedComp, pagingBody: body })
        this.setState({ selectedComp });

    };

    showConfirm = () => {
        confirm({
            title: "Are you sure you want to make payments?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            mask: true,
            maskClosable: true,
            onOk() {

            },
            onCancel() {

            },
        });
    };

    headerView = () => (
        <div className="comp-player-grades-header-drop-down-view mt-4">
            <div className="fluid-width">
                <div className="row">
                    <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                        <span className="form-heading">
                            {AppConstants.umpirePayments}
                        </span>
                    </div>

                    <div
                        className="col-sm-8"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: "100%"
                        }}
                    >
                        <div className="row">
                            <div className="col-sm pt-1">
                                <div className="comp-product-search-inp-width">
                                    <Input
                                        className="product-reg-search-input"
                                        // onChange={(e) => this.onChangeSearchText(e)}
                                        placeholder="Search..."
                                        // onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                        prefix={
                                            <SearchOutlined
                                                style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                            // onClick={this.onClickSearchIcon}
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

    dropdownView = () => {
        const { paymentStatus } = this.props.umpirePaymentState
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []

        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width">
                    <div className="row">
                        {/* competition List */}
                        <div className="col-sm-3">
                            <div className="reg-filter-col-cont">
                                <span className="year-select-heading">{AppConstants.competition}:</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-3"
                                    style={{ minWidth: 200 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {competition.map((item) => (
                                        <Option key={'competition_' + item.id} value={item.id}>{item.longName}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>

                        <div className="col-sm">
                            <div
                                className="comp-dashboard-botton-view-mobile"
                                style={{
                                    width: "96.5%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                    alignContent: "center"
                                }}
                            >
                                <Checkbox
                                    className="single-checkbox"
                                    checked={paymentStatus}
                                // onChange={(e) => this.props.updateUmpirePaymentData({ data: e.target.checked, key: "allCheckBox" })}
                                >
                                    {"All"}
                                </Checkbox>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    footerView = () => (
        <div className="fluid-width paddingBottom56px">
            <div className="row">
                <div className="col-sm-3">
                    <div className="reg-add-save-button">
                        {/* <NavLink to="/competitionPlayerGrades"> */}
                        <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.cancel}</Button>
                        {/* </NavLink> */}
                    </div>
                </div>
                <div className="col-sm">
                    <div className="comp-buttons-view">
                        <Button className="publish-button save-draft-text" type="primary">
                            {AppConstants.save}
                        </Button>
                        {/* <NavLink to="/competitionCourtAndTimesAssign"> */}
                        <Button
                            onClick={this.showConfirm}
                            className="publish-button margin-top-disabled-button"
                            type="primary"
                        >
                            {AppConstants.submit}
                        </Button>
                        {/* </NavLink> */}
                    </div>
                </div>
            </div>
        </div>
    );

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="7" />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                    <Footer>
                        {this.footerView()}
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
        updateUmpirePaymentData
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePaymentState: state.UmpirePaymentState
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpirePayments);

