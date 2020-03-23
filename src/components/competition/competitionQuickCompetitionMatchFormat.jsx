import React, { Component } from "react";
import { Layout, Breadcrumb, Select, Checkbox, Button, Radio } from 'antd';
import { NavLink } from 'react-router-dom';
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class QuickCompetitionMatchFormat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "regProduct",
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
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.quickCompetition3}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }





    ////////form content view
    contentView = () => {
        const applyTo1 = ["All Divisions", "AR1", "AR2", "16", "15", "NetSetGo"]
        const applyTo2 = ["14", "13", "12", "11", "10"]
        return (
            <div className="content-view pt-5 mt-0">
                <div >
                    <Radio.Group className="reg-competition-radio" onChange={this.onChangeRadio2} value={this.state.value2} defaultValue={"roundRobin"}>
                        <div className="fluid-width" >
                            <div className="row" >
                                <div className="col-sm" >
                                    <Radio value={"roundRobin"}>{AppConstants.roundRobin}</Radio>
                                </div>
                                <div className="col-sm" style={{ display: "flex", alignItems: "center" }}>
                                    <Radio value={"knockOut"}>{AppConstants.knockOut}</Radio>

                                </div>
                            </div>
                        </div>

                    </Radio.Group>
                </div>
                <Checkbox className="single-checkbox pt-3" defaultChecked={false} onChange={(e) => this.onChange(e)}>{AppConstants.use_default_competitionFormat}</Checkbox>




                <InputWithHead heading={"Fixture Template"} />
                <Select
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={(fixTemplate) => this.setState({ fixTemplate })}
                    value={this.state.fixTemplate}
                >
                    <Option value={"standardRoundRobin"}>{AppConstants.standard_round_robin}</Option>
                </Select>


                <InputWithHead heading={"Match Type"} />
                <Select
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={(matchType) => this.setState({ matchType })}
                    value={this.state.matchType}
                >
                    <Option value={"halves"}>{AppConstants.halves}</Option>
                </Select>


                <InputWithHead heading={AppConstants.numberOfRounds} placeholder={AppConstants.numberOfRounds} />
                <span className="applicable-to-heading">{AppConstants.frequency}</span>
                <Radio.Group className="reg-competition-radio" onChange={this.onChangeRadioFrequency} value={this.state.valueFrequency} defaultValue={"weekly"}>
                    <div className="fluid-width" >
                        <div className="row" >
                            <div className="col-sm" >
                                <Radio value={"weekly"}>{AppConstants.weekly}</Radio>
                            </div>
                            <div className="col-sm" style={{ display: "flex", alignItems: "center" }}>
                                <Radio value={"tournament"}>{AppConstants.tournament}</Radio>

                            </div>
                        </div>
                    </div>

                </Radio.Group>

                <InputWithHead heading={AppConstants.timeBetweenRounds} />
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm mb-3 " >
                            <InputWithHead placeholder={AppConstants.days} />
                        </div>
                        <div className="col-sm mb-3" >
                            <InputWithHead placeholder={AppConstants.hours} />

                        </div>
                        <div className="col-sm " >
                            <InputWithHead placeholder={AppConstants.mins} />
                        </div>
                    </div>
                </div>




                <div className="fluid-width"  >
                    <span className="applicable-to-heading" >{AppConstants.applyMatchFormat} </span>
                    <div className="fluid-width" >
                        <div className="row" >
                            <div className="col-sm" >
                                <Checkbox.Group style={{ display: "-ms-flexbox", flexDirection: 'column', justifyContent: 'center', }} options={applyTo1}
                                    defaultValue={["All Divisions", "AR1", "AR2", "16", "15", "NetSetGo"]} onChange={(e) => this.onChange(e)} />
                            </div>
                            <div className="col-sm" style={{ paddingTop: 1 }}>
                                <Checkbox.Group style={{ display: "-ms-flexbox", flexDirection: 'column', justifyContent: 'center', }} options={applyTo2}
                                    defaultValue={["13", "12", "11", "10", "14"]} onChange={(e) => this.onChange(e)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.matchDuration} placeholder={AppConstants.mins} />
                        </div>
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.mainBreak} placeholder={AppConstants.mins} />

                        </div>
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.qtrBreak} placeholder={AppConstants.mins} />
                        </div>
                    </div>
                </div>



                <NavLink to="/competitionFinals" >
                    <span className='input-heading-add-another'>{AppConstants.SetUP_Template_Optional}</span>
                </NavLink>
                <span className='input-heading-add-another'>+ {AppConstants.addNewCompetitionFormat}</span>

                <Checkbox className="single-checkbox pt-3" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.setAsDefault}</Checkbox>

            </div>


        )
    }




    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm" style={{ display: 'flex', alignItems: "flex-start" }}>
                            {/* <Button type="cancel-button">Cancel</Button> */}
                        </div>
                        <div className="col-sm" >
                            <div className="comp-finals-button-view">
                                <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveDraft}</Button>
                                {/* <a href=" https://comp-management-test.firebaseapp.com/draws.html"> */}
                                <NavLink to="competitionDraws">
                                    <Button className="open-reg-button" type="primary">{AppConstants.createDraftDraw}</Button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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
export default QuickCompetitionMatchFormat;
