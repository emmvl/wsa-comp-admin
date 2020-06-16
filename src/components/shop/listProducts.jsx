import React, { Component } from "react";
import { Layout, Button, Breadcrumb, Input, Icon, Select } from 'antd';
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
import ShopSingleProductComponent from "../../customComponents/shopSingleProductComponent";

const { Footer, Content } = Layout;

const dummyProductListData = [{
    productName: "Vixens Warm Up Shirt",
    image: AppImages.product1,
    price: "$60.00",
    type: "Merchandise",
    size: [{
        sizeName: "Small",
        count: 5
    },
    {
        sizeName: "Medium",
        count: 10
    },
    {
        sizeName: "Large",
        count: 6
    }]
},
{
    productName: "Vixens Essential Tee",
    image: AppImages.product2,
    price: "$70.00",
    type: "Merchandise",
    size: [{
        sizeName: "Small",
        count: 5
    },
    {
        sizeName: "Medium",
        count: 10
    },
    {
        sizeName: "Large",
        count: 6
    }]
},
{
    productName: "Vixens Essential Tee",
    image: AppImages.product2,
    price: "$70.00",
    type: "Merchandise",
    size: [{
        sizeName: "Small",
        count: 5
    },
    {
        sizeName: "Medium",
        count: 10
    },
    {
        sizeName: "Large",
        count: 6
    }]
},
{
    productName: "Vixens Essential Tee",
    image: AppImages.product2,
    price: "$70.00",
    type: "Merchandise",
    size: [{
        sizeName: "Small",
        count: 5
    },
    {
        sizeName: "Medium",
        count: 10
    },
    {
        sizeName: "Large",
        count: 6
    }]
},
{
    productName: "Vixens Essential Tee",
    image: AppImages.product2,
    price: "$70.00",
    type: "Merchandise",
    size: [{
        sizeName: "Small",
        count: 5
    },
    {
        sizeName: "Medium",
        count: 10
    },
    {
        sizeName: "Large",
        count: 6
    }]
},
{
    productName: "Vixens Essential Tee",
    image: AppImages.product2,
    price: "$70.00",
    type: "Merchandise",
    size: [{
        sizeName: "Small",
        count: 5
    },
    {
        sizeName: "Medium",
        count: 10
    },
    {
        sizeName: "Large",
        count: 6
    }]
},


]
class ListProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }


    componentDidMount() {

    }

    ///////view for screen heading
    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div
                        className="col-sm"
                        style={{ display: "flex", alignContent: "center" }}
                    >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.products}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm" style={{ marginRight: "25px", display: "flex", alignItems: 'center',justifyContent:"flex-end" }} >
                            <div className="comp-product-search-inp-width" >
                                <Input className="product-reg-search-input"
                                    // onChange={(e) => this.onChangeSearchText(e)}
                                    placeholder="Search..."
                                    // onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                    prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                    // onClick={() => this.onClickSearchIcon()}
                                    />}
                                    allowClear
                                />
                            </div>
                        </div>
                </div>
            </div>
        );
    };

    ///dropdown view containing the search view and button
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="fluid-width">
                    <div className="row" >
                        <div className="col-sm">
                            <div className="com-year-select-heading-view">

                            </div>
                        </div>
                        {/* <div style={{ marginRight: "25px", display: "flex", alignItems: 'center' }} >
                            <div className="comp-product-search-inp-width" >
                                <Input className="product-reg-search-input"
                                    // onChange={(e) => this.onChangeSearchText(e)}
                                    placeholder="Search..."
                                    // onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                    prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                    // onClick={() => this.onClickSearchIcon()}
                                    />}
                                    allowClear
                                />
                            </div>
                        </div> */}

                        <div style={{ display: "flex", alignItems: 'center',justifyContent:"flex-end" }}>
                            <div className="d-flex flex-row-reverse button-with-search"
                            // onClick={() => this.props.clearCompReducerDataAction("all")}>
                            >
                                <NavLink
                                    to={{ pathname: `/addProduct` }}
                                    className="text-decoration-none"
                                >
                                <Button className="primary-add-product" type="primary">
                                    + {AppConstants.addAProduct}
                                </Button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    ////////content view of the screen
    contentView = () => {

        return (
            <div className="comp-dash-table-view mt-4">
                <div className="shop-product-content-div">
                    {dummyProductListData.length > 0 && dummyProductListData.map((item, index) => {
                        return (
                            <div>
                            <ShopSingleProductComponent
                                productItem={item}
                            />
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    };

    render() {

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch)
}

function mapStatetoProps(state) {
    return {


    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((ListProducts));
