import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Pagination, Button, Tabs, Menu } from 'antd';
import './user.css';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import {
    getUserModulePersonalDetailsAction,
    getUserModulePersonalByCompetitionAction, getUserModuleRegistrationAction,
    getUserModuleMedicalInfoAction, getUserModuleActivityPlayerAction,
    getUserModuleActivityParentAction, getUserModuleActivityScorerAction,
    getUserModuleActivityManagerAction
} from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction, } from '../../store/actions/appAction'
import { getOrganisationData } from "../../util/sessionStorage";
import moment from 'moment';
import history from '../../util/history'
import { liveScore_formateDate } from '../../themes/dateformate';
import InputWithHead from "../../customComponents/InputWithHead";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { SubMenu } = Menu;
let this_Obj = null;

const columns = [

    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    },
    {
        title: 'Membership Product',
        dataIndex: 'membershipProduct',
        key: 'membershipProduct',
        sorter: (a, b) => a.membershipProduct.localeCompare(b.membershipProduct),
    },
    {
        title: 'Membership Type',
        dataIndex: 'membershipType',
        key: 'membershipType',
        sorter: (a, b) => a.membershipType.localeCompare(b.membershipType),
    },
    {
        title: 'Fees Paid',
        dataIndex: 'feesPaid',
        key: 'feesPaid',
        sorter: (a, b) => a.feesPaid.localeCompare(b.feesPaid),
    },
    {
        title: 'Vouchers',
        dataIndex: 'vouchers',
        key: 'vouchers',
        sorter: (a, b) => a.vouchers.localeCompare(b.vouchers),
    },
    {
        title: 'Shop Purchases',
        dataIndex: 'shopPurchases',
        key: 'shopPurchases',
        sorter: (a, b) => a.shopPurchases.localeCompare(b.shopPurchases),
    },
    {
        title: "Reg.Form",
        dataIndex: "regForm",
        key: "regForm",
        render: (regForm, e) => (
            <Menu className="action-triple-dot-submenu" theme="light" mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={<img className="dot-image" src={AppImages.moreTripleDot}
                        alt="" width="16" height="16" />
                    }>
                    <Menu.Item key="1" onClick={() => this_Obj.viewRegForm(e)}>
                        <span>View</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        )
    }
];

const columnsPlayer = [

    {
        title: 'Match Id',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => a.matchId.localeCompare(b.matchId),
    },
    {
        title: 'Date',
        dataIndex: 'stateDate',
        key: 'stateDate',
        sorter: (a, b) => a.stateDate.localeCompare(b.stateDate),
        render: (stateDate, record, index) => {
            return (
                <div>
                    {stateDate != null ? moment(stateDate).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Home',
        dataIndex: 'home',
        key: 'home',
        sorter: (a, b) => a.home.localeCompare(b.home),
    },
    {
        title: 'Away',
        dataIndex: 'away',
        key: 'away',
        sorter: (a, b) => a.away.localeCompare(b.away),
    },
    {
        title: 'Result',
        dataIndex: 'teamScore',
        key: 'teamScore',
        sorter: (a, b) => a.teamScore.localeCompare(b.teamScore),
    },
    {
        title: 'Game time',
        dataIndex: 'gameTime',
        key: 'gameTime',
        sorter: (a, b) => a.gameTime.localeCompare(b.gameTime),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
        title: 'Competition',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    }

];

const columnsParent = [

    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
        title: 'DOB',
        dataIndex: 'dateOfBirth',
        key: 'dateOfBirth',
        sorter: (a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth),
        render: (dateOfBirth, record, index) => {
            return (
                <div>
                    {dateOfBirth != null ? moment(dateOfBirth).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => a.team.localeCompare(b.team),
    },
    {
        title: 'Div',
        dataIndex: 'divisionName',
        key: 'divisionName',
        sorter: (a, b) => a.divisionName.localeCompare(b.divisionName),
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    }
];

const columnsScorer = [
    {
        title: 'Start',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        render: (startTime, record, index) => {
            return (
                <div>
                    {startTime != null ? moment(startTime).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => a.matchId.localeCompare(b.matchId),
    },
    {
        title: 'Team',
        dataIndex: 'teamName',
        key: 'teamName',
        sorter: (a, b) => a.teamName.localeCompare(b.teamName),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
        title: 'Competition',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    }
];

const columnsManager = [
    {
        title: 'Match ID',
        dataIndex: 'matchId',
        key: 'matchId',
        sorter: (a, b) => a.matchId.localeCompare(b.matchId),
    },
    {
        title: 'Date',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: (a, b) => a.startTime.localeCompare(b.startTime),
        render: (startTime, record, index) => {
            return (
                <div>
                    {startTime != null ? moment(startTime).format("DD/MM/YYYY") : ""}
                </div>
            )
        }
    },
    {
        title: 'Home',
        dataIndex: 'home',
        key: 'home',
        sorter: (a, b) => a.home.localeCompare(b.home),
    },
    {
        title: 'Away',
        dataIndex: 'away',
        key: 'away',
        sorter: (a, b) => a.away.localeCompare(b.away),
    },
    {
        title: 'Results',
        dataIndex: 'teamScore',
        key: 'teamScore',
        sorter: (a, b) => a.teamScore.localeCompare(b.teamScore),
    },
    {
        title: 'Competition',
        dataIndex: 'competitionName',
        key: 'competitionName',
        sorter: (a, b) => a.competitionName.localeCompare(b.competitionName),
    },
    {
        title: 'Affiliate',
        dataIndex: 'affiliate',
        key: 'affiliate',
        sorter: (a, b) => a.affiliate.localeCompare(b.affiliate),
    }
];

const columnsPersonalAddress = [
    {
        title: 'Street',
        dataIndex: 'street',
        key: 'street'
    },
    {
        title: 'Suburb',
        dataIndex: 'suburb',
        key: 'suburb'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    },
    {
        title: 'Postcode',
        dataIndex: 'postalcode',
        key: 'postalcode'
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    }
];

const columnsPersonalPrimaryContacts = [
    {
        title: 'Name',
        dataIndex: 'parentName',
        key: 'parentName'
    },
    {
        title: 'Street',
        dataIndex: 'street',
        key: 'street'
    },
    {
        title: 'Suburb',
        dataIndex: 'suburb',
        key: 'suburb'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    },
    {
        title: 'Postcode',
        dataIndex: 'postalcode',
        key: 'postalcode'
    },
    {
        title: 'Phone Number',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber'
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    }
];

const columnsPersonalEmergency = [
    {
        title: 'Name',
        dataIndex: 'emergencyContactName',
        key: 'emergencyContactName'
    },
    {
        title: 'Phone Number',
        dataIndex: 'emergencyContactNumber',
        key: 'emergencyContactNumber'
    }
];

const columnsFriends = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Phone Number',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
    },
];

const columnsPlayedBefore = [
    {
        title: 'Played Before',
        dataIndex: 'playedBefore',
        key: 'playedBefore'
    },
    {
        title: 'Played Club',
        dataIndex: 'playedClub',
        key: 'playedClub',
    },
    {
        title: 'Played Grade',
        dataIndex: 'playedGrade',
        key: 'playedGrade',
    },
    {
        title: 'Played Year',
        dataIndex: 'playedYear',
        key: 'playedYear',
    },
    {
        title: 'Last Captain',
        dataIndex: 'lastCaptainName',
        key: 'lastCaptainName',
    },
];

const columnsFav = [
    {
        title: 'Favourite Netball Team',
        dataIndex: 'favouriteTeam',
        key: 'favouriteTeam'
    },
    {
        title: 'Who is your favourite Firebird?',
        dataIndex: 'favouriteFireBird',
        key: 'favouriteFireBird',
    }
];

const columnsVol = [
    {
        title: 'Volunteers',
        dataIndex: 'description',
        key: 'description'
    }
];

const columnsMedical = [
    {
        title: 'Disability Type',
        dataIndex: 'disabilityType',
        key: 'disabilityType'
    },
    {
        title: 'Disability Care Number',
        dataIndex: 'disabilityCareNumber',
        key: 'disabilityCareNumber'
    }
];


class UserModulePersonalDetail extends Component {
    constructor(props) {
        super(props);
        this_Obj = this;
        this.state = {
            userId: 0,
            tabKey: "1",
            competition: null,
            screenKey: null,
            loading: false,
            registrationForm: null,
            isRegistrationForm: false,
            screen: null,
            yearRefId: 1,
            competitions: []
        }
    }

    componentWillMount(){
        console.log("componentWillMount")
        let competition =  this.getEmptyCompObj();
        this.setState({competition: competition});
        this.props.getOnlyYearListAction();
    }

   componentDidMount() {
        console.log("componentDidMount")
        if (this.props.location.state != null && this.props.location.state != undefined) {
            let userId = this.props.location.state.userId;
            let screenKey = this.props.location.state.screenKey;
            let screen = this.props.location.state.screen;
             this.setState({ userId: userId, screenKey: screenKey, screen: screen });
            this.apiCalls(userId);
            if (this.state.tabKey == "1") {
                this.hanleActivityTableList(1, userId, this.state.competition, "parent");
            }

        }
    }

    componentDidUpdate(nextProps) {
        console.log("Component componentDidUpdate");

        let userState = this.props.userState;
        let personal = userState.personalData;
        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({
                    loading: false,
                })
            }
        }

        if (this.state.competition.competitionId == null && personal.competitions != undefined &&
            personal.competitions.length > 0 
            && this.props.userState.personalData!= nextProps.userState.personalData) {
                let years = [];
                let competitions = [];
                (personal.competitions || []).map((item, index) => {
                    let obj = {
                        id: item.yearRefId
                    }
                    years.push(obj);
                });

                let yearRefId = years.length > 0 ? years[0].id : null;
                this.setState({yearRefId: yearRefId, years: years});
                if(personal.competitions!=null && personal.competitions.length > 0 && yearRefId!= null){
                    competitions = personal.competitions.filter(x=>x.yearRefId == yearRefId);
                    this.setState({competitions: competitions, competition: competitions[0] });
                    this.tabApiCalls(this.state.tabKey, competitions[0], this.state.userId);
                }
        }
    }

    apiCalls = (userId) => {
        console.log("apiCalls::" + userId);
        let payload = {
            userId: userId,
            organisationId: getOrganisationData().organisationUniqueKey
        }
        this.props.getUserModulePersonalDetailsAction(payload);
    };

    onChangeYear = (value) => {
        let userState = this.props.userState;
        let personal = userState.personalData;

        let competitions = personal.competitions.filter(x => x.yearRefId === value);
        let competition = this.getEmptyCompObj();
        if(competitions!= null && competitions.length > 0)
            competition = competitions[0]
        this.setState({ competitions: competitions, competition: competition,
        yearRefId: value });

        this.tabApiCalls(this.state.tabKey, competition, this.state.userId);
    }

    getEmptyCompObj = () =>{
        let competition =  {
            team: { teamId: 0, teamName: "" },
            divisionName: "", competitionId: null,
            competitionName: "", year: 0
        };

        return competition;
    }

    onChangeSetValue = (value) => {
        let userState = this.props.userState;
        let personal = userState.personalData;

        let competition = personal.competitions.find(x => x.competitionId === value);
        this.setState({ competition: competition });
        this.tabApiCalls(this.state.tabKey, competition, this.state.userId);
    }

    onChangeTab = (key) => {
        console.log("onChangeTab::" + key);
        this.setState({ tabKey: key, isRegistrationForm: false });
        this.tabApiCalls(key, this.state.competition, this.state.userId);
    };

    tabApiCalls = (tabKey, competition, userId) => {
        let payload = {
            userId: userId,
            competitionId: competition.competitionId
        }
        if (tabKey == "1") {
            this.hanleActivityTableList(1, userId, competition, "player");
            this.hanleActivityTableList(1, userId, competition, "parent");
            this.hanleActivityTableList(1, userId, competition, "scorer");
            this.hanleActivityTableList(1, userId, competition, "manager");
        }
        if (tabKey === "3") {
            this.props.getUserModulePersonalByCompetitionAction(payload)
        }
        else if (tabKey === "4") {
            this.props.getUserModuleMedicalInfoAction(payload)
        }
        else if (tabKey === "5") {
            this.handleRegistrationTableList(1, userId, competition);

        }
    }

    hanleActivityTableList = (page, userId, competition, key) => {
        let filter =
        {
            competitionId: competition.competitionId,
            organisationId: getOrganisationData().organisationUniqueKey,
            userId: userId,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        if (key == "player")
            this.props.getUserModuleActivityPlayerAction(filter);
        if (key == "parent")
            this.props.getUserModuleActivityParentAction(filter);
        if (key == "scorer")
            this.props.getUserModuleActivityScorerAction(filter);
        if (key == "manager")
            this.props.getUserModuleActivityManagerAction(filter);
    }

    handleRegistrationTableList = (page, userId, competition) => {
        let filter =
        {
            competitionId: competition.competitionId,
            userId: userId,
            organisationId: getOrganisationData().organisationUniqueKey,
            paging: {
                limit: 10,
                offset: (page ? (10 * (page - 1)) : 0)
            }
        }
        this.props.getUserModuleRegistrationAction(filter)
    };

    viewRegForm = async (item) => {
        await this.setState({ isRegistrationForm: true, registrationForm: item.registrationForm });
    }

    headerView = () => {
        return (
            <Header className="comp-player-grades-header-view container mb-n3" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add">{AppConstants.personalDetails}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }

    leftHandSideView = () => {
        let userState = this.props.userState;
        let personal = userState.personalData;
        let compititionId = this.state.competition!= null ? this.state.competition.competitionId : null;

        return (
            <div className="fluid-width mt-2" >

                <div className='profile-image-view mr-5' >
                    {/* <span className="user-contact-heading">{AppConstants.playerProfile}</span> */}
                    {
                        personal.photoUrl ?
                            <img className="live-score-user-image" src={personal.photoUrl} alt="" height="80" width="80" />
                            :
                            <span className="user-contact-heading">{AppConstants.noImage}</span>

                    }
                    <span className="user-contact-heading">{personal.firstName + " " + personal.lastName}</span>
                    <span className="year-select-heading pt-0">{'#' + personal.userId}</span>
                </div>


                <div className="live-score-profile-img-view">
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.calendar} alt="" height="16" width="16" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.dateOfBirth}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{liveScore_formateDate(personal.dateOfBirth) == "Invalid date" ? "" : liveScore_formateDate(personal.dateOfBirth)}</span>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.callAnswer} alt="" height="16" width="16" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.contactNumber}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{personal.mobileNumber}</span>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.circleOutline} alt="" height="16" width="16" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.competition}</span>
                        </div>
                        <Select
                            name={"yearRefId"}
                            className="user-prof-filter-select"
                            style={{ width: "100%", paddingRight: 1, paddingTop: '15px' }}
                            onChange={yearRefId => this.onChangeYear(yearRefId)}
                            value={this.state.yearRefId}>
                            {this.props.appState.yearList.map(item => {
                                return (
                                    <Option key={"yearRefId" + item.id} value={item.id}>
                                        {item.description}
                                    </Option>
                                );
                            })}
                        </Select>
                        <Select
                            className="user-prof-filter-select"
                            style={{ width: "100%", paddingRight: 1, paddingTop: '15px' }}
                            onChange={(e) => this.onChangeSetValue(e)}
                            value={compititionId}>
                            {(this.state.competitions || []).map((comp, index) => (
                                <Option key={comp.competitionId} value={comp.competitionId}>{comp.competitionName}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.group} height="16" width="16" alt="" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.team}</span>
                        </div>
                        {(this.state.competition!= null && this.state.competition.teams || []).map((item, index) => (
                            <div key={item.teamId} className="live-score-desc-text side-bar-profile-data">{item.teamName}</div>
                        ))}

                    </div>
                    <div className="live-score-side-desc-view">
                        <div className="live-score-title-icon-view">
                            <div className="live-score-icon-view">
                                <img src={AppImages.circleOutline} alt="" height="16" width="16" />
                            </div>
                            <span className='year-select-heading ml-3'>{AppConstants.division}</span>
                        </div>
                        <span className="live-score-desc-text side-bar-profile-data">{this.state.competition!= null ? this.state.competition.divisionName : null}</span>
                    </div>

                </div>
            </div>
        )
    }

    playerActivityView = () => {
        let userState = this.props.userState;
        let activityPlayerList = userState.activityPlayerList;
        let total = userState.activityPlayerTotalCount;
        return (
            <div className="comp-dash-table-view mt-2" style={{ backgroundColor: "#f7fafc" }}>
                <div className="user-module-row-heading">{AppConstants.playerHeading}</div>
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columnsPlayer}
                        dataSource={activityPlayerList}
                        pagination={false}
                        loading={userState.activityPlayerOnLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.activityPlayerPage}
                        total={total}
                        onChange={(page) => this.hanleActivityTableList(page, this.state.userId, this.state.competition, "player")}
                    />
                </div>
            </div>
        )
    }

    parentActivityView = () => {
        let userState = this.props.userState;
        let activityParentList = userState.activityParentList;
        let total = userState.activityParentTotalCount;
        return (
            <div className="comp-dash-table-view mt-2" style={{ backgroundColor: "#f7fafc" }}>
                <div className="user-module-row-heading">{AppConstants.parentHeading}</div>
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columnsParent}
                        dataSource={activityParentList}
                        pagination={false}
                        loading={userState.activityParentOnLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.activityParentPage}
                        total={total}
                        onChange={(page) => this.hanleActivityTableList(page, this.state.userId, this.state.competition, "parent")}
                    />
                </div>
            </div>
        )
    }

    scorerActivityView = () => {
        let userState = this.props.userState;
        let activityScorerList = userState.activityScorerList;
        let total = userState.activityScorerTotalCount;
        return (
            <div className="comp-dash-table-view mt-2" style={{ backgroundColor: "#f7fafc" }}>
                <div className="user-module-row-heading">{AppConstants.scorerHeading}</div>
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columnsScorer}
                        dataSource={activityScorerList}
                        pagination={false}
                        loading={userState.activityScorerOnLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.activityScorerPage}
                        total={total}
                        onChange={(page) => this.hanleActivityTableList(page, this.state.userId, this.state.competition, "scorer")}
                    />
                </div>
            </div>
        )
    }

    managerActivityView = () => {
        let userState = this.props.userState;
        let activityManagerList = userState.activityManagerList;
        let total = userState.activityScorerTotalCount;
        return (
            <div className="comp-dash-table-view mt-2" style={{ backgroundColor: "#f7fafc" }}>
                <div className="user-module-row-heading">{AppConstants.managerHeading}</div>
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columnsManager}
                        dataSource={activityManagerList}
                        pagination={false}
                        loading={userState.activityManagerOnLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.activityManagerPage}
                        total={total}
                        onChange={(page) => this.hanleActivityTableList(page, this.state.userId, this.state.competition, "manager")}
                    />
                </div>
            </div>
        )
    }

    statisticsView = () => {
        return (
            <div>
                <h4>Statistics</h4>
            </div>
        )
    }

    personalView = () => {
        let userState = this.props.userState;
        let personal = userState.personalData;
        let personalByCompData = userState.personalByCompData != null ? userState.personalByCompData : [];
        let primaryContacts = personalByCompData.length > 0 ? personalByCompData[0].primaryContacts : [];
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="user-module-row-heading">{AppConstants.address}</div>
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columnsPersonalAddress}
                        dataSource={personalByCompData}
                        pagination={false}
                    />
                </div>

                <div className="user-module-row-heading" style={{ marginTop: '30px' }}>{AppConstants.parentOrGuardianDetail}</div>
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columnsPersonalPrimaryContacts}
                        dataSource={primaryContacts}
                        pagination={false}
                    />
                </div>

                <div className="user-module-row-heading" style={{ marginTop: '30px' }}>{AppConstants.emergencyContacts}</div>
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columnsPersonalEmergency}
                        dataSource={userState.personalEmergency}
                        pagination={false}
                    />
                </div>
                <div className="user-module-row-heading" style={{ marginTop: '30px' }}>{AppConstants.otherInformation}</div>
                <div className="table-responsive home-dash-table-view" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="other-info-row" style={{ paddingTop: '10px' }}>
                        <div className="year-select-heading other-info-label" >{AppConstants.gender}</div>
                        <div className="live-score-desc-text side-bar-profile-data other-info-font">{personalByCompData != null && personalByCompData.length > 0 ? personalByCompData[0].gender : null}</div>
                    </div>
                    <div className="other-info-row">
                        <div className="year-select-heading other-info-label" >{AppConstants.countryOfBirth}</div>
                        <div className="live-score-desc-text side-bar-profile-data other-info-font">{personalByCompData != null && personalByCompData.length > 0 ? personalByCompData[0].countryName : null}</div>
                    </div>
                    <div className="other-info-row">
                        <div className="year-select-heading other-info-label">{AppConstants.nationalityReference}</div>
                        <div className="live-score-desc-text side-bar-profile-data other-info-font">{personalByCompData != null && personalByCompData.length > 0 ? personalByCompData[0].nationalityName : null}</div>
                    </div>
                    <div className="other-info-row">
                        <div className="year-select-heading other-info-label" style={{ paddingBottom: '20px' }}>{AppConstants.childLangSpoken}</div>
                        <div className="live-score-desc-text side-bar-profile-data other-info-font">{personalByCompData != null && personalByCompData.length > 0 ? personalByCompData[0].languages : null}</div>
                    </div>
                    {/* <div className="other-info-row">
                        <div className="year-select-heading other-info-label" style={{ paddingBottom: '20px' }}>{AppConstants.disability}</div>
                        <div className="live-score-desc-text side-bar-profile-data other-info-font">{personal.isDisability == 0 ? "No" : "Yes"}</div>
                    </div> */}
                </div>
            </div>
        )
    }

    medicalView = () => {
        let userState = this.props.userState;
        let medical = userState.medicalData;
        return (
            <div>
                {
                    (medical || []).map((item, index) => (
                        <div key={item.id} className="table-responsive home-dash-table-view">
                            <div style={{ marginBottom: "1%", display: 'flex' }} >
                                <div className="year-select-heading other-info-label col-sm-2">{AppConstants.existingMedConditions}</div>
                                <div className="live-score-desc-text side-bar-profile-data other-info-font" style={{ textAlign: 'left' }}>
                                    {item.existingMedicalCondition}
                                </div>
                            </div>
                            <div style={{ marginBottom: "3%", display: 'flex' }} >
                                <div className="year-select-heading other-info-label col-sm-2">{AppConstants.redularMedicalConditions}</div>
                                <div className="live-score-desc-text side-bar-profile-data other-info-font" style={{ textAlign: 'left' }}>
                                    {item.regularMedication}
                                </div>
                            </div>
                            <div style={{ marginBottom: "3%", display: 'flex' }} >
                                <div className="year-select-heading other-info-label col-sm-2">{AppConstants.disability}</div>
                                <div className="live-score-desc-text side-bar-profile-data other-info-font" style={{ textAlign: 'left' }}>
                                    {item.isDisability}
                                </div>
                            </div>
                            {
                                item.isDisability == 'Yes' ?
                                    <div className="comp-dash-table-view mt-2" style={{ paddingLeft: '0px' }}>
                                        <div className="table-responsive home-dash-table-view">
                                            <Table className="home-dashboard-table"
                                                columns={columnsMedical}
                                                dataSource={item.disability}
                                                pagination={false}
                                            />
                                        </div> </div> : null
                            }

                        </div>
                    ))
                }

            </div>
        )
    }

    registrationView = () => {
        let userState = this.props.userState;
        let userRegistrationList = userState.userRegistrationList;
        let total = userState.userRegistrationDataTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table"
                        columns={columns}
                        dataSource={userRegistrationList}
                        pagination={false}
                        loading={this.props.userState.userRegistrationOnLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.userRegistrationDataPage}
                        total={total}
                        onChange={(page) => this.handleRegistrationTableList(page, this.state.userId, this.state.competition)}
                    />
                </div>
            </div>
        )
    }

    registrationFormView = () => {
        let registrationForm = this.state.registrationForm == null ? [] : this.state.registrationForm;

        return (
            <div className="comp-dash-table-view mt-2">
                <div className="user-module-row-heading">{AppConstants.registrationFormQuestions}</div>
                {(registrationForm || []).map((item, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                        <InputWithHead heading={item.description} />
                        {
                            (item.registrationSettingsRefId == 6 || item.registrationSettingsRefId == 11) ?
                                <div className="applicable-to-text">
                                    {item.contentValue == null ? AppConstants.noInformationProvided : item.contentValue}
                                </div> : null
                        }
                        {
                            (item.registrationSettingsRefId == 7) ?
                                <div>
                                    {item.contentValue == "No" ?
                                        <div className="applicable-to-text">
                                            {item.contentValue}
                                        </div> :
                                        <div className="table-responsive home-dash-table-view">
                                            <Table className="home-dashboard-table"
                                                columns={columnsPlayedBefore}
                                                dataSource={item.playedBefore}
                                                pagination={false}
                                            />
                                        </div>
                                    }
                                </div> : null
                        }
                        {
                            (item.registrationSettingsRefId == 8) ?
                                <div className="table-responsive home-dash-table-view">
                                    <Table className="home-dashboard-table"
                                        columns={columnsFriends}
                                        dataSource={item.friends}
                                        pagination={false}
                                    />
                                </div> : null
                        }
                        {
                            (item.registrationSettingsRefId == 9) ?
                                <div className="table-responsive home-dash-table-view">
                                    <Table className="home-dashboard-table"
                                        columns={columnsFriends}
                                        dataSource={item.referFriends}
                                        pagination={false}
                                    />
                                </div> : null
                        }
                        {
                            (item.registrationSettingsRefId == 10) ?
                                <div className="table-responsive home-dash-table-view">
                                    <Table className="home-dashboard-table"
                                        columns={columnsFav}
                                        dataSource={item.favourites}
                                        pagination={false}
                                    />
                                </div> : null
                        }
                        {
                            (item.registrationSettingsRefId == 12) ?
                                <div className="table-responsive home-dash-table-view">
                                    <Table className="home-dashboard-table"
                                        columns={columnsVol}
                                        dataSource={item.volunteers}
                                        pagination={false}
                                    />
                                </div> : null
                        }
                    </div>
                ))
                }
                {registrationForm.length == 0 ?
                    <div>{AppConstants.noInformationProvided}</div> : null
                }
                <div className="row" style={{ marginTop: '50px' }}>
                    <div className="col-sm-3">
                        <div className="reg-add-save-button">
                            <Button type="cancel-button" onClick={() => this.setState({ isRegistrationForm: false })}>
                                {AppConstants.back}</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    noDataAvailable = () => {
        return (
            <div style={{display: 'flex'}}>
                <span className="inside-table-view mt-4">{AppConstants.noDataAvailable}</span>
            </div>
        )
    }

    headerView = () => {
        return (
            <div className="row" >
                <div className="col-sm">
                    <Header className="form-header-view" style={{
                        backgroundColor: "transparent",
                        display: "flex", paddingLeft: '0px',
                        alignItems: "center",
                    }} >
                        <Breadcrumb separator=" > ">
                            {/* <NavLink to="/userGraphicalDashboard" >
                            <Breadcrumb.Item separator=">" className="breadcrumb-product">{AppConstants.user}</Breadcrumb.Item>
                        </NavLink> */}
                            <NavLink to="/userTextualDashboard" >
                                <div className="breadcrumb-product">{AppConstants.userProfile}</div>
                            </NavLink>
                        </Breadcrumb>
                    </Header >
                </div>
                {this.state.screenKey == "livescore" && <div className="col-sm">
                    <div className="comp-buttons-view mt-4" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <Button onClick={() => history.push(this.state.screen)} className='primary-add-comp-form' type='primary'>
                            {AppConstants.backToLiveScore}
                        </Button>
                    </div>
                </div>}
            </div>
        )
    }

    render() {
        let {activityPlayerList, activityManagerList, activityScorerList, activityParentList} = this.props.userState;

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu={"user"} userSelectedKey={"5"} />
                <Layout className="live-score-player-profile-layout">
                    <Content className="live-score-player-profile-content">
                        <div className="fluid-width" >
                            <div className="row" >
                                <div className="col-sm-3 " style={{ marginBottom: "7%" }} >
                                    {this.leftHandSideView()}
                                </div>

                                <div className="col-sm-9" style={{ backgroundColor: "#f7fafc", }}>
                                    <div>{this.headerView()}</div>
                                    <div className="inside-table-view mt-4" >
                                        <Tabs defaultActiveKey="1" onChange={(e) => this.onChangeTab(e)}>
                                            <TabPane tab={AppConstants.activity} key="1">
                                                {activityPlayerList!= null && activityPlayerList.length > 0 && this.playerActivityView()}
                                                {activityManagerList!= null && activityManagerList.length > 0 && this.managerActivityView()}
                                                {activityScorerList!= null && activityScorerList.length > 0 && this.scorerActivityView()}
                                                {activityParentList!= null && activityParentList.length > 0 && this.parentActivityView()}
                                                {activityPlayerList.length == 0 && activityManagerList.length == 0
                                                 &&  activityScorerList.length == 0 && activityParentList.length == 0
                                                         && this.noDataAvailable()}
                                            </TabPane>
                                            <TabPane tab={AppConstants.statistics} key="2">
                                                {this.statisticsView()}
                                            </TabPane>
                                            <TabPane tab={AppConstants.personalDetails} key="3">
                                                {this.personalView()}
                                            </TabPane>
                                            <TabPane tab={AppConstants.medical} key="4">
                                                {this.medicalView()}
                                            </TabPane>
                                            <TabPane tab={AppConstants.registration} key="5">
                                                {!this.state.isRegistrationForm ?
                                                    this.registrationView() :
                                                    this.registrationFormView()
                                                }
                                            </TabPane>
                                        </Tabs>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </div>

        );
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserModulePersonalDetailsAction,
        getUserModuleMedicalInfoAction,
        getUserModuleRegistrationAction,
        getUserModulePersonalByCompetitionAction,
        getUserModuleActivityPlayerAction,
        getUserModuleActivityParentAction,
        getUserModuleActivityScorerAction,
        getUserModuleActivityManagerAction,
        getOnlyYearListAction,

    }, dispatch);

}

function mapStatetoProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState,
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)(UserModulePersonalDetail);