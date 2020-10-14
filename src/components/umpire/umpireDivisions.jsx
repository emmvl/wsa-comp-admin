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

const { Header, Footer, } = Layout
const { Option } = Select

const allocatePools = [
    { id: 1, name: "Division" },
    { id: 2, name: "Grades" }
]

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
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading == true && this.props.umpireCompetitionState.onLoad == false) {
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
                            <div
                                style={{
                                    width: "fit-content",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: "12px"
                                }}
                            >
                                <span className="year-select-heading ">
                                    {AppConstants.competition}:
                                   </span>

                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}

                                >
                                    {competition.map((item, index) => {
                                        return <Option key={"comp" + index} value={item.id}>{item.longName}</Option>
                                    })}
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

    contentView = () => {
        return (
            <div className="content-view pt-5">
                <span className="text-heading-large">{AppConstants.allocatePools}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    // onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionTypeRefId")}
                    // onChange={e => this.setPools(e.target.value)}
                    // setFieldsValue={detailsData.competitionTypeRefId}
                    // disabled={compDetailDisable}
                >
                    {allocatePools.map((item, index) => {
                        return (
                            <Radio key={"pools" + index} value={item.id}>{item.name}</Radio>
                        )
                    })}
                </Radio.Group>

                <span className='text-heading-large pt-3 mb-0' >{AppConstants.umpirePools}</span>
                <div className="row pt-3">
                    <div className='col-sm-3 division-table-field-view'>
                        <InputWithHead heading={AppConstants.badgeAA} />
                    </div>
                    <div className="col-sm">
                        <Select
                            placeholder="Select"
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                        >
                            <Option value="a">A Grade</Option>
                            <Option value="b">B Grade</Option>
                            <Option value="c">C Grade</Option>
                        </Select>
                    </div>
                </div>
                <div className="row pt-3">
                    <div className='col-sm-3 division-table-field-view'>
                        <InputWithHead heading={AppConstants.badgeA} />
                    </div>
                    <div className="col-sm">
                        <Select
                            placeholder="Select"
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                            // onChange={umpirePool => this.onChangeUmpirePools({ key: "recordUmpire", data: umpirePool })}
                            // value={this.state.umpPool}
                        >
                            <Option value="aGrade">A Grade</Option>
                            <Option value="bGrade">B Grade</Option>
                            <Option value="cGrade">C Grade</Option>
                        </Select>
                    </div>
                </div>

                <div className="row pt-3">
                    <div className='col-sm-3 division-table-field-view'>
                        <InputWithHead heading={AppConstants.badgeB} />
                    </div>
                    <div className="col-sm">
                        <Select
                            placeholder="Select"
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                            // onChange={recordUmpire => this.props.onChangeUmpirePools({ key: "recordUmpire", data: recordUmpire })}
                            // value={this.state.umpPool}
                        >
                            <Option value="aGradea">A Grade</Option>
                            <Option value="bGradeb">B Grade</Option>
                            <Option value="cGradec">C Grade</Option>
                        </Select>
                    </div>
                </div>

                <div className="row pt-3">
                    <div className='col-sm-3 division-table-field-view'>
                        <InputWithHead heading={AppConstants.badgeC} />
                    </div>
                    <div className="col-sm">
                        <Select
                            placeholder="Select"
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                            // onChange={recordUmpire => this.props.onChangeUmpirePools({ key: "recordUmpire", data: recordUmpire })}
                            // value={this.state.umpPool}
                        >
                            <Option value="aGradeaa">A Grade</Option>
                            <Option value="bGradebb">B Grade</Option>
                            <Option value="cGradecc">C Grade</Option>
                        </Select>
                    </div>
                </div>

                <div className="row pt-3">
                    <div className='col-sm-3 division-table-field-view'>
                        <InputWithHead heading={AppConstants.umpireCoach} />
                    </div>
                    <div className="col-sm">
                        <Select
                            placeholder="Select"
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                            // onChange={recordUmpire => this.props.onChangeUmpirePools({ key: "recordUmpire", data: recordUmpire })}
                            // value={this.state.umpPool}
                        >
                            <Option value="Gradeaa">A Grade</Option>
                            <Option value="Gradebb">B Grade</Option>
                            <Option value="Gradecc">C Grade</Option>
                        </Select>
                    </div>
                </div>

                {/* <span className="text-heading-large pt-5">{AppConstants.simultaneousMatchAllocations}</span> */}
                {/* <div className="row pt-3">
                    <div className="col-sm-2">
                        <InputWithHead heading={AppConstants.poolName} />
                        <InputWithHead heading="Badge AA" />
                    </div>
                    <div className="col-sm-3">
                        <InputWithHead
                            auto_complete="new-umpireReserve"
                            heading={AppConstants.umpireReserve}
                            placeholder="Umpire Reserve"
                            onChange={(e) => this.setState({ umpireReserve: e.target.value })}
                            value={this.state.umpireReserve}
                        />
                    </div>
                    <div className="col-sm-3">
                        <InputWithHead
                            auto_complete="new-umpireCoach"
                            heading={AppConstants.umpireCoach}
                            placeholder="Umpire Coach"
                            onChange={(e) => this.setState({ umpireCoach: e.target.value })}
                            value={this.state.umpireCoach}
                        />
                    </div>
                </div> */}

                {/* <div className="row pt-3">
                    <div className='col-sm-2'>
                        <InputWithHead heading="Badge A" />
                    </div>
                    <div className='col-sm-3'>
                        <InputWithHead
                            auto_complete='new-umpireReserve'
                            placeholder="Umpire Reserve"
                            onChange={(e) => this.setState({ umpireReserve2: e.target.value })}
                            value={this.state.umpireReserve2}
                        />
                    </div>
                    <div className='col-sm-3'>
                        <InputWithHead
                            auto_complete='new-umpireCoach'
                            placeholder="Umpire Coach"
                            onChange={(e) => this.setState({ umpireCoach2: e.target.value })}
                            value={this.state.umpireCoach2}
                        />
                    </div>
                </div> */}
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">

                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <NavLink to='/umpirePoolAllocation'>
                                    <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.back}</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text" type="primary" htmlType="submit">
                                    {/* {AppConstants.generateRoster} */}
                                    {AppConstants.save}
                                </Button>
                                <Button onClick={() => history.push("/umpireDashboard")} className="open-reg-button" type="primary" htmlType="submit">
                                    {AppConstants.createRoster}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render = () => {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
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
        umpireCompetitionListAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpireDivisions);
