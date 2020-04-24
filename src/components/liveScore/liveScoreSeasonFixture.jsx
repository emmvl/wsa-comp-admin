import { Breadcrumb, Button, Layout, Select, Checkbox, Table } from 'antd';
import React, { Component } from "react";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";

import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [

    {
        title: 'Date/Time',
        dataIndex: 'dateTime',
        key: 'dateTime',
        sorter: (a, b) => tableSort(a, b, "dateTime"),
    },
    {
        title: 'Home Team',
        dataIndex: 'homeTeam',
        key: 'homeTeam',
        sorter: (a, b) => tableSort(a, b, "homeTeam"),

    },
    {
        title: 'Away Team',
        dataIndex: 'awayTeam',
        key: 'awayTeam',
        sorter: (a, b) => tableSort(a, b, "awayTeam"),
    },
    {
        title: 'venues',
        dataIndex: 'venues',
        key: 'venues',
        sorter: (a, b) => tableSort(a, b, "venues"),
    },
    {
        title: 'MS',
        dataIndex: 'ms',
        key: 'ms',
        sorter: (a, b) => tableSort(a, b, "ms"),
    },

];

const data = [
    {
        'dateTime': '6 April 19 9.00AM',
        'homeTeam': 'ccSports37',
        'awayTeam': 'NYC 19',
        'venues': '17'
    },
    {
        'dateTime': '6 April 19 9.00AM',
        'homeTeam': 'Beacon Hill 20',
        'awayTeam': 'Forest 21',
        'venues': '20'
    },
    {
        'dateTime': '6 April 19 9.00AM',
        'homeTeam': 'ccSports37',
        'awayTeam': 'NYC 19',
        'venues': '17'
    },
    {
        'dateTime': '6 April 19 9.00AM',
        'homeTeam': 'Beacon Hill 20',
        'awayTeam': 'Forest 21',
        'venues': '20'
    }
]

class liveScoreSeasonFixture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            competition: "2019winter",
            division: "all",
            grade: "all",
            teams: "all",
            value: "periods",
            gameTimeTracking: false,

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

            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.seasonFixture}</Breadcrumb.Item>
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
                <div className="row" >
                    <div className="col-sm-2" >
                        <div className="com-year-select-heading-view" >
                            <span className='year-select-heading'>{AppConstants.season}:</span>
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
                    <div className="col-sm-2" >
                        <div style={{
                            width: "100%", display: "flex",
                            flexDirection: "row",
                            alignItems: "center", marginRight: 50
                        }} >
                            <span className='year-select-heading'>{AppConstants.grade}:</span>
                            <Select
                                className="year-select"
                                // style={{ width: 140 }}
                                onChange={(competition) => this.setState({ competition })}
                                value={this.state.competition}
                            >
                                <Option value={"2019winter"}>{'11A'}</Option>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    ////////form content view
    contentView = () => {
        return (
            <div className="comp-dash-table-view mt-4">
                {/* {this.headerView()} */}
                <div className="table-responsive home-dash-table-view">
                    <Table 
                        className="home-dashboard-table" 
                        columns={columns} 
                        dataSource={data} 
                        pagination={false}
                        selection={ <span>"Radhesh"</span>}
                    />
                </div>
            </div>
        )
    }



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm" >
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                <Button className="save-draft-text" type="save-draft-text">{AppConstants.preview}</Button>
                                <Button className="open-reg-button" type="primary">{AppConstants.print}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} compSelectedKey={"22"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {/* <div className="formView"> */}
                        {this.contentView()}
                        {/* </div> */}
                    </Content>
                    {/* <Footer>
                        {this.footerView()}
                    </Footer> */}
                </Layout>
            </div>
        );
    }
}
export default liveScoreSeasonFixture;
