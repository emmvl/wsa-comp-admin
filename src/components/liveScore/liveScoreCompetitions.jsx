import React, { Component } from "react";
import { Layout, Button, Table, Select, Tag, Menu, Modal, Pagination, PageHeader } from 'antd';
import './liveScore.css';
import ColorsArray from '../../util/colorsArray'
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { getOrganisationData, setLiveScoreUmpireCompition, setLiveScoreUmpireCompitionData, setKeyForStateWideMessage } from "../../util/sessionStorage"
import { connect } from 'react-redux';
import { liveScoreCompetionActioninitiate, liveScoreCompetitionDeleteInitate } from '../../store/actions/LiveScoreAction/liveScoreCompetitionAction';
import Loader from '../../customComponents/loader'
import AppImages from "../../themes/appImages";
import {
    getOnlyYearListAction
} from "../../store/actions/appAction";
import { isArrayNotEmpty } from "../../util/helpers";
import { checkOrganisationLevel } from "../../util/permissions";

const { Content } = Layout;
const { Option } = Select;
const { confirm } = Modal
let this_Obj = null

//listeners for sorting
const listeners = (key) => ({
    onClick: () => tableSort(key),
});

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_Obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_Obj.state.sortBy === key && this_Obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }

    this_Obj.setState({ sortBy: sortBy, sortOrder: sortOrder });

    const body = {
        "paging": {
            "limit": 10,
            "offset": this_Obj.state.offsetData
        }
    }
    this_Obj.props.liveScoreCompetionActioninitiate(body, null, this_Obj.state.orgKey, null, sortBy, sortOrder)
}


const columnsOwned = [
    {
        title: "Name",
        dataIndex: "longName",
        key: "longName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('name'),
        render: (longName, record) => {
            return (

                <span style={{ cursor: "pointer" }} onClick={() => {
                    this_Obj.setCompetitionID(record)
                    this_Obj.props.history.push('/liveScoreDashboard')
                }} className="input-heading-add-another pt-0" >{longName}</span>

            )
        }
    },
    {
        title: "Divisions/Age",
        dataIndex: "divisions",
        key: "divisions",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('divisions'),
        render: divisions => {
            if (divisions != null) {
                var divisionArray = divisions.split(",")
                return (
                    <span>
                        {divisionArray != null ? divisionArray.map((data, index) => (
                            index <= 38 ? data ? <Tag
                                className="comp-dashboard-table-tag"
                                color={ColorsArray[index]}
                                key={data}
                            >
                                {data}
                            </Tag> : '' : <Tag
                                className="comp-dashboard-table-tag"
                                color={"#c2c2c2"}
                                key={data}
                            >
                                    {data}
                                </Tag>
                        )) : <></>}
                    </span>)
            } else {
                var divisionArray = []
            }

        }
    },

    {
        title: "Teams",
        dataIndex: "teams",
        key: "teamCount",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('teams'),
        render: (teams, record) =>
            <span style={{ cursor: "pointer" }} onClick={() => {
                this_Obj.setCompetitionID(record)
                this_Obj.props.history.push('/liveScoreDashboard')
            }} className="input-heading-add-another pt-0" >{teams}</span>
    },
    {
        title: "Players",
        dataIndex: "players",
        key: "playerCount",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('players'),
        render: (players, record) =>
            <span style={{ cursor: "pointer" }} onClick={() => {
                this_Obj.setCompetitionID(record)
                this_Obj.props.history.push('/liveScoreDashboard')
            }} className="input-heading-add-another pt-0" >{players}</span>
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners('status'),
        render: (status, record) =>
            <span style={{ cursor: "pointer" }} onClick={() => {
                this_Obj.setCompetitionID(record)
                this_Obj.props.history.push('/liveScoreDashboard')
            }} className="input-heading-add-another pt-0" >{status}</span>
    },
    {
        title: "Action",
        render: (data, record) => <Menu
            className="action-triple-dot-submenu"
            theme="light"
            mode="horizontal"
            style={{ lineHeight: '25px' }}
        >
            <Menu.SubMenu
                key="sub1"
                title={
                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                }
            >
                <Menu.Item onClick={() => this_Obj.setCompetitionID(record)} key={'1'}>
                    <NavLink to={{ pathname: "/liveScoreSettingsView", state: 'edit' }} ><span >Edit</span></NavLink>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(record)}>
                    <span >Delete</span>
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    }
];




class LiveScoreCompetitions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: null,
            onLoad: false,
            orgKey: getOrganisationData() ? getOrganisationData().organisationId : null,
            orgLevel: AppConstants.state,
            offsetData: 0
        }
        this_Obj = this

    }


    componentDidMount() {

        // if (isArrayNotEmpty(this.props.liveScoreCompetition.yearList)) {

        //     let selectedYear = this.props.liveScoreCompetition.yearList[0].id
        //     this.competitionListApi(selectedYear)
        //     this.setState({ year: selectedYear })
        // } else {
        //     this.props.getOnlyYearListAction(this.props.liveScoreCompetition.yearList)
        //     this.setState({ onLoad: true })
        // }
        this.competitionListApi()

        checkOrganisationLevel().then((value) => (
            this.setState({ orgLevel: value })
        ))
    }


    // componentDidUpdate(nextProps) {
    //     if (nextProps.liveScoreCompetition.yearList !== this.props.liveScoreCompetition.yearList) {
    //         if (this.props.liveScoreCompetition.loader == false && this.state.onLoad == true) {
    //             let selectedYear = this.props.liveScoreCompetition.yearList[0].id
    //             this.competitionListApi(selectedYear)
    //             this.setState({ onLoad: false, year: selectedYear })
    //         }
    //     }
    // }

    competitionListApi() {
        const body = {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }
        this.props.liveScoreCompetionActioninitiate(body, null, this.state.orgKey)

    }

    setCompetitionID = (competitiondata) => {
        localStorage.setItem("LiveScoreCompetiton", JSON.stringify(competitiondata))
        localStorage.removeItem('stateWideMessege')
        setLiveScoreUmpireCompition(competitiondata.id)
        setLiveScoreUmpireCompitionData(JSON.stringify(competitiondata))
    }

    CompetitonDelete = (data) => {
        this.props.liveScoreCompetitionDeleteInitate(data.id)
    }
    showDeleteConfirm = (record) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this competition?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.CompetitonDelete(record)
            },
            onCancel() {

            },
        });
    }

    /// Handle Pagination 
    handlePaggination(page) {

        let offset = page ? 10 * (page - 1) : 0;
        this.setState({
            offsetData: offset
        })
        const body = {
            "paging": {
                "limit": 10,
                "offset": offset
            }
        }

        this.props.liveScoreCompetionActioninitiate(body, this.state.year, this.state.orgKey)
    }

    onChnageYear = (evt) => {
        this.setState({ year: evt.year })
        this.handlePaggination()
    }


    ///dropdown view containing dropdown and next screen navigation button/text
    dropdownButtonView = () => {
        let yearList = this.props.liveScoreCompetition.yearList
        console.log(this.state.orgLevel, 'this.state.orgLevel')
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width" style={{
                    display: "flex", maxWidth: "99%",
                    justifyContent: "flex-end"
                }}>
                    {/* <div className="row"> */}

                    {/* <div className="col-sm">
                            <div className="year-select-heading-view">
                                <span className="year-select-heading">
                                    {AppConstants.year}:
                                 </span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 75 }}
                                    onChange={year => this.onChnageYear({ year })}
                                    value={this.state.year}
                                >{
                                        isArrayNotEmpty(yearList) && yearList.map(item => {
                                            return (
                                                <Option key={"yearRefId" + item.id} value={item.id}>
                                                    {item.description}
                                                </Option>
                                            );
                                        })}

                                </Select>
                            </div>
                        </div> */}
                    <div className="row">

                        {this.state.orgLevel === "state" && <div className="col-sm">
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

                                <Button onClick={() => {
                                    setKeyForStateWideMessage('stateWideMessege')
                                    this.props.history.push({
                                        pathname: '/liveScoreNewsList',
                                        state: { screenKey: 'stateWideMsg' }
                                    })
                                }}
                                    className="primary-add-comp-form" type="primary">
                                    {AppConstants.stateWideMsg}
                                </Button>


                            </div>
                        </div>}

                        <div className="col-sm">
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
                                <Button
                                    onClick={() => {
                                        localStorage.removeItem('LiveScoreCompetiton')
                                        this.props.history.push('/liveScoreSettingsView', 'add')
                                    }}
                                    className="primary-add-comp-form" type="primary">
                                    + {AppConstants.addCompetition}
                                </Button>

                            </div>
                        </div>
                        <div className="col-sm">
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
                                <Button className="primary-add-comp-form" type="primary">
                                    + {AppConstants.replicateCompetition}
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* </div> */}

                </div>
            </div>
        );
    };
    ////////ownedView view for competition

    ownedView = () => {

        // if (this.props.liveScoreCompetition.loader) {
        //     return <Loader visible={this.props.liveScoreCompetition.loader} />
        // }
        // else {
        let currentPage = this.props.liveScoreCompetition.List ? this.props.liveScoreCompetition.List.page.currentPage : 0
        let totalpage = this.props.liveScoreCompetition.List ? this.props.liveScoreCompetition.List.page.totalCount : 0
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columnsOwned}
                        dataSource={this.props.liveScoreCompetition.List && this.props.liveScoreCompetition.List.competitions}
                        pagination={false}
                        loading={this.props.liveScoreCompetition.loader}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={currentPage}
                        total={totalpage}
                        onChange={(page) => this.handlePaggination(page)}
                    // defaultPageSize={10}
                    />
                </div>
            </div>
        );
        // }
    };



    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                {/* <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"1"} /> */}
                {this.dropdownButtonView()}
                {this.ownedView()}
            </div >
        );
    }
}
function mapStatetoProps(state) {
    return {
        liveScoreCompetition: state.liveScoreCompetition
    }
}
export default connect(
    mapStatetoProps,
    {
        liveScoreCompetionActioninitiate,
        liveScoreCompetitionDeleteInitate,
        getOnlyYearListAction,
    })(LiveScoreCompetitions);

