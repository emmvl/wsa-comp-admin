import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination } from 'antd';
import './product.scss';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getOnlyYearListAction,
} from "../../store/actions/appAction";
import {
    regDashboardListAction
}
    from "../../store/actions/registrationAction/registrationDashboardAction"
import moment from "moment"
import Tooltip from 'react-png-tooltip'

const { Footer, Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}
const columns = [

    {
        title: 'Competition Name',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => tableSort(a, b, "competitionName")
    },
    {
        title: 'Registration Open',
        dataIndex: 'registrationOpenDate',
        key: 'registrationOpenDate',
        render: (registrationOpenDate, record) => {
            return (
                <span>{registrationOpenDate ? moment(registrationOpenDate).format("DD-MM-YYYY") : null}</span>
            )
        },
        sorter: (a, b) => tableSort(a, b, "registrationOpenDate")

    },
    {
        title: 'Registration Close',
        dataIndex: 'registrationCloseDate',
        key: 'registrationCloseDate',
        render: (registrationCloseDate, record) => {
            return (
                <span>{registrationCloseDate ? moment(registrationCloseDate).format("DD-MM-YYYY") : null}</span>
            )
        },
        sorter: (a, b) => tableSort(a, b, "registrationCloseDate")

    },

    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => tableSort(a, b, "status")

    },
    {
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, record) => (
            // isUsed == false ? <Menu
            <Menu
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
                        <NavLink to={{
                            pathname: `/registrationForm`, state: {
                                id: record.competitionId,
                                year: record.yearId,
                                orgRegId: record.orgRegId, compCloseDate: record.compRegCloseDate,
                                compName: record.competitionName
                            }
                        }}
                        >
                            {/*  */}
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>
            //  : null
        )
    }

];


class RegistrationFormList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
        }
        this.props.getOnlyYearListAction(this.props.appState.yearList)
    }


    componentDidMount() {
        this.handleMembershipTableList(1, this.state.yearRefId)
    }

    handleMembershipTableList = (page, yearRefId) => {
        let offset = page ? 10 * (page - 1) : 0;
        this.props.regDashboardListAction(offset, yearRefId)
    };

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.registrationForm}</Breadcrumb.Item>

                        </Breadcrumb>
                        <div style={{ marginTop: 8 }}>
                            <Tooltip background='#ff8237'>
                                <span>{AppConstants.regFormDashBoardMsg}</span>
                            </Tooltip>
                        </div>
                    </div>
                </div>

            </div >

        )
    }
    onYearChange = (yearRefId) => {
        this.setState({ yearRefId: yearRefId, })
        this.handleMembershipTableList(1, yearRefId)
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-2" >
                            <div className="com-year-select-heading-view" >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    name={"yearRefId"}
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ maxWidth: 80 }}
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={this.state.yearRefId}
                                >
                                    {this.props.appState.yearList.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }




    ////////form content view
    contentView = () => {
        const { dashboardState } = this.props;
        let total = dashboardState.regDashboardListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columns}
                        dataSource={dashboardState.regDashboardListData}
                        pagination={false}
                        loading={this.props.dashboardState.onLoad === true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={dashboardState.regDashboardListPage}
                        total={total}
                        onChange={(page) => this.handleMembershipTableList(page, this.state.yearRefId)}
                    />
                </div>
            </div>
        )
    }


    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="d-flex flex-row-reverse">
                <NavLink to={`/productAddRegistration`} className="text-decoration-none">
                    <Button className='primary-add-product' type='primary'>+ {AppConstants.addAFee}</Button>
                </NavLink>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"3"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                    <Footer>
                        {/* {this.footerView()} */}
                    </Footer>
                </Layout>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOnlyYearListAction,
        regDashboardListAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        dashboardState: state.RegistrationDashboardState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(RegistrationFormList);
