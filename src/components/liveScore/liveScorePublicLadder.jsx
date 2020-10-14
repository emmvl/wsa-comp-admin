import React, { Component } from "react";
import { Layout, Breadcrumb, Pagination, Table, Select } from 'antd';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import { liveScoreLaddersListAction } from '../../store/actions/LiveScoreAction/liveScoreLadderAction'
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'
import { isArrayNotEmpty } from '../../util/helpers'
import { getLiveScoreDivisionList } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'

import { fixtureCompetitionListAction } from "../../store/actions/LiveScoreAction/LiveScoreFixtureAction"
const { Content } = Layout;
const { Option } = Select;

/////function to sort table column
function tableSort(a, b, key) {
    //if (a[key] && b[key]) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
    //}

}


////Table columns
const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
        sorter: (a, b) => tableSort(a, b, "rank"),
    },
    {
        title: 'Team',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => tableSort(a, b, "name"),

    },

    {
        title: 'P',
        dataIndex: 'P',
        key: 'P',
        sorter: (a, b) => tableSort(a, b, "P"),

    },
    {
        title: 'W',
        dataIndex: 'W',
        key: 'W',
        sorter: (a, b) => tableSort(a, b, "W"),


    },
    {
        title: 'L',
        dataIndex: 'L',
        key: 'L',
        sorter: (a, b) => tableSort(a, b, "L"),
    },
    {
        title: 'D',
        dataIndex: 'D',
        key: 'D',
        sorter: (a, b) => tableSort(a, b, "D"),


    },
    {
        title: 'FW',
        dataIndex: 'FW',
        key: 'FW',
        sorter: (a, b) => tableSort(a, b, "FW"),

    },
    {
        title: 'FL',
        dataIndex: 'FL',
        key: 'FL',
        sorter: (a, b) => tableSort(a, b, "FL"),

    },
    {
        title: 'F',
        dataIndex: 'F',
        key: 'F',
        sorter: (a, b) => tableSort(a, b, "F"),
    },
    {
        title: 'A',
        dataIndex: 'A',
        key: 'A',
        sorter: (a, b) => tableSort(a, b, "A"),


    },
    {
        title: 'PTS',
        dataIndex: 'PTS',
        key: 'PTS',
        sorter: (a, b) => tableSort(a, b, "PTS"),
    },
    {
        title: '%',
        dataIndex: 'SMR',
        key: 'SMR',
        sorter: (a, b) => tableSort(a, b, "SMR"),
        render: (SMR) => <span>{(JSON.parse(SMR) * 100).toFixed(2) + "%"}</span>
    },
];


class LiveScorePublicLadder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            division: "",
            loadding: false,
            competitionId: null,
            competitionUniqueKey : null,
            gameTimeTracking: false,
            onCompLoad: false,
            onDivisionLoad: false,
            selectedComp: null
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add"> {AppConstants.competitionladders}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        // let compParams = this.props.location.search.split("?competitionId=")
        // let compKey = compParams[1]
        // this.setState({ loadding: true , competitionId: 1 , competitionUniqueKey :compKey})
        // this.props.getLiveScoreDivisionList(1, "20b91f98-3f12-41c1-aeeb-70c9d6f4fa3d")

        // this.getCompDetails().then((res) => {
        //     let params = url.split("?");;
        //     let resp = res? JSON.parse(res) : null
        //     // let compKey = resp && resp.uniqueKey ? resp.uniqueKey :"20b91f98-3f12-41c1-aeeb-70c9d6f4fa3d"
        //     let compId = resp ? resp.id : 1
        //     this.setState({ competitionId: compId , competitionUniqueKey :compKey})
        //     this.props.getLiveScoreDivisionList(compId, compKey)
        // })

        let orgParam = this.props.location.search.split("?organisationId=")
        let orgId = orgParam[1]

        this.setState({ onCompLoad: true })
        this.props.fixtureCompetitionListAction(orgId)
    }

    async getCompDetails() {
        let compDetails = await getLiveScoreCompetiton()
        return compDetails
    }

    // componentDidUpdate(nextProps) {
    //     if (nextProps.liveScoreLadderState.liveScoreLadderDivisionData !== this.props.liveScoreLadderState.liveScoreLadderDivisionData) {
    //         if (this.state.loadding == true && this.props.liveScoreLadderState.onLoad == false) {
    //             let divisionArray = this.props.liveScoreLadderState.liveScoreLadderDivisionData
    //             let divisionId = isArrayNotEmpty(divisionArray) ? divisionArray[0].id : null
    //             this.props.liveScoreLaddersListAction(this.state.competitionId, divisionId, this.state.competitionUniqueKey)
    //             this.setState({ loadding: false })
    //         }
    //     }
    // }

    componentDidUpdate(nextProps) {
        if (nextProps.liveScoreFixturCompState !== this.props.liveScoreFixturCompState) {
            if (this.state.onCompLoad == true && this.props.liveScoreFixturCompState.onLoad == false) {
                let firstComp = this.props.liveScoreFixturCompState.comptitionList && this.props.liveScoreFixturCompState.comptitionList[0].id
                let compKey  = this.props.liveScoreFixturCompState.comptitionList && this.props.liveScoreFixturCompState.comptitionList[0].competitionUniqueKey
                this.props.getLiveScoreDivisionList(firstComp)
                this.setState({ selectedComp: firstComp, onCompLoad: false, onDivisionLoad: true,competitionUniqueKey:compKey })
            }
        }

        if (this.props.liveScoreLadderState !== nextProps.liveScoreLadderState) {
            if (this.props.liveScoreLadderState.onLoad == false && this.state.onDivisionLoad == true) {

                if (this.props.liveScoreLadderState.liveScoreLadderDivisionData.length > 0) {
                    let division = this.props.liveScoreLadderState.liveScoreLadderDivisionData[0].id
                    this.setState({ onDivisionLoad: false, division })
                    this.props.liveScoreLaddersListAction(this.state.selectedComp, division, this.state.competitionUniqueKey)
                }
            }
        }
    }

    onChangeComp(compID) {
        let selectedComp = compID.comp
        let compKey = compID.competitionUniqueKey
        this.props.getLiveScoreDivisionList(selectedComp)
        this.setState({ selectedComp, onDivisionLoad: true, division: null, competitionUniqueKey:compKey  })

    }


    changeDivision(divisionId) {
        let division = divisionId.division
        this.props.liveScoreLaddersListAction(this.state.competitionId, division, this.state.competitionUniqueKey)
        this.setState({ division })
    }


 ///dropdown view containing all the dropdown of header
 dropdownView = () => {
    const { liveScoreLadderState } = this.props;
    let competition = this.props.liveScoreFixturCompState.comptitionList ? this.props.liveScoreFixturCompState.comptitionList : []
    let division =isArrayNotEmpty(liveScoreLadderState.liveScoreLadderDivisionData) ? liveScoreLadderState.liveScoreLadderDivisionData : []
    return (
        <div className="comp-player-grades-header-drop-down-view">
            <div className="row">
                <div className="col-sm-4">
                    <div className="com-year-select-heading-view">
                        <span className='year-select-heading'>{AppConstants.competition}:</span>
                        <Select
                            className="year-select"
                            style={{ minWidth: 160 }}
                            onChange={(comp) => this.onChangeComp({ comp })}
                            value={this.state.selectedComp}
                        >
                            {competition.map((item) => {
                                return <Option value={item.id}>{item.longName}</Option>
                            })}
                        </Select>
                    </div>
                </div>
                <div className="col-sm-2">
                    <div style={{
                        width: "100%", display: "flex",
                        flexDirection: "row",
                        alignItems: "center", marginRight: 50
                    }}>
                        <span className='year-select-heading'>{AppConstants.division}:</span>
                        <Select
                            className="year-select"
                            style={{ minWidth: 100 }}
                            onChange={(division) => this.changeDivision({ division })}
                            value={this.state.division}
                        >{
                                division.map((item) => {
                                    return <Option value={item.id}>{item.name}</Option>
                                })
                            }

                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}



    ////////form content view
    contentView = () => {
        const { liveScoreLadderState } = this.props;

        let DATA = liveScoreLadderState.liveScoreLadderListData
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table loading={this.props.liveScoreLadderState.onLoad == true ? true : false} className="home-dashboard-table" columns={columns} dataSource={DATA} pagination={false}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    isManuNotVisible = {true}
                // menuName={AppConstants.liveScores}
                 />
                {/* <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="11" /> */}
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>

        );
    }
}
function mapDispatchtoprops(dispatch) {
    return bindActionCreators({ getliveScoreDivisions, liveScoreLaddersListAction, getLiveScoreDivisionList,fixtureCompetitionListAction }, dispatch)

}

function mapStatetoProps(state) {
    return {
        liveScoreLadderState: state.LiveScoreLadderState,
        liveScoreFixturCompState: state.LiveScoreFixturCompState,
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScorePublicLadder));
