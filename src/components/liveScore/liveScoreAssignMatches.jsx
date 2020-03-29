import React, { Component } from "react";
import { Layout, Button, Table, Breadcrumb, Pagination, Select } from "antd";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { liveScore_MatchFormate } from '../../themes/dateformate'
import { assignMatchesAction, changeAssignStatus } from '../../store/actions/LiveScoreAction/liveScoreScorerAction'
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import AppImages from "../../themes/appImages";
import history from "../../util/history";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { parseTwoDigitYear } from "moment";

const { Content } = Layout;
const { Option } = Select;

var this_obj = null

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

const matches = [
    {
        "id": 1923,
        "team1Score": null,
        "team2Score": null,
        "startTime": null,
        "team1Id": null,
        "team2Id": null,
        "competitionId": null,
        "divisionId": null,
        "venueCourtId": null,
        "type": null,
        "matchDuration": null,
        "breakDuration": null,
        "mnbMatchId": null,
        "mainBreakDuration": null,
        "scorerStatus": "SCORER1",
        "mnbPushed": null,
        "created_at": "2020-03-17T10:13:38.000Z",
        "updated_at": "2020-03-17T10:13:38.000Z",
        "deleted_at": null,
        "extraTimeDuration": null,
        "matchEnded": 0,
        "matchStatus": null,
        "endTime": null,
        "team1ResultId": null,
        "team2ResultId": null,
        "roundId": null,
        "originalStartTime": null,
        "pauseStartTime": null,
        "totalPausedMs": 0,
        "centrePassStatus": null,
        "centrePassWonBy": null,
        "team1": {
            "id": 142,
            "name": "Wakehurst S05",
            "logoUrl": "https://firebasestorage.googleapis.com/v0/b/world-sport-action.appspot.com/o/MWNA%2FClub%20Logos%2Flogo_0000_wakehurst.jpg?alt=media&token=6a5cda80-3a28-4ef4-aef9-ce897770b2b6"
        },
        "team2": {
            "id": 562,
            "name": "Ambulance",
            "logoUrl": "https://www.googleapis.com/download/storage/v1/b/world-sport-action.appspot.com/o/Ambulance%2Fteam_562.jpeg?generation=1585172673468157&alt=media"
        },
        "scorer1": null,
        "scorer2": null
    },
]


///columens data
// const 

class LiveScoreAssignMatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter:'',
            competitionId: 0,
            teamID : this.props.location.state ? this.props.location.state.teams : null,
            columns:[

                {
                    title: 'Match Id',
                    dataIndex: 'id',
                    key: 'id',
                    sorter: (a, b) => tableSort(a, b, "id"),
                    render: (id) => <NavLink to={{
                        pathname: '/liveScoreMatchDetails',
                        state: { matchId: id }
                    }} >
                        <span class="input-heading-add-another pt-0" >{id}</span>
                    </NavLink>
                },
                {
                    title: 'Start Time',
                    dataIndex: 'startTime',
                    key: 'startTime',
                    sorter: (a, b) => tableSort(a, b, "startTime"),
                    render: (startTime) =>
                        <span>{startTime ? liveScore_MatchFormate(startTime) : ""}</span>
                },
                {
                    title: 'Team 1',
                    dataIndex: 'team1',
                    key: 'team1',
                    sorter: (a, b) => tableSort(a, b, "team1"),
                    render: (team1, records, index) => {
                        return (
                            <div className="row" style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
                                <div className="col-sm-1">
                                    <img className="dot-image"
                                        src={records.scorer1 ? records.scorer1.rosterStatus = "YES" ? AppImages.greenDot : AppImages.redDot : AppImages.greyDot}
                                        alt="" width="12" height="12" />
                                </div>
                                <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-start', }}>
                                    <span style={{overflowX: "auto" ,whiteSpace: "nowrap"}} class="input-heading-add-another pt-0 " >{records.team1.name}</span>
                                </div>
                                <div className="col-sm-2" >
                                <span style={{textDecoration:"underline"}} onClick={()=>this.onChangeStatus(index, records)} class="input-heading-add-another pt-0" >{records.scorer1? "Assign": "Unassign"}</span>
                                </div>
                            </div>
                        )
                    }
                },
                //  {
                //     title: '',
                //     dataIndex: 'scorer',
                //     key: 'scorer',
                //     render: (team1, records, index) => {
                //         return <span onClick={()=>this.onChangeStatus(index, records)} class="input-heading-add-another pt-0" >{records.scorer1? "Assign": "Unassign"}</span>
                // }
            
            // {
            //     title: 'Team 2',
            //     dataIndex: 'team2',
            //     key: 'team2',
            //     sorter: (a, b) => tableSort(a, b, "team2"),
            //     render: (team2, records) => {
            //         if(records.scorer2){  
            //             return (
            //             <div className="row" style={{ display: 'flex', justifyContent: 'center', width: '50%' }}>
            //                 <div className="col-sm-1">
            //                     <img className="dot-image"
            //                         src={records.scorer1 ? records.scorer2.rosterStatus = "YES" ? AppImages.greenDot : AppImages.redDot : AppImages.greyDot}
            //                         alt="" width="12" height="12" />
            //                 </div>
            //                 <div className="col-sm" style={{ display: 'flex', justifyContent: 'flex-start', }}>
            //                     <span class="input-heading-add-another pt-0" >{records.team2.name}</span>
            //                 </div>
            //             </div>
            //         )
            //         }else{
            //             return(
            //                 <span/>
            //                 )
            //         }
            //     }
            // },
            //  {
            //     title: '',
            //     dataIndex: 'scorer',
            //     key: 'scorer',
            //     render: (team1, records, index) => {
            //         if(records.scorer2){
            //             return <span onClick={()=>this.onChangeStatus(index, records)} class="input-heading-add-another pt-0" >{records.scorer2? "Assign": "Unassign"}</span>
            //         }
            //         else{
            //             return <span/>
            //         }
            // }
            // }

            ],
            lodding: false
            
        };
        console.log( this.props.location.state)
        // this_obj = this
    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({lodding:true})
        const body = {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }
        this.props.assignMatchesAction(id, this.state.teamID, body)
    }

    componentDidUpdate(nextProps){
        // if(nextProps.liveScoreScorerState.assignMatches !== this.props.liveScoreScorerState.assignMatches ){
        //     if(this.state.lodding == true && this.props.liveScoreScorerState.onLoad == false){
        //         this.setState({lodding:false})
        //         let array = this.props.liveScoreScorerState.assignMatches
        //         // this.addColums(array)
        //     }
        // }
    }

    /// on status change 
    onChangeStatus(index, data){
        // alert(index)
        
        this.props.changeAssignStatus(index, data,4, this.state.teamID )
    
    }




    /// Add columns

    addColums(array){
        const newColumn = this.state.columns
        for(let i in array){
            // if
        }
    }


    /// On change values  
    handlePaggination=(page)=>{
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({lodding:true})
        const body = {
            "paging": {
                "limit": 10,
                "offset": offset
            },
            "searchText": ""
        }
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.assignMatchesAction(id, this.state.teamID, body)
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                < div className="row" >
                    <div className="col-sm" style={{ alignSelf: 'center' }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.assignMatches}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm" style={{
                        display: "flex",
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}>
                        <div className="row">
                            <Select
                                className="year-select"
                                style={{ display: "flex", alignItems: "flex-start" }}
                                // onChange={(selectStatus) => this.setState({ selectStatus })}
                                // onChange={(filter) => this.setFilterValue({ filter })}
                                value={this.state.filter} >
                                <Option value={AppConstants.period}>{AppConstants.periods}</Option>
                                <Option value={AppConstants.minute}>{AppConstants.minutes}</Option>
                                <Option value={AppConstants.totalGame}>{AppConstants.totalGames}</Option>
                            </Select>

                            
                        </div>
                        </div>
                </div >
            </div >
        )
    }

    ////////tableView view for Game Time list
    tableView = () => {
        let matcheList = this.props.liveScoreScorerState
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={matcheList.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={this.state.columns}
                        dataSource={matcheList.assignMatches}
                        pagination={false}
                    />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }} >
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            current={1}
                            total={matcheList.assignMatchTotalCount}
                            onChange={(page) => this.handlePaggination(page)}
                        // defaultPageSize={10}

                        />
                    </div>
                </div>
            </div>
        );
    };

    ////main render method
    render() {
        
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"5"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ assignMatchesAction , changeAssignStatus}, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreScorerState: state.LiveScoreScorerState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScoreAssignMatch));

