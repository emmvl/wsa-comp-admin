import React, { Component } from "react";
import { Layout, Breadcrumb, Table, Select, Menu, Pagination } from 'antd';
import './user.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { NavLink } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { getOrganisationData } from "../../util/sessionStorage";
import {getUserDashboardTextualAction} from "../../store/actions/userAction/userAction";
import { getOnlyYearListAction } from '../../store/actions/appAction'
import { getGenderAction } from '../../store/actions/commonAction/commonAction';
import moment from 'moment';
import InputWithHead from "../../customComponents/InputWithHead";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { SubMenu } = Menu;
let this_Obj = null;

const columns = [

    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (name, record) =>
        <NavLink to={{ pathname: `/userPersonal`, state: {userId: record.userId} }}>
            <span className="input-heading-add-another pt-0" >{name}</span>
        </NavLink>
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        sorter: (a, b) => a.role.localeCompare(b.role),
        render: (role, record, index) => {
            
            return (
                <div>
                    {(role || []).map((item, index) => (
                        <div key={item.roleId}>{item.role}</div>
                    ))}
                </div>
            )
        }
    },
    {
        title: 'Linked',
        dataIndex: 'linked',
        key: 'linked',
        sorter: (a, b) => a.linked.localeCompare(b.linked),
        render: (linked, record, index) => {
            return (
                <div>
                    {(linked || []).map((item, index) => (
                        <div key={item.linkedEntityId}>{item.linked}</div>
                    ))}
                </div>
            )
        }
    },
    {
        title: 'Competition',
        dataIndex: 'competition',
        key: 'competition',
        sorter: (a, b) => a.competition.localeCompare(b.competition),
        render: (competition, record, index) => {
            return (
                <div>
                    {(competition || []).map((item, index) => (
                        <div key={item.competitionId}>{item.competitionName}</div>
                    ))}
                </div>
            )
        }
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => a.team.localeCompare(b.team),
        render: (team, record, index) => {
            return (
                <div>
                    {(team || []).map((item, index) => (
                        <div key={item.teamId}>{item.team}</div>
                    ))}
                </div>
            )
        }
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
        title: "Action",
        dataIndex: "isUsed",
        key: "isUsed",
        render: (isUsed, e) => (
            isUsed == false ? <Menu 
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <SubMenu
                    key="sub1"
                    title={ <img className="dot-image" src={AppImages.moreTripleDot}
                            alt="" width="16" height="16" /> }>
                    <Menu.Item key="1">
                        <NavLink to={{ pathname: `/userPersonal`, state: {userId: e.userId} }} >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => this_Obj.showDeleteConfirm(e.id)}>
                        <span>Delete</span>
                    </Menu.Item>
                </SubMenu>
            </Menu> : null
        )
    }
];

class UserTextualDashboard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData().organisationUniqueKey,
            yearRefId: -1,
            competitionUniqueKey: '-1',
            roleId: -1,
            genderRefId: -1,
            linkedEntityId: '-1',
            postalCode: '',
            searchText: '',
            deleteLoading: false,
        }
        this_Obj = this;
    }

    componentDidMount(){
        this.referenceCalls();
        this.handleTextualTableList(1)
    }

    componentDidUpdate(nextProps){
        console.log("Component componentDidUpdate");
       let userState = this.props.userState;
        if (userState.onLoad === false && this.state.loading === true) {
            if (!userState.error) {
                this.setState({
                    loading: false,
                })
            }
        }
    }

    referenceCalls = () => {
        this.props.getGenderAction();
        this.props.getOnlyYearListAction();
    }

    onChangeDropDownValue = async (value, key) => {
        if(key == "yearRefId"){
          await this.setState({yearRefId: value});
          this.handleTextualTableList(1);
        }
        else if (key == "competitionId"){
            await   this.setState({competitionUniqueKey: value});
            this.handleTextualTableList(1);
        }
        else if (key == "genderRefId"){
            await this.setState({genderRefId: value});
            this.handleTextualTableList(1);
        }
        else if (key == "linkedEntityId"){
            await  this.setState({linkedEntityId: value});
            this.handleTextualTableList(1);
        }
        else if (key == "roleId"){
            await  this.setState({roleId: value});
            this.handleTextualTableList(1);
        }
        else if(key == "postalCode"){
            const regex = /,/gi;
            let canCall = false;
            let newVal = value.toString().split(',');
            newVal.map((x,index) => {
                console.log("Val::" + x + "**" + x.length);
                if(Number(x.length)%4 == 0 &&  x.length > 0){
                    canCall = true;
                }
                else{
                    canCall = false; 
                }
            })


            await this.setState({postalCode: value});
            if(canCall){
                this.handleTextualTableList(1);
           }
           else if(value.length == 0)
           {
            this.handleTextualTableList(1);
           }
        }
    }


    handleTextualTableList = (page) => {
        console.log("RoleId:;" + this.state.roleId);
        let filter = 
        {
            organisationId: this.state.organisationId,
            yearRefId:this.state.yearRefId,
            competitionUniqueKey: this.state.competitionUniqueKey,
            roleId: this.state.roleId,
            genderRefId: this.state.genderRefId,
            linkedEntityId: this.state.linkedEntityId,
            postCode: (this.state.postalCode!= '' && this.state.postalCode!= null) ? this.state.postalCode.toString() : '-1',
            searchText: this.state.searchText,
            paging : {
                limit : 10,
                offset: (page ? (10 * (page -1)) : 0)
            }
        }
        this.props.getUserDashboardTextualAction(filter);
    };

     ///////view for breadcrumb
     headerView = () => {
        return (
            <Header className="comp-player-grades-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add">{AppConstants.userProfile}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }

      ///dropdown view containing all the dropdown of header
      dropdownView = () => {
        let uniqueValues = [];
        const {genderData} = this.props.commonReducerState;
        const {competitions, organisations, roles} = this.props.userState;
        let competitionList = [];
        if(this.state.yearRefId != -1){
            competitionList = competitions.filter(x=>x.yearRefId == this.state.yearRefId);
        }
        else{
            competitionList =  competitions;
        }
        
        return (
            <div style={{paddingLeft: '3.0%'}}>
                <div className="fluid-width" >
                    <div className="row user-filter-row" >
                        <div className="user-col" >
                            <div className="user-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.year}</div>
                                <Select
                                    name={"yearRefId"}
                                    className="year-select user-filter-select"
                                    onChange={yearRefId => this.onChangeDropDownValue(yearRefId, "yearRefId")}
                                    value={this.state.yearRefId}>
                                        <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {this.props.appState.yearList.map(item => {
                                        return (
                                            <Option key={"yearRefId" + item.id} value={item.id}>
                                                {item.description}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="user-col" >
                            <div className="user-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.competition}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select user-filter-select1"
                                    onChange={competitionId => this.onChangeDropDownValue(competitionId, "competitionId")}
                                    value={this.state.competitionUniqueKey}>
                                        <Option key={-1} value={'-1'}>{AppConstants.all}</Option>
                                    {(competitionList || []).map((item,cIndex) => {
                                        return (
                                            <Option key={"competition" + item.competitionUniqueKey + "" + cIndex} value={item.competitionUniqueKey}>
                                                {item.name}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                        </div>
                        <div className="user-col" >
                            <div  className="user-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.roles}</div>
                                <Select
                                    className="year-select user-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'roleId')}
                                    value={this.state.roleId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(roles || []).map((org, index) => (
                                        <Option key={org.id} value={org.id}>{org.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="user-col" >
                            <div  className="user-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.gender}</div>
                                <Select
                                    className="year-select user-filter-select"
                                    onChange={(e) => this.onChangeDropDownValue(e, 'genderRefId')}
                                    value={this.state.genderRefId}>
                                    <Option key={-1} value={-1}>{AppConstants.all}</Option>
                                    {(genderData || []).map((g, index) => (
                                        <Option key={g.id} value={g.id}>{g.description}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="row reg-filter-row" >
                        <div className="reg-col" >
                            <div  className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.affiliate}</div>
                                <Select
                                    showSearch
                                    optionFilterProp="children"
                                    className="year-select reg-filter-select"
                                    style={{ minWidth: 100 }}
                                    onChange={(e) => this.onChangeDropDownValue(e, 'linkedEntityId')}
                                    value={this.state.linkedEntityId}>
                                    <Option key={'-1'} value={'-1'}>{AppConstants.all}</Option>
                                    {(organisations || []).map((g, index) => (
                                        <Option key={g.organisationUniqueKey} value={g.organisationUniqueKey}>{g.name}</Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="reg-col" >
                            <div  className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.postCode}</div>
                                <InputWithHead
                                    placeholder={AppConstants.postCode}
                                    onChange={(e) => this.onChangeDropDownValue(e.target.value, 'postalCode')}
                                    value={this.state.postalCode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        let userState = this.props.userState;
        let userDashboardTextualList = userState.userDashboardTextualList;
        let total = userState.userDashboardTextualTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table" 
                    columns={columns}
                    dataSource={userDashboardTextualList} 
                    pagination={false}
                    loading={this.props.userState.onTextualLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.userDashboardTextualPage}
                        total={total}
                        onChange={(page) => this.handleTextualTableList(page)}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu={"user"} userSelectedKey={"4"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>

        );
    }

}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getUserDashboardTextualAction,
        getOnlyYearListAction,
        getGenderAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        userState: state.UserState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState,
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(UserTextualDashboard);