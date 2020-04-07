import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu } from 'antd';
import './product.css';
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

const { Footer, Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
const columns = [

    {
        title: 'Competition Name',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => a.competitionName.length - b.competitionName.length,
    },
    {
        title: 'Membership Product(s)',
        dataIndex: 'membershipProduct',
        key: 'membershipProduct',
        sorter: (a, b) => a.membershipProduct.length - b.membershipProduct.length,
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b) => a.division.length - b.division.length,


    },
    {
        title: 'Registration Open',
        dataIndex: 'registrationOpen',
        key: 'registrationOpen',
        // render: discounts => <span>{discounts == true ? "Yes" : "No"}</span>,
        sorter: (a, b) => a.registrationOpen.length - b.registrationOpen.length,
    },
    {
        title: 'Registration Close',
        dataIndex: 'registrationClose',
        key: 'registrationClose',
        sorter: (a, b) => a.registrationClose.length - b.registrationClose.length,
    },

    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        // render: status =>
        //     <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
        //         <img className="dot-image"
        //             src={status === "active" ? AppImages.greenDot : status === "inactive" ? AppImages.greyDot : status === "expired" && AppImages.redDot}
        //             alt="" width="12" height="12" />
        //     </span>,
        sorter: (a, b) => a.status.length - b.status.length,
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
                        {/* <NavLink to={{ pathname: `/registrationCompetitionFee`, state: { id: record.competitionUniqueKey } }} > */}
                        <span>Edit</span>
                        {/* </NavLink> */}
                    </Menu.Item>
                    <Menu.Item key="2">
                        {/* onClick={() => this_Obj.showDeleteConfirm(record.competitionUniqueKey)}> */}
                        <span>Delete</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
            //  : null
        )
    }

];

const data = [
    {
        key: '1',
        competitionName: "Social Competition",
        membershipProduct: "Player",
        division: "Junior",
        registrationOpen: "01-04-2020",
        registrationClose: "01-06-2020",
        status: "Draft",
        Action: "Once/year"
    },
    {
        key: '2',
        competitionName: "Winter 2020",
        membershipProduct: "Player",
        division: "Senior",
        registrationOpen: "01-03-2020",
        registrationClose: "31-03-2020",
        status: "Published",
        Action: "Recurring"

    },
];

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
        }
    }


    componentDidMount() {
        this.props.getOnlyYearListAction(this.props.appState.yearList)
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.registrationForm}</Breadcrumb.Item>

                        </Breadcrumb>
                    </div>
                </div>

            </div >

        )
    }
    onYearChange = (yearRefId) => {
        this.setState({ yearRefId: yearRefId, })
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
                                    className="year-select"
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
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table" columns={columns} dataSource={data} pagination={false}
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
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"1"} />
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
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Registration);
