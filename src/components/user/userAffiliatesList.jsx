import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal } from "antd";
import './user.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import {
    getAffiliatesListingAction, getUreAction, getAffiliateToOrganisationAction,
    affiliateDeleteAction
} from
    "../../store/actions/userAction/userAction";
import { bindActionCreators } from "redux";
import AppImages from "../../themes/appImages";
import { getOrganisationData } from "../../util/sessionStorage";
const { Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;
let this_Obj = null;
const columns = [

    {
        title: 'Name',
        dataIndex: 'affiliateName',
        key: 'affiliateName',
        sorter: (a, b) => a.affiliateName.localeCompare(b.affiliateName),

    },
    {
        title: 'Affiliated To',
        dataIndex: 'affiliatedToName',
        key: 'affiliatedToName',
        sorter: (a, b) => a.affiliatedToName.localeCompare(b.affiliatedToName),
    },
    {
        title: 'Organisation Type',
        dataIndex: 'organisationTypeRefName',
        key: 'organisationTypeRefName',
        sorter: (a, b) => a.organisationTypeRefName.localeCompare(b.organisationTypeRefName),
    },
    {
        title: 'Contact 1',
        dataIndex: 'contact1Name',
        key: 'contact1Name',
        sorter: (a, b) => a.contact1Name.localeCompare(b.contact1Name),
    },
    {
        title: 'Contact 2',
        dataIndex: 'contact2Name',
        key: 'contact2Name',
        sorter: (a, b) => a.contact2Name.localeCompare(b.contact2Name),
    },
    {
        title: 'Status',
        dataIndex: 'statusRefName',
        key: 'statusRefName',
        sorter: (a, b) => a.statusRefName.localeCompare(b.statusRefName),
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, e) => (
            isUsed === false ? <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
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
                        <NavLink to={{ pathname: `/userEditAffiliates`, state: { affiliateOrgId: e.affiliateOrgId, orgTypeRefId: e.organisationTypeRefId } }} >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    {/* <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(e.affiliateId)}>
                        <span>Delete</span>
                    </Menu.Item> */}
                </SubMenu>
            </Menu> : null
        )
    }
];

class UserAffiliatesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData().organisationUniqueKey,
            affiliatedToOrgId: -1,
            organisationTypeRefId: -1,
            statusRefId: -1,
            deleteLoading: false,
        }
        this_Obj = this;
        // this.props.getUreAction();
        this.referenceCalls(this.state.organisationId);
        this.handleAffiliateTableList(1, this.state.organisationId, -1, -1, -1)
    }

    componentDidMount() {
        console.log("Component Did mount");
    }

    componentDidUpdate(nextProps) {
        console.log("Component componentDidUpdate");
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
        let filter =
        {
            organisationId: organisationId,
            affiliatedToOrgId: affiliatedToOrgId,
            organisationTypeRefId: organisationTypeRefId,
            statusRefId: statusRefId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        this.props.getAffiliatesListingAction(filter);
    };

    naviageToAffiliate = (e) => {
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
            okType: 'danger',
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
        console.log("affiliateId::" + affiliateId);
        this.props.affiliateDeleteAction(affiliateId)
        this.setState({ deleteLoading: true })
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            {/* <Breadcrumb.Item className="breadcrumb-product">User</Breadcrumb.Item> */}
                            <Breadcrumb.Item className="breadcrumb-add">Affiliates</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        let uniqueValues = [];
        if (affiliateToData.affiliatedTo != undefined) {
            uniqueValues = [...new Map(affiliateToData.affiliatedTo.map(obj => [obj["affiliatedToOrgId"], obj])).values()];
        }

        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm pb-3" >
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center" }} >
                                <span className='year-select-heading'>{AppConstants.affiliatedTo}</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 160 }}
                                    onChange={(e) => this.onChangeAffiliateTo(e)}
                                    value={this.state.affiliatedToOrgId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(uniqueValues || []).map((org, index) => (
                                        <Option key={org.affiliatedToOrgId} value={org.affiliatedToOrgId}>{org.affiliatedToOrgName}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm pb-3" >
                            <div style={{ width: "fit-content", display: "flex", flexDirection: "row", alignItems: "center" }} >
                                <span className='year-select-heading'>{AppConstants.organisationType}</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 160 }}
                                    onChange={(e) => this.onChangeOrganisationTypes(e)}
                                    value={this.state.organisationTypeRefId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(affiliateToData.organisationTypes || []).map((org, index) => (
                                        <Option key={org.id} value={org.id}>{org.name}</Option>
                                    ))}

                                </Select>
                            </div>
                        </div>
                        <div className="col-sm pb-3" >
                            <div style={{ width: "fit-content", display: "flex", flexDirection: "row", alignItems: "center" }} >
                                <span className='year-select-heading'>{AppConstants.status}</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 160 }}
                                    onChange={(e) => this.onChangeStatusRefId(e)}
                                    value={this.state.statusRefId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(affiliateToData.status || []).map((st, index) => (
                                        <Option key={st.id} value={st.id}>{st.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm add-affiliate-btn">
                            {
                                affiliateToData.isEligibleToAddAffiliate ?
                                    <div className="d-flex flex-row-reverse">
                                        <NavLink to={"/userAddAffiliates"}>
                                            <Button className='primary-add-product' type='primary'>+ {AppConstants.addAffiliate}</Button>
                                        </NavLink>
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        let userState = this.props.userState;
        let affiliates = userState.affiliateList;
        let total = userState.affiliateListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    {/* <Table className="home-dashboard-table" columns={columns} dataSource={affiliates} pagination={false}
                        onRow={(r) => ({onClick: () => this.naviageToAffiliate(r, this.state.organisationId)})}
                    /> */}
                    <Table className="home-dashboard-table"
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
                    />
                </div>
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let affiliateToData = this.props.userState.affiliateTo;
        return (
            <div>
                {
                    affiliateToData.isEligibleToAddAffiliate ?
                        <div className="d-flex flex-row-reverse">
                            <NavLink to={"/userAddAffiliates"}>
                                <Button className='primary-add-product' type='primary'>+ {AppConstants.addAffiliate}</Button>
                            </NavLink>
                        </div>
                        : null
                }
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu={"user"} userSelectedKey={"2"} />
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
        affiliateDeleteAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        userState: state.UserState
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)((UserAffiliatesList));
