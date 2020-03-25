import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Checkbox, Button, Radio, Form, message } from 'antd';
import './competition.css';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import {getCompetitionFinalsAction, saveCompetitionFinalsAction, updateCompetitionFinalsAction} from 
                "../../store/actions/competitionModuleAction/competitionFinalsAction";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import history from "../../util/history";
import { getMatchTypesAction,getYearAndCompetitionOwnAction, clearYearCompetitionAction } from "../../store/actions/appAction";
import Loader from '../../customComponents/loader';
import {generateDrawAction} from "../../store/actions/competitionModuleAction/competitionModuleAction";
import ValidationConstants from "../../themes/validationConstant";

import {getOrganisationData,  setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition } from "../../util/sessionStorage";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionFinals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstTimeCompId: '',
            yearRefId: 1,
            organisationId: getOrganisationData().organisationUniqueKey,
            getDataLoading: false,
            buttonPressed: "",
            loading: false
        }

        this.referenceApiCalls();
    }

    componentDidMount(){
        console.log("Component Did mount");

        let yearId = getOwnCompetitionYear()
        let storedCompetitionId = getOwn_competition()
        let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
        let compData = this.props.appState.own_CompetitionArr.length > 0 ? this.props.appState.own_CompetitionArr : undefined

        if (storedCompetitionId && yearId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
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

    componentDidUpdate(nextProps){
        console.log("componentDidUpdate");

        let competitionFinalsState = this.props.competitionFinalsState;
        let competitionModuleState = this.props.competitionModuleState;
        if(nextProps.competitionFinalsState != competitionFinalsState)
        {
            if (competitionFinalsState.onLoad == false && this.state.getDataLoading == true) {
                this.setState({
                    getDataLoading: false,
                })
            }
        }

        if (nextProps.appState !== this.props.appState) {
            let competitionList = this.props.appState.own_CompetitionArr;
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    let competitionId = competitionList[0].competitionId;
                    console.log("competitionId::" + competitionId);
                    this.apiCalls(competitionId, this.state.yearRefId);
                    this.setState({ getDataLoading: true, firstTimeCompId: competitionId })
                }
            }
        }
        
        if(nextProps.competitionFinalsState != competitionFinalsState)
        {
            if(competitionFinalsState.onLoad == false && this.state.loading === true)
            {
                this.setState({ loading: false });
                if(!competitionFinalsState.error)
                {
                    if (this.state.buttonPressed == "save" ) {
                        let payload = {
                            yearRefId: this.state.yearRefId, 
                            competitionUniqueKey: this.state.firstTimeCompId,
                            organisationId: this.state.organisationId
                        }
                        if(competitionModuleState.drawGenerateLoad == false)
                        {
                            this.props.generateDrawAction(payload);
                            this.setState({ loading: true });
                        }
                    }
                }
            }
        }
        
        if(nextProps.competitionModuleState != competitionModuleState)
        {
            if(competitionFinalsState.onLoad == false && competitionModuleState.drawGenerateLoad == false 
                && this.state.loading === true)
            {
                if(!competitionModuleState.error){
                    history.push('/competitionDraws');
                }
                this.setState({ loading: false });
            }
    
            if(competitionModuleState.status == 5 && competitionModuleState.drawGenerateLoad == false){
                this.setState({ loading: false });
                message.error(ValidationConstants.drawsMessage[0]);
            }
        }
    }

    apiCalls = (competitionId, yearRefId) => {
        let payload = {
            yearRefId: yearRefId, 
            competitionUniqueKey: competitionId,
            organisationId: this.state.organisationId
        }
        this.props.getCompetitionFinalsAction(payload);
    }

    referenceApiCalls = () => {
        this.props.clearYearCompetitionAction();
         this.props.getMatchTypesAction();
         this.setState({ getDataLoading: true });
    }

    onYearChange(yearId) {
        setOwnCompetitionYear(yearId)
        setOwn_competition(undefined)
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
        this.setState({ firstTimeCompId: null, yearRefId: yearId })
    }

     // on Competition change
     onCompetitionChange(competitionId) {
        console.log("competitionId::" + competitionId);
        setOwn_competition(competitionId)
       let payload = {
           yearRefId: this.state.yearRefId, 
           competitionUniqueKey: competitionId,
           organisationId: this.state.organisationId
       }
       this.props.getCompetitionFinalsAction(payload);
       this.setState({ getDataLoading: true, firstTimeCompId: competitionId })
   }
   
    onChangeSetValue = (id, fieldName, index) => {
        console.log("id::" + id + fieldName + index);
        this.props.updateCompetitionFinalsAction(id, fieldName, index);
    }

    saveCompetitionFinals = () => {
        this.setState({buttonPressed: "save"});
        let finalsList = this.props.competitionFinalsState.competitionFinalsList;

        let payload = {
            "yearRefId": this.state.yearRefId,
            "competitionUniqueKey": this.state.firstTimeCompId,
            "organisationId": 1,
            "finals":finalsList
        }

      this.props.saveCompetitionFinalsAction(payload);
      this.setState({ loading: true });
    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.finals}</Breadcrumb.Item>
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
                        <div className="col-sm-3" >
                            <div className="com-year-select-heading-view" >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    name={"yearRefId"}
                                    className="year-select"
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
                        <div className="col-sm-3" >
                            <div style={{
                                width: "100%", display: "flex",
                                flexDirection: "row",
                                alignItems: "center", marginRight: 50,
                            }} >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    style={{ minWidth: 160 }}
                                    name={"competition"}
                                    className="year-select"
                                    onChange={competitionId => this.onCompetitionChange(competitionId)
                                    }
                                    value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                                >
                                   {own_CompetitionArr.length > 0 && own_CompetitionArr.map(item => {
                                        return (
                                            <Option key={"competition" + item.competitionId} value={item.competitionId}>
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
    contentView = () => {
        let finalsList = this.props.competitionFinalsState.competitionFinalsList;
        let appState = this.props.appState;
        return (
           
            <div className="content-view" style={{paddingLeft: '0px', paddingTop: '0px'}}>
                {(finalsList || []).map((data, index) => (
                <div key={data.competitionFormatTemplateId} className="inside-container-view">
                {/* <Checkbox className="single-checkbox mt-0" defaultChecked={false} onChange={(e) => this.onChange(e)}>{AppConstants.useDefault}</Checkbox> */}
                <span className="applicable-to-heading">{AppConstants.finalFixtures}</span>
                <Radio.Group className="reg-competition-radio" onChange={(e) => this.onChangeSetValue(e.target.value, 'finalsFixtureTemplateRefId', index)} 
                        value={data.finalsFixtureTemplateRefId} >
                    <Radio value={1}>{AppConstants.rounds4Top16}</Radio>
                    <Radio value={2}>{AppConstants.rounds3Top4}</Radio>
                    <Radio value={3}>{AppConstants.rounds2Top3}</Radio>
                    <Radio value={4}>{AppConstants.round1Top2}</Radio>
                    <Radio value={5}>{AppConstants.customise}</Radio>
                </Radio.Group>

                <InputWithHead heading={AppConstants.matchType} />
                <Select
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={(matchType) => this.onChangeSetValue(matchType, 'finalsMatchTypeRefId', index)}
                    value={data.finalsMatchTypeRefId}>
                     {(appState.matchTypes || []).map((item, index) => (
                        <Option key={item.id} value={item.id}>{item.description}</Option>
                    ))}
                </Select>

                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.matchDuration} placeholder={AppConstants.mins} value={data.matchDuration}
                            onChange={(e) => this.onChangeSetValue(e.target.value, 'matchDuration', index)} ></InputWithHead>
                        </div>
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.mainBreak} placeholder={AppConstants.mins}  value={data.mainBreak}
                            onChange={(e) => this.onChangeSetValue(e.target.value, 'mainBreak', index)}></InputWithHead>
                        </div>
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.qtrBreak} placeholder={AppConstants.mins} value={data.qtrBreak}
                            onChange={(e) => this.onChangeSetValue(e.target.value, 'qtrBreak', index)}></InputWithHead>
                        </div>
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.betweenGames} placeholder={AppConstants.mins} value={data.timeBetweenGames}
                            onChange={(e) => this.onChangeSetValue(e.target.value, 'timeBetweenGames', index)}></InputWithHead>
                        </div>
                    </div>
                </div>

                {/* <div className="fluid-width"  >
                    <span className="applicable-to-heading"> {"Apply Finals Format to"} </span>
                    <div className="fluid-width"  >
                        <div className="row" >
                            <div className="col-sm" >
                                <Checkbox.Group style={{ display: "-ms-flexbox", flexDirection: 'column', justifyContent: 'center', }} options={applyTo1}
                                    defaultValue={["All Divisions", "AR1", "AR2", "16", "15", "NetSetGo"]} onChange={(e) => this.onChange(e)} />
                            </div>
                            <div className="col-sm" style={{ paddingTop: 1 }}>
                                <Checkbox.Group style={{ display: "-ms-flexbox", flexDirection: 'column', justifyContent: 'center', }} options={applyTo2}
                                    defaultValue={["13", "12", "11", "10", "14"]} onChange={(e) => this.onChange(e)} />
                            </div>
                        </div>
                    </div>
                </div> */}


                <span className="applicable-to-heading">{AppConstants.extraTimeIfDraw}</span>
                <Radio.Group className="reg-competition-radio" onChange={ (e) => this.onChangeSetValue(e.target.value, 'applyToRefId', index)} 
                                value={data.applyToRefId} >
                    <Radio value={1}>{AppConstants.applyAllRounds}</Radio>
                    <Radio value={2}>{AppConstants.applyAllSemiAndGrand}</Radio>
                    <Radio value={3}>{AppConstants.applyGrandOnly}</Radio>
                </Radio.Group>

                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.extraTimeDuration} placeholder={AppConstants.mins} 
                                        value={data.extraTimeDuration}
                                    onChange={ (e) => this.onChangeSetValue(e.target.value, 'extraTimeDuration', index)} ></InputWithHead>
                        </div>
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.extraTimeMainBreak} placeholder={AppConstants.mins} 
                                        value={data.extraTimeMainBreak}
                                        onChange={ (e) => this.onChangeSetValue(e.target.value, 'extraTimeMainBreak', index)} ></InputWithHead>
                        </div>
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.extraTimeBreak} placeholder={AppConstants.mins} 
                                    value={data.extraTimeBreak}
                                    onChange={ (e) => this.onChangeSetValue(e.target.value, 'extraTimeBreak', index)} ></InputWithHead>
                        </div>
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.beaforeExtraTime} placeholder={AppConstants.mins} 
                                    value={data.beforeExtraTime}
                                    onChange={ (e) => this.onChangeSetValue(e.target.value, 'beforeExtraTime', index)} ></InputWithHead>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <span className="applicable-to-heading">{AppConstants.extraTimeIfDraw2}</span>
                    <Radio.Group className="reg-competition-radio" onChange={ (e) => this.onChangeSetValue(e.target.value, 'extraTimeDrawRefId', index)} 
                                value={data.extraTimeDrawRefId} >
                        <Radio value={1}>{AppConstants.oneGoalWins}</Radio>
                        <Radio value={2}>{AppConstants.twoGoalWins}</Radio>
                    </Radio.Group>
                </div>
                {/* <span className='input-heading-add-another'>+ {AppConstants.addAnotherFinalFormat}</span> */}
                {/* <Checkbox className="single-checkbox pt-2" defaultChecked={data.isDefault} onChange={(e) => this.onChangeSetValue(e.target.checked, 'isDefault',index)}>{AppConstants.setAsDefault}</Checkbox> */}
                </div>
                ))}
            </div>
           
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let finalsList = this.props.competitionFinalsState.competitionFinalsList;
        return (
            <div className="fluid-width" >
                {finalsList!= null && finalsList.length > 0 && (
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm" style={{ display: 'flex', alignItems: "flex-start" }}>
                            {/* <Button type="cancel-button">Cancel</Button> */}
                        </div>
                        <div className="col-sm" >
                            <div className="comp-finals-button-view">
                                {/* <Button className="save-draft-text" type="save-draft-text" 
                                    onClick={() => this.saveCompetitionFinals()}>Save Draft</Button> */}
                                <Button className="open-reg-button" type="primary"
                                 onClick={() => this.saveCompetitionFinals()}>Create Draft Draw</Button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"10"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        <div className="formView">
                            {this.contentView()}
                        </div>
                        <Loader visible={this.state.loading} />
                    </Content>
                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>

        );
    }
}


function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getCompetitionFinalsAction,
        saveCompetitionFinalsAction,
        getMatchTypesAction, 
        updateCompetitionFinalsAction,
        getYearAndCompetitionOwnAction,
        generateDrawAction,
        clearYearCompetitionAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        competitionFinalsState: state.CompetitionFinalsState,
        competitionModuleState: state.CompetitionModuleState,
        appState: state.AppState
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(CompetitionFinals));
