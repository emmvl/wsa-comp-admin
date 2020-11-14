import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select } from 'antd';
import './user.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import Chart from "chart.js";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";


const { Header, Footer, Content } = Layout;
const { Option } = Select;
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,

    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        sorter: (a, b) => a.role.length - b.role.length,
    },
    {
        title: 'DOB',
        dataIndex: 'dob',
        key: 'dob',
        sorter: (a, b) => a.dob.length - b.dob.length,
    },
    {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        sorter: (a, b) => a.phone.length - b.phone.length,
    },

];

const data = [
    {
        key: '1',
        name: 'Nicole Baker',
        role: "Bioela Club President",
        dob: "1/02/2010",
        phone: "0411 565 878",
    },
    {
        key: '2',
        name: 'Lori Murray',
        role: "Bioela Club Official",
        dob: "1/02/2010",
        phone: "0411 565 878",
    },
    {
        key: '3',
        name: 'Frances Willis',
        role: "Bioela Club Official",
        dob: "1/02/2010",
        phone: "0411 565 878",
    },


];

class UserDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019winter",
            value: "playingMember",
            competition: "all",
        }
        this.chartRef = React.createRef();
        this.chartRef2 = React.createRef();
        this.chartRefCompititions = React.createRef();
        this.chartRefGender = React.createRef();
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    componentDidMount() {
        this.ageBarChart()
        this.roleChart()
        this.compititionChart()
        this.genderChart()
    }





    compititionChart = () => {
        const compititionsChartRef = this.chartRefCompititions.current.getContext("2d");
        new Chart(compititionsChartRef, {
            type: 'doughnut',
            data: {
                labels: ["Sapphire Series", "Queensland Premier League", "Junior Queensland", "Walking Netball"],
                datasets: [
                    {
                        data: [2199, 4849, 5255, 1221],
                        backgroundColor: ["#9966ff", "#ad85ff", "#c2a3ff", "#d6c2ff"]
                    },

                ]

            },
            options: {
                legend: {
                    position: 'right'
                }
            }
        })
    }

    genderChart = () => {
        const genderChartRef = this.chartRefGender.current.getContext("2d");
        new Chart(genderChartRef, {
            type: 'doughnut',
            data: {
                labels: ["Female", "Male", "Unspecified"],
                datasets: [
                    {
                        data: [2199, 4849, 5255],
                        backgroundColor: ["#ffa1b5", "#86c7f3"]
                    },

                ]

            },
            options: {
                legend: {
                    position: 'right'
                }
            }
        })
    }


    roleChart = () => {
        const roleChartRef = this.chartRef2.current.getContext("2d");
        new Chart(roleChartRef, {
            type: 'doughnut',
            data: {
                labels: ["Players", "Officals", "Coaches"],
                datasets: [
                    {
                        data: [2199, 4849, 5255],
                        backgroundColor: ["#ffcd56", "#37afff", "#5dc6c6"]
                    },
                ]
            },
            options: {
                legend: {
                    position: 'right'
                },
                // title: {
                //     text: "Ages",
                //     display: true,
                //     lineHeight: 2
                //     // position: 'chartArea'
                // },
                // tooltips: {
                //     titleAlign: "left",
                //     backgroundColor: "red",
                // }
            }
        })
    }

    ////age bar graph
    ageBarChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        new Chart(myChartRef, {
            type: "horizontalBar",

            data: {
                //Bring in data
                labels: ["0-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
                datasets: [
                    {
                        label: "Ages",
                        data: [2199, 4849, 5255, 1231, 3223, 1262, 2363],
                        backgroundColor: ["#ff9f40", "#ffa853", "#ffb266", "#ffbc79", "#ffc58c", "#ffcf9f", "#ffd9b3",],

                    },
                ]
            },
            options: {
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false,
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false,
                        }
                    }]
                },
                legend: {
                    position: "top"
                },
            }
        });
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-player-grades-header-view container mb-n3">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.users}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">{AppConstants.year}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 75 }}
                                    onChange={(year) => this.setState({ year })}
                                    value={this.state.year}
                                >
                                    <Option value="2019winter">{AppConstants.winter2019}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div style={{
                                width: '100%',
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                                <span className="year-select-heading">{AppConstants.competition}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 140 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value="all">{AppConstants.all}</Option>
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
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="chart-container-view mt-4">
                            <span style={{ fontSize: 15, fontWeight: 500 }}>{AppConstants.ages}</span>
                            <canvas
                                id="myChart"
                                ref={this.chartRef}
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="chart-container-view mt-4">
                            <span style={{ fontSize: 15, fontWeight: 500 }}>{AppConstants.roles}</span>
                            <canvas
                                id="myChart2"
                                ref={this.chartRef2}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="chart-container-view">
                            <span style={{ fontSize: 15, fontWeight: 500 }}>{AppConstants.competitions}</span>
                            <canvas
                                id="myChart"
                                ref={this.chartRefCompititions}
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="chart-container-view">
                            <span style={{ fontSize: 15, fontWeight: 500 }}>{AppConstants.genders}</span>
                            <canvas
                                id="myChart2"
                                ref={this.chartRefGender}
                            />
                        </div>
                    </div>
                </div>

                <div className="user-dashboard-table-view">
                    <div className="table-responsive home-dash-table-view">
                        <Table className="home-dashboard-table" columns={columns} dataSource={data} pagination={false} />
                    </div>
                </div>
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div>
                <div className="comp-player-grades-footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                {/* <Button className="save-draft-text" type="save-draft-text">Save Draft</Button>
                                <Button className="open-reg-button" type="primary">Finalise</Button> */}
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
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu="user" userSelectedKey="1" />
                <Layout>
                    {this.headerView()}
                    <Content className="container">
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

export default UserDashboard;
