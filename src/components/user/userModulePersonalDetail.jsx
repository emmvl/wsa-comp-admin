import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Pagination, Button,Tabs  } from 'antd';
import './user.css';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import {getUserModulePersonalDetailsAction,
    getUserModulePersonalByCompetitionAction, getUserModuleRegistrationAction,
    getUserModuleMedicalInfoAction, getUserModuleActivityPlayerAction,
    getUserModuleActivityParentAction,getUserModuleActivityScorerAction,
    getUserModuleActivityManagerAction} from "../../store/actions/userAction/userAction";
import moment from 'moment';
import history from '../../util/history'
import { liveScore_formateDate } from '../../themes/dateformate'

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

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
                   {stateDate!= null ? moment(stateDate).format("DD/MM/YYYY") : ""}
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
                   {dateOfBirth!= null ? moment(dateOfBirth).format("DD/MM/YYYY") : ""}
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
                   {startTime!= null ? moment(startTime).format("DD/MM/YYYY") : ""}
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
                   {startTime!= null ? moment(startTime).format("DD/MM/YYYY") : ""}
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
class UserModulePersonalDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userId: 0,
            tabKey: "1",
            competition: {
                team:{teamId: 0, teamName: ""},
                divisionName: "",competitionUniqueKey: "",
                competitionName:"",year:0
            },
            loading: false,
        }
    }

    componentDidMount()
    {
        if(this.props.location.state != null && this.props.location.state!= undefined){
            let userId = this.props.location.state.userId;
            this.setState({ userId: userId});
            this.apiCalls(userId);
            
        }
    }

    componentDidUpdate(nextProps){
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

        if(this.state.competition.competitionUniqueKey == "" && personal.competitions != undefined)
        {
            this.setState({competition: personal.competitions[0]})
            this.tabApiCalls(this.state.tabKey,personal.competitions[0], this.state.userId );
        }
    }

    apiCalls = (userId) => {
        console.log("apiCalls::" + userId);
        this.props.getUserModulePersonalDetailsAction(userId);
    };

    onChangeSetValue = (value) =>{
        let userState = this.props.userState;
        let personal = userState.personalData;

        let competition = personal.competitions.find(x=>x.competitionUniqueKey === value);
        this.setState({competition: competition});
        this.tabApiCalls(this.state.tabKey, competition, this.state.userId);
    }

    onChangeTab = (key) => {
        console.log("onChangeTab::" + key);
        this.setState({ tabKey: key });
        this.tabApiCalls(key, this.state.competition, this.state.userId);
    };

    tabApiCalls = (tabKey, competition, userId) => {
        let payload = {
            userId: userId,
            competitionUniqueKey: competition.competitionUniqueKey
        }
        if(tabKey == "1")
        {
            this.hanleActivityTableList(1, userId, competition, "player");
            this.hanleActivityTableList(1, userId, competition, "parent");
            this.hanleActivityTableList(1, userId, competition, "scorer");
            this.hanleActivityTableList(1, userId, competition, "manager");
        }
        if(tabKey === "3"){
            this.props.getUserModulePersonalByCompetitionAction(payload)
        }
        else if(tabKey === "4"){
            this.props.getUserModuleMedicalInfoAction(payload)
        }
        else if(tabKey === "5"){
            this.handleRegistrationTableList(1, userId, competition);
            
        }
    }

    hanleActivityTableList = (page, userId, competition, key) => {
        let filter = 
        {
            competitionUniqueKey: competition.competitionUniqueKey,
            userId: userId,
            paging : {
                limit : 10,
                offset: (page ? (10 * (page -1)) : 0)
            }
        }
        if(key == "player")
            this.props.getUserModuleActivityPlayerAction(filter);
        if(key == "parent")
            this.props.getUserModuleActivityParentAction(filter);
        if(key == "scorer")
            this.props.getUserModuleActivityScorerAction(filter);
        if(key == "manager")
            this.props.getUserModuleActivityManagerAction(filter);
    }

    handleRegistrationTableList = (page, userId, competition) => {
        let filter = 
        {
            competitionUniqueKey: competition.competitionUniqueKey,
            userId: userId,
            paging : {
                limit : 10,
                offset: (page ? (10 * (page -1)) : 0)
            }
        }
        this.props.getUserModuleRegistrationAction(filter)
    };

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
       
        return (
            <div className="fluid-width mt-2" >

            <div className='profile-image-view mr-5' >
                <span className="user-contact-heading">{AppConstants.playerProfile}</span>
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
                            style={{ width: "100%", paddingRight: 1, paddingTop: '15px' }}
                            onChange={(e) => this.onChangeSetValue(e)}
                            value={this.state.competition.competitionUniqueKey}>
                            {(personal.competitions || []).map((comp, index) => (
                                <Option key={comp.competitionUniqueKey} value={comp.competitionUniqueKey}>{comp.competitionName}</Option>
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
                    <span className="live-score-desc-text side-bar-profile-data">{this.state.competition.team!= null ? this.state.competition.team.teamName : ""}</span>
                </div>
                <div className="live-score-side-desc-view">
                    <div className="live-score-title-icon-view">
                        <div className="live-score-icon-view">
                            <img src={AppImages.circleOutline} alt="" height="16" width="16" />
                        </div>
                        <span className='year-select-heading ml-3'>{AppConstants.division}</span>
                    </div>
                    <span className="live-score-desc-text side-bar-profile-data">{this.state.competition.divisionName}</span>
                </div>
               
            </div>
        </div>
        )
    }

    playerActivityView = () => {
        let userState = this.props.userState;
        let activityPlayerList = userState.activityPlayerList;
        let total = userState.activityPlayerTotalCount;
        return(
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
        return(
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
        return(
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
        return(
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
        let personalByCompData = userState.personalByCompData;
        return(
            <div>
                <div style={{ marginBottom: "7%" }} >
                    <div className="user-module-row-heading">{AppConstants.address}</div>
                    <div className="user-module-divider"></div>
                    <div className="user-module-personal-row" style={{marginTop: '10px'}}>
                        <div className="col-sm-5" style={{paddingLeft: '0px'}}>
                            {personalByCompData.street1 == undefined ? "" : personalByCompData.street1  + " " + 
                            personalByCompData.street2  == undefined ? "" : personalByCompData.street2+ " " + 
                            personalByCompData.suburb == undefined ? "": personalByCompData.suburb + " "+ 
                            personalByCompData.state == undefined ? " ": personalByCompData.state}
                        </div>
                        <div  className="col-sm-3" style={{paddingLeft: '0px'}}>
                            {personalByCompData.mobileNumber}
                        </div>
                        <div  className="col-sm-3" style={{paddingLeft: '0px'}}>
                            {personalByCompData.email}
                        </div>
                    </div>
                </div>
                <div style={{ marginBottom: "7%" }} >
                    <div className="user-module-row-heading">{AppConstants.primaryContact}</div>
                    <div className="user-module-divider"></div>
                    
                    {(personalByCompData.primaryContacts || []).map((item, index) => (
                        <div key={item.userId} style={{marginTop: '10px', color: 'var(--app-1b1b34)', fontSize: '14px', fontFamily: 'inter-medium'}}>
                            <div style={{fontSize: '15px', marginBottom: '10px'}}>
                                {item.parentName}
                            </div>
                            <div style={{display: 'flex', marginBottom: '20px'}}>
                            <div className="col-sm-5 user-module-personal-row">
                            {item.street1 == null ? "" :  item.street1+ " " + 
                            item.street2 == null ? "" : item.street2+ " " + 
                            item.suburb == null ? "" : item.suburb + " "+ 
                            item.state == null ? "" : item.state}
                            </div>
                            <div className="col-sm-3 user-module-personal-row">{item.mobileNumber}</div>
                                <div className="col-sm-3 user-module-personal-row">{item.email}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginBottom: "7%" }} >
                    <div className="user-module-row-heading">{AppConstants.emergencyContacts}</div>
                    <div className="user-module-divider"></div>
                    <div  style={{marginTop: '10px', display:'flex'}}>
                        <div className="col-sm-4 user-module-personal-row">{personal.emergencyContactName}</div>
                        <div className="col-sm-4 user-module-personal-row">{personal.emergencyContactNumber}</div>
                    </div>
                </div>
                <div style={{ marginBottom: "7%" }} >
                    <div className="user-module-row-heading">{AppConstants.otherInformation}</div>
                    <div className="user-module-divider"></div>
                    <div style={{display: 'flex', marginTop: '10px'}}>
                        <div className="col-sm-3" style={{paddingLeft: '0px'}}>
                            <div style={{fontSize: '14px'}}>{AppConstants.countryOfBirth}</div>
                            <div className="user-module-personal-row">{personal.countryName}</div>
                        </div>
                        <div className="col-sm-3" style={{paddingLeft: '0px'}}>
                            <div style={{fontSize: '14px'}}>{AppConstants.nationalityReference}</div>
                            <div className="user-module-personal-row">{personal.nationalityName}</div>
                        </div>
                        <div className="col-sm-4" style={{paddingLeft: '0px'}}>
                            <div style={{fontSize: '14px'}}>{AppConstants.childLangSpoken}</div>
                            <div className="user-module-personal-row">{personal.languages}</div>
                        </div>
                        <div className="col-sm-3" style={{paddingLeft: '0px'}}>
                            <div style={{fontSize: '14px'}}>{AppConstants.disability}</div>
                            <div className="user-module-personal-row">{personal.isDisability == 0 ? "False": "True"}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    medicalView = () => {
        let userState = this.props.userState;
        let medical = userState.medicalData;
        return(
            <div>
                {
                    (medical || []).map((item, index) => (
                        <div key={item.id}>
                            <div style={{ marginBottom: "7%" }} >
                                <div className="user-module-row-heading">{AppConstants.existingMedConditions}</div>
                                <div className="user-module-divider"></div>
                                <div style={{color: 'var(--app-1b1b34)', fontSize: '14px', fontFamily: 'inter-medium', marginTop: '10px'}}>
                                    {item.existingMedicalCondition}
                                </div>
                            </div>
                            <div style={{ marginBottom: "7%" }} >
                                <div className="user-module-row-heading">{AppConstants.redularMedicalConditions}</div>
                                <div className="user-module-divider"></div>
                                <div style={{color: 'var(--app-1b1b34)', fontSize: '14px', fontFamily: 'inter-medium', marginTop: '10px'}}>
                                    {item.regularMedication}
                                </div>
                            </div>
                        </div>
                    ))
                }
                
            </div>
        )
    }

    registrationView = () => {
        let userState = this.props.userState;
        let userRegistrationList =  userState.userRegistrationList;
        let total = userState.userRegistrationDataTotalCount;
        return(
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
                        onChange={(page) => this.handleRegistrationTableList(page)}
                    />
                </div>
            </div>
        )
    }

    headerView = () => {
        return (
            <div>
                <Header className="form-header-view" style={{
                    backgroundColor: "transparent",
                    display: "flex", paddingLeft: '0px',
                    alignItems: "center",
                }} >
                    <Breadcrumb separator=" > ">
                        <NavLink to="/userGraphicalDashboard" >
                            <Breadcrumb.Item separator=">" className="breadcrumb-product">{AppConstants.user}</Breadcrumb.Item>
                        </NavLink>
                        <NavLink to="/userTextualDashboard" >
                            <Breadcrumb.Item separator=">" className="breadcrumb-product">{AppConstants.textualDashboard}</Breadcrumb.Item>
                        </NavLink>
                    </Breadcrumb>
                </Header >
            </div>
        )
    }

    render() {
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
                                                {this.playerActivityView()}
                                                {this.parentActivityView()}
                                                {this.scorerActivityView()}
                                                {this.managerActivityView()}
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
                                                {this.registrationView()}
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

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getUserModulePersonalDetailsAction,
        getUserModuleMedicalInfoAction,
        getUserModuleRegistrationAction,
        getUserModulePersonalByCompetitionAction,
        getUserModuleActivityPlayerAction,
        getUserModuleActivityParentAction,
        getUserModuleActivityScorerAction,
        getUserModuleActivityManagerAction

    }, dispatch);

}

function mapStatetoProps(state){
    return {
        userState: state.UserState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(UserModulePersonalDetail);