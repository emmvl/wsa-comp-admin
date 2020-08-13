import React, { Component } from "react";
import { Layout, Button, Table, Select, Input, Pagination, Icon, Checkbox } from 'antd';
import './umpire.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from "../../util/helpers";
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { refRoleTypes } from '../../util/refRoles'
import { getUmpireCompetiton, setUmpireCompition, setUmpireCompitionData } from '../../util/sessionStorage'
import ValidationConstants from "../../themes/validationConstant";
import history from "../../util/history";

const { Content, Footer } = Layout;
const { Option } = Select;
let this_obj = null;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const columns = [

    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'First Name',
        sorter: (a, b) => tableSort(a, b, 'firstName'),

    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'Last Name',
        sorter: (a, b) => tableSort(a, b, "lastName"),

    },
    {
        title: 'Umpire ID',
        dataIndex: 'umpireId',
        key: 'umpireId',
        sorter: (a, b) => tableSort(a, b, "umpireId"),

    },
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => tableSort(a, b, "matchId"),

    },
    {
        title: 'Verified By',
        dataIndex: 'verifiedBy',
        key: 'verifiedBy',
        sorter: (a, b) => tableSort(a, b, "verifiedBy"),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => tableSort(a, b, "status"),
    },
    {
        title: "Action",
        dataIndex: 'action',
        key: 'action',
        render: () =>
            <Checkbox
                className="single-checkbox"
                defaultChecked={false}
            >
            </Checkbox>

    }


];

const data = [
    {
        "firstName": "Umpire",
        "lastName": "One",
        "umpireId": "1342",
        "matchId": "2006",
        "verifiedBy": "",
        "status": "Paid",
    },
    {
        "firstName": "Umpire",
        "lastName": "Two",
        "umpireId": "1553",
        "matchId": "2020",
        "verifiedBy": "",
        "status": "Unpaid",
    }
]

class umpirePayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionid: null,
            searchText: "",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            year: '2019',
            roasterLoad: false,
            compArray: []
        }
        this_obj = this
    }

    componentDidMount() {
        let { organisationId, } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading === true && this.props.umpireCompetitionState.onLoad === false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id
                let compData = compList.length > 0 && compList[0]

                this.setState({ selectedComp: firstComp, loading: false })
            }
        }

    }


    ////////form content view
    contentView = () => {

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        // loading={this.props.umpireRoasterdState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                    // rowKey={(record, index) => "umpireListResult" + record.id + index}
                    />
                </div>
            </div>
        )
    }



    onChangeComp(compID) {
        let selectedComp = compID.comp

        this.setState({ selectedComp })

    }



    ///////view for breadcrumb
    headerView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.umpirePayments}
                            </span>
                        </div>

                        <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                            <div className="row">

                                <div className="col-sm pt-1">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <Input className="product-reg-search-input"
                                            // onChange={(e) => this.onChangeSearchText(e)}
                                            placeholder="Search..."
                                            // onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                            prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                            // onClick={() => this.onClickSearchIcon()}
                                            />}
                                            allowClear
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div >
        );
    };

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []

        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width" >
                    <div className="row">

                        {/* year List */}

                        {/* <div className="reg-col" >
                            <div className="reg-filter-col-cont">
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    className="year-select reg-filter-select1"
                                    // style={{ minWidth: 200 }}
                                    value={this.state.year}
                                >
                                    <Option value={'2019'}>{'2019'}</Option>
                                    <Option value={'2020'}>{'2020'}</Option>
                                </Select>
                            </div>
                        </div> */}

                        {/* competition List */}
                        <div className="col-sm-3" >
                            <div className="reg-filter-col-cont" >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    className="year-select reg-filter-select1 ml-3"
                                    style={{ minWidth: 200 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {
                                        competition.map((item) => {
                                            return <Option key={"competition" + item.id} value={item.id}>{item.longName}</Option>
                                        })
                                    }

                                </Select>
                            </div>
                        </div>

                        <div className="col-sm" >
                            <div className="comp-dashboard-botton-view-mobile"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                }}>
                                <Button
                                    type="primary"
                                    className="primary-add-comp-form"
                                >{AppConstants.bulkPayment}
                                </Button>

                                <div>
                                    <Checkbox
                                        className="single-checkbox"
                                        defaultChecked={false}
                                    >
                                        {'All'}
                                    </Checkbox>
                                </div>
                            </div>



                        </div>

                    </div>
                </div>
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width paddingBottom56px" >
                <div className="row" >
                    <div className="col-sm-3" >
                        <div className="reg-add-save-button">
                            {/* <NavLink to="/competitionPlayerGrades"> */}
                            <Button className="cancelBtnWidth" type="cancel-button"  >{AppConstants.cancel}</Button>
                            {/* </NavLink> */}
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button
                                className="publish-button save-draft-text"
                                type="primary"
                            >{AppConstants.save}
                            </Button>
                            {/* <NavLink to="/competitionCourtAndTimesAssign"> */}
                            <Button className="publish-button margin-top-disabled-button" type="primary">{AppConstants.submit}</Button>
                            {/* </NavLink> */}
                        </div>
                    </div>
                </div>
            </div >
        )
    }




    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"7"} />
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
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((umpirePayments));

