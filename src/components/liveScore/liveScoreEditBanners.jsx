import React, { Component } from "react";
import { Layout, Button, Checkbox, Breadcrumb, Spin, Form } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { liveScoreAddBanner, liveScoreAddBannerUpdate, clearEditBannerAction } from '../../store/actions/LiveScoreAction/liveScoreBannerAction'
import history from "../../util/history";
import { getLiveScoreCompetiton } from '../../util/sessionStorage';
import Loader from '../../customComponents/loader'
import ImageLoader from '../../customComponents/ImageLoader'


const { Header, Content, Footer } = Layout;

class LiveScoreEditBanners extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageError: "",
            bannerImg: null,
            bannerImgSend: null,
            bannerlink: '',
            showOnHome: false,
            showOnDraws: false,
            showOnLadder: false,
            http: `https://`,
            tableRecord: this.props.location.state ? this.props.location.state.tableRecord : null,
            isEdit: this.props.location.state ? this.props.location.state.isEdit : null,
            isAddBanner: this.props.location.state ? this.props.location.state.isAddBanner : null,
            load: false
        }
        this.props.clearEditBannerAction()
    }

    componentDidMount() {
        if (this.state.isEdit === true) {
            this.props.liveScoreAddBannerUpdate(this.state.tableRecord, "isEditBanner")
        } else {
            this.props.liveScoreAddBannerUpdate('', "isAddBanner")
        }
    }

    componentDidUpdate() {
        if (this.state.load === true && this.props.liveScoreBannerState.onLoad === false) {

            history.push('/liveScoreBanners')
            this.setState({ load: false })
        }
    }

    //Image picker
    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    onSelectBanner = (data) => {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }

    setImage = (data) => {
        if (data.files[0] !== undefined) {
            if (this.state.isEdit === true) {
                this.props.location.state.tableRecord.bannerUrl = null
            }

            //this.setState({ bannerImgSend: data.files[0], bannerImg: URL.createObjectURL(data.files[0]) })
            this.setState({ bannerImgSend: data.files[0], bannerImg: URL.createObjectURL(data.files[0]) })
        }

    };

    loaderView() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                <Spin size="small" />
                <Spin />
                <Spin size="large" />
            </div>
        )
    }

    loaderView_2() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                {/* {/* <Spin size="small" /> */}
                <Spin />
                {/* <Spin size="large" /> */}
            </div>
        )
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {

            if (!err) {
                // console.log('err', 'hello')
                this.onUploadButton()
            }
        });
    };

    onUploadButton = () => {
        const { showOnHome, showOnDraws, showOnLadder, bannerLink } = this.props.liveScoreBannerState
        const editBannerId = this.props.location.state ? this.props.location.state.tableRecord.id : null

        // let competitionId = getCompetitonId();
        const { id } = JSON.parse(getLiveScoreCompetiton())
        let showOnhome = showOnHome === true ? 1 : 0
        let showOndraws = showOnDraws === true ? 1 : 0
        let showOnladder = showOnLadder === true ? 1 : 0
        if (id !== null) {
            let bannerId = this.state.isEdit === true ? editBannerId : 0

            this.props.liveScoreAddBanner(id, this.state.bannerImgSend, showOnhome, showOndraws, showOnladder, bannerLink, bannerId)
        }

        this.setState({ load: true })
        // console.log('hello')
    }

    ////////form content view
    contentView = (getFieldDecorator) => {
        const { bannerLink } = this.props.liveScoreBannerState


        const bannerImage = this.props.location.state ? this.props.location.state.tableRecord.bannerUrl : null

        return (
            <div className="content-view pt-2">
                {/* <img alt="" className="banner-image" src={bannerImage ? bannerImage : this.state.bannerImg} /> */}
                <ImageLoader
                    className="banner-image"
                    height
                    width
                    borderRadius
                    timeout={this.state.timeout}
                    src={bannerImage ? bannerImage : this.state.bannerImg} />
                <div>
                    <div className="row">
                        <div className="col-sm" >
                            <span className="user-contact-heading">{AppConstants.uploadImage}</span>
                            <div onClick={this.selectImage}>
                                {/* <label>
                                </label> */}
                            </div>
                            <Form.Item>
                                {getFieldDecorator('bannerImage', {
                                    rules: [{ required: bannerImage ? false : true, message: ValidationConstants.bannerImage }]
                                })(
                                    <input
                                        required={"pb-0"}
                                        type="file"
                                        id="user-pic"
                                        // style={{ display: 'none' }}
                                        onChange={(evt) => {
                                            this.setImage(evt.target)
                                            this.setState({ timeout: 1000 })
                                            setTimeout(() => {
                                                this.setState({ timeout: null })
                                            }, 1000);
                                        }} />
                                )}
                            </Form.Item>
                            <span className="form-err">{this.state.imageError}</span>
                        </div>
                        <div className="col-sm pt-1">
                            <InputWithHead
                                heading={AppConstants.bannerlink}
                                placeholder={AppConstants.bannerlink}
                                name={'bannerlink'}
                                onChange={(url) => this.props.liveScoreAddBannerUpdate(url.target.value, "bannerLink")}
                                // value={bannerUrl ? bannerUrl.length > 0 ? `https://${bannerUrl}` : ""}
                                // value={bannerUrl ? `https://${bannerUrl}` : ""}
                                // prefix={"https://"}
                                value={bannerLink}
                            />
                        </div>
                    </div>
                    {/* <div className="col-sm"
                        style={{ marginTop: 10 }}>
                        <div className="row">
                            <div className="reg-add-save-button">
                                <Button onClick={this.handleSubmit} className="primary-add-comp-form" type="primary">
                                    {AppConstants.upload}
                                </Button>
                            </div>

                        </div>
                    </div> */}
                </div>

                {this.chekboxes(getFieldDecorator)}
            </div>
        )
    }



    //check box
    chekboxes = (getFieldDecorator) => {
        const showOnHome = this.props.location.state ? this.props.location.state.tableRecord.showOnHome : null
        const showOnDraws = this.props.location.state ? this.props.location.state.tableRecord.showOnDraws : null
        const showOnLadder = this.props.location.state ? this.props.location.state.tableRecord.showOnLadder : null

        //        const { showOnHome, showOnDraws, showOnLadder } = this.props.liveScoreBannerState

        return (
            <div className="pt-4">
                <Checkbox
                    className="single-checkbosx"
                    defaultChecked={showOnHome == 1 && true}
                    onChange={(e) => this.props.liveScoreAddBannerUpdate(e.target.checked, "showOnHome")}
                >
                    {AppConstants.showHomePage}
                </Checkbox>

                <div style={{ marginTop: 5 }}>
                    <Checkbox
                        className="single-checkbox"
                        defaultChecked={showOnDraws == 1 && true}
                        onChange={(e) => this.u({ showOnDraws: !this.state.showOnDraws })}
                        onChange={(e) => this.props.liveScoreAddBannerUpdate(e.target.checked, "showOnDraws")}
                    >
                        {AppConstants.showonDrawsPage}
                    </Checkbox>
                </div>
                <div style={{ marginTop: 5 }}>
                    <Checkbox
                        className="single-checkbox"
                        defaultChecked={showOnLadder == 1 && true}
                        //onChange={(e) => this.setState({ showOnLadder: !this.state.showOnLadder })
                        onChange={(e) => this.props.liveScoreAddBannerUpdate(e.target.checked, "showOnLadder")}
                    >
                        {AppConstants.showonLadderPage}
                    </Checkbox>
                </div>
            </div>
        )
    }


    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view" style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }} >
                    <div className="row" >
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">{this.state.isEdit === true ? AppConstants.editBanners : AppConstants.addBanners}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    onRemoveBtn() {
        this.setState({ bannerImgSend: null, bannerImg: null })
    }

    ///////view for breadcrumb
    removeBtn = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="col-sm">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }}
                    >
                        <Button onClick={() => this.onRemoveBtn()} className="primary-add-comp-form" type="primary">
                            {AppConstants.removeBanner}
                        </Button>

                    </div>
                </div>
            </div>
        );
    };

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {

        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button className="cancelBtnWidth" onClick={() => history.push('/liveScoreBanners')} type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button className="publish-button save-draft-text"
                                    type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };



    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc", paddingBottom: 10 }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <Loader visible={this.props.liveScoreBannerState.onLoad} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"20"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.handleSubmit}
                        className="login-form"
                        noValidate="noValidate">
                        <Content>
                            <div className="formView pt-3">
                                {this.state.bannerImg && this.removeBtn()}
                                {this.contentView(getFieldDecorator)}
                            </div>
                        </Content>

                        <Footer >{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ liveScoreAddBanner, liveScoreAddBannerUpdate, clearEditBannerAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreBannerState: state.LiveScoreBannerState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreEditBanners));
