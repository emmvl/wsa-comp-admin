import React, { Component } from "react";
import { Layout, Button, Checkbox, Breadcrumb, Spin, Table } from 'antd';
import './liveScore.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import AppImages from "../../themes/appImages";
import { bindActionCreators } from 'redux';
import { getliveScoreBanners, liveScoreRemoveBanner } from '../../store/actions/LiveScoreAction/liveScoreBannerAction'
import history from "../../util/history";
import { getCompetitonId, getLiveScoreCompetiton } from '../../util/sessionStorage'

const { Header, Content } = Layout;
var _this = null
const columns = [

    {
        dataIndex: 'bannerUrl',
        key: 'bannerUrl',
        render: (bannerUrl, record) => {

            return (
                <div>
                    {_this.removeBtn(record)}
                    <img thumbnail={true} alt="" className="banner-image" src={bannerUrl} />
                    {_this.footerView(record)}
                </div>
            )
        }
    },
]

class LiveScoreBanners extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageError: "",
            bannerImg: null,

        }
        _this = this
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
            this.setState({ bannerImg: data.files[0], bannerImg: URL.createObjectURL(data.files[0]) })
        }
    };

    componentDidMount() {
        // let competitionId = getCompetitonId()
        const { id } = JSON.parse(getLiveScoreCompetiton())
        console.log('666', id)
        if (id !== null) {
            // debugger
            this.props.getliveScoreBanners(id)
        } else {
            history.push('/')
        }
    }

    loaderView() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                {/* <Spin size="small" /> */}
                <Spin />
                {/* <Spin size="large" /> */}
            </div>
        )
    }

    ////////form content view
    contentView = (item) => {
        let { bannerResult } = this.props.liveScoreBannerState
        return (
            <div className="content-view">
                <Table
                    className="home-dashboard-table"
                    loading={this.props.liveScoreBannerState.onLoad == true && true}
                    columns={columns}
                    dataSource={bannerResult}
                    showHeader={false}
                    pagination={false} />
            </div>
        )
    }

    footerView(record) {
        let { bannerResult } = this.props.liveScoreBannerState

        return (
            <div>
                <div className="row">

                    <div className="col-sm pt-1">
                        <InputWithHead
                            heading={AppConstants.bannerlink}
                            placeholder={AppConstants.bannerlink}
                            name={'bannerlink'}
                            disabled={true}
                            value={record.bannerLink ? record.bannerLink : `http://`}
                        />
                    </div>

                </div>
                {this.chekboxes(record)}
            </div>

        )
    }

    //check box

    chekboxes = (record) => {
        let { showOnHome, showOnDraws, showOnLadder } = this.props.liveScoreBannerState

        return (
            <div className="pt-4">
                <Checkbox
                    disabled={true}
                    className="single-checkbosx"
                    // checked = {true}
                    checked={record.showOnHome == true ? 1 : 0}
                >
                    {AppConstants.showHomePage}
                </Checkbox>
                <div style={{ marginTop: 5 }}>
                    <Checkbox
                        disabled={true}
                        className="single-checkbox"
                        checked={record.showOnDraws == true ? 1 : 0}
                    >
                        {AppConstants.showonDrawsPage}
                    </Checkbox>
                </div>
                <div style={{ marginTop: 5 }}>
                    <Checkbox
                        disabled={true}
                        className="single-checkbox"
                        checked={record.showOnLadder == true ? 1 : 0}
                    >
                        {AppConstants.showonLadderPage}
                    </Checkbox>
                </div>
            </div>
        )
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view live-form-view-button-header" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.banners}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="col-sm live-form-view-button-container" style={{ display: "flex", justifyContent: "flex-end" }} >
                        <NavLink to='/liveScoreEditBanners'>
                            <Button className="primary-add-comp-form " type="primary">{"+" + AppConstants.addBanners}</Button>
                        </NavLink>
                    </div>
                </div>
            </Header >
        )
    }

    removeBanner(record) {
        this.props.liveScoreRemoveBanner(record.id)

    }

    ///////view for breadcrumb
    removeBtn = (record) => {
        return (
            <div className="mb-3">
                {/* <div className="col-sm"> */}
                <div
                    className="comp-dashboard-botton-view-mobile"
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    <NavLink to={{
                        pathname: '/liveScoreEditBanners',
                        state: { isEdit: true, tableRecord: record }
                    }}>
                        <Button onClick={() => this.setState({ bannerImg: null })} className="primary-add-comp-form ml-5" type="primary">
                            {"+" + AppConstants.editBanner}
                        </Button>
                    </NavLink>
                    <Button onClick={() => this.removeBanner(record)} className="primary-add-comp-form ml-5" type="primary">
                        {AppConstants.removeBanner}
                    </Button>
                </div>
            </div>
            // </div>
        );
    };

    render() {
        let { bannerResult } = this.props.liveScoreBannerState
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc", paddingBottom: 10 }} >
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"20"} />
                <Layout>
                    {this.headerView()}

                    <Content>
                        <div className="formView pt-3">
                            {/* {(this.state.bannerImg || bannerResult.length > 0) && this.removeBtn()} */}

                            {this.contentView()}

                        </div>


                    </Content>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getliveScoreBanners, liveScoreRemoveBanner }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreBannerState: state.LiveScoreBannerState,
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((LiveScoreBanners));
