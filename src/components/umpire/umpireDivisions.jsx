import React, { Component } from "react"
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout, Button, Select, Breadcrumb, Form, Radio, } from 'antd';

import './umpire.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage'
import { isArrayNotEmpty } from "../../util/helpers";
import history from "util/history";
import { getRefBadgeData } from '../../store/actions/appAction'

const { Header, Footer, } = Layout
const { Option } = Select

class UmpireDivisions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            umpPool: "A Grade",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null
        }
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
        this.props.getRefBadgeData()
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id
                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }
                let compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey })
            }
        }
    }

    // onChangeComp(data) {
    //     this.setState({ selectedComp: data.comp })
    // }

    headerView = () => {
        return (
            <div className="header-view divisions">
                <Header className="form-header-view d-flex bg-transparent align-items-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.umpirePoolsDivision}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    onChangeComp(compID) {
        let selectedComp = compID.comp
        setUmpireCompId(selectedComp)
        let compKey = compID.competitionUniqueKey

        this.setState({ selectedComp, competitionUniqueKey: compKey })
    }

    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-venue-courts-dropdown-view mt-0 ">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="w-ft d-flex flex-row align-items-center" style={{ marginBottom: 12 }}>
                                <span className="year-select-heading">
                                    {AppConstants.competition}:
                                </span>

                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {competition.map((item) => (
                                        <Option key={'competition_' + item.id} value={item.id}>{item.longName}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    onChangeUmpirePools(data) {
        this.setState({ umpPool: data.umpirePool })
    }

    badgeView(badgeDat, index) {
        return (
            <div className="row pt-3" key={'badgeDat' + index}>
                <div className='col-sm-3 division-table-field-view'>
                    <InputWithHead heading={badgeDat.description} />
                </div>
                <div className="col-sm">
                    <Select
                        placeholder="Select"
                        mode="multiple"
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    >
                        <Option value="a">A Grade</Option>
                        <Option value="b">B Grade</Option>
                        <Option value="c">C Grade</Option>
                    </Select>
                </div>
            </div>
        )
    }

    contentView = () => {
        const { badgeData } = this.props.appState
        let badge = isArrayNotEmpty(badgeData) ? badgeData : []
        return (
            <div className="content-view pt-5">

                <span className='text-heading-large pt-3 mb-0' >{AppConstants.umpirePools}</span>

                {badge.map((item, index) => (
                    this.badgeView(item, index)
                ))}

                <div className="row pt-3">
                    <div className='col-sm-3 division-table-field-view'>
                        <InputWithHead heading={AppConstants.umpireCoach} />
                    </div>
                    <div className="col-sm">
                        <Select
                            placeholder="Select"
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            // onChange={recordUmpire => this.props.onChangeUmpirePools({ key: "recordUmpire", data: recordUmpire })}
                            // value={this.state.umpPool}
                        >
                            <Option value="Gradeaa">A Grade</Option>
                            <Option value="Gradebb">B Grade</Option>
                            <Option value="Gradecc">C Grade</Option>
                        </Select>
                    </div>
                </div>
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button className="publish-button save-draft-text" type="primary" htmlType="submit">
                                {AppConstants.save}
                            </Button>
                            <Button onClick={() => history.push("/umpireDashboard")} className="open-reg-button" type="primary" htmlType="submit">
                                {AppConstants.createRoster}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render = () => {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="4" />
                {/* <Loader visible={this.props.liveScoreSetting.loader} /> */}
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
                    <Form autoComplete="off" onFinish={this.handleSubmit} className="login-form">
                        {/* <Form onSubmit={this.checkSubmit} noValidate="novalidate" className="login-form"> */}
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
        umpireCompetitionListAction,
        getRefBadgeData
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        appState: state.AppState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpireDivisions);
