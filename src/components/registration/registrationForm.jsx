import React, { Component } from "react";
import {
    Layout,
    Input,
    Select,
    Checkbox,
    Tree,
    DatePicker,
    Button,
    Breadcrumb,
    Form,
    Table,
    message,
    Radio,
    Tooltip
} from "antd";
import "./product.scss";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import {
    regSaveRegistrationForm, getRegistrationForm,
    updateRegistrationForm, clearReducerDataAction,
    changeMembershipProduct, getMembershipproduct,
    updateProductSelection, updateRegistrationLock, updateDisclamerText, isCheckedVisible,
    isReplyCheckVisible
} from "../../store/actions/registrationAction/registration";
import {
    getYearAndCompetitionAction, getCompetitionTypeListAction,
    getVenuesTypeAction, getRegFormAdvSettings,
    getRegistrationMethod,
} from "../../store/actions/appAction";
import { connect } from "react-redux";
import AppImages from "../../themes/appImages";
import { bindActionCreators } from "redux";
import moment from "moment";
import ValidationConstants from "../../themes/validationConstant";
import { isArrayNotEmpty,regexNumberExpression } from "../../util/helpers";
import Loader from '../../customComponents/loader';
import history from "../../util/history";
import { getOrganisationData } from "../../util/sessionStorage";
import CustomTooltip from 'react-png-tooltip'
import { inviteTypeAction } from '../../store/actions/commonAction/commonAction';


const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;



let this_Obj = null;

const columns = [
    {
        title: "",
        dataIndex: "division",
        key: "division",
        render: (division, record, index) => (
            <Checkbox
                className="single-checkbox mt-1"
                checked={record.isSelected}
                disabled={this_Obj.state.isPublished}
                onChange={e => this_Obj.getSelectionofProduct(e.target.checked, record, index)}
                key={"division" + index}
            ></Checkbox>
        )
    },
    {
        title: "Membership Type",
        dataIndex: "membershipProductTypeName",
        key: "membershipProductTypeName",
    },
    {
        title: "Registration Type",
        dataIndex: "registrationType",
        key: "registrationType",
    },
    {
        title: "Registration Divisions",
        dataIndex: "divisionName",
        key: "divisionName",
        width: "25%",
    },
    {
        title: "Registration Lock",
        dataIndex: "registrationLock",
        width: "25%",
        key: "registrationLock",
        filterDropdown: true,
        filterIcon: () => {
            return (

                <CustomTooltip placement="top" background='#ff8237'>
                    <span>{AppConstants.regLockMsg}</span>
                </CustomTooltip>


            );
        },
        render: (registrationLock, record, index) => (
            <Checkbox
                className="single-checkbox mt-1"
                checked={record.registrationLock == null ? false : record.registrationLock}
                onChange={e => this_Obj.getRegistrationLock(e.target.checked, record, index)}
            ></Checkbox>
        )
    }
];


class RegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: 1,
            firstTimeCompId: null,
            membershipCategory: "Select",
            registrationOepn: "",
            registrationClose: "",
            registrationLock: false,
            training: false,
            trainingDaysTimes: false,
            trainingVenue: false,
            trainingVenueTime: "trainingVenue",
            replyToContDetail: false,
            nameChecked: false,
            roleChecked: false,
            emailChecked: false,
            phoneChecked: false,
            disclaimerAdd: "",
            orgName: "New",
            disclaimerData: [],
            regClose: "",
            regStart: "",
            payLoad: "",
            statusRefId: 1,
            registrationMethodArray: [],
            selectedMemberShipType: [],
            disclaimerText: "",
            disclaimerLink: "",
            onRegistrationLoad: false,
            selectedInvitees: [],
            tooltipVisibleDraft: false,
            tooltipVisiblePublish: false,
            isPublished: false,
            orgRegId: 0,
            compCloseDate: null,
            compName: "",
            allYearRefId: -1,
            allCompetition: null
        };
        this_Obj = this;
        this.props.clearReducerDataAction("getRegistrationFormDetails")
        this.getRefernce();

    }

    componentDidMount() {
        this.props.getYearAndCompetitionAction(this.props.appState.allYearList, null)
        let competitionId = this.props.location.state ? this.props.location.state.id : null
        let year = this.props.location.state ? this.props.location.state.year : null
        let orgRegId = this.props.location.state ? this.props.location.state.orgRegId : 0
        let compCloseDate = this.props.location.state ? this.props.location.state.compCloseDate : null
        let compName = this.props.location.state ? this.props.location.state.compName : null

        this.setState({ orgRegId, compCloseDate, compName })

        if (competitionId !== null && year !== null) {
            this.props.getRegistrationForm(year, competitionId)
            this.setState({ onRegistrationLoad: true, yearRefId: year, firstTimeCompId: competitionId })
        }
        else {
            history.push("/registrationFormList")
        }
        // this.props.getYearAndCompetitionAction(this.props.appState.yearList, null)


    }


    getRefernce() {

        this.props.getVenuesTypeAction();
        this.props.getRegistrationMethod();
        this.props.getRegFormAdvSettings();
        this.props.inviteTypeAction();
    }


    componentDidUpdate(nextProps) {
        let registrationState = this.props.registrationState
        let allCompetitionTypeList = this.props.appState.allCompetitionTypeList
        if (nextProps.registrationState.registrationFormData !== registrationState.registrationFormData) {
            if (this.state.onRegistrationLoad === true && registrationState.onLoad === false) {
                this.setFieldDecoratorValues()
                this.setState({
                    onRegistrationLoad: false,
                    isPublished: registrationState.registrationFormData[0].statusRefId == 2 ? true : false
                })
            }
        }
        if (nextProps.appState !== this.props.appState) {
            if (nextProps.appState.allCompetitionTypeList !== allCompetitionTypeList) {
                if (allCompetitionTypeList.length > 0) {
                    let allCompetition = allCompetitionTypeList[0].competitionId
                    this.setState({
                        allCompetition: allCompetition
                    })
                }
            }
        }
        // if (nextProps.appState !== this.props.appState) {
        //     if (nextProps.appState.competitionList !== competitionList) {
        //         if (competitionList.length > 0) {
        //             let competitionId = competitionList[0].competitionId


        //         }
        //     }
        // }
    }

    // year change and get competition lost
    onYearChange = (allYearRefId) => {
        this.setState({ allCompetition: null, allYearRefId: allYearRefId, })
        this.props.getYearAndCompetitionAction(this.props.appState.allYearList, allYearRefId)
        this.props.updateRegistrationForm(allYearRefId, "inviteYearRefId")
    }

    onCompetitionChange = (allCompetition) => {
        this.setState({ allCompetition: allCompetition })
    }

    setFieldDecoratorValues = () => {
        let registrationFormData = this.props.registrationState.registrationFormData[0]
        let disclaimerData = registrationFormData.registrationDisclaimer !== null ? isArrayNotEmpty(registrationFormData.registrationDisclaimer) ? registrationFormData.registrationDisclaimer : [] : []
        this.props.form.setFieldsValue({
            registrationOpenDate: registrationFormData.registrationOpenDate !== '' ? moment(registrationFormData.registrationOpenDate, "YYYY-MM-DD") : null,
            registrationCloseDate: registrationFormData.registrationCloseDate !== '' ? moment(registrationFormData.registrationCloseDate, "YYYY-MM-DD") : null,
            email:registrationFormData.replyEmail !==''?registrationFormData.replyEmail:""
        });
        disclaimerData.map((item, index) => {
            let disclaimerText = `disclaimerText${index}`
            let disclaimerLink = `disclaimerLink${index}`
            this.props.form.setFieldsValue({
                [disclaimerText]: item.disclaimerText,
                [disclaimerLink]: item.disclaimerLink
            })
        })
    }



    //Registration Method
    methodSelection(value, item, formDataValue) {
        // let registrationMethodArray = isArrayNotEmpty(formDataValue.registerMethods) ? formDataValue.registerMethods : []
        let methodArr = []
        methodArr = this.props.registrationState.selectedMethod
        let index = methodArr.findIndex(
            x => x == item.id);
        if (index > -1) {
            methodArr.splice(index, 1);
        }
        else {
            methodArr.push(
                item.id
            );
        }
        this.props.updateRegistrationForm(methodArr, "registerMethods")
    }

    // for add disclaimer
    addDisclaimerLink() {
        if (this.props.registrationState.registrationFormData.length > 0) {
            let formDataValue = this.props.registrationState.registrationFormData[0]
            let disclaimerData = formDataValue.registrationDisclaimer !== null ? isArrayNotEmpty(formDataValue.registrationDisclaimer) ? formDataValue.registrationDisclaimer : [] : []

            // let arrayCheck = formDataValue.registrationDisclaimer
            let obj = {
                "orgRegistrationDisclaimerLinkId": 0,
                "disclaimerLink": "",
                "disclaimerText": ""
            }
            disclaimerData.push(obj)

            this.props.updateRegistrationForm(disclaimerData, "registrationDisclaimer")
        }
    };

    // for remove disclaimer
    removeDisclaimer(e, index) {
        if (this.props.registrationState.registrationFormData.length > 0) {
            let formDataValue = this.props.registrationState.registrationFormData[0]
            let arrayCheck = formDataValue.registrationDisclaimer
            arrayCheck.splice(index, 1)
            this.props.updateRegistrationForm(arrayCheck, "registrationDisclaimer")
        }
    }
    /// post api
    registrationSubmit = e => {
        e.preventDefault();
        let SelectedProduct = JSON.parse(JSON.stringify(this.props.registrationState.registrationFormData.length !== 0 ? this.props.registrationState.registrationFormData[0] : []));
        const { reg_settings, reg_demoSetting, reg_NetballSetting, reg_QuestionsSetting } = JSON.parse(JSON.stringify(this.props.registrationState))
        let registration_settings = []
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (SelectedProduct.membershipProductTypes.length > 0) {
                    let phone_number =SelectedProduct["replyPhone"].length >0? regexNumberExpression(SelectedProduct["replyPhone"]):""
                    SelectedProduct['competitionUniqueKeyId'] = this.state.firstTimeCompId
                    SelectedProduct['yearRefId'] = this.state.yearRefId
                    SelectedProduct["statusRefId"] = this.state.statusRefId
                    SelectedProduct["replyPhone"] = phone_number
                    for (let i in reg_settings) {
                        registration_settings.push(reg_settings[i])
                    }
                    for (let i in reg_demoSetting) {
                        registration_settings.push(reg_demoSetting[i])
                    }
                    for (let i in reg_NetballSetting) {
                        registration_settings.push(reg_NetballSetting[i])
                    }
                    for (let i in reg_QuestionsSetting) {
                        registration_settings.push(reg_QuestionsSetting[i])
                    }
                    SelectedProduct['registrationSettings'] = registration_settings
                    SelectedProduct["orgRegistrationId"] = SelectedProduct.orgRegistrationId == 0 || SelectedProduct.orgRegistrationId == null ? this.state.orgRegId : SelectedProduct.orgRegistrationId;

                    console.log(this.state.orgRegId, "SelectedProduct",SelectedProduct)

                    //console.log("Final Data" + JSON.stringify(SelectedProduct));

                    this.props.regSaveRegistrationForm(SelectedProduct, this.state.statusRefId)
                }
                else {
                    message.error(ValidationConstants.pleaseSelectMembershipProduct)
                }
            }
        })
    };

    ///for change table productType and Division selection 
    getSelectionofProduct(value, record, key) {
        let allMemberProductArr = this.props.registrationState.selectedMemberShipType
        let matchIndexValue = allMemberProductArr.findIndex(x => x.membershipProductId == record.membershipProductId)
        if (matchIndexValue > -1) {
            this.props.updateProductSelection(matchIndexValue, key, record.isSelected, record.registrationLock)
        }

    }


    //
    getRegistrationLock(value, record, key) {
        let allMemberProductArr = this.props.registrationState.selectedMemberShipType
        let matchIndexValue = allMemberProductArr.findIndex(x => x.membershipProductId == record.membershipProductId)
        if (matchIndexValue > -1) {
            this.props.updateRegistrationLock(matchIndexValue, key, record.isSelected, record.registrationLock)
        }
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
                    <div className="row">
                        <div
                            className="col-sm"
                            style={{ display: "flex", alignContent: "center" }}
                        >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">
                                    {AppConstants.registrationForm}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header>
            </div>
        );
    };

    ///dropdown view containing all the dropdown of header
    // dropdownView = (
    //     getFieldDecorator
    // ) => {
    //     let formDataValue = this.props.registrationState.registrationFormData !== 0 ? this.props.registrationState.registrationFormData[0] : [];
    //     return (
    //         <div className="comp-venue-courts-dropdown-view mt-0">
    //             <div className="fluid-width">
    //                 <div className="row">
    //                     <div className="col-sm-3">
    //                         <div
    //                             style={{
    //                                 width: "fit-content",
    //                                 display: "flex",
    //                                 flexDirection: "row",
    //                                 alignItems: "center"
    //                             }}
    //                         >
    //                             <span className="year-select-heading">
    //                                 {AppConstants.year}:
    //             </span>
    //                             <Select
    //                                 name={"yearRefId"}
    //                                 className="year-select"
    //                                 onChange={yearRefId => this.onYearChange(yearRefId)}
    //                                 value={this.state.yearRefId}
    //                             // value={formDataValue ? formDataValue.yearRefId ? formDataValue.yearRefId : 1 : 1}
    //                             >
    //                                 {this.props.appState.yearList.map(item => {
    //                                     return (
    //                                         <Option key={"yearRefId" + item.id} value={item.id}>
    //                                             {item.description}
    //                                         </Option>
    //                                     );
    //                                 })}
    //                             </Select>
    //                         </div>

    //                     </div>
    //                     <div className="col-sm-3">
    //                         <div
    //                             style={{
    //                                 width: "fit-content",
    //                                 display: "flex",
    //                                 flexDirection: "row",
    //                                 alignItems: "center",
    //                                 marginRight: 50
    //                             }}
    //                         >
    //                             <span className="year-select-heading">
    //                                 {AppConstants.competition}:
    //             </span>
    //                             <Select
    //                                 style={{ minWidth: 160 }}
    //                                 name={"competition"}
    //                                 className="year-select"
    //                                 onChange={competitionUniqueKeyId => this.onCompetitionChange(competitionUniqueKeyId)
    //                                 }
    //                                 value={this.state.firstTimeCompId}
    //                             // value={formDataValue ? formDataValue.competitionUniqueKeyId ? formDataValue.competitionUniqueKeyId : "" : ""}
    //                             >
    //                                 {this.props.appState.competitionList.map(item => {
    //                                     return (
    //                                         <Option key={"competition" + item.competitionId} value={item.competitionId}>
    //                                             {item.competitionName}
    //                                         </Option>
    //                                     );
    //                                 })}
    //                             </Select>
    //                         </div>

    //                     </div>
    //                 </div>
    //             </div>
    //         </div >
    //     );
    // };

    onSelectionMembershipCategory(value) {
        this.props.changeMembershipProduct(value)
    }



    onChangeRegistrationLock(value, setFieldValue) {
        this.props.updateRegistrationForm(value, "registrationLock")
        setFieldValue("registrationLock")
    }

    regOpenDate = () => {
        if (this.props.registrationState.registrationFormData.length > 0) {
            let formDataValue = this.props.registrationState.registrationFormData[0]
            let openDate = formDataValue.registrationOpenDate
            moment(openDate).format("DD-MM-YYYY")
            return openDate
        }
    }

    regCloseDate = () => {
        if (this.props.registrationState.registrationFormData.length > 0) {
            let formDataValue = this.props.registrationState.registrationFormData[0]
            let closeDate = formDataValue.registrationCloseDate
            return closeDate
        }
    }
    dateChange(date, key) {
        if (date !== null) {
            this.props.updateRegistrationForm((moment(date).format(
                "YYYY-MM-DD")), key)
        }
        else {
            this.props.updateRegistrationForm('', key)
        }

    }





    ////////form content view
    contentView = (
        getFieldDecorator
    ) => {
        let formDataValue = this.props.registrationState.registrationFormData !== 0 ? this.props.registrationState.registrationFormData[0] : [];
        let fillteredProduct = this.props.registrationState.selectedProductName !== 0 ? this.props.registrationState.selectedProductName : []
        let productList =
            this.props.registrationState.membershipProductTypes.length !== 0 ? this.props.registrationState.membershipProductTypes : [];
        let venueList =
            this.props.appState.venueList.length !== 0 ? this.props.appState.venueList : [];
        let dateOpen = this.regOpenDate()
        let closeDate = moment(this.state.compCloseDate).format("YYYY-MM-DD")
        console.log("closeDate" + closeDate);
        let compCLoseDate = moment(this.state.compCloseDate).format("DD-MM-YYYY")
        let defaultChecked = this.props.registrationState.defaultChecked
        let isPublished = this.state.isPublished
        return (
            <div className="content-view pt-4">
                <div className="row " style={{ paddingLeft: 10, paddingBottom: 15 }}>
                    <span className="form-heading pt-2 pl-2">{this.state.compName}</span>
                </div>
                <span className="user-reg-link">{`Competition Registrations close on ${compCLoseDate}`}</span>
                <div className="row">
                    <div className="col-sm">

                        <InputWithHead
                            heading={AppConstants.registrationOpen}
                            conceptulHelp
                            conceptulHelpMsg={AppConstants.regFormOpenMsg}
                            marginTop={5} />
                        <Form.Item >
                            {getFieldDecorator('registrationOpenDate',
                                { rules: [{ required: true, message: ValidationConstants.registrationOpenDateIsRequired }] })(
                                    <DatePicker
                                        size="large"
                                        placeholder={"dd-mm-yyyy"}
                                        style={{ width: "100%" }}
                                        onChange={(e) => this.dateChange(e, "registrationOpenDate")
                                        }
                                        name={"registrationOpenDate"}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        disabledDate={this.disabledDate}
                                        disabledTime={this.disabledTime}
                                        //disabled={isPublished}
                                        disabledDate={d => !d || d.isAfter(closeDate)
                                            // || d.isSameOrBefore(dateOpen)
                                        }
                                    // value={dateOpen ? moment(dateOpen, "YYYY-MM-DD") : ''}

                                    />
                                )}
                        </Form.Item>
                    </div>
                    <div className="col-sm">
                        <InputWithHead
                            heading={AppConstants.registration_close}
                            conceptulHelp
                            conceptulHelpMsg={AppConstants.regFormCloseMsg}
                            marginTop={5} />
                        <Form.Item >
                            {getFieldDecorator('registrationCloseDate',
                                { rules: [{ required: true, message: ValidationConstants.registrationCloseDateIsRequired }] })(
                                    <DatePicker
                                        size="large"
                                        style={{ width: "100%" }}
                                        disabledDate={this.disabledDate}
                                        placeholder={"dd-mm-yyyy"}
                                        onChange={(e) => this.dateChange(e, "registrationCloseDate")}
                                        name={"registrationCloseDate"}
                                        disabledTime={this.disabledTime}
                                        format={"DD-MM-YYYY"}
                                        showTime={false}
                                        disabledDate={d => !d || d.isAfter(closeDate)
                                            // || d.isSameOrBefore(dateOpen)
                                        }
                                    // value={closeDate ? moment(closeDate, "YYYY-MM-DD") : ""}
                                    />
                                )}
                        </Form.Item>
                    </div>
                </div>

                <InputWithHead heading={AppConstants.membershipProduct} />
                <Select
                    mode="multiple"
                    className="reg-form-multiple-select"
                    style={{ width: "100%", padding: 1, minWidth: 182 }}
                    onChange={(e) => this.onSelectionMembershipCategory(e)}
                    value={fillteredProduct}
                    placeholder="Select"
                    disabled={isPublished}
                >
                    {productList.map((item, index) => {
                        return (
                            <Option
                                key={item.membershipProductId}
                                value={item.membershipProductId}
                            >
                                {item.membershipProductName}
                            </Option>
                        );
                    })}
                </Select>
                {this.props.registrationState.selectedMemberShipType.length > 0 &&
                    this.props.registrationState.selectedMemberShipType.map((item, index) =>
                        (
                            <div className="inside-container-view">
                                <span className="form-heading pt-2 pl-2">
                                    {item.membershipProductName}
                                </span>
                                <div className="table-responsive">
                                    <Table
                                        rowKey={item => item.id}
                                        showHeader={true}
                                        className="fees-table"
                                        columns={columns}
                                        dataSource={item.membershipProductTypes}
                                        pagination={false}
                                        Divider="false"

                                    />
                                </div>
                            </div>
                        ))
                }
                <div className='row ml-1' style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        className="single-checkbox pt-2"
                        checked={defaultChecked.trainingVisible}
                        onChange={(e) => this.updateTraining(e.target.checked, "trainingVisible")}
                    >
                        {AppConstants.training}
                    </Checkbox>
                    <div style={{ marginTop: 15, marginLeft: -8 }}>
                        <CustomTooltip background='#ff8237'>
                            <span>{AppConstants.regFormTraningMsg}</span>
                        </CustomTooltip>
                    </div>

                </div>
                {defaultChecked.trainingVisible && (
                    <div className="comp-open-reg-check-inpt-view">
                        <div className="fluid-width" style={{ marginTop: 15 }}>
                            <div className="row" style={{ height: 56 }}>
                                <div className="col-sm" style={{ display: "flex" }}>
                                    <Checkbox
                                        className="comp-open-single-checkbox"
                                        checked={defaultChecked.daysVisible}
                                        onChange={(e) => this.updateTraining(e.target.checked, "daysVisible")}
                                    >
                                        {AppConstants.trainingDaysAndTimes}
                                    </Checkbox>
                                </div>
                                {defaultChecked.daysVisible === true && (
                                    <div className="col-sm">
                                        <InputWithHead
                                            auto_Complete="new-trainingDay"
                                            placeholder={AppConstants.trainingDaysAndTimes}
                                            value={formDataValue ? formDataValue.trainingDaysAndTimes : ""}
                                            onChange={(e) => this.props.updateRegistrationForm(e.target.value, "trainingDaysAndTimes")}
                                            name={"trainingDaysAndTimes"}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="fluid-width" style={{ marginTop: 15 }}>
                            <div className="row" style={{ height: 56 }}>
                                <div className="col-sm" style={{ display: "flex" }}>
                                    <Checkbox
                                        className="comp-open-single-checkbox"
                                        onChange={(e) => this.updateTraining(e.target.checked, "venueVisible")}
                                        checked={defaultChecked.venueVisible}
                                    >
                                        {AppConstants.trainingVenue}
                                    </Checkbox>
                                </div>
                                {defaultChecked.venueVisible == true && (
                                    <div className="col-sm">
                                        <Select
                                            name={"trainingVenueId"}
                                            style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                                            onChange={(trainingVenueId) => this.props.updateRegistrationForm(trainingVenueId, "trainingVenueId")
                                            }
                                            value={formDataValue ? formDataValue.trainingVenueId : null}
                                            placeholder="Select"
                                        >
                                            {venueList.map(item => {
                                                return (
                                                    <Option
                                                        key={"trainingVenue" + item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
                }
                <InputWithHead
                    heading={AppConstants.specialNote}
                    conceptulHelp
                    conceptulHelpMsg={AppConstants.regFormSpecialNoteMsg}
                    marginTop={5} />

                < TextArea
                    placeholder={AppConstants.addShortNotes_registering}
                    allowClear
                    name="specialNote"
                    onChange={(specialNote) => this.props.updateRegistrationForm(specialNote.target.value, "specialNote")}
                    value={formDataValue ? formDataValue.specialNote : null}
                />

                <InputWithHead
                    heading={AppConstants.photos}
                    conceptulHelp
                    conceptulHelpMsg={AppConstants.regFormPhotoMsg}
                    marginTop={5} />
                {((formDataValue.organisationPhotos == null || formDataValue.organisationPhotos.length == 0) &&
                    (getOrganisationData().orgLogoUrl == null)) ? <span>{AppConstants.noPhotosAvailable}</span> :
                    <div className="org-photos">
                        {
                            getOrganisationData().orgLogoUrl == null ? null :
                                <div>
                                    <div>
                                        <img src={getOrganisationData().orgLogoUrl} alt="" height={125} width={125}
                                            style={{ borderRadius: 0, marginLeft: 0 }} name={'image'}
                                            onError={ev => { ev.target.src = AppImages.circleImage; }}
                                        />
                                    </div>
                                    <div className="photo-type">{AppConstants.logo}</div>
                                </div>
                        }
                        {((formDataValue.organisationPhotos) || [])
                            .map((ph, phIndex) => (
                                <div key={ph.organisationPhotoId}>
                                    <div>
                                        <img src={ph.photoUrl} alt="" height={125} width={125}
                                            style={{ borderRadius: 0, marginLeft: 0 }} name={'image'}
                                            onError={ev => { ev.target.src = AppImages.circleImage; }}
                                        />
                                    </div>
                                    <div className="photo-type">{ph.photoType}</div>
                                </div>
                            ))}
                        {/* {(formDataValue.organisationPhotos == null || 
                        formDataValue.organisationPhotos == undefined || 
                        formDataValue.organisationPhotos.length == 0) ? 
                            <span>{AppConstants.noPhotosAvailable}</span> : null} */}
                    </div>
                }
            </div >
        );
    };


    ///update training checek box
    updateTraining(checked, key) {
        this.props.isCheckedVisible(checked, key)
    }

    // upldate reply check handle 
    checkReplyTocontact(checked, key) {
        this.props.isReplyCheckVisible(checked, key)
    }


    ///reply to contact details view
    replyContactDetailsView = (
        getFieldDecorator
    ) => {
        let defaultChecked = this.props.registrationState.defaultChecked
        let formDataValue = this.props.registrationState.registrationFormData !== 0 ? this.props.registrationState.registrationFormData[0] : [];
        
        return (
            <div className="fees-view">
                <div className='row ml-1' style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        className="single-checkbox mt-0"
                        checked={defaultChecked.replyContactVisible}
                        onChange={e => this.checkReplyTocontact(e.target.checked, "replyContactVisible")}
                    >
                        {AppConstants.replyToContactDetails}
                    </Checkbox>
                    <div style={{ marginTop: -2, marginLeft: -8 }}>
                        <CustomTooltip background='#ff8237'>
                            <span>{AppConstants.replyContactDetailMsg}</span>
                        </CustomTooltip>
                    </div>

                </div>
                {defaultChecked.replyContactVisible === true && (
                    <div className="comp-open-reg-check-inpt-view">
                        <div className="fluid-width" style={{ marginTop: 15 }}>
                            <div className="row" style={{ height: 56 }}>
                                <div className="col-sm" style={{ display: "flex" }}>
                                    <Checkbox
                                        className="comp-open-single-checkbox"
                                        checked={defaultChecked.replyName}
                                        onChange={e =>
                                            this.checkReplyTocontact(e.target.checked, "replyName")
                                        }
                                    >
                                        {AppConstants.name}
                                    </Checkbox>
                                </div>
                                {defaultChecked.replyName === true && (
                                    <div className="col-sm">
                                        <InputWithHead
                                            auto_Complete="new-name"
                                            placeholder={"Name"}
                                            name={"replyName"}
                                            onChange={(e) => this.props.updateRegistrationForm(e.target.value, "replyName")}
                                            value={formDataValue ? formDataValue.replyName : ''}

                                        />

                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="fluid-width" style={{ marginTop: 15 }}>
                            <div className="row" style={{ height: 56 }}>
                                <div className="col-sm" style={{ display: "flex" }}>
                                    <Checkbox
                                        className="single-checkbox"
                                        checked={defaultChecked.replyRole}
                                        onChange={e =>
                                            this.checkReplyTocontact(e.target.checked, "replyRole")
                                        }
                                    >
                                        {AppConstants.role}
                                    </Checkbox>
                                </div>
                                {defaultChecked.replyRole === true && (
                                    <div className="col-sm">
                                        <InputWithHead
                                            auto_Complete="new-role"
                                            placeholder={AppConstants.role}
                                            name={"replyRole"}
                                            onChange={(e) => this.props.updateRegistrationForm(e.target.value, "replyRole")}
                                            value={formDataValue ? formDataValue.replyRole : ''}

                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="fluid-width" style={{ marginTop: 15 }}>
                            <div className="row" style={{ height: 56 }}>
                                <div className="col-sm" style={{ display: "flex" }}>
                                    <Checkbox
                                        className="single-checkbox"
                                        checked={defaultChecked.replyEmail}
                                        onChange={e =>
                                            this.checkReplyTocontact(e.target.checked, "replyEmail")
                                        }
                                    >
                                        {AppConstants.email}
                                    </Checkbox>
                                </div>
                                {defaultChecked.replyEmail === true && (
                                    <div className="col-sm">
                                        <Form.Item >
                                            {getFieldDecorator(`email`, {
                                                rules: [
                                                    {
                                                        type: "email",
                                                        pattern: new RegExp(AppConstants.emailExp),
                                                        message: ValidationConstants.email_validation
                                                    }
                                                ],
                                            })(
                                                <InputWithHead
                                                    auto_Complete="new-email"
                                                    placeholder={AppConstants.email}
                                                    name={"replyEmail"}
                                                    onChange={e =>
                                                        this.props.updateRegistrationForm(e.target.value, "replyEmail")
                                                    }
                                                    value={formDataValue ? formDataValue.replyEmail : ""}
                                                />
                                            )}
                                        </Form.Item>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="fluid-width" style={{ marginTop: 15 }}>
                            <div className="row" style={{ height: 56 }}>
                                <div className="col-sm" style={{ display: "flex" }}>
                                    <Checkbox
                                        className="single-checkbox"
                                        checked={defaultChecked.replyPhone}
                                        onChange={e =>
                                            this.checkReplyTocontact(e.target.checked, "replyPhone")
                                        }
                                    >
                                        {AppConstants.phone}
                                    </Checkbox>
                                </div>
                                {defaultChecked.replyPhone === true && (
                                    <div className="col-sm">
                                        <InputWithHead
                                            auto_Complete="new-phoneNo"
                                            placeholder={AppConstants.phone}
                                            name={"replyPhone"}
                                            onChange={(e) => this.props.updateRegistrationForm(e.target.value, "replyPhone")}
                                            value={formDataValue ? formDataValue.replyPhone : ''}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    onChangeRegistrationMethod = (value, index) => {
        if (this.props.registrationState.registrationFormData.length > 0) {
            let formDataValue = this.props.registrationState.registrationFormData[0]
            if (formDataValue.registerMethods !== null) {
                let matchIndex = formDataValue.registerMethods.findIndex(
                    x => x.registrationMethodRefId == value.id)
                if (matchIndex > -1) {
                    return true
                }
                else {
                    return false
                }
            }
            else {
                return false
            }
        } else {
            return false
        }
    }

    ///how user register view
    UserRegisterView = (
    ) => {
        let formDataValue = this.props.registrationState.registrationFormData !== 0 ? this.props.registrationState.registrationFormData[0] : [];
        let registrationMethod = this.props.appState.regMethod.length !== 0 ? this.props.appState.regMethod : []
        let isPublished = this.state.isPublished
        return (
            <div className="discount-view pt-5">
                <div className='row ml-1'>
                    <span className="form-heading">{AppConstants.how_users_Register}</span>
                    <div style={{ marginTop: 5, marginLeft: -2 }}>
                        <CustomTooltip background='#ff8237'>
                            <span>{AppConstants.howUserRegisterMsg}</span>
                        </CustomTooltip>
                    </div>
                </div>
                <div className="checkbox-row-wise">
                    {registrationMethod.length > 0 && registrationMethod.map((item, index) => (
                        <Checkbox
                            className="single-checkbox"
                            name='registerMethods'
                            checked={this.onChangeRegistrationMethod(item, index)}
                            onChange={(e) => this.methodSelection(e, item, formDataValue)

                            }
                            key={"methods" + index}
                            disabled={isPublished}
                        >
                            {item.description}
                        </Checkbox>))
                    }
                </div>
            </div >
        );
    };

    // for change and update tree props
    onTreeSelected(itemValue, selectedInvitees) {
        // let selectedInvitees = this.props.registrationState.selectedInvitees
        let upcomingData = [...itemValue]
        let mainValueIndex = upcomingData.findIndex(x => x == "1")

        if (mainValueIndex > -1) {
            for (let i in upcomingData) {
                if (upcomingData[i] == "2") {
                    upcomingData.splice([i], 1)
                }
                if (upcomingData[i] == "3") {
                    upcomingData.splice([i], 1)
                }
                if (upcomingData[i] == "4") {
                    upcomingData.splice([i], 1)
                }
                if (upcomingData[i] == "1") {
                    upcomingData.splice([i], 1)
                }
            }
        }
        if (upcomingData.includes("2") && upcomingData.includes("3") || upcomingData.includes("3") && upcomingData.includes("4") || upcomingData.includes("2") && upcomingData.includes("4")) {
            let selectedIndex = selectedInvitees.findIndex(x => x == "4")
            if (selectedIndex > -1) {
                let index = upcomingData.findIndex(x => x == "4")
                if (index > -1) {
                    upcomingData.splice(index, 1)
                }
                let mainIndex = upcomingData.findIndex(x => x == "1")
                if (mainIndex > -1) {
                    upcomingData.splice(mainIndex, 1)
                }
            }

            let selectedMainIndex = selectedInvitees.findIndex(x => x == "3")
            if (selectedMainIndex > -1) {
                let index = upcomingData.findIndex(x => x == "3")
                if (index > -1) {
                    upcomingData.splice(index, 1)
                }
                let mainIndex = upcomingData.findIndex(x => x == "1")
                if (mainIndex > -1) {
                    upcomingData.splice(mainIndex, 1)
                }
            }
            let selectedSubIndex = selectedInvitees.findIndex(x => x == "2")
            if (selectedSubIndex > -1) {
                let index = upcomingData.findIndex(x => x == "2")
                if (index > -1) {
                    upcomingData.splice(index, 1)
                }
                let mainIndex = upcomingData.findIndex(x => x == "1")
                if (mainIndex > -1) {
                    upcomingData.splice(mainIndex, 1)
                }
            }
        }
        this.props.updateRegistrationForm(upcomingData, "registrationSettings")
    }


    onDemoTreeSelected(itemValue, selectedInvitees) {
        let upcomingData = [...itemValue]
        this.props.updateRegistrationForm(upcomingData, "demographicSettings")
    }
    onNetballTreeSelected(itemValue, selectedInvitees) {
        let upcomingData = [...itemValue]
        let mainValueIndex = upcomingData.findIndex(x => x == "5")
        if (mainValueIndex > -1) {
            upcomingData.splice(mainValueIndex, 1)
        }
        this.props.updateRegistrationForm(upcomingData, "NetballQuestions")
    }
    onOtherTreeSelected(itemValue, selectedInvitees) {
        let upcomingData = [...itemValue]

        this.props.updateRegistrationForm(upcomingData, "OtherQuestions")
    }

    makeSeletedArr(formDataValue) {
        if (formDataValue) {
            let arr = formDataValue.registrationSettings
            let selectedInvitees = []
            if (arr.length > 0) {
                for (let i in arr) {
                    selectedInvitees.push(arr[i].registrationSettingsRefId)
                }
            }

            return selectedInvitees
        } else {
            return []
        }

    }

    ///advance  setting view
    advancedSettingView = () => {
        let formDataValue = this.props.registrationState.registrationFormData !== 0 ? this.props.registrationState.registrationFormData[0] : [];
        let registrationAdvanceSetting = this.props.appState.formSettings !== 0 ? this.props.appState.formSettings : []
        let demographicSetting = this.props.appState.demographicSetting !== 0 ? this.props.appState.demographicSetting : []
        let netballQuestionsSetting = this.props.appState.netballQuestionsSetting !== 0 ? this.props.appState.netballQuestionsSetting : []
        let otherQuestionsSetting = this.props.appState.otherQuestionsSetting !== 0 ? this.props.appState.otherQuestionsSetting : []
        const { selectedInvitees, selectedDemographic, SelectedOtherQuestions, selectedNetballQuestions } = this.props.registrationState
        let isPublished = this.state.isPublished
        let inviteesExpend = (selectedInvitees.includes("2") || selectedInvitees.includes("3") || selectedInvitees.includes("4") || selectedInvitees.includes(2) || selectedInvitees.includes(3) || selectedInvitees.includes(4)) ? "1" : null
        let netballExpend = (selectedNetballQuestions.includes("7") || selectedNetballQuestions.includes(7)) ? "5" : null

        return (
            <div className="discount-view pt-5">
                <div className='row ml-1'>
                    <span className="form-heading">{AppConstants.additionalQuestions}</span>
                    <div style={{ marginTop: 5, marginLeft: -2 }}>
                        <CustomTooltip background='#ff8237'>
                            <span>{AppConstants.additionQuesMsg}</span>
                        </CustomTooltip>
                    </div>
                </div>

                <div className="inside-container-view">
                    <span className="setting-heading">{AppConstants.demographicQuestions}</span>
                    <Tree
                        className="tree-government-rebate"
                        style={{ flexDirection: 'column' }}
                        checkable
                        defaultExpandParent={true}
                        disabled={isPublished}
                        defaultCheckedKeys={[]}
                        checkedKeys={[...selectedDemographic]}
                        onCheck={(e) => this.onDemoTreeSelected(e, selectedDemographic)}
                    >
                        {this.ShowAdvancedSettingSettingTree(demographicSetting)}
                    </Tree>
                </div>
                <div className="inside-container-view">
                    <span className="setting-heading">{AppConstants.netballQuestions}</span>
                    <Tree
                        className="tree-government-rebate tree-selection-icon"
                        style={{ flexDirection: 'column' }}
                        checkable
                        expandedKeys={[netballExpend]}
                        defaultExpandParent={true}
                        disabled={isPublished}
                        defaultCheckedKeys={[]}
                        checkedKeys={[...selectedNetballQuestions]}
                        onCheck={(e) => this.onNetballTreeSelected(e, selectedNetballQuestions)}
                    >
                        {this.ShowAdvancedSettingSettingTree(netballQuestionsSetting)}
                    </Tree>
                </div>
                <div className="inside-container-view">
                    <span className="setting-heading">{AppConstants.otherQuestions}</span>
                    <Tree
                        className="tree-government-rebate"
                        style={{ flexDirection: 'column' }}
                        checkable
                        defaultExpandParent={true}
                        disabled={isPublished}
                        defaultCheckedKeys={[]}
                        checkedKeys={[...SelectedOtherQuestions]}
                        onCheck={(e) => this.onOtherTreeSelected(e, SelectedOtherQuestions)}
                    >
                        {this.ShowAdvancedSettingSettingTree(otherQuestionsSetting)}
                    </Tree>
                </div>




                <span className="form-heading pt-5">{AppConstants.advancedSettings}</span>
                <div className="inside-container-view">
                    <Tree
                        className="tree-government-rebate tree-selection-icon"
                        style={{ flexDirection: 'column' }}
                        checkable
                        expandedKeys={[inviteesExpend]}
                        disabled={isPublished}
                        defaultCheckedKeys={[]}
                        checkedKeys={[...selectedInvitees]}
                        onCheck={(e) => this.onTreeSelected(e, selectedInvitees)}
                    >
                        {this.ShowAdvancedSettingSettingTree(registrationAdvanceSetting)}
                    </Tree>
                </div>
            </div >
        );
    };
    ShowAdvancedSettingSettingTree = tree => {
        const { TreeNode } = Tree;
        return tree.map((item, catIndex) => {
            return (
                <TreeNode title={this.advancedNode(item)} key={item.id} >
                    {this.showSubAdvancedNode(item, catIndex)}
                </TreeNode >
            );
        });
    };

    advancedNode = item => {
        return <span>{item.description}</span>;
    };

    showSubAdvancedNode(item, catIndex) {
        const { TreeNode } = Tree;
        return item.subReferences.map((inItem, scatIndex) => {
            return (
                <TreeNode
                    title={this.makeSubAdvancedNode(inItem)}
                    key={inItem.id}
                ></TreeNode>
            );
        });
    }

    makeSubAdvancedNode(item) {
        return <span>{item.description}</span>;
    }
    disclamerText(textBody, index, key) {
        this.props.updateDisclamerText(textBody, index, key)
    }

    //disclaimer view
    disclaimerView = (
        getFieldDecorator
    ) => {
        let registrationData = this.props.registrationState.registrationFormData.length > 0 ? this.props.registrationState.registrationFormData[0] : [];
        let disclaimerData = registrationData.registrationDisclaimer !== null ? isArrayNotEmpty(registrationData.registrationDisclaimer) ? registrationData.registrationDisclaimer : [] : []
        let isPublished = this.state.isPublished
        return (
            <div className="discount-view pt-5">
                <span className="form-heading">{AppConstants.disclaimers}</span>

                {disclaimerData.map((item, index) =>
                    <div className="inside-container-view">
                        <div className="transfer-image-view pt-0" onClick={(e) => !isPublished ? this.removeDisclaimer(e, index) : null} >
                            <span class="user-remove-btn" ><i class="fa fa-trash-o" aria-hidden="true"></i></span>
                            <span className="user-remove-text">
                                {AppConstants.remove}
                            </span>
                        </div>
                        <Form.Item>
                            {getFieldDecorator(
                                `disclaimerText${index}`,
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: ValidationConstants.disclaimersIsRequired
                                        }
                                    ]
                                },
                            )(
                                <InputWithHead

                                    required={"required-field pb-0 pt-0"}
                                    heading={AppConstants.disclaimers}
                                    placeholder={AppConstants.disclaimers}
                                    onChange={(e) => this.disclamerText(e.target.value, index, "disclaimerText")}
                                    disabled={isPublished}
                                // value={disclaimerData.registrationDisclaimer[index].disclaimerText}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator(
                                `disclaimerLink${index}`,
                                {
                                    rules: [
                                        {
                                            required: true,
                                            message: ValidationConstants.DisclaimerLinkIsRequired
                                        }
                                    ]
                                },
                            )(
                                <InputWithHead
                                    required={"required-field pb-0 "}
                                    heading={AppConstants.disclaimerLink}
                                    placeholder={AppConstants.disclaimerLink}
                                    onChange={(e) => this.disclamerText(e.target.value, index, "disclaimerLink")}
                                    disabled={isPublished}
                                // value={disclaimerData.registrationDisclaimer[index].disclaimerLink}

                                />
                            )}
                        </Form.Item>
                    </div>
                )}
                <span
                    className="input-heading-add-another"
                    onClick={() => !isPublished ? this.addDisclaimerLink() : null}
                >
                    + {AppConstants.addAnotherDisclaimerLink}
                </span>
            </div>
        );
    };
    // Send invite to
    sendInviteToView = () => {
        console.log("commonReducerState" + JSON.stringify(this.props.registrationState.registrationFormData[0].inviteTypeRefId));
        const registrationFormData = this.props.registrationState.registrationFormData[0]
        let { inviteTypeData } = this.props.commonReducerState;
        let isPublished = this.state.isPublished;
        return (
            <div className="discount-view pt-5">
                <span className="form-heading pb-2">{AppConstants.sendInvitesTo}</span>
                <InputWithHead heading={AppConstants.invite} />
                <Radio.Group className="reg-competition-radio pb-5" disabled={isPublished}
                    onChange={(e) => (this.props.updateRegistrationForm(e.target.value, "canInviteSend"))}
                    value={registrationFormData.canInviteSend}>
                    <Radio key={1} value={1}>{AppConstants.send}</Radio>
                    <Radio key={0} value={0}>{AppConstants.noSend}</Radio>
                </Radio.Group>
                {registrationFormData.canInviteSend == 1 ?
                    <div>
                        <div className="fluid-width">
                            <div className="row">
                                <div className="col-sm-3" style={{ marginRight: '25px' }}>
                                    <div
                                        style={{
                                            width: "fit-content", display: "flex", flexDirection: "row",
                                            alignItems: "center"
                                        }}
                                    >
                                        <span className="year-select-heading">
                                            {AppConstants.year}:
                                    </span>
                                        <Select
                                            name={"yearRefId"}
                                            className="year-select  reg-filter-select"
                                            style={{ marginLeft: "25px", minWidth: 100 }}
                                            disabled={isPublished}
                                            onChange={yearRefId => this.onYearChange(yearRefId)}
                                            value={registrationFormData.inviteYearRefId}
                                        // value={formDataValue ? formDataValue.yearRefId ? formDataValue.yearRefId : 1 : 1}
                                        >
                                            {this.props.appState.allYearList.map(item => {
                                                return (
                                                    <Option key={"yearRefId" + item.id} value={item.id}>
                                                        {item.description}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </div>

                                </div>
                                <div className="col-sm-3">
                                    <div
                                        style={{
                                            width: "fit-content",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginRight: 50
                                        }}
                                    >
                                        <span className="year-select-heading">
                                            {AppConstants.competition}:
                                    </span>
                                        <Select
                                            style={{ marginLeft: "25px", minWidth: 160 }}
                                            name={"competition"}
                                            className="year-select reg-filter-select1"
                                            disabled={isPublished}
                                            onChange={e => (this.props.updateRegistrationForm(e, "inviteCompetitionId"))}
                                            value={registrationFormData.inviteCompetitionId != null ?
                                                registrationFormData.inviteCompetitionId.toString() : '0'}>
                                            {this.props.appState.allCompetitionTypeList.map(item => {
                                                return (
                                                    <Option key={"competition" + item.competitionId} value={item.competitionId}>
                                                        {item.competitionName}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <InputWithHead heading={AppConstants.inviteType} />
                        <Radio.Group className="reg-competition-radio" disabled={isPublished} onChange={(e) => (this.props.updateRegistrationForm(e.target.value, "inviteTypeRefId"))} value={registrationFormData.inviteTypeRefId}>
                            {(inviteTypeData || []).map((fix) => (
                                <Radio key={fix.id} value={fix.id}>{fix.description}</Radio>
                            ))}
                        </Radio.Group>
                        <InputWithHead heading={AppConstants.gender} />
                        <Radio.Group className="reg-competition-radio" disabled={isPublished} value={registrationFormData.genderRefId}
                            onChange={(e) => (this.props.updateRegistrationForm(e.target.value, "genderRefId"))}>
                            <Radio value={2}>{AppConstants.male}</Radio>
                            <Radio value={1}> {AppConstants.female}</Radio>
                            <Radio value={3}>{AppConstants.both}</Radio>
                        </Radio.Group>
                        <InputWithHead heading={AppConstants.dOB} />
                        <Radio.Group className="reg-competition-radio" disabled={isPublished}
                            value={registrationFormData.dobPreferenceRefId} onChange={(e) => (this.props.updateRegistrationForm(e.target.value, "dobPreferenceRefId"))}>
                            <Radio className="dob-pref-radio-inner-heading" style={{ marginBottom: 10 }} value={1}>{AppConstants.NoDobPreference}</Radio>
                            <Radio className="dob-pref-radio-inner-heading" value={2}>{AppConstants.DobPreference}</Radio>
                        </Radio.Group>
                        {(registrationFormData.dobPreferenceRefId == 2) ?
                            <div>
                                <div style={{ display: "flex", marginLeft: 23 }}>
                                    <span className="applicable-to-datepicker-col">{AppConstants.DobMoreThan}</span>
                                    <div className="dob-pref-date-picker">
                                        <DatePicker
                                            size="large"
                                            placeholder={"dd-mm-yyyy"}
                                            style={{ width: "100%" }}
                                            onChange={(e) => this.dateChange(e, "dobPreferenceMoreThan")}
                                            name={"dobPreferenceMoreThan"}
                                            format={"DD-MM-YYYY"}
                                            showTime={false}
                                            disabled={isPublished}
                                            disabledDate={(registrationFormData.dobPreferenceLessThan == null) ? false : d => !d || d.isAfter(registrationFormData.dobPreferenceLessThan)}
                                            value={(registrationFormData.dobPreferenceMoreThan == null || registrationFormData.dobPreferenceMoreThan == "") ? "" : moment(registrationFormData.dobPreferenceMoreThan, "YYYY-MM-DD")}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", marginLeft: 23 }}>
                                    <span className="applicable-to-datepicker-col">{AppConstants.DobLessThan}</span>
                                    <div className="dob-pref-date-picker" style={{ marginLeft: 9 }}>
                                        <DatePicker
                                            size="large"
                                            style={{ width: "100%" }}
                                            placeholder={"dd-mm-yyyy"}
                                            onChange={(e) => this.dateChange(e, "dobPreferenceLessThan")}
                                            name={"dobPreferenceLessThan"}
                                            disabledTime={this.disabledTime}
                                            format={"DD-MM-YYYY"}
                                            disabled={isPublished}
                                            showTime={false}
                                            disabledDate={(registrationFormData.dobPreferenceMoreThan == null) ? false : d => !d || d.isSameOrBefore(registrationFormData.dobPreferenceMoreThan)}
                                            // || d.isSameOrBefore(dateOpen)                                      
                                            //  value={closeDate ? moment(closeDate, "YYYY-MM-DD") : ""}
                                            value={(registrationFormData.dobPreferenceLessThan == null || registrationFormData.dobPreferenceLessThan == "") ? "" : moment(registrationFormData.dobPreferenceLessThan, "YYYY-MM-DD")}
                                        />
                                    </div>
                                </div>
                            </div>
                            : null}
                    </div> : null}
            </div>
        )
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let registrationData = this.props.registrationState.registrationFormData.length > 0 ? this.props.registrationState.registrationFormData[0] : [];
        let statusRefId = registrationData.statusRefId
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="reg-add-save-button">
                                {/* <Button type="cancel-button">{AppConstants.delete}</Button> */}
                            </div>
                        </div>
                        <div className="col-sm-9">
                            <div className="comp-buttons-view">
                                <Tooltip style={{ height: "100%" }}
                                    onMouseEnter={() => this.setState({ tooltipVisibleDraft: statusRefId == 2 ? true : false })}
                                    onMouseLeave={() => this.setState({ tooltipVisibleDraft: false })}
                                    visible={this.state.tooltipVisibleDraft}
                                    title={ValidationConstants.compRegHaveBeenSent}>
                                    <Button
                                        className="save-draft-text"
                                        type="save-draft-text"
                                        htmlType="submit"
                                        disabled={statusRefId == 2 ? true : false}
                                        onClick={() => this.setState({ statusRefId: 1 })}
                                    >
                                        {AppConstants.saveAsDraft}
                                    </Button>
                                </Tooltip>

                                <Button className="save-draft-text" type="save-draft-text">
                                    {AppConstants.preview}
                                </Button>
                                {/* <Tooltip style={{ height: "100%" }}
                                    onMouseEnter={() => this.setState({ tooltipVisiblePublish: statusRefId == 2 ? true : false })}
                                    onMouseLeave={() => this.setState({ tooltipVisiblePublish: false })}
                                    visible={this.state.tooltipVisiblePublish}
                                    title={ValidationConstants.compRegHaveBeenSent}> */}
                                <Button
                                    className="open-reg-button"
                                    htmlType="submit"
                                    type="primary"
                                    onClick={() => this.setState({ statusRefId: 2 })}
                                // disabled={statusRefId == 2 ? true : false}
                                // style={{ height: statusRefId == 2 ? "100%" : null, borderRadius: statusRefId == 2 ? 5 : null }}
                                // style={{ height: statusRefId == 2 ? "100%" : null, borderRadius: statusRefId == 2 ? 5 : null }}
                                >
                                    {statusRefId == 2 ? AppConstants.publish : AppConstants.openRegistrations}
                                </Button>
                                {/* </Tooltip> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    navigateToExternalUrl = (url) =>
        window.open(url, "_blank");

    userRegisrationLinkView = () => {
        let formDataValue = this.props.registrationState.registrationFormData !== 0 ?
            this.props.registrationState.registrationFormData[0] : [];
        let statusRefId = formDataValue.statusRefId
        return (
            <div>
                {statusRefId == 2 ?
                    <div className="formView">
                        <div className="content-view pt-4" style={{ marginBottom: '20px' }}>
                            <div className="row">
                                <div className="col-sm">
                                    <InputWithHead heading={AppConstants.endUserRegistrationUrl} />
                                    <div>
                                        <a className="user-reg-link" href={formDataValue.userRegistrationUrl} target='_blank' >
                                            {formDataValue.userRegistrationUrl}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : null
                }
            </div>

        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout
                    menuHeading={AppConstants.registration}
                    menuName={AppConstants.registration}
                />
                <InnerHorizontalMenu menu={"registration"} regSelectedKey={"3"} />
                <Layout>
                    {this.headerView()}
                    <Form
                        autoComplete='off'
                        onSubmit={this.registrationSubmit}
                        noValidate="noValidate"
                    >
                        {/* {this.dropdownView(
                            getFieldDecorator
                        )} */}
                        <Content>
                            {this.userRegisrationLinkView()}
                            <div className="formView">
                                {this.contentView(
                                    getFieldDecorator
                                )}
                            </div>
                            <div className="formView">
                                {this.replyContactDetailsView(
                                    getFieldDecorator
                                )}
                            </div>
                            <div className="formView">{this.UserRegisterView(
                                getFieldDecorator
                            )}</div>
                            <div className="formView">{this.advancedSettingView()}</div>
                            <div className="formView">{this.sendInviteToView()}</div>
                            {/* <div className="formView">
                                    {this.disclaimerView(
                                        getFieldDecorator
                                    )}
                                </div> */}
                            <Loader visible={this.state.onRegistrationLoad || this.props.appState.onLoad
                                || this.props.registrationState.onLoad} />
                        </Content>
                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getYearAndCompetitionAction,
            getVenuesTypeAction,
            getCompetitionTypeListAction,
            regSaveRegistrationForm,
            getRegFormAdvSettings,
            getRegistrationMethod,
            getMembershipproduct,
            getRegistrationForm,
            updateRegistrationForm,
            clearReducerDataAction,
            changeMembershipProduct,
            updateProductSelection,
            updateRegistrationLock,
            updateDisclamerText,
            isCheckedVisible,
            isReplyCheckVisible,
            inviteTypeAction
        },
        dispatch
    );
}
function mapStatetoProps(state) {
    return {
        appState: state.AppState,
        registrationState: state.RegistrationState,
        commonReducerState: state.CommonReducerState
    };
}
export default connect(mapStatetoProps, mapDispatchToProps)(Form.create()(RegistrationForm));
