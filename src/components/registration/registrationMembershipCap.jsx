import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCurrentYear } from 'util/permissions'
import {
    Layout,
    Input,
    Select,
    Checkbox,
    DatePicker,
    Button,
    Table,
    Radio,
    Tabs,
    Form,
    Modal,
    message,
    Breadcrumb
} from "antd";
import Tooltip from 'react-png-tooltip'
import moment from "moment";

import "./product.scss";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { getAllowTeamRegistrationTypeAction, membershipPaymentOptionAction } from '../../store/actions/commonAction/commonAction';
import {
} from "../../store/actions/registrationAction/registration";
import {
    getOnlyYearListAction,
} from "../../store/actions/appAction";
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../util/helpers";
import Loader from '../../customComponents/loader';
import { routePermissionForOrgLevel } from "../../util/permissions";
import { captializedString } from "../../util/helpers"

const { Footer, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;

let this_Obj = null;

class RegistrationMembershipCap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onYearLoad: false,
            yearRefId: null
        };
        this_Obj = this;
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.apiCalls();
    }

    apiCalls = () => {
        try{
            this.props.getOnlyYearListAction(this.props.appState.yearList);
            this.setState({ onYearLoad: true })
        }catch(ex){
            console.log("Error in apiCalls::"+ex)
        }
    }

    componentDidUpdate() {
        try{
            if (this.state.onYearLoad == true && this.props.appState.onLoad == false) {
                if (this.props.appState.yearList.length > 0) {
                    let mainYearRefId = getCurrentYear(this.props.appState.yearList)
                    this.setState({
                        onYearLoad: false,
                        yearRefId: mainYearRefId
                    })
                    this.setFieldDecoratorValues()
                }
            }
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex)
        }
    }

    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.membershipFeeCap}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        )
    }

    dropdownView = () => {
        return (
            <div className="comp-venue-courts-dropdown-view mt-5">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="w-ft d-flex flex-row align-items-center">
                                <span className="year-select-heading required-field">
                                    {AppConstants.year}:
                                </span>
                                <Form.Item name="yearRefId" rules={[{ required: true, message: ValidationConstants.pleaseSelectYear }]}>
                                    <Select
                                        className="year-select reg-filter-select1 ml-2"
                                        style={{ maxWidth: 80 }}
                                    >
                                        {this.props.appState.yearList.map(item => (
                                            <Option key={'year_' + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    contentView = () => {
        try{
            return(
                <div className="membership-cap">

                </div>
            )
        }catch(ex){

        }
    }

    

    footerView = () => {
        return (
            <div >
              
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />
                <InnerHorizontalMenu menu="registration" regSelectedKey="5" />
                <Layout>
                    <Form
                        ref={this.formRef}
                        autoComplete='off'
                        // onFinish={this.saveMembershipProductDetails}
                        noValidate="noValidate"
                        initialValues={{ yearRefId: 1, validityRefId: 1 }}
                    >
                        {this.headerView()}
                        {this.dropdownView()}
                        <Content>
                            {this.contentView()}
                            <Loader visible={this.props.registrationState.onLoad} />
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
        getOnlyYearListAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        registrationState: state.RegistrationState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationMembershipCap);
