// eslint-disable-next-line
import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Select, Radio, Spin, AutoComplete } from 'antd';
import './umpire.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUmpireCompetiton } from '../../util/sessionStorage'
import { isArrayNotEmpty, captializedString, regexNumberExpression } from "../../util/helpers";
import Loader from '../../customComponents/loader'
import history from "../../util/history";
import {
    umpireListAction,
    updateAddUmpireData,
    addUmpireAction,
    getUmpireAffiliateList,
    umpireSearchAction,
    umpireClear
} from '../../store/actions/umpireAction/umpireAction'
import { entityTypes } from '../../util/entityTypes'
import { refRoleTypes } from '../../util/refRoles'


const { Footer, Content, Header } = Layout;
const { Option } = Select;

const OPTIONS = [];

class AddUmpire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            load: false,
            tableRecord: this.props.location.state ? this.props.location.state.tableRecord : null,
            isEdit: this.props.location.state ? this.props.location.state.isEdit : null,
            loader: false,
            showOption: false,
            competition_id: null,
            teamLoad: false,
            affiliateLoader: false,
            screenName: props.location ? props.location.state ? props.location.state.screenName ? props.location.state.screenName : null : null : null,
            isUserNotFound: false,
            exsitingValue: ''
        }

    }

    componentDidMount() {
        let compId = null
        if (getUmpireCompetiton()) {
            compId = JSON.parse(getUmpireCompetiton())
        }
        this.props.umpireListAction({ refRoleId: 5, entityTypes: 1, compId: compId, offset: 0 })
        if (compId !== null) {
            this.props.getUmpireAffiliateList({ id: compId })
        }
        if (this.state.isEdit === true) {
            this.props.updateAddUmpireData(this.state.tableRecord, 'isEditUmpire')
            this.setState({ loader: true })
        } else {
            this.props.updateAddUmpireData('', 'isAddUmpire')
        }
        this.setState({ load: true, competition_id: compId })
    }

    componentDidUpdate(nextProps) {
        if (this.props.umpireState.umpireList !== nextProps.umpireState.umpireList) {
            if (this.state.loader === true && this.props.umpireState.onLoad === false) {
                this.filterUmpireList()
                if (this.state.isEdit === true) {
                    this.setInitalFiledValue()
                }
                this.setState({ load: false, loader: false })
            }
        }

        if (this.props.umpireState.affiliateId !== nextProps.umpireState.affiliateId) {
            if (this.state.affiliateLoader === true) {
                const { affiliateId } = this.props.umpireState
                this.setSelectedAffiliateValue(affiliateId)
                this.setState({ affiliateLoader: false })
            }
        }
    }

    setSelectedAffiliateValue(affiliateId) {
        this.props.form.setFieldsValue({
            'umpireAffiliateName': affiliateId
        })
    }
    setInitalFiledValue() {
        const { umpireData, affiliateId } = this.props.umpireState
        this.props.form.setFieldsValue({
            'First Name': umpireData.firstName,
            'Last Name': umpireData.lastName,
            'Email Address': umpireData.email,
            'Contact no': umpireData.mobileNumber,
            'umpireNewAffiliateName': affiliateId
        })
    }

    filterUmpireList() {
        const { umpireListResult } = this.props.umpireState
        let umpireList = isArrayNotEmpty(umpireListResult) ? umpireListResult : []
        for (let i in umpireList) {
            OPTIONS.push(umpireList[i].firstName + " " + umpireList[i].lastName)
        }
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
                                <Breadcrumb.Item className="breadcrumb-add">{isEdit === true ? AppConstants.editUmpire : AppConstants.addUmpire}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    ////form view

    umpireExistingRadioButton(getFieldDecorator) {

        const { umpireListResult, onLoadSearch, affilateList, onAffiliateLoad } = this.props.umpireState
        let umpireList = isArrayNotEmpty(umpireListResult) ? umpireListResult : []
        let affilateData = isArrayNotEmpty(affilateList) ? affilateList : []

        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            <InputWithHead
                                required={"required-field pb-0 pt-0"}
                                heading={AppConstants.umpireSearch} />
                            {getFieldDecorator(AppConstants.team, {
                                rules: [{ required: true, message: ValidationConstants.umpireSearch }],
                            })(

                                <AutoComplete
                                    loading={true}
                                    style={{ width: "100%", height: '56px' }}
                                    placeholder="Select User"
                                    onSelect={(item, option) => {
                                        const umpireId = JSON.parse(option.key)
                                        this.props.umpireClear()
                                        this.props.updateAddUmpireData(umpireId, 'umnpireSearch')
                                        this.setState({ affiliateLoader: true, isUserNotFound: false })
                                    }}
                                    notFoundContent={onLoadSearch === true ? <Spin size="small" /> : null}

                                    onSearch={(value) => {
                                        this.setState({ isUserNotFound: false, exsitingValue: value })
                                        value ?
                                            this.props.umpireSearchAction({ refRoleId: refRoleTypes('member'), entityTypes: entityTypes('COMPETITION'), compId: this.state.competition_id, userName: value, offset: 0 })
                                            :
                                            this.props.umpireListAction({ refRoleId: refRoleTypes('member'), entityTypes: entityTypes('COMPETITION'), compId: this.state.competition_id, offset: 0 })

                                    }}
                                >{umpireList.map((item, index) => {
                                    return <Option key={item.id} value={item.firstName + " " + item.lastName}>
                                        {item.firstName + " " + item.lastName}
                                    </Option>
                                })}
                                </AutoComplete>
                            )}

                        </Form.Item>
                        <span style={{ color: 'red' }} >{(this.state.exsitingValue.length > 0 && (this.state.isUserNotFound || umpireList.length === 0)) && ValidationConstants.userNotFound}</span>
                    </div>
                </div>
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item className="slct-in-add-manager-livescore">
                            <InputWithHead
                                required={"required-field pb-1"}
                                heading={AppConstants.affiliate} />
                            {getFieldDecorator("umpireAffiliateName", {
                                rules: [{ required: true, message: ValidationConstants.affiliateField }],
                            })(
                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder={AppConstants.selectAffiliate}
                                    style={{ width: "100%", }}
                                    onChange={(affiliateId) => this.props.updateAddUmpireData(affiliateId, 'affiliateId')}
                                    // value={affiliateId}
                                    notFoundContent={onAffiliateLoad === true ? <Spin size="small" /> : null}
                                    optionFilterProp="children"
                                >
                                    {affilateData.map((item, index) => (
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

    umpireNewRadioBtnView(getFieldDecorator) {
        const { affilateList, umpireData } = this.props.umpireState
        let affiliateListResult = isArrayNotEmpty(affilateList) ? affilateList : []
        return (
            <div className="content-view pt-4">
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.firstName, {
                                rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                            })(
                                <InputWithHead
                                    auto_Complete='new-firstName'
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.firstName}
                                    placeholder={AppConstants.firstName}
                                    onChange={(firstName) => this.props.updateAddUmpireData(captializedString(firstName.target.value), 'firstName')}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'First Name': captializedString(i.target.value)
                                    })}
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
                                    auto_Complete='new-lastName'
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.lastName}
                                    placeholder={AppConstants.lastName}
                                    onChange={(lastName) => this.props.updateAddUmpireData(captializedString(lastName.target.value), 'lastName')}
                                    onBlur={(i) => this.props.form.setFieldsValue({
                                        'Last Name': captializedString(i.target.value)
                                    })}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator(AppConstants.emailAdd, {
                                rules: [
                                    {
                                        required: true,
                                        message: ValidationConstants.emailField[0]
                                    },
                                    {
                                        type: "email",
                                        pattern: new RegExp(AppConstants.emailExp),
                                        message: ValidationConstants.email_validation
                                    }
                                ]
                            })(
                                <InputWithHead
                                    auto_Complete='new-email'
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.emailAdd}
                                    placeholder={AppConstants.enterEmail}
                                    onChange={(email) => this.props.updateAddUmpireData(email.target.value, 'email')}
                                    // value={umpireData.email}
                                    disabled={this.state.isEdit === true && true}
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
                                    auto_Complete='new-contact'
                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.contactNO}
                                    placeholder={AppConstants.enterContactNo}
                                    maxLength={10}
                                    onChange={(mobileNumber) => this.props.updateAddUmpireData(mobileNumber.target.value, 'mobileNumber')}
                                // value={umpireData.mobileNumber}
                                />
                            )}
                        </Form.Item>
                    </div>
                </div>


                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item className="slct-in-add-manager-livescore">
                            <InputWithHead
                                required={"required-field pb-1"}
                                heading={AppConstants.affiliate} />
                            {getFieldDecorator("umpireNewAffiliateName", {
                                rules: [{ required: true, message: ValidationConstants.affiliateField }],
                            })(

                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder={AppConstants.selectAffiliate}
                                    style={{ width: "100%", }}
                                    onChange={(affiliateId) => this.props.updateAddUmpireData(affiliateId, 'affiliateId')}
                                    // value={affiliateId}
                                    optionFilterProp="children"
                                // onSearch={(name) => this.props.getUmpireAffiliateList({ id: this.state.competition_id, name: name })}
                                // notFoundContent={onAffiliateLoad == true ? <Spin size="small" /> : null}
                                >
                                    {affiliateListResult.map((item, index) => (
                                        < Option value={item.id} >{item.name}</Option>
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


    onButtonChage(e) {
        this.setState({ loader: true })
        this.props.updateAddUmpireData(e.target.value, 'umpireRadioBtn')
        this.props.form.setFieldsValue({
            'umpireAffiliateName': []
        })
    }

    radioBtnContainer() {
        const { umpireRadioBtn } = this.props.umpireState
        return (
            <div className="content-view pb-0 pt-4 row">
                <span className="applicable-to-heading ml-4">{AppConstants.umpire}</span>
                <Radio.Group
                    className="reg-competition-radio"
                    onChange={(e) => this.onButtonChage(e)}
                    value={umpireRadioBtn}
                >
                    {/* radio button without tooltip */}
                    <div className="row ml-2" style={{ marginTop: 18 }} >
                        <Radio value={"new"}>{AppConstants.new}</Radio>
                        <Radio value={"existing"}>{AppConstants.existing} </Radio>
                    </div>
                </Radio.Group>

            </div>
        )
    }


    ////form view
    contentViewForAddUmpire = (getFieldDecorator) => {
        const { umpireRadioBtn } = this.props.umpireState
        return (
            <div >

                {this.radioBtnContainer()}
                {umpireRadioBtn === 'new' ?
                    this.umpireNewRadioBtnView(getFieldDecorator)
                    :
                    this.umpireExistingRadioButton(getFieldDecorator)}

            </div>
        )
    }

    contentViewForEditUmpire = (getFieldDecorator) => {
        return (
            <div >
                {this.umpireNewRadioBtnView(getFieldDecorator)}

            </div>
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
                                <NavLink to='/umpire'>
                                    <Button className="cancelBtnWidth" type="cancel-button">{AppConstants.cancel}</Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text" type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    onSaveClick = e => {

        const { umpireData, affiliateId, umpireRadioBtn, exsitingUmpireId, umpireListResult } = this.props.umpireState
        let umpireList = isArrayNotEmpty(umpireListResult) ? umpireListResult : []



        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let body = ''
            if (!err) {
                if (umpireRadioBtn === 'new') {
                    if (this.state.isEdit === true) {
                        body = {
                            "id": umpireData.id,
                            "firstName": umpireData.firstName,
                            "lastName": umpireData.lastName,
                            "mobileNumber": regexNumberExpression(umpireData.mobileNumber),
                            "email": umpireData.email,
                            "affiliates": umpireData.affiliates
                        }
                    } else {
                        body = {
                            "firstName": umpireData.firstName,
                            "lastName": umpireData.lastName,
                            "mobileNumber": regexNumberExpression(umpireData.mobileNumber),
                            "email": umpireData.email,
                            "affiliates": umpireData.affiliates
                        }
                    }
                    this.props.addUmpireAction(body, affiliateId, exsitingUmpireId, { screenName: this.state.screenName, isEdit: this.state.isEdit })
                } else if (umpireRadioBtn === 'existing') {
                    body = {
                        "id": exsitingUmpireId,
                        "affiliates": umpireData.affiliates
                    }

                    if (umpireList.length === 0) {
                        this.setState({ isUserNotFound: true })
                    } else {
                        this.setState({ isUserNotFound: false })
                        this.props.addUmpireAction(body, affiliateId, exsitingUmpireId, { screenName: this.state.screenName })
                    }
                }

            }
        });
    };

    /////// render function 
    render() {
        const { getFieldDecorator } = this.props.form

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <Loader visible={this.props.umpireState.onSaveLoad} />
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={this.state.screenName == 'umpireDashboard' ? '1' : "2"} />
                <Layout>
                    {this.headerView()}
                    <Form autoComplete='off' onSubmit={this.onSaveClick} className="login-form" noValidate="noValidate">
                        <Content>
                            <div className="formView">
                                {this.state.isEdit === true ? this.contentViewForEditUmpire(getFieldDecorator) : this.contentViewForAddUmpire(getFieldDecorator)}
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
        umpireListAction,
        updateAddUmpireData,
        addUmpireAction,
        getUmpireAffiliateList,
        umpireSearchAction,
        umpireClear
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireState: state.UmpireState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(AddUmpire));