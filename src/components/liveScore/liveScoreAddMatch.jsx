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
    Modal
} from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import moment, { utc } from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import {
    liveScoreAddEditMatchAction,
    liveScoreAddMatchAction,
    liveScoreUpdateMatchAction,
    liveScoreCreateMatchAction,
    clearMatchAction,
    getCompetitonVenuesList
} from '../../store/actions/LiveScoreAction/liveScoreMatchAction'
import { liveScoreScorerListAction } from '../../store/actions/LiveScoreAction/liveScoreScorerAction';
import InputWithHead from "../../customComponents/InputWithHead";
import liveScoreCreateRoundAction from '../../store/actions/LiveScoreAction/liveScoreRoundAction'
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage';
import { formateTime, liveScore_formateDate, formatDateTime } from '../../themes/dateformate'
import { getVenuesTypeAction } from "../../store/actions/appAction"
import Loader from '../../customComponents/loader'
import { getliveScoreScorerList } from '../../store/actions/LiveScoreAction/liveScoreAction';
import { isArrayNotEmpty, isNullOrEmptyString } from '../../util/helpers';
const { Footer, Content, Header } = Layout;
const { Option } = Select;

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
            key: props.location.state ? props.location.state.key : null,
            roundLoad: false
        }
        // this.props.getVenuesTypeAction()

        this.props.clearMatchAction()


        // this.props.liveScoreUpdateMatchAction(this.state.matchId, "id")
    }

    componentDidMount() {
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        if (id !== null) {
            this.props.getCompetitonVenuesList(id);
            this.props.getliveScoreDivisions(id)
            this.props.getliveScoreScorerList(id, 4)
            this.setState({ loadvalue: true })
        } else {
            history.push('/')
        }

        // this.setState({  loadvalue: true })
        if (this.state.isEdit == true) {
            // let { addEditMatch } = this.props.liveScoreMatchState
            this.props.liveScoreAddEditMatchAction(this.state.matchId)
        } else {
            // this.props.liveScoreAddMatchAction()
        }
    }

    componentDidUpdate(nextProps) {
  
        let { addEditMatch, start_date, start_time, displayTime } = this.props.liveScoreMatchState

        if (this.state.isEdit == true) {
            if (nextProps.liveScoreMatchState !== this.props.liveScoreMatchState) {

                if (this.props.liveScoreMatchState.matchLoad == false && this.state.loadvalue == true) {

                    this.setInitalFiledValue(addEditMatch, start_date, start_time, displayTime)
                    this.setState({ loadvalue: false })

                }
            }
        }

        if (nextProps.liveScoreMatchState !== this.props.liveScoreMatchState) {
            if (this.props.liveScoreMatchState.matchLoad == false && this.state.roundLoad == true) {
                this.setState({ roundLoad: false })
                let addedRound = this.props.liveScoreMatchState.addEditMatch.roundId
                this.props.form.setFieldsValue({
                    'round': addedRound,
                })
            }
        }
    }

    ////set initial value for all validated fields
    setInitalFiledValue(data, start_date, start_time, displayTime) {
        let formated_date = moment(start_date).format("DD-MM-YYYY")
        let time_formate = moment(displayTime).format("HH:mm");
        // let time_value = datee.toLocaleTimeString()

        this.props.form.setFieldsValue({
            'date': moment(start_date, "DD-MM-YYYY"),
            'time': moment(time_formate, "HH:mm"),
            'division': data.division ? data.division.name : "",
            'type': data.type,
            'home': data.team1.name,
            'away': data.team2.name,
            'round': data.roundId,
            'venue': data.venueCourtId,
            'matchDuration': data.matchDuration,
            'mainBreak': data.type == 'FOUR_QUARTERS' ? data.mainBreakDuration : data.breakDuration,
            'qtrBreak': data.breakDuration,
            'addRound': ''
        })

    }

    ////method to show modal view after click
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    ////method to hide modal view after ok click
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    ////method to hide modal view after click on cancle button
    handleCancel = e => {
        this.setState({
            visible: false,
            createRound: ''
        });
    };


    onCreateRound = () => {
        let { addEditMatch, start_date, start_time } = this.props.liveScoreMatchState
        let sequence = 1
        const { id } = JSON.parse(getLiveScoreCompetiton())
        let divisionID = addEditMatch.divisionId
        console.log(addEditMatch)
        this.props.liveScoreCreateRoundAction(this.state.createRound, sequence, id, divisionID)
        // this.setInitalFiledValue(addEditMatch, start_date, start_time)
        this.setState({ visible: false, createRound: '', roundLoad: true })
    }

    ////modal view
    ModalView(getFieldDecorator) {
        return (
            <Modal
                visible={this.state.visible}
                onOk={this.state.createRound.length == 0 ? this.handleSubmit : this.onCreateRound}
                onCancel={this.handleCancel}
                onChange={(createRound) => this.props.liveScoreUpdateMatchAction(createRound, "")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText={'Save'}
                centered={true}
            >
                <Form.Item>
                    {getFieldDecorator('addRound', {
                        rules: [{ required: false, message: ValidationConstants.roundField }]
                    })(
                        <InputWithHead
                            required={"required-field pb-0"}
                            heading={AppConstants.round}
                            placeholder={AppConstants.round}
                            value={this.state.createRound}
                            onChange={(e) => this.setState({ createRound: e.target.value })} />
                    )}
                </Form.Item>
            </Modal>
        )
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view" style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",

                }} >
                    <div className="row" >
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">{this.state.isEdit == true ? AppConstants.editMatch : AppConstants.addMatch}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    ////call api after change scorer
    onScorerChange(scorer) {
        let { addEditMatch } = this.props.liveScoreMatchState
        addEditMatch.scorerStatus = scorer
        this.props.liveScoreUpdateMatchAction(addEditMatch)
    }

    /// Duration & Break View
    duration_break = (getFieldDecorator) => {
        let { addEditMatch } = this.props.liveScoreMatchState
        console.log(addEditMatch, "addEditMatch");
        return (

            <div className="row">
                <div className="col-sm">
                    <InputWithHead required={"required-field"} heading={AppConstants.matchDuration} />
                    <Form.Item>
                        {getFieldDecorator('matchDuration', {
                            rules: [{ required: true, message: ValidationConstants.durationField }]
                        })(
                            <InputNumber
                                value={addEditMatch.matchDuration}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={(matchDuration) => this.props.liveScoreUpdateMatchAction(matchDuration, "matchDuration")}
                                placeholder={'0'}
                            />
                        )}
                    </Form.Item>
                </div>
                <div className="col-sm">
                    <InputWithHead required={"required-field"} heading={AppConstants.mainBreak} />
                    <Form.Item>
                        {getFieldDecorator('mainBreak', {
                            rules: [{ required: true, message: ValidationConstants.durationField }]
                        })(
                            <InputNumber
                                value={addEditMatch.mainBreakDuration}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={(mainBreakDuration) => this.props.liveScoreUpdateMatchAction(mainBreakDuration, "mainBreakDuration")}
                                placeholder={'0'}
                            />
                        )}
                    </Form.Item>
                </div>
                {addEditMatch.type == "FOUR_QUARTERS" && <div className="col-sm">
                    <InputWithHead required={"required-field"} heading={AppConstants.qtrBreak} />
                    <Form.Item>
                        {getFieldDecorator('qtrBreak', {
                            rules: [{ required: true, message: ValidationConstants.durationField }]
                        })(
                            <InputNumber
                                value={addEditMatch.qtrBreak}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={(qtrBreak) => this.props.liveScoreUpdateMatchAction(qtrBreak, "qtrBreak")}
                                placeholder={'0'}
                            // onChange={onChange}
                            />
                        )}
                    </Form.Item>
                </div>}
            </div>
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

            }
        });
    };

    //// Form View
    contentView = (getFieldDecorator) => {
        let { addEditMatch, start_date, start_time } = this.props.liveScoreMatchState
        let { liveScoreState } = this.props
        let { venueData } = this.props.liveScoreMatchState
        const { scorerListResult } = this.props.liveScoreState

        console.log('1234', addEditMatch)

        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead required={"required-field"} heading={AppConstants.date} />

                        <Form.Item>
                            {getFieldDecorator('date', {
                                rules: [{ required: true, message: ValidationConstants.dateField }]
                            })(
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={(date) => this.props.liveScoreUpdateMatchAction(date, "start_date")}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    name={'registrationOepn'}
                                    placeholder='Select Date'


                                />
                            )}
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.startTime} />
                        <Form.Item>
                            {getFieldDecorator('time', {
                                rules: [{ required: true, message: ValidationConstants.dateField }]
                            })(
                                <TimePicker
                                    className="comp-venue-time-timepicker"
                                    style={{ width: "100%" }}
                                    onChange={(time) => this.props.liveScoreUpdateMatchAction(time, 'start_time')}
                                    format={"HH:mm"}
                                    // minuteStep={15}
                                    placeholder='Select Time'
                                    // defaultOpenValue={moment("00:00", "HH:mm")}
                                    // value={start_time !== null && moment(start_time, 'HH:mm')}
                                    // value={moment(start_time, 'HH:mm')}
                                    use12Hours={false}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead required={"required-field"} heading={AppConstants.division} />
                        <Form.Item>
                            {getFieldDecorator('division', {
                                rules: [{ required: true, message: ValidationConstants.divisionField }]
                            })(
                                <Select
                                    // loading={(!addEditMatch.division.name && liveScoreState.divisionList.length == 0) && true}
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={(divisionName) => this.props.liveScoreUpdateMatchAction(divisionName, 'divisionId')}
                                    value={addEditMatch.divisionId}
                                    placeholder={'Select Division'}
                                >
                                    {isArrayNotEmpty(liveScoreState.divisionList) && liveScoreState.divisionList.map((item) => (
                                        <Option key={item.id} value={item.id} > {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}
                        </Form.Item>

                    </div>
                    <div className="col-sm">
                        <InputWithHead required={"required-field"} heading={AppConstants.type} />
                        <Form.Item>
                            {getFieldDecorator('type', {
                                rules: [{ required: true, message: ValidationConstants.typeField }]
                            })(
                                <Select
                                    loading={addEditMatch.team1 && false}
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={(type) => this.props.liveScoreUpdateMatchAction(type, 'type')}
                                    value={addEditMatch.type}
                                    placeholder={'Select Type'}
                                >
                                    <Option value={'SINGLE'}> Single</Option>
                                    <Option value={"TWO_HALVES"}>Halves</Option>
                                    <Option value={"FOUR_QUARTERS"}>Quarters</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead value={addEditMatch.competition.name} disabled={true} heading={AppConstants.competition} placeholder={AppConstants.competition} />
                    </div>
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.matchID} />
                        <InputNumber
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(mnbMatchId) => this.props.liveScoreUpdateMatchAction(mnbMatchId, "mnbMatchId")}
                            value={addEditMatch.mnbMatchId ? addEditMatch.mnbMatchId : ''}
                            placeholder={'0'}
                        />
                    </div>
                </div>
                {
                    <div className="row" >
                        <div className="col-sm-6" >
                            <InputWithHead required={"required-field pb-0"} heading={AppConstants.homeTeam} />
                            <Form.Item>
                                {getFieldDecorator('home', {
                                    rules: [{ required: true, message: ValidationConstants.homeField }]
                                })(
                                    <Select
                                        // mode="multiple"
                                        className="reg-form-multple-select"
                                        placeholder='Select Home Team'
                                        style={{ width: "100%" }}
                                        onChange={(homeTeam) => this.props.liveScoreUpdateMatchAction(homeTeam, "team1id")}
                                        value={addEditMatch.team1Id ? addEditMatch.team1Id : ''}
                                    >
                                        {isArrayNotEmpty(liveScoreState.teamResult) && liveScoreState.teamResult.map((item) => (
                                            < Option value={item.id} > {item.name}</Option>
                                        ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                        <div className="col-sm-6" >
                            <InputWithHead required={"required-field pb-0"} heading={AppConstants.awayTeam} />
                            <Form.Item>
                                {getFieldDecorator('away', {
                                    rules: [{ required: true, message: ValidationConstants.awayField }]
                                })(
                                    <Select
                                        // mode="multiple"
                                        className="reg-form-multple-select"
                                        placeholder={'Select Away Team'}
                                        style={{ width: "100%", }}
                                        onChange={(awayTeam) => this.props.liveScoreUpdateMatchAction(awayTeam, "team2id")}
                                        value={addEditMatch.team2Id ? addEditMatch.team2Id : ''} >
                                        {isArrayNotEmpty(liveScoreState.teamResult) && liveScoreState.teamResult.map((item) => (
                                            < Option value={item.id} > {item.name}</Option>
                                        ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                    </div>
                }

                <div className="row" >
                    <div className="col-sm-6" >
                        <InputWithHead required={"required-field pb-0"} heading={AppConstants.venue} />
                        <Form.Item>
                            {getFieldDecorator('venue', {
                                rules: [{ required: true, message: ValidationConstants.venueField }]
                            })(
                                <Select
                                    // mode="tag"
                                    className="reg-form-multple-select"
                                    placeholder={AppConstants.selectVenue}
                                    style={{ width: "100%", }}
                                    onChange={(venueId) => this.props.liveScoreUpdateMatchAction(venueId, "venueId")}
                                    value={addEditMatch.venueCourtId}
                                >
                                    {venueData && venueData.map((item) => {
                                        return (
                                            <Option key={'venue' + item.id}
                                                value={item.venueCourtId}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}

                                </Select>
                            )}
                        </Form.Item>
                    </div>
                    {
                        addEditMatch.divisionId &&
                        <div className="col-sm-6" >
                            <InputWithHead required={"required-field pb-0"} heading={AppConstants.round} />
                            <Form.Item>
                                {getFieldDecorator('round', {
                                    rules: [{ required: true, message: ValidationConstants.roundField }]
                                })(
                                    <Select
                                        //   mode="multiple"
                                        onChange={(round) => this.props.liveScoreUpdateMatchAction(round, "roundId")}
                                        placeholder={'Select Round'}
                                        style={{ width: "100%", }}
                                        value={addEditMatch.roundId ? addEditMatch.roundId : ''}
                                    >
                                        {isArrayNotEmpty(liveScoreState.roundResult) && liveScoreState.roundResult.map((item) => (
                                            < Option value={item.id} > {item.name}</Option>
                                        ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <span style={{ cursor: 'pointer' }} onClick={() => this.showModal()} className="input-heading-add-another">
                                + {AppConstants.addNewRound}
                            </span>
                        </div>
                    }
                </div>
                {this.duration_break(getFieldDecorator)}
                <div className="row" >
                    <div className="col-sm" >

                        <InputWithHead
                            type='text'
                            heading={AppConstants.umpire1Name}
                            onChange={(e) => { this.props.liveScoreUpdateMatchAction(e.target.value, 'umpire1') }}
                            value={addEditMatch.umpire1}
                            placeholder={AppConstants.enterUmpire1name} />

                    </div>
                    <div className="col-sm" >
                        <InputWithHead
                            heading={AppConstants.umpire2Name}
                            onChange={(e) => { this.props.liveScoreUpdateMatchAction(e.target.value, 'umpire2') }}
                            value={addEditMatch.umpire2}
                            placeholder={AppConstants.enterUmpire2name} />
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.umpire1Club} />
                        <Select
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(umpire1Club) => this.setState({ umpire1Club })}

                            placeholder={'Select Umpire 1 Club'}
                        >
                            {/* <Option value={"player"}>Test</Option>
                            <Option value={"netsetgo"}>WSA</Option> */}
                        </Select>
                    </div>
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.umpire2Club} />
                        <Select
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(umpire2Club) => this.setState({ umpire2Club })}
                            placeholder={'Select Umpire 2 Club'}
                        >
                        </Select>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm-6" >
                        <InputWithHead heading={AppConstants.scorer1} />
                        <Select
                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                            onChange={(scorer1) => this.onScorerChange(scorer1)}
                            placeholder={'Select Scorer'}
                        // value={addEditMatch.scorerStatus}
                        >
                            {scorerListResult.map((item) => {
                                return <Option key={'venue' + item.id} value={item.id}>
                                    {item.firstName + " " + item.lastName}
                                </Option>
                            })}
                        </Select>
                    </div>

                    {
                        addEditMatch.type !== 'SINGLE' &&
                        <div className="col-sm-6" >
                            <InputWithHead heading={AppConstants.scorer2} />
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(scorer2) => this.onScorerChange(scorer2)}
                                placeholder={'Select Scorer'}
                            >
                                {scorerListResult.map((item) => {
                                    return <Option key={'venue' + item.id} value={item.id}>
                                        {item.firstName + " " + item.lastName}
                                    </Option>
                                })}
                            </Select>
                        </div>
                    }
                </div>

                {
                    this.state.isEdit == true && <div className="row" >
                        <div className="col-sm" >
                            <InputWithHead
                                heading={AppConstants.homeTeamFinalScore}
                                placeholder={AppConstants.enterHomeTeamFinalScore}
                                onChange={(event) => this.props.liveScoreUpdateMatchAction(event.target.value, "team1Score")}
                                name={"team1Score"}
                                value={addEditMatch.team1Score}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.awayTeamFinalScore}
                                placeholder={AppConstants.enterAwayTeamFinalScore}
                                onChange={(event) => this.props.liveScoreUpdateMatchAction(event.target.value, "team2Score")}
                                name={"team2Score"}
                                value={addEditMatch.team2Score}
                            />
                        </div>
                    </div>
                }
            </div >
        )
    }

    ////create match post method
    addMatchDetails = (e) => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { addEditMatch, matchData, start_date, start_time, start_post_date } = this.props.liveScoreMatchState

                // let startDate = moment(start_date).format("YYYY-MMM-DD")

                let startDate = moment(start_post_date).format("YYYY-MMM-DD")
                let start = moment.utc(start_time).format("HH:mm")

                console.log(start , "start start", start_time)

                let postDate = startDate + " " + start + " " + "UTC"
                let formatedDate = new Date(postDate).toISOString()
                matchData.startTime = formatedDate

                // let competitionId = getCompetitonId();
                const { id } = JSON.parse(getLiveScoreCompetiton())
                // console.log(matchData)
                this.props.liveScoreCreateMatchAction(matchData, id, this.state.key)
            }
        });
    }

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {

        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm ">
                            <div className="row " >

                                <div className="col-sm-3 live-score-edit-match-buttons">
                                    <Button onClick={() => history.push(this.state.key == 'dashboard' ? 'liveScoreDashboard' : '/liveScoreMatches')} type="cancel-button">{AppConstants.cancel}</Button>
                                </div>
                                {this.state.isEdit == true && <div className="col-sm">
                                    <div className="row">

                                        <div className="col-sm live-score-edit-match-buttons">
                                            <Button type="cancel-button">{AppConstants.forfiet}</Button>
                                        </div>
                                        <div className="col-sm live-score-edit-match-buttons">
                                            <Button type="cancel-button">{AppConstants.abandon}</Button>
                                        </div>
                                        <div className="col-sm live-score-edit-match-buttons">
                                            <Button type="cancel-button">{AppConstants.endMatch}</Button>
                                        </div>
                                    </div>
                                </div>}
                            </div>

                        </div>

                        <div className="col-sm-3">
                            <div className="comp-buttons-view">
                                <Button
                                    className="user-approval-button" type="primary" htmlType="submit" >
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    };
    /////// render function
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={this.state.key == 'dashboard' ? '1' : "2"} />
                <Loader visible={this.props.liveScoreMatchState.onLoad} />
                <Layout>
                    {this.headerView()}

                    <Form
                        autoComplete='off'
                        onSubmit={this.addMatchDetails} className="login-form">
                        <Content>
                            <div className="formView">
                                {this.contentView(getFieldDecorator)}
                                {this.ModalView(getFieldDecorator)}
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
        getCompetitonVenuesList,
        getliveScoreScorerList
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreState: state.LiveScoreState,
        liveScoreMatchState: state.LiveScoreMatchState,
        liveScoreScorerState: state.LiveScoreScorerState,
        liveScoreState: state.LiveScoreState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreAddMatch));