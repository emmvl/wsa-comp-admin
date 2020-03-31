import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Checkbox, Button, Radio,Form, Modal, message } from 'antd';
import './competition.css';
import { NavLink } from 'react-router-dom';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import {getCompetitionFormatAction, saveCompetitionFormatAction, updateCompetitionFormatAction} from 
                "../../store/actions/competitionModuleAction/competitionFormatAction";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";
import {
    getMatchTypesAction, getCompetitionFormatTypesAction, getCompetitionTypesAction,
    getYearAndCompetitionOwnAction, clearYearCompetitionAction
} from "../../store/actions/appAction";

import {generateDrawAction} from "../../store/actions/competitionModuleAction/competitionModuleAction";
import Loader from '../../customComponents/loader';
import {getOrganisationData,  setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition } from "../../util/sessionStorage";


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
            organisationId:  getOrganisationData().organisationUniqueKey,
            yearRefId: 1,
            firstTimeCompId: '',
            getDataLoading: false,
            buttonPressed: "",
            loading: false,
            isFinalAvailable: false
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
        try{
            let competitionFormatState = this.props.competitionFormatState;
            let competitionModuleState = this.props.competitionModuleState;
            if(nextProps.competitionFormatState != competitionFormatState)
            {
                if (competitionFormatState.onLoad == false && this.state.getDataLoading == true) {
                    this.setState({
                        getDataLoading: false,
                    })
                }
            }
            if (nextProps.appState !== this.props.appState) {
              
                let competitionList = this.props.appState.own_CompetitionArr;
                if (nextProps.appState.own_CompetitionArr !== competitionList) {
                    if (competitionList.length > 0) {
                        let competitionId = competitionList[0].competitionId
                        setOwn_competition(competitionId);
                        console.log("competitionId::" + competitionId);
                        this.apiCalls(competitionId, this.state.yearRefId);
                        this.setState({ getDataLoading: true, firstTimeCompId: competitionId })
                    }
                }
            }
    
            if(nextProps.competitionFormatState != competitionFormatState)
            {
                if(competitionFormatState.onLoad == false && this.state.loading === true)
                {
                    this.setState({ loading: false });
                    if(!competitionFormatState.error)
                    {
                        if (this.state.buttonPressed == "save") {
                            if(this.state.isFinalAvailable){
                                history.push('/competitionFinals');
                            }
                            else{
                                let payload = {
                                    yearRefId: this.state.yearRefId, 
                                    competitionUniqueKey: this.state.firstTimeCompId,
                                    organisationId: this.state.organisationId
                                }
                                if(competitionModuleState.drawGenerateLoad == false && 
                                    !this.state.isFinalAvailable)
                                {
                                        this.props.generateDrawAction(payload);
                                        this.setState({ loading: true });
                                }
                            }
                        }
                    }
                }
            }
            
    
            if(nextProps.competitionModuleState != competitionModuleState)
            {
                if(competitionFormatState.onLoad == false && competitionModuleState.drawGenerateLoad == false
                     && this.state.loading === true && !this.state.isFinalAvailable){
                   
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
        catch(error)
        {
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
         this.setState({ getDataLoading: true })
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
        this.props.getCompetitionFormatAction(payload);
        this.setState({ getDataLoading: true, firstTimeCompId: competitionId })
    }

    onChange(e, competitionFormatDivisions, index) {
        console.log('checked = ', e);
        let removedDivisions = [];
        let selectDivs = competitionFormatDivisions[index].selectedDivisions;
        for(let k in selectDivs){
            if(e.indexOf(selectDivs[k]) == -1){
                {
                    removedDivisions.push(selectDivs[k]);
                    break;
                }
            }
        }

        let a = competitionFormatDivisions[index].selectedDivisions.filter(x=>false);
        competitionFormatDivisions[index].selectedDivisions = a;

        competitionFormatDivisions[index].selectedDivisions = e;
        
        let competitionFormatTemplateId =  competitionFormatDivisions[index].competitionFormatTemplateId;
        console.log("competitionFormatTemplateId::" +competitionFormatTemplateId);
        let remainingFormatDiv =  competitionFormatDivisions.
                    filter(x=>x.competitionFormatTemplateId!= competitionFormatTemplateId); 
        
        for(let remDiv in remainingFormatDiv)
        {
            let itemDivisions = remainingFormatDiv[remDiv].divisions;
            // disable true
            for(let i in e){
                for(let j in itemDivisions){
                    if(itemDivisions[j].competitionMembershipProductDivisionId === e[i])
                    {
                        itemDivisions[j].isDisabled = true;
                    }
                }
            }

            for(let i in removedDivisions){
                for(let j in itemDivisions){
                    if(itemDivisions[j].competitionMembershipProductDivisionId === removedDivisions[i])
                    {
                        itemDivisions[j].isDisabled = false;
                    }
                }
            }
        }
        this.props.updateCompetitionFormatAction(competitionFormatDivisions, "competionFormatDivisions");
    }

    onChangeFinal = (e, competitionFormatDivisions,index) => {
        competitionFormatDivisions[index].isFinal = e.target.checked;
        this.props.updateCompetitionFormatAction(competitionFormatDivisions, 'competionFormatDivisions');
    };

    addCompetitionFormatDivision(data){
      
        this.props.updateCompetitionFormatAction(data, 'addCompetitionFormatDivisions');
    }

    handleDeleteModal(flag, key, index, competionFormatDivisions)
    {
        this.setState({
            deleteModalVisible: flag
        });
        if(key == "ok"){
            this.deleteCompetitionFormatDivision(competionFormatDivisions,index);
        }
    }

    deleteCompetitionFormatDivision = (competionFormatDivisions, index) => {
        console.log("*****" + JSON.stringify(competionFormatDivisions));
        console.log("index::" + index);
        let removedFormat = competionFormatDivisions[index];
       
        let remainingFormatDiv =  competionFormatDivisions.
                    filter(x=>x.competitionFormatTemplateId!= removedFormat.competitionFormatTemplateId); 
        
        for(let remDiv in remainingFormatDiv)
        {
            let itemDivisions = remainingFormatDiv[remDiv].divisions;
      
            for(let i in removedFormat.selectedDivisions){
                for(let j in itemDivisions){
                    if(itemDivisions[j].competitionMembershipProductDivisionId === removedFormat.selectedDivisions[i])
                    {
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
        this.props.updateCompetitionFormatAction(id, fieldName);
    }
    onChangeSetCompFormatDivisionValue = (id, fieldName, competitionFormatDivisions, index) =>{
        console.log("fieldName::" + fieldName);
        if(fieldName == "matchDuration")
        {
            competitionFormatDivisions[index].matchDuration = id;
        }
        else if(fieldName == "mainBreak")
        {
            competitionFormatDivisions[index].mainBreak = id;
        }
        else if(fieldName == "qtrBreak")
        {
            competitionFormatDivisions[index].qtrBreak = id;
        }
        else if(fieldName == "timeBetweenGames")
        {
            competitionFormatDivisions[index].timeBetweenGames = id;
        }


        this.props.updateCompetitionFormatAction(competitionFormatDivisions, 'competionFormatDivisions');
    }

    handleAllDivisionModal = (flag, key, index, competionFormatDivisions) => {
        this.setState({
            allDivisionVisible: flag
        });
        if(key == "ok"){
            this.performAllDivisionOperation(true,competionFormatDivisions,index);
        }
    }

    deleteModal = (index) => {
        this.setState({
            currentIndex: index,
            deleteModalVisible: true
        });
    }

    onChangeAllDivision = (e,competionFormatDivisions,index) => {
        console.log("onChangeAllDivision::" + index);
        this.setState({
            currentIndex: index
        });

        if(competionFormatDivisions.length > 1)
        {
            if(e.target.checked)
            {
                this.setState({
                    allDivisionVisible: true
                });
            }
            else{
                this.performAllDivisionOperation(e.target.checked, competionFormatDivisions, index);
            }
        }else{
            this.performAllDivisionOperation(e.target.checked, competionFormatDivisions, index);
        }
    }


    performAllDivisionOperation = (checkedVal,competionFormatDivisions,index) =>
    {
        console.log("performAllDivisionOperation::" + index + "::" + checkedVal);
        let allDivObj = Object.assign(competionFormatDivisions[index]);
        allDivObj.selectedDivisions = [];
        for(let i in allDivObj.divisions)
        {
            allDivObj.divisions[i].isDisabled = false;
        }

        console.log("allDivObj::" + JSON.stringify(allDivObj));
        let arr = [];
        arr.push(allDivObj);
        console.log("newList::" + JSON.stringify(arr));

        this.props.updateCompetitionFormatAction(checkedVal, "allDivision");
        this.props.updateCompetitionFormatAction(arr, 'competionFormatDivisions');
    }


    saveCompetitionFormats = () => {
        this.setState({buttonPressed: "save"});
        let formatList = Object.assign(this.props.competitionFormatState.competitionFormatList);
        let competitionFormatDivision = formatList.competionFormatDivisions;
        formatList.organisationId = this.state.organisationId;

        if(formatList.isDefault == null)
            formatList.isDefault = 0;

        for(let item in competitionFormatDivision)
        {
            console.log("item.isFinal::" + JSON.stringify(competitionFormatDivision[item]["isFinal"]));
            let isFinal = competitionFormatDivision[item]["isFinal"];
            if(isFinal)
            {
                console.log("***********************");
                this.setState({isFinalAvailable: true});
            }

            let competitionFormatTemplateId =  competitionFormatDivision[item].competitionFormatTemplateId;
            if(competitionFormatTemplateId < 0)
                competitionFormatDivision[item].competitionFormatTemplateId = 0;

            const selectedDivisions = competitionFormatDivision[item].selectedDivisions;
            let divisions = competitionFormatDivision[item].divisions;
            let divArr = [];

            for(let j in selectedDivisions)
            {
                let matchDivisions = divisions.
                    find(x=>x.competitionMembershipProductDivisionId === selectedDivisions[j]);
                if(matchDivisions!= "")
                {
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
                        <div className="col-sm-4" >
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
        let data = this.props.competitionFormatState.competitionFormatList;
       // console.log("!!!!!!!!!!!!" + JSON.stringify(data.competitionName));
        let appState = this.props.appState;
        let isAllDivisionChecked = this.props.competitionFormatState.isAllDivisionChecked;
        return (
            <div className="content-view pt-4">
                <InputWithHead heading={AppConstants.competition_name} placeholder={AppConstants.competition_name}
                    value={data.competitionName} onChange={(e)=>this.onChangeSetValue(e.target.value, 'competitionName')}  ></InputWithHead>
                <div style={{ marginTop: 15 }}>
                    <Radio.Group className="reg-competition-radio" onChange={ (e) => this.onChangeSetValue(e.target.value, 'competitionFormatRefId')}  
                                value={data.competitionFormatRefId}>
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
                </div>
                <Checkbox className="single-checkbox pt-3" defaultChecked={false} onChange={(e) => this.onChange(e)}>{AppConstants.use_default_competitionFormat}</Checkbox>
                <InputWithHead heading={AppConstants.fixture_template} />
                <Select
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={(fixTemplate) => this.onChangeSetValue(fixTemplate, 'fixtureTemplateId')}
                    value={data.fixtureTemplateId}>
                    <Option style={{height: '30px'}} value={null} key={null}>{}</Option>
                    {(data.fixtureTemplates || []).map((fixture, fixIndex) => (
                        <Option value={fixture.id} key={fixture.id}>{fixture.name}</Option>
                    ))}
                </Select>

                <InputWithHead heading={"Match Type"} />
                <Select
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={(matchType) => this.onChangeSetValue(matchType, 'matchTypeRefId')}
                    value={data.matchTypeRefId}>
                    {(appState.matchTypes || []).map((item, index) => (
                        <Option key={item.id} value={item.id}>{item.description}</Option>
                    ))}
                </Select>

                <InputWithHead heading={"Number of Rounds"} placeholder={"Number of Rounds"}  value={data.noOfRounds}
                            onChange={(e)=>this.onChangeSetValue(e.target.value, 'noOfRounds')} >
                </InputWithHead>
                <span className="applicable-to-heading">{AppConstants.frequency}</span>
                <Radio.Group className="reg-competition-radio" onChange={ (e) => this.onChangeSetValue(e.target.value, 'competitionTypeRefId')} value={data.competitionTypeRefId} >
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
                            <InputWithHead placeholder={AppConstants.days}  value={data.roundInDays}
                            onChange={(e)=>this.onChangeSetValue(e.target.value, 'roundInDays')}></InputWithHead>
                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead placeholder={AppConstants.hours}  value={data.roundInHours}
                            onChange={(e)=>this.onChangeSetValue(e.target.value, 'roundInHours')}></InputWithHead>

                        </div>
                        <div className="col-sm" style={{ marginTop: 5 }}>
                            <InputWithHead placeholder={AppConstants.mins}  value={data.roundInMins}
                            onChange={(e)=>this.onChangeSetValue(e.target.value, 'roundInMins')}></InputWithHead>
                        </div>
                    </div>
                </div>
                {(data.competionFormatDivisions || []).map((item,index) => (
                    <div className="inside-container-view" key={"compFormat" + index}>
                        <div className="fluid-width" >
                            <div style = {{display:'flex'}}>
                                <div className="applicable-to-heading" style={{paddingTop: '0px'}}>{AppConstants.applyMatchFormat}</div>
                                <div className="transfer-image-view pt-0 pointer" style = {{marginLeft:'auto'}} onClick ={ () => this.deleteModal(index)}>
                                    <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                                    <span className="user-remove-text">
                                        {AppConstants.remove}
                                    </span>
                                </div>
                                {this.deleteConfirmModalView(data.competionFormatDivisions)}
                            </div>
                            <Checkbox className="single-checkbox pt-2" checked={isAllDivisionChecked}  onChange={(e) => this.onChangeAllDivision(e, data.competionFormatDivisions,index)}>{AppConstants.allDivisions}</Checkbox> 
                            {!isAllDivisionChecked ?                             <div className="fluid-width" >
                                <div className="row" >
                                    <div className="col-sm">
                                        <Select
                                            mode="multiple"
                                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                            onChange={(e) => this.onChange(e, data.competionFormatDivisions, index)}
                                            value={item.selectedDivisions}>
                                            {(item.divisions || []).map((division, divIndex)  => (
                                            <Option key={division.competitionMembershipProductDivisionId + divIndex} 
                                                disabled={division.isDisabled}  value={division.competitionMembershipProductDivisionId}>
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
                                <div className="col-sm" >
                                    <InputWithHead heading={AppConstants.matchDuration} 
                                        placeholder={AppConstants.mins} value={item.matchDuration}
                                        onChange={(e)=>this.onChangeSetCompFormatDivisionValue(e.target.value, 'matchDuration',
                                        data.competionFormatDivisions, index)}></InputWithHead>
                                </div>
                                <div className="col-sm" >
                                    <InputWithHead heading={AppConstants.mainBreak} 
                                    placeholder={AppConstants.mins} value={item.mainBreak}
                                    onChange={(e)=>this.onChangeSetCompFormatDivisionValue(e.target.value, 'mainBreak',
                                        data.competionFormatDivisions, index)}></InputWithHead>

                                </div>
                                <div className="col-sm" >
                                    <InputWithHead heading={AppConstants.qtrBreak} placeholder={AppConstants.mins} 
                                        value={item.qtrBreak} onChange={(e)=>this.onChangeSetCompFormatDivisionValue(e.target.value, 'qtrBreak',
                                        data.competionFormatDivisions, index)}></InputWithHead>
                                </div>
                                <div className="col-sm" >
                                    <InputWithHead heading={AppConstants.timeBetweenMatches} placeholder={AppConstants.mins} 
                                        value={item.timeBetweenGames} onChange={(e)=>this.onChangeSetCompFormatDivisionValue(e.target.value, 'timeBetweenGames',
                                        data.competionFormatDivisions, index)}></InputWithHead>
                                </div>
                            </div>
                        </div>
                        <Checkbox className="single-checkbox pt-2" checked={item.isFinal} onChange={(e) => this.onChangeFinal(e, data.competionFormatDivisions,index)}>{AppConstants.applyFinalFormat}</Checkbox>
                    </div>
                 ))}
                {/* <NavLink to="/competitionFinals" >
                    <span className='input-heading-add-another'> {AppConstants.setUpFinalTemplate_optional}</span>
                </NavLink> */}
                { !isAllDivisionChecked ?
                <span className='input-heading-add-another pointer' onClick={() => this.addCompetitionFormatDivision(data)} >+ {AppConstants.addNewCompetitionFormat}</span> : null}
                <Checkbox className="single-checkbox pt-2" defaultChecked={data.isDefault} onChange={(e) => this.onChangeSetValue(e.target.checked, 'isDefault')}>{AppConstants.setAsDefault}</Checkbox>
            </div>
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
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm" style={{ display: 'flex', alignItems: "flex-start" }}>
                            {/* <Button type="cancel-button">Cancel</Button> */}
                        </div>
                        <div className="col-sm" >
                            <div className="comp-finals-button-view">
                                {/* <Button className="save-draft-text" type="save-draft-text"
                                    onClick={()=> this.saveCompetitionFormats()}>{AppConstants.saveDraft}</Button> */}
                                <Button className="open-reg-button" type="primary"
                                    onClick={()=> this.saveCompetitionFormats()}>{AppConstants.createDraftDraw}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
  
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"9"} />
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
        getCompetitionFormatAction,
        saveCompetitionFormatAction,
        getMatchTypesAction, 
        updateCompetitionFormatAction,
        getCompetitionFormatTypesAction,
        getCompetitionTypesAction,
        getYearAndCompetitionOwnAction,
        clearYearCompetitionAction,
        generateDrawAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        competitionFormatState: state.CompetitionFormatState,
        appState: state.AppState,
        competitionModuleState: state.CompetitionModuleState
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(CompetitionFormat));
