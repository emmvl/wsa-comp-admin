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
                                    className="year-select"
                                    style={{ minWidth: 160 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {
                                        competition.map((item, index) => {
                                            return <Option key={`longName${index}`+item.id} value={item.id}>{item.longName}</Option>
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

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="flud-widtih">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                {/* <NavLink to='/umpire'> */}
                                <Button type="cancel-button">{AppConstants.cancel}</Button>
                                {/* </NavLink> */}
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="open-reg-button" type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.generateRoster}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    umpireAllocationRadioView() {
        const arr = [
            { id: 1, name: 'Allocate via pools' },
            { id: 2, name: 'Umpires linked to a team' }
        ]

        const umpireLinkTeamArr = [
            { id: 1, name: 'Umpire your own' },
            { id: 2, name: 'Umpire same Timeslot as their Team' },
            { id: 3, name: 'Umpire same grade as their Team' }
        ]

        return (
            <div>
                <span className='text-heading-large pt-2' >{AppConstants.howUmpiresAllocated}</span>
                <Radio.Group
                    className="reg-competition-radio"
                // onChange={(e) => { this.setState({ evenRotationFlag: false }); this.props.updateVenueConstraintsData(e.target.value, null, "courtPreferences", "courtParentSelection") }}
                // value={selectedRadioBtn}
                >

                    {arr.length > 0 && arr.map((item, index) => {
                        return (
                            <div key={`name${index}`+item.id}>
                                <div className='contextualHelp-RowDirection' >
                                    <Radio  value={item.id}>{item.name}</Radio>

                                </div>
                                {item.id == 2 &&
                                    <div className="ml-5" >
                                        <Radio.Group
                                            className="reg-competition-radio"
                                        // onChange={(e) => this.props.updateVenueConstraintsData(e.target.value, null, "", "evenRotationValue", index)}
                                        // value={evenRotation}
                                        >
                                            {umpireLinkTeamArr.length > 0 && umpireLinkTeamArr.map((item, index) => {
                                                return (
                                                    <Radio key={`name`+index} value={item.id}>{item.name}</Radio>
                                                )
                                            }
                                            )}

                                        </Radio.Group>
                                    </div>
                                }
                            </div>
                        )
                    }
                    )}
                </Radio.Group>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        let defaultChecked = this.props.umpireSettingState.defaultChecked
        return (
            <div className="content-view pt-4">

                {this.umpireAllocationRadioView()}

                <span className='text-heading-large pt-5' >{AppConstants.umpirePrefences}</span>


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
                    onChange={(e) => this.props.updateUmpireDataAction(e.target.checked, "reserveChecked")}
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
                    onChange={(e) => this.props.updateUmpireDataAction(e.target.checked, "coachChecked")}
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
                        <Footer>{this.footerView()}</Footer>
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
