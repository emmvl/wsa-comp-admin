import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal, DatePicker } from "antd";
import './user.css';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getOrganisationData, getGlobalYear, setGlobalYear } from "../../util/sessionStorage";

const { Footer, Content } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { SubMenu } = Menu;
let this_Obj = null

class AddTeamMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organisationId: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            yearRefId: null,
            pageNo: 1,
            sortBy: null,
            sortOrder: null
        }
        this_Obj = this
    }

    componentDidMount() {
       
    }

    referenceCalls = () => {
    }

    componentDidUpdate(nextProps) {

    }


    headerView = () => {
        return (
            <div className="comp-player-grades-header-view-design">
                <div className="row">
                    <div className="col-sm d-flex align-content-center">
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.addTeamMembers}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </div>
        )
    }

    contentView = () => {
        return (
            <div >
               
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
       
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        userState: state.UserState,
        appState: state.AppState
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((AddTeamMember));
