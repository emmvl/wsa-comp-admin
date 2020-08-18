import React, { Component } from "react";
import { Layout, Button, Checkbox, Select, Breadcrumb, InputNumber, Form, Modal, message } from 'antd';
import './shop.css';
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import history from "../../util/history";
import InputWithHead from "../../customComponents/InputWithHead";
import { isArrayNotEmpty, isNotNullOrEmptyString } from "../../util/helpers";
import { getOrderDetailsAction } from '../../store/actions/shopAction/orderStatusAction';
import { currencyFormat } from "../../util/currencyFormat";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;

const orderFulfilmentData = [
    { name: "To Be Sent", value: "To Be Sent" },
    { name: "In Transit", value: "In Transit" },
    { name: "Complete", value: "Complete" },
    { name: "Awaiting Pick Up", value: "Awaiting Pick Up" },
    { name: "Picked Up", value: "Picked Up" }
]
class OrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    componentDidMount() {
        window.scrollTo(0, 0)
        this.apiCalls();
    }

    apiCalls = () => {
        let orderId = null;
        orderId = this.props.location.state
            ? this.props.location.state.orderId
            : null;
        if (orderId) {
            this.props.getOrderDetailsAction(orderId)
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header
                    className="form-header-view header-transaparent"
                >
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.orderDetails}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    ////////form content view
    contentView = (getFieldDecorator) => {
        let dataDummy = [1, 2]
        return (
            <div className="content-view pt-4">
                <span className="form-heading">{AppConstants.order + " # " + "12311"}</span>
                {
                    dataDummy.map((item) => {
                        return (
                            <div className="row mt-4">
                                <div className="col-sm d-flex justify-content-center align-items-center w-25">
                                    <img
                                        src={AppImages.squareImage}
                                        className="order-details-product-image"
                                        name={'image'}
                                        onError={ev => {
                                            ev.target.src = AppImages.squareImage;
                                        }}
                                    />
                                </div>
                                <div className="col-sm d-flex justify-content-start align-items-center w-55">
                                    <div style={{ flexDirection: "column" }}>
                                        <span className="order-details-desc-text" style={{ lineHeight: 1.54 }}>{"Firebirds Jumper - Small"}</span>
                                        <span className="order-details-desc-text" style={{ lineHeight: 1.54 }}>{"SKU: " + "188988"}</span>
                                    </div>
                                </div>
                                <div className="col-sm d-flex justify-content-center align-items-center w-20">
                                    <span className="order-details-desc-text">{"1" + "x"}</span>
                                    <span className="order-details-desc-text">{currencyFormat("25")}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div >
        );
    };

    ////////billing and address view
    addressView = (getFieldDecorator) => {
        return (
            <div className="fees-view pt-4">
                <div className="row">
                    <div className="col-sm">
                        <span className="form-heading">{AppConstants.shippingAndBillingAddress}</span>
                    </div>
                    <div className="col-sm d-flex justify-content-end">
                        <Button className="open-reg-button" type="primary" style={{ height: 30, borderRadius: 5 }}>
                            {AppConstants.edit}
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm">
                        <span className="order-details-desc-text">{"Sam Obrien"}</span>
                        <span className="order-details-desc-text">{"Unit 6/5 livingstone place"}</span>
                        <span className="order-details-desc-text">{"Newport 2106"}</span>
                        <span className="order-details-desc-text">{"NSW"}</span>
                        <div className="live-score-title-icon-view">
                            <div className="order-details-desc-text">
                                <span>{AppConstants.receiptUrl + ":"}</span>
                            </div>
                            <span className="order-details-desc-text ml-3">{"www.receipt.com"}</span>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.callAnswer} alt="" height="16" width="16" />
                            </div>
                            <span className='order-details-desc-text ml-3'>{"+61 401379517"}</span>
                        </div>
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.email} alt="" height="16" width="16" />
                            </div>
                            <span className='order-details-desc-text ml-3'>{"sam@worldsportaction.com"}</span>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    ////////order fulfilment view view
    fulfilmentView = (getFieldDecorator) => {
        return (
            <div className="fees-view pt-4">
                <span className="form-heading">{AppConstants.orderFulfilment}</span>
                <Select
                    className="shop-type-select mt-2"
                    onChange={(value) =>
                        console.log("value", value)
                    }
                    placeholder="Select"
                >
                    {orderFulfilmentData.map(
                        (item, index) => {
                            return (
                                <Option
                                    key={'orderFulfilmentData' + item.value + index}
                                    value={item.value}
                                >
                                    {item.name}
                                </Option>
                            );
                        }
                    )}
                </Select>
            </div >
        );
    };

    //////footer view containing all the buttons 
    footerView = () => {
        return (
            <div className="footer-view">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            {/* <Button
                                className="cancelBtnWidth"
                                type="cancel-button"
                                onClick={() => history.push('/listProducts')}>{AppConstants.cancel}</Button> */}
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button className="open-reg-button" type="primary"
                                htmlType="submit">
                                {AppConstants.capturePayment}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width">
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"5"} />
                <Layout>
                    <Form
                        autoComplete='off'
                        // onSubmit={this.addProductPostAPI}
                        noValidate="noValidate">
                        <Content >
                            {this.headerView()}
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                            <div className="formView">{this.addressView(getFieldDecorator)}</div>
                            <div className="formView">{this.fulfilmentView(getFieldDecorator)}</div>
                        </Content>

                        {/* <Loader
                            visible={this.props.shopOrderStatusState.onLoad} /> */}
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOrderDetailsAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        shopOrderStatusState: state.ShopOrderStatusState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(OrderDetails));