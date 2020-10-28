import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Breadcrumb,
    Button,
    Checkbox,
    Form,
    Layout,
    message,
    Radio,
    Spin,
} from 'antd';

import AppConstants from 'themes/appConstants';
import ValidationConstants from 'themes/validationConstant';
import history from 'util/history';
import { getLiveScoreCompetiton, getOrganisationData } from 'util/sessionStorage';
import {
    clearEditBannerAction,
    getLiveScoreBanners,
    liveScoreAddBanner,
    liveScoreAddBannerUpdate,
} from 'store/actions/LiveScoreAction/liveScoreBannerAction';
import { getBannerCnt } from 'store/actions/userAction/userAction';
import InnerHorizontalMenu from 'pages/innerHorizontalMenu';
import DashboardLayout from 'pages/dashboardLayout';
import InputWithHead from 'customComponents/InputWithHead';
import Loader from 'customComponents/loader';
import ImageLoader from 'customComponents/ImageLoader';

import './liveScore.css';

const { Header, Content, Footer } = Layout;

class LiveScoreEditBanners extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageError: '',
            bannerImg: null,
            bannerImgSend: null,
            tableRecord: props.location.state ? props.location.state.tableRecord : null,
            isEdit: props.location.state ? props.location.state.isEdit : null,
            load: false,
            compBannerCnt: -1,
            stateBannerCnt: -1,
        };

        props.clearEditBannerAction();

        this.backUrl = '/';
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.backUrl = localStorage.getItem('communication') ? 'communication' : 'liveScoreBanners';

        const { organisationId } = getOrganisationData();
        this.props.getBannerCnt(organisationId);

        if (this.state.isEdit === true) {
            this.props.liveScoreAddBannerUpdate(this.state.tableRecord, 'isEditBanner');
        } else {
            if (this.backUrl === 'communication') {
                this.props.getLiveScoreBanners(null, organisationId);
            } else {
                const { id } = JSON.parse(localStorage.getItem('LiveScoreCompetition'));
                this.props.getLiveScoreBanners(id, organisationId);
            }
            this.props.liveScoreAddBannerUpdate('', 'isAddBanner');
        }
    }

    componentDidUpdate(prevProps) {
        const { bannerResult } = this.props.liveScoreBannerState;

        if (!this.state.isEdit) {
            if (this.backUrl === 'communication' && this.state.stateBannerCnt >= 0 && bannerResult.length > this.state.stateBannerCnt) {
                this.goBack();
                message.warning('You are going to have more state banners than you can have.');
            } else if (this.backUrl !== 'communication' && this.state.compBannerCnt >= 0 && bannerResult.length > this.state.compBannerCnt) {
                this.goBack();
                message.warning('You are going to have more competition banners than you can have.');
            }
        }

        if (this.state.load === true && this.props.liveScoreBannerState.onLoad === false) {
            this.goBack();
            this.setState({ load: false });
        }

        if (!this.props.userState.onLoad && this.props.userState.status) {
            const { bannerCount: prevBannerCount } = prevProps.userState;
            const { bannerCount } = this.props.userState;
            if (prevBannerCount) {
                if (
                    bannerCount && (prevBannerCount.stateBannerCnt !== bannerCount.stateBannerCnt
                    || prevBannerCount.compBannerCnt !== bannerCount.compBannerCnt)
                ) {
                    this.setState({ ...bannerCount });
                }
            } else if (!prevBannerCount && bannerCount) {
                this.setState({ ...bannerCount });
            }
        }
    }

    goBack = () => {
        localStorage.setItem('communication', '');
        history.push(`/${this.backUrl}`);
    }

    // Image picker
    selectImage = () => {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/*');
        if (fileInput) {
            fileInput.click();
        }
    }

    onSelectBanner = (/* data */) => {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/*');
        if (fileInput) {
            fileInput.click();
        }
    };

    setImage = (data) => {
        if (data.files[0] !== undefined) {
            if (this.state.isEdit === true) {
                this.props.location.state.tableRecord.bannerUrl = null;
            }

            // this.setState({ bannerImgSend: data.files[0], bannerImg: URL.createObjectURL(data.files[0]) })
            this.setState({ bannerImgSend: data.files[0], bannerImg: URL.createObjectURL(data.files[0]) });
        }
    };

    loaderView = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="small" />
            <Spin />
            <Spin size="large" />
        </div>
    );

    loaderView2 = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* <Spin size="small" /> */}
            <Spin />
            {/* <Spin size="large" /> */}
        </div>
    );

    handleSubmit = (/* values */) => {
        this.onUploadButton();
    };

    onUploadButton = () => {
        const {
            showOnHome,
            showOnDraws,
            showOnLadder,
            showOnNews,
            showOnChat,
            format,
            bannerLink,
        } = this.props.liveScoreBannerState;
        const editBannerId = this.props.location.state ? this.props.location.state.tableRecord.id : null;

        let id = null;
        if (getLiveScoreCompetiton()) {
            id = JSON.parse(getLiveScoreCompetiton()).id;
        }
        const { organisationId } = getOrganisationData();

        const showOnhome = showOnHome === true ? 1 : 0;
        const showOndraws = showOnDraws === true ? 1 : 0;
        const showOnladder = showOnLadder === true ? 1 : 0;
        const showOnnews = showOnNews === true ? 1 : 0;
        const showOnchat = showOnChat === true ? 1 : 0;
        if (id !== null || this.backUrl === 'communication') {
            const bannerId = this.state.isEdit === true ? editBannerId : 0;
            this.props.liveScoreAddBanner(
                organisationId,
                this.backUrl === 'communication' ? null : id,
                this.state.bannerImgSend,
                showOnhome,
                showOndraws,
                showOnladder,
                showOnnews,
                showOnchat,
                format,
                bannerLink,
                bannerId,
            );
        }

        this.setState({ load: true });
    };

    onChangeFormat = (e) => {
        this.props.liveScoreAddBannerUpdate(e.target.value, 'format');

        if (e.target.value === 'Square') {
            this.props.liveScoreAddBannerUpdate(0, 'showOnChat');
            this.props.liveScoreAddBannerUpdate(0, 'showOnDraws');
            this.props.liveScoreAddBannerUpdate(0, 'showOnLadder');
        }
    };

    /// /////form content view
    contentView = () => {
        const { bannerLink, format } = this.props.liveScoreBannerState;
        const bannerImage = this.props.location.state ? this.props.location.state.tableRecord.bannerUrl : null;

        return (
            <div className="content-view pt-2">
                {/* <img alt="" className="banner-image" src={bannerImage ? bannerImage : this.state.bannerImg} /> */ }
                <ImageLoader
                    className="banner-image"
                    height
                    width
                    borderRadius
                    timeout={this.state.timeout}
                    src={bannerImage || this.state.bannerImg}
                />
                <div>
                    <div className="row">
                        <div className="col-sm">
                            <span className="user-contact-heading">{AppConstants.uploadImage}</span>
                            <div onClick={this.selectImage}>
                                {/* <label></label> */ }
                            </div>
                            <Form.Item
                                name="bnnerImage"
                                rules={[{
                                    required: !bannerImage,
                                    message: ValidationConstants.bannerImage,
                                }]}
                            >
                                <input
                                    required="pb-0"
                                    type="file"
                                    id="user-pic"
                                    // style={{ display: 'none' }}
                                    onChange={(evt) => {
                                        this.setImage(evt.target);
                                        this.setState({ timeout: 1000 });
                                        setTimeout(() => {
                                            this.setState({ timeout: null });
                                        }, 1000);
                                    }}
                                />
                            </Form.Item>
                            <span className="form-err">{ this.state.imageError }</span>
                        </div>
                        <div className="col-sm pt-1">
                            <InputWithHead
                                heading={AppConstants.bannerLink}
                                placeholder={AppConstants.bannerLink}
                                name="bannerLink"
                                onChange={(url) => this.props.liveScoreAddBannerUpdate(url.target.value, 'bannerLink')}
                                // value={bannerUrl ? bannerUrl.length > 0 ? `https://${bannerUrl}` : ""}
                                // value={bannerUrl ? `https://${bannerUrl}` : ""}
                                // prefix={"https://"}
                                value={bannerLink}
                            />

                            <div className="mt-3">
                                <div>
                                    <span>{AppConstants.bannerFormat}</span>
                                </div>
                                <Radio.Group
                                    name="format"
                                    onChange={this.onChangeFormat}
                                    value={format}
                                >
                                    <Radio value="Horizontal">Horizontal</Radio>
                                    <Radio value="Square">Square</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-sm" style={{ marginTop: 10 }}>
                        <div className="row">
                            <div className="reg-add-save-button">
                                <Button onClick={this.handleSubmit} className="primary-add-comp-form" type="primary">
                                    {AppConstants.upload}
                                </Button>
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* {this.chekboxes()} */}
            </div>
        );
    };

    // check box
    chekboxes = () => {
        const {
            showOnHome,
            showOnDraws,
            showOnLadder,
            showOnNews,
            showOnChat,
            format,
        } = this.props.liveScoreBannerState;

        const isSquare = format === 'Square';

        return (
            <div className="pt-4">
                <Checkbox
                    className="single-checkbox"
                    checked={showOnHome}
                    onChange={(e) => this.props.liveScoreAddBannerUpdate(e.target.checked, 'showOnHome')}
                >
                    {AppConstants.showHomePage}
                </Checkbox>

                <div style={{ marginTop: 5 }}>
                    <Checkbox
                        className="single-checkbox"
                        disabled={isSquare}
                        checked={showOnDraws}
                        onChange={(e) => this.props.liveScoreAddBannerUpdate(e.target.checked, 'showOnDraws')}
                    >
                        {AppConstants.showOnDrawsPage}
                    </Checkbox>
                </div>

                <div style={{ marginTop: 5 }}>
                    <Checkbox
                        className="single-checkbox"
                        disabled={isSquare}
                        checked={showOnLadder}
                        // onChange={(e) => this.setState({ showOnLadder: !this.state.showOnLadder })
                        onChange={(e) => this.props.liveScoreAddBannerUpdate(e.target.checked, 'showOnLadder')}
                    >
                        {AppConstants.showOnLadderPage}
                    </Checkbox>
                </div>

                <div style={{ marginTop: 5 }}>
                    <Checkbox
                        className="single-checkbox"
                        checked={showOnNews}
                        onChange={(e) => this.props.liveScoreAddBannerUpdate(e.target.checked, 'showOnNews')}
                    >
                        {AppConstants.showOnNewsPage}
                    </Checkbox>
                </div>

                <div style={{ marginTop: 5 }}>
                    <Checkbox
                        className="single-checkbox"
                        disabled={isSquare}
                        checked={showOnChat}
                        onChange={(e) => this.props.liveScoreAddBannerUpdate(e.target.checked, 'showOnChat')}
                    >
                        {AppConstants.showOnChatPage}
                    </Checkbox>
                </div>
            </div>
        );
    };

    headerView = () => (
        <div className="header-view">
            <Header
                className="form-header-view"
                style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="row">
                    <div className="col-sm" style={{ display: 'flex', alignContent: 'center' }}>
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {this.state.isEdit === true ? AppConstants.editBanners : AppConstants.addBanners}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        </div>
    );

    onRemoveBtn = () => {
        this.setState({ bannerImgSend: null, bannerImg: null });
    }

    // view for breadcrumb
    removeBtn = () => (
        <div className="comp-player-grades-header-drop-down-view">
            <div className="col-sm">
                <div
                    className="comp-dashboard-botton-view-mobile"
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button onClick={this.onRemoveBtn} className="primary-add-comp-form" type="primary">
                        {AppConstants.removeBanner}
                    </Button>
                </div>
            </div>
        </div>
    );

    /// ///footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => (
        <div className="fluid-width">
            <div className="footer-view">
                <div className="row">
                    <div className="col-sm">
                        <div className="reg-add-save-button">
                            <Button
                                className="cancelBtnWidth"
                                onClick={() => {
                                    this.goBack();
                                    localStorage.setItem('communication', '');
                                }}
                                type="cancel-button"
                            >
                                {AppConstants.cancel}
                            </Button>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="comp-buttons-view">
                            <Button
                                className="publish-button save-draft-text"
                                type="primary"
                                htmlType="submit"
                                disabled={isSubmitting}
                            >
                                {AppConstants.save}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: '#f7fafc', paddingBottom: 10 }}>
                <DashboardLayout
                    menuHeading={AppConstants.liveScores}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push('./liveScoreCompetitions')}
                />

                <Loader visible={this.props.liveScoreBannerState.onLoad} />

                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey="20" />

                <Layout>
                    {this.headerView()}
                    <Form
                        ref={this.formRef}
                        onFinish={this.handleSubmit}
                        className="login-form"
                        noValidate="noValidate"
                    >
                        <Content>
                            <div className="formView pt-3">
                                {this.state.bannerImg && this.removeBtn()}
                                {this.contentView()}
                            </div>
                        </Content>

                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

LiveScoreEditBanners.propTypes = {
    location: PropTypes.object.isRequired,
    liveScoreBannerState: PropTypes.object.isRequired,
    userState: PropTypes.object.isRequired,
    liveScoreAddBanner: PropTypes.func.isRequired,
    liveScoreAddBannerUpdate: PropTypes.func.isRequired,
    clearEditBannerAction: PropTypes.func.isRequired,
    getBannerCnt: PropTypes.func.isRequired,
    getLiveScoreBanners: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreAddBanner,
        liveScoreAddBannerUpdate,
        clearEditBannerAction,
        getBannerCnt,
        getLiveScoreBanners,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        liveScoreBannerState: state.LiveScoreBannerState,
        userState: state.UserState,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreEditBanners);
