import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Descriptions, Input, Divider } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import Chart from "chart.js";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead"
import AppImages from "../../themes/appImages";
import { getInvoice } from "../../store/actions/commonAction/commonAction"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';



const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input
let totalArray = []
// let data =
//     [
//         {
//             "id": 1585,
//             "firstName": "Stella",
//             "middleName": "",
//             "lastName": "L",
//             "suburb": "Wynne",
//             "street1": "135 County 646 Rd",
//             "street2": "",
//             "mCasualFee": "0.00",
//             "mCasualGst": "0.00",
//             "mSeasonalFee": "0.00",
//             "mSeasonalGst": "0.00",
//             "cSeasonalFees": "15.00",
//             "cSeasonalGST": "1.50",
//             "cCasualFees": "14.00",
//             "cCasualGST": "1.40",
//             "aSeasonalFees": "14.00",
//             "aSeasonalGST": "1.40",
//             "aCasualFees": "13.00",
//             "aCasualGST": "1.30"
//         }
//     ]

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
        // let competitionId = localStorage.getItem("competitionId")
        // let organisationId = localStorage.getItem('organisationId')
        this.props.getInvoice('ce66d9cc-9848-4722-9fa9-86e743405171', "c96e6712-e57c-4035-9816-9a1a64ebabfd", "362")
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
    dropdownView = (result) => {
        let data = result.length > 0 ? result[0] : []
        // let data =
        // {
        //     "userDetail": {
        //         "suburb": "Birkshire",
        //         "street1": "4",
        //         "street2": "Privet Drive",
        //         "lastName": "Potter",
        //         "firstName": "Harry ",
        //         "middleName": "",
        //         "postalCode": "45455",
        //         "stateRefId": 1
        //     },
        //     "membership": [
        //         {
        //             "membershipOrgCity": "",
        //             "membershipOrgName": "Netball QLD",
        //             "membershipOrgState": "QLD",
        //             "membershipOrgSuburb": "Nathan",
        //             "membershipOrgPhoneNo": "41114111",
        //             "membershipOrgStreet1": "Nissan Arena",
        //             "membershipOrgStreet2": "590 Mains Road",
        //             "membershipProductName": "Team ",
        //             "membershipProductTypes": [
        //                 {
        //                     "mTypeName": "Player",
        //                     "mCasualFee": 10,
        //                     "mCasualGst": 1,
        //                     "mSeasonalFee": 0,
        //                     "mSeasonalGst": 0
        //                 }
        //             ],
        //             "membershipOrgPostalCode": "4111"
        //         }
        //     ],
        //     "competitionOrganiser": {
        //         "fees": [
        //             {
        //                 "cCasualGST": 6.6,
        //                 "cCasualFees": 66,
        //                 "cSeasonalGST": 2.2,
        //                 "cSeasonalFees": 22
        //             }
        //         ],
        //         "details": {
        //             "compOrgCity": "",
        //             "compOrgName": "World Sports",
        //             "compOrgState": "QLD",
        //             "compOrgSuburb": "Graceville",
        //             "compOrgPhoneNo": "40754075",
        //             "compOrgStreet1": "Faulkner Park",
        //             "compOrgStreet2": "Waratah Avenue",
        //             "compOrgPostalCode": "4075"
        //         }
        //     },
        //     "affiliate": {
        //         "fees": [
        //             {
        //                 "aCasualGST": 6.6,
        //                 "aCasualFees": 66,
        //                 "aSeasonalGST": 0.5,
        //                 "aSeasonalFees": 5
        //             }
        //         ],
        //         "details": {
        //             "affOrgCity": "",
        //             "affOrgName": "wsa",
        //             "affOrgState": "NSW",
        //             "affOrgSuburb": "Warriewood",
        //             "affOrgPhoneNo": "09876543",
        //             "affOrgStreet1": "2 Hunter Street",
        //             "affOrgStreet2": "",
        //             "affOrgPostalCode": "2103"
        //         }
        //     }
        // }
        let userDetail = data.userDetail && data.userDetail
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
                        {userDetail && userDetail.firstName &&
                            <Descriptions >
                                <Descriptions.Item className="pb-0" label="Bill To">
                                    {userDetail.firstName}{' '}{userDetail.middleName}{' '}{userDetail.lastName}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {userDetail && (userDetail.suburb || userDetail.street1) &&
                            < Descriptions >
                                <Descriptions.Item className="pb-0"  >
                                    {userDetail.suburb} {" "}
                                    {userDetail.street1} {' '}{userDetail.street2}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {userDetail && userDetail.postalCode &&
                            < Descriptions >
                                <Descriptions.Item >
                                    {userDetail.postalCode} {" "}
                                </Descriptions.Item>
                            </Descriptions>
                        }

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
    contentView = (result) => {
        let data = result.length > 0 ? result : []
        // let competitionDetails = data && data.competitionOrganiser && data.competitionOrganiser.details && data.competitionOrganiser.details
        // let competitionFees = data && data.competitionOrganiser && data.competitionOrganiser.fees && data.competitionOrganiser.fees
        // let OrgDetails = data && data.affiliate && data.affiliate.details && data.affiliate.details
        // let orgFees = data && data.affiliate && data.affiliate.fees && data.affiliate.fees
        // let userDetail = data.userDetail && data.userDetail
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

                {/* {data.membership && data.membership.length > 0 && data.membership.map((membershipItem, membershipIndex) => {
                    return ( */}
                {data && data.length > 0 && data.map((participantItem, participantIndex) => {

                    let competitionDetails = participantItem && participantItem.competitionOrganiser && participantItem.competitionOrganiser.details && participantItem.competitionOrganiser.details
                    let competitionFees = participantItem && participantItem.competitionOrganiser && participantItem.competitionOrganiser.fees && participantItem.competitionOrganiser.fees
                    let OrgDetails = participantItem && participantItem.affiliate && participantItem.affiliate.details && participantItem.affiliate.details
                    let orgFees = participantItem && participantItem.affiliate && participantItem.affiliate.fees && participantItem.affiliate.fees
                    let userDetail = participantItem.userDetail && participantItem.userDetail
                    console.log(participantItem)
                    return (
                        <div>
                            < div className="row" >

                                <div className="col-sm-6 pb-0" >
                                    {userDetail && userDetail.firstName &&
                                        <InputWithHead required="pb-0"
                                            heading={"Registration - " + userDetail.firstName + " " + userDetail.lastName}
                                        />
                                    }
                                    {userDetail && userDetail.suburb &&
                                        <Descriptions >
                                            <Descriptions.Item className="pb-0 pt-0" >
                                                {userDetail.suburb}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }

                                    {userDetail && userDetail.street1 &&
                                        <Descriptions >
                                            <Descriptions.Item className="pb-0" >
                                                {userDetail.street1} {" "}{userDetail.street2}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }
                                    {userDetail && userDetail.PhoneNo &&
                                        <Descriptions >
                                            <Descriptions.Item className="pb-0" >
                                                {userDetail.PhoneNo}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }
                                    {userDetail && userDetail.postalCode &&
                                        <Descriptions >
                                            <Descriptions.Item  >
                                                {userDetail.postalCode}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    }

                                    {/* {membershipItem.membershipOrgSuburb.length > 0 &&
                                    <Descriptions >
                                        <Descriptions.Item className="pb-0 pt-0" >
                                            {membershipItem.membershipOrgSuburb}
                                        </Descriptions.Item>
                                    </Descriptions>
                                }

                                {membershipItem.membershipOrgStreet1.length > 0 &&
                                    <Descriptions >
                                        <Descriptions.Item className="pb-0" >
                                            {membershipItem.membershipOrgStreet1} {" "}{membershipItem.membershipOrgStreet2}
                                        </Descriptions.Item>
                                    </Descriptions>
                                }
                                {membershipItem.membershipOrgPhoneNo.length > 0 &&
                                    <Descriptions >
                                        <Descriptions.Item className="pb-0" >
                                            {membershipItem.membershipOrgPhoneNo}
                                        </Descriptions.Item>
                                    </Descriptions>
                                }
                                {membershipItem.membershipOrgState.length > 0 &&
                                    <Descriptions >
                                        <Descriptions.Item  >
                                            {membershipItem.membershipOrgState} {" "}{membershipItem.membershipOrgPostalCode}
                                        </Descriptions.Item>
                                    </Descriptions>
                                } */}
                                </div>
                            </ div>
                            {participantItem.membership && participantItem.membership.length > 0 && participantItem.membership.map((membershipItem, membershipIndex) => {
                                return (
                                    < div className="row" >
                                        <div className="col-sm pb-0" >
                                            {membershipItem.membershipProductTypes.length > 0 && membershipItem.membershipProductTypes.map((mproductItem, mProductIndex) => {
                                                if (Number(mproductItem.mCasualFee + mproductItem.mSeasonalFee) !== 0) {
                                                    return (
                                                        <InputWithHead required="pb-0"
                                                            heading={mproductItem.mTypeName}
                                                        />
                                                    )
                                                }
                                            }
                                            )}
                                        </div>

                                        <div className="col-sm pb-0" >

                                            {membershipItem.membershipProductTypes.length > 0 && membershipItem.membershipProductTypes.map((mFeeItem, mFeeIndex) => {
                                                if (Number(mFeeItem.mCasualFee + mFeeItem.mSeasonalFee) !== 0) {
                                                    return (
                                                        <div>


                                                            <div className="col-sm-3" >
                                                                <InputWithHead
                                                                    heading={"1"}
                                                                />
                                                            </div>
                                                            <div className="col-sm-3" >
                                                                <InputWithHead
                                                                    heading={"$" + Number(mFeeItem.mCasualFee + mFeeItem.mSeasonalFee).toFixed(2)}
                                                                />
                                                            </div>
                                                            <div className="col-sm-3" >
                                                                <InputWithHead
                                                                    heading={"$" + Number(mFeeItem.mCasualGst + mFeeItem.mSeasonalGst).toFixed(2)}
                                                                />
                                                            </div>
                                                            <div className="col-sm-3" >
                                                                <InputWithHead
                                                                    heading={"$" + (Number(mFeeItem.mCasualFee + mFeeItem.mSeasonalFee) + Number(mFeeItem.mCasualGst + mFeeItem.mSeasonalGst))}
                                                                />
                                                            </div>

                                                        </div>

                                                    )
                                                }
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                            }
                            < div className="row" >
                                <div className="col-sm" >
                                </div>
                            </div>

                            <div className="row" >
                                <div className="col-sm pb-0" >
                                    {competitionDetails && competitionDetails.compOrgName &&
                                        <InputWithHead required="pb-0"
                                            heading={competitionDetails.compOrgName}
                                        />
                                    }
                                    {/* {competitionDetails && competitionDetails.compOrgSuburb &&
                            <Descriptions >
                                <Descriptions.Item className="pb-0 pt-0" >
                                    {competitionDetails.compOrgSuburb}
                                </Descriptions.Item>
                            </Descriptions>
                        }

                        {competitionDetails && competitionDetails.compOrgStreet1 &&
                            <Descriptions >
                                <Descriptions.Item className="pb-0" >
                                    {competitionDetails.compOrgStreet1} {" "}{competitionDetails.compOrgStreet2}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {competitionDetails && competitionDetails.compOrgPhoneNo &&
                            <Descriptions >
                                <Descriptions.Item className="pb-0" >
                                    {competitionDetails.compOrgPhoneNo}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {competitionDetails && competitionDetails.compOrgState &&
                            <Descriptions >
                                <Descriptions.Item  >
                                    {competitionDetails.compOrgState} {" "}{competitionDetails.compOrgPostalCode}
                                </Descriptions.Item>
                            </Descriptions>
                        } */}
                                </div>
                                <div className="col-sm pb-0" >

                                    {competitionFees && competitionFees.length > 0 && competitionFees.map((compFeeItem, compFeeIndex) => {
                                        return (
                                            <div>
                                                <div className="col-sm-3" >
                                                    <InputWithHead
                                                        heading={"1"}
                                                    />
                                                </div>
                                                <div className="col-sm-3" >
                                                    <InputWithHead
                                                        heading={"$" + Number(compFeeItem.cCasualFees + compFeeItem.cSeasonalFees).toFixed(2)}
                                                    />
                                                </div>
                                                <div className="col-sm-3" >
                                                    <InputWithHead
                                                        heading={"$" + Number(compFeeItem.cCasualGST + compFeeItem.cSeasonalGST).toFixed(2)}
                                                    />
                                                </div>
                                                <div className="col-sm-3" >
                                                    <InputWithHead
                                                        heading={"$" + (Number(compFeeItem.cCasualFees + compFeeItem.cSeasonalFees) + Number(compFeeItem.cCasualGST + compFeeItem.cSeasonalGST))}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="row" >
                                <div className="col-sm pb-0" >
                                    {OrgDetails && OrgDetails.affOrgName &&
                                        <InputWithHead required="pb-0"
                                            heading={OrgDetails.affOrgName}
                                        />
                                    }
                                    {/* {OrgDetails && OrgDetails.affOrgSuburb &&
                            <Descriptions >
                                <Descriptions.Item className="pb-0 pt-0" >
                                    {OrgDetails.affOrgSuburb}
                                </Descriptions.Item>
                            </Descriptions>
                        }

                        {OrgDetails && OrgDetails.affOrgStreet1 &&
                            <Descriptions >
                                <Descriptions.Item className="pb-0" >
                                    {OrgDetails.affOrgStreet1} {" "}{OrgDetails.affOrgStreet2}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {OrgDetails && OrgDetails.affOrgPhoneNo &&
                            <Descriptions >
                                <Descriptions.Item className="pb-0" >
                                    {OrgDetails.affOrgPhoneNo}
                                </Descriptions.Item>
                            </Descriptions>
                        }
                        {OrgDetails && OrgDetails.affOrgState &&
                            <Descriptions >
                                <Descriptions.Item  >
                                    {OrgDetails.affOrgState} {" "}{OrgDetails.affOrgPostalCode}
                                </Descriptions.Item>
                            </Descriptions>
                        } */}
                                </div>
                                <div className="col-sm pb-0" >

                                    {orgFees && orgFees.length > 0 && orgFees.map((orgFeesItem, orgFeesIndex) => {
                                        return (
                                            <div>
                                                <div className="col-sm-3" >
                                                    <InputWithHead
                                                        heading={"1"}
                                                    />
                                                </div>
                                                <div className="col-sm-3" >
                                                    <InputWithHead
                                                        heading={"$" + Number(orgFeesItem.aCasualFees + orgFeesItem.aSeasonalFees).toFixed(2)}
                                                    />
                                                </div>
                                                <div className="col-sm-3" >
                                                    <InputWithHead
                                                        heading={"$" + Number(orgFeesItem.aCasualGST + orgFeesItem.aSeasonalGST).toFixed(2)}
                                                    />
                                                </div>
                                                <div className="col-sm-3" >
                                                    <InputWithHead
                                                        heading={"$" + (Number(orgFeesItem.aCasualFees + orgFeesItem.aSeasonalFees) + Number(orgFeesItem.aCasualGST + orgFeesItem.aSeasonalGST))}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                {data.length - 1 !== participantIndex &&
                                    < Divider className="mt-0 mb-0" />
                                }
                            </div>
                        </div>


                    )
                }
                )
                }


            </div >
        )
    }

    subTotal = (data) => {
        let totalvalueArray = []
        let totalValue = 0
        if (data.length > 0) {
            console.log(data)

            for (let a in data) {
                let membership = data[a].membership
                let competitionFees = data[a].competitionOrganiser.fees
                let affilateFees = data[a].affiliate.fees
                for (let i in membership) {
                    let fees = membership[i].membershipProductTypes
                    for (let j in fees) {
                        console.log(Number(fees[j].mCasualFee + fees[j].mSeasonalFee))
                        totalvalueArray.push(Number(fees[j].mCasualFee + fees[j].mSeasonalFee))
                    }
                }
                for (let k in competitionFees) {
                    console.log(Number(competitionFees[k].cCasualFees + competitionFees[k].cSeasonalFees))
                    totalvalueArray.push(Number(competitionFees[k].cCasualFees + competitionFees[k].cSeasonalFees))
                }
                for (let l in affilateFees) {
                    console.log(Number(affilateFees[l].aCasualFees + affilateFees[l].aSeasonalFees))
                    totalvalueArray.push(Number(affilateFees[l].aCasualFees + affilateFees[l].aSeasonalFees))
                }
            }
            totalValue = totalvalueArray.reduce((a, b) => a + b, 0)
            console.log(totalValue, totalvalueArray)
            return totalValue
        }
        return totalValue
    }

    subGst = (data) => {
        let totalGstArray = []
        let totalGst = 0
        if (data.length > 0) {

            for (let a in data) {
                let membership = data[a].membership
                let competitionFees = data[a].competitionOrganiser.fees
                let affilateFees = data[a].affiliate.fees
                for (let i in membership) {
                    let fees = membership[i].membershipProductTypes
                    for (let j in fees) {
                        console.log(Number(fees[j].mCasualFee + fees[j].mSeasonalFee))
                        totalGstArray.push(Number(fees[j].mCasualFee + fees[j].mSeasonalFee))
                    }
                }
                for (let k in competitionFees) {
                    console.log(Number(competitionFees[k].cCasualFees + competitionFees[k].cSeasonalFees))
                    totalGstArray.push(Number(competitionFees[k].cCasualFees + competitionFees[k].cSeasonalFees))
                }
                for (let l in affilateFees) {
                    console.log(Number(affilateFees[l].aCasualFees + affilateFees[l].aSeasonalFees))
                    totalGstArray.push(Number(affilateFees[l].aCasualFees + affilateFees[l].aSeasonalFees))
                }
            }
            totalGst = totalGstArray.reduce((a, b) => a + b, 0)
            console.log(totalGst, totalGstArray)
            return totalGst
        }
        return totalGst

    }

    totalInvoiceView = (result) => {
        let data = result.length > 0 ? result : []
        let subValue = this.subTotal(data)
        // let subGst = this.subGst(data)

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
                                prefix="$"
                                style={{ display: "flex", justifyContent: 'flex-start' }}
                                heading={"$" + subValue}
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
                                heading={"$" + subValue / 10}
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
                                heading={"$" + Number(subValue + subValue / 10)}
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
        let result = this.props.commonState.getInvoicedata

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
                            {this.dropdownView(result)}

                            {this.contentView(result)}
                            {this.totalInvoiceView(result)}
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getInvoice
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        commonState: state.CommonReducerState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(RegistrationInvoice);

