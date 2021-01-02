import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Input,
    Button,
    DatePicker,
    TimePicker,
    Form,
    Modal,
    Spin,
    Checkbox,
    message
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import moment from "moment";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    liveScoreAddNewsDetailsAction,
    liveScoreAddNewsAction,
    liveScoreUpdateNewsAction,
    liveScoreRefreshNewsAction,
    setDefaultImageVideoNewAction
} from "../../store/actions/LiveScoreAction/liveScoreNewsAction";
import { getliveScoreScorerList } from '../../store/actions/LiveScoreAction/liveScoreAction';
import ValidationConstants from "../../themes/validationConstant";
import history from '../../util/history'
import Loader from '../../customComponents/loader';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import { getLiveScoreCompetiton, getKeyForStateWideMessage } from '../../util/sessionStorage';
import { isArrayNotEmpty, captializedString, isImageFormatValid, isImageSizeValid } from "../../util/helpers";
import { liveScoreManagerListAction } from '../../store/actions/LiveScoreAction/liveScoreManagerAction'
import ImageLoader from '../../customComponents/ImageLoader'
import { NavLink } from "react-router-dom";
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class LiveScoreSingleGameFee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            load: false,
            visible: false,
        };
        this.formRef = React.createRef();
    }

    componentDidMount() {
        let name
        if (getLiveScoreCompetiton()) {
            const AuthorData = JSON.parse(getLiveScoreCompetiton())
            name = AuthorData.longName
        } else {
            name = 'World sport actioa'
        }

        if (getLiveScoreCompetiton()) {
            const { id, organisationId } = JSON.parse(getLiveScoreCompetiton())
            if (this.state.screenKey === 'stateWideMsg') {
                this.props.getliveScoreScorerList(organisationId, 4)
                this.props.liveScoreManagerListAction(3, 1, null, null, null, null, null, null, organisationId)
            } else {

                this.props.getliveScoreScorerList(id, 4)
                this.props.liveScoreManagerListAction(3, 1, null, null, null, null, null, null, 1)
            }
        } else {
            history.push('/matchDayCompetitions')
            this.props.getliveScoreScorerList(1, 4)
            this.props.liveScoreManagerListAction(3, 1, 1)
        }

        this.setState({ getDataLoading: false, authorName: name })
        const { addEditNews } = this.props.liveScoreNewsState;
        this.formRef.current.setFieldsValue({
            'author': addEditNews.author ? addEditNews.author : name
        })

        if (this.state.isEdit === true) {
            this.props.setDefaultImageVideoNewAction({
                newsImage: this.props.location.state.item.newsImage,
                newsVideo: this.props.location.state.item.newsVideo,
                author: name
            })
            this.props.liveScoreAddNewsDetailsAction(this.props.location.state.item)
            this.setInitalFiledValue(this.props.location.state.item, name)
        } else {
            this.props.liveScoreRefreshNewsAction()
        }
    }

    onChangeEditorData = (event) => {
        this.props.liveScoreUpdateNewsAction(event, "body")
        // this.setState({ editorState: event })
    }

    EditorView = () => {
        const { liveScoreNewsState } = this.props;
        const { editorState } = this.state;
        return (
            <div className="fluid-width mt-2" style={{ border: "1px solid rgb(212, 212, 212)" }}>
                <div className="livescore-editor-news col-sm">
                    <Editor
                        editorState={editorState}
                        editorClassName="newsDetailEditor"
                        placeholder="News body"
                        onChange={(e) => this.onChangeEditorData(e.blocks)}
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'remove', 'history'],
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

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    setInitalFiledValue(data, author) {
        let authorData = null
        if (getLiveScoreCompetiton()) {
            authorData = JSON.parse(getLiveScoreCompetiton())
        }
        this.formRef.current.setFieldsValue({
            'news_Title': data.title,
            'author': data.author ? data.author : author ? author : authorData ? authorData.longName : 'World sport actioa'
        })
        // let finalBody = data ? data.body ? data.body : "" : ""
        // let body = EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(finalBody)))
        // this.setState({ editorState: body })

        let finalBody = data ? data.body ? data.body : "" : ""
        // const contentState = convertFromRaw({ "entityMap": {}, "blocks": finalBody });
        // const editorState = EditorState.createWithContent(contentState);
        // this.setState({
        //     editorState
        // })

        const html = finalBody;
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState
            })
        }
    }

    componentDidUpdate(nextProps) {
        let newsState = this.props.liveScoreNewsState.addNewsResult
        let onLoad_2Data = this.props.liveScoreNewsState
        if (nextProps.newsState !== newsState) {
            if (onLoad_2Data.onLoad_2 === false && this.state.getDataLoading === true) {
                // debugger
                const appendData = this.props.liveScoreNewsState.addNewsResult
                if (this.state.isEdit === true) {
                    if (!appendData.hasOwnProperty('newsVideo')) {
                        appendData['newsVideo'] = this.props.location.state.item.newsVideo
                    }
                    if (!appendData.hasOwnProperty('newsImage')) {
                        appendData['newsImage'] = this.props.location.state.item.newsImage
                    }
                }

                const { success } = this.props.liveScoreNewsState;

                if (success) {
                    history.push({
                        pathname: '/matchDayNewsView',
                        state: { item: appendData, id: this.state.key, screenKey: this.state.screenKey }
                    })
                }
            }
        }
    }

    ////method to show modal view after click
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    ////method to hide modal view after ok click
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    ////method to hide modal view after click on cancle button
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    
    ////modal view
    ModalView() {
        return (
            <Modal
                // title="WSA 1"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                centered
                width={0}
                height={0}
                closable={false}
            >
                {/* <div style={{ backgroundColor: 'red', height: 100, width: 100 }}> */}
                <Spin size="large" />
                {/* </div> */}
            </Modal>
        )
    }

    headerView = () => {
        let isEdit = this.props.location.state ? this.props.location.state.isEdit : null
        return (
            <div className="header-view">
                <Header className="form-header-view bg-transparent d-flex align-items-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {isEdit ? AppConstants.editNews : AppConstants.addNews}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    contentView = () => {
        return (
            <div className="comp-dash-table-view mt-4">
               
            </div>
        );
    };

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        const { liveScoreNewsState } = this.props;
        let editData = liveScoreNewsState.addEditNews;

        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm pl-3">
                            <div className="reg-add-save-button">
                                {/* <Button onClick={() => history.push(this.state.key === 'dashboard' ? 'liveScoreDashboard' : '/matchDayNewsList')} type="cancel-button">{AppConstants.cancel}</Button> */}
                                <NavLink
                                    to={{
                                        pathname: this.state.key === 'dashboard' ? '/matchDayDashboard' : '/matchDayNewsList',
                                        state: { screenKey: this.state.screenKey }
                                    }}
                                >
                                    <Button className="cancelBtnWidth" type="cancel-button">
                                        {AppConstants.cancel}
                                    </Button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-sm pr-3">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text mr-0" type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.next}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    onFinishFailed = (errorInfo) => {
        message.config({ maxCount: 1, duration: 1.5 })
        message.error(ValidationConstants.plzReviewPage)
    };

    render() {
        let stateWideMsg = getKeyForStateWideMessage()
        return (
            <div className="fluid-width default-bg" style={{ paddingBottom: 10 }}>
                <Loader visible={this.props.liveScoreNewsState.onLoad_2} />
                <DashboardLayout
                    menuHeading={AppConstants.matchDay}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./matchDayCompetitions")}
                />

                {stateWideMsg ? (
                    <InnerHorizontalMenu menu="liveScoreNews" liveScoreNewsSelectedKey="21" />
                ) : (
                        <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey={this.state.key === 'dashboard' ? '1' : "21"} />
                    )}

                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.onSaveButton}
                        noValidate="noValidate"
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Content>
                            {this.contentView()}
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreAddNewsDetailsAction,
        liveScoreAddNewsAction,
        liveScoreUpdateNewsAction,
        liveScoreRefreshNewsAction,
        getliveScoreScorerList,
        liveScoreManagerListAction,
        setDefaultImageVideoNewAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreNewsState: state.LiveScoreNewsState,
        liveScoreScorerState: state.LiveScoreScorerState,
        liveScoreMangerState: state.LiveScoreMangerState,
        liveScoreState: state.LiveScoreState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreAddNews);
