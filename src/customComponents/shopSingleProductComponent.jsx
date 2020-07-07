import React from 'react';
import { Menu } from "antd";
import "./shopSingleProductComponent.css";
import AppImages from "../themes/appImages";
import { currencyFormat } from "../util/currencyFormat";
import { isArrayNotEmpty } from "../util/helpers";

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
                        src={isArrayNotEmpty(productItem.images) ? productItem.images[0].url : AppImages.squareImage}
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
                    <span className="product-grey-detail-text">{productItem.type}</span>
                    <div className="mt-4" >
                        {productItem && isArrayNotEmpty(productItem.variantOptions) && productItem.variantOptions.map((subItem, subIndex) => {
                            console.log("subItem", subItem)
                            return (
                                <div key={"productItemvariantOptions" + subIndex}>
                                    <div key={"variantOptions" + subIndex}>
                                        <span className="product-name">{subItem.variantName ? subItem.variantName : ""}</span>
                                    </div>
                                    <>
                                        {subItem && isArrayNotEmpty(subItem.options) && subItem.options.map((subItemOption, subIndexOption) => {
                                            return (
                                                <div className="d-flex flex-row" key={"options" + subIndexOption}>
                                                    <div className="col-sm-3 pl-0" >
                                                        <span className="product-grey-detail-text">{subItemOption.optionName ? subItemOption.optionName : ""}</span>
                                                    </div>
                                                    <div className="col-sm-9">
                                                        <span className="product-grey-detail-text">{subItemOption.SKU ? subItemOption.SKU.quantity : ""}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        )
    }
}


export default ShopSingleProductComponent;