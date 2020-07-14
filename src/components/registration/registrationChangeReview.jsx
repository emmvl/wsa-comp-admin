import React, { Component } from "react";
import {
    Layout,
    Input,
    Select,
    Checkbox,
    Tree,
    DatePicker,
    Button,
    Breadcrumb,
    Form,
    Table,
    message,
    Radio,
    Tooltip
} from "antd";
import "./product.scss";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

import {
    getYearAndCompetitionAction
} from "../../store/actions/appAction";
import { connect } from "react-redux";

import { bindActionCreators } from "redux";



const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;



let this_Obj = null;




class RegistrationChangeReview extends Component {
    constructor(props) {
        super(props);
        this.state = {

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





    ////////form content view
    contentView = () => {
        return (
            <div className="content-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            heading={AppConstants.username}
                            placeholder={AppConstants.username}
                        // value={detailsData.competitionDetailData.competitionName}
                        // onChange={(e) =>
                        //     this.props.add_editcompetitionFeeDeatils(captializedString(
                        //         e.target.value),
                        //         'competitionName'
                        //     )
                        // }
                        // onBlur={(i) => this.props.form.setFieldsValue({
                        //     'competition_name': captializedString(i.target.value)
                        // })}
                        />



                    </div>
                    <div className="col-sm">
                        <InputWithHead

                            heading={AppConstants.userIsRegisteredTo}
                            placeholder={AppConstants.userIsRegisteredTo}
                        // value={detailsData.competitionDetailData.competitionName}
                        // onChange={(e) =>
                        //     this.props.add_editcompetitionFeeDeatils(captializedString(
                        //         e.target.value),
                        //         'competitionName'
                        //     )
                        // }
                        // onBlur={(i) => this.props.form.setFieldsValue({
                        //     'competition_name': captializedString(i.target.value)
                        // })}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className='col-sm'>
                        <InputWithHead
                            heading={AppConstants.competition_name}
                        />
                        <Select
                            style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                            placeholder={AppConstants.competition}
                            filterOption={false}

                        >

                        </Select>
                    </div>

                    <div className="col-sm">
                        <InputWithHead

                            heading={AppConstants.competitionAdimistrator}
                            placeholder={AppConstants.competitionAdimistrator}
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
                        />
                    </div>

                </div>

                <div className="row">
                    <div className='col-sm'>
                        <InputWithHead heading={AppConstants.regChangeType} />

                        <Select
                            style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
                            placeholder={AppConstants.competition}
                            filterOption={false}

                        >
                            <Option value={'De-Register'} > {'De-Register'}</Option>
                        </Select>

                    </div>
                </div>

            </div>
        );
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
                    <Form onSubmit={this.registrationSubmit}
                        noValidate="noValidate"
                    >
                        {/* {this.dropdownView(
                            getFieldDecorator
                        )} */}
                        <Content>

                            <div className="formView">
                                {this.contentView(
                                    getFieldDecorator
                                )}
                            </div>


                        </Content>
                        <Footer></Footer>
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

        },
        dispatch
    );
}
function mapStatetoProps(state) {
    return {
        appState: state.AppState,

    };
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(RegistrationChangeReview));
