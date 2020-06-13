import React, { Component } from "react";
import { Layout, Button, Table, Select, Breadcrumb } from 'antd';
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
            </div >
        );
    };


    render() {

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Content className="comp-dash-table-view">
                        <div className="formView">{this.contentView()}</div>
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
