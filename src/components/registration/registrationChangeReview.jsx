import React, { Component } from "react";
import {
    Layout,
    Input,
    Select,
    DatePicker,
    Button,
    Breadcrumb,
    Form,
    Radio,
    Modal
} from "antd";
import "./product.scss";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { getYearAndCompetitionAction } from "../../store/actions/appAction";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ValidationConstants from "../../themes/validationConstant";
import { isArrayNotEmpty } from '../../util/helpers';
import { updateRegistrationReviewAction } from '../../store/actions/registrationAction/registrationChangeAction'
import { captializedString } from "../../util/helpers"
import moment, { utc } from "moment";



const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;



let this_Obj = null;

class RegistrationChangeReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this_Obj = this;


    }

    componentDidMount() {

        // this.props.getYearAndCompetitionAction(this.props.appState.yearList, null)


    }


    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <div className="row">
                        <div
                            className="col-sm"
                            style={{ display: "flex", alignContent: "center" }}
                        >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">
                                    {AppConstants.registrationChange}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header>
            </div>
        );
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
        });
    };

    ////modal view
    ModalView(getFieldDecorator) {
        return (
            <Modal
                visible={this.state.visible}
                // onOk={this.state.createRound.length == 0 ? this.handleSubmit : this.onCreateRound}
                onCancel={this.handleCancel}
                // onChange={(createRound) => this.props.liveScoreUpdateMatchAction(createRound, "")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText={'Save'}
                centered={true}
            >
                <Radio.Group
                    className="reg-competition-radio"
                >

                    <Radio value={'Refund full amount'}>{'Refund full amount'}</Radio>
                    <Radio value={'Refund partial payment'}>{'Refund partial payment'}</Radio>

                </Radio.Group>

            </Modal>
        )
    }




    ////////form content view
    contentView = (getFieldDecorator) => {

        const { detailsData } = this.props.registrationChangeState
        console.log(detailsData, 'detailsData')

        const reasonToDeRegisterArr = [
            { id: AppConstants.overCommited, name: AppConstants.overCommited },
            { id: AppConstants.injuredOrHealthReason, name: AppConstants.injuredOrHealthReason },
            { id: AppConstants.decideNotToParticipate, name: AppConstants.decideNotToParticipate },
            { id: AppConstants.moveToDiffGeographicalArea, name: AppConstants.moveToDiffGeographicalArea },
            { id: AppConstants.otherReason, name: AppConstants.otherReason },
        ]

        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">

                        <InputWithHead
                            heading={AppConstants.username}
                            placeholder={AppConstants.username}
                            value={detailsData.userName}
                            onChange={(e) => this.props.updateRegistrationReviewAction({ data: captializedString(e.target.value), key: 'userName' })}
                        // onBlur={(i) => this.props.form.setFieldsValue({
                        //     'userName': captializedString(i.target.value)
                        // })}
                        />


                    </div>
                    <div className="col-sm">

                        <InputWithHead
                            heading={AppConstants.userIsRegisteredTo}
                            placeholder={AppConstants.userIsRegisteredTo}
                            value={detailsData.userRegister}
                            onChange={(e) => this.props.updateRegistrationReviewAction({ data: captializedString(e.target.value), key: 'userRegister' })}
                        // onBlur={(i) => this.props.form.setFieldsValue({
                        //     'userRegister': captializedString(i.target.value)
                        // })}
                        />

                    </div>
                </div>

                <div className="row">
                    <div className='col-sm'>
                        <InputWithHead heading={AppConstants.competition_name} />
                        <Select
                            style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                            placeholder={AppConstants.competition}
                            filterOption={false}
                            value={detailsData.competitionName ? detailsData.competitionName : undefined}
                            onChange={(compId) => this.props.updateRegistrationReviewAction({ data: compId, key: 'competitionName' })}
                        >
                        </Select>
                    </div>

                    <div className="col-sm">
                        <InputWithHead
                            heading={AppConstants.competitionAdimistrator}
                            placeholder={AppConstants.competitionAdimistrator}
                            value={detailsData.competitionAdministrator}
                            onChange={(e) => this.props.updateRegistrationReviewAction({ data: captializedString(e.target.value), key: 'competitionAdministrator' })}
                        // onBlur={(i) => this.props.form.setFieldsValue({
                        //     'competitionAdministrator': captializedString(i.target.value)
                        // })}
                        />
                    </div>
                </div>


                <span className='text-heading-large pt-5' >{AppConstants.regChangeDetail}</span>
                <div className="row">
                    <div className='col-sm'>
                        <InputWithHead heading={AppConstants.dateRegChange} />
                        <DatePicker
                            size="large"
                            style={{ width: "100%" }}
                            format={"DD-MM-YYYY"}
                            showTime={false}
                            name={'registrationChange'}
                            placeholder={"dd-mm-yyyy"}
                            onChange={(date) => this.props.updateRegistrationReviewAction({ data: moment(date, 'YYYY-MM-DD'), key: 'regDate' })}
                            value={detailsData.regDate}
                        />
                    </div>

                    <div className="col-sm">
                        <InputWithHead heading={AppConstants.dateCompStart} />
                        <DatePicker
                            size="large"
                            style={{ width: "100%" }}
                            format={"DD-MM-YYYY"}
                            showTime={false}
                            name={'competitionStart'}
                            placeholder={"dd-mm-yyyy"}
                            onChange={(date) => this.props.updateRegistrationReviewAction({ data: moment(date, 'YYYY-MM-DD'), key: 'compDate' })}
                            value={detailsData.compDate}
                        />
                    </div>
                </div>


                <div >
                    <InputWithHead heading={AppConstants.regChangeType} />
                    <Select
                        style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                        placeholder={AppConstants.regChangeType}
                        filterOption={false}
                        onChange={(id) => this.props.updateRegistrationReviewAction({ data: id, key: 'regChangeType' })}
                        value={detailsData.regChangeType ? detailsData.regChangeType : undefined}
                    >
                        <Option value={'De-Register'} > {'De-Register'}</Option>
                    </Select>
                </div>

                <div>
                    <InputWithHead heading={AppConstants.doTheySayForGame} />
                    <Radio.Group
                        className="reg-competition-radio"
                        value={detailsData.courtGame}
                        onChange={(e) => this.props.updateRegistrationReviewAction({ data: e.target.value, key: 'courtGame' })}
                    >
                        <Radio value={'Yes'}>{'Yes'}</Radio>
                        <Radio value={'No'}>{'No'}</Radio>

                    </Radio.Group>
                </div>

                <div>
                    <InputWithHead heading={AppConstants.reasonToDeRegister} />
                    <Radio.Group
                        className="reg-competition-radio"
                        value={detailsData.reasonToDeRegister}
                        onChange={(e) => this.props.updateRegistrationReviewAction({ data: e.target.value, key: 'reasonToDeRegister' })}
                    >
                        {isArrayNotEmpty(reasonToDeRegisterArr) && reasonToDeRegisterArr.map((item) => (
                            <Radio value={item.id}>{item.name}</Radio>
                        ))
                        }
                        {
                            detailsData.reasonToDeRegister == 'Other' &&
                            <div>
                                <InputWithHead
                                    className='ml-5'
                                    placeholder='Other'
                                    style={{ maxWidth: '50%', minHeight: 60 }} />

                            </div>
                        }

                    </Radio.Group>
                </div>

                <div>
                    <InputWithHead heading={AppConstants.approvals} />

                    <Radio.Group
                        className="reg-competition-radio"
                    >

                        <Radio value={'2nd Level Affiliate Name'}>{'2nd Level Affiliate Name'}</Radio>
                        <Radio value={'1st Level Affiliate Name'}>{'1st Level Affiliate Name'}</Radio>

                    </Radio.Group>
                </div>


            </div>
        );
    }

    //////footer view containing all the buttons
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                {/* <NavLink to='/liveScorerList'> */}
                                <Button type="cancel-button">{AppConstants.cancel}</Button>
                                {/* </NavLink> */}
                            </div>
                        </div>

                        <div className="col-sm" >
                            <div className="comp-buttons-view">
                                <Button onClick={() => this.showModal()} className="user-approval-button mr-3" type="primary" htmlType="submit" >
                                    {AppConstants.approve}
                                </Button>

                                <Button className="user-approval-button" type="primary" htmlType="submit" >
                                    {AppConstants.decline}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    ////create match post method
    onSaveClick = (e) => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
            }
        });
    }



    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"9"} />
                <Layout>
                    {this.headerView()}
                    <Form onSubmit={this.onSaveClick}
                        noValidate="noValidate" >
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
    return bindActionCreators(
        {
            getYearAndCompetitionAction,
            updateRegistrationReviewAction
        },
        dispatch
    );
}
function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        registrationChangeState: state.RegistrationChangeState

    };
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(RegistrationChangeReview));
