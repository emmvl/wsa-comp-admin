import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal } from "antd";
import './user.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import {
    getAffiliatesListingAction, getUreAction, getAffiliateToOrganisationAction, affiliateDeleteAction,
} from "../../store/actions/userAction/userAction";
import { bindActionCreators } from "redux";
import AppImages from "../../themes/appImages";
import { getOrganisationData } from "../../util/sessionStorage";
const { Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;
let this_Obj = null;

/////function to sort table column
function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }

    let filterData = {
        organisationId: this_Obj.state.organisationId,
        affiliatedToOrgId: this_Obj.state.affiliatedToOrgId,
        organisationTypeRefId: this_Obj.state.organisationTypeRefId,
        statusRefId: this_Obj.state.statusRefId,
        paging: {
            limit: 10,
            offset: (this_Obj.state.pageNo ? (10 * (this_Obj.state.pageNo - 1)) : 0)
        },
        stateOrganisations: false,
    }
    this_Obj.setState({ sortBy, sortOrder });
    this_Obj.props.getAffiliatesListingAction(filterData, sortBy, sortOrder);
}
const listeners = (key) => ({
    onClick: () => tableSort(key),
});
const columns = [
    {
        title: 'Name',
        dataIndex: 'affiliateName',
        key: 'affiliateName',
        sorter: true,
        onHeaderCell: () => listeners('name'),

    },
    {
        title: 'Affiliated To',
        dataIndex: 'affiliatedToName',
        key: 'affiliatedToName',
        sorter: true,
        onHeaderCell: () => listeners('affiliatedTo'),
    },
    {
        title: 'Organisation Type',
        dataIndex: 'organisationTypeRefName',
        key: 'organisationTypeRefName',
        sorter: true,
        onHeaderCell: () => listeners('organisationType'),
    },
    {
        title: 'Contact 1',
        dataIndex: 'contact1Name',
        key: 'contact1Name',
        sorter: false,
        // onHeaderCell: () => listeners('contact1'),
    },
    {
        title: 'Contact 2',
        dataIndex: 'contact2Name',
        key: 'contact2Name',
        sorter: false,
        // onHeaderCell: () => listeners('contact2'),
    },
    {
        title: 'Status',
        dataIndex: 'statusRefName',
        key: 'statusRefName',
        sorter: true,
        onHeaderCell: () => listeners('status'),
    },
    {
        title: 'Action',
        dataIndex: 'isUsed',
        key: 'isUsed',
        render: (isUsed, e) => (
            isUsed === false && (
                <Menu
                    className="action-triple-dot-submenu"
                    theme="light"
                    mode="horizontal"
                    style={{ lineHeight: '25px' }}
                >
                    <SubMenu
                        key="sub1"
                        title={
                            <img
                                className="dot-image"
                                src={AppImages.moreTripleDot}
                                alt=""
                                width="16"
                                height="16"
                            />
                        }
                    >
                        <Menu.Item key="1">
                            <NavLink to={{ pathname: '/userEditAffiliates', state: { affiliateOrgId: e.affiliateOrgId, orgTypeRefId: e.organisationTypeRefId } }}>
                                <span>Edit</span>
                            </NavLink>
                        </Menu.Item>
                        {/* <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(e.affiliateId)}>
                            <span>Delete</span>
                        </Menu.Item> */}
                    </SubMenu>
                </Menu>
            )
        ),
    },
];

class UserAffiliatesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            affiliatedToOrgId: -1,
            organisationTypeRefId: -1,
            statusRefId: -1,
            deleteLoading: false,
            pageNo: 1,
            sortBy: null,
            sortOrder: null,
            offsetData: 0,
        };
        this_Obj = this;
        // this.props.getUreAction();
        this.referenceCalls(this.state.organisationId);
    }

    async componentDidMount() {
        const { userAffiliateListAction } = this.props.userState
        let page = 1
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (userAffiliateListAction) {
            let offsetData = userAffiliateListAction.payload.paging.offset
            sortBy = userAffiliateListAction.sortBy
            sortOrder = userAffiliateListAction.sortOrder
            let affiliatedToOrgId = userAffiliateListAction.payload.affiliatedToOrgId
            let organisationTypeRefId = userAffiliateListAction.payload.organisationTypeRefId
            let statusRefId = userAffiliateListAction.payload.statusRefId

            await this.setState({ offsetData, sortBy, sortOrder, affiliatedToOrgId, statusRefId, organisationTypeRefId })
            page = Math.floor(offsetData / 10) + 1;
        }
        this.handleAffiliateTableList(page, this.state.organisationId, this.state.affiliatedToOrgId, this.state.organisationTypeRefId, this.state.statusRefId)
    }

    componentDidUpdate(nextProps) {
        let userState = this.props.userState;
        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({
                    loading: false,
                })
            }
        }

        if (userState.onLoad === false && this.state.deleteLoading === true) {
            if (!userState.error) {
                this.setState({
                    deleteLoading: false,
                });
                this.handleAffiliateTableList(1, this.state.organisationId, -1, -1, -1)
            }
        }
    }

    referenceCalls = (organisationId) => {
        this.props.getAffiliateToOrganisationAction(organisationId);
    }

    handleAffiliateTableList = (page, organisationId, affiliatedToOrgId, organisationTypeRefId, statusRefId) => {
        this.setState({
            pageNo: page
        })
        let filter = {
            organisationId: organisationId,
            affiliatedToOrgId: affiliatedToOrgId,
            organisationTypeRefId: organisationTypeRefId,
            statusRefId: statusRefId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : this.state.offsetData)
            },
            stateOrganisations: false,
        }
        this.props.getAffiliatesListingAction(filter, this.state.sortBy, this.state.sortOrder);
    };

    navigateToAffiliate = (e) => {
        this.props.history.push("/userEditAffiliates", { affiliateOrgId: e.affiliateOrgId, orgTypeRefId: e.organisationTypeRefId })
    }

    onChangeOrganisationTypes = (e) => {
        this.setState({ organisationTypeRefId: e })
        this.handleAffiliateTableList(1, this.state.organisationId, this.state.affiliatedToOrgId, e, this.state.statusRefId);
    }

    onChangeAffiliateTo = (e) => {
        this.setState({ affiliatedToOrgId: e })
        this.handleAffiliateTableList(1, this.state.organisationId, e, this.state.organisationTypeRefId, this.state.statusRefId);
    }

    onChangeStatusRefId = (e) => {
        this.setState({ statusRefId: e })
        this.handleAffiliateTableList(1, this.state.organisationId, this.state.affiliatedToOrgId, this.state.organisationTypeRefId, e);
    }

    showDeleteConfirm = (affiliateId) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this affiliate?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                this_.deleteAffiliate(affiliateId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    deleteAffiliate = (affiliateId) => {
        this.props.affiliateDeleteAction(affiliateId)
        this.setState({ deleteLoading: true })
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm d-flex align-items-center">
                        <Breadcrumb separator=" > ">
                            {/* <Breadcrumb.Item className="breadcrumb-product">User</Breadcrumb.Item> */}
                            <Breadcrumb.Item className="breadcrumb-add">Affiliates</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        )
    }

    dropdownView = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
        if (affiliateToData.affiliatedTo != undefined) {
            uniqueValues = [...new Map(affiliateToData.affiliatedTo.map(obj => [obj["affiliatedToOrgId"], obj])).values()];
        }

        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="d-flex align-items-center w-100">
                                <span className="year-select-heading" style={{ width: 120 }}>{AppConstants.affiliatedTo}</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 160 }}
                                    onChange={(e) => this.onChangeAffiliateTo(e)}
                                    value={this.state.affiliatedToOrgId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(uniqueValues || []).map((org) => (
                                        <Option
                                            key={'organization_' + org.affiliatedToOrgId}
                                            value={org.affiliatedToOrgId}
                                        >
                                            {org.affiliatedToOrgName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="d-flex align-items-center">
                                <span className="year-select-heading" style={{ width: 240 }}>{AppConstants.organisationType}</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 160 }}
                                    onChange={(e) => this.onChangeOrganisationTypes(e)}
                                    value={this.state.organisationTypeRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(affiliateToData.organisationTypes || []).map((org) => (
                                        <Option key={`organizationTyp_${org.id}`} value={org.id}>{org.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="d-flex align-items-center">
                                <span className="year-select-heading" style={{ width: 120 }}>{AppConstants.status}</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 160 }}
                                    onChange={(e) => this.onChangeStatusRefId(e)}
                                    value={this.state.statusRefId}
                                >
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(affiliateToData.status || []).map((st) => (
                                        <Option key={`status_${st.id}`} value={st.id}>{st.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 add-affiliate-btn">
                            {affiliateToData.isEligibleToAddAffiliate && (
                                <div className="d-flex flex-row-reverse">
                                    <NavLink to="/userAddAffiliates">
                                        <Button className="primary-add-product" type="primary">+ {AppConstants.addAffiliate}</Button>
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        let userState = this.props.userState;
        let affiliates = userState.affiliateList;
        let total = userState.affiliateListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    {/* <Table className="home-dashboard-table" columns={columns} dataSource={affiliates} pagination={false}
                        onRow={(r) => ({onClick: () => this.navigateToAffiliate(r, this.state.organisationId)})}
                    /> */}
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={affiliates}
                        pagination={false}
                        loading={this.props.userState.onLoad === true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.affiliateListPage}
                        total={total}
                        onChange={(page) => this.handleAffiliateTableList(page, this.state.organisationId, this.state.affiliatedToOrgId, this.state.organisationTypeRefId, this.state.statusRefId)}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    }

    // footer view containing all the buttons like submit and cancel
    footerView = () => {
        const affiliateToData = this.props.userState.affiliateTo;
        return (
            <div>
                {affiliateToData.isEligibleToAddAffiliate && (
                    <div className="d-flex flex-row-reverse">
                        <NavLink to="/userAddAffiliates">
                            <Button className="primary-add-product" type="primary">+ {AppConstants.addAffiliate}</Button>
                        </NavLink>
                    </div>
                )}
            </div>
        );
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu="user" userSelectedKey="2" />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                    {/* <Footer>
                        {this.footerView()}
                    </Footer> */}
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAffiliatesListingAction,
        getUreAction,
        getAffiliateToOrganisationAction,
        affiliateDeleteAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userState: state.UserState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAffiliatesList);
