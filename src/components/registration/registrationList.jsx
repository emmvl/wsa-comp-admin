import React, { Component } from "react";
import { Layout, Table, Select } from 'antd';
import './product.scss';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

const { Footer, Content } = Layout;
const { Option } = Select;
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,

    },
    {
        title: 'Reg. date',
        dataIndex: 'regDate',
        key: 'regDate',
        sorter: (a, b) => a.regDate.length - b.regDate.length,

    },
    {
        title: 'Division/ Grade',
        dataIndex: 'divisionGrade',
        key: 'divisionGrade',
        sorter: (a, b) => a.divisionGrade.length - b.divisionGrade.length,
    },


    {
        title: 'DOB',
        dataIndex: 'dob',
        key: 'dob',
        sorter: (a, b) => a.dob.length - b.dob.length,
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => a.team.length - b.team.length,
    },
    {
        title: 'Products',
        dataIndex: 'products',
        key: 'products',
        sorter: (a, b) => a.products.length - b.products.length,
    },
    {
        title: 'Fee',
        dataIndex: 'fee',
        key: 'fee',
        sorter: (a, b) => a.fee.length - b.fee.length,
    },


];

const data = [
    {
        key: '1',
        name: "Ciara Cooper",
        regDate: "1/03/2019",
        divisionGrade: "9a",
        dob: "1/02/2010",
        team: "Peninsual Lorikeet",
        products: "1st Membership Player Shop 2019 Coach",
        fee: "$250.00"

    },
    {
        key: '2',
        name: "Fran Look",
        regDate: "10/02/2019",
        divisionGrade: "9a",
        dob: "10/02/2010",
        team: "Peninsual Lorikeet",
        products: "1st Membership Player 2nd Membership Payer ",
        fee: "$400.00"
    },
    {
        key: '3',
        name: "Chloe Price",
        regDate: "12/02/2019",
        divisionGrade: "9a",
        dob: "11/09/2010",
        team: "Peninsual Lorikeet",
        products: "Coach Member",
        fee: "$40.00"

    },
    {
        key: '4',
        name: "Sienna Geros",
        regDate: "12/02/2019",
        divisionGrade: "9a",
        dob: "21/06/2010",
        team: "Peninsual Lorikeet",
        products: "Coach Member",
        fee: "$40.00"
    },
];


class RegistrationList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            competition: "all",
            product: "NETSETGO",
            dob: "NETSETGO",

        }
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view" style={{ marginTop: 15 }}>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="com-year-select-heading-view">
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 75 }}
                                    onChange={(year) => this.setState({ year })}
                                    value={this.state.year}
                                >
                                    <Option value={"2019"}>{AppConstants.year2019}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="com-year-select-heading-view">
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 75 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value="all">{AppConstants.all}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="com-year-select-heading-view">
                                <span className='year-select-heading'>{AppConstants.product}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 75 }}
                                    onChange={(product) => this.setState({ product })}
                                    value={this.state.product}
                                >
                                    <Option value={"NETSETGO"}>{AppConstants.netSetGo}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="com-year-select-heading-view">
                                <span className='year-select-heading'>{AppConstants.dOB}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 75 }}
                                    onChange={(dob) => this.setState({ dob })}
                                    value={this.state.dob}
                                >
                                    <Option value={"NETSETGO"}>{AppConstants.netSetGo}</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    ////////participatedView view for competition
    participatedView = () => {
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
            <div className="fluid-width">
                <div className="comp-player-grades-footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                {/* <Button className="save-draft-text" type="save-draft-text">Save Draft</Button>
                                <Button className="open-reg-button" type="primary">Grade and Name Teams</Button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <InnerHorizontalMenu menu="registration" regSelectedKey="1" />
                <Layout>
                    <Content>
                        {this.dropdownView()}
                        {this.participatedView()}
                    </Content>
                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>

        );
    }
}
export default RegistrationList;

