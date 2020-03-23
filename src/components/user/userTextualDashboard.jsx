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
import moment from 'moment';

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
            <span class="input-heading-add-another pt-0" >{name}</span>
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
                        <div key={item.competitionId}>{item.competition}</div>
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
                        <div key={item.teamId}>{item.teamName}</div>
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
                   {dateOfBirth!= null ? moment(dateOfBirth).format("DD-MM-YYYY") : ""}
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
            year: "2019winter",
            value: "playingMember",
            competition: "all",
            searchText: '',
            deleteLoading: false,
        }
        this_Obj = this;

        this.handleTextualTableList(1, this.state.organisationId, -1,'-1',-1,-1,-1,'-1')
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

    handleTextualTableList = (page, organisationId,yearRefId, competitionUniqueKey, roleId, genderRefId, linkedEntityId, postCode) => {
        let filter = 
        {
            organisationId: organisationId,
            yearRefId:yearRefId,
            competitionUniqueKey:competitionUniqueKey,
            roleId: roleId,
            genderRefId: genderRefId,
            linkedEntityId: linkedEntityId,
            postCode: postCode,
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
            <Header className="comp-player-grades-header-view container mb-n3" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add">{AppConstants.textualDashboard}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }

      ///dropdown view containing all the dropdown of header
      dropdownView = () => {
        return (
            <div >
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm" >
                            <div style={{ width: "100%", display: "flex", flexDirection: "row",
                                alignItems: "center",
                            }} >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 140 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value={"all"}>{AppConstants.all}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div style={{ width: "100%", display: "flex", flexDirection: "row",
                                alignItems: "center",
                            }} >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 140 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value={"all"}>{AppConstants.all}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div style={{ width: "100%", display: "flex", flexDirection: "row",
                                alignItems: "center",
                            }} >
                                <span className='year-select-heading'>{AppConstants.roles}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 140 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value={"all"}>{AppConstants.all}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div style={{ width: "100%", display: "flex", flexDirection: "row",
                                alignItems: "center",
                            }} >
                                <span className='year-select-heading'>{AppConstants.gender}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 140 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value={"all"}>{AppConstants.all}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div style={{ width: "100%", display: "flex", flexDirection: "row",
                                alignItems: "center",
                            }} >
                                <span className='year-select-heading'>{AppConstants.linked}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 140 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value={"all"}>{AppConstants.all}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div style={{ width: "100%", display: "flex", flexDirection: "row",
                                alignItems: "center",
                            }} >
                                <span className='year-select-heading'>{AppConstants.postCode}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 140 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value={"all"}>{AppConstants.all}</Option>
                                </Select>
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
                    loading={this.props.userState.onLoad == true && true}
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination"
                        current={userState.userDashboardTextualPage}
                        total={total}
                        onChange={(page) => this.handleTextualTableList(page, this.state.organisationId, -1,'-1',-1,-1,-1,'-1' )}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
                <InnerHorizontalMenu menu={"user"} userSelectedKey={"5"} />
                <Layout>
                    {this.headerView()}
                    <Content className="container">
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
        getUserDashboardTextualAction
    }, dispatch);

}

function mapStatetoProps(state){
    return {
        userState: state.UserState
    }
}

export default connect(mapStatetoProps,mapDispatchToProps)(UserTextualDashboard);