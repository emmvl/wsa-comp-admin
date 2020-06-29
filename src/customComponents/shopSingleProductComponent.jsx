import React from 'react';
import { Menu } from "antd";
import "./shopSingleProductComponent.css";
import AppImages from "../themes/appImages";
import { currencyFormat } from "../util/currencyFormat";

const { SubMenu } = Menu;
class ShopSingleProductComponent extends React.Component {

    render() {
        const { productItem } = this.props
        return (
            <div className="shop-single-prd-main-view mt-3" >
                <div className="product-menu-option-view">
                    <Menu
                        className="action-triple-dot-submenu"
                        theme="light"
                        mode="horizontal"
                        style={{ lineHeight: "25px" }}
                    >
                        <SubMenu
                            key="sub1"
                            style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                            title={
                                <img
                                    className="dot-image"
                                    src={AppImages.moreTripleDot}
                                    alt=""
                                    width="13"
                                    height="13"
                                />
                            }
                        >
                            <Menu.Item >
                                <span>Edit</span>
                            </Menu.Item>
                            <Menu.Item onClick={this.props.deleteOnclick} >
                                <span>Delete</span>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="product-img-view">
                    <img
                        src={productItem.image}
                        height="150"
                        width="150"
                        name={'image'}
                        onError={ev => {
                            ev.target.src = AppImages.squareImage;
                        }}
                    />
                </div>
                <div className="product-text-view">
                    <span className="product-name">{productItem.productName}</span>
                    <span className="product-price-text-style">{productItem.price ? currencyFormat(productItem.price) : "N/A"}</span>
                    {productItem && productItem.types.length > 0 && productItem.types.map((subItem, subIndex) => {
                        return (
                            <span key={"types" + subIndex} className="product-grey-detail-text">{subItem}</span>
                        )
                    })}

                    <div className="mt-4" >
                        {productItem && productItem.variantOptions.length > 0 && productItem.variantOptions.map((subItem, subIndex) => {
                            return (
                                <div className="d-flex flex-row" key={"variantOptions" + subIndex}>
                                    <div className="col-sm-3 pl-0" >
                                        <span className="product-grey-detail-text">{subItem.option.optionName}</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span className="product-grey-detail-text">{subItem.option.quantity}</span>
                                    </div>
                                </div>)
                        })}
                    </div>
                </div>
            </div>
        )
    }
}


export default ShopSingleProductComponent;