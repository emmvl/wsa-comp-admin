import React, { Component } from "react";
import { Layout, Radio, Table, Select } from 'antd';
import './product.scss';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";

const { Footer, Content } = Layout;
const { Option } = Select;
const columns = [
    {
        title: AppConstants.name,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,
        // sortOrder: columnKey === 'name' && sortedInfo.order,
        // ellipsis: true,
    },
    {
        title: AppConstants.registrationType,
        dataIndex: 'regType',
        key: 'regType',
        sorter: (a, b) => a.regType.length - b.regType.length,
    },
    {
        title: AppConstants.clubFees,
        dataIndex: 'clubFee',
        key: 'clubFee',
        sorter: (a, b) => a.clubFee.length - b.clubFee.length,
    },
    {
        title: AppConstants.associationFees,
        dataIndex: 'associatFee',
        key: 'associatFee',
        sorter: (a, b) => a.associatFee.length - b.associatFee.length,
    },
    {
        title: AppConstants.stateFees,
        dataIndex: 'stateFee',
        key: 'stateFee',
        sorter: (a, b) => a.stateFee.length - b.stateFee.length,
    },
    {
        title: AppConstants.totalFee,
        dataIndex: 'totalFee',
        key: 'totalFee',
        sorter: (a, b) => a.totalFee.length - b.totalFee.length,
    },
    {
        title: AppConstants.status,
        dataIndex: 'status',
        key: 'status',
        render: status => <span className='d-flex justify-content-center w-50'>
            <img className="dot-image" src={status === "true" ? AppImages.greenDot : AppImages.greyDot} alt="" width="12" height="12" />
        </span>,
    },
    {
        title: AppConstants.productType,
        dataIndex: 'productType',
        key: 'productType',
        sorter: (a, b) => a.productType.length - b.productType.length,
    },
];

const playingMemberData = [
    {
        key: '1',
        name: 'Nat Set Go',
        regType: 'NetSetGo',
        clubFee: "$ 20.00",
        associatFee: "$ 30.00",
        stateFee: "$ 40.00",
        totalFee: "$ 90.00",
        status: "true",
        productType: "Recurring"
    },
    {
        key: '2',
        name: 'Junior Winter',
        regType: 'Junior',
        clubFee: "$ 40.00",
        associatFee: "$ 50.00",
        stateFee: "$ 60.00",
        totalFee: "$ 150.00",
        status: "false",
        productType: "One-off"
    },
    {
        key: '3',
        name: 'Working Netball',
        regType: 'Program',
        clubFee: "$ 20.00",
        associatFee: "$ 30.00",
        stateFee: "$ 40.00",
        totalFee: "$ 90.00",
        status: "true",
        productType: "Recurring"
    },
    {
        key: '4',
        name: 'Casual Netball',
        regType: 'N/A',
        clubFee: "$ 40.00",
        associatFee: "$ 50.00",
        stateFee: "$ 60.00",
        totalFee: "$ 150.00",
        status: "false",
        productType: "One-off"
    },
];

const nonPlayingMemberData = [
    {
        key: '1',
        name: 'Administrator',
        regType: 'Official',
        clubFee: "$ 20.00",
        associatFee: "$ 30.00",
        stateFee: "$ 40.00",
        totalFee: "$ 90.00",
        status: "true",
        productType: "One-off"
    },
];

class ProductRegistrationClub extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            value: "playingMember",
        }
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    headerView = () => {
        return (
            <div className="product-reg-club-header-view">
                <div className="year-select-view">
                    <span className="year-select-heading">{AppConstants.year}:</span>
                    <Select
                        className="year-select"
                        style={{ width: 75 }}
                        onChange={(year) => this.setState({ year })}
                        value={this.state.year}
                    >
                        <Option value="2019">{AppConstants.year2019}</Option>
                    </Select>
                </div>
            </div>
        )
    }

    contentView = () => {
        let tableData = this.state.value === "playingMember" ? playingMemberData : nonPlayingMemberData
        return (
            <div className="fees-view pt-0">
                <div>
                    <Radio.Group onChange={this.onChange} value={this.state.value} defaultValue="playingMember">
                        <Radio value="playingMember">{AppConstants.playingMember}</Radio>
                        <Radio value="nonPlayingMember">{AppConstants.nonPlayingMember}</Radio>
                    </Radio.Group>
                </div>
                <div className="table-responsive home-dash-table-view mt-5">
                    <Table className="home-dashboard-table" columns={columns} dataSource={tableData} pagination={false} />
                </div>
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    {/* <div className="row">
                        <div className="col-sm d-flex align-items-start">
                            <Button type="cancel-button">Cancel</Button>
                        </div>
                        <div className="col-sm">
                            <div className="d-flex justify-content-end">
                                <Button className="save-draft-text" type="save-draft-text">Save as Draft</Button>
                                <Button className="publish-button" type="primary">Publish</Button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <InnerHorizontalMenu menu="registration" />
                <Layout>
                    {this.headerView()}

                    <Content>
                        {/* <div className="product-reg-club-table-view"> */}
                        {this.contentView()}
                        {/* </div> */}
                    </Content>

                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>
        );
    }
}

export default ProductRegistrationClub;
