import React from 'react';
import { Menu } from "antd";
import "./shopSingleProductComponent.css";
import AppImages from "../themes/appImages";
import { currencyFormat } from "../util/currencyFormat";
import { isArrayNotEmpty } from "../util/helpers";

const { SubMenu } = Menu;
class ShopSingleProductComponent extends React.Component {


    productItemPriceCheck = (productItem) => {
        let price = 0
        let variantOptions = isArrayNotEmpty(productItem.variants) ? productItem.variants[0].options : []
        if (isArrayNotEmpty(variantOptions)) {
            price = Math.min.apply(null, variantOptions.map(function (item) {
                return item.properties.price;
            }))
        } else {
            price = productItem.price
        }
        return currencyFormat(price)
    }

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
                            <Menu.Item onClick={this.props.editOnclick} >
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
                        name={'image'}
                        className="product-img"
                        onError={ev => {
                            ev.target.src = AppImages.squareImage;
                        }}
                    />
                </div>
                <div className="product-text-view">
                    <span className="product-name">{productItem.productName}</span>
                    <span className="product-price-text-style">{" From " + this.productItemPriceCheck(productItem)}</span>
                    <span className="product-type-grey-text">{productItem.type ? productItem.type : "N/A"}</span>
                    <div className="mt-3" >
                        {productItem && isArrayNotEmpty(productItem.variants) && productItem.variants.map((subItem, subIndex) => {
                            let optionCount = subItem ? subItem.options.length : 0
                            let checkOptionDisplayCount = optionCount <= 3 ? 2 : 1
                            return (
                                <div key={"productItemvariantOptions" + subIndex}>
                                    <>
                                        {subItem && isArrayNotEmpty(subItem.options) && subItem.options.map((subItemOption, subIndexOption) => {
                                            return (
                                                subIndexOption <= checkOptionDisplayCount && <div className="d-flex flex-row" key={"options" + subIndexOption}>
                                                    <div className="col-sm-3 pl-0" >
                                                        <span className="product-grey-detail-text">{subItemOption.optionName ? subItemOption.optionName : ""}</span>
                                                    </div>
                                                    <div className="col-sm-9">
                                                        <span className="product-grey-detail-text">{subItemOption.properties ? subItemOption.properties.quantity : ""}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {checkOptionDisplayCount === 1 && <span className="product-grey-detail-text">{"More..."}</span>}
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