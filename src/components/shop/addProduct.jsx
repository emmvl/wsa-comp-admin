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
import {
    addProductAction,
    onChangeProductDetails,
    getTypesOfProductAction,
    addNewTypeAction,
    deleteProductVariantAction,
    getProductDetailsByIdAction,
    clearProductReducer,
} from "../../store/actions/shopAction/productAction"
import InputWithHead from "../../customComponents/InputWithHead";
import { isArrayNotEmpty, isNotNullOrEmptyString, captializedString } from "../../util/helpers";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML, } from 'draft-js';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import SortableImage from '../../customComponents/sortableImageComponent';
import ValidationConstants from '../../themes/validationConstant';
import { checkOrganisationLevel } from "../../util/permissions";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            value: "",
            fileNames: [],
            isDrag: false,
            files: [],
            urls: [],
            isDragging: false,
            newProductType: "",
            visible: false,
            loading: false,
            getLoad: false,
            orgLevel: AppConstants.state,
        }
        props.clearProductReducer("productDetailData")
    }


    componentDidMount() {
        this.apiCalls();
        this.setDetailsFieldValue();
        this.setEditorFieldValue();
        checkOrganisationLevel().then((value) => (
            this.setState({ orgLevel: value })
        ))
    }

    apiCalls = () => {
        this.props.getTypesOfProductAction()
        let productId = null
        productId = this.props.location.state ? this.props.location.state.id : null
        if (productId) {
            this.props.getProductDetailsByIdAction(productId)
            this.setState({ getLoad: true })
        }
    }

    componentDidUpdate(nextProps) {
        let shopProductState = this.props.shopProductState;
        if (shopProductState.onLoad === false && this.state.loading === true) {
            this.setState({ loading: false });
            if (!shopProductState.error) {
                history.push('/listProducts');
            }
        }
        if (shopProductState.getDetailsLoad === false && this.state.getLoad === true) {
            let imageUrls = shopProductState.imageUrls
            this.setDetailsFieldValue();
            this.setEditorFieldValue();
            this.setState({ getLoad: false, urls: imageUrls });
        }
    }

    //////post the product details
    addProductPostAPI = (e) => {
        e.preventDefault();
        let { productDetailData } = JSON.parse(JSON.stringify(this.props.shopProductState));
        let description = JSON.parse(JSON.stringify(productDetailData.description))
        let descriptionText = ""
        if (description) {
            let descriptionStringArr = []
            for (let i in description) {
                descriptionStringArr.push(description[i].text)
            }
            descriptionText = descriptionStringArr.join(`<br/>`)
        }
        productDetailData.description = descriptionText
        let { urls, files } = this.state
        let imagesFiles = []
        for (let i in urls) {
            for (let j in files) {
                if (urls[i].id == files[j].id) {
                    imagesFiles.push(files[j].fileObject)
                }
            }
        }
        if (productDetailData.variantsChecked === false) {
            productDetailData.variants = []
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let formData = new FormData();
                formData.append('params', JSON.stringify(productDetailData));
                if (isArrayNotEmpty(imagesFiles)) {
                    for (let i in imagesFiles)
                        formData.append("productPhotos", imagesFiles[i])
                }
                let affiliates = productDetailData.affiliates
                let affiliatesNotSelected = Object.keys(affiliates).every(k => affiliates[k] === 0);
                if (affiliatesNotSelected) {
                    message.error(ValidationConstants.pleaseSelectAffiliate);
                } else {
                    this.props.addProductAction(formData);
                    this.setState({ loading: true });
                }
            }
        })
    }

    setDetailsFieldValue() {
        let { productDetailData } = this.props.shopProductState;
        this.props.form.setFieldsValue({
            productName: productDetailData.productName,
        });
        if (productDetailData.deliveryType === "shipping") {
            this.props.form.setFieldsValue({
                width: productDetailData.width,
                length: productDetailData.length,
                height: productDetailData.height,
                weight: productDetailData.weight,
            });
        }
        let variants = productDetailData.variants
        if (productDetailData.variantsChecked === true) {
            variants.length > 0 &&
                variants.map((item, index) => {
                    let variantName = `variants${index}name`;
                    this.props.form.setFieldsValue({
                        [variantName]: item.name
                    });
                })
        }
    }


    setEditorFieldValue() {
        let { productDetailData } = this.props.shopProductState;
        let body = isNotNullOrEmptyString(productDetailData.description) ? EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(productDetailData.description))) : ""
        this.setState({ editorState: body })
    }


    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    handleOk = e => {
        if (this.state.newProductType.length > 0) {
            this.props.addNewTypeAction(this.state.newProductType)
        }
        this.setState({
            visible: false,
            newProductType: "",
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
            newProductType: ""
        });
    };

    ///add another product type
    addAnotherProductType = () => {
        this.setState({ visible: true })
    }

    ////affiliateOnChange checkbox
    affiliateOnChange = (value, name) => {
        let { productDetailData } = this.props.shopProductState
        let affiliatePostObject = productDetailData.affiliates
        let assignedValue = value == true ? 1 : 0
        if (name === "Direct") {
            affiliatePostObject.direct = assignedValue
        }
        if (name === "1st Level Affiliates - Association/ League") {
            affiliatePostObject.firstLevel = assignedValue
        }
        if (name === "2nd Level Affiliates - Club/School") {
            affiliatePostObject.secondLevel = assignedValue
        }
        this.props.onChangeProductDetails(affiliatePostObject, 'affiliates')
    }

    /////for displaying checked or not checked in affiliate
    checkedAffiliates = (name) => {
        let { productDetailData } = this.props.shopProductState
        let affiliate = productDetailData.affiliates
        if (name === "Direct") {
            return affiliate.direct
        }
        if (name === "1st Level Affiliates - Association/ League") {
            return affiliate.firstLevel
        }
        if (name === "2nd Level Affiliates - Club/School") {
            return affiliate.secondLevel
        }
    }

    handleDrags = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            ...this.state,
            isDragging: true
        });
    }

    handleDragEnter = (e) => {
        this.handleDrags(e);
    }

    handleDragOver = (e) => {
        this.handleDrags(e);
    }

    handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            ...this.state,
            isDragging: false
        });
    }

    onChange = (e) => {
        e.preventDefault()
        let files = e.target.files;
        [].forEach.call(files, this.handleFiles);
    }

    handleDrop = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const data = e.dataTransfer;
        const files = data.files;
        [].forEach.call(files, this.handleFiles);
        this.setState({
            ...this.state,
            isDragging: false
        });
    }

    handleFiles = (file) => {
        let fileTypes = ['jpg', 'jpeg', 'png'];
        if (file) {
            let extension = file.name.split('.').pop().toLowerCase();
            let isSuccess = fileTypes.indexOf(extension) > -1;
            if (isSuccess) {
                let reader = new FileReader();
                reader.onloadend = () => {
                    let imageUrl = window.URL.createObjectURL(file);
                    let id = Math.random()
                    if (imageUrl) {
                        this.setState({
                            files: [...this.state.files, { fileObject: file, id }],
                            urls: [...this.state.urls, { image: imageUrl, id }]
                        });
                    }
                }
                reader.readAsDataURL(file);
            }
        }
    }

    getImage = () => (
        <>
            <input type="file"
                id="getImage"
                style={{ display: 'none' }}
                onChange={(e) => this.onChange(e)}
                accept="image/*"
            />
            <Button
                onClick={(e) => { document.getElementById('getImage').click(); e.stopPropagation() }}
                className="primary-add-product mt-2"
                type="primary">
                {AppConstants.uploadImage}
            </Button>
        </>
    )

    ///////on change varients name 
    onVariantNameChange = (value) => {
        let varientNameIndex = 0
        this.props.onChangeProductDetails(value, 'variantName', varientNameIndex)
    }

    onChangeVariantsCheckBox = async (e) => {
        await this.props.onChangeProductDetails(
            e.target.checked,
            'variantsChecked'
        );
        this.setDetailsFieldValue();
    }

    ///////on change varients name 
    onVariantOptionOnChange = (value, key, index, subIndex) => {
        let { productDetailData } = this.props.shopProductState
        let varientOptions = productDetailData.variants[index].options
        let varientOptionObject = varientOptions[subIndex]
        switch (key) {
            case "optionName":
                varientOptionObject.optionName = value
                break;
            case "price":
                varientOptionObject.properties.price = value
                break;
            case "cost":
                varientOptionObject.properties.cost = value
                break;
            case "skuCode":
                varientOptionObject.properties.skuCode = value
                break;
            case "barcode":
                varientOptionObject.properties.barcode = value
                break;
            case "quantity":
                varientOptionObject.properties.quantity = value
                break;
            default:
                break;
        }
        varientOptions[subIndex] = varientOptionObject
        this.props.onChangeProductDetails(varientOptions, 'variantOption', index)
    }


    //////delete the product variant
    showDeleteConfirm = (optionId, index, subIndex) => {
        let this_ = this
        confirm({
            title: AppConstants.deleteProduct,
            content: AppConstants.deleteProductDescription,
            okText: 'Confirm',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                if (optionId) {
                    if (optionId > 0) {
                        this_.props.deleteProductVariantAction(optionId, index, subIndex)
                    }
                }
                else {
                    let varientOptions = this_.props.shopProductState.productDetailData.variants[index].options
                    varientOptions.splice(subIndex, 1)
                    this_.props.onChangeProductDetails(varientOptions, 'variantOption', index)
                }
            },
            onCancel() {
            },
        });
    }

    ///////add new varient option
    addVariantOption = (index, subIndex, key, optionId) => {
        let varientOptionObject = {
            "optionName": "",
            "properties": {
                "price": 0,
                "SKU": "",
                "barcode": "",
                "quantity": 0,
                "id": 0
            }
        }
        let { productDetailData } = this.props.shopProductState
        let varientOptions = productDetailData.variants[index].options
        if (key === "add") {
            varientOptions.push(varientOptionObject)
        }
        if (key === "remove") {
            this.showDeleteConfirm(optionId, index, subIndex)
            // varientOptions.splice(subIndex, 1)
        }
        this.props.onChangeProductDetails(varientOptions, 'variantOption', index)

    }





    onChangeShippingCheckBox = async (e) => {
        await this.props.onChangeProductDetails(
            e.target.checked == true ? "shipping" : "",
            'deliveryType'
        );
        this.setDetailsFieldValue();
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
                            {AppConstants.productDetails}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    editorView = () => {
        const { editorState } = this.state;
        return (
            <div className="fluid-width mt-3 shop-decription-editor-main-div">
                <div className="livescore-editor-news col-sm">
                    <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        toolbarClassName="toolbar-class"
                        placeholder={AppConstants.description}
                        onChange={(e) =>
                            this.props.onChangeProductDetails(
                                e.blocks,
                                'description'
                            )
                        }
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
    contentView = (getFieldDecorator) => {
        let { productDetailData, typesProductList } = this.props.shopProductState
        console.log("productDetailData", productDetailData)
        let affiliateArray = [
            { id: 1, name: "Direct" },
            { id: 2, name: "1st Level Affiliates - Association/ League" },
            { id: 3, name: "2nd Level Affiliates - Club/School" }
        ]
        return (
            <div className="content-view pt-4">
                <Form.Item>
                    {getFieldDecorator(
                        `productName`,
                        {
                            rules: [
                                {
                                    required: true,
                                    message:
                                        ValidationConstants.enterTitleOfTheProduct,
                                },
                            ],
                        }
                    )(
                        <InputWithHead
                            required={"required-field "}
                            heading={AppConstants.title}
                            placeholder={AppConstants.enterTitle}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    captializedString(e.target.value),
                                    'productName'
                                )
                            }
                            onBlur={(i) => this.props.form.setFieldsValue({
                                'productName': captializedString(i.target.value)
                            })}
                        />
                    )}
                </Form.Item>

                <InputWithHead heading={AppConstants.description}
                />
                {this.editorView()}

                <InputWithHead required="pt-5" heading={AppConstants.type} />
                <Select
                    className="shop-type-select"
                    onChange={(value) =>
                        this.props.onChangeProductDetails(
                            value,
                            'typeOnChange'
                        )
                    }
                    placeholder="Select"
                    value={isNotNullOrEmptyString(productDetailData.type.typeName) ? productDetailData.type.id : []}
                >
                    {isArrayNotEmpty(typesProductList) && typesProductList.map(
                        (item, index) => {
                            return (
                                <Option
                                    key={'type' + item.id + index}
                                    value={item.id}
                                >
                                    {item.typeName}
                                </Option>
                            );
                        }
                    )}
                </Select>
                {
                    this.state.orgLevel == "state" &&
                    <span className="input-heading-add-another" onClick={this.addAnotherProductType}>+{AppConstants.addType}</span>
                }
                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.addType}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <InputWithHead
                        required={"pt-0 mt-0"}
                        heading={AppConstants.addType}
                        placeholder={ValidationConstants.pleaseEnterProductType}
                        onChange={(e) => this.setState({ newProductType: e.target.value })}
                        value={this.state.newProductType}
                    />

                </Modal>
                <InputWithHead required="pb-0" heading={AppConstants.affiliates} />
                {affiliateArray.map((item, index) => {
                    return (
                        <div key={"affiliateArray" + index} >
                            <Checkbox
                                className="single-checkbox mt-3"
                                checked={this.checkedAffiliates(item.name) === 1 ? true : false}
                                disabled={this.state.orgLevel == "Club" && item.id == 2 ? true : false}
                                onChange={(e) =>
                                    this.affiliateOnChange(e.target.checked, item.name)
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
        const { urls, files, isDragging } = this.state;
        const dropCss = urls.length > 0 ? "dragDropLeft" : "dragDropCenter";
        const dropClass = isDragging ? `${dropCss} dragging` : dropCss;
        return (
            <div>
                <div className="fees-view pt-5">
                    <div
                        className={dropClass}
                        onDrop={this.handleDrop}
                        onDragOver={this.handleDragOver}
                        onDragEnter={this.handleDragEnter}
                        onDragLeave={this.handleDragLeave}
                        onClick={(e) => { urls.length == 0 && document.getElementById('getImage').click(); e.stopPropagation() }}
                    >
                        <>
                            {
                                urls.length > 0 ?
                                    <SortableImage images={urls} reorderedUrls={(data) => this.setState({ urls: data })} /> :
                                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 180 }}>
                                        <InputWithHead heading={AppConstants.dragImageToUpload} />
                                        <div className="d-flex justify-content-center" style={{ width: '100%' }}>
                                            {this.getImage()}
                                        </div>
                                    </div>
                            }
                        </>
                    </div>
                    {urls.length > 0 ?
                        < div className="d-flex justify-content-end" style={{ width: '100%' }}>
                            {this.getImage()}
                        </div> : ''
                    }
                </div>
            </div >
        );

    };

    ////////pricing content view
    pricingView = (getFieldDecorator) => {
        let { productDetailData } = this.props.shopProductState
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.pricing}</span>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.price}
                                placeholder={AppConstants.price}
                                prefix="$"
                                onChange={(e) =>
                                    this.props.onChangeProductDetails(
                                        e.target.value,
                                        'price'
                                    )
                                }
                                value={productDetailData.price}
                                type="number"
                            />
                        </div>
                        <div className="col-sm">
                            <InputWithHead
                                heading={AppConstants.costPerItem}
                                placeholder={AppConstants.costPerItem}
                                prefix="$"
                                onChange={(e) =>
                                    this.props.onChangeProductDetails(
                                        e.target.value,
                                        'cost'
                                    )
                                }
                                value={productDetailData.cost}
                                type="number"
                            />
                        </div>
                    </div>
                    <div className="pt-5">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={productDetailData.taxApplicable}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.checked,
                                    'taxApplicable'
                                )
                            }
                        >
                            {AppConstants.chargeTaxesOnProduct}
                        </Checkbox>
                    </div>
                    {productDetailData.taxApplicable === true &&
                        <InputWithHead
                            heading={AppConstants.tax}
                            placeholder={AppConstants.tax}
                            prefix="$"
                            disabled={true}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.value,
                                    'tax'
                                )
                            }
                            value={productDetailData.tax}
                            type="number"
                        />}
                </div>
            </div >
        );
    };


    ////////Inventory content view
    inventoryView = (getFieldDecorator) => {
        let { productDetailData } = this.props.shopProductState
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.inventory}</span>
                <div className="fluid-width">
                    <div className="pt-4">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={productDetailData.invetoryTracking}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.checked,
                                    'invetoryTracking'
                                )
                            }
                        >
                            {AppConstants.enableInventoryTracking}
                        </Checkbox>
                    </div>
                    {productDetailData.invetoryTracking && <>
                        <div className="row">
                            <div className="col-sm">
                                <InputWithHead
                                    heading={AppConstants.skuHeader}
                                    placeholder={AppConstants.StockKeepingUnit}
                                    onChange={(e) =>
                                        this.props.onChangeProductDetails(
                                            e.target.value,
                                            'skuCode'
                                        )
                                    }
                                    value={productDetailData.skuCode}
                                />
                            </div>
                            <div className="col-sm">
                                <InputWithHead
                                    heading={AppConstants.barcodeHeading}
                                    placeholder={AppConstants.barcode}
                                    onChange={(e) =>
                                        this.props.onChangeProductDetails(
                                            e.target.value,
                                            'barcode'
                                        )
                                    }
                                    value={productDetailData.barcode}
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
                                onChange={(quantity) => this.props.onChangeProductDetails(
                                    quantity,
                                    'quantity'
                                )}
                                placeholder={'0'}
                                min={0}
                                value={productDetailData.quantity}
                                type="number"
                            />
                        </div>
                    </>}
                    <div className="pt-5">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={productDetailData.availableIfOutOfStock === 1 ? true : false}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.checked === true ? 1 : 0,
                                    'availableIfOutOfStock'
                                )
                            }
                        >
                            {AppConstants.allowCustToPurchase}
                        </Checkbox>
                    </div>

                </div>
            </div >
        );
    };

    ////////Variants content view
    variantsView = (getFieldDecorator) => {
        let { productDetailData } = this.props.shopProductState
        let varientOptionArray = isArrayNotEmpty(productDetailData.variants) ? productDetailData.variants[0].options : []
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.variants}</span>
                <div className="fluid-width">
                    <div className="pt-4">
                        <Checkbox
                            className="single-checkbox mt-0"
                            checked={productDetailData.variantsChecked}
                            onChange={(e) => this.onChangeVariantsCheckBox(e)}
                        >
                            {AppConstants.enableVariants}
                        </Checkbox>
                    </div>
                    {productDetailData.variantsChecked === true && <>
                        <div className="row">
                            <div className="col-sm-5">
                                <Form.Item>
                                    {getFieldDecorator(
                                        `variants${0}name`, /////static index=1 for now
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        ValidationConstants.pleaseEnterVariantName,
                                                },
                                            ],
                                        }
                                    )(
                                        <InputWithHead
                                            heading={AppConstants.variantName}
                                            placeholder={AppConstants.variantName}
                                            onChange={(e) => this.onVariantNameChange(e.target.value)}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        </div>

                        {isArrayNotEmpty(varientOptionArray) && varientOptionArray.map((subItem, subIndex) => (
                            <div className="row" key={"varientOptionArray" + subIndex}>
                                <div className="col-sm">
                                    <InputWithHead
                                        heading={AppConstants.option}
                                        placeholder={AppConstants.option}
                                        onChange={(e) => this.onVariantOptionOnChange(e.target.value, "optionName", 0, subIndex)}
                                        value={subItem.optionName}
                                    />
                                </div>
                                <div className="col-sm">
                                    <InputWithHead
                                        heading={AppConstants.price}
                                        placeholder={AppConstants.price}
                                        prefix="$"
                                        onChange={(e) => this.onVariantOptionOnChange(e.target.value, "price", 0, subIndex)}
                                        value={subItem.properties.price}
                                        type={"number"}
                                    />
                                </div>
                                <div className="col-sm">
                                    <InputWithHead
                                        heading={AppConstants.cost}
                                        placeholder={AppConstants.cost}
                                        prefix="$"
                                        onChange={(e) => this.onVariantOptionOnChange(e.target.value, "cost", 0, subIndex)}
                                        value={subItem.properties.cost}
                                        type={"number"}
                                    />
                                </div>
                                <div className="col-sm">
                                    <InputWithHead
                                        heading={AppConstants.sku}
                                        placeholder={AppConstants.sku}
                                        onChange={(e) => this.onVariantOptionOnChange(e.target.value, "skuCode", 0, subIndex)}
                                        value={subItem.properties.skuCode}
                                    />
                                </div>
                                <div className="col-sm">
                                    <InputWithHead
                                        heading={AppConstants.barcode}
                                        placeholder={AppConstants.barcode}
                                        onChange={(e) => this.onVariantOptionOnChange(e.target.value, "barcode", 0, subIndex)}
                                        value={subItem.properties.barcode}
                                    />
                                </div>
                                <div className="col-sm">
                                    <span className="input-heading" >{AppConstants.quantity}</span>
                                    <InputNumber
                                        style={{ width: 70 }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        placeholder={'0'}
                                        min={0}
                                        onChange={(value) => this.onVariantOptionOnChange(value, "quantity", 0, subIndex)}
                                        value={subItem.properties.quantity}
                                        type={"number"}
                                    />
                                </div>
                                <div className="col-sm red-remove-cross-img-div">
                                    {subIndex > 0 && <div
                                        style={{ cursor: 'pointer' }}>
                                        <img
                                            className="dot-image"
                                            src={AppImages.redCross}
                                            alt=""
                                            width="16"
                                            height="16"
                                            onClick={() => this.addVariantOption(0, subIndex, "remove", subItem.properties.id)}
                                        />
                                    </div>}
                                </div>
                            </div>
                        ))}
                        <span className="input-heading-add-another" onClick={() => this.addVariantOption(0, -1, "add")}>+{AppConstants.addvariantoption}</span>
                    </>}
                </div>
            </div >
        );
    };

    ////////Shipping content view
    shippingView = (getFieldDecorator) => {
        let { productDetailData } = this.props.shopProductState
        return (
            <div className="fees-view pt-5">
                <span className="form-heading">{AppConstants.shipping}</span>
                <div className="row pt-1">
                    <div className="col-sm-4" >
                        <Checkbox
                            className="single-checkbox mt-3"
                            checked={productDetailData.deliveryType == "shipping" ? true : false}
                            onChange={(e) => this.onChangeShippingCheckBox(e)}
                        >
                            {AppConstants.shipping}
                        </Checkbox>
                    </div>
                    <div className="col-sm-8" >
                        <Checkbox
                            className="single-checkbox mt-3"
                            checked={productDetailData.deliveryType == "pickup" ? true : false}
                            onChange={(e) =>
                                this.props.onChangeProductDetails(
                                    e.target.checked == true ? "pickup" : "",
                                    'deliveryType'
                                )
                            }
                        >
                            {AppConstants.pickup}
                        </Checkbox>
                    </div>
                </div>
                {
                    productDetailData.deliveryType == "shipping" && <>
                        <span className="form-heading mt-5">{AppConstants.productDimensionsWeight}</span>
                        <InputWithHead
                            heading={AppConstants.dimensions}
                            required="pt-3"
                        />
                        <div className="row">
                            <div className="col-sm">
                                <Form.Item>
                                    {getFieldDecorator(
                                        `length`,
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        ValidationConstants.enterLengthOfTheProduct,
                                                },
                                            ],
                                        }
                                    )(
                                        <InputWithHead
                                            required={"required-field "}
                                            placeholder={"Length"}
                                            suffix="cm"
                                            onChange={(e) =>
                                                this.props.onChangeProductDetails(
                                                    e.target.value,
                                                    'length'
                                                )
                                            }
                                            type="number"
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-1 remove-cross-img-div">
                                <img
                                    className="dot-image"
                                    src={AppImages.crossImage}
                                    alt=""
                                    width="16"
                                    height="16"
                                />
                            </div>
                            <div className="col-sm">
                                <Form.Item>
                                    {getFieldDecorator(
                                        `width`,
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        ValidationConstants.enterWidthOfTheProduct,
                                                },
                                            ],
                                        }
                                    )(
                                        <InputWithHead
                                            required={"required-field "}
                                            placeholder={"Width"}
                                            suffix="cm"
                                            onChange={(e) =>
                                                this.props.onChangeProductDetails(
                                                    e.target.value,
                                                    'width'
                                                )
                                            }
                                            type="number"
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div className="col-sm-1 remove-cross-img-div">
                                <img
                                    className="dot-image"
                                    src={AppImages.crossImage}
                                    alt=""
                                    width="16"
                                    height="16"
                                />
                            </div>
                            <div className="col-sm">
                                <Form.Item>
                                    {getFieldDecorator(
                                        `height`,
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        ValidationConstants.enterHeightOfTheProduct,
                                                },
                                            ],
                                        }
                                    )(
                                        <InputWithHead
                                            placeholder={"Height"}
                                            required={"required-field "}
                                            suffix="cm"
                                            onChange={(e) =>
                                                this.props.onChangeProductDetails(
                                                    e.target.value,
                                                    'height'
                                                )
                                            }
                                            type="number"
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <Form.Item>
                                    {getFieldDecorator(
                                        `weight`,
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        ValidationConstants.enterWeightOfTheProduct,
                                                },
                                            ],
                                        }
                                    )(
                                        <InputWithHead
                                            heading={AppConstants.dimensions}
                                            required={"required-field "}
                                            placeholder={"Weight"}
                                            suffix="kg"
                                            onChange={(e) =>
                                                this.props.onChangeProductDetails(
                                                    e.target.value,
                                                    'weight'
                                                )
                                            }
                                            type="number"
                                        />
                                    )}
                                </Form.Item>
                            </div>
                        </div>
                    </>
                }
            </div >
        );
    };



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="footer-view">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            <Button
                                type="cancel-button"
                                onClick={() => history.push('/listProducts')}>{AppConstants.cancel}</Button>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button className="publish-button" type="primary"
                                htmlType="submit">
                                {AppConstants.save}
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
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"2"} />
                <Layout>
                    <Form
                        onSubmit={this.addProductPostAPI}
                        noValidate="noValidate">
                        <Content >
                            {this.headerView()}
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                            <div className="formView">{this.imageView()}</div>
                            <div className="formView">{this.pricingView(getFieldDecorator)}</div>
                            <div className="formView">{this.inventoryView(getFieldDecorator)}</div>
                            <div className="formView">{this.variantsView(getFieldDecorator)}</div>
                            <div className="formView">{this.shippingView(getFieldDecorator)}</div>
                        </Content>
                        <Loader
                            visible={this.props.shopProductState.onLoad} />
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addProductAction,
        onChangeProductDetails,
        getTypesOfProductAction,
        addNewTypeAction,
        deleteProductVariantAction,
        getProductDetailsByIdAction,
        clearProductReducer,
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        shopProductState: state.ShopProductState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(AddProduct));
