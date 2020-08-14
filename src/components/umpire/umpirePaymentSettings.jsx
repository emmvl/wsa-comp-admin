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
import { umpirePaymentSettingUpdate } from '../../store/actions/umpireAction/umpirePaymentSettingAction'

const { Header, Footer, Content } = Layout;
const { Option } = Select;


class UmpirePaymentSetting extends Component {
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
        this.props.umpirePaymentSettingUpdate({ value: null, key: 'refreshPage' })
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
                            {AppConstants.umpirePaymentSetting}
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

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="flud-widtih">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                {/* <NavLink to='/umpire'> */}
                                <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.cancel}</Button>
                                {/* </NavLink> */}
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text" type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    contentView() {

        const { paidByCompOrg, paidByAffiliate } = this.props.umpirePaymentSettingState
        return (
            <div className='pt-4' style={{ padding: '3%', minWidth: 240 }}>
                <span className='text-heading-large pt-2' >{AppConstants.whoPayUmpire}</span>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Radio
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({ value: e.target.checked, key: 'paidByComp' })}
                        checked={paidByCompOrg}>
                        {'Paid by Competition Organiser'}
                    </Radio>


                    {paidByCompOrg &&
                        <div className="inside-container-view" >
                            {this.paidByCompOrgView()}
                        </div>
                    }

                    <Radio
                        className={paidByCompOrg ? 'pt-5' : 'pt-4'}
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({ value: e.target.checked, key: 'paidByAffilate' })}
                        checked={paidByAffiliate}>
                        {'Paid by Affiliate'}
                    </Radio>

                    {paidByAffiliate &&
                        <div className="inside-container-view"  >
                            {this.paidByAffiliateView()}
                        </div>
                    }
                </div>
            </div>
        )
    }

    paidByCompOrgView() {
        const { paidByCompOrgDivision } = this.props.umpirePaymentSettingState
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Checkbox defaultChecked={true}>
                    {AppConstants.allDivisions}
                </Checkbox>
                <Select
                    mode='multiple'
                    placeholder={'Select'}
                    style={{ width: "100%", paddingRight: 1, minWidth: 182, marginTop: 20 }}
                    onChange={(divisionId) => this.props.umpirePaymentSettingUpdate({ value: divisionId, key: 'paidByCompOrgDivision' })}
                    value={paidByCompOrgDivision}
                >

                    <Option value={"openA"}>{'OpenA'}</Option>
                    <Option value={"openB"}>{'OpenB'}</Option>
                    <Option value={"openC"}>{'OpenC'}</Option>
                </Select>
            </div>
        )
    }

    paidByAffiliateView() {
        const { byBadgeBtn, byPoolBtn } = this.props.umpirePaymentSettingState

        return (
            <div >
                <span className='text-heading-large pt-2' >{AppConstants.fees}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Radio
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({ value: e.target.checked, key: 'byBadge' })}
                        checked={byBadgeBtn}>
                        {'By Badge'}
                    </Radio>


                    {byBadgeBtn &&
                        <div  >
                            {this.byBadgeView()}
                        </div>
                    }

                    <Radio
                        onChange={(e) => this.props.umpirePaymentSettingUpdate({ value: e.target.checked, key: 'byPool' })}
                        checked={byPoolBtn}>
                        {'By Pool'}
                    </Radio>

                </div>

            </div>
        )
    }

    byBadgeView() {
        const { inputFieldArray, byBadgeDivision } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                    <Checkbox defaultChecked={true}>
                        {AppConstants.allDivisions}
                    </Checkbox>
                    <Select
                        mode='multiple'
                        placeholder={'Select'}
                        style={{ width: "100%", paddingRight: 1, minWidth: 182, marginTop: 20 }}
                        onChange={(divisionId) => this.props.umpirePaymentSettingUpdate({ value: divisionId, key: 'byBadgeDivision' })}
                        value={byBadgeDivision}
                    >

                        <Option value={"openA"}>{'OpenA'}</Option>
                        <Option value={"openB"}>{'OpenB'}</Option>
                        <Option value={"openC"}>{'OpenC'}</Option>
                    </Select>


                </div>

                {/* <div > */}
                {inputFieldArray.length > 0 && inputFieldArray.map((item, index) => {
                    return (
                        <div >
                            {this.inputFields(item, index)}
                        </div>
                    )
                }
                )}


                {/* <div style={{ marginTop: inputFieldArray.length === 0 ? null : -35 }} > */}
                <div  >
                    <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'addAnotherGroup' })} className={'input-heading-add-another pointer pt-0 mt-3'}>+ {AppConstants.addAnotherGroup}</span>
                </div>
                {/* </div> */}


            </div>
        )
    }

    inputFields(item, index) {
        const { inputFieldArray } = this.props.umpirePaymentSettingState
        return (
            <div>
                <div className="row pt-3" >

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_Complete='new-name'
                            heading={AppConstants.name}
                            placeholder={"Name"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({ value: e.target.value, index: index, key: 'name' })}
                            value={inputFieldArray[index].name}
                        />
                    </div>
                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_Complete='new-umpireRate'
                            heading={AppConstants.umpireRate}
                            placeholder={"Umpire Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({ value: e.target.value, index: index, key: 'umpireRate' })}
                            value={inputFieldArray[index].umpireRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_Complete='new-umpireResRate'
                            heading={AppConstants.umpireResRate}
                            placeholder={"Umpire Reserve Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({ value: e.target.value, index: index, key: 'umpReserveRate' })}
                            value={inputFieldArray[index].umpReserveRate}
                        />
                    </div>

                    <div className='col-sm input-width'>
                        <InputWithHead
                            auto_Complete='new-umpireRate'
                            heading={AppConstants.umpireCoachrate}
                            placeholder={"Umpire Coach Rate"}
                            onChange={(e) => this.props.umpirePaymentSettingUpdate({ value: e.target.value, index: index, key: 'umpCoachRate' })}
                            value={inputFieldArray[index].umpCoachRate}
                        />
                    </div>

                    <div className="col-sm-1 umpire-delete-image-view" >
                        <span onClick={() => this.props.umpirePaymentSettingUpdate({ value: null, key: 'removeItem', index: index })} className="user-remove-btn mt-3" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                    </div>
                </div>
            </div>
        )
    }

    ////////form content view
    contentView_1 = () => {
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
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"9"} />
                <Layout>
                    <Form
                        onSubmit={this.saveAPIsActionCall}
                        noValidate="noValidate"
                    >
                        {this.headerView()}
                        {this.dropdownView()}
                        <Content>

                            <div className="formView umpire-form-view">{this.contentView()}</div>

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
        umpirePaymentSettingUpdate
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState,
        umpirePaymentSettingState: state.UmpirePaymentSettingState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(UmpirePaymentSetting));
