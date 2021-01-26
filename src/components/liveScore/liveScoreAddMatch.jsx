import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Button,
    Form,
    DatePicker,
    TimePicker,
    Select,
    InputNumber,
    Modal,
    Checkbox,
    Radio,
    message,
} from 'antd';
import './liveScore.css';
import moment from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Tooltip from 'react-png-tooltip';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import { getRefBadgeData } from '../../store/actions/appAction';
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions';
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction';
import {
    liveScoreAddEditMatchAction,
    liveScoreAddMatchAction,
    liveScoreUpdateMatchAction,
    liveScoreCreateMatchAction,
    clearMatchAction,
    getCompetitionVenuesList,
    liveScoreClubListAction,
    searchFilterAction,
    liveScoreGetMatchDetailInitiate,
    resetUmpireListBoolAction
} from '../../store/actions/LiveScoreAction/liveScoreMatchAction';
import { liveScoreScorerListAction } from '../../store/actions/LiveScoreAction/liveScoreScorerAction';
import InputWithHead from "../../customComponents/InputWithHead";
import {
    liveScoreCreateRoundAction,
    liveScoreRoundListAction,
} from '../../store/actions/LiveScoreAction/liveScoreRoundAction';
import history from "../../util/history";
import { getLiveScoreCompetiton, getOrganisationData, getUmpireCompetitonData } from '../../util/sessionStorage';
import { getVenuesTypeAction } from "../../store/actions/appAction";
import Loader from '../../customComponents/loader';
import { getliveScoreScorerList } from '../../store/actions/LiveScoreAction/liveScoreAction';
import { isArrayNotEmpty, captializedString } from '../../util/helpers';
import { getLiveScoreDivisionList } from '../../store/actions/LiveScoreAction/liveScoreDivisionAction';
import { ladderSettingGetMatchResultAction } from '../../store/actions/LiveScoreAction/liveScoreLadderSettingAction';
// import { entityTypes } from '../../util/entityTypes';
// import { refRoleTypes } from '../../util/refRoles';
import { umpireListAction, newUmpireListAction } from "../../store/actions/umpireAction/umpireAction";

const { Footer, Content, Header } = Layout;
const { Option } = Select;
const { confirm } = Modal;

class LiveScoreAddMatch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: this.props.location.state ? this.props.location.state.isEdit : false,
            matchId: this.props.location.state ? this.props.location.state.matchId : null,
            visible: false,
            createRound: '',
            loadvalue: false,
            loading: false,
            createMatch: false,
            key: props.location.state ? props.location.state.key ? props.location.state.key : null : null,
            roundLoad: false,
            selectedDivision: null,
            forfeitVisible: false,
            abandonVisible: false,
            umpireKey: this.props.location ? this.props.location.state ? this.props.location.state.umpireKey : null : null,
            compId: null,
            scoringType: null,
            allDisabled: false, ///////allDisabled===false==>>>it is editable,,,,,,,,allDisabled===true===>>>cannot edit the field.
            screenName: props.location.state ? props.location.state.screenName ? props.location.state.screenName : null : null,
            sourceIdAvailable: false,
            modalVisible: false,
            compOrgId: 0,
            isCompParent: false
        };
        this.props.clearMatchAction();
        this.formRef = React.createRef();
    }

    openModel = (matchData, compId, key, isEdit, team1resultId, team2resultId, matchStatus, umpireKey, umpireData, scorerData, recordUmpireType, screenName) => {
        const this_ = this;
        confirm({
            title: 'By making this change you may cause the draw to duplicate or create a conflict. We strongly recommend you make all match changes in the Competition Management Draws screen. Do you want to Proceed anyway?',
            okText: 'OK',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk() {
                this_.props.liveScoreCreateMatchAction(matchData, compId, key, isEdit, team1resultId, team2resultId, matchStatus, null, umpireKey, umpireData, scorerData, recordUmpireType, screenName);
            },
            onCancel() {
                console.log("cancel");
            },
        });
    };

    async componentDidMount() {
        this.props.getRefBadgeData(this.props.appstate.accreditation)
        if (getUmpireCompetitonData() || getLiveScoreCompetiton()) {
            if (this.state.umpireKey === 'umpire') {
                let compData = JSON.parse(getUmpireCompetitonData())
                let orgItem = await getOrganisationData();
                let userOrganisationId = orgItem ? orgItem.organisationId : 0;
                let compOrg_Id = compData ? compData.organisationId : 0
                let isCompParent = userOrganisationId === compOrg_Id
                this.setState({ isCompParent });
                const { id, scoringType, sourceId, competitionOrganisation } = JSON.parse(getUmpireCompetitonData());
                let compOrgId = competitionOrganisation ? competitionOrganisation.id : 0
                this.setState({ compId: id, scoringType, sourceIdAvailable: !!sourceId, compOrgId: compOrgId });

                if (id !== null) {
                    this.props.getCompetitionVenuesList(id, "");
                    this.props.getLiveScoreDivisionList(id);
                    this.props.getliveScoreScorerList(id, 4);
                    this.props.liveScoreClubListAction(id);
                    this.props.umpireListAction({
                        refRoleId: JSON.stringify([15, 20]),
                        entityTypes: isCompParent ? 1 : 6,
                        compId: id,
                        offset: null,
                        compOrgId: compOrgId
                    });
                    // this.props.newUmpireListAction({
                    //     refRoleId: JSON.stringify([15, 20]),
                    //     entityTypes: isCompParent ? 1 : 6,
                    //     compId: id,
                    //     offset: null,
                    //     compOrgId: compOrgId,
                    //     isCompParent: isCompParent
                    // });
                    this.setState({ loadvalue: true, allDisabled: true });
                } else {
                    history.push('/matchDayCompetitions');
                }
            } else if (getLiveScoreCompetiton()) {
                const { id, scoringType, sourceId, competitionOrganisation } = JSON.parse(getLiveScoreCompetiton());
                let compData = JSON.parse(getLiveScoreCompetiton())
                let orgItem = await getOrganisationData();
                let userOrganisationId = orgItem ? orgItem.organisationId : 0;
                let compOrg_Id = compData ? compData.organisationId : 0
                let isCompParent = userOrganisationId === compOrg_Id
                this.setState({ isCompParent });

                let compOrgId = competitionOrganisation ? competitionOrganisation.id : 0
                this.setState({ compId: id, scoringType, sourceIdAvailable: !!sourceId, compOrgId: compOrgId });

                this.props.getCompetitionVenuesList(id, "");
                this.props.getLiveScoreDivisionList(id);
                this.props.getliveScoreScorerList(id, 4);
                this.props.liveScoreClubListAction(id);
                this.props.umpireListAction({
                    refRoleId: JSON.stringify([15, 20]),
                    entityTypes: isCompParent ? 1 : 6,
                    compId: id,
                    offset: null,
                    compOrgId: compOrgId
                });
                // this.props.newUmpireListAction({
                //     refRoleId: JSON.stringify([15, 20]),
                //     entityTypes: isCompParent ? 1 : 6,
                //     compId: id,
                //     offset: null,
                //     compOrgId: compOrgId,
                //     isCompParent: isCompParent
                // });
                this.setState({ loadvalue: true, allDisabled: false });
            } else {
                history.push('/matchDayCompetitions');
            }

            if (this.state.isEdit) {
                let isLineUpEnable = null;
                let match_status = null;
                this.props.liveScoreAddEditMatchAction(this.state.matchId);
                this.props.ladderSettingGetMatchResultAction();
                this.props.liveScoreUpdateMatchAction('', "clearData");

                if (this.state.umpireKey === 'umpire') {
                    const { lineupSelectionEnabled, status } = JSON.parse(getUmpireCompetitonData());
                    isLineUpEnable = lineupSelectionEnabled;
                    match_status = status;
                } else {
                    const { lineupSelectionEnabled, status } = JSON.parse(getLiveScoreCompetiton());
                    isLineUpEnable = lineupSelectionEnabled;
                    match_status = status;
                }

                if (isLineUpEnable == 1) {
                    this.setState({ isLineUp: 1 });
                    this.props.liveScoreGetMatchDetailInitiate(this.props.location.state.matchId, 1);
                } else {
                    this.setState({ isLineUp: 0 });
                    this.props.liveScoreGetMatchDetailInitiate(this.props.location.state.matchId, 0);
                }
            } else {
                this.props.liveScoreUpdateMatchAction('', "addMatch");
            }
        } else {
            history.push('/matchDayCompetitions');
        }
    }

    componentDidUpdate(nextProps) {
        const {
            addEditMatch, start_date, start_time, displayTime,
        } = this.props.liveScoreMatchState;

        if (this.state.isEdit) {
            if (nextProps.liveScoreMatchState !== this.props.liveScoreMatchState) {
                if (this.props.liveScoreMatchState.matchLoad == false && this.state.loadvalue) {
                    // const { id } = JSON.parse(getLiveScoreCompetiton())
                    const division = this.props.liveScoreMatchState.matchData.divisionId;
                    this.setInitialFieldValue(addEditMatch, start_date, start_time, displayTime);
                    this.props.getliveScoreTeams(this.state.compId, division, this.state.compOrgId);
                    this.props.liveScoreRoundListAction(this.state.compId, division);
                    this.setState({ loadvalue: false });
                }
            }
        }

        if (nextProps.liveScoreMatchState !== this.props.liveScoreMatchState) {
            if (this.props.liveScoreMatchState.roundLoad == false && this.state.roundLoad) {
                this.setState({ roundLoad: false });
                const addedRound = this.props.liveScoreMatchState.addEditMatch.roundId;
                this.formRef.current.setFieldsValue({
                    round: addedRound,
                });
            }
            if (this.props.liveScoreMatchState.updateUmpireFetchCall) {
                let matchData = this.props.liveScoreMatchState.matchData;
                let startTime = moment(matchData.startTime);
                let endTime = moment(startTime).add(matchData.matchDuration, 'minutes').add(matchData.mainBreakDuration, 'minutes');
                this.props.newUmpireListAction({
                    entityTypes: this.state.isCompParent ? 1 : 6,
                    compId: this.state.compId,
                    compOrgId: this.state.compOrgId,
                    isCompParent: this.state.isCompParent,
                    matchStartTime: matchData.startTime,
                    matchEndTime: moment(endTime).utc().format()
                });
                this.props.resetUmpireListBoolAction()
            }
        }
    }

    ////set initial value for all validated fields
    setInitialFieldValue(data, start_date, start_time, displayTime) {
        // const formated_date = moment(start_date).format("DD-MM-YYYY");
        const time_formate = moment(displayTime).format("HH:mm");

        this.formRef.current.setFieldsValue({
            date: moment(start_date, "DD-MM-YYYY"),
            time: moment(time_formate, "HH:mm"),
            division: data.division ? data.division.name : "",
            type: data.type,
            home: data.team1.name,
            away: data.team2.name,
            round: data.roundId,
            venue: data.venueCourtId,
            matchDuration: data.matchDuration,
            mainBreak: data.type === 'FOUR_QUARTERS' ? data.mainBreakDuration : data.breakDuration,
            qtrBreak: data.breakDuration,
            addRound: '',
            extraTimeType: data.extraTimeType,
            extraTimeDuration: data.extraTimeDuration,
            extraTimeMainBreak: data.extraTimeType === 'FOUR_QUARTERS' ? data.extraTimeMainBreak : data.extraTimeBreak,
            extraTimeqtrBreak: data.extraTimeType === 'FOUR_QUARTERS' ? data.extraTimeBreak : null,
        });
    }

    /// /method to show modal view after click
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    /// /method to hide modal view after ok click
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    };

    /// /method to hide modal view after click on cancle button
    handleCancel = (e) => {
        this.setState({
            visible: false,
            createRound: '',
        });
    };

    onCreateRound = () => {
        const { addEditMatch, highestSequence } = this.props.liveScoreMatchState;
        const sequence = (highestSequence == -Infinity ? 0 : highestSequence) + 1;
        // const { id } = JSON.parse(getLiveScoreCompetiton())
        const divisionID = addEditMatch.divisionId;

        this.props.liveScoreCreateRoundAction(this.state.createRound, sequence, this.state.compId, divisionID);
        this.setState({ visible: false, createRound: '', roundLoad: true });
    }

    ////modal view
    ModalView() {
        return (
            <Modal
                title={AppConstants.round}
                visible={this.state.visible}
                onOk={this.state.createRound.length === 0 ? this.handleSubmit : this.onCreateRound}
                onCancel={this.handleCancel}
                onChange={(createRound) => this.props.liveScoreUpdateMatchAction(createRound, "")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Save"
                centered
            >
                <Form.Item name="addRound" rules={[{ required: false, message: ValidationConstants.roundField }]}>
                    <InputWithHead
                        required="required-field pb-0 pt-0"
                        heading={AppConstants.round}
                        placeholder={AppConstants.round}
                        // value={this.state.createRound}
                        onChange={(e) => this.setState({ createRound: e.target.value })}
                    />
                </Form.Item>
            </Modal>
        );
    }

    onModalCancel() {
        this.setState({ forfeitVisible: false, abandonVisible: false });
        this.props.liveScoreUpdateMatchAction('', "clearData");
    }

    forefeitedTeamResult = () => {
        const {
            addEditMatch, matchData, start_date, start_time, matchResult, forfietedTeam,
        } = this.props.liveScoreMatchState;

        const date = new Date();
        const endMatchDate = moment(date).format("YYYY-MMM-DD");
        const endMatchTime = moment(date).format("HH:mm");
        const endMatchDateTime = moment(`${endMatchDate} ${endMatchTime}`);
        const formatEndMatchDate = new Date(endMatchDateTime).toISOString();
        const matchStatus = 'ENDED';
        const match_date_ = start_date ? moment(start_date, "DD-MM-YYYY") : null;
        const startDate = match_date_ ? moment(match_date_).format("YYYY-MMM-DD") : null;
        const start = start_time ? moment(start_time).format("HH:mm") : null;
        const datetimeA = moment(`${startDate} ${start}`);
        const formated__Date = new Date(datetimeA).toISOString();

        matchData.startTime = formated__Date;

        // const { id } = JSON.parse(getLiveScoreCompetiton())
        matchData.resultStatus = addEditMatch.resultStatus == "0" ? null : addEditMatch.resultStatus;

        if (forfietedTeam) {
            if (forfietedTeam === 'team1') {
                this.setState({ forfeitVisible: false });
                const team1resultId = matchResult[4].id;
                const team2resultId = matchResult[3].id;
                this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, formatEndMatchDate, this.state.umpireKey, null, null, null, this.state.screenName);
            } else if (forfietedTeam === 'team2') {
                this.setState({ forfeitVisible: false });
                const team1resultId = matchResult[3].id;
                const team2resultId = matchResult[4].id;
                this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, formatEndMatchDate, this.state.umpireKey, null, null, null, this.state.screenName);
            } else if (forfietedTeam === 'both') {
                this.setState({ forfeitVisible: false });
                const team1resultId = matchResult[5].id;
                const team2resultId = matchResult[5].id;
                this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, formatEndMatchDate, this.state.umpireKey, null, null, null, this.state.screenName);
            }
        } else {
            message.config({
                duration: 1.5,
                maxCount: 1,
            });
            message.error(ValidationConstants.pleaseSelectTeam);
        }
    }

    ////modal view
    forfietModalView() {
        const { addEditMatch, forfietedTeam } = this.props.liveScoreMatchState;

        return (
            <Modal
                visible={this.state.forfeitVisible}
                onOk={() => this.forefeitedTeamResult()}
                // onCancel={() => this.setState({ forfeitVisible: false })}
                onCancel={() => this.onModalCancel()}
                // onChange={(createRound) => this.props.liveScoreUpdateMatchAction(createRound, "")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Save"
                centered
            >
                <div className="col-sm">
                    <InputWithHead required="required-field" heading={AppConstants.whichTeamForfeited} />

                    <Select
                        showSearch
                        className="w-100"
                        style={{ paddingRight: 1, minWidth: 182 }}
                        onChange={(value) => this.props.liveScoreUpdateMatchAction(value, "forfietedTeam")}
                        value={forfietedTeam || undefined}
                        placeholder="Select Team"
                        optionFilterProp="children"
                    >
                        <Option key="team1" value="team1">{addEditMatch.team1.name}</Option>
                        <Option key="team2" value="team2">{addEditMatch.team2.name}</Option>
                        <Option key="both" value="both">Both</Option>
                    </Select>
                </div>
            </Modal>
        );
    }

    abandonReasonResult = () => {
        const {
            addEditMatch, matchData, start_date, start_time, matchResult, abandoneReason,
        } = this.props.liveScoreMatchState;
        const date = new Date();
        const endMatchDate = moment(date).format("YYYY-MMM-DD");
        const endMatchTime = moment(date).format("HH:mm");
        const endMatchDateTime = moment(`${endMatchDate} ${endMatchTime}`);
        const formatEndMatchDate = new Date(endMatchDateTime).toISOString();
        const matchStatus = 'ENDED';
        const match_date_ = start_date ? moment(start_date, "DD-MM-YYYY") : null;
        const startDate = match_date_ ? moment(match_date_).format("YYYY-MMM-DD") : null;
        const start = start_time ? moment(start_time).format("HH:mm") : null;
        const datetimeA = moment(`${startDate} ${start}`);
        const formated__Date = new Date(datetimeA).toISOString();

        matchData.startTime = formated__Date;

        // const { id } = JSON.parse(getLiveScoreCompetiton())
        matchData.resultStatus = addEditMatch.resultStatus == "0" ? null : addEditMatch.resultStatus;

        if (abandoneReason) {
            if (abandoneReason === 'Incomplete') {
                this.setState({ abandonVisible: false });
                const team1resultId = matchResult[7].id;
                const team2resultId = matchResult[7].id;
                this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, formatEndMatchDate, this.state.umpireKey, null, null, null, this.state.screenName);
            } else if (abandoneReason === 'notPlayed') {
                this.setState({ abandonVisible: false });
                const team1resultId = matchResult[8].id;
                const team2resultId = matchResult[8].id;
                this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, formatEndMatchDate, this.state.umpireKey, null, null, null, this.state.screenName);
            }
        } else {
            message.config({
                duration: 1.5,
                maxCount: 1,
            });
            message.error(ValidationConstants.selectAbandonMatchReason);
        }
    }

    abandonMatchView() {
        const {
            // addEditMatch,
            abandoneReason
        } = this.props.liveScoreMatchState;
        return (
            <Modal
                visible={this.state.abandonVisible}
                onOk={() => this.abandonReasonResult()}
                // onCancel={() => this.setState({ abandonVisible: false })}
                onCancel={() => this.onModalCancel()}
                // onChange={(createRound) => this.props.liveScoreUpdateMatchAction(createRound, "")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Save"
                centered
            >
                <div className="col-sm">
                    <InputWithHead required="required-field" heading={AppConstants.matchAbandoned} />

                    <Select
                        showSearch
                        className="w-100"
                        style={{ paddingRight: 1, minWidth: 182 }}
                        onChange={(value) => this.props.liveScoreUpdateMatchAction(value, "abandoneReason")}
                        value={abandoneReason || undefined}
                        placeholder="Select Reason"
                        optionFilterProp="children"
                    >
                        <Option key="Incomplete" value="Incomplete">Incomplete</Option>
                        <Option key="notPlayed" value="notPlayed">Not Played</Option>
                    </Select>
                </div>
            </Modal>
        );
    }

    headerView = () => (
        <div className="header-view">
            <Header className="form-header-view d-flex align-items-center bg-transparent">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {this.state.isEdit ? AppConstants.editMatch : AppConstants.addMatch}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        </div>
    )

    ////call api after change scorer
    onScorerChange(scorer, key) {
        const { addEditMatch } = this.props.liveScoreMatchState;
        addEditMatch.scorerStatus = scorer;
        this.props.liveScoreUpdateMatchAction(scorer, key);
    }

    /// Duration & Break View
    duration_break = () => {
        const { addEditMatch } = this.props.liveScoreMatchState;
        const { allDisabled } = this.state;
        return (
            <div className="row">
                <div className="col-sm">
                    <div className="d-flex flex-row align-items-center">
                        <InputWithHead required="required-field" heading={AppConstants.matchDuration} />
                        <Tooltip>
                            <span>{AppConstants.matchDurationMsg}</span>
                        </Tooltip>
                    </div>

                    <Form.Item name="matchDuration" rules={[{ required: true, message: ValidationConstants.durationField }]}>
                        <InputNumber
                            // value={addEditMatch.matchDuration}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(matchDuration) => this.props.liveScoreUpdateMatchAction(matchDuration, "matchDuration")}
                            placeholder="0"
                            disabled={allDisabled}
                        />
                    </Form.Item>
                </div>
                <div className="col-sm">
                    <div className="d-flex flex-row align-items-center">
                        <InputWithHead required="required-field" heading={AppConstants.mainBreak} />
                        <Tooltip>
                            <span>{AppConstants.mainBreakMsg}</span>
                        </Tooltip>
                    </div>
                    <Form.Item name="mainBreak" rules={[{ required: true, message: ValidationConstants.durationField }]}>
                        <InputNumber
                            // value={addEditMatch.mainBreakDuration}
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(mainBreakDuration) => this.props.liveScoreUpdateMatchAction(mainBreakDuration, "mainBreakDuration")}
                            placeholder="0"
                            disabled={allDisabled}
                        />
                    </Form.Item>
                </div>
                {addEditMatch.type === "FOUR_QUARTERS" && (
                    <div className="col-sm">
                        <div className="d-flex flex-row align-items-center">
                            <InputWithHead required="required-field" heading={AppConstants.qtrBreak} />
                            <Tooltip>
                                <span>{AppConstants.qtrBreatMsg}</span>
                            </Tooltip>
                        </div>
                        <Form.Item name="qtrBreak" rules={[{ required: true, message: ValidationConstants.durationField }]}>
                            <InputNumber
                                // value={addEditMatch.qtrBreak}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={(qtrBreak) => this.props.liveScoreUpdateMatchAction(qtrBreak, "qtrBreak")}
                                placeholder="0"
                                disabled={allDisabled}
                            />
                        </Form.Item>
                    </div>
                )}
            </div>
        );
    }

    handleSubmit = (values) => {
    };

    selectDivision(divisionId) {
        this.props.liveScoreUpdateMatchAction(divisionId, 'divisionId');
        this.setState({ selectedDivision: divisionId });
        // const { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.getliveScoreTeams(this.state.compId, divisionId, this.state.compOrgId);
        this.props.liveScoreRoundListAction(this.state.compId, divisionId);
    }

    setUmpireClub(clubId) {
        this.props.liveScoreUpdateMatchAction(clubId, 'umpireClubId');
    }

    ///// On Court Search
    onSearchCourts(value, key) {
        this.props.searchFilterAction(value, key);
    }

    onSearchTeams(value, key) {
        // const { id } = JSON.parse(getLiveScoreCompetiton())
        // this.props.onTeamSearch(id, this.state.selectedDivision ,value, key)
    }

    //// Form View
    contentView = () => {
        const {
            addEditMatch,
            divisionList,
            roundList,
            teamResult,
            recordUmpireType,
            scorer1,
            scorer2,
            // umpire1Name,
            // umpire2Name,
            umpire1TextField,
            umpire2TextField,
            umpire1Orag,
            umpire2Orag,
            umpireReserve,
            umpireCoach,
            // umpire1NameOrgId, 
            // umpireReserveId,
        } = this.props.liveScoreMatchState;
        const {
            venueData, 
            clubListData, 
            coachList, 
            // umpireList, 
            newUmpireList, 
            umpire1NameMainId, 
            umpire2NameMainId,
        } = this.props.liveScoreMatchState;
        const { scorerListResult } = this.props.liveScoreState;
        // const { umpireList, coachList, } = this.props.umpireState
        // const umpireListResult = isArrayNotEmpty(umpireList) ? umpireList : [];
        // const newUmpireListResult = isArrayNotEmpty(newUmpireList) ? newUmpireList : [];
        const coachListResult = isArrayNotEmpty(coachList) ? coachList : [];
        const { allDisabled } = this.state;
        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead required="required-field" heading={AppConstants.date} />

                        <Form.Item name="date" rules={[{ required: true, message: ValidationConstants.dateField }]}>
                            <DatePicker
                                // size="large"
                                className="w-100"
                                onChange={(date) => this.props.liveScoreUpdateMatchAction(date, "start_date")}
                                format="DD-MM-YYYY"
                                showTime={false}
                                name="registrationOepn"
                                placeholder="dd-mm-yyyy"
                                disabled={allDisabled}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.startTime} />
                        <Form.Item name="time" rules={[{ required: true, message: ValidationConstants.timeField }]}>
                            <TimePicker
                                className="comp-venue-time-timepicker w-100"
                                onChange={(time) => this.props.liveScoreUpdateMatchAction(time, 'start_time')}
                                onBlur={(e) => this.props.liveScoreUpdateMatchAction(e.target.value && moment(e.target.value, "HH:mm"), 'start_time')}
                                format="HH:mm"
                                placeholder="Select Time"
                                defaultValue={moment("00:00", "HH:mm")}
                                use12Hours={false}
                                disabled={allDisabled}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <InputWithHead required="required-field" heading={AppConstants.division} />
                        <Form.Item name="division" rules={[{ required: true, message: ValidationConstants.divisionField }]}>
                            <Select
                                showSearch
                                className="w-100"
                                style={{ paddingRight: 1, minWidth: 182 }}
                                onChange={(divisionName) => this.selectDivision(divisionName)}
                                // value={addEditMatch.divisionId}
                                placeholder="Select Division"
                                optionFilterProp="children"
                                disabled={allDisabled}
                            >
                                {isArrayNotEmpty(divisionList) && divisionList.map((item) => (
                                    <Option key={`division_${item.id}`} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <InputWithHead required="required-field" heading={AppConstants.type} />
                        <Form.Item name="type" rules={[{ required: true, message: ValidationConstants.typeField }]}>
                            <Select
                                loading={addEditMatch.team1 && false}
                                className="w-100"
                                style={{ paddingRight: 1, minWidth: 182 }}
                                onChange={(type) => this.props.liveScoreUpdateMatchAction(type, 'type')}
                                // value={addEditMatch.type}
                                placeholder="Select Type"
                                disabled={allDisabled}
                            >
                                {/* <Option value="SINGLE">Single</Option> */}
                                <Option value="TWO_HALVES">Halves</Option>
                                <Option value="FOUR_QUARTERS">Quarters</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            value={addEditMatch.competition.name}
                            disabled
                            heading={AppConstants.competition}
                            placeholder={AppConstants.competition}
                        />
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.matchID} />
                        <InputNumber
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(mnbMatchId) => this.props.liveScoreUpdateMatchAction(mnbMatchId, "mnbMatchId")}
                            value={addEditMatch.mnbMatchId ? addEditMatch.mnbMatchId : ''}
                            placeholder="0"
                            disabled={allDisabled}
                        />
                    </div>
                </div>
                {addEditMatch.divisionId && (
                    <div className="row">
                        <div className="col-sm-6">
                            <InputWithHead required="required-field" heading={AppConstants.homeTeam} />
                            <Form.Item name="home" rules={[{ required: true, message: ValidationConstants.homeField }]}>
                                <Select
                                    showSearch
                                    className="reg-form-multiple-select w-100"
                                    placeholder="Select Home Team"
                                    onChange={(homeTeam) => this.props.liveScoreUpdateMatchAction(homeTeam, "team1id")}
                                    // value={addEditMatch.team1Id ? addEditMatch.team1Id : ''}
                                    // onSearch={(e) => this.onSearchTeams(e, "homeTeam")}
                                    optionFilterProp="children"
                                    disabled={allDisabled}
                                >
                                    {isArrayNotEmpty(teamResult) && teamResult.map((item) => (
                                        <Option key={`homeTeam_${item.id}`} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="col-sm-6">
                            <InputWithHead required="required-field" heading={AppConstants.awayTeam} />
                            <Form.Item name="away" rules={[{ required: true, message: ValidationConstants.awayField }]}>
                                <Select
                                    showSearch
                                    onSearch={(e) => this.onSearchTeams(e, "awayTeam")}
                                    disabled={allDisabled}
                                    optionFilterProp="children"
                                    className="reg-form-multiple-select w-100"
                                    placeholder="Select Away Team"
                                    onChange={(awayTeam) => this.props.liveScoreUpdateMatchAction(awayTeam, "team2id")}
                                // value={addEditMatch.team2Id ? addEditMatch.team2Id : ''}
                                >
                                    {isArrayNotEmpty(teamResult) && teamResult.map((item) => (
                                        <Option key={`awayTeam_${item.id}`} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                )}

                <div className="row">
                    <div className="col-sm-6">
                        <InputWithHead required="required-field" heading={AppConstants.venue} />
                        <Form.Item name="venue" rules={[{ required: true, message: ValidationConstants.venueField }]}>
                            <Select
                                showSearch
                                className="reg-form-multiple-select w-100"
                                placeholder={AppConstants.selectVenue}
                                onChange={(venueId) => this.props.liveScoreUpdateMatchAction(venueId, "venueId")}
                                // value={addEditMatch.venueCourtId}
                                onSearch={(e) => this.onSearchCourts(e, "courts")}
                                optionFilterProp="children"
                                disabled={allDisabled}
                            >
                                {venueData && venueData.map((item) => (
                                    <Option key={`venue_${item.venueCourtId}`} value={item.venueCourtId}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                    {addEditMatch.divisionId && (
                        <div className="col-sm-6">
                            <InputWithHead required="required-field" heading={AppConstants.round} />
                            <Form.Item name="round" rules={[{ required: true, message: ValidationConstants.roundField }]}>
                                <Select
                                    // mode="multiple"
                                    showSearch
                                    onChange={(round) => this.props.liveScoreUpdateMatchAction(round, "roundId")}
                                    placeholder="Select Round"
                                    className="w-100"
                                    // value={addEditMatch.roundId ? addEditMatch.roundId : ''}
                                    optionFilterProp="children"
                                    disabled={allDisabled}
                                >
                                    {isArrayNotEmpty(roundList) && roundList.map((item) => (
                                        <Option key={`round_${item.id}`} value={item.id}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <span
                                style={{ cursor: 'pointer', paddingTop: 11 }}
                                onClick={() => (allDisabled === false ? this.showModal() : null)}
                                className="input-heading-add-another"
                            >
                                +
                                {' '}
                                {AppConstants.addNewRound}
                            </span>
                        </div>
                    )}
                </div>
                {this.duration_break()}

                {this.finalFieldsView()}

                {/* Umpire */}

                {recordUmpireType === 'NONE'
                    ? null
                    : recordUmpireType === 'USERS' ? (
                        <div>
                            <div className="row">
                                <div className="col-sm">
                                    <InputWithHead heading={AppConstants.umpire1Name} />
                                    <Select
                                        className="w-100"
                                        style={{ paddingRight: 1, minWidth: 182 }}
                                        onChange={(umpire1Name) => this.props.liveScoreUpdateMatchAction(umpire1Name, 'umpire1NameSelection')}
                                        placeholder="Select Umpire 1 Name"
                                        // value={umpire1Name ? umpire1Name : undefined}
                                        value={umpire1NameMainId || undefined}
                                    >
                                        {/* {umpireListResult.map((item) => (
                                            <option key={item.id} value={item.id}>{item.firstName + " " + item.lastName + " - " + item.linkedEntity[0].name}</option>
                                        ))} */}

                                        {newUmpireList.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-sm">
                                    <InputWithHead heading={AppConstants.umpire2Name} />
                                    <Select
                                        className="w-100"
                                        style={{ paddingRight: 1, minWidth: 182 }}
                                        onChange={(umpire2Name) => this.props.liveScoreUpdateMatchAction(umpire2Name, 'umpire2NameSelection')}
                                        placeholder="Select Umpire 2 Name"
                                        value={umpire2NameMainId || undefined}
                                    >
                                        {newUmpireList.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            {/* Umpire Reserve and Umpire Coach dpdn */}

                            <div className="row">
                                <div className="col-sm">
                                    <InputWithHead heading={AppConstants.umpireReserve} />
                                    <Select
                                        className="w-100"
                                        style={{ paddingRight: 1, minWidth: 182 }}
                                        onChange={(umpireReserve) => this.props.liveScoreUpdateMatchAction(umpireReserve, 'umpireReserve')}
                                        placeholder="Select Umpire Reserve"
                                        value={umpireReserve || undefined}
                                    >
                                        {newUmpireList.map((item) => (
                                            <option key={item.id} value={item.id}>{item.reserveName}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-sm">
                                    <InputWithHead heading={AppConstants.umpireCoach} />
                                    <Select
                                        className="w-100"
                                        style={{ paddingRight: 1, minWidth: 182 }}
                                        placeholder="Select Umpire Coach"
                                        onChange={(umpireCoach) => this.props.liveScoreUpdateMatchAction(umpireCoach, 'umpireCoach')}
                                        value={umpireCoach || undefined}
                                    >
                                        {/* {coachListResult.map((item) => (
                                            <option key={item.id} value={item.id}>{item.firstName + " " + item.lastName}</option>
                                        ))} */}

                                        {coachListResult.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </div>
                    ) : (
                            recordUmpireType === 'NAMES' && (
                                <div>
                                    <div className="row">
                                        <div className="col-sm">
                                            <InputWithHead
                                                type="text"
                                                heading={AppConstants.umpire1Name}
                                                // onChange={(e) => { this.props.liveScoreUpdateMatchAction(captializedString(e.target.value), 'umpire1') }}
                                                // value={addEditMatch.umpire1}
                                                onChange={(e) => {
                                                    this.props.liveScoreUpdateMatchAction(captializedString(e.target.value), 'umpire1TextField');
                                                }}
                                                value={umpire1TextField || undefined}
                                                placeholder={AppConstants.enterUmpire1name}
                                            />
                                        </div>
                                        <div className="col-sm">
                                            <InputWithHead
                                                heading={AppConstants.umpire2Name}
                                                // onChange={(e) => { this.props.liveScoreUpdateMatchAction(captializedString(e.target.value), 'umpire2') }}
                                                // value={addEditMatch.umpire2}
                                                onChange={(e) => {
                                                    this.props.liveScoreUpdateMatchAction(captializedString(e.target.value), 'umpire2TextField');
                                                }}
                                                value={umpire2TextField}
                                                placeholder={AppConstants.enterUmpire2name}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-sm">
                                            <InputWithHead heading={AppConstants.umpire1Club} />
                                            <Select
                                                // mode='multiple'
                                                className="w-100"
                                                style={{ paddingRight: 1, minWidth: 182 }}
                                                // onChange={(umpire1Club) => this.setUmpireClub(umpire1Club)}
                                                onChange={(umpire1Orag) => {
                                                    this.props.liveScoreUpdateMatchAction(umpire1Orag, 'umpire1Orag');
                                                }}
                                                value={umpire1Orag || undefined}
                                                placeholder="Select Umpire 1 Organisation"
                                            >
                                                {isArrayNotEmpty(clubListData) && clubListData.map((item) => (
                                                    <Option key={`umpire1Org_${item.id}`} value={item.id}>{item.name}</Option>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="col-sm">
                                            <InputWithHead heading={AppConstants.umpire2Club} />
                                            <Select
                                                // mode='multiple'
                                                className="w-100"
                                                style={{ paddingRight: 1, minWidth: 182 }}
                                                // onChange={(umpire2Club) => this.setUmpireClub(umpire2Club)}
                                                onChange={(umpire2Orag) => {
                                                    this.props.liveScoreUpdateMatchAction(umpire2Orag, 'umpire2Orag');
                                                }}
                                                value={umpire2Orag || undefined}
                                                placeholder="Select Umpire 2 Organisation"
                                            >
                                                {isArrayNotEmpty(clubListData) && clubListData.map((item) => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                <div className="row">
                    <div className="col-sm-6">
                        <InputWithHead heading={AppConstants.scorer1} />
                        <Select
                            className="w-100"
                            style={{ paddingRight: 1, minWidth: 182 }}
                            onChange={(scorer1) => this.onScorerChange(scorer1, 'scorer1')}
                            placeholder="Select Scorer"
                            // value={addEditMatch.scorerStatus}
                            value={scorer1 || undefined}
                            disabled={allDisabled}
                        >
                            {scorerListResult.map((item) => (
                                <Option key={`scorer_${item.id}`} value={item.id}>
                                    {item.NameWithNumber}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {this.state.scoringType !== 'SINGLE' && (
                        <div className="col-sm-6">
                            <InputWithHead heading={AppConstants.scorer2} />
                            <Select
                                className="w-100"
                                style={{ paddingRight: 1, minWidth: 182 }}
                                onChange={(scorer2) => this.onScorerChange(scorer2, 'scorer2')}
                                placeholder="Select Scorer"
                                value={scorer2 || undefined}
                                disabled={allDisabled}
                            >
                                {scorerListResult.map((item) => (
                                    <Option key={`scorer_${item.id}`} value={item.id}>
                                        {item.NameWithNumber}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    )}
                </div>

                {this.state.isEdit && (
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.homeTeamFinalScore}
                                placeholder={AppConstants.enterHomeTeamFinalScore}
                                onChange={(event) => this.props.liveScoreUpdateMatchAction(event.target.value, "team1Score")}
                                name="team1Score"
                                value={addEditMatch.team1Score}
                                disabled={allDisabled}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.awayTeamFinalScore}
                                placeholder={AppConstants.enterAwayTeamFinalScore}
                                onChange={(event) => this.props.liveScoreUpdateMatchAction(event.target.value, "team2Score")}
                                name="team2Score"
                                value={addEditMatch.team2Score}
                                disabled={allDisabled}
                            />
                        </div>
                    </div>
                )}

                {this.state.isEdit && (
                    <div className="row">
                        <div className="col-sm-6">
                            <InputWithHead heading={AppConstants.resultStatus} />
                            <Select
                                className="w-100"
                                style={{ paddingRight: 1, minWidth: 182 }}
                                onChange={(value) => this.props.liveScoreUpdateMatchAction(value, "resultStatus")}
                                placeholder="Select Result Status"
                                value={addEditMatch.resultStatus == "0" ? null : addEditMatch.resultStatus}
                                disabled={allDisabled}
                            >
                                <Option key="UNCONFIRMED" value="UNCONFIRMED">Unconfirmed</Option>
                                <Option key="DISPUTE" value="DISPUTE">Dispute</Option>
                                <Option key="FINAL" value="FINAL">Final</Option>
                            </Select>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    finalFieldsView() {
        const { addEditMatch } = this.props.liveScoreMatchState;

        return (
            <div>
                <Checkbox
                    className="single-checkbox mt-5  justify-content-center"
                    onChange={(e) => this.props.liveScoreUpdateMatchAction(e.target.checked, 'isFinals')}
                    checked={addEditMatch.isFinals}
                    disabled={this.state.umpireKey === 'umpire'}
                >
                    {AppConstants.finalMatch}
                </Checkbox>

                {addEditMatch.isFinals && (
                    <div>
                        <span className="input-heading" style={{ fontSize: 18, paddingBottom: 15 }}>{AppConstants.extra_Time}</span>

                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.extraTimeType} />
                                <Select
                                    showSearch
                                    className="w-100"
                                    style={{ paddingRight: 1, minWidth: 182 }}
                                    placeholder="Select Type"
                                    optionFilterProp="children"
                                    onChange={(id) => this.props.liveScoreUpdateMatchAction(id, "extraTimeType")}
                                    value={addEditMatch.extraTimeType ? addEditMatch.extraTimeType : undefined}
                                    disabled={this.state.umpireKey === 'umpire'}
                                >
                                    <Option key="SINGLE_PERIOD" value="SINGLE_PERIOD">Single Period</Option>
                                    <Option key="TWO_HALVES" value="TWO_HALVES">Halves</Option>
                                    <Option key="FOUR_QUARTERS" value="FOUR_QUARTERS">Quarters</Option>
                                </Select>
                            </div>

                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.extraTimeDuration} />

                                <InputNumber
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="0"
                                    onChange={(matchDuration) => this.props.liveScoreUpdateMatchAction(matchDuration, "extraTimeDuration")}
                                    value={addEditMatch.extraTimeDuration}
                                    disabled={this.state.umpireKey === 'umpire'}
                                />
                            </div>

                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.extraTimeMainBreak} />
                                <InputNumber
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="0"
                                    onChange={(matchDuration) => this.props.liveScoreUpdateMatchAction(matchDuration, "extraTimeMainBreak")}
                                    value={addEditMatch.extraTimeMainBreak}
                                    disabled={this.state.umpireKey === 'umpire'}
                                />
                            </div>

                            {addEditMatch.extraTimeType === 'FOUR_QUARTERS' && (
                                <div className="col-sm">
                                    <InputWithHead heading={AppConstants.extraTimeqtrBreak} />
                                    <InputNumber
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        placeholder="0"
                                        onChange={(matchDuration) => this.props.liveScoreUpdateMatchAction(matchDuration, "extraTimeqtrBreak")}
                                        value={addEditMatch.extraTimeqtrBreak}
                                    />
                                </div>
                            )}
                        </div>

                        <span className="input-heading" style={{ fontSize: 18, paddingBottom: 15 }}>{AppConstants.extraTime}</span>

                        <InputWithHead heading={AppConstants.extraTimeIfDraw2} />

                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={(e) => this.props.liveScoreUpdateMatchAction(e.target.value, 'extraTimeWinByGoals')}
                            value={addEditMatch.extraTimeWinByGoals}
                            disabled={this.state.umpireKey === 'umpire'}
                        >
                            <Radio key={1} value={1}>1st Goal Wins</Radio>
                            <Radio key={2} value={2}>2nd Goal Wins</Radio>
                            <Radio key={0} value={0}>None</Radio>
                        </Radio.Group>
                    </div>
                )}
            </div>
        );
    }

    endMatchResult() {
        const {
            addEditMatch, matchData, start_date, start_time, matchResult,
        } = this.props.liveScoreMatchState;
        const date = new Date();
        const endMatchDate = moment(date).format("YYYY-MMM-DD");
        const endMatchTime = moment(date).format("HH:mm");
        const endMatchDateTime = moment(`${endMatchDate} ${endMatchTime}`);
        const formatEndMatchDate = new Date(endMatchDateTime).toISOString();
        const matchStatus = 'ENDED';
        const match_date_ = start_date ? moment(start_date, "DD-MM-YYYY") : null;
        const startDate = match_date_ ? moment(match_date_).format("YYYY-MMM-DD") : null;
        const start = start_time ? moment(start_time).format("HH:mm") : null;
        const datetimeA = moment(`${startDate} ${start}`);
        const formated__Date = new Date(datetimeA).toISOString();

        matchData.startTime = formated__Date;
        matchData.resultStatus = addEditMatch.resultStatus == "0" ? null : addEditMatch.resultStatus;

        if (Number(addEditMatch.team1Score) > Number(addEditMatch.team2Score)) {
            const team1resultId = matchResult[0].id;
            const team2resultId = matchResult[1].id;
            this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, formatEndMatchDate, this.state.umpireKey, null, null, null, this.state.screenName);
        } else if (Number(addEditMatch.team1Score) < Number(addEditMatch.team2Score)) {
            const team1resultId = matchResult[1].id;
            const team2resultId = matchResult[0].id;
            this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, formatEndMatchDate, this.state.umpireKey, null, null, null, this.state.screenName);
        } else if (Number(addEditMatch.team1Score) == Number(addEditMatch.team2Score)) {
            const team1resultId = matchResult[2].id;
            const team2resultId = matchResult[2].id;
            this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, formatEndMatchDate, this.state.umpireKey, null, null, null, this.state.screenName);
        }
    }

    ////create match post method
    addMatchDetails = () => {
        const {
            addEditMatch, /// /////get api response data
            matchData, /// ///post data after updating
            staticMatchData, // static match data
            start_date,
            start_time,
            // start_post_date,
            umpire1Orag,
            umpire1TextField,
            umpire2Orag,
            umpire2TextField,
            umpire1Name,
            umpire2Name,
            scorer1,
            scorer2,
            recordUmpireType,
            matchUmpireId_1,
            matchUmpireId_2,
            scorerRosterId_1,
            scorerRosterId_2,
            umpireRosterId_1,
            umpireRosterId_2,
            team1id,
            team2id,
            matchResult,
            umpireReserve,
            umpireCoach,
            umpire1NameOrgId,
            umpire2NameOrgId,
            umpireReserveId,
            umpireCoachId,
        } = this.props.liveScoreMatchState;
        const match_date_ = moment(start_date, "DD-MM-YYYY");
        const startDate = moment(match_date_).format("YYYY-MMM-DD");
        const start = moment(start_time).format("HH:mm");
        const datetimeA = moment(`${startDate} ${start}`);
        const formated__Date = new Date(datetimeA).toISOString();

        matchData.startTime = formated__Date;

        let umpireData;
        let scorerData;
        let umpire_1_Obj; let umpire_2_Obj; let scorers_1; let scorers_2; let umpireReserve_obj; let
            umpireCoach_obj;

        if (recordUmpireType === 'NAMES') {
            if (matchUmpireId_1) {
                umpire_1_Obj = {
                    matchId: this.state.matchId,
                    organisationId: umpire1Orag,
                    umpireName: umpire1TextField,
                    umpireType: recordUmpireType,
                    sequence: 1,
                    matchUmpiresId: matchUmpireId_1,
                };
            } else {
                umpire_1_Obj = {
                    matchId: this.state.matchId,
                    organisationId: umpire1Orag,
                    umpireName: umpire1TextField,
                    umpireType: recordUmpireType,
                    sequence: 1,
                };
            }

            if (matchUmpireId_2) {
                umpire_2_Obj = {
                    matchId: this.state.matchId,
                    organisationId: umpire2Orag,
                    umpireName: umpire2TextField,
                    umpireType: recordUmpireType,
                    sequence: 2,
                    matchUmpiresId: matchUmpireId_2,
                };
            } else {
                umpire_2_Obj = {
                    matchId: this.state.matchId,
                    organisationId: umpire2Orag,
                    umpireName: umpire2TextField,
                    umpireType: recordUmpireType,
                    sequence: 2,
                };
            }

            if (scorerRosterId_1) {
                scorers_1 = {
                    matchId: this.state.matchId,
                    teamId: team1id,
                    userId: scorer1,
                    roleId: 4,
                    rosterId: scorerRosterId_1,
                };
            } else {
                scorers_1 = {
                    matchId: this.state.matchId,
                    teamId: team1id,
                    userId: scorer1,
                    roleId: 4,
                };
            }

            if (scorerRosterId_2) {
                scorers_2 = {
                    matchId: this.state.matchId,
                    teamId: team2id,
                    userId: scorer2,
                    roleId: 4,
                    rosterId: scorerRosterId_2,
                };
            } else {
                scorers_2 = {
                    matchId: this.state.matchId,
                    teamId: team2id,
                    userId: scorer2,
                    roleId: 4,
                };
            }

            if (this.state.scoringType === 'SINGLE') {
                if (scorer1) {
                    scorerData = [scorers_1];
                }
            } else if (scorer1 && scorer2) {
                scorerData = [scorers_1, scorers_2];
            } else if (scorer1) {
                scorerData = [scorers_1];
            } else if (scorer2) {
                scorerData = [scorers_2];
            }

            if (umpire1TextField && umpire2TextField) {
                umpireData = [umpire_1_Obj, umpire_2_Obj];
            } else if (umpire1TextField) {
                umpireData = [umpire_1_Obj];
            } else if (umpire2TextField) {
                umpireData = [umpire_2_Obj];
            }
            umpireReserve_obj = {
                matchId: this.state.matchId,
                roleId: 19,
                userId: umpireReserve,
            };
            umpireCoach_obj = {
                matchId: this.state.matchId,
                roleId: 20,
                userId: umpireCoach,
            };

            // umpireData = [umpire_1_Obj, umpire_2_Obj]
        } else if (recordUmpireType === 'USERS') {
            umpireReserve_obj = {
                matchId: this.state.matchId,
                roleId: 19,
                userId: umpireReserveId,
            };
            umpireCoach_obj = {
                matchId: this.state.matchId,
                roleId: 20,
                userId: umpireCoachId,
            };
            if (umpireRosterId_1) {
                umpire_1_Obj = {
                    matchId: this.state.matchId,
                    userId: umpire1Name,
                    roleId: 15,
                    rosterId: umpireRosterId_1,
                    organisationId: umpire1NameOrgId,
                    sequence: 1,
                };
            } else {
                umpire_1_Obj = {
                    matchId: this.state.matchId,
                    userId: umpire1Name,
                    roleId: 15,
                    rosterId: null,
                    organisationId: umpire1NameOrgId,
                    sequence: 1,
                };
            }
            if (umpireRosterId_2) {
                umpire_2_Obj = {
                    matchId: this.state.matchId,
                    userId: umpire2Name,
                    roleId: 15,
                    rosterId: umpireRosterId_2,
                    organisationId: umpire2NameOrgId,
                    sequence: 2,
                };
            } else {
                umpire_2_Obj = {
                    matchId: this.state.matchId,
                    userId: umpire2Name,
                    roleId: 15,
                    rosterId: null,
                    organisationId: umpire2NameOrgId,
                    sequence: 2,
                };
            }
            if (scorerRosterId_1) {
                scorers_1 = {
                    matchId: this.state.matchId,
                    teamId: team1id,
                    userId: scorer1,
                    roleId: 4,
                    rosterId: scorerRosterId_1,
                };
            } else {
                scorers_1 = {
                    matchId: this.state.matchId,
                    teamId: team1id,
                    userId: scorer1,
                    roleId: 4,
                };
            }
            if (scorerRosterId_2) {
                scorers_2 = {
                    matchId: this.state.matchId,
                    teamId: team2id,
                    userId: scorer2,
                    roleId: 4,
                    rosterId: scorerRosterId_2,
                };
            } else {
                scorers_2 = {
                    matchId: this.state.matchId,
                    teamId: team2id,
                    userId: scorer2,
                    roleId: 4,
                };
            }
            if (this.state.scoringType === 'SINGLE') {
                if (scorers_1) {
                    umpireData = [umpire_1_Obj, umpire_2_Obj, scorers_1];
                } else {
                    umpireData = [umpire_1_Obj, umpire_2_Obj];
                }
            } else if (umpire1Name && umpire2Name && scorer1 && scorer2) {
                umpireData = [umpire_1_Obj, umpire_2_Obj, scorers_1, scorers_2];
            } else if (umpire1Name && umpire2Name && scorer1) {
                umpireData = [umpire_1_Obj, umpire_2_Obj, scorers_1];
            } else if (umpire1Name && umpire2Name && scorer2) {
                umpireData = [umpire_1_Obj, umpire_2_Obj, scorers_2];
            } else if (umpire1Name && scorer1 && scorer2) {
                umpireData = [umpire_1_Obj, scorers_1, scorers_2];
            } else if (umpire2Name && scorer1 && scorer2) {
                umpireData = [umpire_2_Obj, scorers_1, scorers_2];
            } else if (umpire1Name && scorer1) {
                umpireData = [umpire_1_Obj, scorers_1];
            } else if (umpire2Name && scorer1) {
                umpireData = [umpire_2_Obj, scorers_1];
            } else if (umpire1Name && scorer2) {
                umpireData = [umpire_1_Obj, scorers_2];
            } else if (umpire2Name && scorer2) {
                umpireData = [umpire_2_Obj, scorers_2];
            } else if (umpire1Name && umpire2Name) {
                umpireData = [umpire_1_Obj, umpire_2_Obj];
            } else if (umpire1Name) {
                umpireData = [umpire_1_Obj];
            } else if (umpire2Name) {
                umpireData = [umpire_2_Obj];
            } else if (scorer1 && scorer2) {
                umpireData = [scorers_1, scorers_2];
            } else if (scorer1) {
                umpireData = [scorers_1];
            } else if (scorer2) {
                umpireData = [scorers_2];
            }
            if (umpireReserve) {
                umpireData.push(umpireReserve_obj);
            }
            if (umpireCoach) {
                umpireData.push(umpireCoach_obj);
            }
        }

        if (recordUmpireType === null) {
            if (scorerRosterId_1) {
                if (this.state.isEdit) {
                    scorers_1 = {
                        matchId: this.state.matchId,
                        teamId: team1id,
                        userId: scorer1,
                        roleId: 4,
                        rosterId: scorerRosterId_1,
                    };
                } else {
                    scorers_1 = {
                        matchId: 0,
                        teamId: team1id,
                        userId: scorer1,
                        roleId: 4,
                        rosterId: scorerRosterId_1,
                    };
                }
            } else if (this.state.isEdit) {
                scorers_1 = {
                    matchId: this.state.matchId,
                    teamId: team1id,
                    userId: scorer1,
                    roleId: 4,
                };
            } else {
                scorers_1 = {
                    matchId: 0,
                    teamId: team1id,
                    userId: scorer1,
                    roleId: 4,
                };
            }

            if (scorerRosterId_2) {
                if (this.state.isEdit) {
                    scorers_2 = {
                        matchId: this.state.matchId,
                        teamId: team2id,
                        userId: scorer2,
                        roleId: 4,
                        rosterId: scorerRosterId_2,
                    };
                } else {
                    scorers_2 = {
                        matchId: 0,
                        teamId: team2id,
                        userId: scorer2,
                        roleId: 4,
                        rosterId: scorerRosterId_2,
                    };
                }
            } else if (this.state.isEdit) {
                scorers_2 = {
                    matchId: this.state.matchId,
                    teamId: team2id,
                    userId: scorer2,
                    roleId: 4,
                };
            } else {
                scorers_2 = {
                    matchId: 0,
                    teamId: team2id,
                    userId: scorer2,
                    roleId: 4,
                };
            }

            if (scorer1 && scorer2) {
                umpireData = [scorers_1, scorers_2];
            } else if (scorer1) {
                umpireData = [scorers_1];
            } else if (scorer2) {
                umpireData = [scorers_2];
            }
        }

        let matchStatus = null;
        let team1resultId = null;
        let team2resultId = null;
        if (matchData.id != 0) {
            if (Number(addEditMatch.team1Score) > Number(addEditMatch.team2Score)) {
                team1resultId = matchResult[0].id;
                team2resultId = matchResult[1].id;
            } else if (Number(addEditMatch.team1Score) < Number(addEditMatch.team2Score)) {
                team1resultId = matchResult[1].id;
                team2resultId = matchResult[0].id;
            } else if (Number(addEditMatch.team1Score) == Number(addEditMatch.team2Score)) {
                team1resultId = matchResult[2].id;
                team2resultId = matchResult[2].id;
            }
            matchStatus = addEditMatch.matchStatus === "0" ? null : addEditMatch.matchStatus;
            matchData.resultStatus = addEditMatch.resultStatus == "0" ? null : addEditMatch.resultStatus;
        }

        // this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, null, this.state.umpireKey, umpireData, scorerData, recordUmpireType, this.state.screenName)
        if (this.state.sourceIdAvailable) {
            let showModal = false;
            if (staticMatchData.startTime !== matchData.startTime) {
                showModal = true;
            } else if (staticMatchData?.team1?.id !== matchData.team1id) {
                showModal = true;
            } else if (staticMatchData?.team2?.id !== matchData.team2id) {
                showModal = true;
            } else if (staticMatchData?.team2?.id !== matchData.team2id) {
                showModal = true;
            } else if (staticMatchData?.division?.id !== matchData.divisionId) {
                showModal = true;
            } else if (staticMatchData.roundId !== matchData.roundId) {
                showModal = true;
            } else if (staticMatchData.type !== matchData.type) {
                showModal = true;
            } else if (staticMatchData.matchDuration !== matchData.matchDuration) {
                showModal = true;
            } else if (staticMatchData.mainBreakDuration !== matchData.mainBreakDuration) {
                showModal = true;
            } else if (staticMatchData.breakDuration !== matchData.breakDuration) {
                showModal = true;
            } else if (staticMatchData.venueCourtId !== matchData.venueId) {
                showModal = true;
            } else {
                showModal = false;
            }

            if (showModal) {
                this.openModel(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, null, this.state.umpireKey, umpireData, scorerData, recordUmpireType, this.state.screenName);
            } else {
                this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, null, this.state.umpireKey, umpireData, scorerData, recordUmpireType, this.state.screenName);
            }
        } else {
            this.props.liveScoreCreateMatchAction(matchData, this.state.compId, this.state.key, this.state.isEdit, team1resultId, team2resultId, matchStatus, null, this.state.umpireKey, umpireData, scorerData, recordUmpireType, this.state.screenName);
        }
    }

    footerView = () => (
        <div className="fluid-width">
            {!this.state.membershipIsUsed && (
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-10 col-md-9">
                            <div className="reg-add-save-button p-0">
                                <Button
                                    className="cancelBtnWidth mr-2 mb-3"
                                    onClick={() => history.push(this.state.key === 'dashboard' ? 'matchDayDashboard' : this.state.key === 'umpireRoster' ? 'umpireRoster' : this.state.umpireKey === 'umpire' ? 'umpireDashboard' : '/matchDayMatches')}
                                    type="cancel-button"
                                >
                                    {AppConstants.cancel}
                                </Button>
                                {this.state.isEdit && (
                                    <Button
                                        className="button-spacing-style ml-2 mr-2"
                                        onClick={() => this.setState({ forfeitVisible: true })}
                                        type="cancel-button"
                                    >
                                        {AppConstants.forfeit}
                                    </Button>
                                )}
                                {this.state.isEdit && (
                                    <Button
                                        className="button-spacing-style ml-2 mr-2"
                                        onClick={() => this.setState({ abandonVisible: true })}
                                        type="cancel-button"
                                    >
                                        {AppConstants.abandon}
                                    </Button>
                                )}
                                {this.state.isEdit && (
                                    <Button
                                        className="button-spacing-style ml-2 mr-2"
                                        onClick={() => this.endMatchResult()}
                                        type="cancel-button"
                                    >
                                        {AppConstants.endMatch}
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="col-sm-2 col-md-3">
                            <div className="comp-buttons-view mt-0">
                                <Button
                                    className="publish-button save-draft-text mr-0"
                                    type="primary"
                                    htmlType="submit"
                                    disabled={this.props.liveScoreMatchState.onLoad}
                                >
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    onFinishFailed = (errorInfo) => {
        message.config({ maxCount: 1, duration: 1.5 })
        message.error(ValidationConstants.plzReviewPage)
    };


    render() {
        const screen = (this.props.location.state && this.props.location.state.screenName) ? this.props.location.state.screenName : null;
        return (
            <div className="fluid-width default-bg">
                {this.state.umpireKey ? (
                    <DashboardLayout
                        menuHeading={AppConstants.umpires}
                        menuName={AppConstants.umpires}
                    />
                ) : (
                        <DashboardLayout
                            menuHeading={AppConstants.matchDay}
                            menuName={AppConstants.liveScores}
                            onMenuHeadingClick={() => history.push("./matchDayCompetitions")}
                        />
                    )}

                {this.state.umpireKey ? (
                    <InnerHorizontalMenu menu="umpire" umpireSelectedKey={screen === 'umpireList' ? "2" : "1"} />
                ) : (
                        <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey={this.state.key === 'dashboard' ? '1' : '2'} />
                    )}

                <Loader visible={this.props.liveScoreMatchState.onLoad} />

                <Layout>
                    {this.headerView()}

                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.addMatchDetails}
                        onFinishFailed={this.onFinishFailed}
                        className="login-form"
                    >
                        <Content>
                            <div className="formView">
                                {this.contentView()}
                                {this.ModalView()}
                                {this.forfietModalView()}
                                {this.abandonMatchView()}
                            </div>
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
        getliveScoreDivisions,
        getliveScoreTeams,
        liveScoreAddEditMatchAction,
        liveScoreAddMatchAction,
        liveScoreUpdateMatchAction,
        liveScoreCreateMatchAction,
        liveScoreCreateRoundAction,
        getVenuesTypeAction,
        liveScoreScorerListAction,
        clearMatchAction,
        getCompetitionVenuesList,
        getliveScoreScorerList,
        getLiveScoreDivisionList,
        liveScoreRoundListAction,
        liveScoreClubListAction,
        searchFilterAction,
        ladderSettingGetMatchResultAction,
        umpireListAction,
        newUmpireListAction,
        liveScoreGetMatchDetailInitiate,
        getRefBadgeData,
        resetUmpireListBoolAction
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        liveScoreState: state.LiveScoreState,
        liveScoreMatchState: state.LiveScoreMatchState,
        liveScoreScorerState: state.LiveScoreScorerState,
        liveScoreTeamState: state.LiveScoreTeamState,
        umpireState: state.UmpireState,
        appstate: state.AppState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreAddMatch);
