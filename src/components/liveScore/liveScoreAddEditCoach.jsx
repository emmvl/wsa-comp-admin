import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Select, Radio, Spin, AutoComplete } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from "../../util/history";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import { isArrayNotEmpty } from "../../util/helpers";
import Loader from '../../customComponents/loader'
import { getliveScoreTeams } from '../../store/actions/LiveScoreAction/liveScoreTeamAction'
import { liveScoreUpdateCoach } from '../../store/actions/LiveScoreAction/liveScoreCoachAction'

const { Footer, Content, Header } = Layout;
const { Option } = Select;

const OPTIONS = [];

class LiveScoreAddEditCoach extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conpetitionId: null,
            searchText: ""
        }

    }

    componentDidMount() {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ conpetitionId: id })
        if (id !== null) {
            this.props.getliveScoreTeams(id)
        }
    }




    ///////view for breadcrumb
    headerView = () => {
        let isEdit = this.props.location ? this.props.location.state ? this.props.location.state.isEdit : null : null
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
                                <Breadcrumb.Item className="breadcrumb-add">{isEdit == true ? AppConstants.editCoach : AppConstants.addCoach}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    ////form view
    contentViewForAddCoach = (getFieldDecorator) => {
        const { coachRadioBtn } = this.props.liveScoreCoachState
        return (
            <div >

                {this.radioBtnContainer()}
                {coachRadioBtn == 'new' ?
                    this.coachNewRadioBtnView(getFieldDecorator)
                    :
                    this.coachExistingRadioButton(getFieldDecorator)}

            </div>
        )
    }

    contentViewForEditCoach = (getFieldDecorator) => {
        const { coachRadioBtn } = this.props.liveScoreCoachState
        return (
            <div >
                {this.coachNewRadioBtnView(getFieldDecorator)}

            </div>
        )
    }

    radioBtnContainer() {
        const { coachRadioBtn } = this.props.liveScoreCoachState
        return (
            <div className="content-view pb-0 pt-4 row">
                <span className="applicable-to-heading ml-4">{AppConstants.managerHeading}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onButtonChage(e)}
                    value={coachRadioBtn}
                >
                    <div className="row ml-2" style={{ marginTop: 18 }} >
                        <Radio value={"new"}>{AppConstants.new}</Radio>
                        <Radio value={"existing"}>{AppConstants.existing} </Radio>
                    </div>
                </Radio.Group>

            </div>
        )
    }

    onButtonChage(e) {
        this.setState({ loader: true })
        this.props.liveScoreUpdateCoach(e.target.value, 'coachRadioBtn')
    }



    coachNewRadioBtnView(getFieldDecorator) {

        const { coachdata, teamId, teamResult } = this.props.liveScoreCoachState
        let teamData = isArrayNotEmpty(teamResult) ? teamResult : []
        console.log(coachdata, 'coachdata')

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
                                    placeholder={AppConstants.firstName}
                                    onChange={(firstName) => this.props.liveScoreUpdateCoach(firstName.target.value, 'firstName')}
                                    value={coachdata.firstName}
                                />
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
                                    onChange={(lastName) => this.props.liveScoreUpdateCoach(lastName.target.value, 'lastName')}
                                    value={coachdata.lastName}
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
                                    onChange={(email) => this.props.liveScoreUpdateCoach(email.target.value, 'email')}
                                    value={coachdata.email}
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
                                    maxLength={15}
                                    onChange={(mobileNumber) => this.props.liveScoreUpdateCoach(mobileNumber.target.value, 'mobileNumber')}
                                    value={coachdata.mobileNumber}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.team}
                            required={"required-field pb-0 pt-3"}
                        />
                        <Form.Item className="slct-in-add-manager-livescore">
                            {getFieldDecorator(AppConstants.selectTeam, {
                                rules: [{ required: true, message: ValidationConstants.teamName }]
                            })(
                                <Select
                                    // loading={this.props.liveScoreState.onLoad == true && true}
                                    mode="multiple"
                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%" }}
                                    onChange={(teamId) => this.props.liveScoreUpdateCoach(teamId, 'teamId')}
                                    value={teamId}
                                    showSearch
                                    optionFilterProp="children"

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

    coachExistingRadioButton(getFieldDecorator) {
        const { coachdata, teamId, teamResult } = this.props.liveScoreCoachState
        let teamData = isArrayNotEmpty(teamResult) ? teamResult : []

        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            <InputWithHead
                                required={"required-field pb-0 pt-0"}
                                heading={AppConstants.managerSearch} />
                            {getFieldDecorator(AppConstants.team, {
                                rules: [{ required: true, message: ValidationConstants.searchManager }],
                            })(

                                <AutoComplete
                                    loading={true}
                                    style={{ width: "100%", height: '56px' }}
                                    placeholder="Select User"
                                // onSelect={(item, option) => {
                                //     const ManagerId = JSON.parse(option.key)
                                //     this.props.liveScoreClear()
                                //     this.props.liveScoreUpdateManagerDataAction(ManagerId, 'managerSearch')

                                // }}
                                // notFoundContent={onLoadSearch == true ? <Spin size="small" /> : null}

                                // onSearch={(value) => {

                                //     value ?
                                //         this.props.liveScoreManagerSearch(value, this.state.competition_id)
                                //         :
                                //         this.props.liveScoreManagerListAction(5, 1, this.state.competition_id)

                                // }}


                                >
                                    {/* {managerList.map((item) => {
                                    return <Option key={item.id} value={item.firstName + " " + item.lastName}>
                                        {item.firstName + " " + item.lastName}
                                    </Option>
                                })} */}
                                </AutoComplete>
                            )}

                        </Form.Item>
                    </div>


                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item className="slct-in-add-manager-livescore">
                            <InputWithHead
                                required={"required-field pb-1"}
                                heading={AppConstants.team} />
                            {getFieldDecorator("managerTeamName", {
                                rules: [{ required: true, message: ValidationConstants.teamName }],
                            })(

                                <Select
                                    // loading={this.props.liveScoreState.onLoad == true && true}
                                    mode="multiple"
                                    showSearch
                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%", }}
                                    // onChange={(teamId) => this.props.liveScoreUpdateManagerDataAction(teamId, 'teamId')}
                                    // value={teamId}
                                    optionFilterProp="children"
                                >
                                    {teamData.map((item) => (
                                        < Option value={item.id} >{item.name}</Option>
                                    ))
                                    }
                                </Select>
                            )}

                        </Form.Item>
                    </div>
                </div>
            </div >
        )
    }


    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="flud-widtih">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                {/* <NavLink to='/liveScoreManagerList'> */}
                                <Button type="cancel-button">{AppConstants.cancel}</Button>
                                {/* </NavLink> */}
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

    // onSaveClick = e => {

    //     const { managerData, teamId, managerRadioBtn, exsitingManagerId } = this.props.liveScoreMangerState

    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         let body = ''
    //         if (!err) {
    //             if (managerRadioBtn == 'new') {
    //                 if (this.state.isEdit == true) {
    //                     body = {
    //                         "id": managerData.id,
    //                         "firstName": managerData.firstName,
    //                         "lastName": managerData.lastName,
    //                         "mobileNumber": managerData.mobileNumber,
    //                         "email": managerData.email,
    //                         "teams": managerData.teams
    //                     }
    //                 } else {
    //                     body = {
    //                         "firstName": managerData.firstName,
    //                         "lastName": managerData.lastName,
    //                         "mobileNumber": managerData.mobileNumber,
    //                         "email": managerData.email,
    //                         "teams": managerData.teams
    //                     }
    //                 }
    //                 this.props.liveScoreAddEditManager(body, teamId, exsitingManagerId)
    //             } else if (managerRadioBtn == 'existing') {
    //                 body = {
    //                     "id": exsitingManagerId,
    //                     "teams": managerData.teams
    //                 }
    //                 this.props.liveScoreAddEditManager(body, teamId, exsitingManagerId)
    //             }

    //         }
    //     });
    // };

    /////// render function 

    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                {/* <Loader visible={this.props.liveScoreMangerState.loading} /> */}
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"23"} />
                <Layout>
                    {this.headerView()}
                    <Form onSubmit={this.onSaveClick} className="login-form" noValidate="noValidate">
                        <Content>
                            <div className="formView">
                                {this.state.isEdit == true ? this.contentViewForEditCoach(getFieldDecorator) : this.contentViewForAddCoach(getFieldDecorator)}
                                {/* {this.coachView(getFieldDecorator)} */}
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
        liveScoreUpdateCoach
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreTeamState: state.LiveScoreTeamState,
        liveScoreCoachState: state.LiveScoreCoachState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreAddEditCoach));