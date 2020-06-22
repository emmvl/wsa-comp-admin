import React from 'react';
import { Menu } from "antd";
import "./shopSingleProductComponent.css";
import AppImages from "../themes/appImages";
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
                    <span className="product-price-text-style">{productItem.price}</span>
                    <span className="product-grey-detail-text">{productItem.type}</span>


                    <div className="mt-4" >
                        {productItem && productItem.size.length > 0 && productItem.size.map((subItem, index) => {
                            return (
                                <div className="d-flex flex-row">
                                    <div className="col-sm-3 pl-0" >
                                        <span className="product-grey-detail-text">{subItem.sizeName}</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span className="product-grey-detail-text">{subItem.count}</span>
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