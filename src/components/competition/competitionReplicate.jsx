import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Checkbox, Select, DatePicker } from 'antd';
import './competition.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import moment from 'moment'
import history from "../../util/history";


const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker

class CompetitionReplicate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2018",
            compName: "2018 Winter",
            startDate: new Date(),
            endDate: new Date()
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
            <div className="header-view">
                <Header
                    className="form-header-view"
                    style={{
                        backgroundColor: "transparent",
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Breadcrumb
                        separator=">"
                    >
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.replicateCompetition}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>

        )
    }
    onChangeStartDate = (startDate, endDate) => {
        this.setState({
            startDate: startDate,
            endDate: endDate

        })
    }

    ////////form content view
    contentView = () => {
        return (
            <div className="content-view pt-5 ">
                <span className='form-heading'>{AppConstants.replicateWhichCompetition}</span>
                <div className="fluid-width" >
                    <div className="row pt-4" >
                        <div className="col-sm-4" >
                            <div className="row">
                                <div className="col-sm-4" >
                                    <InputWithHead heading={AppConstants.year} />
                                </div>
                                <div className="col-sm" >
                                    <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                        onChange={(year) => this.setState({ year })}
                                        value={this.state.year}
                                    >
                                        <Option value={"2018"}>{AppConstants.year2018}</Option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div className="row">
                                <div className="col-sm-4" >
                                    <InputWithHead heading={"Competition Name"} />
                                </div>
                                <div className="col-sm" >
                                    <Select
                                        style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                        onChange={(compName) => this.setState({ compName })}
                                        value={this.state.compName}
                                    >
                                        <Option value={AppConstants.winter2018}>{AppConstants.winter2018}</Option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <span className='form-heading pt-4'>{AppConstants.newCompetition}</span>
                <div className="row pt-4" >
                    <div className="col-sm" >
                        <div className="row">
                            <div className="col-sm-4" >
                                <InputWithHead heading={AppConstants.year} />
                            </div>
                            <div className="col-sm" >
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={(year) => this.setState({ year })}
                                    value={this.state.year}
                                >
                                    <Option value={"2018"}>{AppConstants.year2018}</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row pt-4" >
                    <div className="col-sm" >
                        <div className="row">
                            <div className="col-sm-4" >
                                <InputWithHead heading={AppConstants.competition_name} />
                            </div>
                            <div className="col-sm" >
                                <InputWithHead auto_complete="off" placeholder={AppConstants.competition_name} value={this.state.competitionName} onChange={(e) => this.setState({ competitionName: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row pt-4" >
                    <div className="col-sm" >
                        <div className="row">
                            <div className="col-sm-4" >
                                <InputWithHead heading={AppConstants.competitionDates} />
                            </div>
                            <div className="col-sm" >
                                <RangePicker
                                    size='large'
                                    onChange={(date) => this.onChangeStartDate(moment(date[0]).format("YYYY-MM-DD"), moment(date[1]).format("YYYY-MM-DD"))}
                                    format={"DD-MM-YYYY"}
                                    style={{ width: "100%", minWidth: 180 }}
                                    value={[moment(this.state.startDate), moment(this.state.endDate)]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <span className='form-heading pt-4'>{AppConstants.replicateSetting}</span>

                <div className="fluid-width" style={{ paddingLeft: "inherit" }}>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.competitionLogo}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.competitionDetails}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.competitionType}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.nonPlayingDates}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.registration_type}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.registrationFees}</Checkbox>
                    </div>

                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.venues}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.fixtures}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" style={{ paddingLeft: 30 }} defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.divisions}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" style={{ paddingLeft: 30 }} defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.grades}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" style={{ paddingLeft: 30 }} defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.teams}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" style={{ paddingLeft: 30 }} defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.venuePreferences}</Checkbox>
                    </div>
                    <div className="row"  >
                        <Checkbox className="comp-replicate-single-checkbox" style={{ paddingLeft: 30 }} defaultChecked={true} onChange={(e) => this.onChange(e)}>{AppConstants.timeSlot}</Checkbox>
                    </div>
                </div>
            </div>
        )
    }

    cancelCall = () => {
        history.push('/competitionDashboard')
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm" >
                            <div className="reg-add-save-button">
                                <Button onClick={() => this.cancelCall()} className="cancelBtnWidth" type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div className="comp-buttons-view">
                                <Button className="open-reg-button" className="publish-button" type="primary">{AppConstants.review}</Button>
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
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"1"} />
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
export default CompetitionReplicate;
