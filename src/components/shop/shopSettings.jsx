import React, { Component } from "react";
import { Layout, Select, Breadcrumb, Button, Form, Modal } from 'antd';
import './shop.css';
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InputWithHead from "../../customComponents/InputWithHead";
import { getStateReferenceAction } from "../../store/actions/commonAction/commonAction"
import Loader from '../../customComponents/loader';
import {
    getShopSettingAction,
    createAddressAction,
    onChangeSettingsData,
} from "../../store/actions/shopAction/shopSettingAction";
import ValidationConstants from '../../themes/validationConstant';
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../util/helpers";
import { checkOrganisationLevel } from "../../util/permissions";
import { getOrganisationData } from "../../util/sessionStorage"

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;

class ShopSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getLoad: false,
            orgLevel: AppConstants.state,
        }
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.apiCalls()
        this.setDetailsFieldValue();
        checkOrganisationLevel().then((value) => (
            this.setState({ orgLevel: value })
        ))
    }

    componentDidUpdate(nextProps) {
        let { getDetailsLoad } = this.props.shopSettingState;
        if (getDetailsLoad === false && this.state.getLoad === true) {
            this.setDetailsFieldValue();
            this.setState({ getLoad: false });
        }
    }

    apiCalls = () => {
        let body = {
            State: "State"
        }
        this.props.getStateReferenceAction(body)
        this.getSettingScreenData()
    }

    getSettingScreenData = () => {
        this.props.getShopSettingAction()
        this.setState({ getLoad: true })
    }

    setDetailsFieldValue() {
        let { settingDetailsData } = this.props.shopSettingState;
        this.formRef.current.setFieldsValue({
            address: settingDetailsData.address,
            suburb: settingDetailsData.suburb,
            state: isNotNullOrEmptyString(settingDetailsData.state) ? settingDetailsData.state : [],
            postcode: settingDetailsData.postcode,
        });
    }

    ///////post api
    saveSettings = (values) => {
        let { settingDetailsData } = JSON.parse(JSON.stringify(this.props.shopSettingState));
        let payload = settingDetailsData
        let orgData = getOrganisationData();
        let organisationUniqueKey = orgData ? orgData.organisationUniqueKey : 0;
        payload.organisationUniqueKey = organisationUniqueKey
        let key = "update"
        if (payload.id == 0) {
            delete payload['id'];
            key = "add"
        }
        this.props.createAddressAction(payload, key)
    }

    //////delete the type
    showDeleteConfirm = (index) => {
        let this_ = this
        confirm({
            title: AppConstants.deleteProductType,
            content: AppConstants.deleteProductTypeDescription,
            okText: 'Confirm',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                let { settingDetailsData } = this_.props.shopSettingState;
                let types = settingDetailsData.types
                types.splice(index, 1)
                this_.props.onChangeSettingsData(types, 'types')
            },
            onCancel() {
            },
        });
    }

    ///////add remove type
    addRemoveTypeOption = (index, key) => {
        let { settingDetailsData } = this.props.shopSettingState;
        let defaultTypeObject = {
            "typeName": ""
        }
        let types = settingDetailsData.types
        if (key === "add") {
            types.push(defaultTypeObject)
        }
        if (key === "remove") {
            this.showDeleteConfirm(index)
        }
        this.props.onChangeSettingsData(types, 'types')
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
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.settings}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    ////////form content view
    contentView = () => {
        let stateList = this.props.commonState.stateData
        return (
            <div className="content-view pt-4">
                <span className="form-heading">{AppConstants.pickUpAddress}</span>
                <Form.Item name='address' rules={[
                    {
                        required: true,
                        message:
                        ValidationConstants.enterAddress,
                    },
                ]}>
                    <InputWithHead
                        auto_complete='new-address'
                        required="required-field pb-0"
                        heading={AppConstants.address}
                        placeholder={AppConstants.address}
                        onChange={(e) => this.props.onChangeSettingsData(
                            e.target.value,
                            'address'
                        )}
                    />
                </Form.Item>
                <Form.Item name='suburb' rules={[
                    {
                        required: true,
                        message:
                        ValidationConstants.enterSuburb,
                    },
                ]}>
                    <InputWithHead
                        auto_complete='new-suburb'
                        required="required-field pb-0"
                        heading={AppConstants.suburb}
                        placeholder={AppConstants.suburb}
                        onChange={(e) => this.props.onChangeSettingsData(
                            e.target.value,
                            'suburb'
                        )}
                    />
                </Form.Item>
                <InputWithHead
                    heading={AppConstants.stateHeading}
                    required="required-field"
                />
                <Form.Item name='state' rules={[
                    {
                        required: true,
                        message:
                        ValidationConstants.enterState,
                    },
                ]}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder={AppConstants.select}
                        onChange={(value) => this.props.onChangeSettingsData(
                            value,
                            'state'
                        )}
                    >
                        {stateList.map((item) => (
                            <Option key={'state_' + item.name} value={item.name}>{item.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name='postcode' rules={[
                    {
                        required: true,
                        message:
                        ValidationConstants.enterPostcode,
                    },
                ]}>
                    <InputWithHead
                        auto_complete='new-postCode'
                        required="required-field pb-0"
                        heading={AppConstants.postCode}
                        placeholder={AppConstants.postcode}
                        onChange={(e) => this.props.onChangeSettingsData(
                            e.target.value,
                            'postcode'
                        )}
                        type="number"
                        min={0}
                    />
                </Form.Item>
            </div>
        );
    };

    productTypesView = () => {
        let { settingDetailsData } = this.props.shopSettingState;
        return (
            <div className="discount-view pt-5">
                <span className="form-heading">{AppConstants.productTypes}</span>
                {isArrayNotEmpty(settingDetailsData.types) && settingDetailsData.types.map((item, index) => (
                    <div className="row mt-4" key={"settingDetailsData" + index}>
                        <div className=" col-sm">
                            <InputWithHead
                                auto_complete='new-productType'
                                required={"required-field "}
                                placeholder={AppConstants.productTypes}
                                onChange={(e) => this.props.onChangeSettingsData(
                                    e.target.value,
                                    'typeName', index
                                )}
                                value={item.typeName}
                            />
                        </div>
                        <div className="col-sm-2 d-flex justify-content-center align-items-center">
                            <span className="user-remove-btn pl-2" style={{ cursor: 'pointer' }}>
                                <img
                                    className="dot-image"
                                    src={AppImages.redCross}
                                    alt=""
                                    width="16"
                                    height="16"
                                    onClick={() => this.addRemoveTypeOption(index, "remove")}
                                />
                            </span>
                        </div>
                    </div>
                ))}
                <span style={{ cursor: 'pointer' }}
                      className="input-heading-add-another"
                      onClick={() => this.addRemoveTypeOption(-1, "add")}>
                    + {AppConstants.addType}
                </span>
            </div>
        );
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="footer-view">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            {/* <Button
                                type="cancel-button"
                                onClick={() => console.log("Cancel")}>{AppConstants.cancel}</Button> */}
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button className="publish-button" type="primary" htmlType="submit">
                                {AppConstants.save}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        let { orgLevel } = this.state
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu="shop" shopSelectedKey="4" />
                <Layout>
                    <Form
                        ref={this.formRef}
                        autoComplete='off'
                        onFinish={this.saveSettings}
                        noValidate="noValidate"
                    >
                        <Content>
                            {this.headerView()}
                            <div className="formView">{this.contentView()}</div>
                            {orgLevel === AppConstants.state && <div className="formView">{this.productTypesView()}</div>}
                        </Content>
                        <Loader
                            visible={this.props.commonState.onLoad || this.props.shopSettingState.onLoad} />
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStateReferenceAction,
        getShopSettingAction,
        createAddressAction,
        onChangeSettingsData,
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        commonState: state.CommonReducerState,
        shopSettingState: state.ShopSettingState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopSettings);
