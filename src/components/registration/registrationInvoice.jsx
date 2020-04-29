import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Descriptions, Input, Divider } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import Chart from "chart.js";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead"
import AppImages from "../../themes/appImages";



const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input

class RegistrationInvoice extends Component {
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
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    componentDidMount() {

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
            <Header className="comp-player-grades-header-view container mb-n3" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        {/* <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add">{AppConstants.users}</Breadcrumb.Item>
                        </Breadcrumb> */}
                    </div>
                </div>
            </Header >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="content-view pt-4 pb-0">
                <div className="row" >
                    <div className="col-sm"
                    >
                        <label>
                            <img
                                src={AppImages.squareImage}
                                // alt="animated"
                                height="120"
                                width="120"
                                // style={{ borderRadius: 60 }}
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.squareImage;
                                }}
                            />
                        </label>
                        <InputWithHead
                            heading={"Receipt No.1234497"}
                        />
                        <Descriptions >
                            <Descriptions.Item label="Bill To">
                                Sam O'Brien Unit 6/5 LIvingstone Place NewPort 2106 NSW
                         </Descriptions.Item>
                        </Descriptions>
                        {/* </div> */}
                    </div>
                    <div className="col-sm pt-5">
                        <TextArea
                            placeholder="Text Area"
                        />
                    </div>
                </div>

            </div>
        )
    }

    ////////form content view
    contentView = () => {
        return (
            <div className="content-view pt-0 pb-0">
                <div className="row" >
                    <div className="col-sm pb-0" >
                        <InputWithHead
                            heading={"Description"}
                        />
                    </div>
                    <div className="col-sm pb-0" >
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"Qty"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"Unit Price"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"GST"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"Total"}
                            />
                        </div>
                    </div>
                </div>
                <Divider className="mt-0 mb-0" />
                <div className="row" >
                    <div className="col-sm" >
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm pb-0" >
                        <InputWithHead
                            heading={"Membership Product -State fee"}
                        />
                    </div>
                    <div className="col-sm pb-0" >
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"1"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$60"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$6"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$66"}
                            />
                        </div>
                    </div>
                </div>
                <Divider className="mt-0 mb-0" />
                <div className="row" >
                    <div className="col-sm" >
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm pb-0" >
                        <Descriptions >
                            <Descriptions.Item label="Registration- Pine Rivers Netball Association">
                                Les hughes Sporting Complex
                                119 Francis Rd, Lawton
                                Lasnton QLD 4501

                                ABN:65593930
                                PH:4225 0909
                                E:Info@prna.com.au
                         </Descriptions.Item>


                        </Descriptions>
                    </div>
                    <div className="col-sm pb-0" >
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"1"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$150"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$15"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$165"}
                            />
                        </div>
                    </div>
                </div>
                <Divider className="mt-0 mb-0" />
                <div className="row" >
                    <div className="col-sm" >
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm pb-0" >
                        <Descriptions >
                            <Descriptions.Item label="Registration- Bicela Netball Association">
                                Les hughes Sporting Complex
                                119 Francis Rd, Lawton
                                Lasnton QLD 4501
                                ABN:65593930
                                PH:4225 0909
                                E:Info@prna.com.au
                         </Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div className="col-sm pb-0" >
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"1"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$150"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$15"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$165"}
                            />
                        </div>
                    </div>
                </div>


            </div>
        )
    }
    totalInvoiceView = () => {
        return (
            <div className="content-view ">
                <div className="row" >
                    <div className="col-sm ">
                        <TextArea
                            placeholder="Text Area"
                        />
                    </div>
                    <div className="col-sm"
                    >
                        <div className="row" >
                            <div className="col-sm" />
                            <div className="col-sm"  >
                                <div style={{ display: 'flex', height: "1px", justifyContent: "flex-end", backgroundColor: "black" }}
                                >


                                </div>
                            </div>

                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <InputWithHead
                                required={"pr-4"}
                                heading={"Subtotal"}
                            />
                            <InputWithHead
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={"$360"}
                            />

                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>

                            <InputWithHead
                                required={"pr-4 pt-0"}
                                heading={"GST 10%"}
                            />
                            <InputWithHead
                                required={"pt-0"}
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={"$36"}
                            />

                        </div>
                        <div className="col-sm" style={{ display: "flex", justifyContent: "flex-end" }}>

                            <InputWithHead
                                required={"pr-4 pt-0"}
                                heading={"Total"}
                            />
                            <InputWithHead
                                required={"pt-0"}
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={"$396"}
                            />

                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-sm pt-5">
                        <label>
                            <img
                                src={AppImages.netballImages}
                                // alt="animated"
                                height="100%"
                                width="100%"
                                // style={{ borderRadius: 60 }}
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.netballImages;
                                }}
                            />
                        </label>
                    </div>
                    <div className="col-sm pt-5 " style={{ display: "flex", justifyContent: "flex-end" }}>
                        <label>
                            <img
                                src={AppImages.netballLogoMain}
                                height="100%"
                                width="100%"
                                name={'image'}
                                onError={ev => {
                                    ev.target.src = AppImages.netballLogoMain;
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div >
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div >
                <div className="comp-player-grades-footer-view">
                    <div className="row" >
                        <div className="col-sm" >
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>

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
                <DashboardLayout
                    menuHeading={""}
                    menuName={AppConstants.home}
                />
                <InnerHorizontalMenu />

                <Layout>
                    {this.headerView()}
                    <Content className="container">
                        <div className="formView">
                            {this.dropdownView()}

                            {this.contentView()}
                            {this.totalInvoiceView()}
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
export default RegistrationInvoice;
