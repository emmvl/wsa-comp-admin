import React, { Component } from "react"
import { Layout, Button, Select, Menu, Pagination, message, Breadcrumb, Form, Radio, Tooltip } from 'antd';
import './umpire.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { getUmpireCompId, setUmpireCompId } from '../../util/sessionStorage'
import { isArrayNotEmpty } from "../../util/helpers";

const { Header, Footer, Content } = Layout
const { Option } = Select

const allocatePools = [
    { id: 1, name: "Division" },
    { id: 2, name: "Grades" }
]
class UmpireDivisions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedComp: "All",
            umpPool: "A Grade",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null
        }
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        this.setState({ loading: true })
        this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS')
    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading == true && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id


                if (getUmpireCompId()) {
                    let compId = JSON.parse(getUmpireCompId())
                    firstComp = compId
                } else {
                    setUmpireCompId(firstComp)
                }

                let compKey = compList.length > 0 && compList[0].competitionUniqueKey
                this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey })
            }
        }
    }

    onChangeComp(data) {
        this.setState({ selectedComp: data.comp })
    }

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
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.umpirePoolsDivision}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    onChangeComp(compID) {
        let selectedComp = compID.comp
        setUmpireCompId(selectedComp)
        let compKey = compID.competitionUniqueKey

        this.setState({ selectedComp, competitionUniqueKey: compKey })

    }



    dropdownView = (getFieldDecorator) => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div
                                style={{
                                    width: "fit-content",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <span className="year-select-heading ">
                                    {AppConstants.competition}:
                                   </span>

                                <Select
                                    className="year-select"
                                    style={{ minWidth: 160 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {
                                        competition.map((item) => {
                                            return <Option value={item.id}>{item.longName}</Option>
                                        })
                                    }

                                </Select>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    onChangeUmpirePools(data) {
        console.log(data, "printttt")
        this.setState({ umpPool: data.umpirePool })
    }



    contentView = () => {
        return (
            <div className="content-view pt-4">
                <span className="applicable-to-heading ">{AppConstants.allocatePools}</span>


                <Radio.Group
                    className="reg-competition-radio"
                // onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionTypeRefId")}
                // onChange={e => this.setPools(e.target.value)}
                // setFieldsValue={detailsData.competitionTypeRefId}
                // disabled={compDetailDisable}
                >
                    {allocatePools.map(item => {
                        return (
                            <Radio value={item.id}>{item.name}</Radio>
                        )
                    })}
                </Radio.Group>

                <span className='text-heading-large pt-5' >{AppConstants.umpirePools}</span>

                <InputWithHead marginTop={5} heading={AppConstants.badgeAA} />
                <div className="row" >
                    <div className="col-sm" >
                        <Select
                            placeholder={"Select"}
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                        // onChange={umpirePool => this.onChangeUmpirePools({ key: "recordUmpire", data: umpirePool })}
                        // value={this.state.umpPool}
                        >
                            <Option value={"a"}>{'A Grade'}</Option>
                            <Option value={"b"}>{'B Grade'}</Option>
                            <Option value={"c"}>{'C Grade'}</Option>
                        </Select>
                    </div>
                </div>

                <InputWithHead marginTop={5} heading={AppConstants.badgeA} />

                <div className="row" >
                    <div className="col-sm" >
                        <Select
                            placeholder={"Select"}
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                        // onChange={umpirePool => this.onChangeUmpirePools({ key: "recordUmpire", data: umpirePool })}
                        // value={this.state.umpPool}
                        >
                            <Option value={"a"}>{'A Grade'}</Option>
                            <Option value={"b"}>{'B Grade'}</Option>
                            <Option value={"c"}>{'C Grade'}</Option>
                        </Select>
                    </div>
                </div>

                <InputWithHead marginTop={5} heading={AppConstants.badgeB} />
                <div className="row" >
                    <div className="col-sm" >
                        <Select
                            placeholder={"Select"}
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                        // onChange={recordUmpire => this.props.onChangeUmpirePools({ key: "recordUmpire", data: recordUmpire })}
                        // value={this.state.umpPool}
                        >
                            <Option value={"a"}>{'A Grade'}</Option>
                            <Option value={"b"}>{'B Grade'}</Option>
                            <Option value={"c"}>{'C Grade'}</Option>
                        </Select>
                    </div>
                </div>

                <InputWithHead marginTop={5} heading={AppConstants.badgeC} />
                <div className="row" >
                    <div className="col-sm" >
                        <Select
                            placeholder={"Select"}
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                        // onChange={recordUmpire => this.props.onChangeUmpirePools({ key: "recordUmpire", data: recordUmpire })}
                        // value={this.state.umpPool}
                        >
                            <Option value={"a"}>{'A Grade'}</Option>
                            <Option value={"b"}>{'B Grade'}</Option>
                            <Option value={"c"}>{'C Grade'}</Option>
                        </Select>
                    </div>
                </div>

                <InputWithHead marginTop={5} heading={AppConstants.umpireCoach} />
                <div className="row" >
                    <div className="col-sm" >
                        <Select
                            placeholder={"Select"}
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                        // onChange={recordUmpire => this.props.onChangeUmpirePools({ key: "recordUmpire", data: recordUmpire })}
                        // value={this.state.umpPool}
                        >
                            <Option value={"a"}>{'A Grade'}</Option>
                            <Option value={"b"}>{'B Grade'}</Option>
                            <Option value={"c"}>{'C Grade'}</Option>
                        </Select>
                    </div>
                </div>

                <InputWithHead marginTop={5} heading={AppConstants.juniorUnbadge} />
                <div className="row" >
                    <div className="col-sm" >
                        <Select
                            placeholder={"Select"}
                            mode="multiple"
                            style={{ width: "100%", paddingRight: 1, minWidth: 182, }}
                        // onChange={recordUmpire => this.props.onChangeUmpirePools({ key: "recordUmpire", data: recordUmpire })}
                        // value={this.state.umpPool}
                        >
                            <Option value={"a"}>{'A Grade'}</Option>
                            <Option value={"b"}>{'B Grade'}</Option>
                            <Option value={"c"}>{'C Grade'}</Option>
                        </Select>
                    </div>
                </div>

            </div>
        )
    }


    //////footer view containing all the buttons like save and cancel
    footerView = (isSubmitting) => {


        return (
            <div className="fluid-width">
                {!this.state.membershipIsUsed &&
                    <div className="footer-view">
                        <div className="row">
                            <div className="col-sm">
                                <div className="reg-add-save-button">
                                    <Button type="cancel-button">{AppConstants.cancel}</Button>

                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="comp-buttons-view">
                                    <Button
                                        className="user-approval-button" type="primary" htmlType="submit" >
                                        {AppConstants.save}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    };

    render = () => {
        // const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"4"} />
                {/* <Loader visible={this.props.liveScoreSetting.loader} /> */}
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        {/* <Form onSubmit={this.checkSubmit} noValidate="novalidate" className="login-form"> */}
                        <div className="formView">{this.contentView()}</div>

                        <Footer>
                            {this.footerView()}
                        </Footer>
                    </Form>
                </Layout>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireCompetitionState: state.UmpireCompetitionState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(UmpireDivisions));