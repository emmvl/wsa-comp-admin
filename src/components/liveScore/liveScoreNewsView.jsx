import React, { Component } from "react";
import {
    Layout, Breadcrumb, Modal, Button,
    Form
} from 'antd';
import './liveScore.css';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ReactPlayer from 'react-player'
import { NavLink } from "react-router-dom";
import history from '../../util/history'
import {
    newsNotificationAction, liveScoreDeleteNewsAction
} from "../../store/actions/LiveScoreAction/liveScoreNewsAction";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loader from '../../customComponents/loader'
import Tooltip from 'react-png-tooltip'
import { getKeyForStateWideMessage } from '../../util/sessionStorage';

const { Header, Footer, Content } = Layout;
const { confirm } = Modal;

class LiveScoreNewsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isVideo: false,
            modaldata: '',
            newsItem: props.location.state ? props.location.state.item : null,
            id: props.location.state ? props.location.state.id ? props.location.state.id : null : null,
            getDataLoading: false,
            deleteLoading: false,
            screenKey: props.location ? props.location.state ? props.location.state.screenKey ? props.location.state.screenKey : null : null : null
        }
    }

    ////method to show modal view after click
    showModal = (data, isVideo) => {
        this.setState({
            visible: true,
            modaldata: data,
            isVideo: isVideo
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
            modaldata: ''
        });
    };

    componentDidUpdate(nextProps) {
        let newsState = this.props.liveScoreNewsState.notificationResult
        console.log(newsState)
        let onLoad_2Data = this.props.liveScoreNewsState
        if (nextProps.newsState !== newsState) {
            if (onLoad_2Data.notifyLoad == false && this.state.getDataLoading == true) {
                if (newsState !== []) {
                    history.push(this.state.id == "dashboard" ? "/liveScoreDashboard" : './liveScoreNewsList')
                    // history.push(this.state.id == "dashboard" && "/liveScoreDashboard")
                }
            }
            if (onLoad_2Data.onLoad_2 == false && this.state.deleteLoading == true) {
                if (this.props.liveScoreNewsState.deleteNews !== []) {
                    history.push({
                        pathname: '/liveScoreNewsList',
                        state: { screenKey: this.state.screenKey }
                    })
                }
            }

        }
    }

    deleteTeam = (newsId) => {
        this.props.liveScoreDeleteNewsAction(newsId)
        this.setState({ deleteLoading: true })
    }

    // onclickDelete = () => {
    showDeleteConfirm = (newsId) => {
        let this_ = this
        confirm({
            title: 'Are you sure you want to delete this news?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                this_.deleteTeam(newsId)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    // }


    ///////view for breadcrumb
    headerView = () => {
        let newsData = this.state.newsItem
        return (
            <Header className="comp-venue-courts-header-view live-form-view-button-header" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.newsDetail}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm live-form-view-button-container" style={{ display: "flex", justifyContent: "flex-end" }} >
                        <NavLink to={{
                            pathname: "liveScoreAddNews",
                            state: { isEdit: true, item: this.state.newsItem, screenKey: this.state.screenKey }
                        }}>
                            <Button className="primary-add-comp-form mr-5" type="primary">{AppConstants.edit}
                            </Button>
                        </NavLink>
                        <Button className="primary-add-comp-form " onClick={() => this.showDeleteConfirm(newsData.id)} type="primary">{AppConstants.delete}</Button>
                    </div>
                </div>
            </Header >
        )
    }


    ////////form content view
    contentView = () => {
        let newsData = this.state.newsItem;
        return (
            <div className="content-view pt-4">
                <InputWithHead heading={newsData.title} />
                {newsData.newsImage && <img style={{ cursor: 'pointer' }} onClick={() => this.showModal(
                    newsData.newsImage)}
                    src={newsData ? newsData.newsImage : ''}
                    height='100' width='100' />}

                {/* <span className="input-heading">{newsData.body}</span> */}
                <div className="input-heading" dangerouslySetInnerHTML={{ __html: newsData.body }}>

                </div>
                {newsData.newsVideo && <div className='video-view mt-5'>
                    <video style={{ cursor: 'pointer' }} onClick={() => this.showModal(newsData.newsVideo, true)}
                        src={newsData ? newsData.newsVideo : ''} height='100' width='150' />
                </div>}
            </div>
        )
    }

    //// this method called insside modal view function to show content of the modal 
    innerViewOfModal() {

        return (
            <div className="comp-dashboard-botton-view-mobile" style={{ display: 'flex', justifyContent: 'center', }} >
                {
                    this.state.isVideo == true ?
                        <ReactPlayer url={this.state.modaldata} playing={this.state.visible == true ? true : false} controls={true} />
                        :
                        <img src={this.state.modaldata} height='250' width='250' />
                }

            </div>
        )
    }

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
                centered={true}
            >
                {this.innerViewOfModal()}
            </Modal>
        )
    }


    //////footer view containing all the buttons like submit and cancel
    footerView() {
        let newsDataArr = this.state.newsItem;
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <span style={{ cursor: "pointer" }} onClick={() => history.push('/liveScoreNewsList')} className="input-heading-add-another">{AppConstants.backToNews}</span>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                {!newsDataArr.published_at &&
                                    // <div style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 50, }}>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Button
                                            className="open-reg-button mr-0" type="primary"
                                            onClick={() => this.onSubmitNewsPublish(newsDataArr, true)}>{AppConstants.publish}</Button>
                                        <div style={{ paddingRight: 20, alignItems: 'center', justifyContent: 'center' }}>
                                            <Tooltip background='#ff8237'>
                                                <span>{AppConstants.newsPublishMsg}</span>
                                            </Tooltip>
                                        </div>
                                    </div>


                                    // </div>
                                }
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Button className="open-reg-button" type="primary"
                                        onClick={() => this.onSubmitNewsPublish(newsDataArr, false)}
                                    >
                                        {!newsDataArr.published_at ? AppConstants.publish_notify
                                            : (newsDataArr.isActive == 1 && newsDataArr.isNotification == 1) ?
                                                AppConstants.notifyAgain : AppConstants.notify

                                        }

                                    </Button>
                                    <div  >
                                        <Tooltip background='#ff8237'>
                                            <span>{AppConstants.newsPublishNotifyMsg}</span>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    onSubmitNewsPublish = (data, value) => {
        this.props.newsNotificationAction(data, value, this.state.screenKey)
        this.setState({ getDataLoading: true })
    }


    ////main render function
    render() {
        let stateWideMsg = getKeyForStateWideMessage()
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                {
                    stateWideMsg ?
                        <InnerHorizontalMenu menu={"liveScoreNews"} liveScoreNewsSelectedKey={"21"} />
                        :
                        <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"21"} />
                }
                <Loader visible={this.props.liveScoreNewsState.notifyLoad} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
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
        liveScoreDeleteNewsAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreNewsState: state.LiveScoreNewsState,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LiveScoreNewsView));
