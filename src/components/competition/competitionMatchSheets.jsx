import { Breadcrumb, Button, Layout, Select, Checkbox, Radio } from 'antd';
import React, { Component } from "react";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import './competition.css';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class CompetitionMatchSheets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2019",
            competition: "2019winter",
            division: "all",
            grade: "all",
            teams: "all",
            value: "periods",
            gameTimeTracking: false,

        }
    }


    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };


    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view" >
                <div className="row" >
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            < Breadcrumb.Item className="breadcrumb-add">{AppConstants.matchSheets}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header >
        )
    }

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-venue-courts-dropdown-view mt-0" >
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm-2" >
                            <div className="com-year-select-heading-view" >
                                <span className='year-select-heading'>{AppConstants.year}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 75 }}
                                    onChange={(year) => this.setState({ year })}
                                    value={this.state.year}
                                >
                                    <Option value={"2019"}>{AppConstants.year2019}</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-2" >
                            <div style={{
                                width: "100%", display: "flex",
                                flexDirection: "row",
                                alignItems: "center", marginRight: 50
                            }} >
                                <span className='year-select-heading'>{AppConstants.competition}:</span>
                                <Select
                                    className="year-select"
                                    // style={{ width: 140 }}
                                    onChange={(competition) => this.setState({ competition })}
                                    value={this.state.competition}
                                >
                                    <Option value={"2019winter"}>{AppConstants.winter2019}</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    ////////form content view
    contentView = () => {
        return (
            <div className="content-view">
                <div className="fluid-width"  >
                    <div className="row" >
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.division} />

                        </div>
                        <div className="col-sm" >
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(division) => this.setState({ division })}
                                value={this.state.division}
                            >
                                <Option value={"all"}>{AppConstants.all}</Option>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="fluid-width" style={{ marginTop: 15 }} >
                    <div className="row" >
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.grade} />
                        </div>
                        <div className="col-sm" >
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(grade) => this.setState({ grade })}
                                value={this.state.grade}
                            >
                                <Option value={"all"}>{AppConstants.all}</Option>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="fluid-width" style={{ marginTop: 15 }} >
                    <div className="row" >
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.teams} />
                        </div>
                        <div className="col-sm" >
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(grade) => this.setState({ grade })}
                                value={this.state.grade}
                            >
                                <Option value={"all"}>{AppConstants.all}</Option>
                            </Select>
                        </div>
                    </div>
                </div>

                <Checkbox className="single-checkbox pt-3" defaultChecked={false} onChange={(e) => this.setState({ gameTimeTracking: e.target.checked })}>{AppConstants.gameTimeTracking}</Checkbox>
                {this.state.gameTimeTracking &&
                    <div className="comp-match-sheets-game-time-track-radio-view">
                        <Radio.Group onChange={this.onChange} value={this.state.value} defaultValue={"periods"}>
                            <Radio value={"periods"}>{AppConstants.periods}</Radio>
                            <Radio value={"minutes"}>{AppConstants.minutes}</Radio>
                        </Radio.Group>
                    </div>
                }
                <div >
                    <Checkbox className="single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.positionTracking}</Checkbox>
                </div>
                <Checkbox className="single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.shooting}%</Checkbox>

            </div>

        )
    }



    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm" >
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                <Button className="save-draft-text" type="save-draft-text">{AppConstants.preview}</Button>
                                <Button className="open-reg-button" type="primary">{AppConstants.print}</Button>
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
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} compSelectedKey={"22"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
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
export default CompetitionMatchSheets;
