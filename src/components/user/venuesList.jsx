import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Input, Icon, Menu, Pagination, Modal } from "antd";
import './user.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { venuesListAction, venueDeleteAction } from
    "../../store/actions/commonAction/commonAction";
import { clearVenueDataAction } from '../../store/actions/competitionModuleAction/venueTimeAction'
import { bindActionCreators } from "redux";
import AppImages from "../../themes/appImages";
import { getOrganisationData } from "../../util/sessionStorage";


const { Footer, Content } = Layout;
const { confirm } = Modal;
const { SubMenu } = Menu;
let this_Obj = null;

//listeners for sorting
const listeners = (key) => ({
    onClick: () => tableSort(key),
});

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

    let filter =
    {
        searchText: this_Obj.state.searchText,
        organisationId: getOrganisationData().organisationUniqueKey,
        paging: {
            limit: 10,
            offset: this_Obj.state.offset
        }
    }

    this_Obj.props.venuesListAction(filter, sortBy, sortOrder);
}


const columns = [

    {
        title: 'Venue Name',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('venueName'),
    },
    {
        title: 'Address1',
        dataIndex: 'street1',
        key: 'street1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('address1'),
    },
    {
        title: 'Address2',
        dataIndex: 'street2',
        key: 'street2',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('address2'),
    },
    {
        title: 'Suburb',
        dataIndex: 'suburb',
        key: 'suburb',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('suburb'),
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('state'),
    },
    {
        title: 'Postal Code',
        dataIndex: 'postalCode',
        key: 'postalCode',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('postalCode'),
    },
    {
        title: 'Contact Number',
        dataIndex: 'contactNumber',
        key: 'contactNumber',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('contactNumber'),
    },
    {
        title: '# of Courts',
        dataIndex: 'noOfCourts',
        key: 'noOfCourts',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('noOfCourts'),
    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, e) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={<img className="dot-image" src={AppImages.moreTripleDot}
                        alt="" width="16" height="16" />}>
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: `/competitionVenueAndTimesEdit`, state: { venueId: e.id, key: AppConstants.venuesList, isUsed: isUsed } }} >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(e.id)}>
                        <span>Delete</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
];

class VenuesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            deleteLoading: false,
            filter: null,
            organisationId: null,
            offset: 0
        }
        this_Obj = this;
        this.handleVenuesTableList(1, "");
    }

    componentDidMount() {
        console.log("Component Did mount");
    }

    componentDidUpdate(nextProps) {
        console.log("Component componentDidUpdate");
        let commonReducerState = this.props.commonReducerState;
        if (commonReducerState.onLoad === false && this.state.loading === true) {
            if (!commonReducerState.error) {
                this.setState({
                    loading: false,
                })
            }
        }

        if (commonReducerState.onLoad === false && this.state.deleteLoading === true) {
            if (!commonReducerState.error) {
                this.setState({
                    deleteLoading: false,
                });
                this.handleVenuesTableList(1, this.state.searchText)
            }
        }
    }

    handleVenuesTableList = (page, searchText) => {

        let offset = (page ? (10 * (page - 1)) : 0)
        let filter =
        {
            searchText: searchText,
            organisationId: getOrganisationData().organisationUniqueKey,
            paging: {
                limit: 10,
                offset: offset
            }
        }

        this.setState({ searchText: searchText, organisationId: getOrganisationData().organisationUniqueKey, offset: offset })
        this.props.venuesListAction(filter);
    };

    naviageToVenue = (e) => {
        this.props.clearVenueDataAction();
        this.props.history.push("/venueEdit", { venueId: e.id })
    }

    onKeyEnterSearchText = (e) => {
        var code = e.keyCode || e.which;
        if (code === 13) { //13 is the enter keycode
            this.handleVenuesTableList(1, this.state.searchText);
        }
    }

    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value })
        if (e.target.value == null || e.target.value == "") {
            this.handleVenuesTableList(1, e.target.value);
        }
    }

    onClickSearchIcon = () => {
        this.handleVenuesTableList(1, this.state.searchText);
    }

    showDeleteConfirm = (venueId) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this venue?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.deleteVenue(venueId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    deleteVenue = (venueId) => {
        console.log("venueId::" + venueId);
        let payload = {
            venueId: venueId
        }
        this.props.venueDeleteAction(payload);
        this.setState({ deleteLoading: true })
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            {/* <Breadcrumb.Item className="breadcrumb-product">User</Breadcrumb.Item> */}
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.venuesList}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginRight: "25px", }} >
                        <div className="reg-product-search-inp-width">
                            <Input className="product-reg-search-input"
                                onChange={(e) => this.onChangeSearchText(e)}
                                placeholder="Search..." onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                    onClick={() => this.onClickSearchIcon()} />}
                                allowClear
                            />
                        </div>
                    </div>
                    <div style={{ marginRight: '4.2%' }}>
                        <div className="d-flex flex-row-reverse" onClick={() => this.props.clearVenueDataAction("venue")}>
                            <NavLink to={{ pathname: `/competitionVenueAndTimesAdd`, state: { key: AppConstants.venuesList } }}>
                                <Button className='primary-add-product' type='primary'>+ {AppConstants.addVenue}</Button>
                            </NavLink>
                        </div>
                    </div>
                    {/* <div style={{marginRight: '4.2%'}}>
                        <div  className="comp-dashboard-botton-view-mobile" >
                            <NavLink to={`/venueImport`} className="text-decoration-none">
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
                    </div> */}
                </div>
            </div >
        )
    }

    ///dropdown view containing all the dropdown of header
    searchView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-1" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '4.3%' }}>
                <div className="fluid-width" >
                    <div className="row" >
                        <div>
                            <div style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center" }} >
                                <button className="dashboard-lay-search-button"
                                    onClick={() => this.onClickSearchIcon()}>
                                    <img src={AppImages.searchIcon} height="15" width="15" alt="" />
                                </button>
                                {/* <form className="search-form"> */}
                                <div className="reg-product-search-inp-width">
                                    <Input className="product-reg-search-input"
                                        onChange={(e) => this.onChangeSearchText(e.target.value)}
                                        placeholder="Search..." onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                        prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
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
        )
    }

    ////////form content view
    contentView = () => {
        console.log("****" + columns.length);
        let commonReducerState = this.props.commonReducerState;
        let venuesList = commonReducerState.venuesList;
        let total = commonReducerState.venuesListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columns}
                        dataSource={venuesList}
                        pagination={false}
                        loading={this.props.commonReducerState.onLoad == true && true}
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
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu={"home"} userSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {/* {this.searchView()} */}
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
        venuesListAction,
        venueDeleteAction,
        clearVenueDataAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        commonReducerState: state.CommonReducerState,
        venueTimeState: state.VenueTimeState,
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)((VenuesList));
