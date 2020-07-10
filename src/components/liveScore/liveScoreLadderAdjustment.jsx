import React, { Component } from "react"
import { Layout, Button, Select, Breadcrumb, Form } from 'antd';
import './liveScore.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppImages from "../../themes/appImages";
import { updateLadderSetting } from '../../store/actions/LiveScoreAction/liveScoreLadderAction'
import { isArrayNotEmpty } from "../../util/helpers";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { getLiveScoreDivisionList } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction'

const { Header, Footer } = Layout
const { Option } = Select;

class LiveScoreLadderAdjustment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            competitionId: null,
            loadding: true,
            divisionId: null
        }
    }

    componentDidMount() {
        this.props.updateLadderSetting({ key: 'refresh' })

        // const { id } = JSON.parse(getLiveScoreCompetiton())
        // this.setState({ competitionId: id })
        // if (id !== null) {
        //     this.props.getLiveScoreDivisionList(id)
        //     this.setState({ loadding: true })
        // }
    }

    // componentDidUpdate(nextProps) {
    //     if (nextProps.liveScoreLadderState.liveScoreLadderDivisionData !== this.props.liveScoreLadderState.liveScoreLadderDivisionData) {
    //         if (this.state.loadding == true && this.props.liveScoreLadderState.onLoad == false) {
    //             const { id, uniqueKey } = JSON.parse(getLiveScoreCompetiton())
    //             let divisionArray = this.props.liveScoreLadderState.liveScoreLadderDivisionData
    //             let divisionId = isArrayNotEmpty(divisionArray) ? divisionArray[0].id : null
    //             this.props.getliveScoreTeams(id, divisionId)
    //             this.setState({ loadding: false })
    //         }
    //     }
    // }

    ///////view for breadcrumb
    headerView = () => {

        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.ladderAdjustment}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    changeDivision(divisionId) {
        this.props.updateLadderSetting({ data: divisionId, key: 'divisionId' })
        this.props.getliveScoreTeams(this.state.competitionId, divisionId)

    }

    dropdownView = () => {
        // const { ladderDivisionList, divisionId } = this.props.liveScoreLadderState
        // let divisionListArr = isArrayNotEmpty(ladderDivisionList) ? ladderDivisionList : []
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                style={{
                                    width: "fit-content",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <span className="year-select-heading ">
                                    {AppConstants.division}:
                                   </span>

                                <Select
                                    className="year-select"
                                    style={{ minWidth: 80 }}
                                // onChange={(divisionId) => this.changeDivision(divisionId)}
                                // value={divisionId}
                                >
                                    {/* {
                                        divisionListArr.map((item, index) => {
                                            return <Option key={"division" + item.id} value={item.id}>{item.name}</Option>
                                        })
                                    } */}
                                </Select>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    ////////form content view
    contentView = () => {

        const { ladderData, teamResult } = this.props.liveScoreLadderState
        let addNewLadder = isArrayNotEmpty(ladderData) ? ladderData : [];
        // let teamList = isArrayNotEmpty(teamResult) ? teamResult : []

        return (
            <div className="content-view pt-4">

                {addNewLadder.map((ladder, index) => (
                    <div className="inside-container-view">
                        <div className="row pt-3" >
                            <div className='col-sm-3 division-table-field-view'>
                                <InputWithHead
                                    heading={AppConstants.teamName}
                                />
                            </div>
                            <div className="col-sm" >
                                {/* <InputWithHead placeholder={AppConstants.teamName}
                                    onChange={(e) => this.props.updateLadderSetting({ data: e.target.value, index: index, key: 'teamName' })}
                                    value={ladderData[index] && ladderData[index].teamName}
                                /> */}

                                <Select

                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%" }}
                                    // onChange={(teamId) => this.props.updateLadderSetting({ data: teamId, index: index, key: 'teamId' })}
                                    // value={[741, 738]}
                                    // value={ladderData[index] && ladderData[index].teamId}
                                    showSearch
                                    optionFilterProp="children"

                                >
                                    {/* {teamList.map((item, index) => (
                                        < Option key={'teamList' + index} value={item.id} > {item.name}</Option>
                                    ))
                                    } */}
                                </Select>

                            </div>
                        </div>

                        <div className="row pt-3" >
                            <div className='col-sm-3 division-table-field-view'>
                                <InputWithHead heading={AppConstants.points} />
                            </div>
                            <div className="col-sm" >
                                <InputWithHead
                                    placeholder={AppConstants.points}
                                    onChange={(e) => this.props.updateLadderSetting({ data: e.target.value, index: index, key: 'points' })}
                                    value={ladderData[index] && ladderData[index].points} />
                            </div>
                        </div>

                        <div className="row pt-3" >
                            <div className='col-sm-3 division-table-field-view'>
                                <InputWithHead heading={AppConstants.reasonForChange} />
                            </div>
                            <div className="col-sm" >
                                <InputWithHead
                                    placeholder={AppConstants.reasonForChange}
                                    onChange={(e) => this.props.updateLadderSetting({ data: e.target.value, index: index, key: 'reasonforChange' })}
                                    value={ladderData[index] && ladderData[index].reasonforChange} />
                            </div>
                        </div>
                    </div>
                ))}



                <div  >
                    <span onClick={() => this.props.updateLadderSetting({ data: null, key: 'addLadderAdjustment' })} className='input-heading-add-another pointer'>+ {AppConstants.addNewAdjustment}</span>
                </div>

            </div>
        )
    };

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {


        return (
            <div className="fluid-width">
                {!this.state.membershipIsUsed &&
                    <div className="footer-view">
                        <div className="row">
                            {/* <div className="col-sm">
                                <div className="reg-add-save-button">
                                    <Button type="cancel-button">{AppConstants.cancel}</Button>

                                </div>
                            </div> */}
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button
                                        className="user-approval-button" type="primary" htmlType="submit" >
                                        {AppConstants.save}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    };

    render = () => {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"11"} />
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <div className="formView">{this.contentView()}</div>
                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateLadderSetting,
        getliveScoreTeams,
        getLiveScoreDivisionList
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreLadderState: state.LiveScoreLadderState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreLadderAdjustment));