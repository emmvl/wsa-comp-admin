import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Checkbox, Select } from 'antd';
import './competition.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import InputWithHead from "../../customComponents/InputWithHead";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";


const { Header, Footer, Content } = Layout;
const { Option } = Select;



class CompetitionReplicate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2018",
            compName: "2018winter"
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

    ////////form content view
    contentView = () => {
        return (
            <div className="content-view pt-5 ">
                <span className='form-heading'>{AppConstants.replicateWhichCompetition}</span>
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm" >
                            <InputWithHead heading={AppConstants.year} />
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(year) => this.setState({ year })}
                                value={this.state.year}
                            >
                                <Option value={"2018"}>{AppConstants.year2018}</Option>
                            </Select>
                        </div>
                        <div className="col-sm" >
                            <InputWithHead heading={"Competition Name"} />
                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={(compName) => this.setState({ compName })}
                                value={this.state.compName}
                            >
                                <Option value={AppConstants.winter2018}></Option>
                            </Select>

                        </div>
                    </div>

                </div>
                <InputWithHead heading={AppConstants.newCompetitionName} placeholder={AppConstants.newCompetitionName} />

                <div className="fluid-width" style={{ marginTop: 15 }}>
                    <div className="row"  >
                        <div className="col-sm-5" >
                            <InputWithHead heading={AppConstants.competitionLogo} />
                        </div>
                        <div className="col-sm-1"  >
                            <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                        </div>
                        <div className="col-sm-6" >
                            <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                        </div>
                    </div>

                </div>
                <div className="fluid-width" >
                    <div className="row"  >
                        <div className="col-sm-5" >
                            <InputWithHead heading={AppConstants.competitionDetails} />
                        </div>
                        <div className="col-sm-1"  >
                            <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                        </div>
                        <div className="col-sm-6" >
                            <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                        </div>
                    </div>

                </div>
                <div className="fluid-width" >
                    <div className="row"  >
                        <div className="col-sm-5" >
                            <InputWithHead heading={AppConstants.competitionType} />
                        </div>
                        <div className="col-sm-1"  >
                            <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                        </div>
                        <div className="col-sm-6" >
                            <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                        </div>
                    </div>

                </div>
                <div className="fluid-width" >
                    <div className="row"  >
                        <div className="col-sm-5" >
                            <InputWithHead heading={AppConstants.startDate} />
                        </div>
                        <div className="col-sm-1"  >
                            <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                        </div>
                        <div className="col-sm-6" >
                            <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                        </div>
                    </div>

                </div>
                <div className="fluid-width" >
                    <div className="row"  >
                        <div className="col-sm-5" >
                            <InputWithHead heading={AppConstants.nonPlayingDates} />
                        </div>
                        <div className="col-sm-1"  >
                            <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                        </div>
                        <div className="col-sm-6" >
                            <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                        </div>
                    </div>

                </div>
                <div className="fluid-width" >
                    <div className="row"  >
                        <div className="col-sm-5" >
                            <InputWithHead heading={AppConstants.registration_type} />
                        </div>
                        <div className="col-sm-1"  >
                            <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                        </div>
                        <div className="col-sm-6" >
                            <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                        </div>
                    </div>

                </div>
                <div className="fluid-width" >
                    <div className="row"  >
                        <div className="col-sm-5" >
                            <InputWithHead heading={AppConstants.registrationFees} />
                        </div>
                        <div className="col-sm-1"  >
                            <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                        </div>
                        <div className="col-sm-6" >
                            <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                        </div>
                    </div>

                </div>
                <div className="fluid-width" >
                    <div className="row"  >
                        <div className="col-sm-5" >
                            <InputWithHead heading={AppConstants.fixtures} />
                        </div>
                        <div className="col-sm-1"  >
                            <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                        </div>
                        <div className="col-sm-6" >
                            <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                        </div>
                    </div>

                </div>

                <div className="comp-replicate-bottom-view">

                    <div className="fluid-width" >
                        <div className="row"  >
                            <div className="col-sm-5" >
                                <InputWithHead heading={AppConstants.divisions} />
                            </div>
                            <div className="col-sm-1"  >
                                <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                            </div>
                            <div className="col-sm-6" >
                                <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                            </div>
                        </div>

                    </div>
                    <div className="fluid-width" >
                        <div className="row"  >
                            <div className="col-sm-5" >
                                <InputWithHead heading={AppConstants.grades} />
                            </div>
                            <div className="col-sm-1"  >
                                <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                            </div>
                            <div className="col-sm-6" >
                                <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                            </div>
                        </div>

                    </div>
                    <div className="fluid-width" >
                        <div className="row"  >
                            <div className="col-sm-5" >
                                <InputWithHead heading={AppConstants.Venues_Courts} />
                            </div>
                            <div className="col-sm-1"  >
                                <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                            </div>
                            <div className="col-sm-6" >
                                <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                            </div>
                        </div>

                    </div>
                    <div className="fluid-width" >
                        <div className="row"  >
                            <div className="col-sm-5" >
                                <InputWithHead heading={AppConstants.competitionFormatGameTimes} />
                            </div>
                            <div className="col-sm-1"  >
                                <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                            </div>
                            <div className="col-sm-6" >
                                <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                            </div>
                        </div>

                    </div>
                    <div className="fluid-width" >
                        <div className="row"  >
                            <div className="col-sm-5" >
                                <InputWithHead heading={AppConstants.draws} />
                            </div>
                            <div className="col-sm-1"  >
                                <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                            </div>
                            <div className="col-sm-6" >
                                <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                            </div>
                        </div>

                    </div>
                    <div className="fluid-width" >
                        <div className="row"  >
                            <div className="col-sm-5" >
                                <InputWithHead heading={AppConstants.teams} />
                            </div>
                            <div className="col-sm-1"  >
                                <Checkbox className="comp-replicate-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}></Checkbox>
                            </div>
                            <div className="col-sm-6" >
                                <Button className='comp-replicate-primary-edit' type='primary'>{AppConstants.edit}</Button>
                            </div>
                        </div>

                    </div>

                </div>

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
                            <div className="reg-add-save-button">
                                <Button type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div className="comp-buttons-view">
                                <Button className="save-draft-text" type="save-draft-text">{AppConstants.saveDraft}</Button>
                                <Button className="open-reg-button" type="primary">{AppConstants.review}</Button>
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
