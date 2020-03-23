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

const { Content } = Layout;
const { Option } = Select;




////Table columns
const columns = [
    {
        title: 'Rank',
        dataIndex: 'divisionId',
        key: 'divisionId',
        sorter: (a, b) => a.divisionId.length - b.divisionId.length,
    },
    {
        title: 'Team',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.length - b.name.length,

    },

    {
        title: 'P',
        dataIndex: 'P',
        key: 'P',
        sorter: (a, b) => a.P.length - b.P.length,

    },
    {
        title: 'W',
        dataIndex: 'W',
        key: 'W',
        sorter: (a, b) => a.W.length - b.W.length,


    },
    {
        title: 'L',
        dataIndex: 'L',
        key: 'L',
        sorter: (a, b) => a.L.length - b.L.length,
    },
    {
        title: 'D',
        dataIndex: 'D',
        key: 'D',
        sorter: (a, b) => a.D.length - b.D.length,


    },
    {
        title: 'FW',
        dataIndex: 'FW',
        key: 'FW',
        sorter: (a, b) => a.FW.length - b.FW.length,
    },
    {
        title: 'FL',
        dataIndex: 'FL',
        key: 'FL',
        sorter: (a, b) => a.FL.length - b.FL.length,


    },
    {
        title: 'F',
        dataIndex: 'F',
        key: 'F',
        sorter: (a, b) => a.F.length - b.F.length,
    },
    {
        title: 'A',
        dataIndex: 'A',
        key: 'A',
        sorter: (a, b) => a.A.length - b.A.length,


    },
    {
        title: 'PTS',
        dataIndex: 'PTS',
        key: 'PTS',
        sorter: (a, b) => a.PTS.length - b.PTS.length,
    },
    {
        title: '%',
        dataIndex: 'SMR',
        key: 'SMR',
        sorter: (a, b) => a.SMR.length - b.SMR.length,
        render: (SMR) => <span>{(JSON.parse(SMR) * 100).toFixed(2) + "%"}</span>
    },
];


class LiveScoreLadderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            division: "11A",

        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add"> {AppConstants.competitionladders}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div >
        )
    }

    componentDidMount() {
        // let competitionID = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())

        if (id !== null) {
            // this.props.getliveScoreDivisions(competitionID);
            this.props.getliveScoreDivisions(id);
        } else {
            history.push('/')
        }
    }

    divisionChange = (value) => {

        // let competitionID = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        // this.props.liveScoreLaddersListAction(competitionID, value.division)
        this.props.liveScoreLaddersListAction(id, value.division)
    }
    ///dropdown view containing dropdown
    dropdownView = () => {
        const { liveScoreLadderState } = this.props;
        let grade = liveScoreLadderState.liveScoreLadderDivisionData !== [] ? liveScoreLadderState.liveScoreLadderDivisionData : []
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <span className='year-select-heading'>{AppConstants.filterByDivision}:</span>
                {grade.length > 0 && <Select
                    className="year-select"
                    onChange={(division) => this.divisionChange({ division })}
                    defaultValue={grade[0].name}
                >
                    {grade.map((item) => (
                        <Option key={'selectDivision' + item.id} value={item.id}>
                            {item.name}
                        </Option>
                    ))}

                </Select>}
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
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        defaultCurrent={1}
                        total={8}
                    // onChange={this.handleTableChange}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"11"} />
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
    return bindActionCreators({ getliveScoreDivisions, liveScoreLaddersListAction }, dispatch)

}

function mapStatetoProps(state) {
    return {
        liveScoreLadderState: state.LiveScoreLadderState
    }
}
export default connect(mapStatetoProps, mapDispatchtoprops)((LiveScoreLadderList));
