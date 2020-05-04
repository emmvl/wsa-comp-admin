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

let data =
    [
        {
            "id": 1585,
            "firstName": "Stella",
            "middleName": "",
            "lastName": "L",
            "suburb": "Wynne",
            "street1": "135 County 646 Rd",
            "street2": "",
            "mCasualFee": "0.00",
            "mCasualGst": "0.00",
            "mSeasonalFee": "0.00",
            "mSeasonalGst": "0.00",
            "cSeasonalFees": "15.00",
            "cSeasonalGST": "1.50",
            "cCasualFees": "14.00",
            "cCasualGST": "1.40",
            "aSeasonalFees": "14.00",
            "aSeasonalGST": "1.40",
            "aCasualFees": "13.00",
            "aCasualGST": "1.30"
        }
    ]

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








    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-player-grades-header-view container mb-n3" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >

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
                            <Descriptions.Item className="pb-0" label="Bill To">
                                {data[0].firstName}{' '}{data[0].middleName}{' '}{data[0].lastName}
                            </Descriptions.Item>
                        </Descriptions>
                        <Descriptions >
                            <Descriptions.Item >
                                {data[0].suburb} {" "} {data[0].street1} {' '}{data[0].street2}
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
                                heading={data[0].mCasualFee.length > 0 ? data[0].mCasualFee : "-"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={"$6"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={data[0].mCasualGst.length > 0 ? data[0].mCasualGst : "-"}
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
                                heading={data[0].mCasualFee.length > 0 ? data[0].mCasualFee : "-"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={data[0].mCasualGst.length > 0 ? data[0].mCasualGst : "-"}
                            />
                        </div>
                        <div className="col-sm-3" >
                            <InputWithHead
                                heading={data[0].mCasualFee.length > 0 ? data[0].mCasualFee : "-"}
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
