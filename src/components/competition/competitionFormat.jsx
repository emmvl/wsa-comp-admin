import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Checkbox, Button, Radio, Form, Modal, message, Tooltip } from 'antd';
import './competition.css';
import { NavLink } from 'react-router-dom';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { getCompetitionFormatAction, saveCompetitionFormatAction, updateCompetitionFormatAction } from
    "../../store/actions/competitionModuleAction/competitionFormatAction";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";
import {
    getMatchTypesAction, getCompetitionFormatTypesAction, getCompetitionTypesAction,
    getYearAndCompetitionOwnAction, clearYearCompetitionAction, getEnhancedRoundRobinAction
} from "../../store/actions/appAction";
import {
    getActiveRoundsAction
} from '../../store/actions/competitionModuleAction/competitionDrawsAction';

import { generateDrawAction } from "../../store/actions/competitionModuleAction/competitionModuleAction";
import Loader from '../../customComponents/loader';
import {
    getOrganisationData, setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition,
    getOwn_competitionStatus,
    setOwn_competitionStatus,
} from "../../util/sessionStorage";
import AppUniqueId from "../../themes/appUniqueId";


const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionFormat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDivisionVisible: false,
            deleteModalVisible: false,
            currentIndex: 0,
            competitionId: '',
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: 1,
            firstTimeCompId: '',
            getDataLoading: false,
            buttonPressed: "",
            loading: false,
            isFinalAvailable: false,
            matchTypeRefStateId: 0,
            roundLoad: false,
            drawGenerateModalVisible: false,
            competitionStatus: 0,
            tooltipVisibleDelete: false,
            generateRoundId: null
        }

        this.referenceApiCalls();
    }

    componentDidMount() {
        console.log("Component Did mount");
        let yearId = getOwnCompetitionYear()
        let storedCompetitionId = getOwn_competition()
        let storedCompetitionStatus = getOwn_competitionStatus()
        let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
        let compData = this.props.appState.own_CompetitionArr.length > 0 ? this.props.appState.own_CompetitionArr : undefined

        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                competitionStatus: storedCompetitionStatus,
                getDataLoading: true
            })
            this.apiCalls(storedCompetitionId, yearId);
        }
        else if (yearId) {
            this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
            this.setState({
                yearRefId: JSON.parse(yearId)
            })
        }
        else {
            this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, null, 'own_competition')
            setOwnCompetitionYear(1)
        }


    }

    componentDidUpdate(nextProps) {
        console.log("componentDidUpdate");
        try {
            let competitionFormatState = this.props.competitionFormatState;
            let competitionModuleState = this.props.competitionModuleState;
            if (nextProps.competitionFormatState != competitionFormatState) {
                if (competitionFormatState.onLoad == false && this.state.getDataLoading == true) {
                    this.setState({
                        getDataLoading: false,
                    })
                    this.setFormFieldValue();
                }
            }
            if (nextProps.appState !== this.props.appState) {

                let competitionList = this.props.appState.own_CompetitionArr;
                if (nextProps.appState.own_CompetitionArr !== competitionList) {
                    if (competitionList.length > 0) {
                        let competitionId = competitionList[0].competitionId
                        let statusRefId = competitionList[0].statusRefId
                        setOwn_competition(competitionId);
                        setOwn_competitionStatus(statusRefId)
                        console.log("competitionId::" + competitionId);
                        this.apiCalls(competitionId, this.state.yearRefId);
                        this.setState({ getDataLoading: true, firstTimeCompId: competitionId, competitionStatus: statusRefId })
                    }
                }
            }

            if (nextProps.competitionFormatState != competitionFormatState) {
                if (competitionFormatState.onLoad == false && this.state.loading === true) {
                    this.setState({ loading: false });
                    if (!competitionFormatState.error) {
                        if (this.state.buttonPressed == "save") {
                            if (this.state.isFinalAvailable) {
                                history.push('/competitionFinals');
                            }
                            else {
                                let payload = {
                                    yearRefId: this.state.yearRefId,
                                    competitionUniqueKey: this.state.firstTimeCompId,
                                    organisationId: this.state.organisationId
                                }
                                if (competitionModuleState.drawGenerateLoad == false &&
                                    !this.state.isFinalAvailable) {
                                    let competitionStatus = getOwn_competitionStatus();
                                    if (competitionStatus != 2) {
                                        this.props.generateDrawAction(payload);
                                        this.setState({ loading: true });
                                    }
                                    else {
                                        this.props.getActiveRoundsAction(this.state.yearRefId, this.state.firstTimeCompId);
                                        this.setState({ roundLoad: true });
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if (nextProps.competitionModuleState != competitionModuleState) {
                if (competitionFormatState.onLoad == false && competitionModuleState.drawGenerateLoad == false
                    && this.state.loading === true && !this.state.isFinalAvailable) {

                    if (!competitionModuleState.error && competitionModuleState.status == 1) {
                        history.push('/competitionDraws');
                    }

                    this.setState({ loading: false });
                }
                console.log("&&&&&&&&&&&&&&&" + competitionModuleState.status);
                if (competitionModuleState.status == 5 && competitionModuleState.drawGenerateLoad == false) {
                    this.setState({ loading: false });
                    message.error(ValidationConstants.drawsMessage[0]);
                    this.apiCalls(this.state.firstTimeCompId, this.state.yearRefId);
                }
                if (competitionModuleState.status == 4 && competitionModuleState.drawGenerateLoad == false) {
                    this.setState({ loading: false });
                    this.apiCalls(this.state.firstTimeCompId, this.state.yearRefId);
                }
            }

            if (this.state.roundLoad == true && this.props.drawsState.onActRndLoad == false) {
                this.setState({ roundLoad: false });
                if (this.props.drawsState.activeDrawsRoundsData != null &&
                    this.props.drawsState.activeDrawsRoundsData.length > 0) {
                    this.setState({ drawGenerateModalVisible: true })
                }
                else {
                    message.config({ duration: 0.9, maxCount: 1 });
                    message.info(AppConstants.roundsNotAvailable);
                }
            }
        }
        catch (error) {
            console.log("ERROr" + error);
        }

    }

    apiCalls = (competitionId, yearRefId) => {
        console.log("Api Callse");
        let payload = {
            yearRefId: yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: this.state.organisationId
        }
        this.props.getCompetitionFormatAction(payload);
    }

    referenceApiCalls = () => {
        this.props.clearYearCompetitionAction()
        this.props.getMatchTypesAction();
        this.props.getCompetitionFormatTypesAction();
        this.props.getCompetitionTypesAction();
        this.props.getEnhancedRoundRobinAction();
        this.setState({ getDataLoading: true })
    }

    onYearChange(yearId) {
        setOwnCompetitionYear(yearId)
        setOwn_competition(undefined)
        setOwn_competitionStatus(undefined)
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
        this.setState({ firstTimeCompId: null, yearRefId: yearId, competitionStatus: 0 })
    }

    // on Competition change
    onCompetitionChange(competitionId, statusRefId) {
        console.log("competitionId::" + competitionId);
        setOwn_competition(competitionId)
        setOwn_competitionStatus(statusRefId)
        let payload = {
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: competitionId,
            organisationId: this.state.organisationId
        }
        this.props.getCompetitionFormatAction(payload);
        this.setState({ getDataLoading: true, firstTimeCompId: competitionId, competitionStatus: statusRefId })
    }

    setFormFieldValue = () => {
        console.log("setFormFieldValue");
        let formatList = Object.assign(this.props.competitionFormatState.competitionFormatList);
        let competitionFormatDivision = formatList.competionFormatDivisions;

        this.props.form.setFieldsValue({
            [`competitionFormatRefId`]: formatList.competitionFormatRefId,
            [`matchTypeRefId`]: formatList.matchTypeRefId
        });

        (competitionFormatDivision || []).map((item, index) => {
            this.props.form.setFieldsValue({
                [`matchDuration${index}`]: item.matchDuration,
                [`mainBreak${index}`]: item.mainBreak,
                [`qtrBreak${index}`]: item.qtrBreak,
                [`timeBetweenGames${index}`]: item.timeBetweenGames,
            });
        })
    }

    onChange(e, competitionFormatDivisions, index) {
        console.log('checked = ', e);
        let removedDivisions = [];
        let selectDivs = competitionFormatDivisions[index].selectedDivisions;
        for (let k in selectDivs) {
            if (e.indexOf(selectDivs[k]) == -1) {
                {
                    removedDivisions.push(selectDivs[k]);
                    break;
                }
            }
        }

        let a = competitionFormatDivisions[index].selectedDivisions.filter(x => false);
        competitionFormatDivisions[index].selectedDivisions = a;

        competitionFormatDivisions[index].selectedDivisions = e;

        let competitionFormatTemplateId = competitionFormatDivisions[index].competitionFormatTemplateId;
        console.log("competitionFormatTemplateId::" + competitionFormatTemplateId);
        let remainingFormatDiv = competitionFormatDivisions.
            filter(x => x.competitionFormatTemplateId != competitionFormatTemplateId);

        for (let remDiv in remainingFormatDiv) {
            let itemDivisions = remainingFormatDiv[remDiv].divisions;
            // disable true
            for (let i in e) {
                for (let j in itemDivisions) {
                    if (itemDivisions[j].competitionMembershipProductDivisionId === e[i]) {
                        itemDivisions[j].isDisabled = true;
                    }
                }
            }

            for (let i in removedDivisions) {
                for (let j in itemDivisions) {
                    if (itemDivisions[j].competitionMembershipProductDivisionId === removedDivisions[i]) {
                        itemDivisions[j].isDisabled = false;
                    }
                }
            }
        }
        this.props.updateCompetitionFormatAction(competitionFormatDivisions, "competionFormatDivisions");
    }

    onChangeFinal = (e, competitionFormatDivisions, index) => {
        competitionFormatDivisions[index].isFinal = e.target.checked;
        this.props.updateCompetitionFormatAction(competitionFormatDivisions, 'competionFormatDivisions');
    };

    addCompetitionFormatDivision(data) {

        this.props.updateCompetitionFormatAction(data, 'addCompetitionFormatDivisions');
    }

    handleDeleteModal(flag, key, index, competionFormatDivisions) {
        this.setState({
            deleteModalVisible: flag
        });
        if (key == "ok") {
            this.deleteCompetitionFormatDivision(competionFormatDivisions, index);
        }
    }

    deleteCompetitionFormatDivision = (competionFormatDivisions, index) => {
        console.log("*****" + JSON.stringify(competionFormatDivisions));
        console.log("index::" + index);
        let removedFormat = competionFormatDivisions[index];

        let remainingFormatDiv = competionFormatDivisions.
            filter(x => x.competitionFormatTemplateId != removedFormat.competitionFormatTemplateId);

        for (let remDiv in remainingFormatDiv) {
            let itemDivisions = remainingFormatDiv[remDiv].divisions;

            for (let i in removedFormat.selectedDivisions) {
                for (let j in itemDivisions) {
                    if (itemDivisions[j].competitionMembershipProductDivisionId === removedFormat.selectedDivisions[i]) {
                        itemDivisions[j].isDisabled = false;
                    }
                }
            }
        }

        // console.log("*******" + JSON.stringify(competionFormatDivisions));
        competionFormatDivisions.splice(index, 1);
        this.props.updateCompetitionFormatAction(competionFormatDivisions, 'competionFormatDivisions');
    }

    onChangeSetValue = (id, fieldName) => {
        console.log("id::" + id);
        let data = this.props.competitionFormatState.competitionFormatList;
        console.log("*****" + JSON.stringify(data));
        let fixtureTemplateId = null;
        if (fieldName == "noOfRounds") {
            // data.fixtureTemplates.map((item, index) => {
            //     if(item.noOfRounds == id)
            //     {
            //         fixtureTemplateId = item.id;
            //     }
            // });
            // this.props.updateCompetitionFormatAction(fixtureTemplateId, "fixtureTemplateId");
        }
        else if (fieldName == "competitionFormatRefId") {
            if (id != 4) {
                this.props.updateCompetitionFormatAction(null, "noOfRounds");
                // this.props.updateCompetitionFormatAction(fixtureTemplateId, "fixtureTemplateId");
            }
        }
        else if (fieldName == "matchTypeRefId") {
            this.setFormFieldValue();
            //this.setState({matchTypeRefStateId: id})
        }

        this.props.updateCompetitionFormatAction(id, fieldName);
    }
    onChangeSetCompFormatDivisionValue = (id, fieldName, competitionFormatDivisions, index) => {
        console.log("fieldName::" + fieldName + ":::" + id);
        if (fieldName == "matchDuration") {
            competitionFormatDivisions[index].matchDuration = id;
        }
        else if (fieldName == "mainBreak") {
            competitionFormatDivisions[index].mainBreak = id;
        }
        else if (fieldName == "qtrBreak") {
            competitionFormatDivisions[index].qtrBreak = id;
        }
        else if (fieldName == "timeBetweenGames") {
            competitionFormatDivisions[index].timeBetweenGames = id;
        }


        this.props.updateCompetitionFormatAction(competitionFormatDivisions, 'competionFormatDivisions');
    }

    handleAllDivisionModal = (flag, key, index, competionFormatDivisions) => {
        this.setState({
            allDivisionVisible: flag
        });
        if (key == "ok") {
            this.performAllDivisionOperation(true, competionFormatDivisions, index);
        }
    }

    deleteModal = (index) => {
        this.setState({
            currentIndex: index,
            deleteModalVisible: true
        });
    }

    onChangeAllDivision = (e, competionFormatDivisions, index) => {
        console.log("onChangeAllDivision::" + index);
        this.setState({
            currentIndex: index
        });

        if (competionFormatDivisions.length > 1) {
            if (e.target.checked) {
                this.setState({
                    allDivisionVisible: true
                });
            }
            else {
                this.performAllDivisionOperation(e.target.checked, competionFormatDivisions, index);
            }
        } else {
            this.performAllDivisionOperation(e.target.checked, competionFormatDivisions, index);
        }
    }


    performAllDivisionOperation = (checkedVal, competionFormatDivisions, index) => {
        console.log("performAllDivisionOperation::" + index + "::" + checkedVal);
        let allDivObj = Object.assign(competionFormatDivisions[index]);
        allDivObj.selectedDivisions = [];
        for (let i in allDivObj.divisions) {
            allDivObj.divisions[i].isDisabled = false;
        }

        console.log("allDivObj::" + JSON.stringify(allDivObj));
        let arr = [];
        arr.push(allDivObj);
        console.log("newList::" + JSON.stringify(arr));

        this.props.updateCompetitionFormatAction(checkedVal, "allDivision");
        this.props.updateCompetitionFormatAction(arr, 'competionFormatDivisions');
    }

    handleGenerateDrawModal = (key) => {
        if (key == "ok") {
            if (this.state.generateRoundId != null) {
                this.callGenerateDraw();
                this.setState({ drawGenerateModalVisible: false });
            }
            else {
                message.error("Please select round");
            }
        }
        else {
            this.setState({ drawGenerateModalVisible: false });
        }
    }

    callGenerateDraw = () => {
        let payload = {
            yearRefId: this.state.yearRefId,
            competitionUniqueKey: this.state.firstTimeCompId,
            organisationId: getOrganisationData().organisationUniqueKey,
            roundId: this.state.generateRoundId
        };
        this.props.generateDrawAction(payload);
        this.setState({ loading: true });
    }


    saveCompetitionFormats = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("err::" + err);
            if (!err) {
                this.setState({ buttonPressed: "save" });
                let formatList = Object.assign(this.props.competitionFormatState.competitionFormatList);
                let competitionFormatDivision = formatList.competionFormatDivisions;
                formatList.organisationId = this.state.organisationId;

                if (formatList.isDefault == null)
                    formatList.isDefault = 0;

                for (let item in competitionFormatDivision) {
                    console.log("item.isFinal::" + formatList.competitionFormatRefId);
                    let isFinal = competitionFormatDivision[item]["isFinal"];
                    if (isFinal && formatList.competitionFormatRefId != 1) {
                        console.log("***********************");
                        this.setState({ isFinalAvailable: true });
                    }

                    let competitionFormatTemplateId = competitionFormatDivision[item].competitionFormatTemplateId;
                    if (competitionFormatTemplateId < 0)
                        competitionFormatDivision[item].competitionFormatTemplateId = 0;

                    const selectedDivisions = competitionFormatDivision[item].selectedDivisions;
                    let divisions = competitionFormatDivision[item].divisions;
                    let divArr = [];

                    for (let j in selectedDivisions) {
                        let matchDivisions = divisions.
                            find(x => x.competitionMembershipProductDivisionId === selectedDivisions[j]);
                        if (matchDivisions != "") {
                            let obj = {
                                competitionFormatDivisionId: 0,
                                competitionMembershipProductDivisionId: 0
                            }
                            obj.competitionFormatDivisionId = matchDivisions.competitionFormatDivisionId;
                            obj.competitionMembershipProductDivisionId = matchDivisions.competitionMembershipProductDivisionId;
                            divArr.push(obj);
                        }
                    }

                    competitionFormatDivision[item].divisions = divArr;
                }

                // let payload = {
                //     yearRefId: this.state.yearRefId, 
                //     competitionUniqueKey: this.state.firstTimeCompId,
                //     organisationId: this.state.organisationId
                // }
                // this.props.generateDrawAction(payload);

                this.props.saveCompetitionFormatAction(formatList);
                this.setState({ loading: true });
                console.log("SAVE Format::" + JSON.stringify(formatList));
            }
            else {
                message.error(ValidationConstants.requiredMessage);
            }
        });

    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.competitionFormat}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        const { own_YearArr, own_CompetitionArr, } = this.props.appState
        return (
            <div className="comp-venue-courts-dropdown-view mt-0" >
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-3 pb-3" >
                            <div style={{
                                width: "fit-content", display: "flex", flexDirection: "row",
                                alignItems: "center"
                            }}  >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    id={AppUniqueId.compYear_DrpDwn}
                                    name={"yearRefId"}
                                    className="year-select reg-filter-select-year ml-2"
                                    // style={{ width: 90 }}
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={this.state.yearRefId}
                                >
                                    {own_YearArr.length > 0 && own_YearArr.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-4 pb-3" >
                            <div style={{
                                width: "fit-content", display: "flex",
                                flexDirection: "row",
                                alignItems: "center", marginRight: 50,
                            }} >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    id={AppUniqueId.compName_DrpDwn}
                                    name={"competition"}
                                    className="year-select reg-filter-select-competition ml-2"
                                    onChange={(competitionId, e) => this.onCompetitionChange(competitionId, e.key)
                                    }
                                    value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                                >
                                    {own_CompetitionArr.length > 0 && own_CompetitionArr.map(item => {
                                        return (
                                            <Option key={item.statusRefId} value={item.competitionId}>
                                                {item.competitionName}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    ////////form content view
    contentView = (getFieldDecorator) => {
        let data = this.props.competitionFormatState.competitionFormatList;
        // console.log("!!!!!!!!!!!!" + JSON.stringify(data.competitionName));
        let appState = this.props.appState;
        let isAllDivisionChecked = this.props.competitionFormatState.isAllDivisionChecked;
        let disabledStatus = this.state.competitionStatus == 1 ? true : false
        return (
            <div className="content-view pt-4">
                <InputWithHead disabled={disabledStatus} heading={AppConstants.competition_name} placeholder={AppConstants.competition_name}
                    value={data.competitionName} onChange={(e) => this.onChangeSetValue(e.target.value, 'competitionName')}  ></InputWithHead>
                <div id={AppUniqueId.comp_Format_Type} style={{ marginTop: 15 }}>
                    <InputWithHead heading={AppConstants.competitionFormat} required={"required-field"} />
                    <Form.Item >
                        {getFieldDecorator('competitionFormatRefId', {
                            rules: [{ required: true, message: ValidationConstants.pleaseSelectCompetitionFormat }],
                        })(
                            <Radio.Group className="reg-competition-radio" onChange={(e) => this.onChangeSetValue(e.target.value, 'competitionFormatRefId')}
                                setFieldsValue={data.competitionFormatRefId}
                                disabled={disabledStatus}
                            >
                                <div className="fluid-width" >
                                    <div className="row" >
                                        {(appState.competitionFormatTypes || []).map(item => {
                                            return (
                                                <div className="col-sm" >
                                                    <Radio key={item.id} value={item.id}> {item.description}</Radio>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Radio.Group>
                        )}
                    </Form.Item>
                </div>
                {/* <Checkbox className="single-checkbox pt-3" defaultChecked={false} onChange={(e) => this.onChange(e)}>{AppConstants.use_default_competitionFormat}</Checkbox> */}
                {/* <InputWithHead heading={AppConstants.fixture_template} />
                <Select
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={(fixTemplate) => this.onChangeSetValue(fixTemplate, 'fixtureTemplateId')}
                    value={data.fixtureTemplateId}>
                    <Option style={{height: '30px'}} value={null} key={null}>{}</Option>
                    {(data.fixtureTemplates || []).map((fixture, fixIndex) => (
                        <Option value={fixture.id} key={fixture.id}>{fixture.name}</Option>
                    ))}
                </Select> */}

                <InputWithHead heading={AppConstants.matchType} required={"required-field"} />
                <Form.Item >
                    {getFieldDecorator('matchTypeRefId', {
                        rules: [{ required: true, message: ValidationConstants.matchTypeRequired }],
                    })(
                        <Select
                            disabled={disabledStatus}
                            id={AppUniqueId.matchType_Selection_dpdn}
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(matchType) => this.onChangeSetValue(matchType, 'matchTypeRefId')}
                            value={data.matchTypeRefId}>
                            {(appState.matchTypes || []).map((item, index) => (
                                <Option key={item.id} value={item.id}>{item.description}</Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                {data.competitionFormatRefId == 4 ?
                    <div>
                        <InputWithHead heading={AppConstants.numberOfRounds} />
                        <Select
                            disabled={disabledStatus}
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(x) => this.onChangeSetValue(x, 'noOfRounds')}
                            value={data.noOfRounds}>
                            <Option style={{ height: '30px' }} value={null} key={null}>{}</Option>
                            {(data.fixtureTemplates || []).map((fixture, fixIndex) => (
                                <Option value={fixture.noOfRounds} key={fixture.noOfRounds}>{fixture.noOfRounds}</Option>
                            ))}
                        </Select>
                        <InputWithHead heading={AppConstants.enhancedRoundRobinType} />
                        <Select
                            disabled={disabledStatus}
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(x) => this.onChangeSetValue(x, 'enhancedRoundRobinTypeRefId')}
                            value={data.enhancedRoundRobinTypeRefId}>
                            {(appState.enhancedRoundRobinTypes || []).map((round, roundIndex) => (
                                <Option value={round.id} key={round.id}>{round.description}</Option>
                            ))}
                        </Select>
                    </div> : null
                }

                <span id={AppUniqueId.competition_Frequency} className="applicable-to-heading">{AppConstants.frequency}</span>
                <Radio.Group disabled={disabledStatus} className="reg-competition-radio" onChange={(e) => this.onChangeSetValue(e.target.value, 'competitionTypeRefId')} value={data.competitionTypeRefId} >
                    <div className="fluid-width" >
                        <div className="row" >
                            {(appState.typesOfCompetition || []).map((item, index) => (
                                <div className="col-sm" >
                                    <Radio key={item.id} value={item.id}>{item.description}</Radio>
                                </div>
                            ))}
                        </div>
                    </div>
                </Radio.Group>

                <InputWithHead heading={AppConstants.timeBetweenRounds}></InputWithHead>
                <div className="fluid-width">
                    <div className="row" >
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead disabled={disabledStatus} placeholder={AppConstants.days} value={data.roundInDays}
                                onChange={(e) => this.onChangeSetValue(e.target.value, 'roundInDays')}></InputWithHead>
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead disabled={disabledStatus} placeholder={AppConstants.hours} value={data.roundInHours}
                                onChange={(e) => this.onChangeSetValue(e.target.value, 'roundInHours')}></InputWithHead>

                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead disabled={disabledStatus} placeholder={AppConstants.mins} value={data.roundInMins}
                                onChange={(e) => this.onChangeSetValue(e.target.value, 'roundInMins')}></InputWithHead>
                        </div>
                    </div>
                </div>
                {(data.competionFormatDivisions || []).map((item, index) => (
                    <div className="inside-container-view" key={"compFormat" + index}>
                        <div className="fluid-width" >
                            <div style={{ display: 'flex' }}>
                                <div className="applicable-to-heading" style={{ paddingTop: '0px' }}>{AppConstants.applyMatchFormat}</div>
                                <div className="transfer-image-view pt-0 pointer" style={{ marginLeft: 'auto', cursor: disabledStatus && "no-drop" }} onClick={() => disabledStatus == false && this.deleteModal(index)}>
                                    <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                                    <span className="user-remove-text">
                                        {AppConstants.remove}
                                    </span>
                                </div>
                                {this.deleteConfirmModalView(data.competionFormatDivisions)}
                            </div>
                            <Checkbox id={AppUniqueId.apply_match_format_All_divisions_Checkbox} disabled={disabledStatus} className="single-checkbox pt-2" checked={isAllDivisionChecked} onChange={(e) => this.onChangeAllDivision(e, data.competionFormatDivisions, index)}>{AppConstants.allDivisions}</Checkbox>
                            {!isAllDivisionChecked ? <div className="fluid-width" >
                                <div className="row" >
                                    <div className="col-sm">
                                        <Select
                                            disabled={disabledStatus}
                                            mode="multiple"
                                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                            onChange={(e) => this.onChange(e, data.competionFormatDivisions, index)}
                                            value={item.selectedDivisions}>
                                            {(item.divisions || []).map((division, divIndex) => (
                                                <Option key={division.competitionMembershipProductDivisionId + divIndex}
                                                    disabled={division.isDisabled} value={division.competitionMembershipProductDivisionId}>
                                                    {division.divisionsName}
                                                </Option>
                                            ))}

                                        </Select>
                                    </div>
                                </div>
                                {this.allDivisionModalView(data.competionFormatDivisions)}
                            </div> : null}
                        </div>

                        <div className="fluid-width" >
                            <div className="row" >
                                <div id={AppUniqueId.match_Duration} className="col-sm-3" >
                                    <Form.Item >
                                        {getFieldDecorator(`matchDuration${index}`, {
                                            rules: [{
                                                required: true, pattern: new RegExp("^[1-9][0-9]*$"),
                                                message: ValidationConstants.matchDuration
                                            }]
                                        })(
                                            <InputWithHead heading={AppConstants.matchDuration}
                                                disabled={disabledStatus}
                                                required={"required-field"}
                                                placeholder={AppConstants.mins}
                                                setFieldsValue={item.matchDuration}
                                                onChange={(e) => this.onChangeSetCompFormatDivisionValue(e.target.value, 'matchDuration',
                                                    data.competionFormatDivisions, index)}></InputWithHead>
                                        )}
                                    </Form.Item>
                                </div>
                                {(data.matchTypeRefId == 2 || data.matchTypeRefId == 3) ?
                                    <div className="col-sm-3" >
                                        <Form.Item >
                                            {getFieldDecorator(`mainBreak${index}`, {
                                                rules: [{ required: ((data.matchTypeRefId == 2 || data.matchTypeRefId == 3) ? true : false), message: ValidationConstants.mainBreak }]
                                            })(
                                                <InputWithHead
                                                    disabled={disabledStatus}
                                                    heading={AppConstants.mainBreak}
                                                    required={(data.matchTypeRefId == 2 || data.matchTypeRefId == 3) ? "required-field" : null}
                                                    placeholder={AppConstants.mins}
                                                    setFieldsValue={item.mainBreak}
                                                    onChange={(e) => this.onChangeSetCompFormatDivisionValue(e.target.value, 'mainBreak',
                                                        data.competionFormatDivisions, index)}></InputWithHead>
                                            )}
                                        </Form.Item>

                                    </div>
                                    : null}
                                {data.matchTypeRefId == 3 ?
                                    <div className="col-sm-3" >
                                        <Form.Item >
                                            {getFieldDecorator(`qtrBreak${index}`, {
                                                rules: [{ required: (data.matchTypeRefId == 3 ? true : false), message: ValidationConstants.qtrBreak }]
                                            })(
                                                <InputWithHead
                                                    disabled={disabledStatus}
                                                    heading={AppConstants.qtrBreak} placeholder={AppConstants.mins}
                                                    required={(data.matchTypeRefId == 3) ? "required-field" : null}
                                                    setFieldsValue={item.qtrBreak}
                                                    onChange={(e) => this.onChangeSetCompFormatDivisionValue(e.target.value, 'qtrBreak',
                                                        data.competionFormatDivisions, index)}></InputWithHead>
                                            )}
                                        </Form.Item>
                                    </div>
                                    : null}
                                {data.timeslotGenerationRefId != 2 ?
                                    <div id={AppUniqueId.timeBetween_Matches} className="col-sm-3" >
                                        <Form.Item >
                                            {getFieldDecorator(`timeBetweenGames${index}`, {
                                                rules: [{ required: true, message: ValidationConstants.timeBetweenGames }]
                                            })(
                                                <InputWithHead
                                                    disabled={disabledStatus}
                                                    heading={AppConstants.timeBetweenMatches} placeholder={AppConstants.mins}
                                                    required={"required-field"}
                                                    setFieldsValue={item.timeBetweenGames}
                                                    onChange={(e) => this.onChangeSetCompFormatDivisionValue(e.target.value, 'timeBetweenGames',
                                                        data.competionFormatDivisions, index)}></InputWithHead>
                                            )}
                                        </Form.Item>
                                    </div>
                                    : null}
                            </div>
                        </div>
                        {
                            data.competitionFormatRefId != 1 &&
                            <div>
                                <Checkbox disabled={disabledStatus} className="single-checkbox pt-2" checked={item.isFinal} onChange={(e) => this.onChangeFinal(e, data.competionFormatDivisions, index)}>{AppConstants.applyFinalFormat}</Checkbox>
                            </div>
                        }
                    </div>
                ))
                }
                {/* <NavLink to="/competitionFinals" >
                    <span className='input-heading-add-another'> {AppConstants.setUpFinalTemplate_optional}</span>
                </NavLink> */}
                {
                    !isAllDivisionChecked ?
                        <span className='input-heading-add-another pointer' onClick={() => this.addCompetitionFormatDivision(data)} >+ {AppConstants.addNewCompetitionFormat}</span> : null
                }
                {/* <Checkbox className="single-checkbox pt-2" defaultChecked={data.isDefault} onChange={(e) => this.onChangeSetValue(e.target.checked, 'isDefault')}>{AppConstants.setAsDefault}</Checkbox> */}
            </div >
        )
    }

    allDivisionModalView = (competionFormatDivisions) => {
        return (
            <div>
                <Modal
                    title="Competition Format"
                    visible={this.state.allDivisionVisible}
                    onOk={() => this.handleAllDivisionModal(false, "ok", this.state.currentIndex, competionFormatDivisions)}
                    onCancel={() => this.handleAllDivisionModal(false, "cancel", this.state.currentIndex, competionFormatDivisions)}>
                    <p>This will remove the other competition formats.</p>
                </Modal>
            </div>
        );
    }

    deleteConfirmModalView = (competionFormatDivisions) => {
        return (
            <div>
                <Modal
                    title="Competition Format"
                    visible={this.state.deleteModalVisible}
                    onOk={() => this.handleDeleteModal(false, "ok", this.state.currentIndex, competionFormatDivisions)}
                    onCancel={() => this.handleDeleteModal(false, "cancel", this.state.currentIndex, competionFormatDivisions)}>
                    <p>Are you sure you want to remove?.</p>
                </Modal>
            </div>
        );
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        let activeDrawsRoundsData = this.props.drawsState.activeDrawsRoundsData;
        let isPublished = this.state.competitionStatus == 1 ? true : false
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <NavLink to="/competitionVenueTimesPrioritisation">
                                    <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.back}</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div className="comp-finals-button-view">
                                <Tooltip
                                    style={{ height: '100%' }}
                                    onMouseEnter={() =>
                                        this.setState({
                                            tooltipVisibleDelete: isPublished ? true : false,
                                        })
                                    }
                                    onMouseLeave={() =>
                                        this.setState({ tooltipVisibleDelete: false })
                                    }
                                    visible={this.state.tooltipVisibleDelete}
                                    title={AppConstants.statusPublishHover}
                                >
                                    <Button
                                        id={AppUniqueId.create_Draft_Draw_Btn}
                                        style={{ height: isPublished && "100%", width: isPublished && "inherit", borderRadius: isPublished && 10 }}
                                        className="open-reg-button"
                                        type="primary"
                                        htmlType="submit"
                                        disabled={isPublished}
                                    >
                                        {AppConstants.createDraftDraw}
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    title="Regenerate Draw"
                    visible={this.state.drawGenerateModalVisible}
                    onOk={() => this.handleGenerateDrawModal("ok")}
                    onCancel={() => this.handleGenerateDrawModal("cancel")}>
                    <Select
                        className="year-select reg-filter-select-competition ml-2"
                        onChange={(e) => this.setState({ generateRoundId: e })}
                        placeholder={'Round'}>
                        {(activeDrawsRoundsData || []).map((d, dIndex) => (
                            <Option key={d.roundId}
                                value={d.roundId} >{d.name}</Option>
                        ))
                        }

                    </Select>
                </Modal>
            </div>
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"9"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        autocomplete="off"
                        onSubmit={this.saveCompetitionFormats}
                        noValidate="noValidate">
                        <Content>
                            {this.dropdownView()}
                            <div className="formView">
                                {this.contentView(getFieldDecorator)}
                            </div>
                            <Loader visible={this.state.loading} />
                        </Content>
                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCompetitionFormatAction,
        saveCompetitionFormatAction,
        getMatchTypesAction,
        updateCompetitionFormatAction,
        getCompetitionFormatTypesAction,
        getCompetitionTypesAction,
        getYearAndCompetitionOwnAction,
        clearYearCompetitionAction,
        generateDrawAction,
        getEnhancedRoundRobinAction,
        getActiveRoundsAction
    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        competitionFormatState: state.CompetitionFormatState,
        appState: state.AppState,
        competitionModuleState: state.CompetitionModuleState,
        drawsState: state.CompetitionDrawsState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionFormat));
