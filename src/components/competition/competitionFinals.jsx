import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Checkbox, Button, Radio, Form, message, DatePicker } from 'antd';
import './competition.css';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import moment from 'moment';
import {getCompetitionFinalsAction, saveCompetitionFinalsAction, updateCompetitionFinalsAction,
    getTemplateDownloadAction} from 
                "../../store/actions/competitionModuleAction/competitionFinalsAction";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import history from "../../util/history";
import { getMatchTypesAction,getYearAndCompetitionOwnAction, clearYearCompetitionAction } from "../../store/actions/appAction";
import Loader from '../../customComponents/loader';
import {generateDrawAction} from "../../store/actions/competitionModuleAction/competitionModuleAction";
import ValidationConstants from "../../themes/validationConstant";
import {     getApplyToAction,
    getExtraTimeDrawAction,
    getFinalFixtureTemplateAction} from '../../store/actions/commonAction/commonAction';
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
                this.setFormFieldValue();
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
                if(!competitionModuleState.error  && competitionModuleState.status == 1){
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
         this.props.getApplyToAction();
         this.props.getExtraTimeDrawAction();
         this.props.getFinalFixtureTemplateAction();
         this.setState({ getDataLoading: true });
    }

    setFormFieldValue = () => {
        console.log("setFormFieldValue");
        let finalsList = Object.assign(this.props.competitionFinalsState.competitionFinalsList);

        (finalsList || []).map((item, index) => {
            this.props.form.setFieldsValue({
                [`finalsStartDate${index}`]: (item.finalsStartDate!= null && item.finalsStartDate!= '') ? 
                                            moment(item.finalsStartDate, "YYYY-MM-DD") : null,
                [`finalsFixtureTemplateRefId${index}`]: item.finalsFixtureTemplateRefId,
                [`finalsMatchTypeRefId${index}`]: item.finalsMatchTypeRefId,
                [`matchDuration${index}`]: item.matchDuration,
                [`mainBreak${index}`]: item.mainBreak,
                [`qtrBreak${index}`]: item.qtrBreak,
                [`timeBetweenGames${index}`]: item.timeBetweenGames,
                [`applyToRefId${index}`]: item.applyToRefId,
                [`extraTimeMatchTypeRefId${index}`]: item.extraTimeMatchTypeRefId,
                [`extraTimeDuration${index}`]: item.extraTimeDuration,
                [`extraTimeMainBreak${index}`]: item.extraTimeMainBreak,
                [`extraTimeBreak${index}`]: item.extraTimeBreak,
                [`beforeExtraTime${index}`]: item.beforeExtraTime,
                [`extraTimeDrawRefId${index}`]: item.extraTimeDrawRefId,
            });
        })
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

    saveCompetitionFinals = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log("err::" + err);
            if(!err)
            {
                this.setState({buttonPressed: "save"});
                let finalsList = this.props.competitionFinalsState.competitionFinalsList;

                let payload = {
                    "yearRefId": this.state.yearRefId,
                    "competitionUniqueKey": this.state.firstTimeCompId,
                    "organisationId": this.state.organisationId,
                    "finals":finalsList
                }
                console.log("Payload:" + JSON.stringify(payload));
                this.props.saveCompetitionFinalsAction(payload);
                this.setState({ loading: true });
            }
        });
        
    }

    downloadTemplate = () => {
        console.log("downloadTemplate");
        this.props.getTemplateDownloadAction(null);
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
                            <div  style={{width: "fit-content",display: "flex", flexDirection: "row",
                                    alignItems: "center"}} >
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
    contentView = (getFieldDecorator) => {
        let finalsList = this.props.competitionFinalsState.competitionFinalsList;
        let appState = this.props.appState;
        let {applyToData, extraTimeDrawData, finalFixtureTemplateData} = this.props.commonReducerState;
        return (
            <div className="content-view" style={{paddingLeft: '0px', paddingTop: '0px'}}>
                {(finalsList || []).map((data, index) => (
                    <div key={data.competitionFormatTemplateId} className="inside-container-view">

                     <InputWithHead heading={AppConstants.divisions} />
                     {data.divisions != null ?
                     <div>
                        {(data.divisions || []).map((div, divIndex) => (
                            <span>
                                <span>{div.divisionName}</span>
                                <span>{data.divisions.length != (divIndex + 1) ? ', ': ''}</span>
                            </span>
                        ))} </div>
                     : <span>{AppConstants.allDivisions}</span>
                        }
                     <div className="row">
                        <div className="col-sm-6">
                            <InputWithHead heading={AppConstants.finalsStartDate} required={"required-field"} />
                            <Form.Item >
                                {getFieldDecorator(`finalsStartDate${index}`,
                                    { rules: [{ required: true, message: ValidationConstants.finalsStartDateRequired }] })(
                                        <DatePicker
                                            size="large"
                                            placeholder={"Select Date"}
                                            style={{ width: "100%" }}
                                            onChange={(e) => this.onChangeSetValue(e, 'finalsStartDate', index)} 
                                            name={"finalsStartDate"}
                                            format={"DD-MM-YYYY"}
                                            showTime={false}

                                        />
                                    )}
                            </Form.Item>
                        </div>
                    </div>
                    <InputWithHead heading={AppConstants.finalFixtures} required={"required-field"} />
                    <Form.Item >
                    {getFieldDecorator(`finalsFixtureTemplateRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.finalFixtureTemplateRequired }]
                    })(
                        <Radio.Group className="reg-competition-radio" 
                            onChange={(e) => this.onChangeSetValue(e.target.value, 'finalsFixtureTemplateRefId', index)} 
                            setFieldsValue={data.finalsFixtureTemplateRefId} >
                                {(finalFixtureTemplateData || []).map((fix, fixIndex) => (
                                    <Radio key={fix.id} value={fix.id}>{fix.description}</Radio>
                                ))}
                        </Radio.Group>
                    )}
                    </Form.Item>
                <InputWithHead heading={AppConstants.matchType}  required={"required-field"} />
                <Form.Item >
                    {getFieldDecorator(`finalsMatchTypeRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.matchTypeRequired }]
                    })(
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={(matchType) => this.onChangeSetValue(matchType, 'finalsMatchTypeRefId', index)}
                        setFieldsValue={data.finalsMatchTypeRefId}>
                        {(appState.matchTypes || []).map((item, index) => (
                            <Option key={item.id} value={item.id}>{item.description}</Option>
                        ))}
                    </Select>
                )}
                </Form.Item>
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-3" >
                            <Form.Item >
                                {getFieldDecorator(`matchDuration${index}`, {
                                    rules: [{ required: true,   pattern: new RegExp("^[1-9][0-9]*$"),
                                        message: ValidationConstants.matchDuration }]
                                })(
                                <InputWithHead heading={AppConstants.matchDuration}  required={"required-field"}
                                placeholder={AppConstants.mins} setFieldsValue={data.matchDuration}
                                onChange={(e) => this.onChangeSetValue(e.target.value, 'matchDuration', index)} ></InputWithHead>
                            )}
                            </Form.Item>
                        </div>
                        {(data.finalsMatchTypeRefId == 2 || data.finalsMatchTypeRefId == 3) ? 
                        <div className="col-sm-3" >
                            <Form.Item >
                                {getFieldDecorator(`mainBreak${index}`, {
                                    rules: [{ required:  true, message: ValidationConstants.mainBreak }]
                                })(
                                <InputWithHead heading={AppConstants.mainBreak}  required={"required-field"}
                                placeholder={AppConstants.mins}  setFieldsValue={data.mainBreak}
                                onChange={(e) => this.onChangeSetValue(e.target.value, 'mainBreak', index)}></InputWithHead>
                                )}
                            </Form.Item>
                        </div>: null
                         }
                        {data.finalsMatchTypeRefId == 3 ? 
                        <div className="col-sm-3" >
                            <Form.Item >
                                {getFieldDecorator(`qtrBreak${index}`, {
                                    rules: [{ required: true, message: ValidationConstants.qtrBreak }]
                                })(
                                <InputWithHead heading={AppConstants.qtrBreak}  required={"required-field"}
                                placeholder={AppConstants.mins} setFieldsValue={data.qtrBreak}
                                onChange={(e) => this.onChangeSetValue(e.target.value, 'qtrBreak', index)}></InputWithHead>
                                )}
                            </Form.Item>
                        </div>
                        : null}
                        {data.timeslotGenerationRefId !=2 ? 
                        <div className="col-sm-3">
                            <Form.Item >
                                {getFieldDecorator(`timeBetweenGames${index}`, {
                                    rules: [{ required: true, message: ValidationConstants.timeBetweenGames }]
                                })(
                                <InputWithHead heading={AppConstants.betweenGames}  required={"required-field"}
                                placeholder={AppConstants.mins} setFieldsValue={data.timeBetweenGames}
                                onChange={(e) => this.onChangeSetValue(e.target.value, 'timeBetweenGames', index)}></InputWithHead>
                                )}
                            </Form.Item>
                        </div>
                        : null }
                    </div>
                </div>

                <span className="applicable-to-heading">{AppConstants.extraTimeIfDraw}</span>
                <Form.Item >
                    {getFieldDecorator(`applyToRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.applyToRequired }]
                    })(
                    <Radio.Group className="reg-competition-radio" onChange={ (e) => this.onChangeSetValue(e.target.value, 'applyToRefId', index)} 
                    setFieldsValue={data.applyToRefId} >
                        {(applyToData || []).map((app, appIndex) => (
                            <Radio key={app.id} value={app.id}>{app.description}</Radio>
                        ))}
                    </Radio.Group>
                )}
                </Form.Item>

                <InputWithHead heading={AppConstants.extraTimeMatchType}  required={"required-field"} />
                <Form.Item >
                    {getFieldDecorator(`extraTimeMatchTypeRefId${index}`, {
                        rules: [{ required: true, message: ValidationConstants.extraTimeMatchTypeRequired }]
                    })(
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={(matchType) => this.onChangeSetValue(matchType, 'extraTimeMatchTypeRefId', index)}
                        setFieldsValue={data.extraTimeMatchTypeRefId}>
                        {(appState.matchTypes || []).map((item, index) => (
                            <Option key={item.id} value={item.id}>{item.description}</Option>
                        ))}
                    </Select>
                )}
                </Form.Item>
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-3" >
                            <Form.Item >
                                {getFieldDecorator(`extraTimeDuration${index}`, {
                                    rules: [{ required: true,   pattern: new RegExp("^[1-9][0-9]*$"),
                                        message: ValidationConstants.extraTimeDurationRequired }]
                                })(
                                    <InputWithHead heading={AppConstants.extraTimeDuration}  required={"required-field"}
                                    placeholder={AppConstants.mins} 
                                    setFieldsValue={data.extraTimeDuration}
                                    onChange={ (e) => this.onChangeSetValue(e.target.value, 'extraTimeDuration', index)} ></InputWithHead>
                            )}
                            </Form.Item>
                        </div>
                        {(data.extraTimeMatchTypeRefId == 2 || data.extraTimeMatchTypeRefId == 3) ? 
                        <div className="col-sm-3" >
                            <Form.Item >
                                {getFieldDecorator(`extraTimeMainBreak${index}`, {
                                    rules: [{ required:  true, message: ValidationConstants.extraTimeMainBreakRequired }]
                                })(
                                    <InputWithHead heading={AppConstants.extraTimeMainBreak}  required={"required-field"}
                                    placeholder={AppConstants.mins} 
                                    setFieldsValue={data.extraTimeMainBreak}
                                        onChange={ (e) => this.onChangeSetValue(e.target.value, 'extraTimeMainBreak', index)} ></InputWithHead>
                            )}
                            </Form.Item>
                        </div> : null
                        }
                        {data.extraTimeMatchTypeRefId == 3 ? 
                        <div className="col-sm-3" >
                            <Form.Item >
                                {getFieldDecorator(`extraTimeBreak${index}`, {
                                    rules: [{ required:  true, message: ValidationConstants.extraTimeBreakRequired }]
                                })(
                                <InputWithHead heading={AppConstants.extraTimeBreak} placeholder={AppConstants.mins} 
                                setFieldsValue={data.extraTimeBreak}  required={"required-field"}
                                    onChange={ (e) => this.onChangeSetValue(e.target.value, 'extraTimeBreak', index)} ></InputWithHead>
                            )}
                            </Form.Item>
                            </div> : null 
                        }
                        {data.timeslotGenerationRefId !=2 ? 
                        <div className="col-sm-3" >
                            <Form.Item >
                                {getFieldDecorator(`beforeExtraTime${index}`, {
                                    rules: [{ required:  true, message: ValidationConstants.beforeExtraTimeRequired }]
                                })(
                                <InputWithHead heading={AppConstants.beaforeExtraTime} placeholder={AppConstants.mins} 
                                setFieldsValue={data.beforeExtraTime}  required={"required-field"}
                                        onChange={ (e) => this.onChangeSetValue(e.target.value, 'beforeExtraTime', index)} ></InputWithHead>
                            )}
                            </Form.Item>
                            </div> : null 
                        }

                    </div>
                </div>
                <div className="mt-4">
                    <InputWithHead heading={AppConstants.extraTimeIfDraw2}  required={"required-field"} />
                    <Form.Item >
                                {getFieldDecorator(`extraTimeDrawRefId${index}`, {
                                    rules: [{ required:  true, message: ValidationConstants.extraTimeDrawRequired }]
                                })(
                        <Radio.Group className="reg-competition-radio" onChange={ (e) => this.onChangeSetValue(e.target.value, 'extraTimeDrawRefId', index)} 
                        setFieldsValue={data.extraTimeDrawRefId} >
                            {(extraTimeDrawData || []).map((ex, exIndex) => (
                                <Radio key={ex.id} value={ex.id}>{ex.description}</Radio>
                            ))}
                        </Radio.Group>
                     )}
                     </Form.Item>
                </div>
                {/* <span className='input-heading-add-another'>+ {AppConstants.addAnotherFinalFormat}</span> */}
                {/* <Checkbox className="single-checkbox pt-2" defaultChecked={data.isDefault} onChange={(e) => this.onChangeSetValue(e.target.checked, 'isDefault',index)}>{AppConstants.setAsDefault}</Checkbox> */}
                </div>
                ))}

                {(finalsList == null || finalsList.length == 0) &&
                <div className="final-validation">
                    {AppConstants.finalsMessage}
                </div>
                }
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
                                <Button className="open-reg-button" type="primary"  htmlType="submit" >Create Draft Draw</Button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        )
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"10"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        autocomplete="off"
                        onSubmit={this.saveCompetitionFinals}
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


function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getCompetitionFinalsAction,
        saveCompetitionFinalsAction,
        getMatchTypesAction, 
        updateCompetitionFinalsAction,
        getYearAndCompetitionOwnAction,
        generateDrawAction,
        clearYearCompetitionAction,
        getTemplateDownloadAction,
        getApplyToAction,
        getExtraTimeDrawAction,
        getFinalFixtureTemplateAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        competitionFinalsState: state.CompetitionFinalsState,
        competitionModuleState: state.CompetitionModuleState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps,mapDispatchToProps)(Form.create()(CompetitionFinals));
