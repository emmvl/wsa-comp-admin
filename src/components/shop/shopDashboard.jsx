import React, { Component } from "react";
import { Layout, Button, Table, Select } from 'antd';
import './shop.css';
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from '../../customComponents/loader';
import history from "../../util/history";

const { Footer, Content } = Layout;
const { Option } = Select;


class ShopDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
        }

    }


    componentDidMount() {
       
    }

    


    render() {

        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.shop} menuName={AppConstants.shop} />
                <InnerHorizontalMenu menu={"shop"} shopSelectedKey={"1"} />
                <Layout>
                    <Content className="comp-dash-table-view">
                        {/* <span>SHOP DASHBOARD</span> */}
                    </Content>
                    {/* <Loader
                        visible={this.props.appState.onLoad} /> */}
                    <Footer></Footer>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
       
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
       

    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((ShopDashboard));
