import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Breadcrumb, Button, Table, Input, Menu, Pagination, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import AppConstants from 'themes/appConstants';
import AppImages from 'themes/appImages';
import { getOrganisationData } from 'util/sessionStorage';
import { venuesListAction, venueDeleteAction } from 'store/actions/commonAction/commonAction';
import { clearVenueDataAction } from 'store/actions/competitionModuleAction/venueTimeAction';
import InnerHorizontalMenu from 'pages/innerHorizontalMenu';
import DashboardLayout from 'pages/dashboardLayout';

import './user.css';

const { Footer, Content } = Layout;
const { confirm } = Modal;
const { SubMenu } = Menu;
let this_Obj = null;

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

    this_Obj.setState({ sortBy, sortOrder });

    const filter = {
        searchText: this_Obj.state.searchText,
        organisationId: getOrganisationData().organisationUniqueKey,
        paging: {
            limit: 10,
            offset: this_Obj.state.offset,
        },
    };

    this_Obj.props.venuesListAction(filter, sortBy, sortOrder);
}

// listeners for sorting
const listeners = (key) => ({
    onClick: () => tableSort(key),
});

const columns = [
    {
        title: 'Venue Name',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        onHeaderCell: () => listeners('venueName'),
    },
    {
        title: 'Address1',
        dataIndex: 'street1',
        key: 'street1',
        sorter: true,
        onHeaderCell: () => listeners('address1'),
    },
    {
        title: 'Address2',
        dataIndex: 'street2',
        key: 'street2',
        sorter: true,
        onHeaderCell: () => listeners('address2'),
    },
    {
        title: 'Suburb',
        dataIndex: 'suburb',
        key: 'suburb',
        sorter: true,
        onHeaderCell: () => listeners('suburb'),
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        sorter: true,
        onHeaderCell: () => listeners('state'),
    },
    {
        title: 'Postal Code',
        dataIndex: 'postalCode',
        key: 'postalCode',
        sorter: true,
        onHeaderCell: () => listeners('postalCode'),
    },
    {
        title: 'Contact Number',
        dataIndex: 'contactNumber',
        key: 'contactNumber',
        sorter: true,
        onHeaderCell: () => listeners('contactNumber'),
    },
    {
        title: '# Of Courts',
        dataIndex: 'noOfCourts',
        key: 'noOfCourts',
        sorter: true,
        onHeaderCell: () => listeners('noOfCourts'),
    },
    {
        title: 'Action',
        dataIndex: 'isUsed',
        key: 'isUsed',
        render: (isUsed, e) => (
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
                        <NavLink
                            to={{
                                pathname: '/competitionVenueAndTimesEdit',
                                state: { venueId: e.id, key: AppConstants.venuesList, isUsed, isCreator: e.isCreator },
                            }}
                        >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(e.id)}>
                        <span>Delete</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        ),
    },
];

class VenuesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            deleteLoading: false,
            filter: null,
            organisationId: null,
            offset: 0,
            sortBy: null,
            sortOrder: null,
        };
        this_Obj = this;
    }

    async componentDidMount() {
        let { venueListActionObject } = this.props.commonReducerState;
        if (venueListActionObject) {
            const filter = venueListActionObject.data;
            const { data: { searchText }, sortBy, sortOrder } = venueListActionObject;
            await this.setState({ searchText, sortBy, sortOrder, filter });
            this.props.venuesListAction(filter, sortBy, sortOrder);
        } else {
            this.handleVenuesTableList(1, '');
        }
    }

    componentDidUpdate(nextProps) {
        let commonReducerState = this.props.commonReducerState;
        if (commonReducerState.onLoad === false && this.state.loading === true) {
            if (!commonReducerState.error) {
                this.setState({
                    loading: false,
                });
            }
        }

        if (commonReducerState.onLoad === false && this.state.deleteLoading === true) {
            if (!commonReducerState.error) {
                this.setState({
                    deleteLoading: false,
                });
                this.handleVenuesTableList(1, this.state.searchText);
            }
        }
    }

    handleVenuesTableList = (page, searchText) => {
        const offset = (page ? (10 * (page - 1)) : 0);
        const filter = {
            searchText,
            organisationId: getOrganisationData().organisationUniqueKey,
            paging: {
                limit: 10,
                offset,
            },
        };

        this.setState({
            searchText,
            organisationId: getOrganisationData().organisationUniqueKey,
            offset,
        });

        this.props.venuesListAction(filter, this.state.sortBy, this.state.sortOrder);
    };

    onKeyEnterSearchText = (e) => {
        const code = e.keyCode || e.which;
        if (code === 13) { // 13 is the enter keycode
            this.handleVenuesTableList(1, this.state.searchText);
        }
    };

    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value });
        if (!e.target.value) {
            this.handleVenuesTableList(1, e.target.value);
        }
    };

    onClickSearchIcon = () => {
        this.handleVenuesTableList(1, this.state.searchText);
    };

    showDeleteConfirm = (venueId) => {
        let this_ = this;
        confirm({
            title: 'Are you sure you want to delete this venue?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                this_.deleteVenue(venueId);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    deleteVenue = (venueId) => {
        const payload = { venueId };
        this.props.venueDeleteAction(payload);
        this.setState({ deleteLoading: true });
    };

    headerView = () => (
        <div className="comp-player-grades-header-view-design" style={{ marginBottom: 12 }}>
            <div className="row">
                <div className="col-sm d-flex align-content-center">
                    <Breadcrumb separator=" > ">
                        {/* <Breadcrumb.Item className="breadcrumb-product">User</Breadcrumb.Item> */}
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.venuesList}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div style={{ marginRight: '25px' }}>
                    <div className="reg-product-search-inp-width">
                        <Input
                            className="product-reg-search-input"
                            onChange={this.onChangeSearchText}
                            placeholder="Search..."
                            value={this.state.searchText}
                            onKeyPress={this.onKeyEnterSearchText}
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
                <div style={{ marginRight: '4.2%' }}>
                    <div
                        className="d-flex flex-row-reverse"
                        onClick={() => this.props.clearVenueDataAction('venue')}
                    >
                        <NavLink
                            to={{
                                pathname: '/competitionVenueAndTimesAdd',
                                state: { key: AppConstants.venuesList },
                            }}
                        >
                            <Button className="primary-add-product" type="primary">
                                + {AppConstants.addVenue}
                            </Button>
                        </NavLink>
                    </div>
                </div>
                {/*
                <div style={{ marginRight: "4.2%" }}>
                    <div className="comp-dashboard-botton-view-mobile">
                        <NavLink to="/venueImport" className="text-decoration-none">
                            <Button className="primary-add-comp-form" type="primary">
                                <div className="row">
                                    <div className="col-sm">
                                        <img
                                            src={AppImages.import}
                                            alt=""
                                            className="export-image"
                                        />
                                        {AppConstants.import}
                                    </div>
                                </div>
                            </Button>
                        </NavLink>
                    </div>
                </div>
                */}
            </div>
        </div>
    );

    searchView = () => (
        <div
            className="comp-player-grades-header-drop-down-view mt-1 d-flex justify-content-end"
            style={{ paddingRight: '4.3%' }}
        >
            <div className="fluid-width">
                <div className="row">
                    <div>
                        <div className="d-flex align-items-center w-100">
                            <button className="dashboard-lay-search-button" onClick={this.onClickSearchIcon}>
                                <img src={AppImages.searchIcon} height="15" width="15" alt="" />
                            </button>
                            {/* <form className="search-form"> */}
                            <div className="reg-product-search-inp-width">
                                <Input
                                    className="product-reg-search-input"
                                    onChange={this.onChangeSearchText}
                                    value={this.state.searchText}
                                    placeholder="Search..."
                                    onKeyPress={this.onKeyEnterSearchText}
                                    prefix={
                                        <SearchOutlined
                                            style={{ color: 'rgba(0,0,0,.25)', height: 16, width: 16 }}
                                        />
                                    }
                                />
                            </div>
                            {/* </form> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    contentView = () => {
        const commonReducerState = this.props.commonReducerState;
        const venuesList = commonReducerState.venuesList;
        const total = commonReducerState.venuesListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={venuesList}
                        pagination={false}
                        loading={this.props.commonReducerState.onLoad === true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={commonReducerState.venuesListPage}
                        total={total}
                        onChange={(page) => this.handleVenuesTableList(page, this.state.searchText)}
                    />
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />

                <InnerHorizontalMenu menu="home" userSelectedKey="2" />

                <Layout>
                    {this.headerView()}

                    <Content>
                        {/* {this.searchView()} */}
                        {this.contentView()}
                    </Content>

                    {/*
                    <Footer>
                        {this.footerView()}
                    </Footer>
                    */}
                </Layout>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        venuesListAction,
        venueDeleteAction,
        clearVenueDataAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        commonReducerState: state.CommonReducerState,
        venueTimeState: state.VenueTimeState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(VenuesList);
