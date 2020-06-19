import React, { Component } from "react";
import { Layout, Select, Breadcrumb, } from 'antd';
import './shop.css';
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InputWithHead from "../../customComponents/InputWithHead";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class ShopSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
    }
    componentDidMount() {

    }

    ///////view for breadcrumb
    headerView = () => {
        let isEdit = this.props.location.state ? this.props.location.state.isEdit : null
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
                    <Breadcrumb separator=">">
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
        let stateList = [{
            id: 1, name: "add venue"
        }]
        return (
            <div className="content-view pt-4">
                <span className="form-heading">{AppConstants.pickUpAddress}</span>
                <InputWithHead
                    required={"required-field "}
                    heading={AppConstants.address}
                    placeholder={AppConstants.address}
                    // name={AppConstants.description}
                    onChange={(e) => this.setState({ value: e.target.value })}
                    value={this.state.value}
                />
                <InputWithHead
                    required={"required-field "}
                    heading={AppConstants.suburb}
                    placeholder={AppConstants.suburb}
                    // name={AppConstants.description}
                    onChange={(e) => this.setState({ suburb: e.target.value })}
                    value={this.state.suburb}
                />
                <InputWithHead
                    heading={AppConstants.stateHeading}
                />
                <Select
                    style={{ width: "100%" }}
                    placeholder={AppConstants.select}
                // onChange={(stateRefId) => this.props.updateVenuAndTimeDataAction(stateRefId, 'Venue', 'stateRefId')}
                >
                    {stateList.length > 0 && stateList.map((item) => (
                        < Option key={item.id} value={item.id}> {item.name}</Option>
                    ))
                    }
                </Select>
                <InputWithHead
                    required={"required-field "}
                    heading={AppConstants.postCode}
                    placeholder={AppConstants.postcode}
                    // name={AppConstants.description}
                    onChange={(e) => this.setState({ postCode: e.target.value })}
                    value={this.state.postCode}
                />
            </div >
        );
    };
    productTypes = () => {
        let product = [{
            id: 1, name: "T-Shirt"
        }]
        return (
            <div className="discount-view pt-5">
                <span className="form-heading">{AppConstants.productTypes}</span>
                <div className="row">
                    <div className=" col-sm width-95">
                        <Select
                            style={{ width: "100%" }}
                            placeholder={AppConstants.select}
                        // onChange={(stateRefId) => this.props.updateVenuAndTimeDataAction(stateRefId, 'Venue', 'stateRefId')}
                        >

                            {product.length > 0 && product.map((item) => (
                                < Option key={item.id} value={item.id}> {item.name}</Option>
                            ))
                            }
                        </Select>
                    </div>
                    <div className="width-5" >
                        <span className='user-remove-btn pl-2'
                            style={{ cursor: 'pointer', }}>
                            <img
                                className="dot-image"
                                src={AppImages.redCross}
                                alt=""
                                width="16"
                                height="16"
                            // onClick={() => this.addTimeManualPerVenue(timeIndex, venueIndex, "removeTimeSlotManualPerVenue", index)}
                            />
                        </span>
                    </div>
                </div>
                <span style={{ cursor: 'pointer' }}
                    className="input-heading-add-another">
                    + {AppConstants.addType}
                </span>
            </div >
        );
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"4"} />
                <Layout>
                    <Content className="comp-dash-table-view">
                        {this.headerView()}
                        <div className="formView">{this.contentView()}</div>
                        <div className="formView">{this.productTypes()}</div>
                    </Content>
                    <Footer>

                    </Footer>
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
export default connect(mapStatetoProps, mapDispatchToProps)((ShopSettings));
