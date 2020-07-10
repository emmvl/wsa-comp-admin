import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Radio, Select } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import history from "../../util/history";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from "../../customComponents/loader";
import { updateSelectedTeamPlayer, getYearAndQuickCompetitionAction } from "../../store/actions/competitionModuleAction/competitionQuickAction"
import ImportTeamPlayerModal from "../../customComponents/importTeamPlayerModal"
import { getYearAndCompetitionOwnAction } from '../../store/actions/appAction'
const { Option } = Select;
const { Header, Footer, Content } = Layout;

class QuickCompetitionInvitations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competition: "2019winter",
            importModalVisible: false,
            yearRefId: 1,
            competitionId: null

        }
    }

    componentDidMount() {
        let competitionId = this.props.location.state ? this.props.location.state.competitionUniqueKey : null
        let year = this.props.location.state && this.props.location.state.year
        if (competitionId) {
            this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, year, "own_competition")
            this.setState({
                competitionId: competitionId,
                yearRefId: year

            })
        } else {
            history.push("/quickCompetition")
        }

    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.quickCompetition2}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }

    //merge with exsiting competition
    mergeExistingCompetition = (subItem, seletedOption) => {
        const { own_CompetitionArr, } = this.props.appState
        if (subItem.id == 2 && seletedOption == 2) {
            return (
                <div>
                    <Select
                        style={{ width: '100%', paddingRight: 1, minWidth: 182, maxWidth: 300 }}
                        //   onChange={(associationAffilite) => {
                        //     this.props.add_editcompetitionFeeDeatils(
                        //       associationAffilite,
                        //       'associationAffilite'
                        //     );
                        //   }}
                        // value={associationLeague}
                        placeholder={AppConstants.selectComptition}
                        filterOption={false}
                        //   onSearch={(value) => {
                        //     this.onInviteeSearch(value, 3);
                        //   }}
                        showSearch={true}
                    >
                        {own_CompetitionArr.length > 0 && own_CompetitionArr.map((item, index) => {
                            return (
                                <Option key={index + item.competitionId} value={item.competitionId}>
                                    {item.competitionName}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
            )

        }
    }



    ////////form content view
    contentView = () => {
        const { teamPlayerArray, SelectedTeamPlayer, importModalVisible } = this.props.quickCompetitionState
        return (
            <div className="content-view pt-5 mt-0 ">
                <span className='form-heading'>{AppConstants.how_Add_teams_players}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) =>
                        this.props.updateSelectedTeamPlayer(
                            e.target.value,
                            'SelectedTeamPlayer'
                        )
                    }
                    value={SelectedTeamPlayer}
                >
                    {(teamPlayerArray || []).map(
                        (item, index) => {
                            return (
                                <div key={"playerArray" + index}>
                                    <Radio value={item.id}>{item.value}</Radio>
                                    {this.mergeExistingCompetition(
                                        item,
                                        SelectedTeamPlayer
                                    )}
                                </div>
                            )
                        }

                    )}
                </Radio.Group>
                <ImportTeamPlayerModal
                    onCancel={() => this.props.updateSelectedTeamPlayer("", "importModalVisible")}
                    visible={importModalVisible}
                    modalTitle={AppConstants.importTeamPlayer}
                    competitionId={this.state.competitionId}
                />

            </div>
        )
    }

    //on back button pressed
    onBackButton = () => {
        history.push('/quickCompetition');
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm-3" >
                            <div className="reg-add-save-button">
                                <Button type="cancel-button" htmlType="submit" onClick={() => this.onBackButton()} >{AppConstants.back}</Button>
                            </div>
                        </div>
                        <div className="col-sm-9" >
                            <div className="comp-buttons-view">
                                <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveAsDraft}</Button>
                                <Button className="open-reg-button" type="primary" onClick={() => this.onCompFormatPress()}>{AppConstants.addCompetitionFormat}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onCompFormatPress() {
        history.push("/quickCompetitionMatchFormat", { competitionUniqueKey: this.state.competitionId, year: this.state.yearRefId })
    }



    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
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
        updateSelectedTeamPlayer,
        getYearAndCompetitionOwnAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        quickCompetitionState: state.QuickCompetitionState,
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(QuickCompetitionInvitations);
