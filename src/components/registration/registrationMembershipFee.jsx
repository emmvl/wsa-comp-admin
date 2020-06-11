import React, { Component } from "react";
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
    Modal
} from "antd";
import "./product.css";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    regGetMembershipProductDetailsAction,
    regSaveMembershipProductDetailsAction,
    regGetDefaultMembershipProductTypesAction,
    regSaveMembershipProductFeesAction,
    regSaveMembershipProductDiscountAction,
    membershipFeesTableInputChangeAction,
    membershipProductDiscountTypesAction,
    addNewMembershipTypeAction,
    addRemoveDiscountAction,
    updatedDiscountDataAction,
    membershipFeesApplyRadioAction,
    onChangeAgeCheckBoxAction,
    updatedMembershipTypeDataAction,
    removeCustomMembershipTypeAction,
    regMembershipListDeleteAction
} from "../../store/actions/registrationAction/registration";
import {
    getOnlyYearListAction,
    getProductValidityListAction,
    getMembershipProductFeesTypeAction,
    getCommonDiscountTypeTypeAction
} from "../../store/actions/appAction";
import moment from "moment";
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";
import { message } from "antd";
import { isArrayNotEmpty } from "../../util/helpers";
import Loader from '../../customComponents/loader';
import { routePermissionForOrgLevel } from "../../util/permissions";
import Tooltip from 'react-png-tooltip'

const { Footer, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;


let this_Obj = null;
const columns = [
    {
        title: AppConstants.type,
        dataIndex: "membershipProductTypeRefName",
        key: "membershipProductTypeRefName"
    },
    {
        title: AppConstants.membershipProduct,
        dataIndex: "membershipProductName",
        key: "membershipProductName",

    },

    {
        title: AppConstants.casualFee + " (excl. GST)",
        dataIndex: "casualFee",
        key: "casualFee",
        filterDropdown: true,
        filterIcon: () => {
            return (

                <Tooltip placement="top" background='#ff8237'>
                    <span>{AppConstants.membershipCasualFeeMsg}</span>
                </Tooltip>


            );
        },
        render: (casualFee, record) => (
            <Input type="number" prefix="$" className="input-inside-table-fees" value={casualFee}
                onChange={e => this_Obj.props.membershipFeesTableInputChangeAction(e.target.value, record, "casualFee")}
                disabled={this_Obj.state.membershipIsUsed} />
        )
    },
    {
        title: AppConstants.gst,
        dataIndex: "casualGst",
        key: "casualGst",
        render: (casualFeeGst, record) => (
            <Input type="number" prefix="$" className="input-inside-table-fees" value={casualFeeGst}
                onChange={e => this_Obj.props.membershipFeesTableInputChangeAction(e.target.value, record, "casualGst")}
                disabled={this_Obj.state.membershipIsUsed} />
        )
    },
    {
        title: AppConstants.seasonalFee + " (excl. GST)",
        dataIndex: "seasonalFee",
        key: "seasonalFee",
        filterDropdown: true,
        filterIcon: () => {
            return (

                <Tooltip placement="top" background='#ff8237'>
                    <span>{AppConstants.membershipSeasonalFeeMsg}</span>
                </Tooltip>


            );
        },
        render: (seasonalFee, record) => (
            <Input type="number" prefix="$" className="input-inside-table-fees" value={seasonalFee}
                onChange={e => this_Obj.props.membershipFeesTableInputChangeAction(e.target.value, record, "seasonalFee")}
                disabled={this_Obj.state.membershipIsUsed} />
        )
    },
    {
        title: AppConstants.gst,
        dataIndex: "seasonalGst",
        key: "seasonalGst",
        render: (seasonalFeeGst, record) => (
            <Input type="number" prefix="$" className="input-inside-table-fees" value={seasonalFeeGst}
                onChange={e => this_Obj.props.membershipFeesTableInputChangeAction(e.target.value, record, "seasonalGst")}
                disabled={this_Obj.state.membershipIsUsed} />
        )
    }
];




class RegistrationMembershipFee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            value: 1,
            discountType: 0,
            membershipTabKey: "1",
            membershipProductSelected: [],
            discountMembershipType: "Select",
            selectedMemberShipType: [],
            discountMembershipTypeData: [],
            visible: false,
            newNameMembershipType: "",
            statusRefId: 1,
            loading: false,
            buttonPressed: "next",
            membershipIsUsed: false,
        };
        this_Obj = this;
    }


    componentDidMount() {
        routePermissionForOrgLevel(AppConstants.national, AppConstants.state)
        let productId = null
        productId = this.props.location.state ? this.props.location.state.id : null
        this.apiCalls(productId)
        this.setFieldDecoratorValues()
    }

    componentDidUpdate(prevState) {
        let registrationState = this.props.registrationState
        let allData = registrationState.getMembershipProductDetails
        if (registrationState.getMembershipProductDetails !== prevState.registrationState.getMembershipProductDetails) {
            let discountMembershipTypeData = allData.membershipproduct.membershipProductTypes !== undefined ?
                allData.membershipproduct.membershipProductTypes : []
            let membershipIsUsed = allData.membershipproduct.isUsed
            this.setFieldDecoratorValues()
            this.setState({
                discountMembershipTypeData,
                membershipIsUsed
            })
        }
        if (registrationState.onLoad === false && this.state.loading === true) {
            this.setState({ loading: false })
            if (!registrationState.error) {
                this.setState({
                    // loading: false,
                    membershipTabKey: this.state.buttonPressed == "next" && JSON.stringify(JSON.parse(this.state.membershipTabKey) + 1)
                })
            }
            if (this.state.buttonPressed == "save" || this.state.buttonPressed == "publish" || this.state.buttonPressed == "delete") {
                history.push('/registrationMembershipList');
            }
        }
    }




    apiCalls = (productId) => {
        this.props.getOnlyYearListAction(this.props.appState.yearList)
        this.props.getProductValidityListAction()
        if (productId == null) {
            this.props.regGetDefaultMembershipProductTypesAction()
        }
        if (productId !== null) {
            this.props.regGetMembershipProductDetailsAction(productId)  /////get the membership product details
        }
        this.props.getMembershipProductFeesTypeAction()
        this.props.getCommonDiscountTypeTypeAction()
        this.props.membershipProductDiscountTypesAction()
    }


    saveMembershipProductDetails = (e) => {
        e.preventDefault();
        let productId = this.props.registrationState.membershipProductId
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.membershipTabKey == "1") {
                    const { yearRefId, membershipProductName, validityRefId } = values;
                    let membershipTypesData = JSON.parse(JSON.stringify(this.props.registrationState.getDefaultMembershipProductTypes));
                    let finalMembershipTypes = []
                    membershipTypesData.map((item) => {
                        if (item.isMemebershipType == true) {
                            if (item.membershipProductTypeRefId > 0) {
                                delete item['membershipProductTypeRefName']
                            }
                            finalMembershipTypes.push(item)
                        }
                        return item
                    })
                    let productBody =
                    {
                        "membershipProductId": productId,
                        "yearRefId": yearRefId,
                        "statusRefId": this.state.statusRefId,
                        "validityRefId": validityRefId,
                        "membershipProductName": membershipProductName,
                        "membershipProductTypes": finalMembershipTypes
                    }
                    if (productBody.membershipProductTypes.length > 0) {
                        this.props.regSaveMembershipProductDetailsAction(productBody)
                        this.setState({ loading: true })
                    }
                    else {
                        message.error(ValidationConstants.pleaseSelectMembershipTypes)
                    }
                }
                else if (this.state.membershipTabKey == "2") {
                    let finalMembershipFeesData = JSON.parse(JSON.stringify(this.props.registrationState.membershipProductFeesTableData));
                    finalMembershipFeesData.membershipFees.map((item) => {
                        delete item['membershipProductName']
                        delete item['membershipProductTypeRefName']
                        return item
                    }
                    )
                    this.props.regSaveMembershipProductFeesAction(finalMembershipFeesData)
                    this.setState({ loading: true })
                }
                else if (this.state.membershipTabKey == "3") {
                    let discountData = JSON.parse(JSON.stringify(this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts))
                    discountData.map((item) => {
                        if (item.childDiscounts) {
                            if (item.childDiscounts.length == 0) {
                                item.childDiscounts = null
                            }
                            if (item.membershipPrdTypeDiscountTypeRefId !== 3) {
                                item.childDiscounts = null
                            }
                        }
                        item.applyDiscount = parseInt(item.applyDiscount)
                        if (item.amount !== null) {
                            if (item.amount.length > 0) {
                                item.amount = parseInt(item.amount)
                            }
                            else {
                                item['amount'] = null
                            }
                        }
                        else {
                            item['amount'] = null
                        }
                        return item
                    })
                    let discountBody =
                    {
                        "membershipProductId": productId,
                        "statusRefId": this.state.statusRefId,
                        "membershipProductDiscounts": [
                            {
                                "discounts": discountData
                            }
                        ]
                    }
                    this.props.regSaveMembershipProductDiscountAction(discountBody)
                    this.setState({ loading: true })
                }
            }
        });

    }


    setFieldDecoratorValues = () => {
        let allData = this.props.registrationState.getMembershipProductDetails
        let membershipProductData = allData !== null ? allData.membershipproduct : []
        this.props.form.validateFields((err, values) => console.log("values266", Object.keys(values)))
        this.props.form.setFieldsValue({
            yearRefId: membershipProductData.yearRefId ? membershipProductData.yearRefId : 1,
            membershipProductName: membershipProductData.membershipProductName,
            validityRefId: membershipProductData.ValidityRefId ? membershipProductData.ValidityRefId : 2,
        });
        let typesData = membershipProductData.membershipProductTypes ? membershipProductData.membershipProductTypes : []
        typesData.length > 0 && typesData.map((item, index) => {
            console.log("item, index", item, index)
            let dobFrom = `dobFrom${index}`
            let dobTo = `dobTo${index}`
            this.props.form.setFieldsValue({
                [dobFrom]: moment(item.dobFrom),
                [dobTo]: moment(item.dobTo)
            })
        })
        let data = this.props.registrationState.membershipProductDiscountData
        let discountData = data && data.membershipProductDiscounts !== null ? data.membershipProductDiscounts[0].discounts : []
        discountData.map((item, index) => {
            let membershipProductTypeMappingId = `membershipProductTypeMappingId${index}`
            let membershipPrdTypeDiscountTypeRefId = `membershipPrdTypeDiscountTypeRefId${index}`
            this.props.form.setFieldsValue({
                [membershipProductTypeMappingId]: item.membershipProductTypeMappingId,
                [membershipPrdTypeDiscountTypeRefId]: item.membershipPrdTypeDiscountTypeRefId,
            })
            let childDiscounts = item.childDiscounts !== null && item.childDiscounts.length > 0 ? item.childDiscounts : []
            childDiscounts.map((childItem, childindex) => {
                let childDiscountPercentageValue = `percentageValue${index} + ${childindex}`
                this.props.form.setFieldsValue({
                    [childDiscountPercentageValue]: childItem.percentageValue
                })
            })
        })
    }

    //////delete the membership product
    showDeleteConfirm = () => {
        let membershipProductId = this.props.registrationState.membershipProductId
        let this_ = this
        confirm({
            title: 'Are you sure delete this product?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                if (membershipProductId.length > 0) {
                    this_.deleteProduct(membershipProductId)
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    deleteProduct = (membershipProductId) => {
        this.setState({ loading: true, buttonPressed: "delete" })
        this.props.regMembershipListDeleteAction(membershipProductId)
    }

    /////selection of membership fees type
    membershipTypesAndAgeSelected(checkedValue, index, keyword) {
        this.props.onChangeAgeCheckBoxAction(index, checkedValue, keyword)
    }

    dropdownView = (getFieldDecorator) => {
        return (
            <div className="comp-venue-courts-dropdown-view mt-5">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                style={{
                                    width: "fit-content",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <span className="year-select-heading required-field">
                                    {AppConstants.year}:
                </span>
                                <Form.Item  >
                                    {getFieldDecorator('yearRefId', { initialValue: 1 },
                                        { rules: [{ required: true, message: ValidationConstants.pleaseSelectYear }] })(
                                            <Select
                                                className="year-select"
                                            >
                                                {this.props.appState.yearList.map(item => {
                                                    return (
                                                        <Option key={"yearRefId" + item.id} value={item.id}>
                                                            {item.description}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };




    handleOk = e => {
        let newObj = {
            "dobTo": null,
            "dobFrom": null,
            "membershipProductTypeRefId": 0,
            "membershipProductTypeRefName": this.state.newNameMembershipType,
            "membershipProductTypeMappingId": 0,
            "isDefault": 0,
            "isPlaying": 0,
        }
        this.props.addNewMembershipTypeAction(newObj)
        this.setState({
            visible: false,
            newNameMembershipType: ""
        });
    };


    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    ///add another membershipType
    addAnothermembershipType = () => {
        this.setState({ visible: true })
    }



    ///setting the mandate age restriction from date
    dateOnChangeFrom = (date, index) => {
        let dateFrom = moment(date).format("YYYY-MM-DD")
        let membershipTypeData = this.props.registrationState.getDefaultMembershipProductTypes
        membershipTypeData[index].dobFrom = dateFrom
        this.props.updatedMembershipTypeDataAction(membershipTypeData)
    };

    ////setting the mandate age restriction to date
    dateOnChangeTo = (date, index) => {
        let dobTo = moment(date).format("YYYY-MM-DD")
        let membershipTypeData = this.props.registrationState.getDefaultMembershipProductTypes
        membershipTypeData[index].dobTo = dobTo
        this.props.updatedMembershipTypeDataAction(membershipTypeData)
    };


    //////dynamic membership type view
    membershipTypesView = (
        getFieldDecorator
    ) => {
        let registrationState = this.props.registrationState
        const defaultTypes = registrationState.getDefaultMembershipProductTypes !== null ? registrationState.getDefaultMembershipProductTypes : []
        let allData = this.props.registrationState.getMembershipProductDetails
        return (
            <div>
                <span className="applicable-to-heading">
                    {AppConstants.membershipTypes}
                </span>

                {defaultTypes.length > 0 && defaultTypes.map((item, index) => (
                    <div key={index} className="prod-reg-inside-container-view">
                        <div className="row">
                            <div className="col-sm">
                                <Checkbox
                                    className="single-checkbox pt-3"
                                    checked={item.isMemebershipType}
                                    onChange={e => this.membershipTypesAndAgeSelected(e.target.checked, index, "isMemebershipType")}
                                    key={index}
                                    disabled={this.state.membershipIsUsed}
                                >
                                    {item.membershipProductTypeRefName}
                                </Checkbox>
                            </div>
                            {item.membershipProductTypeRefId > 4 || item.membershipProductTypeRefId == 0 &&
                                <div className="col-sm transfer-image-view pt-4"
                                    onClick={() => !this.state.membershipIsUsed ? this.props.removeCustomMembershipTypeAction(index) : null}>
                                    <span className="user-remove-btn">
                                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </span>
                                    <span className="user-remove-text mr-0">{AppConstants.remove}</span>
                                </div>
                            }
                        </div>
                        {
                            item.isMemebershipType && (

                                <div className="reg-membership-fee-mandate-check-view">
                                    <div className="colsm-">
                                        {item.isDefault == 0 && (
                                            <Checkbox
                                                className="single-checkbox"
                                                checked={item.isPlaying}
                                                onChange={e =>
                                                    this.membershipTypesAndAgeSelected(e.target.checked, index, "isPlaying")
                                                }
                                                disabled={this.state.membershipIsUsed}
                                            >
                                                {AppConstants.playerConst}
                                            </Checkbox>
                                        )}
                                    </div>
                                    <Checkbox
                                        className="single-checkbox"
                                        checked={item.isMandate}
                                        onChange={e =>
                                            this.membershipTypesAndAgeSelected(e.target.checked, index, "isMandate")
                                        }
                                        disabled={this.state.membershipIsUsed}
                                    >
                                        {`Mandate ${item.membershipProductTypeRefName} Age Restrictions`}
                                    </Checkbox>

                                    {item.isMandate && (
                                        <div className="fluid-width">
                                            <div className="row">
                                                <div className="col-sm">
                                                    <InputWithHead heading={AppConstants.dobFrom} />
                                                    <Form.Item>
                                                        {getFieldDecorator(
                                                            `dobFrom${index}`,
                                                            {
                                                                rules: [
                                                                    {
                                                                        required: true,
                                                                        message: ValidationConstants.pleaseSelectDOBFrom
                                                                    }
                                                                ]
                                                            },
                                                        )(
                                                            <DatePicker
                                                                size="large"
                                                                style={{ width: "100%" }}
                                                                onChange={date => this.dateOnChangeFrom(date, index)}
                                                                format={"DD-MM-YYYY"}
                                                                showTime={false}
                                                                // defaultValue={item.dobFrom !== null ? moment(item.dobFrom) : null}
                                                                disabled={this.state.membershipIsUsed}
                                                                disabledDate={d => d.isSameOrAfter(item.dobTo)
                                                                }
                                                            />
                                                        )}
                                                    </Form.Item>
                                                </div>
                                                <div className="col-sm">
                                                    <InputWithHead heading={AppConstants.dobTo} />
                                                    <Form.Item>
                                                        {getFieldDecorator(
                                                            `dobTo${index}`,
                                                            {
                                                                rules: [
                                                                    {
                                                                        required: true,
                                                                        message: ValidationConstants.PleaseSelectDOBTo
                                                                    }
                                                                ]
                                                            },
                                                        )(
                                                            <DatePicker
                                                                size="large"
                                                                style={{ width: "100%" }}
                                                                onChange={date => this.dateOnChangeTo(date, index)}
                                                                format={"DD-MM-YYYY"}
                                                                showTime={false}
                                                                defaultValue={item.dobTo !== null ? moment(item.dobTo) : null}
                                                                disabled={this.state.membershipIsUsed}
                                                                // disabledDate={d => d.isSameOrBefore(item.dobFrom)
                                                                // }
                                                                disabledDate={d => moment(item.dobFrom).isSameOrAfter(d, 'day')
                                                                }
                                                            />
                                                        )}
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    </div>
                ))
                }
                <span className="input-heading-add-another" onClick={!this.state.membershipIsUsed ? this.addAnothermembershipType : null}>
                    + {AppConstants.addMembershipType}
                </span>
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.addMembershipType}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <InputWithHead
                        required={"pt-0 mt-0"}
                        heading={AppConstants.membershipTypeName}
                        placeholder={AppConstants.pleaseEnterMembershipTypeName}
                        onChange={(e) => this.setState({ newNameMembershipType: e.target.value })}
                        value={this.state.newNameMembershipType}
                    />

                </Modal>
            </div >
        )
    }



    ////////form content view
    contentView = (
        getFieldDecorator
    ) => {
        let appState = this.props.appState
        let allData = this.props.registrationState.getMembershipProductDetails
        let membershipProductData = allData !== null ? allData.membershipproduct : []
        return (
            <div className="content-view pt-5">
                <span className="form-heading ">{AppConstants.membershipProduct}</span>
                <Form.Item >
                    {getFieldDecorator('membershipProductName',
                        { rules: [{ required: true, message: ValidationConstants.membershipProductIsRequired }] })(
                            <InputWithHead
                                required={"required-field pb-0 "}
                                heading={AppConstants.membershipProductName}
                                placeholder={AppConstants.membershipProductName}
                                disabled={this.state.membershipIsUsed}
                                conceptulHelp
                                conceptulHelpMsg={AppConstants.membershipProductNameMsg}
                                marginTop={12}
                            />
                        )}
                </Form.Item>


                <div className='contextualHelp-RowDirection'>
                    <span className="applicable-to-heading  required-field">
                        {AppConstants.validity}
                    </span>
                    <div style={{ marginTop: 20 }}>
                        <Tooltip placement="top" background='#ff8237'>
                            <span>{AppConstants.validityMsg}</span>
                        </Tooltip>
                    </div>
                </div>
                <Form.Item  >
                    {getFieldDecorator('validityRefId', { initialValue: 2 }, { rules: [{ required: true, message: ValidationConstants.pleaseSelectValidity }] })(
                        <Radio.Group
                            className="reg-competition-radio"
                            disabled={this.state.membershipIsUsed}
                        >
                            {appState.productValidityList.map(item => {
                                return (
                                    <div>
                                        {item.id == "2" &&
                                            <Radio key={"validityRefId" + item.id} value={item.id}> {item.description}</Radio>
                                        }
                                    </div>
                                );
                            })}

                        </Radio.Group>
                    )}
                </Form.Item>
                {this.membershipTypesView(getFieldDecorator)}
            </div >
        );
    };

    ///membershipFees apply radio onchange
    membershipFeeApplyRadio = (radioApplyId, feesIndex) => {
        this.props.membershipFeesApplyRadioAction(radioApplyId, feesIndex)
    }

    ////fees view inside the content
    feesView = (getFieldDecorator) => {
        let data = this.props.registrationState.membershipProductFeesTableData
        let feesData = data ? data.membershipFees.length > 0 ? data.membershipFees : [] : []
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.membershipFees}</span>
                {feesData.length > 0 && feesData.map((item, index) => (
                    <div className="inside-container-view">
                        <div className="table-responsive">
                            <Table
                                className="fees-table"
                                columns={columns}
                                dataSource={[item]}
                                pagination={false}
                                Divider="false"
                            />
                        </div>
                        <span className="applicable-to-heading">
                            {AppConstants.applyMembershipFee}
                        </span>
                        <Radio.Group
                            className="reg-competition-radio"
                            onChange={e => this.membershipFeeApplyRadio(e.target.value, index)}
                            defaultValue={item.membershipProductFeesTypeRefId}
                            disabled={this.state.membershipIsUsed}
                        >
                            {this.props.appState.membershipProductFeesTypes.map((item, typeindex) => {
                                return (

                                    <div className='row'>
                                        <Radio key={"validityRefId" + typeindex} value={item.id}> {item.description}</Radio>

                                        <div style={{ marginLeft: -18, }}>
                                            <Tooltip background='#ff8237'>
                                                <span>{item.helpMsg}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                );
                            })}
                        </Radio.Group>
                    </div>
                ))}
            </div>
        );
    };



    discountViewChange = (item, index, getFieldDecorator) => {
        let childDiscounts = item.childDiscounts !== null && item.childDiscounts.length > 0 ? item.childDiscounts : []
        console.log("item", item)
        switch (item.membershipPrdTypeDiscountTypeRefId) {
            case 1:
                return <div>
                    <InputWithHead heading={"Discount Type"} />
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
                        placeholder="Select"
                        value={item.discountTypeRefId}
                        disabled={this.state.membershipIsUsed}
                    >
                        {this.props.appState.commonDiscountTypes.map(item => {
                            return (
                                <Option key={"discountType" + item.id} value={item.id}>
                                    {item.description}
                                </Option>
                            );
                        })}
                    </Select>
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.percentageOff_FixedAmount}
                                placeholder={AppConstants.percentageOff_FixedAmount}
                                onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                value={item.amount}
                                suffix={JSON.stringify(item.discountTypeRefId) == "2" ? "%" : null}
                                type="number"
                                disabled={this.state.membershipIsUsed}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.description}
                                placeholder={AppConstants.gernalDiscount}
                                onChange={(e) => this.onChangeDescription(e.target.value, index)}
                                value={item.description}
                                disabled={this.state.membershipIsUsed}
                            />
                        </div>
                    </div>
                    <div className="fluid-width">
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableFrom} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.onChangeDiscountAvailableFrom(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableFrom !== null && moment(item.availableFrom)}
                                    disabled={this.state.membershipIsUsed}
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableTo} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={this.disabledDate}
                                    disabledTime={this.disabledTime}
                                    onChange={date => this.onChangeDiscountAvailableTo(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableTo !== null && moment(item.availableTo)}
                                    disabled={this.state.membershipIsUsed}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            case 2:
                return <div>
                    <InputWithHead heading={"Discount Type"} />
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
                        placeholder="Select"
                        value={item.discountTypeRefId}
                        disabled={this.state.membershipIsUsed}
                    >
                        {this.props.appState.commonDiscountTypes.map(item => {
                            return (
                                <Option key={"discountType" + item.id} value={item.id}>
                                    {item.description}
                                </Option>
                            );
                        })}
                    </Select>
                    <InputWithHead
                        heading={AppConstants.code}
                        placeholder={AppConstants.code}
                        onChange={(e) => this.onChangeDiscountCode(e.target.value, index)}
                        value={item.discountCode}
                        disabled={this.state.membershipIsUsed}
                    />
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.percentageOff_FixedAmount}
                                placeholder={AppConstants.percentageOff_FixedAmount}
                                onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                value={item.amount}
                                suffix={JSON.stringify(item.discountTypeRefId) == "2" ? "%" : null}
                                type="number"
                                disabled={this.state.membershipIsUsed}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.description}
                                placeholder={AppConstants.gernalDiscount}
                                onChange={(e) => this.onChangeDescription(e.target.value, index)}
                                value={item.description}
                                disabled={this.state.membershipIsUsed}
                            />
                        </div>
                    </div>

                    <div className="fluid-width">
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableFrom} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.onChangeDiscountAvailableFrom(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableFrom !== null && moment(item.availableFrom)}
                                    disabled={this.state.membershipIsUsed}
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableTo} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={this.disabledDate}
                                    disabledTime={this.disabledTime}
                                    onChange={date => this.onChangeDiscountAvailableTo(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableTo !== null && moment(item.availableTo)}
                                    disabled={this.state.membershipIsUsed}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            case 3:
                return <div>
                    {childDiscounts.map((childItem, childindex) => (
                        <div className="row">
                            <div className="col-sm-10">
                                <Form.Item  >
                                    {getFieldDecorator(`percentageValue${index} + ${childindex}`,
                                        { rules: [{ required: true, message: ValidationConstants.pleaseEnterChildDiscountPercentage }] })(
                                            <InputWithHead
                                                heading={`Child ${childindex + 1}%`}
                                                placeholder={`Child ${childindex + 1}%`}
                                                onChange={(e) => this.onChangeChildPercent(e.target.value, index, childindex, childItem)}
                                                // value={childItem.percentageValue}
                                                disabled={this.state.membershipIsUsed}
                                            />
                                        )}
                                </Form.Item>
                            </div>
                            {childindex > 0 &&
                                <div className="col-sm-2 delete-image-view pb-4"
                                    onClick={() => !this.state.membershipIsUsed ? this.addRemoveChildDiscount(index, "delete", childindex) : null}>
                                    <span className="user-remove-btn">
                                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </span>
                                    <span className="user-remove-text mr-0 mb-1">{AppConstants.remove}</span>
                                </div>
                            }
                        </div>
                    ))}
                    <span className="input-heading-add-another"
                        onClick={() => !this.state.membershipIsUsed ? this.addRemoveChildDiscount(index, "add", -1) : null}>
                        + {AppConstants.addChild}
                    </span>
                </div>

            case 4:
                return <div>
                    <InputWithHead heading={"Discount Type"} />
                    <Select
                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                        onChange={discountType => this.onChangeDiscountRefId(discountType, index)}
                        placeholder="Select"
                        value={item.discountTypeRefId}
                        disabled={this.state.membershipIsUsed}
                    >
                        {this.props.appState.commonDiscountTypes.map(item => {
                            return (
                                <Option key={"discountType" + item.id} value={item.id}>
                                    {item.description}
                                </Option>
                            );
                        })}
                    </Select>
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.percentageOff_FixedAmount}
                                placeholder={AppConstants.percentageOff_FixedAmount}
                                onChange={(e) => this.onChangePercentageOff(e.target.value, index)}
                                value={item.amount}
                                type="number"
                                disabled={this.state.membershipIsUsed}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.description}
                                placeholder={AppConstants.gernalDiscount}
                                onChange={(e) => this.onChangeDescription(e.target.value, index)}
                                value={item.description}
                                disabled={this.state.membershipIsUsed}
                            />
                        </div>
                    </div>

                    <div className="fluid-width">
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableFrom} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.onChangeDiscountAvailableFrom(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableFrom !== null && moment(item.availableFrom)}
                                    disabled={this.state.membershipIsUsed}
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead heading={AppConstants.availableTo} />
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    disabledDate={this.disabledDate}
                                    disabledTime={this.disabledTime}
                                    onChange={date => this.onChangeDiscountAvailableTo(date, index)}
                                    format={"DD-MM-YYYY"}
                                    showTime={false}
                                    value={item.availableTo !== null && moment(item.availableTo)}
                                    disabled={this.state.membershipIsUsed}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            case 5:
                return <div>
                    <InputWithHead
                        heading={AppConstants.description}
                        placeholder={AppConstants.description}
                        onChange={(e) => this.onChangeDescription(e.target.value, index)}
                        value={item.description}
                        disabled={this.state.membershipIsUsed}
                    />
                    <InputWithHead
                        heading={AppConstants.question}
                        placeholder={AppConstants.question}
                        onChange={(e) => this.onChangeQuestion(e.target.value, index)}
                        value={item.question}
                        disabled={this.state.membershipIsUsed}
                    />
                    <InputWithHead heading={"Apply Discount if Answer is Yes"} />
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.applyDiscountQuestionCheck(e.target.value, index)}
                        value={JSON.stringify(JSON.parse(item.applyDiscount))}
                        disabled={this.state.membershipIsUsed}
                    >
                        <Radio value={"1"}>{AppConstants.yes}</Radio>
                        <Radio value={"0"}>{AppConstants.no}</Radio>
                    </Radio.Group>
                </div>;
            default:
                return <div></div>;
        }
    }


    addRemoveChildDiscount = (index, keyWord, childindex) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        let childDisObject = {
            "membershipFeesChildDiscountId": 0,
            "percentageValue": ""
        }
        if (keyWord == "add") {
            if (isArrayNotEmpty(discountData[index].childDiscounts)) {
                discountData[index].childDiscounts.push(childDisObject)
            }
            else {
                discountData[index].childDiscounts = []
                discountData[index].childDiscounts.push(childDisObject)
            }
        }
        else if (keyWord == "delete") {
            if (isArrayNotEmpty(discountData[index].childDiscounts)) {
                discountData[index].childDiscounts.splice(childindex, 1)
            }
        }
        this.props.updatedDiscountDataAction(discountData)
        if (keyWord == "delete") {
            this.setFieldDecoratorValues()
        }
    }


    ////////onchange apply discount question radio button
    applyDiscountQuestionCheck = (applyDiscount, index) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].applyDiscount = applyDiscount
        this.props.updatedDiscountDataAction(discountData)
    }


    ///////child  onchange in discount section
    onChangeChildPercent = (childPercent, index, childindex, childItem) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].childDiscounts[childindex].percentageValue = childPercent
        discountData[index].childDiscounts[childindex].membershipFeesChildDiscountId = childItem.membershipFeesChildDiscountId
        this.props.updatedDiscountDataAction(discountData)
    }


    ///onchange question in case of custom discount
    onChangeQuestion = (question, index) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].question = question
        this.props.updatedDiscountDataAction(discountData)
    }

    ////add  or remove  discount in discount section
    addRemoveDiscount = (keyAction, index) => {
        this.props.addRemoveDiscountAction(keyAction, index)
    }

    //On change membership product discount type
    onChangeMembershipProductDisType = (discountType, index) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].membershipPrdTypeDiscountTypeRefId = discountType
        this.props.updatedDiscountDataAction(discountData)
        if (discountType == 3) {
            if (isArrayNotEmpty(discountData[index].childDiscounts) == false) {
                this.addRemoveChildDiscount(index, "add", -1)
            }
        }
    }

    //onChange membership type  discount
    onChangeMembershipTypeDiscount = (discountMembershipType, index) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].membershipProductTypeMappingId = discountMembershipType
        this.props.updatedDiscountDataAction(discountData)
    }
    /////onChange discount refId
    onChangeDiscountRefId = (discountType, index) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].discountTypeRefId = discountType
        this.props.updatedDiscountDataAction(discountData)
    }

    //////onchange discount code
    onChangeDiscountCode = (discountCode, index) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].discountCode = discountCode
        this.props.updatedDiscountDataAction(discountData)
    }

    ///onchange on text field percentage off
    onChangePercentageOff = (amount, index) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].amount = amount
        this.props.updatedDiscountDataAction(discountData)
    }

    /////onChange discount description
    onChangeDescription = (description, index) => {
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].description = description
        this.props.updatedDiscountDataAction(discountData)
    }

    ////discount available from on change
    onChangeDiscountAvailableFrom = (date, index) => {
        let fromDate = moment(date).format("YYYY-MM-DD")
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].availableFrom = fromDate
        this.props.updatedDiscountDataAction(discountData)
    }

    ////discount available to on change
    onChangeDiscountAvailableTo = (date, index) => {
        let toDate = moment(date).format("YYYY-MM-DD")
        let discountData = this.props.registrationState.membershipProductDiscountData.membershipProductDiscounts[0].discounts
        discountData[index].availableTo = toDate
        this.props.updatedDiscountDataAction(discountData)
    }


    ////discount view inside the content
    discountView = (getFieldDecorator) => {
        let data = this.props.registrationState.membershipProductDiscountData
        let discountData = data && data.membershipProductDiscounts !== null ? data.membershipProductDiscounts[0].discounts : []
        return (
            <div className="discount-view pt-5">
                <div className='row'>
                    <span className="form-heading">{AppConstants.discounts}</span>
                    <div style={{ marginTop: 5 }}>
                        <Tooltip background='#ff8237'>
                            <span>{AppConstants.membershipDiscountMsg}</span>
                        </Tooltip>
                    </div>
                </div>

                {discountData.map((item, index) => (
                    <div className="prod-reg-inside-container-view">
                        <div className="transfer-image-view pt-2"
                            onClick={() => !this.state.membershipIsUsed ? this.addRemoveDiscount("remove", index) : null}>
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                            <span className="user-remove-text mr-0">{AppConstants.remove}</span>
                        </div>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead required="pt-0" heading={"Discount Type"} />
                                <Form.Item  >
                                    {getFieldDecorator(`membershipPrdTypeDiscountTypeRefId${index}`,
                                        { rules: [{ required: true, message: ValidationConstants.pleaseSelectDiscountType }] })(
                                            <Select
                                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                                onChange={discountType => this.onChangeMembershipProductDisType(discountType, index)}
                                                placeholder="Select"
                                                // value={item.membershipPrdTypeDiscountTypeRefId !== 0 && item.membershipPrdTypeDiscountTypeRefId}
                                                disabled={this.state.membershipIsUsed}
                                            >
                                                {this.props.registrationState.membershipProductDiscountType.map((discountTypeItem, discountTypeIndex) => {
                                                    return (
                                                        <Option key={"disType" + discountTypeItem.id} value={discountTypeItem.id}>
                                                            {discountTypeItem.description}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                </Form.Item>
                            </div>
                            <div className="col-sm">
                                <InputWithHead
                                    required="pt-0"
                                    heading={AppConstants.membershipTypes}
                                />
                                <Form.Item  >
                                    {getFieldDecorator(`membershipProductTypeMappingId${index}`,
                                        { rules: [{ required: true, message: ValidationConstants.pleaseSelectMembershipTypes }] })(
                                            <Select
                                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                                onChange={discountMembershipType =>
                                                    this.onChangeMembershipTypeDiscount(discountMembershipType, index)
                                                }
                                                // defaultValue={item.membershipProductTypeMappingId}
                                                placeholder="Select"
                                                // value={item.membershipProductTypeMappingId}
                                                disabled={this.state.membershipIsUsed}
                                            >
                                                {this.state.discountMembershipTypeData.map(item => {
                                                    return (
                                                        <Option key={"product" + item} value={item.membershipProductTypeMappingId}>
                                                            {item.membershipProductTypeRefName}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                </Form.Item>
                            </div>
                        </div>
                        {this.discountViewChange(item, index, getFieldDecorator)}
                    </div>
                ))}
                < span className="input-heading-add-another"
                    onClick={() => !this.state.membershipIsUsed ? this.addRemoveDiscount("add", -1) : null}>
                    + {AppConstants.addDiscount}
                </span>
            </div >
        );
    };



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let tabKey = this.state.membershipTabKey
        let membershipProductId = this.props.registrationState.membershipProductId
        return (
            <div className="fluid-width">
                {!this.state.membershipIsUsed &&
                    <div className="footer-view">
                        <div className="row">
                            <div className="col-sm">
                                <div className="reg-add-save-button">
                                    {membershipProductId.length > 0 &&
                                        <Button type="cancel-button" onClick={() => this.showDeleteConfirm()}>{AppConstants.delete}</Button>
                                    }
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button className="save-draft-text" type="save-draft-text"
                                        htmlType="submit" onClick={() => this.setState({ statusRefId: 1, buttonPressed: "save" })}>
                                        {AppConstants.saveAsDraft}
                                    </Button>
                                    <Button className="publish-button" type="primary"
                                        htmlType="submit" onClick={() => this.setState({
                                            statusRefId: tabKey == "3" ? 2 : 1,
                                            buttonPressed: tabKey == "3" ? "publish" : "next"
                                        })}
                                    >
                                        {tabKey === "3"
                                            ? AppConstants.publish
                                            : AppConstants.next}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };

    tabCallBack = key => {
        let productId = this.props.registrationState.membershipProductId
        if (productId !== null && productId.length > 0) {
            this.setState({ membershipTabKey: key });
        }
        this.setFieldDecoratorValues()
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"6"} />
                <Layout>
                    <Form
                        onSubmit={this.saveMembershipProductDetails}
                        noValidate="noValidate"
                    >
                        {this.dropdownView(getFieldDecorator)}
                        <Content>
                            <div className="tab-view">
                                <Tabs
                                    activeKey={this.state.membershipTabKey}
                                    onChange={this.tabCallBack}
                                >
                                    <TabPane tab={AppConstants.membershipProduct} key="1">
                                        <div className="tab-formView mt-5">{this.contentView(getFieldDecorator)}</div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.fees} key="2">
                                        <div className="tab-formView">{this.feesView(getFieldDecorator)}</div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.discount} key="3">
                                        <div className="tab-formView">{this.discountView(getFieldDecorator)}</div>
                                    </TabPane>
                                </Tabs>
                            </div>
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
        regGetMembershipProductDetailsAction, regSaveMembershipProductDetailsAction,
        getOnlyYearListAction, getProductValidityListAction, regGetDefaultMembershipProductTypesAction,
        regSaveMembershipProductFeesAction, regSaveMembershipProductDiscountAction, getMembershipProductFeesTypeAction,
        membershipFeesTableInputChangeAction, getCommonDiscountTypeTypeAction, membershipProductDiscountTypesAction,
        addNewMembershipTypeAction, addRemoveDiscountAction, updatedDiscountDataAction,
        membershipFeesApplyRadioAction, onChangeAgeCheckBoxAction, updatedMembershipTypeDataAction,
        removeCustomMembershipTypeAction, regMembershipListDeleteAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        registrationState: state.RegistrationState,
        appState: state.AppState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(RegistrationMembershipFee));
