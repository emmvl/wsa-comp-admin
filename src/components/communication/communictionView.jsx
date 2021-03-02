import React, { Component } from 'react';
import {
    Layout, Breadcrumb, Modal, Button, Checkbox,
} from 'antd';
import ReactPlayer from 'react-player';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from 'react-png-tooltip';
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import InputWithHead from '../../customComponents/InputWithHead';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import history from '../../util/history';
import {
    newsNotificationAction,
    liveScoreDeleteNewsAction,
} from '../../store/actions/LiveScoreAction/liveScoreNewsAction';
import Loader from '../../customComponents/loader';
import {
    communicationPublishAction,
    deleteCommunicationAction,
} from "../../store/actions/communicationAction/communicationAction";
import {getOrganisationData} from "../../util/sessionStorage";

const { Header, Footer, Content } = Layout;
const { confirm } = Modal;

class CommunicationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isVideo: false,
            modalData: '',
            communicationItem: props.location.state?.item,
            screenKey: props.location ? props.location.state ? props.location.state.screenKey ? props.location.state.screenKey : null : null : null,
            editorState: EditorState.createEmpty(),
        };
    }

    componentDidMount() {
        const communicationData = this.state.communicationItem;
        const html = (communicationData && communicationData.body) ? communicationData.body : '';
        const contentBlock = htmlToDraft(html);

        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState,
            });
        }
    }

    componentDidUpdate(nextProps) {
        const { communicationState } = this.props;
        if (nextProps.communicationState !== communicationState) {
            if (nextProps.communicationState.deleteSuccess !== communicationState.deleteSuccess
                && communicationState.deleteSuccess === true
            ) {
                history.push({
                    pathname: '/communicationList',
                    state: { screenKey: this.state.screenKey },
                });
            }

            if (nextProps.communicationState.publishSuccess !== communicationState.publishSuccess
                && communicationState.publishSuccess === true
            ) {
                history.push({
                    pathname: '/communicationList',
                    state: { screenKey: this.state.screenKey },
                });
            }
        }
    }

    // method to show modal view after click
    showModal = (data, isVideo) => {
        this.setState({
            visible: true,
            modalData: data,
            isVideo,
        });
    };

    // method to hide modal view after ok click
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    };

    // method to hide modal view after click on cancle button
    handleCancel = (e) => {
        this.setState({
            visible: false,
            modalData: '',
        });
    };

    deleteCommunication = () => {
        const { id } = this.state.communicationItem;
        this.props.deleteCommunicationAction(id);
    }

    // onclickDelete = () => {
    showDeleteConfirm = () => {
        const this_ = this;
        confirm({
            title: 'Are you sure you want to delete this communication?',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                this_.deleteCommunication();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    // view for breadcrumb
    headerView = () => (
        <Header className="comp-venue-courts-header-view live-form-view-button-header">
            <div className="row">
                <div className="col-sm" style={{ display: 'flex', alignContent: 'center' }}>
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.communicationDetails}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="col-sm live-form-view-button-container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <NavLink to={{
                        pathname: 'addCommunication',
                        state: { isEdit: true, item: this.state.communicationItem, screenKey: this.state.screenKey },
                    }}
                    >
                        <Button className="primary-add-comp-form mr-5" type="primary">
                            {AppConstants.edit}
                        </Button>
                    </NavLink>
                    <Button className="primary-add-comp-form" onClick={() => this.showDeleteConfirm()}>
                        {AppConstants.delete}
                    </Button>
                </div>
            </div>
        </Header>
    )

    // form content view
    contentView = () => {
        const communicationData = this.state.communicationItem;
        const { editorState } = this.state;
        return (
            <div className="content-view pt-4">
                <InputWithHead heading={communicationData ? communicationData.title : history.push('/communicationList')} />
                {(communicationData && communicationData.imageUrl) && (
                    <img
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.showModal(communicationData.imageUrl)}
                        src={communicationData ? communicationData.imageUrl : ''}
                        height="100"
                        width="100"
                    />
                )}

                <div style={{ marginTop: -10 }}>
                    <Editor
                        toolbarHidden
                        editorState={editorState}
                        onChange={null}
                        readOnly
                    />
                </div>

                {(communicationData && communicationData.videoUrl) && (
                    <div className="video-view mt-5">
                        <video
                            style={{ cursor: 'pointer' }}
                            onClick={() => this.showModal(communicationData.videoUrl, true)}
                            src={communicationData ? communicationData.videoUrl : ''}
                            height="100"
                            width="150"
                        />
                    </div>
                )}

            </div>
        );
    }

    onSubmitCommunicationPublish = () => {
        const { id, isNotification, isEmail, isApp } = this.state.communicationItem;
        this.props.communicationPublishAction({
            id,
            isNotification,
            isEmail,
            isApp,
            organisationUniqueKey: getOrganisationData().organisationUniqueKey,
        });
    }

    communicationView() {
        const communicationData = this.state.communicationItem;
        return (
            <div className="content-view pt-5">
                <div className="row">

                    <div
                        className="col-sm"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <Checkbox
                            className="single-checkbox"
                            checked={communicationData?.isNotification}
                            onClick={(e) => {
                                this.setState({
                                    communicationItem: {
                                        ...communicationData,
                                        isNotification: e.target.checked,
                                    },
                                });
                            }}
                        >
                            {AppConstants.notification}
                        </Checkbox>
                    </div>
                    <div
                        className="col-sm"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <Checkbox
                            className="single-checkbox"
                            checked={communicationData?.isEmail}
                            onClick={(e) => {
                                this.setState({
                                    communicationItem: {
                                        ...communicationData,
                                        isEmail: e.target.checked,
                                    },
                                });
                            }}
                        >
                            {AppConstants.email}
                        </Checkbox>
                    </div>
                    <div
                        className="col-sm"
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <Checkbox
                            className="single-checkbox"
                            checked={communicationData?.isApp}
                            onClick={(e) => {
                                this.setState({
                                    communicationItem: {
                                        ...communicationData,
                                        isApp: e.target.checked,
                                    },
                                });
                            }}
                        >
                            {AppConstants.app}
                        </Checkbox>
                    </div>
                </div>
            </div>
        );
    }

    // this method called inside modal view function to show content of the modal
    innerViewOfModal() {
        return (
            <div className="comp-dashboard-botton-view-mobile" style={{ display: 'flex', justifyContent: 'center' }}>
                {this.state.isVideo
                    ? <ReactPlayer url={this.state.modalData} playing={this.state.visible} controls />
                    : <img src={this.state.modalData} height="250" width="250" />}
            </div>
        );
    }

    // modal view
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
                footer={null}
            >
                {this.innerViewOfModal()}
            </Modal>
        );
    }

    // footer view containing all the buttons like submit and cancel
    footerView() {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => history.push('/communicationList')}
                                    className="input-heading-add-another"
                                >
                                    {AppConstants.backToCommunication}
                                </span>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div
                                className="comp-buttons-view"
                                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
                            >

                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Button
                                        className="open-reg-button mr-0"
                                        type="primary"
                                        onClick={() => this.onSubmitCommunicationPublish()}
                                    >
                                        {AppConstants.publish}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // main render function
    render() {
        return (
            <div className="fluid-width default-bg">
                <Loader
                    visible={
                        this.props.communicationState.onDeleteLoad
                        || this.props.communicationState.onPublishLoad
                    }
                />
                <DashboardLayout menuHeading={AppConstants.Communication} menuName={AppConstants.Communication} />
                <InnerHorizontalMenu menu="communication" userSelectedKey="1" />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>

                        <div className="formView mt-5">
                            {this.communicationView()}
                        </div>
                        {this.ModalView()}
                    </Content>
                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        newsNotificationAction,
        liveScoreDeleteNewsAction,
        deleteCommunicationAction,
        communicationPublishAction,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        communicationState: state.CommunicationState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommunicationView);
