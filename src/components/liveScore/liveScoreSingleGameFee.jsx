import React, { Component } from "react";
import {
    Layout, Breadcrumb, Button, Modal, Table, Menu, Pagination,
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
// import moment from "moment";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    liveScoreSingleGameListAction,
    liveScoreSingleGameRedeemPayAction
} from "../../store/actions/LiveScoreAction/liveScoreDashboardAction";
// import ValidationConstants from "../../themes/validationConstant";
import history from '../../util/history'
import Loader from '../../customComponents/loader';
import {
    getLiveScoreCompetiton,
    // getKeyForStateWideMessage,
    getOrganisationData
} from '../../util/sessionStorage';

import { NavLink } from "react-router-dom";

const { Header, Content } = Layout;
let this_Obj = null;

function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

function checkSorting(a, b, key) {
    if (a[key] && b[key]) {
        return a[key].length - b[key].length
    }
}

const columns = [
    {
        title: AppConstants.firstName,
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => tableSort(a, b, "firstName"),
    },
    {
        title: AppConstants.lastName,
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => checkSorting(a, b, "lastName"),
    },
    {
        title: AppConstants.linked,
        dataIndex: 'linked',
        key: 'linked',
        sorter: (a, b) => checkSorting(a, b, "linked"),
    },
    {
        title: AppConstants.division,
        dataIndex: 'division',
        key: 'division',
        sorter: (a, b) => checkSorting(a, b, "division"),
    },
    {
        title: AppConstants.grade,
        dataIndex: 'grade',
        key: 'grade',
        sorter: (a, b) => checkSorting(a, b, "grade"),
    },
    {
        title: AppConstants.team,
        dataIndex: 'teamName',
        key: 'team',
        sorter: (a, b) => checkSorting(a, b, "team"),
    },
    {
        title: AppConstants.status,
        dataIndex: 'status',
        key: 'status',
        render: (status, record) => (
            <span className="input-heading-add-another pt-0" >
                {Number(record.matchesCount) - Number(record.redeemCount)}</span>
        )

    },
    {
        title: AppConstants.action,
        dataIndex: 'action',
        key: 'action',
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: '25px' }}
            >
                <Menu.SubMenu key="sub1" style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                    title={<img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />}
                >
                    {(Number(record.matchesCount ? record.matchesCount : 0) > Number(record.redeemCount ? record.redeemCount : 0)) && (
                    <Menu.Item key="1"
                        onClick={() => this_Obj.showRedeemModal("show", record)}>
                        <span>Redeem</span>
                    </Menu.Item>
                    )}
                     {(Number(record.redeemCount ? record.redeemCount : 0) >= Number(record.matchesCount ? record.matchesCount : 0)) && (
                    <Menu.Item key="2"
                        onClick={() => this_Obj.showPayModal("show", record)}>
                        <span>Pay</span>
                    </Menu.Item>
                    )}
                </Menu.SubMenu>
                
            </Menu>
        )
    }
];

class LiveScoreSingleGameFee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            load: false,
            redeemModalVisible: false,
            payModalVisible: false,
            gamesToRedeem: 0,
            gamesToPay: 0,
            singleGameRecord: null
        };
        this.formRef = React.createRef();
        this_Obj = this;
    }

    componentDidMount() {
        this.getLivescoreGameList(1);
    }

    getLivescoreGameList(page){
        const { uniqueKey } = JSON.parse(getLiveScoreCompetiton())
        const {organisationUniqueKey} = getOrganisationData();
        let payload = {
            competitionId: uniqueKey,
            organisationId: organisationUniqueKey,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0),
            },
        }

        this.props.liveScoreSingleGameListAction(payload);
    }

    componentDidUpdate(nextProps) {
        if (this.state.load === true && this.props.liveScoreDashboardState.onSingleGameRedeemPayLoad === false) {
            this.getLivescoreGameList(1);
            this.setState({ load: false })
        }
    }

    showRedeemModal = (key, record) => {
        if (key === "show") {
            this.setState({ redeemModalVisible: true, singleGameRecord: record });
        }
        else if (key === "ok") {
            let record = this.state.singleGameRecord;
            let payload = {
                userId: record.userId,
                organisationId: record.organisationId,
                competitionId: record.competitionId,
                membershipProductMappingId: record.membershipProductMappingId,
                divisionId: record.divisionId,
                registrationId: record.registrationId,
                gamesToRedeem: this.state.gamesToRedeem,
                processType: "redeem"
            }

            this.props.liveScoreSingleGameRedeemPayAction(payload);
            this.setState({ redeemModalVisible: false, load: true });
        }
        else {
            this.setState({ redeemModalVisible: false });
        }
    };

    showPayModal = (key, record) => {
        if (key === "show") {
            this.setState({ payModalVisible: true, singleGameRecord: record });
        }
        else if (key === "ok") {
            let record = this.state.singleGameRecord;
            let payload = {
                userId: record.userId,
                organisationId: record.organisationId,
                competitionId: record.competitionId,
                membershipProductMappingId: record.membershipProductMappingId,
                divisionId: record.divisionId,
                registrationId: record.registrationId,
                gamesToPay: this.state.gamesToPay,
                processType: "pay"
            }

            this.props.liveScoreSingleGameRedeemPayAction(payload);
            this.setState({payModalVisible: false, load: true});
        }
        else{
            this.setState({payModalVisible: false});
        }
    };


    redeemModalView() {
        let record = this.state.singleGameRecord;
        let matchesCount = (record?.matchesCount ? record.matchesCount : 0)
        let redeemCount = (record?.redeemCount ? record.redeemCount : 0);

        return (
            <Modal
                title="Redeem"
                visible={this.state.redeemModalVisible}
                onCancel={() => this.showRedeemModal("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Save"
                onOk={() => this.showRedeemModal("ok")}
                centered
            >
                <div> {AppConstants.gamesPaid} : {matchesCount}</div>
                <div> {AppConstants.gamesRedeemed} : {redeemCount}</div>
                <InputWithHead
                        placeholder={AppConstants.gamesToRedeem}
                        value={this.state.gamesToRedeem}
                        onChange={(e) => this.setState({ gamesToRedeem: e.target.value })}
                    />
            </Modal>
        )
    }

    payModalView() {
        return (
            <Modal
                title="Redeem"
                visible={this.state.payModalVisible}
                onCancel={() => this.showPayModal("cancel")}
                okButtonProps={{ style: { backgroundColor: '#ff8237', borderColor: '#ff8237' } }}
                okText="Save"
                onOk={() => this.showPayModal("ok")}
                centered
            >
                <div> {AppConstants.howManyGames}</div>
                <InputWithHead
                    placeholder={AppConstants.totalGames}
                    value={this.state.gamesToPay}
                    onChange={(e) => this.setState({ gamesToPay: e.target.value })}
                />
            </Modal>
        )
    }

    headerView = () => {
        // let isEdit = this.props.location.state ? this.props.location.state.isEdit : null
        return (
            <div>
                <Header className="form-header-view bg-transparent d-flex align-items-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {/* {isEdit ? AppConstants.editNews : AppConstants.addNews} */}
                            {AppConstants.singleGameFees}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    contentView = () => {
        const {singleGameDataList, liveScoreSingleGameListPage, liveScoreSingleGameListTotalCount} = this.props.liveScoreDashboardState;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={singleGameDataList}
                        pagination={false}
                        loading={this.props.liveScoreDashboardState.onSingleGameLoad && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={liveScoreSingleGameListPage}
                        total={liveScoreSingleGameListTotalCount}
                        onChange={(page) => this.handleRegChangeList(page)}
                        showSizeChanger={false}
                    />
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

    render() {
        // let stateWideMsg = getKeyForStateWideMessage()
        return (
            <div className="fluid-width default-bg" style={{ paddingBottom: 10 }}>
                <Loader visible={this.props.liveScoreDashboardState.onSingleGameLoad} />
                <DashboardLayout
                    menuHeading={AppConstants.matchDay}
                    menuName={AppConstants.liveScores}
                    onMenuHeadingClick={() => history.push("./matchDayCompetitions")}
                />

                <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey = "1"/>

                {/* {stateWideMsg ? 
                <div>
                    <InnerHorizontalMenu menu="liveScoreNews" liveScoreNewsSelectedKey="21" />
                </div>
                 : 
                <div>
                    <InnerHorizontalMenu menu="liveScore" liveScoreSelectedKey={this.state.key === 'dashboard' ? '1' : "21"} />
                </div>
                    } */}

                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                        {this.redeemModalView()}
                        {this.payModalView()}
                    </Content>
                    {/* <Footer>{this.footerView()}</Footer> */}
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        liveScoreSingleGameListAction,
        liveScoreSingleGameRedeemPayAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        liveScoreDashboardState: state.LiveScoreDashboardState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveScoreSingleGameFee);
