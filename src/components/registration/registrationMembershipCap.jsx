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
    Breadcrumb,
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
import { getOrganisationData } from "../../util/sessionStorage";
import Loader from '../../customComponents/loader';
import { routePermissionForOrgLevel } from "../../util/permissions";
import { captializedString } from "../../util/helpers";
import { 
    updateMembershipFeeCapListAction,
    getMembershipCapListAction,
    updateMembershipFeeCapAction 
} from "../../store/actions/registrationAction/registration";
import { getDefaultCompFeesMembershipProductTabAction } from "../../store/actions/registrationAction/competitionFeeAction";
import AppImages from "../../themes/appImages";

const { Footer, Content } = Layout;
const { Option } = Select;

let this_Obj = null;

class RegistrationMembershipCap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onYearLoad: false,
            yearRefId: null,
            organisationUniqueKey: getOrganisationData().organisationUniqueKey,
            getMembershipProductsOnLoad: false,
            getMembershipCapListOnLoad: false
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
            this.setState({ onYearLoad: true });
        }catch(ex){
            console.log("Error in apiCalls::"+ex)
        }
    }

    componentDidUpdate() {
        try{
            if (this.state.onYearLoad == true && this.props.appState.onLoad == false) {
                if (this.props.appState.yearList.length > 0) {
                    let mainYearRefId = getCurrentYear(this.props.appState.yearList);
                    let hasRegistration = 1;
                    this.props.getDefaultCompFeesMembershipProductTabAction(hasRegistration, mainYearRefId);
                    this.setState({onYearLoad: false,yearRefId: mainYearRefId,getMembershipProductsOnLoad: true});
                }
            }
            if(this.props.competitionFeesState.onLoad == false && this.state.getMembershipProductsOnLoad == true){
                this.props.getMembershipCapListAction(this.state.organisationUniqueKey)
                this.setState({getMembershipProductsOnLoad: false,getMembershipCapListOnLoad: true});
            }
            if(this.props.registrationState.onLoad == false && this.state.getMembershipCapListOnLoad == true){
                this.setMembershipCapListFormFieldsValue();
                this.setState({getMembershipCapListOnLoad: false});

            }
        }catch(ex){
            console.log("Error in componentDidUpdate::"+ex)
        }
    }

    setMembershipCapListFormFieldsValue = () => {
        try{
            const { membershipFeeCapList } = this.props.registrationState;
            for(let i in membershipFeeCapList){
                this.formRef.current.setFieldsValue({
                    [`membershipProducts${i}`]: membershipFeeCapList[i].productsInfo ? membershipFeeCapList[i].productsInfo : null
                });
                for(let j in membershipFeeCapList[i].feeCaps){
                    this.formRef.current.setFieldsValue({
                        [`dobFrom${i}${j}`]: membershipFeeCapList[i].feeCaps[j].dobFrom ? moment(membershipFeeCapList[i].feeCaps[j].dobFrom).format("MM-DD-YYYY") : null,
                        [`dobTo${i}${j}`]: membershipFeeCapList[i].feeCaps[j].dobTo ? moment(membershipFeeCapList[i].feeCaps[j].dobTo).format("MM-DD-YYYY") : null,
                        [`membershipFeeAmount${i}${j}`]: membershipFeeCapList[i].feeCaps[j].amount ? membershipFeeCapList[i].feeCaps[j].amount : null,
                    });
                }
            }
        }catch(ex){
            console.log("Error in setMembershipCapListFormfieldsValue::"+ex);
        }
    }

    onChangeMembershipProductValue = (value,key,index, subKey, subIndex) => {
        this.props.updateMembershipFeeCapListAction(value,key,index,subKey,subIndex);
    }

    dateConversion = (value,key,index, subKey, subIndex) => {
        try{
            let date = moment(value, "DD-MM-YYYY").format("MM-DD-YYYY");
            this.onChangeMembershipProductValue(date,key,index, subKey, subIndex)
        }catch(ex){
            console.log("Error in dateConversion::"+ex);
        }
    }

    getMembershipProductObj = () => {
        let obj = {
            "membershipCapId": 0,
            "organisationId": '',
            "isAllMembershipProduct": 0,
            "productsInfo": [],
            "products": [],
            "feeCaps": [
                {
                    "membershipFeeCapId": 0,
                    "dobFrom": null,
                    "dobTo": null,
                    "amount": null
                }
            ]
        }
        return obj;
    }

    addOrRemoveMembershipProductBox = (key,index) => {
        try{
            const { membershipFeeCapList } = this.props.registrationState;
            if(key == 'add'){
                membershipFeeCapList.push(this.getMembershipProductObj());
            }else if(key == 'remove'){
                membershipFeeCapList.splice(index,1);
            }
            this.props.updateMembershipFeeCapListAction(membershipFeeCapList,"membershipFeeCapList")
        }catch(ex){
            console.log("Error in addOrRemoveMembershipProductBox::"+ex);
        }
    }

    addOrRemoveAnoterProduct = (key,index,feeCapIndex) => {
        try{
            const { membershipFeeCapList } = this.props.registrationState;
            if(key == 'add'){
                let feeCapObj = {
                    "membershipFeeCapId": 0,
                    "dateFrom": null,
                    "dateTo": null,
                    "amount": null
                }
                membershipFeeCapList[index].feeCaps.push(feeCapObj);
            }else if('remove'){
                membershipFeeCapList[index].feeCaps.splice(feeCapIndex,1)
            }
            this.props.updateMembershipFeeCapListAction(membershipFeeCapList,"membershipFeeCapList")
        }catch(ex){
            console.log("Error in addOrRemoveAnoterProduct::"+ex);
        }
    }

    saveMembershipFeeCap = () => {
        try{
            const { membershipFeeCapList } = this.props.registrationState;
            this.props.updateMembershipFeeCapAction(this.state.organisationUniqueKey,membershipFeeCapList)
        }catch(ex){
            console.log("Error in saveMembershipFeeCap::"+ex)
        }
    }

    headerView = () => {
        return (
            <div className="membership-cap-heading-view">
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

    membershipProductView = (item,index) => {
        try{
            const { membershipFeeCapList } = this.props.registrationState;
            const { defaultCompFeesMembershipProduct } = this.props.competitionFeesState;
            return(
                <div className="membership-cap">
                    <div className="d-flex">
                        <div className="membership-cap-heading font-18">{AppConstants.applyMembershipProducts}</div>
                        {membershipFeeCapList.length > 1 && (
                            <img className="pointer membership-cap-cloase" src={AppImages.crossImage}
                            onClick={() => this.addOrRemoveMembershipProductBox('remove',index)}/>
                        )}  
                    </div>
                    <Checkbox
                        className="membership-cap-check-box-lbl"
                        onChange={(e) => this.onChangeMembershipProductValue(e.target.checked ? 1 : 0,"isAllMembershipProduct",index)}
                        style={{margin: "15px 0px"}}>
                        {AppConstants.allMembershipProducts}
                    </Checkbox>
                    <Form.Item 
                    name={`membershipProducts${index}`} 
                    rules={[{ required: true, message: ValidationConstants.membershipProductsRequired }]}>
                        <Select
                            mode="multiple"
                            showArrow
                            showSearch
                            optionFilterProp="children"
                            style={{ width: "100%"}}
                            placeholder={AppConstants.select}
                            onChange={(products) => this.onChangeMembershipProductValue(products, "productsInfo",index)}
                            setFieldsValue={item.productsInfo}
                            >
                                {(defaultCompFeesMembershipProduct || []).map((defProduct,defProductIndex) => (
                                    < Option key={defProduct.membershipProductUniqueKey} value={defProduct.membershipProductUniqueKey}> {defProduct.membershipProductName}</Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <div className="membership-cap-border mt-4">
                        {(item.feeCaps || []).map((feeCap,feeCapIndex) => (
                            <div className="row mb-4" style={{alignItems: "flex-end"}}>
                                <div className="col-md-4">
                                    <div className="membership-cap-check-box-lbl mb-2">{AppConstants.fromDob}</div>
                                    <Form.Item
                                        name={`dobFrom${index}${feeCapIndex}`}
                                        rules={[{ required: true, message: ValidationConstants.fromDateIsRequired }]}
                                    >
                                        <DatePicker
                                            setFieldsValue={feeCap.dateFrom ? moment(feeCap.dateFrom,"MM-DD-YYYY") : null}
                                            size="large"
                                            placeholder={"dd-mm-yyyy"}
                                            style={{ width: "100%" }}
                                            onChange={(e, f) => this.dateConversion(f, "feeCaps", index, "dobFrom",feeCapIndex)}
                                            format={"DD-MM-YYYY"}
                                            showTime={false}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-md-4">
                                    <div className="membership-cap-check-box-lbl mb-2">{AppConstants.toDob}</div>
                                    <Form.Item
                                            name={`dobTo${index}${feeCapIndex}`}
                                            rules={[{ required: true, message: ValidationConstants.toDateIsRequired }]}
                                        >
                                            <DatePicker
                                                setFieldsValue={feeCap.dateTo ? moment(feeCap.dateTo,"MM-DD-YYYY") : null}
                                                size="large"
                                                placeholder={"dd-mm-yyyy"}
                                                style={{ width: "100%" }}
                                                onChange={(e, f) => this.dateConversion(f,"feeCaps", index, "dobTo",feeCapIndex)}
                                                format={"DD-MM-YYYY"}
                                                showTime={false}
                                            />
                                    </Form.Item>
                                </div>
                                <div className={(item.feeCaps.length > 1) ? "col-md-3" : "col-md-4"}>
                                    <div className="membership-cap-check-box-lbl mb-2">{AppConstants.maxMembershipFeePayable}</div>
                                    <Form.Item
                                        name={`membershipFeeAmount${index}${feeCapIndex}`}
                                        rules={[{ required: true, message: ValidationConstants.membershipFeeRequired }]}
                                    >
                                        <InputWithHead
                                            setFieldsValue={feeCap.amount}
                                            style={{height: 46}}
                                            placeholder=" "
                                            onChange={(e) => this.onChangeMembershipProductValue(e.target.value, "feeCaps", index, "amount", feeCapIndex )}
                                            type={"number"}
                                        />
                                    </Form.Item>
                                </div>
                                {(item.feeCaps.length > 1) && (
                                    <div className="col-md-1">
                                        <img className="mb-3 pointer" style={{width: 22}} src={AppImages.redCross}
                                        onClick={() => this.addOrRemoveAnoterProduct("remove",index,feeCapIndex)} />
                                    </div>
                                )}
                            </div>  
                        ))}
                        <div 
                        className="orange-action-txt" 
                        style={{ alignSelf: "center", marginTop: 10}}
                        onClick={() => this.addOrRemoveAnoterProduct("add",index)}>
                            +{AppConstants.addAnother}
                        </div>
                     </div>
                </div>
            )
        }catch(ex){
            console.log("Error in membershipProductView::"+ex);
        }
    }

    contentView = () => {
        try{
            const { membershipFeeCapList } = this.props.registrationState;
            return(
                <div>
                    {(membershipFeeCapList || []).map((item,index) => (
                        <div className="mb-5">{this.membershipProductView(item,index)}</div>
                    ))}
                    <div 
                        className="orange-action-txt center-align" 
                        style={{ alignSelf: "center"}}
                        onClick={() => this.addOrRemoveMembershipProductBox("add")}>
                        +{AppConstants.addAnotherMembershipProduct}
                    </div>
                </div>
            )
        }catch(ex){
            console.log("Error in contentView::"+ex);
        }
    }

    footerView = () => {
        return (
            <div className="center-align">
                <div className="d-flex">
                    <Button 
                    htmlType="submit"
                    className="primary-add-product membership-cap-save" 
                    type="primary">
                        {AppConstants.save}
                    </Button>
                </div>
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
                        onFinish={this.saveMembershipFeeCap}
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
        getOnlyYearListAction,
        updateMembershipFeeCapListAction,
        getDefaultCompFeesMembershipProductTabAction,
        getMembershipCapListAction,
        updateMembershipFeeCapAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        registrationState: state.RegistrationState,
        competitionFeesState: state.CompetitionFeesState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationMembershipCap);
