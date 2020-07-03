import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Radio } from 'antd';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import history from "../../util/history";


const { Header, Footer, Content } = Layout;


class QuickCompetitionInvitations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "import",
            value2: "roundRobin",
            fixTemplate: "standardRoundRobin",
            finalFixTemplate: "noFinals",
            matchType: "halves",
            matchFormat: "allAgesGrades",
            valueFrequency: "weekly",
            year: "2019",
            competition: "2019winter",
            division: "12years"

        }
    }


    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    };

    onChangeRadio = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    onChangeRadio2 = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value2: e.target.value,
        });
    }
    onChangeRadioFrequency = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            valueFrequency: e.target.value,
        });
    }
    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-product">{AppConstants.winter_2019}</Breadcrumb.Item>
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.quickCompetition2}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }


    ////////form content view
    contentView = () => {

        return (
            <div className="content-view pt-5 mt-0 ">
                <span className='form-heading'>{AppConstants.how_Add_teams_players}</span>
                <Radio.Group className="reg-competition-radio" onChange={this.onChangeRadio} value={this.state.value} defaultValue={"4rounds"}>
                    <Radio value={"import"}>{AppConstants.import}</Radio>
                    <Radio value={"addManully"}>{AppConstants.addManually}</Radio>
                    <Radio value={"merge"}>{AppConstants.Merge_ExistingCompetition}</Radio>
                    <Radio value={"invite"}>{AppConstants.inviteRegistration}</Radio>
                </Radio.Group>

            </div>


        )
    }




    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm-3" >
                            <div className="reg-add-save-button">

                                <Button type="cancel-button" htmlType="submit" onClick={() => this.cancelCall()} >{AppConstants.back}</Button>
                            </div>
                        </div>
                        <div className="col-sm-9" >
                            <div className="comp-buttons-view">
                                <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveAsDraft}</Button>

                                <NavLink to="/quickCompetitionMatchFormat" >
                                    <Button className="open-reg-button" type="primary">{AppConstants.addCompetitionFormat}</Button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    cancelCall = () => {
        history.push('/quickCompetition');
    }



    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"2"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>
                    </Content>
                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>

        );
    }
}
export default QuickCompetitionInvitations;
