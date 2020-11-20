import React, { Component } from "react";
import { Layout, Breadcrumb, Input, Button, Table, Select } from 'antd';
import './competition.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const columns = [
    {
        title: 'Court Numbers',
        dataIndex: 'courtNumbers',
        key: 'courtNumbers',
        render: courtNumbers => <Input className="input-inside-table-fees" value={courtNumbers} />,
    },
    {
        title: 'Longitude',
        dataIndex: 'longitude',
        key: 'longitude',
        render: longitude => <Input className="input-inside-table-venue-court" value={longitude} />,

    },
    {
        title: 'Latitude',
        dataIndex: 'latitude',
        key: 'latitude',
        render: latitude => <Input className="input-inside-table-venue-court" value={latitude} />,

    },

];
const data = [
    {
        key: '1',
        courtNumbers: "1",
        longitude: "123456788",
        latitude: "9874563121",

    },
    {
        key: '2',
        courtNumbers: "2",
        longitude: "123456788",
        latitude: "9874563121",

    },
    {
        key: '3',
        courtNumbers: "3",
        longitude: "123456788",
        latitude: "9874563121",

    },

];


class CompetitionVenueAndCourts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            value: "playingMember",
            competition: "2019winter",
        }
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };


    ///////view for breadcrumb
    headerView = () => {
        return (

            <Header className="comp-venue-courts-header-view">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.Step_3}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                </div>

            </Header>


        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-2">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 75 }}
                                    onChange={(year) => this.setState({ year })}
                                    value={this.state.year}
                                >
                                    <Option value="2019">{AppConstants.year2019}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-2">
                            <div style={{
                                width: '100%',
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                marginRight: 50
                            }}>
                                <span className="year-select-heading">{AppConstants.competition}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 140 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value="2019winter">{AppConstants.winter2019}</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        return (
            <div className="content-view pt-5">
                <span className="form-heading">Venue 1</span>
                <InputWithHead heading={AppConstants.name} placeholder={AppConstants.name} />
                <InputWithHead heading={AppConstants.address} placeholder={AppConstants.address} />
                <InputWithHead heading={AppConstants.contactNumber} placeholder={AppConstants.contactNumber} />

                <div className="inside-container-view">
                    <div className="table-responsive">
                        <Table className="fees-table" columns={columns} dataSource={data} pagination={false} Divider=" false" />
                    </div>

                    <span className="input-heading-add-another">+ {AppConstants.addAnotherCourt}</span>
                </div>

                <span className="input-heading-add-another">+ {AppConstants.addAnotherVenue}</span>
            </div>
        )
    }

    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveDraft}</Button>
                                <Button className="open-reg-button" type="primary">{AppConstants.next}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu="competition" compSelectedKey="7" />
                <Layout>
                    {this.headerView()}
                    <Content>

                        {this.dropdownView()}
                        <div className="formView">
                            {this.contentView()}
                        </div>
                    </Content>

                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>

        );
    }
}
export default CompetitionVenueAndCourts;
