import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Button,
    Select,
    Radio,
    DatePicker,
    message,
    Form
} from "antd";
import { NavLink } from "react-router-dom";
import "./competition.css";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import moment from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    venueConstraintListAction,
    updateVenuListAction,
    updateVenuAndTimeDataAction,
    updateVenueConstraintsData,
    venueConstraintPostAction,
    clearVenueTimesDataAction,
    removePrefencesObjectAction
} from "../../store/actions/competitionModuleAction/venueTimeAction";
import { getYearAndCompetitionOwnAction, clearYearCompetitionAction } from '../../store/actions/appAction'
import { getVenuesTypeAction } from "../../store/actions/appAction";
import { venueListAction, getCommonRefData, searchVenueList, clearFilter } from '../../store/actions/commonAction/commonAction'
import { isArrayNotEmpty, isNullOrEmptyString } from "../../util/helpers";
import history from '../../util/history'
import ValidationConstant from '../../themes/validationConstant'
import {
    setOwnCompetitionYear,
    getOwnCompetitionYear,
    setOwn_competition,
    getOwn_competition
} from "../../util/sessionStorage"


const { Header, Footer, Content } = Layout;
const { Option } = Select;


class CompetitionVenueTimesPrioritisation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homeTeamRotation: "rotateTeam",
            loading: false,
            getDataLoading: false,
            saveContraintLoad: false,
            yearRefId: 1,
            firstTimeCompId: "",

        };
        // this.props.clearYearCompetitionAction()
        this.props.getCommonRefData()
    }

    componentDidMount() {
        this.props.venueListAction();
        let yearId = getOwnCompetitionYear()
        let storedCompetitionId = getOwn_competition()
        let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
        let compData = this.props.appState.own_CompetitionArr.length > 0 ? this.props.appState.own_CompetitionArr : undefined
        if (yearId && storedCompetitionId && propsData && compData) {
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId,
                getDataLoading: true
            })
            this.props.venueConstraintListAction(yearId, storedCompetitionId, 1)
        }
        else {
            if (yearId !== undefined) {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, "own_competition")
                this.setState({
                    yearRefId: JSON.parse(yearId),
                })
            }
            else {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, null, "own_competition")
                setOwnCompetitionYear(1)
            }
        }
        // this.setState({ loading: false })
    }

    componentDidUpdate(nextProps) {
        const { yearList } = this.props.appState
        const { competitionUniqueKey, yearRefId } = this.props.venueTimeState
        let storedCompetitionID = getOwn_competition();
        let storedYearID = getOwnCompetitionYear();
        if (nextProps.commonReducerState !== this.props.commonReducerState) {
            this.setState({ filterDrop: this.props.commonReducerState.venueList })
        }
        if (nextProps.appState !== this.props.appState) {
            //     console.log("appState", this.props.appState)
            //     let year_id = ""
            //     if (yearList.length > 0) {
            //         year_id = storedYearID ? storedYearID : yearList[0].id
            //         setOwnCompetitionYear(year_id)
            //     }
            let competitionList = this.props.appState.own_CompetitionArr
            if (nextProps.appState.own_CompetitionArr !== competitionList) {
                if (competitionList.length > 0) {
                    // let competitionId = null

                    // if (storedCompetitionID == null || storedCompetitionID == "null") {
                    let competitionId = competitionList[0].competitionId
                    // } else {
                    // competitionId = storedCompetitionID
                    // }
                    setOwn_competition(competitionId)
                    this.props.venueConstraintListAction(this.state.yearRefId, competitionId, 1)
                    this.setState({ getDataLoading: true, loading: false, firstTimeCompId: competitionUniqueKey })
                }
            }
        }
        // if (this.state.saveContraintLoad == true && this.props.venueTimeState.onLoad == false) {
        //     history.push('/competitionCourtAndTimesAssign')
        //     this.setState({ saveContraintLoad: false })
        // }
        if (this.state.getDataLoading == true && this.props.venueTimeState.onLoad == false) {
            this.setState({ getDataLoading: false })
            this.setDetailsFieldValue()
        }
        if (this.state.loading == true && this.props.appState.onLoad == false) {
            this.props.venueConstraintListAction(this.state.yearRefId, this.state.firstTimeCompId, 1)
            this.setState({ loading: false, getDataLoading: true })
        }

    }

    // for set default values
    setDetailsFieldValue() {
        let allData = this.props.venueTimeState.venueConstrainstData

        ////Non playing dates value
        allData.nonPlayingDates.length > 0 && allData.nonPlayingDates.map((item, index) => {
            console.log("item, index", item, index)
            let name = `name${index}`
            let date = `date${index}`
            this.props.form.setFieldsValue({
                [name]: item.name,
                [date]: moment(item.nonPlayingDate)
            })
        })

        ////Court prefences  value
        allData.courtPreferences.length > 0 && allData.courtPreferences.map((item, index) => {
            console.log("item, index", item, index)
            let courtIDS = `courtIDS${index}`
            this.props.form.setFieldsValue({
                [courtIDS]: item.venueCourtId,
            })
        })
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view">
                <div className="row">
                    <div
                        className="col-sm"
                        style={{ display: "flex", alignContent: "center" }}
                    >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.venues}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        );
    };

    onYearClick(yearId) {
        setOwnCompetitionYear(yearId)
        setOwn_competition(undefined)
        this.setState({ yearRefId: yearId })
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, "own_competition")
    }

    onCompetitionClick(competitionId) {
        setOwn_competition(competitionId)
        this.setState({ firstTimeCompId: competitionId })
        this.props.clearVenueTimesDataAction(competitionId)

        if (this.props.venueTimeState.onVenueDataClear == true) {
            this.setState({ loading: true })
        }
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        const { own_YearArr, own_CompetitionArr, selectedCompetition, selectedYear } = this.props.appState
        const { competitionUniqueKey, yearId } = this.props.venueTimeState
        let competitionId = getOwn_competition();
        let year_id = yearId ? JSON.parse(yearId) : 1
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="com-year-select-heading-view">
                                <span className="year-select-heading">
                                    {AppConstants.year}:
                                    </span>
                                <Select
                                    className="year-select"
                                    onChange={year => this.onYearClick(year)}
                                    value={this.state.yearRefId}
                                >
                                    {own_YearArr.length > 0 && own_YearArr.map((item) => (
                                        < Option value={item.id} > {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginRight: 50
                                }}
                            >
                                <span className="year-select-heading">
                                    {AppConstants.competition}:
                                </span>
                                <Select
                                    className="year-select"
                                    onChange={competitionId => this.onCompetitionClick(competitionId)}
                                    value={this.state.firstTimeCompId}
                                >
                                    {own_CompetitionArr.length > 0 && own_CompetitionArr.map((item) => (
                                        < Option value={item.competitionId}> {item.competitionName}</Option>
                                    ))
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    nonPlayingDatesView(item, index, getFieldDecorator) {
        return (
            <div className="fluid-width">
                <div className="row">
                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator(`name${index}`,
                                {
                                    rules: [{ required: true, message: ValidationConstant.nameField[2] }]
                                })(
                                    <InputWithHead
                                        placeholder={AppConstants.name}
                                        onChange={name => {
                                            this.props.updateVenueConstraintsData(name.target.value, index, 'name', 'nonPlayingDates')

                                        }
                                        }
                                        value={item.name}
                                    />
                                )}
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <Form.Item>
                            {getFieldDecorator(`date${index}`,
                                {
                                    rules: [{ required: true, message: ValidationConstant.dateField }]
                                })(
                                    <DatePicker
                                        className="comp-dashboard-botton-view-mobile"
                                        size="large"
                                        style={{ width: "100%" }}
                                        format={"DD/MM/YYYY"}
                                        showTime={false}
                                        onChange={date => this.props.updateVenueConstraintsData(moment(date).format('YYYY-MM-DD'), index, 'nonPlayingDate', 'nonPlayingDates')}
                                        value={item.nonPlayingDate && moment(item.nonPlayingDate)}
                                    />
                                )}
                        </Form.Item>
                    </div>
                    <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.removePrefencesObjectAction(index, item, 'nonPlayingDates')}>
                        <span className="user-remove-btn">
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </span>
                        <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                    </div>
                </div>
            </div>
        )
    }

    nonPlayingDatesContainer(getFieldDecorator) {
        const { selectedVenue, venueConstrainstData, venueConstrainstListData, nonPlayingDates } = this.props.venueTimeState
        let nonPlayingDatesList = venueConstrainstData ? venueConstrainstData.nonPlayingDates : []
        return (
            <div className="inside-container-view pt-3">
                <InputWithHead heading={AppConstants.nonPlayingDates} />

                {isArrayNotEmpty(nonPlayingDatesList) && nonPlayingDatesList.map((item, index) => {
                    return <div className="col-sm mt-3">
                        {this.nonPlayingDatesView(item, index, getFieldDecorator)}
                    </div>
                })}

                <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenueConstraintsData(null, null, 'nonPlayingDates', 'addAnotherNonPlayingDate')} className="input-heading-add-another">
                    + {AppConstants.addAnotherNonPlayingDate}
                </span>
            </div>
        )
    }

    divisionView(item, index, entityType, getFieldDecorator) {
        const { venueConstrainstListData, courtArray, venueConstrainstData, courtId, divisionList, gradeList } = this.props.venueTimeState
        let divisionsList = isArrayNotEmpty(divisionList) ? divisionList : []
        let courtList = isArrayNotEmpty(courtArray) ? courtArray : []
        let gradesList = isArrayNotEmpty(gradeList) ? gradeList : []
        return (
            <div className="fluid-width">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead heading={'Court'} />
                        <Form.Item>
                            {getFieldDecorator(`courtIDS${index}`,
                                {
                                    rules: [{ required: true, message: ValidationConstant.courtField[3] }]
                                })(
                                    <Select
                                        style={{ width: "100%", minWidth: 182 }}
                                        placeholder={'Select Court'}
                                        onChange={venueCourtId => this.props.updateVenueConstraintsData(venueCourtId, index, "venueCourtId", "courtPreferences")}
                                        value={item.venueCourtId}
                                    >
                                        {courtList.length > 0 && courtList.map((item) => (
                                            < Option value={item.venueId} > {courtList.length > 0 && item.name}</Option>
                                        ))
                                        }
                                    </Select>
                                )}
                        </Form.Item>
                    </div>
                    {entityType == "6" ? <div className="col-sm">
                        <InputWithHead heading={'Division'} />
                        <Select
                            mode={'multiple'}
                            style={{ width: "100%", minWidth: 182, display: "grid", alignItems: 'center' }}
                            placeholder={'Select Division'}
                            onChange={venueCourtId => this.props.updateVenueConstraintsData(venueCourtId, index, "entitiesDivision", "courtPreferences")}
                            value={item.entitiesDivisionId}
                        >
                            {divisionsList.map((item) => (
                                < Option value={item.competitionMembershipProductDivision} > {item.divisionName}</Option>
                            ))
                            }
                        </Select>
                    </div> :
                        <div className="col-sm">
                            <InputWithHead heading={'Grade'} />
                            <Select
                                mode="multiple"
                                style={{ width: "100%", minWidth: 182, display: "grid", alignItems: 'center' }}
                                placeholder={'Select Grade'}
                                value={item.entitiesGradeId}
                                onChange={venueCourtId => this.props.updateVenueConstraintsData(venueCourtId, index, "entitiesGrade", "courtPreferences")}
                            >
                                {
                                    gradesList.map((item) => (
                                        <Option value={item.competitionDivisionGradeId} > {item.gradeName}</Option>
                                    ))
                                }
                            </Select>
                        </div>


                    }
                    <div className="col-sm-2 delete-image-view pb-4" onClick={() => this.props.removePrefencesObjectAction(index, item, 'courtPreferences')}>
                        <span className="user-remove-btn">
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </span>
                        <span style={{ cursor: 'pointer' }} className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                    </div>

                </div>

            </div>
        )
    }

    gradeView() {
        const { venueConstrainstListData, courtArray, venueConstrainstData, gradeList } = this.props.venueTimeState
        let gradesList = isArrayNotEmpty(gradeList) ? gradeList : []
        return (
            // <div className="fluid-width">
            <div className="row">
                <div className="col-sm">
                    <InputWithHead heading={'Court'} />
                    <Select
                        style={{ width: "100%", minWidth: 182 }}
                        placeholder={'Select Court'}
                    >
                        {courtArray.length > 0 && courtArray.map((item) => (
                            < Option value={item.venueCourtId} > {item.name}</Option>
                        ))
                        }
                    </Select>
                </div>
                <div className="col-sm">
                    <InputWithHead heading={'Grade'} />
                    <Select
                        mode="tags"
                        style={{ width: "100%", minWidth: 182, display: "grid", alignItems: 'center' }}
                        placeholder={'Select Grade'}
                    >
                        {gradesList.map((item) => (
                            < Option value={item.competitionDivisionGradeId.toString()} > {item.gradeName}</Option>
                        ))
                        }
                    </Select>
                </div>
            </div>
            // </div>
        )
    }

    courtPrefnceView(getFieldDecorator) {
        const { venueConstrainstListData, venueConstrainstData, evenRotation } = this.props.venueTimeState
        // let courtRotationId = venueConstrainstData && venueConstrainstData.courtRotationRefId
        let courtRotationId = evenRotation
        let courtPreferencesList = isArrayNotEmpty(venueConstrainstData.courtPreferences) ? venueConstrainstData.courtPreferences : []

        return (
            <div>
                <InputWithHead heading={AppConstants.courtPreferences} />
                <div className="comp-venue-time-inside-container-view">
                    {courtPreferencesList.map((item, index, ) => {
                        return <div className="col-sm">
                            {this.divisionView(item, index, courtRotationId, getFieldDecorator)}
                        </div>
                    })}



                    <span style={{ cursor: 'pointer' }} onClick={() => this.props.updateVenueConstraintsData(null, courtRotationId, "courtPreferences", "addCourtPreferences")} className="input-heading-add-another">
                        + {AppConstants.addAnother}
                    </span>
                </div>

            </div>
        )
    }

    homeTeamRotationView() {
        const { radioButton, homeRotation, venueConstrainstData, homeTeamRotation } = this.props.venueTimeState
        let homeTeamRotationList = isArrayNotEmpty(homeTeamRotation) ? homeTeamRotation : []

        return (
            <div>
                <span className="applicable-to-heading">
                    {AppConstants.homeTeamRotation}
                </span>

                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.props.updateVenueConstraintsData(e.target.value, null, "", "homeRotationValue")}
                    value={venueConstrainstData && venueConstrainstData.homeTeamRotationRefId}
                // value={homeRotation}
                // defaultValue={homeRotation}
                >
                    {homeTeamRotationList.length > 0 && homeTeamRotationList.map((item, index) => {
                        return (
                            <Radio value={item.id}>{item.description}</Radio>
                        )

                    }
                    )}
                </Radio.Group>
            </div>
        )
    }


    anyGradePrefenceView() {
        const { radioButton, courtRotation, evenRotation, venueConstrainstData, selectedRadioBtn } = this.props.venueTimeState
        let courtRotationList = isArrayNotEmpty(courtRotation) ? courtRotation : []
        let evenRotaionList = isArrayNotEmpty(courtRotation) ? courtRotation[0].subReferences : []
        let allocateSameCourtList = isArrayNotEmpty(courtRotation) ? courtRotation[1].subReferences : []
        let courtRotationId = venueConstrainstData && venueConstrainstData.courtRotationRefId
        return (
            <div>
                <span className="applicable-to-heading">
                    {AppConstants.anyGradePreference2}
                </span>

                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.props.updateVenueConstraintsData(e.target.value, null, "courtPreferences", "courtParentSelection")}
                    value={selectedRadioBtn}
                >

                    {courtRotationList.length > 0 && courtRotationList.map((item, index) => {
                        return (
                            <div>
                                <Radio value={item.id}>{item.description}</Radio>
                                {item.selectedPrefrence == 1 &&
                                    <div className="ml-5" >
                                        <Radio.Group
                                            className="reg-competition-radio"
                                            onChange={(e) => this.props.updateVenueConstraintsData(e.target.value, null, "", "evenRotationValue", index)}
                                            value={evenRotation}
                                        >
                                            {evenRotaionList.length > 0 && evenRotaionList.map((item, index) => {
                                                return (
                                                    <Radio value={item.id}>{item.description}</Radio>
                                                )

                                            }
                                            )}

                                        </Radio.Group>
                                    </div>
                                }

                                {item.selectedPrefrence == 5 &&
                                    <div className="ml-5" >
                                        <Radio.Group
                                            className="reg-competition-radio"
                                            onChange={(e) => this.props.updateVenueConstraintsData(e.target.value, null, "evenRotation", "radioButtonValue")}
                                            value={evenRotation}
                                        >
                                            {allocateSameCourtList.length > 0 && allocateSameCourtList.map((item, index) => {
                                                return (
                                                    <Radio value={item.id}>{item.description}</Radio>
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



    handleSearch = (value, data) => {
        console.log(value, data)
        // console.log('hello', 'value->', value, data)
        // let filtered
        // if (value !== "") {
        //     filtered = data.filter(dataVenue => {
        //         return dataVenue.venueName.toLowerCase().indexOf(value.toLowerCase()) > -1
        //     })
        //     this.props.searchVenueList(filtered)
        // }
        // else {
        //     this.props.searchVenueList(data)
        // }
        const filteredData = data.filter(memo => {
            return memo.venueName.indexOf(value) > -1
        })
        this.props.searchVenueList(filteredData)

    };

    selectAddVenueView() {
        const { venueList, mainVenueList } = this.props.commonReducerState
        const { searchVenueList } = this.props.commonReducerState
        const { selectedVenueId } = this.props.venueTimeState

        return (
            <div className="fluid-width">
                <div className="row">
                    <div className="col-sm">
                        <Select
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={venueId => {
                                this.props.updateVenueConstraintsData(venueId, null, 'venues', 'venueListSection')
                                // console.log('lol')
                                this.props.clearFilter()
                            }}
                            value={selectedVenueId}
                            placeholder={'Select Venue'}
                            filterOption={false}
                            onSearch={(value) => { this.handleSearch(value, mainVenueList) }}
                        >
                            {venueList.length > 0 && venueList.map((item) => (
                                < Option value={item.venueId} key={item.venueId} > {item.venueName}</Option>
                            ))
                            }
                        </Select>
                        <NavLink
                            to={{ pathname: `/competitionVenueAndTimesAdd`, state: { key: AppConstants.venues } }}
                        >
                            <span className="input-heading-add-another">+{AppConstants.addVenue}</span>
                        </NavLink>
                    </div>
                </div>

            </div>
        )
    }

    ////////form content view
    contentView = (getFieldDecorator) => {
        const { venueConstrainstData, radioButton, selectedRadioBtn } = this.props.venueTimeState
        return (
            <div className="content-view">
                {this.selectAddVenueView()}

                {this.nonPlayingDatesContainer(getFieldDecorator)}

                {this.anyGradePrefenceView()}

                {selectedRadioBtn == 5 && this.courtPrefnceView(getFieldDecorator)}

                {this.homeTeamRotationView()}

            </div >
        );
    };

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        const { venueConstrainstData } = this.props.venueTimeState
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                {/* <Button className="save-draft-text" type="save-draft-text">
                                    {AppConstants.saveDraft}
                                </Button> */}
                                {/* <NavLink to="/competitionCourtAndTimesAssign"> */}
                                <Button className="open-reg-button" htmlType='submit' type="primary">
                                    {AppConstants.save}
                                </Button>
                                {/* </NavLink> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    onSaveConstraints = (e) => {
        let venueConstarintsDetails = this.props.venueTimeState
        const { venueConstrainstData, competitionUniqueKey, yearRefId, courtPreferencesPost } = venueConstarintsDetails

        let postObject = {
            "competitionUniqueKey": competitionUniqueKey,
            "yearRefId": yearRefId,
            "organisationId": 1,
            "venues": venueConstarintsDetails.venuePost,
            "nonPlayingDates": venueConstrainstData.nonPlayingDates,
            "venueConstraintId": venueConstrainstData.venueConstraintId,
            "courtRotationRefId": venueConstrainstData.courtRotationRefId,
            "homeTeamRotationRefId": venueConstrainstData.homeTeamRotationRefId,
            "courtPreferences": courtPreferencesPost
        }
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ saveContraintLoad: true })
                this.props.venueConstraintPostAction(postObject)
            }
        })
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.competitions}
                    menuName={AppConstants.competitions}
                />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"7"} />
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
                    <Form
                        onSubmit={this.onSaveConstraints}
                        noValidate="noValidate"
                    >
                        <Content>

                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
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
        venueConstraintListAction,
        updateVenuListAction,
        getYearAndCompetitionOwnAction,
        getVenuesTypeAction,
        updateVenuAndTimeDataAction,
        updateVenueConstraintsData,
        venueConstraintPostAction,
        venueListAction,
        getCommonRefData,
        clearVenueTimesDataAction,
        removePrefencesObjectAction,
        clearYearCompetitionAction,
        searchVenueList,
        clearFilter
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        venueTimeState: state.VenueTimeState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(CompetitionVenueTimesPrioritisation));
