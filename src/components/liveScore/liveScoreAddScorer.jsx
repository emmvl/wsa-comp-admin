import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Select, message, Radio, AutoComplete, Spin } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ValidationConstants from "../../themes/validationConstant";
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage';
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { NavLink } from 'react-router-dom';
import { liveScoreScorerUpdate, liveScoreAddEditScorer } from '../../store/actions/LiveScoreAction/liveScoreScorerAction'
import Loader from '../../customComponents/loader'
import { isArrayNotEmpty } from "../../util/helpers";
import { liveScoreManagerSearch, liveScoreClear, liveScoreManagerListAction } from '../../store/actions/LiveScoreAction/liveScoreManagerAction'
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'

const { Footer, Content, Header } = Layout;
const { Option } = Select;

class LiveScoreAddScorer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: [],
            competitionFormat: "new",
            load: false,
            tableRecord: this.props.location.state ? this.props.location.state.tableRecord : null,
            isEdit: this.props.location.state ? this.props.location.state.isEdit : null,
            loader: false,
            load: false,
            competition_id : null
        }

    }

    competition_formate = e => {
        this.setState({
            competitionFormat: e.target.value
        });
    };

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.props.liveScoreManagerListAction(3, 1, id)
      
        if (id !== null) {
            // this.props.getliveScoreDivisions(id)
            this.props.getliveScoreTeams(id)
        } else {
            history.push('/')
        }
        this.props.liveScoreClear()

        if (this.state.isEdit == true) {
            this.props.liveScoreScorerUpdate(this.state.tableRecord, "isEditScorer")
            this.setInitalFiledValue(this.state.tableRecord)
            this.setState({ loader: true })
        } else {
            this.props.liveScoreScorerUpdate("", "isAddScorer")
        }
        this.setState({ load: true, competition_id : id })
    }

    componentDidUpdate(nextProps) {

        // if(this.props.liveScoreScorerState.scorerData !== this.props.liveScoreScorerState.scorerData){
        // if (this.state.load == true && this.props.liveScoreScorerState.onLoad == false) {
        if (this.state.isEdit == true) {
            // this.setInitalFiledValue()
        }
        // this.setState({ load: false, loader: false })
        // }
        // }


    }

    setInitalFiledValue(scorerData) {
        console.log(scorerData)
        let teamsArray = []
        for (let i in scorerData.teams) {
            teamsArray.push(scorerData.teams[i].id)
        }

        this.props.form.setFieldsValue({
            // 'First Name': managerData.firstName,
            // 'Last Name': managerData.lastName,
            // 'Email Address': managerData.email,
            // 'Contact no': managerData.mobileNumber,
            // 'Select Team': teamId

            'First Name': scorerData.firstName,
            'Last Name': scorerData.lastName,
            'Email Address': scorerData.email,
            'Contact no': scorerData.mobileNumber,
            'Select Team': teamsArray
        })
    }

    success = () => {
        message.success('Save Sucessfully');
    };

    ////method to selecting team
    teamChange = (value) => {
        this.setState({
            team: value
        })
    }
    ///////view for breadcrumb
    headerView = () => {
        let isEdit = this.props.location.state ? this.props.location.state.isEdit : null
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
                                <Breadcrumb.Item className="breadcrumb-add">{isEdit == true ? AppConstants.editScorer : AppConstants.addScorer}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    scorerExistingRadioButton(getFieldDecorator) {
        const { managerListResult, MainManagerListResult, onLoadSearch, managerSearchResult } = this.props.liveScoreMangerState
        let managerList = isArrayNotEmpty(managerListResult) ? managerListResult : []
        console.log(managerList, "managerList")
        // let teamData = this.props.liveScoreState.teamResult ? this.props.liveScoreState.teamResult : []
        const { teamId } = this.props.liveScoreMangerState
        const { teamResult } = this.props.liveScoreScorerState
        let teamData = isArrayNotEmpty(teamResult) ? teamResult : []
        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            <InputWithHead
                                required={"required-field pb-0 pt-0"}
                                heading={AppConstants.scorerSearch}
                                onChange />
                            {getFieldDecorator("addScorer", {
                                rules: [{ required: true, message: ValidationConstants.searchScorer }],
                            })(
                                <AutoComplete
                                    loading={true}
                                    style={{ width: "100%", height: '56px' }}
                                    placeholder="Select User"
                                    onSelect={(item, option) => {
                                        const ScorerId = JSON.parse(option.key)
                                        this.props.liveScoreClear()
                                        this.props.liveScoreScorerUpdate(ScorerId, "scorerSearch")
                                    }

                                    }
                                    notFoundContent={onLoadSearch == true ? <Spin size="small" /> : null}
                                    onSearch={(value) => {
                                        value ?
                                            this.props.liveScoreManagerSearch(value, this.state.competition_id)
                                            :
                                            this.props.liveScoreManagerListAction(3, 1, this.state.competition_id)
                                    }}

                                >{managerList.map((item) => {
                                    return <Option key={item.id} value={item.firstName + " " + item.lastName}>
                                        {item.firstName + " " + item.lastName}
                                    </Option>
                                })}
                                </AutoComplete>
                            )}
                        </Form.Item>
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item className="slct-in-add-manager-livescore">
                            <InputWithHead
                                required={"required-field "}
                                heading={AppConstants.team} />
                            {getFieldDecorator("managerTeamName", {
                                rules: [{ required: true, message: ValidationConstants.teamName }],
                            })(

                                <Select
                                    loading={this.props.liveScoreState.onLoad == true && true}
                                    mode="multiple"
                                    showSearch={true}
                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%", }}

                                    onChange={(teamId) => this.props.liveScoreScorerUpdate(teamId, "teamId")}
                                // value={teamId}
                                >
                                    {isArrayNotEmpty(teamData) > 0 && teamData.map((item) => (
                                        < Option value={item.id} > {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}

                        </Form.Item>
                    </div>

                </div>
            </div>
        )

    }

    scorerNewRadioBtnView(getFieldDecorator) {
        const { scorerData, teamId, teamResult } = this.props.liveScoreScorerState
        let teamData = isArrayNotEmpty(teamResult) ? teamResult : []


        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.firstName, {
                                rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.firstName}
                                    onChange={(firstName) => this.props.liveScoreScorerUpdate(firstName.target.value, "firstName")}
                                    placeholder={AppConstants.firstName} />
                            )}

                        </Form.Item>
                    </div>
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.lastName, {
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.lastName}
                                    placeholder={AppConstants.lastName}
                                    onChange={(lastName) => this.props.liveScoreScorerUpdate(lastName.target.value, "lastName")}

                                />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.emailAdd, {
                                rules: [{ required: true, message: ValidationConstants.emailField[0] }]
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.emailAdd}
                                    placeholder={AppConstants.enterEmail}
                                    onChange={(emailAddress) => this.props.liveScoreScorerUpdate(emailAddress.target.value, "emailAddress")}
                                    disabled={this.state.isEdit == true && true}
                                />
                            )}
                        </Form.Item>

                    </div>
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.contactNO, {
                                rules: [{ required: true, message: ValidationConstants.contactField }]
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.contactNO}
                                    placeholder={AppConstants.enterContactNo}
                                    onChange={(contactNo) => this.props.liveScoreScorerUpdate(contactNo.target.value, "contactNo")}
                                    maxLength={15} />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.team}
                            required={"required-field pb-0 pt-3"} />
                        <Form.Item className="slct-in-add-manager-livescore">
                            {getFieldDecorator(AppConstants.selectTeam, {
                                rules: [{ required: true, message: ValidationConstants.teamName }]
                            })(
                                <Select
                                    loading={this.props.liveScoreTeamState.onLoad == true && true}
                                    mode="multiple"
                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%", }}
                                    onChange={(teamId) => this.props.liveScoreScorerUpdate(teamId, "teamId")}
                                    value={teamId}
                                >
                                    {teamData.map((item) => (
                                        < Option value={item.id} > {item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                </div>
            </div>
        )
    }

    onButtonChange(e) {
        // this.setState({ loader: true })
        this.props.liveScoreScorerUpdate(e.target.value, 'scorerRadioBtn')
    }

    radioBtnContainer() {
        const { scorerRadioBtn } = this.props.liveScoreScorerState
        return (
            <div className="content-view pb-0 pt-4 row">
                <span className="applicable-to-heading ml-4">{AppConstants.scorerHeading}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onButtonChange(e)}
                    value={scorerRadioBtn}
                >
                    <div className="row ml-2" style={{ marginTop: 18 }} >
                        <Radio value={"new"}>{AppConstants.new}</Radio>
                        <Radio value={"existing"}>{AppConstants.existing} </Radio>
                    </div>
                </Radio.Group>
            </div>
        )
    }

    // ////form view
    // contentView = (getFieldDecorator) => {
    //     // let teamData = this.props.liveScoreState.teamResult ? this.props.liveScoreState.teamResult : []
    //     const { scorerRadioBtn } = this.props.liveScoreScorerState
    //     return (
    //         <div >
    //             {/* <div></div> */}
    //             {/* {this.radioBtnContainer()}
    //             {scorerRadioBtn == 'new' ? */}
    //             {this.scorerNewRadioBtnView(getFieldDecorator)}
    //             {/* this.scorerExistingRadioButton(getFieldDecorator)} */}

    //         </div>
    //     )
    // }

    ////form view
    contentViewForAddManager = (getFieldDecorator) => {
        const { scorerRadioBtn } = this.props.liveScoreScorerState
        return (
            <div >
                {this.radioBtnContainer()}
                {scorerRadioBtn == 'new' ?
                    this.scorerNewRadioBtnView(getFieldDecorator)
                    :
                    this.scorerExistingRadioButton(getFieldDecorator)}

            </div>
        )
    }

    contentViewForEditManager = (getFieldDecorator) => {
        const { scorerRadioBtn } = this.props.liveScoreScorerState
        return (
            <div >

                {this.scorerNewRadioBtnView(getFieldDecorator)}

            </div>
        )
    }

    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                <NavLink to='/liveScorerList'>
                                    <Button onClick={() => history.push('/liveScorerList')} type="cancel-button">{AppConstants.cancel}</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    //handleSubmit
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

            }
        });
    };


    onSaveClick = e => {
        const { scorerData, teamId, scorerRadioBtn, existingScorerId } = this.props.liveScoreScorerState
        console.log(existingScorerId, "existingScorerId")
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (scorerRadioBtn == 'new') {
                    this.props.liveScoreAddEditScorer(scorerData, existingScorerId, scorerRadioBtn, this.state.isEdit)
                } if (scorerRadioBtn == 'existing') {
                    this.props.liveScoreAddEditScorer(scorerData, existingScorerId, scorerRadioBtn)
                }
            }
        });
    };
    /////// render function 
    render() {

        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"5"} />
                <Loader visible={this.props.liveScoreScorerState.onLoad} />
                <Layout>
                    {this.headerView()}
                    <Form onSubmit={this.onSaveClick} className="login-form" noValidate="noValidate">
                        <Content>
                            <div className="formView">
                                {/* {this.contentView(getFieldDecorator)} */}
                                {this.state.isEdit == true ? this.contentViewForEditManager(getFieldDecorator) : this.contentViewForAddManager(getFieldDecorator)}
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
        getliveScoreTeams,
        liveScoreScorerUpdate,
        liveScoreAddEditScorer,
        liveScoreManagerSearch,
        getliveScoreDivisions,
        liveScoreClear,
        liveScoreManagerListAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreTeamState: state.LiveScoreTeamState,
        liveScoreScorerState: state.LiveScoreScorerState,
        liveScoreMangerState: state.LiveScoreMangerState,
        liveScoreState: state.LiveScoreState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreAddScorer));