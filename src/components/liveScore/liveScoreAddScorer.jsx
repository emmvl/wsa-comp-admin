import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Select, message, Radio, AutoComplete } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ValidationConstants from "../../themes/validationConstant";
import history from "../../util/history";

const { Footer, Content, Header } = Layout;
const { Option } = Select;

class LiveScoreAddScorer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            team: [],
            competitionFormat: "new",
        }
    }

    competition_formate = e => {
        this.setState({
            competitionFormat: e.target.value
        });
    };

    componentDidMount() {
        this.props.getliveScoreDivisions(1)
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

    managerExistingRadioButton(getFieldDecorator) {
        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator("addScorer", {
                                rules: [{ required: true, message: ValidationConstants.searchScorer }],
                            })(
                                // <InputWithHead
                                //     required={"required-field pb-0 pt-0"}
                                //     heading={AppConstants.scorerSearch}
                                //     placeholder={AppConstants.scorerSearch} />
                                <AutoComplete
                                    style={{ width: "100%", height: '56px' }}
                                    placeholder="Select User"
                                    onSelect={(item, option) => {
                                        const ManagerId = JSON.parse(option.key)
                                        // this.props.liveScoreClear()
                                        this.setState({ showOption: false })
                                        // this.props.liveScoreUpdateManagerDataAction(ManagerId, 'managerSearch')

                                    }}

                                    onSearch={(value) => {

                                        this.setState({ showOption: true })

                                        // const filteredData = MainManagerListResult.filter(data => {
                                        //     return data.firstName.indexOf(value) > -1
                                        // })
                                        // this.props.liveScoreManagerFilter(filteredData)

                                    }}

                                // onSearch={(value) => { console.log('value', value) }}
                                >
                                    {/* // {this.state.showOption ? managerList.map((item) => { */}
                                    {/* //     return <Option key={item.id} value={item.firstName + " " + item.lastName}> */}
                                    {/* //         {item.firstName + " " + item.lastName + " " + item.id} */}
                                    {/* //     </Option> */}
                                    {/* // }) : null} */}
                                    <Option value={"Scorer one"} >
                                        {"scorer One"}
                                    </Option>

                                </AutoComplete>
                            )}
                        </Form.Item>
                    </div>

                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.team, {
                                rules: [{ required: true, message: ValidationConstants.teamName }],
                            })(
                                <InputWithHead
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.team}
                                    placeholder={AppConstants.team} />
                            )}

                        </Form.Item>
                    </div>

                </div>
            </div>
        )

    }

    managerNewRadioBtnView(getFieldDecorator) {
        let teamData = this.props.liveScoreState.teamResult ? this.props.liveScoreState.teamResult : []
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
                                    maxLength={15} />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <InputWithHead heading={AppConstants.team}
                            required={"required-field pb-0 pt-3"} />
                        <Form.Item>
                            {getFieldDecorator(AppConstants.selectTeam, {
                                rules: [{ required: true, message: ValidationConstants.teamName }]
                            })(
                                <Select
                                    loading={this.props.liveScoreState.onLoad == true && true}
                                    mode="tags"
                                    placeholder={AppConstants.selectTeam}
                                    style={{ width: "100%", }}
                                    onChange={e => this.teamChange(e)}
                                    value={this.state.team === [] ? AppConstants.selectTeam : this.state.team}
                                >
                                    {teamData.length > 0 && teamData.map((item) => (
                                        < Option value={item.name} > {item.name}</Option>
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

    radioBtnContainer() {
        return (
            <div className="content-view pb-0 pt-4 row">
                <span className="applicable-to-heading ml-4">{AppConstants.team}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={e => this.competition_formate(e)}
                    value={this.state.competitionFormat}
                >
                    <div className="row ml-2" style={{ marginTop: 18 }} >
                        <Radio value={"new"}>{AppConstants.new}</Radio>
                        <Radio value={"existing"}>{AppConstants.existing} </Radio>
                    </div>
                </Radio.Group>
            </div>
        )
    }

    ////form view
    contentView = (getFieldDecorator) => {
        // let teamData = this.props.liveScoreState.teamResult ? this.props.liveScoreState.teamResult : []
        return (
            <div >
                {/* <div></div> */}
                {this.radioBtnContainer()}
                {this.state.competitionFormat == 'new' ?
                    this.managerNewRadioBtnView(getFieldDecorator) :
                    this.managerExistingRadioButton(getFieldDecorator)}

            </div>
        )
    }
    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button onClick={() => history.push('/liveScorerList')} type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button onClick={this.handleSubmit} className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
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
    /////// render function 
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"5"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.handleSubmit}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView"> {this.contentView(getFieldDecorator)}  </div>
                        </Content>
                    </Form>

                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getliveScoreDivisions }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreState: state.LiveScoreState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreAddScorer));