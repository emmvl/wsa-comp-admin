import React, { Component } from "react";
import { Layout, Breadcrumb, Input, Select, Checkbox, Button, Table,Form,Modal } from 'antd';
import './competition.css';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import {getLadderFormatAction, saveLadderFormatAction, updateLadderFormatAction} from 
                "../../store/actions/competitionModuleAction/ladderFormatAction";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import history from "../../util/history";
import {getYearAndCompetitionAction} from "../../store/actions/appAction";
import Loader from '../../customComponents/loader';
import {getOrganisationData,  setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition } from "../../util/sessionStorage";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionLadder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editModalVisible: false,
            schemeModalVisible: false,
            allDivisionVisible: false,
            currentIndex: 0,
            firstTimeCompId: '',
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: 1,
            deleteModalVisible: false,
            getDataLoading: false,
            buttonPressed: "",
            loading: false
        }
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
            this.props.getYearAndCompetitionAction(this.props.appState.own_YearArr, yearId, 'own_competition')
            this.setState({
                yearRefId: JSON.parse(yearId)
            })
        }
        else {
            this.props.getYearAndCompetitionAction(this.props.appState.own_YearArr, null, 'own_competition')
            setOwnCompetitionYear(1)
        }
    }

    componentDidUpdate(nextProps){
        console.log("componentDidUpdate");
        let ladderFormatState = this.props.ladderFormatState;

        if(nextProps.ladderFormatState != ladderFormatState)
        {
            if (ladderFormatState.onLoad == false && this.state.getDataLoading == true) {
                this.setState({
                    getDataLoading: false,
                })
            }
        }

        if (nextProps.appState !== this.props.appState) {
            console.log("appstate", this.props.appState)

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

        if(ladderFormatState.onLoad == false && this.state.loading === true)
        {
            this.setState({ loading: false });
            if(!ladderFormatState.error)
            {
                if (this.state.buttonPressed == "save" ) {
                    history.push('/competitionFormat');
                }
            }
        }
    }

    apiCalls = (competitionId, yearRefId) => {
        console.log("Api Callse" + competitionId);
        let payload = {
            yearRefId: yearRefId, 
            competitionUniqueKey: competitionId,
            organisationId: this.state.organisationId
        }
        this.props.getLadderFormatAction(payload);
    }

    referenceApiCalls = () => {
       
    }

    onYearChange(yearId) {
        setOwnCompetitionYear(yearId);
        setOwn_competition(undefined);
        this.props.getYearAndCompetitionAction(this.props.appState.own_YearArr, yearId, 'own_competition')
        this.setState({ firstTimeCompId: null, yearRefId: yearId })
    }

     // on Competition change
     onCompetitionChange(competitionId) {
        console.log("competitionId::" + competitionId);
        setOwn_competition(competitionId);
       let payload = {
           yearRefId: this.state.yearRefId, 
           competitionUniqueKey: competitionId,
           organisationId: this.state.organisationId
       }
       this.props.getLadderFormatAction(payload);
       this.setState({ getDataLoading: true, firstTimeCompId: competitionId })
   }
   
    
    handleEditModal = (flag, key, index) => {
        this.setState({
            editModalVisible: flag,
        });
        if(key == "show")
        {
            this.setState({
                currentIndex: index
            })
        }
        if(key == "ok"){
            this.setState({
                schemeModalVisible: true
            })
        }

    }

    handleSchemeModal = (flag, key, index, ladderFormat) => {
        this.setState({
            schemeModalVisible: flag,
        });
        if(key == "ok"){
            ladderFormat[index].isEditted = true;
            ladderFormat[index].ladderSchemeId = 0;
            this.props.updateLadderFormatAction(ladderFormat, "ladderFormat", index);
        }
    }

    handleAllDivisionModal = (flag, key, index, ladderFormat) => {
        this.setState({
            allDivisionVisible: flag
            
        });

        if(key == "ok"){
            this.performAllDivisionOperation(true,ladderFormat,index);
        }
    }
   


    onChange(e, ladderFormat, ladder, index) {
        console.log('checked = ', e);
        let removedDivisions = [];
        let selectDivs = ladderFormat[index].selectedDivisions;
        for(let k in selectDivs){
            if(e.indexOf(selectDivs[k]) == -1){
                {
                    removedDivisions.push(selectDivs[k]);
                    break;
                }
            }
        }

        let a = ladderFormat[index].selectedDivisions.filter(x=>false);
        ladderFormat[index].selectedDivisions = a;

        ladderFormat[index].selectedDivisions = e;
        
        let schemeName =  ladder.schemeName;
        console.log("schemeName::" +schemeName);
        let remainingFormatDiv =  ladderFormat.
                    filter(x=>x.schemeName!= schemeName); 
        
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
        this.props.updateLadderFormatAction(ladderFormat, "ladderFormat", index);
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    };

    onChangeSchemeName = (e, actionKey, index, ladderFormat, schemeData) => {
        let schemaDefault = schemeData.find(x=> x.schemeName === e);
        let resultTypes = schemaDefault.resultTypes;
        ladderFormat[index].resultTypes = resultTypes;
        ladderFormat[index].schemeName = e;
        this.props.updateLadderFormatAction(ladderFormat, actionKey, index);
    }

    onUpdateSchemeName = (e, ladderFormat, index) => {
        ladderFormat[index].schemeName = e.target.value;
        this.props.updateLadderFormatAction(ladderFormat, "ladderFormat", index);
    }

    onClickAddLadder = (e,ladderFormat) => {
        console.log("onClickAddLadder" +e);
        this.props.updateLadderFormatAction(ladderFormat, "ladderFormatAdd", 0);
    }

    onChangeResultType = (e,  index, ladderFormat, resIndex) =>{
        ladderFormat[index].resultTypes[resIndex].points = e.target.value;
        this.props.updateLadderFormatAction(ladderFormat, "ladderFormat", index);
    }

    handleDeleteModal(flag, key, index, ladderFormat)
    {
        this.setState({
            deleteModalVisible: flag
        });
        if(key == "ok"){
            this.deleteLadderFormat(ladderFormat,index);
        }
    }

    deleteModal = (index) => {
        this.setState({
            currentIndex: index,
            deleteModalVisible: true
        });
    }

    deleteLadderFormat = (ladderFormat, index) => {
        let removedLadder = ladderFormat[index];
        let remainingFormatDiv =  ladderFormat.
                    filter(x=>x.schemeName!= removedLadder.schemeName); 
        
        for(let remDiv in remainingFormatDiv)
        {
            let itemDivisions = remainingFormatDiv[remDiv].divisions;
      
            for(let i in removedLadder.selectedDivisions){
                for(let j in itemDivisions){
                    if(itemDivisions[j].competitionMembershipProductDivisionId === removedLadder.selectedDivisions[i])
                    {
                        itemDivisions[j].isDisabled = false;
                    }
                }
            }
        }

        const newList = [].concat(ladderFormat);
        newList.splice(index, 1);

        this.props.updateLadderFormatAction(newList, "ladderFormat", index);
    }

    onChangeAllDivision = (e,ladderFormat,index) => {
        console.log("onChangeAllDivision::" + index);
        this.setState({
            currentIndex: index
        });

        if(ladderFormat.length > 1)
        {
            if(e.target.checked)
            {
                this.setState({
                    allDivisionVisible: true
                });
            }
            else{
                this.performAllDivisionOperation(e.target.checked, ladderFormat, index);
            }
        }else{
            this.performAllDivisionOperation(e.target.checked, ladderFormat, index);
        }
    }

    performAllDivisionOperation = (checkedVal,ladderFormat,index) =>
    {
        console.log("performAllDivisionOperation::" + index);
        let allDivObj = Object.assign(ladderFormat[index]);
        allDivObj.selectedDivisions = [];
        for(let i in allDivObj.divisions)
        {
            allDivObj.divisions[i].isDisabled = false;
        }

        console.log("allDivObj::" + JSON.stringify(allDivObj));
        let arr = [];
        arr.push(allDivObj);
        console.log("newList::" + JSON.stringify(arr));

        this.props.updateLadderFormatAction(checkedVal, "allDivision", index);
        this.props.updateLadderFormatAction(arr, "ladderFormat", index);
    }

    saveLadderFormats = () =>{
        this.setState({buttonPressed: "save"});
        let ladderFormat = [...this.props.ladderFormatState.ladderFormats];
       
        for(let item in ladderFormat)
        {
            const selectedDivisions = ladderFormat[item].selectedDivisions;
            let divisions = ladderFormat[item].divisions;
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

            ladderFormat[item].divisions = divArr;
        }
        let payload = {
            competitionUniqueKey: this.state.firstTimeCompId,
            organisationId: this.state.organisationId,
            yearRefId: this.state.yearRefId,
            ladderFormats: ladderFormat
        }
        this.props.saveLadderFormatAction(payload);
        this.setState({ loading: true });
        console.log("Ladder Formats::" + JSON.stringify(payload));
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.ladder}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                </div>
            </Header >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
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
                                    {this.props.appState.yearList.map(item => {
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
                                    {this.props.appState.competitionList.map(item => {
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
 
        let schemeData = this.props.ladderFormatState.ladderSchemeDefaults;
        let ladderFormat = this.props.ladderFormatState.ladderFormats;
        let isAllDivisionChecked = this.props.ladderFormatState.isAllDivisionChecked;
        return (
            <div className="content-view pt-4" style={{paddingBottom: '0px'}}>
    
               {(ladderFormat || []).map((ladder, index) => (
                <div className="inside-container-view" style={{paddingTop:"14px"}}>
                    <div style={{display:"flex"}}>
                        <InputWithHead heading={AppConstants.ladderFormatScheme} />
                        <div className="transfer-image-view pt-0 pointer" style = {{marginLeft:'auto'}} onClick ={ () => this.deleteModal(index)}>
                            <span className="user-remove-btn" ><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                            <span className="user-remove-text">
                                {AppConstants.remove}
                            </span>
                        </div>
                        {this.deleteConfirmModalView(ladderFormat)}
                    </div>
                    {!ladder.isEditted ? 
                        <div>
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(e) => this.onChangeSchemeName(e, "ladderFormat",index, ladderFormat, schemeData )}
                                value={ladder.schemeName}>
                                {(schemeData || []).map((item, schemeIndex) => (
                                    <Option  key={item.schemeName} value={item.schemeName}>{item.schemeName}</Option>
                                ))}
                            </Select>
                        </div> : 
                        <InputWithHead placeholder={AppConstants.ladderFormatScheme}
                        value={ladder.schemeName}
                        onChange={(e)=> this.onUpdateSchemeName(e, ladderFormat, index)}></InputWithHead>
                    }

                <Checkbox className="single-checkbox pt-2" defaultChecked={isAllDivisionChecked}  onChange={(e) => this.onChangeAllDivision(e, ladderFormat,index)}>{AppConstants.allDivisions}</Checkbox> 
                {!isAllDivisionChecked ? 
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm">
                            <Select
                                mode="multiple"
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(e) =>this.onChange(e, ladderFormat, ladder, index)}
                                value={ladder.selectedDivisions}>   
                                {(ladder.divisions || []).map((division, divIndex)  => (
                                <Option key={division.competitionMembershipProductDivisionId} 
                                    disabled={division.isDisabled}  value={division.competitionMembershipProductDivisionId}>
                                        {division.divisionsName} 
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                    {this.allDivisionModalView(ladderFormat)}
                </div> : null}
                    <div className="inside-container-view" >
                        <div className="table-responsive">
                            <div style={{display: 'flex', paddingLeft: '10px'}}>
                                <div style={{width: '89%'}}><InputWithHead heading={"Result type/Byes"} /></div>
                                <div><InputWithHead heading={"Points"} /></div>
                            </div>
                            {(ladder.resultTypes || []).map((res, resIndex) => (
                                <div style={{display: 'flex', paddingLeft: '10px'}}>
                                    <div style={{width: '89%'}}><InputWithHead heading={res.description} /></div>
                                    <div>
                                        <InputWithHead className="input-inside-table-fees" value={res.points} 
                                            placeholder={"Points"} disabled = {!ladder.isEditted}
                                            onChange={(e) => this.onChangeResultType(e, index, ladderFormat, resIndex)}>
                                        </InputWithHead>
                                    </div>
                                </div>
                            ))}
                        {!ladder.isEditted ?
                        <div style={{ display: 'flex', justifyContent: "flex-end", paddingTop: '10px', paddingRight:'6px' }}>
                                <Button className="open-reg-button" type="primary" style={{height: '34px'}}
                                    onClick={()=> this.handleEditModal(true, "show", index, ladderFormat)}>{AppConstants.edit}</Button>
                             {this.editModalView(ladderFormat)}
                        </div>
                        : null}
                            {/* <Table className="fees-table" columns={columns} dataSource={data} pagination={false} Divider=" false" /> */}
                        </div>
                    </div>
                </div>
                ))}
                { !isAllDivisionChecked ? 
                 <div className="row" >
                    <div className="col-sm" onClick={(e) => this.onClickAddLadder(e, ladderFormat)}>
                        <span className='input-heading-add-another pointer'>+ {AppConstants.addNewLadderScheme}</span>
                    </div>
                </div> : null
                }
            </div>
            
        )
    }

    editModalView = (ladderFormat) => {
        return (
            <div>
              <Modal
                title="Ladder Format"
                visible={this.state.editModalVisible}
                onOk={() => this.handleEditModal(false, "ok")}
                onCancel={() => this.handleEditModal(false, "cancel")}>
                <p>Do you want to edit the existing Result Types?</p>
              </Modal>
              {this.schemeModalView(ladderFormat)}
            </div>
          );
    }

    schemeModalView = (ladderFormat) => {
        return (
            <div>
              <Modal
                title="Ladder Format"
                visible={this.state.schemeModalVisible}
                onOk={() => this.handleSchemeModal(false, "ok", this.state.currentIndex, ladderFormat)}
                onCancel={() => this.handleSchemeModal(false, "cancel", this.state.currentIndex, ladderFormat)}>
                  <InputWithHead heading={AppConstants.ladderFormatScheme} placeholder={AppConstants.ladderFormatScheme}
                        value={ladderFormat[this.state.currentIndex].schemeName} 
                        onChange={(e)=> this.onUpdateSchemeName(e, ladderFormat, this.state.currentIndex)}></InputWithHead>
              </Modal>
            </div>
          );
    }

    allDivisionModalView = (ladderFormat) => {
        return (
            <div>
              <Modal
                title="Ladder Format"
                visible={this.state.allDivisionVisible}
                onOk={() => this.handleAllDivisionModal(false, "ok", this.state.currentIndex, ladderFormat)}
                onCancel={() => this.handleAllDivisionModal(false, "cancel", this.state.currentIndex, ladderFormat)}>
                  <p>This will remove the other ladder formats.</p>
              </Modal>
            </div>
          );
    }

    deleteConfirmModalView = (ladderFormat) => {
        return (
           <div>
             <Modal
               title="Ladder Format"
               visible={this.state.deleteModalVisible}
               onOk={() => this.handleDeleteModal(false, "ok", this.state.currentIndex, ladderFormat)}
               onCancel={() => this.handleDeleteModal(false, "cancel", this.state.currentIndex, ladderFormat)}>
                 <p>Are you sure you want to remove?.</p>
             </Modal>
           </div>
         );
   }

    /////ladderAdjustmentView
    ladderAdjustmentView = () => {
        return (
            <div className="fees-view pt-5" style={{marginTop: '0px'}}>
                <span className='form-heading'>{AppConstants.ladderAdjustment}</span>
                <span className='input-heading-add-another'>+ {AppConstants.addNewAdjustment}</span>

                <div className="transfer-image-view">
                    <img src={AppImages.transfer} alt="" height="45" width="45" />
                    <span className='comp-ladder-recalculate'>{AppConstants.recalculateLadder}</span>

                </div>
            </div>
        )
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
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                <Button className="save-draft-text" type="save-draft-text"
                                onClick={()=> this.saveLadderFormats()}>{AppConstants.saveDraft}</Button>
                                <Button className="open-reg-button" type="primary"
                                onClick={()=> this.saveLadderFormats()}>{AppConstants.finalise}</Button>
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
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"8"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}

                        <div className="formView">
                            {this.contentView()}
                        </div>
                        <div className="formView">
                            {this.ladderAdjustmentView()}
                        </div>
                        <Loader visible={this.props.ladderFormatState.onLoad} />
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
        getLadderFormatAction,
        saveLadderFormatAction,
        updateLadderFormatAction,
        getYearAndCompetitionAction,
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        ladderFormatState: state.LadderFormatState,
        appState: state.AppState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(CompetitionLadder));
