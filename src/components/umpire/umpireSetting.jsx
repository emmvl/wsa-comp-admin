import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Button,
    Radio,
    Form,
    TimePicker,
    Checkbox
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from "moment";
import { isArrayNotEmpty } from "../../util/helpers";
import ValidationConstants from "../../themes/validationConstant";
import { NavLink } from "react-router-dom";
import Loader from '../../customComponents/loader';
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage'
import { updateUmpireDataAction } from '../../store/actions/umpireAction/umpireSettingAction'

const { Header, Footer, Content } = Layout;
const { Option } = Select;


class UmpireSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null
        };
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
                            {AppConstants.umpireAllocation}
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
                                <span className="year-select-heading">
                                    {AppConstants.competition}:
                </span>
                                <Select
                                    className="year-select reg-filter-select1 ml-2"
                                    style={{ minWidth: 200 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {
                                        competition.map((item, index) => {
                                            return <Option key={`longName${index}` + item.id} value={item.id}>{item.longName}</Option>
                                        })
                                    }

                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {

        return (
            <div className="fluid-width">

                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.back}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text" type="primary" htmlType="submit" >
                                    {/* {AppConstants.generateRoster} */}
                                    {AppConstants.save}
                                </Button>
                                <NavLink to='/umpirePoolAllocation'>
                                    <Button className="publish-button save-draft-text" type="primary" htmlType="submit" >
                                        {AppConstants.next}
                                    </Button>
                                </NavLink>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    };

    umpireAllocationRadioView() {

        const { allocateViaPool, umpireYourOwn } = this.props.umpireSettingState

        const umpireLinkTeamArr = [
            { id: 3, name: 'Link to a team' },
            { id: 4, name: 'No preference' },
        ]

        return (
            <div>
                <span className='text-heading-large pt-2 pb-2' >{AppConstants.howUmpiresAllocated}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Radio
                        onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "allocateViaPool" })}
                        checked={allocateViaPool}>
                        {'Allocate via pools'}
                    </Radio>

                    <Radio
                        // className={paidByCompOrg ? 'pt-5' : 'pt-4'}
                        onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "umpireYourOwn" })}
                        checked={umpireYourOwn}>
                        {'Umpire your own'}
                    </Radio>

                    {umpireYourOwn &&
                        <Radio.Group
                            className="reg-competition-radio ml-5"
                        >
                            {umpireLinkTeamArr.length > 0 && umpireLinkTeamArr.map((item, index) => {
                                return (
                                    <Radio key={`name` + index} value={item.id}>{item.name}</Radio>
                                )
                            }
                            )}

                        </Radio.Group>
                    }
                </div>
            </div>
        )
    }


    ////////form content view
    contentView = () => {
        let defaultChecked = this.props.umpireSettingState.defaultChecked
        return (
            <div className="content-view pt-4 mt-5">

                {this.umpireAllocationRadioView()}

                <span className='text-heading-large pt-5 pb-4' >{AppConstants.umpirePrefences}</span>


                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead required={"pt-0"} heading={AppConstants.noOfMatches + 'Umpire/day'} />
                        <Select
                            placeholder={'Select'}
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        >

                            <Option value={"11111"}>{'1'}</Option>
                            <Option value={"22222"}>{'2'}</Option>
                            <Option value={"33333"}>{'3'}</Option>
                        </Select>
                    </div>
                    <div className="col-sm" >
                        <InputWithHead required={"pt-0"} heading={AppConstants.timeBetweenUmpireMatch} />
                        <TimePicker
                            className="comp-venue-time-timepicker"
                            style={{ width: "100%" }}
                            defaultOpenValue={moment("00:00", "HH:mm")}
                            defaultValue={moment()}
                            format={"HH:mm"}

                        />

                    </div>
                </div>


                <span className='text-heading-large pt-5' >{AppConstants.umpireReservePref}</span>

                <Checkbox
                    className="single-checkbox pt-2"
                    checked={defaultChecked.reserveChecked}
                    onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "reserveChecked" })}

                >
                    {AppConstants.activeUmpireReserves}
                </Checkbox>
                {defaultChecked.reserveChecked == true &&
                    <div className='row'>

                        <div className="col-sm" >
                            <InputWithHead required={"pt-5"} heading={AppConstants.noOfMatches + 'Reserve/day'} />
                            <Select
                                placeholder={'Select'}
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            >
                                <Option value={"11"}>{'1'}</Option>
                                <Option value={"22"}>{'2'}</Option>
                                <Option value={"33"}>{'3'}</Option>
                            </Select>
                        </div>

                        <div className="col-sm" >
                            <InputWithHead required={"pt-5"} heading={AppConstants.reserveAllocationTiming} />
                            <Select
                                placeholder={'Select'}
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            >
                                <Option value={"before"}>{'Before'}</Option>
                                <Option value={"inBetween"}>{'In-between'}</Option>
                                <Option value={"after"}>{'After'}</Option>
                            </Select>

                        </div>
                    </div>
                }

                <span className='text-heading-large pt-5' >{AppConstants.umpireCoach}</span>
                <Checkbox
                    className="single-checkbox pt-2"
                    checked={defaultChecked.coachChecked}
                    onChange={(e) => this.props.updateUmpireDataAction({ data: e.target.checked, key: "coachChecked" })}
                >
                    {AppConstants.activeUmpireCoach}
                </Checkbox>
                {defaultChecked.coachChecked == true &&
                    <div className='row'>

                        <div className="col-sm" >
                            <InputWithHead required={"pt-5"} heading={AppConstants.noOfMatches + 'Coach/day'} />
                            <Select
                                placeholder={'Select'}
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            >
                            </Select>
                        </div>

                        <div className="col-sm" >
                            <InputWithHead required={"pt-5"} heading={'Number of Matches an Umpire coach can perform in a row'} />
                            <Select
                                placeholder={'Select'}
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            >
                                <Option value={"111"}>{'1'}</Option>
                                <Option value={"222"}>{'2'}</Option>
                                <Option value={"333"}>{'3'}</Option>
                            </Select>
                        </div>

                    </div>
                }


            </div >
        );
    };





    render() {
        const { getFieldDecorator } = this.props.form;
        const { allocateViaPool } = this.props.umpireSettingState
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"6"} />
                <Layout>
                    <Form
                        onSubmit={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView()}
                        <Content>

                            <div className="formView">{this.contentView()}</div>

                        </Content>
                        <Footer>{allocateViaPool && this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        updateUmpireDataAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpireSettingState: state.UmpireSettingState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(UmpireSetting));
