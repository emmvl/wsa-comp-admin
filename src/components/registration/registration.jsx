import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select } from 'antd';
import './product.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";

const { Footer, Content } = Layout;
const { Option } = Select;
/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [

    {
        title: 'Registration Category',
        dataIndex: 'registrationcategory',
        key: 'registrationcategory',
        sorter: (a, b) => a.registrationcategory.length - b.registrationcategory.length,


    },
    {
        title: 'Registration Type',
        dataIndex: 'registrationType',
        key: 'registrationType',
        sorter: (a, b) => a.registrationType.length - b.registrationType.length,


    },
    {
        title: 'Division',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => tableSort(a, b, "divisionName")


    },
    {
        title: 'Discounts',
        dataIndex: 'discounts',
        key: 'discounts',
        render: discounts => <span>{discounts == true ? "Yes" : "No"}</span>,
        sorter: (a, b) => a.discounts.length - b.discounts.length,
    },
    {
        title: 'State Fee',
        dataIndex: 'stateFee',
        key: 'stateFee',
        sorter: (a, b) => a.stateFee.length - b.stateFee.length,
    },

    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: status =>
            <span style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                <img className="dot-image"
                    src={status === "active" ? AppImages.greenDot : status === "inactive" ? AppImages.greyDot : status === "expired" && AppImages.redDot}
                    alt="" width="12" height="12" />
            </span>,
        sorter: (a, b) => a.status.length - b.status.length,
    },
    {
        title: 'Frequency',
        dataIndex: 'frequency',
        key: 'frequency',
        sorter: (a, b) => a.frequency.length - b.frequency.length,

    },

];

const data = [
    {
        key: '1',
        registrationcategory: "Junior Winter",
        registrationType: "Junior",
        division: "Junior",
        discounts: JSON.stringify(true),
        stateFee: "$40.00",
        status: "active",
        frequency: "Once/year"
    },
    {
        key: '2',
        registrationcategory: "Walking Netball",
        registrationType: "Program",
        division: "Program",
        discounts: JSON.stringify(false),
        stateFee: "$27.27",
        status: "inactive",
        frequency: "Recurring"

    },
    {
        key: '3',
        registrationcategory: "Casual Netball",
        registrationType: "N/A",
        division: "N/A",
        discounts: true,
        stateFee: "$0.00",
        status: "expired",
        frequency: "Recurring"

    },

];

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2020",
        }
        // this.props.getOnlyYearListAction(this.props.appState.yearList)
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.fees}</Breadcrumb.Item>

                        </Breadcrumb>
                    </div>
                </div>

            </div >

        )
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
                                    className="year-select"
                                    // style={{ width: 75 }}
                                    onChange={(year) => this.setState({ year })}
                                    value={this.state.year}
                                >
                                    {/* <Option value={"2019winter"}>{AppConstants.winter2019}</Option> */}
                                    <Option value={"2020"}>{AppConstants.year2020}</Option>
                                    <Option value={"2019"}>{AppConstants.year2019}</Option>
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
                        onRow={(r) => ({
                            onClick: () => this.props.history.push("/productAddRegistration")
                        })}
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
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>
        );
    }
}
export default Registration;
