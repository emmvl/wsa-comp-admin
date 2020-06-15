import React, { Component } from "react";
import { Layout, Button, Checkbox, Select, Breadcrumb, InputNumber } from 'antd';
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
import { testCall } from "../../store/actions/shopAction/addproductAction"
import InputWithHead from "../../customComponents/InputWithHead";
import { isArrayNotEmpty, captializedString } from "../../util/helpers";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML, } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { Header, Footer, Content } = Layout;
const { Option } = Select;



class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            value: ""
        }

    }


    componentDidMount() {
        this.props.testCall()
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
                            {AppConstants.productDetails}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };
    onChangeEditorData = (event) => {
        console.log(event, "event")
        // this.props.liveScoreUpdateNewsAction(event, "body")
    }
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    EditorView = () => {
        const { liveScoreNewsState } = this.props;
        const { editorState } = this.state;
        return (
            <div className="fluid-width mt-3" style={{ border: "1px solid rgb(212, 212, 212)", }}>
                <div className="livescore-editor-news col-sm">
                    <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        toolbarClassName="toolbar-class"
                        placeholder={AppConstants.description}
                        onChange={(e) => this.onChangeEditorData(e.blocks)}
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={{
                            inline: { inDropdown: true },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            history: { inDropdown: true },
                        }}
                    />
                </div>
            </div>
        )
    }

    ////////form content view
    contentView = () => {
        let typeArray = [{ id: 1, name: "Merchandise" }]
        let affiliateArray = [{ id: 1, name: "Direct" }, { id: 2, name: "1st Level Affiliate" }, { id: 3, name: "2nd Level Affiliate" }]
        return (
            <div className="content-view pt-4">

                <InputWithHead
                    required={"required-field "}
                    heading={AppConstants.title}
                    placeholder={AppConstants.enterTitle}
                    // name={AppConstants.description}
                    onChange={(e) => this.setState({ value: e.target.value })}
                    value={this.state.value}
                />
                <InputWithHead heading={AppConstants.description}
                />
                {this.EditorView()}

                <InputWithHead required="pt-5" heading={AppConstants.type} />
                <Select
                    style={{
                        width: '100%',
                        paddingRight: 1,
                        minWidth: 182,
                    }}
                    onChange={(value) => console.log("value")}
                    placeholder="Select"
                    value={1}
                >
                    {typeArray.map(
                        (item, index) => {
                            return (
                                <Option
                                    key={'type' + item.id}
                                    value={item.id}
                                >
                                    {item.name}
                                </Option>
                            );
                        }
                    )}
                </Select>

                <InputWithHead required="pb-0" heading={AppConstants.affiliates} />
                {affiliateArray.map((item, index) => {
                    return (
                        <div >
                            <Checkbox
                                className="single-checkbox mt-3"
                                checked={true}
                                onChange={(e) =>
                                    console.log(
                                        e.target.checked,
                                        index,
                                    )
                                }
                            >
                                {item.name}
                            </Checkbox>
                        </div>
                    );
                })}
            </div >
        );
    };

    ////////Image content view
    imageView = () => {
        return (
            <div className="fees-view pt-5">
                <span>Drag Files to Upload</span>
            </div >
        );
    };

    ////////pricing content view
    pricingView = () => {
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.pricing}</span>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.price}
                                placeholder={AppConstants.price}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.costPerItem}
                                placeholder={AppConstants.costPerItem}
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={true}
                        >
                            {AppConstants.chargeTaxesOnProduct}
                        </Checkbox>
                    </div>
                </div>
            </div >
        );
    };



    ////////Inventory content view
    inventoryView = () => {
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.inventory}</span>
                <div className="fluid-width">
                    <div >
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={true}
                        >
                            {AppConstants.enableInventoryTracking}
                        </Checkbox>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.skuHeader}
                                placeholder={AppConstants.SKU}
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.barcodeHeading}
                                placeholder={AppConstants.barcode}
                            />
                        </div>
                    </div>
                    <div >
                        <span className="input-heading" >{AppConstants.quantity}</span>
                        <InputNumber
                            style={{ width: 70, }}
                            // value={addEditMatch.matchDuration}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(matchDuration) => console.log(matchDuration)}
                            placeholder={'0'}
                            min={0}
                        />
                    </div>
                    <div className="pt-4">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={true}
                        >
                            {AppConstants.allowCustToPurchase}
                        </Checkbox>
                    </div>

                </div>
            </div >
        );
    };

    ////////Varients content view
    varientsView = () => {
        return (

            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.varients}</span>
                <div className="fluid-width">
                    <div >
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={true}
                        >
                            {AppConstants.enableVarients}
                        </Checkbox>
                    </div>


                </div>
            </div >
        );
    };


    ////////Shipping content view
    shippingView = () => {
        return (
            <div className="fees-view pt-5">
                <span>Shipping</span>
            </div >
        );
    };

    render() {

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"2"} />
                <Layout>

                    <Content className="comp-dash-table-view">
                        {this.headerView()}
                        <div className="formView">{this.contentView()}</div>
                        <div className="formView">{this.imageView()}</div>
                        <div className="formView">{this.pricingView()}</div>
                        <div className="formView">{this.inventoryView()}</div>
                        <div className="formView">{this.varientsView()}</div>
                        <div className="formView">{this.shippingView()}</div>
                    </Content>

                    {/* <Loader
                        visible={this.props.appState.onLoad} /> */}
                    <Footer></Footer>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        testCall
    }, dispatch)
}

function mapStatetoProps(state) {
    return {


    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((AddProduct));
