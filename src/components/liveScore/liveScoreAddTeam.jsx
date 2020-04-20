import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    Radio,
    Form,
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { getliveScoreDivisions } from '../../store/actions/LiveScoreAction/liveScoreActions'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ValidationConstants from '../../themes/validationConstant'
import history from "../../util/history";
import {
    liveScoreManagerListAction,
    liveScoreManagerFilter
} from '../../store/actions/LiveScoreAction/liveScoreManagerAction'
import {
    liveScoreAddTeamform,
    liveScoreGetDivision,
    liveScoreGetaffilate,
    liveAddNewTeam,
    liveScoreGetTeamDataAction
} from '../../store/actions/LiveScoreAction/liveScoreTeamAction';
import Loader from '../../customComponents/loader'
// import LoaderImg from 'react-loader-spinner'
import { setTimeout } from "timers";
import { getLiveScoreCompetiton } from '../../util/sessionStorage'
import ImageLoader from '../../customComponents/ImageLoader'

const { Header, Footer, Content } = Layout;
const { Option } = Select;

class LiveScoreAddTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managerData: [],
            selectedFile: null,
            profileImage: AppImages.circleImage,
            //add 
            competitionSelection: AppConstants.selectComptition,
            divisionSelection: AppConstants.selectDivision,
            affiliateSelection: AppConstants.selectAffiliate,
            teamName: '',
            firstName: '',
            lastName: '',
            contactNo: '',
            emailAddress: '',
            competitionFormat: "roundRobin",
            isEdit: this.props.location.state ? this.props.location.state.isEdit : null,
            teamId: props.location.state ? props.location.state.teamId : null,
            load: false,
            timeout: null,
            showOption: false,
            loaclCompetitionID: null,
            image: null,
            loading: false,
            progress: 0,
            key: props.location.state ? props.location.state.key ? props.location.state.key : null : null,
        };

    }

    componentDidMount() {
        if (this.state.isEdit == true) {
            this.props.liveScoreGetTeamDataAction(this.state.teamId)
            this.setState({ load: true })
        }
        else {
            this.props.liveScoreAddTeamform({ key: 'addTeam' })
        }
        const { id } = JSON.parse(getLiveScoreCompetiton())
        this.setState({ loaclCompetitionID: id })

        // this.props.getliveScoreDivisions(1)
        this.props.liveScoreGetDivision(id)
        this.props.liveScoreGetaffilate({ id: id, name: '' })
        this.props.liveScoreManagerListAction(3, 1, id)
    }
    componentDidUpdate(nextProps) {
        let { teamManagerData } = this.props.liveScoreTeamState


        if (this.state.isEdit == true) {
            if (nextProps.liveScoreTeamState !== this.props.liveScoreTeamState) {
                if (this.props.liveScoreTeamState.onLoad == false && this.state.load == true) {
                    this.setInitalFiledValue(teamManagerData)
                    this.setState({ load: false })
                }
            }
        }

    }

    ////set initial value for all validated fields
    setInitalFiledValue(data) {

        const { selectedManager } = this.props.liveScoreTeamState
        this.props.form.setFieldsValue({
            'teamName': data.name,
            'teamAlias': data.alias,
            'division': data.divisionId,
            'affiliate': data.organisation ? data.organisation.name : "",
            'managerId': selectedManager

        })
    }


    setImage = (data) => {
        if (data.files[0] !== undefined) {
            let profileImage = URL.createObjectURL(data.files[0])
            this.setState({ image: data.files[0], profileImage: profileImage })
            this.props.liveScoreAddTeamform({ key: 'logoUrl', data: profileImage })
            // this.props.liveScoreAddTeamform({ key: 'teamLogo', data: data.files[0] })
        }
    };

    selectImage() {
        const fileInput = document.getElementById('user-pic');
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("accept", "image/*");
        if (!!fileInput) {
            fileInput.click();
        }
    }


    onRadioSwitch(e) {
        this.props.liveScoreAddTeamform({ key: 'managerType', data: e.target.value })
        this.setState({ load: true })
    }


    ///////view for breadcrumb
    headerView = () => {
        let isEdit = this.props.location.state ? this.props.location.state.isEdit : null
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
                            {isEdit == true ? AppConstants.editTeam : AppConstants.addTeam}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };

    radioBtnGroup(e) {
        const { selectedManager } = this.props.liveScoreTeamState
        this.props.liveScoreAddTeamform({ key: 'managerType', data: e.target.value })
        this.props.form.setFieldsValue({
            'managerId': selectedManager
        })
    }


    ////////form content view
    contentView = (getFieldDecorator) => {
        const { teamManagerData, affilateList, divisionList, managerType } = this.props.liveScoreTeamState
        return (
            <div className="content-view pt-4">
                <Form.Item>
                    {getFieldDecorator('teamName', {
                        rules: [{ required: true, message: ValidationConstants.teamName }],
                    })(
                        <InputWithHead
                            required={"required-field pt-0 pb-0"}
                            heading={AppConstants.teamName}
                            placeholder={AppConstants.enterTeamName}
                            name={'teamName'}
                            onChange={(event) => {
                                this.props.liveScoreAddTeamform({ key: 'name', data: event.target.value })
                            }
                            }
                            value={teamManagerData.name}
                        />
                    )}

                </Form.Item>
                {/* <Form.Item>
                    {getFieldDecorator('teamAlias', {
                        rules: [{ required: true, message: "Team Alias is required" }],
                    })( */}
                <InputWithHead
                    // required={"required-field pt-3 pb-3"}
                    heading={"Team Alias"}
                    placeholder={"please Enter Team Alias"}
                    name={'teamAlias'}
                    onChange={(event) => {
                        this.props.liveScoreAddTeamform({ key: 'alias', data: event.target.value })
                    }
                    }
                    value={teamManagerData.alias}
                />
                {/* )}

                </Form.Item> */}
                <span className="form-err">{this.state.teanmNameError}</span>

                <InputWithHead heading={AppConstants.teamLogo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>

                                <ImageLoader
                                    timeout={this.state.timeout}
                                    src={teamManagerData.logoUrl ? teamManagerData.logoUrl : AppImages.circleImage} />
                            </div>
                            <input
                                type="file"
                                id="user-pic"
                                style={{ display: 'none' }}
                                onChange={(evt) => {
                                    this.setImage(evt.target)
                                    this.setState({ timeout: 2000 })
                                    setTimeout(() => {
                                        this.setState({ timeout: null })
                                    }, 2000);
                                }} />
                            <span className="form-err">{this.state.imageError}</span>
                        </div>
                        <div
                            className="col-sm"
                            style={{ display: "flex", alignItems: "center" }}
                        >
                            <Checkbox
                                className="single-checkbox"
                                // defaultChecked={false}
                                checked={this.props.liveScoreTeamState.isCheked}
                                onChange={(value) => {
                                    this.props.liveScoreAddTeamform({ key: 'checkBox', data: value.target.checked })
                                    this.setState({ image: null })
                                }}
                            >
                                {AppConstants.useClubLogo}
                            </Checkbox>
                        </div>
                    </div>
                </div>

                <div className="row" >

                    <div className="col-sm" >
                        <InputWithHead required={"required-field"} heading={AppConstants.division} />
                        <Form.Item>
                            {getFieldDecorator("division", {
                                rules: [{ required: true, message: ValidationConstants.divisionField }],
                            })(
                                <Select
                                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                    onChange={divisionSelection => {
                                        this.props.liveScoreAddTeamform({ key: 'divisionId', data: divisionSelection })
                                    }}
                                    value={teamManagerData.divisionId}
                                    placeholder={"Select Division"}  >
                                    {divisionList.map((item) => (
                                        <Option key={item.id} value={item.id} > {item.name}</Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>

                    </div>
                </div>

                <InputWithHead required={"required-field"} heading={AppConstants.affiliate} />
                <div>
                    <Form.Item>
                        {getFieldDecorator('affiliate', {
                            rules: [{ required: true, message: ValidationConstants.affiliateField }],
                        })(
                            // <AutoComplete
                            //     style={{ width: "100%", height: '56px' }}
                            //     placeholder="Select User"
                            //     onSelect={(item, option) => {
                            //         console.log(item, 'dfdsfsdfdsf', option)
                            //         const ManagerId = JSON.parse(option.key)
                            //         this.props.liveScoreAddTeamform({ key: 'organisationId', data: ManagerId })
                            //     }}
                            //     // onSelect={(affilateId) => this.props.liveScoreAddTeamform({ key: 'organisationId', data: affilateId })}
                            //     // onSearch={(value) => { this.props.liveScoreGetaffilate({ id: this.state.loaclCompetitionID, name: value }) }}
                            //     value={teamManagerData.organisationId}
                            // >
                            //     {affilateList.map((item) => {
                            //         console.log(item)
                            //         return <Option key={item.id} value={item.name}>
                            //             {item.name}
                            //         </Option>
                            //     })}

                            // </AutoComplete>

                            <Select
                                style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                onChange={affiliateId => {
                                    this.props.liveScoreAddTeamform({ key: 'organisationId', data: affiliateId })
                                }}
                                value={teamManagerData.divisionId}
                                placeholder={"Select User"}  >
                                {affilateList.map((item) => {
                                    return <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                })}
                            </Select>
                        )}
                    </Form.Item>

                </div>

                <div className="row" >
                    <span required={"required-field"} className="applicable-to-heading ml-4">{AppConstants.manager}</span>
                    {/* <InputWithHead required={"required-field ml-4"} heading={AppConstants.managerHeading} /> */}

                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => {
                            this.onRadioSwitch(e)
                        }}
                        value={managerType}
                    >
                        <div className="row ml-2" style={{ marginTop: 18 }} >
                            <Radio value={"new"}>{AppConstants.new}</Radio>
                            <Radio value={"existing"}>{AppConstants.existing} </Radio>
                        </div>
                    </Radio.Group>
                </div>
                {managerType == 'new' && this.managerNewRadioBtnView(getFieldDecorator)}
                {managerType == 'existing' && this.managerExistingRadioBtnView(getFieldDecorator)}
            </div>
        )
    };

    managerExistingRadioBtnView(getFieldDecorator) {
        let grade = this.state.managerData
        const { selectedManager } = this.props.liveScoreTeamState
        const { managerListResult } = this.props.liveScoreMangerState
        return (
            <div >
                <InputWithHead heading={AppConstants.managerSearch}
                    required={"required-field"} />
                <div>
                    <Form.Item>
                        {getFieldDecorator("managerId", {
                            rules: [{ required: true, message: ValidationConstants.searchManager }]
                        })(
                            <Select
                                mode="multiple"
                                placeholder={AppConstants.searchManager}
                                style={{ width: "100%", }}
                                onChange={(e) => {
                                    this.props.liveScoreAddTeamform({ key: 'userIds', data: e })
                                    // this.setState({ showOption: false })
                                }}
                                // onSearch={(value) => {

                                //     this.setState({ showOption: true })

                                //     const filteredData = this.props.liveScoreMangerState.MainManagerListResult.filter(data => {
                                //         return data.firstName.indexOf(value) > -1
                                //     })
                                //     console.log(filteredData)
                                //     this.props.liveScoreManagerFilter(filteredData)

                                // }}
                                value={selectedManager}
                            >

                                {/* {this.state.showOption ?  */}
                                {managerListResult.map((item) => {
                                    return <Option key={item.id} value={JSON.stringify(item.id)}>
                                        {item.firstName + " " + item.lastName}
                                    </Option>
                                })
                                }
                                {/* : null} */}

                            </Select>
                        )}
                    </Form.Item>

                </div>
            </div>
        )
    }

    managerNewRadioBtnView(getFieldDecorator) {
        const { teamManagerData } = this.props.liveScoreTeamState

        return (
            <div>
                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator('firstName', {
                                rules: [{ required: true, message: ValidationConstants.nameField[0] }],
                            })(<InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.firstName}
                                placeholder={AppConstants.enter_firstName}
                                name={'firstName'}
                                onChange={(event) => {
                                    this.props.liveScoreAddTeamform({ key: 'firstName', data: event.target.value })

                                }}
                                value={teamManagerData.firstName}
                            />
                            )}
                        </Form.Item>
                        <span className="form-err">{this.state.firstNameError}</span>
                    </div>
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator('lastName', {
                                rules: [{ required: true, message: ValidationConstants.nameField[1] }],
                            })(
                                <InputWithHead
                                    required={"required-field pt-0 pb-0"}
                                    heading={AppConstants.lastName}
                                    placeholder={AppConstants.enterLastName}
                                    name={'lastName'}
                                    onChange={(event) => {
                                        this.props.liveScoreAddTeamform({ key: 'lastName', data: event.target.value })
                                    }}
                                    value={teamManagerData.lastName}
                                />
                            )}
                        </Form.Item>

                        <span className="form-err">{this.state.lastNameError}</span>

                    </div>
                </div>

                <div className="row" >
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator("email", {
                                rules: [{ required: true, message: ValidationConstants.emailField[0] }],
                            })(
                                <InputWithHead
                                    required={"required-field pt-0 pb-0"}
                                    heading={AppConstants.emailAdd}
                                    placeholder={AppConstants.enterEmail}
                                    name={'emailAddress'}
                                    onChange={(event) => {
                                        this.props.liveScoreAddTeamform({ key: 'email', data: event.target.value })
                                    }}
                                    value={teamManagerData.email}
                                />
                            )}
                        </Form.Item>

                        <span className="form-err">{this.state.emailAddressError}</span>
                    </div>
                    <div className="col-sm" >
                        <Form.Item>
                            {getFieldDecorator("contactNo", {
                                rules: [{ required: true, message: ValidationConstants.contactField }]
                            })(<InputWithHead
                                required={"required-field pt-0 pb-0"}
                                heading={AppConstants.contactNO}
                                placeholder={AppConstants.enterContactNo}
                                name={'contactNo'}
                                onChange={(event) => {
                                    this.props.liveScoreAddTeamform({ key: 'mobileNumber', data: event.target.value })
                                }}
                                value={teamManagerData.mobileNumber}
                            />)}
                        </Form.Item>

                        <span className="form-err">{this.state.contactNoError}</span>

                    </div>
                </div>
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = (isSubmitting) => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button onClick={() => history.push('/liveScoreTeam')} type="cancel-button">{AppConstants.cancel}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                <Button onClick={this.handleSubmit} className="user-approval-button" type="primary" htmlType="submit" disabled={isSubmitting}>
                                    {AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    handleSubmit = e => {
        const { id } = JSON.parse(getLiveScoreCompetiton())
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    name,
                    alias,
                    logoUrl,
                    teamLogo,
                    divisionId,
                    organisationId,
                    userIds,
                    firstName,
                    lastName,
                    mobileNumber,
                    email,
                } = this.props.liveScoreTeamState.teamManagerData
                let isCheked = this.props.liveScoreTeamState

                let usersArray = JSON.stringify(userIds)

                if (this.props.liveScoreTeamState.managerType === 'existing') {
                    const formData = new FormData();



                    if (this.state.teamId !== null) {
                        formData.append('id', this.state.teamId)
                    }

                    formData.append('name', name)
                    formData.append('alias', alias)

                    if (this.state.image) {
                        formData.append('logo', this.state.image)
                    } else if (this.props.liveScoreTeamState.teamLogo) {
                        formData.append('logoUrl', this.props.liveScoreTeamState.teamLogo)
                    }

                    formData.append('competitionId', id)
                    formData.append('organisationId', organisationId)
                    formData.append('divisionId', divisionId)
                    formData.append('userIds', usersArray)

                    if (firstName && lastName && mobileNumber && email) {
                        formData.append('firstName', firstName)
                        formData.append('lastName', lastName)
                        formData.append('mobileNumber', mobileNumber)
                        formData.append('email', email)

                    }

                    this.props.liveAddNewTeam(formData, this.state.teamId, this.state.key)
                }
                else if (this.props.liveScoreTeamState.managerType === 'new') {
                    const formData = new FormData();

                    if (this.state.teamId) {
                        formData.append('id', this.state.teamId)
                    }

                    formData.append('name', name)
                    formData.append('alias', alias)

                    if (this.state.image) {
                        formData.append('logo', this.state.image)
                    } else if (this.props.liveScoreTeamState.teamLogo) {
                        formData.append('logoUrl', this.props.liveScoreTeamState.teamLogo)
                    }

                    formData.append('competitionId', id)
                    formData.append('organisationId', organisationId)
                    formData.append('divisionId', divisionId)
                    formData.append('firstName', firstName)
                    formData.append('lastName', lastName)
                    formData.append('mobileNumber', mobileNumber)
                    formData.append('email', email)
                    if (userIds.length > 0) {
                        formData.append('userIds', usersArray)
                    }

                    this.props.liveAddNewTeam(formData, this.state.teamId, this.state.key)
                }
                else {
                    // message.config({ duration: 0.9, maxCount: 1 })
                    // message.error('Please select manager section.')
                    const formData = new FormData();

                    if (this.state.teamId) {
                        formData.append('id', this.state.teamId)
                    }

                    formData.append('name', name)
                    formData.append('alias', alias)

                    if (this.state.image) {
                        formData.append('logo', this.state.image)
                    } else if (this.props.liveScoreTeamState.teamLogo) {
                        formData.append('logoUrl', this.props.liveScoreTeamState.teamLogo)
                    }

                    formData.append('competitionId', id)
                    formData.append('organisationId', organisationId)
                    formData.append('divisionId', divisionId)

                    this.props.liveAddNewTeam(formData, this.state.teamId, this.state.key)
                }
            }
        });
    }

    /////main render method
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick={() => history.push("./liveScoreCompetitions")} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"3"} />
                <Loader visible={this.props.liveScoreTeamState.onLoad} />
                <Layout>
                    {this.headerView()}
                    <Form
                        onSubmit={this.handleSubmit}
                        noValidate="noValidate">
                        <Content>
                            <div className="formView">{this.contentView(getFieldDecorator)}</div>
                        </Content>
                        <Footer >{this.footerView()}</Footer>
                    </Form>


                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getliveScoreDivisions,
        liveScoreAddTeamform,
        liveScoreGetDivision,
        liveScoreGetaffilate,
        liveAddNewTeam,
        liveScoreManagerListAction,
        liveScoreGetTeamDataAction,
        liveScoreManagerFilter
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        liveScoreTeamState: state.LiveScoreTeamState,
        liveScoreState: state.LiveScoreState,
        liveScoreMangerState: state.LiveScoreMangerState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(LiveScoreAddTeam));


