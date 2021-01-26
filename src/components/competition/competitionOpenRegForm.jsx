import React, { Component, createRef } from "react";
import {
    Layout,
    Breadcrumb,
    Input,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Table,
    Radio,
    Tabs,
    Form,
    Modal,
    message,
    Tooltip
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import { captializedString, isImageFormatValid, isImageSizeValid } from "../../util/helpers"
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getAllCompetitionFeesDeatilsAction,
    saveCompetitionFeesDetailsAction,
    getDefaultCompFeesMembershipProductTabAction,
    saveCompetitionFeesDivisionAction,
    divisionTableDataOnchangeAction,
    addRemoveDivisionAction,
    paymentFeeDeafault,
    paymentSeasonalFee,
    paymentPerMatch,
    add_editcompetitionFeeDeatils,
    competitionDiscountTypesAction,
    regCompetitionListDeleteAction,
    getDefaultCharity,
    getDefaultCompFeesLogoAction,
    clearCompReducerDataAction,
    removeCompetitionDivisionAction
} from "../../store/actions/registrationAction/competitionFeeAction";
import {
    competitionFeeInit, getVenuesTypeAction, getCommonDiscountTypeTypeAction,
    getYearListAction, getCompetitionTypeListAction, getYearAndCompetitionOwnAction,
    searchVenueList,
    clearFilter,
} from "../../store/actions/appAction";
import moment from "moment";
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";
import { NavLink } from "react-router-dom"
import {
    setOwn_competition,
    getOwn_competition,
    getOwn_competitionStatus,
    setOwn_competitionStatus,
    // getOwn_CompetitionFinalRefId,
    setOwn_CompetitionFinalRefId,
    setGlobalYear, getGlobalYear,
    getOrganisationData
} from "../../util/sessionStorage";
import Loader from '../../customComponents/loader';
import { venueListAction } from '../../store/actions/commonAction/commonAction'
import CustomToolTip from 'react-png-tooltip'
import { fixtureTemplateRoundsAction } from '../../store/actions/competitionModuleAction/competitionDashboardAction';
import AppUniqueId from "../../themes/appUniqueId";
import { getCurrentYear } from 'util/permissions'
const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;
let this_Obj = null;

const permissionObject = {
    compDetailDisable: false,
    regInviteesDisable: false,
    membershipDisable: false,
    divisionsDisable: false,
    feesTableDisable: false,
    paymentsDisable: false,
    discountsDisable: false,
    allDisable: false,
    isPublished: false
}

const divisionTableColumns = [
    {
        title: "Division Name",
        dataIndex: "divisionName",
        key: "divisionName",
        render: (divisionName, record, index) => (
            <Form.Item
                name={`divisionName${record.parentIndex}${index}`}
                rules={[{ required: true, message: ValidationConstants.divisionName }]}
            >
                <Input
                    className="input-inside-table-fees"
                    required="required-field pt-0 pb-0"
                    value={divisionName}
                    onChange={e => this_Obj.divisionTableDataOnchange(e.target.value, record, index, "divisionName")}
                    disabled={(this_Obj.state.competitionStatus == 1 || this_Obj.state.permissionState.divisionsDisable)}
                />
            </Form.Item>
        )
    },
    {
        title: "Gender Restriction",
        dataIndex: "genderRestriction",
        key: AppUniqueId.div_gender_chkbox,
        filterDropdown: true,
        filterIcon: () => (
            <CustomToolTip placement="top">
                <span>{AppConstants.genderRestrictionMsg}</span>
            </CustomToolTip>
        ),
        render: (genderRestriction, record, index) => (
            <div>
                <Checkbox
                    className="single-checkbox mt-1"
                    disabled={(this_Obj.state.competitionStatus == 1 || this_Obj.state.permissionState.divisionsDisable)}
                    checked={genderRestriction}
                    onChange={e => this_Obj.divisionTableDataOnchange(e.target.checked, record, index, "genderRestriction")}
                />
            </div>
        )
    },
    {
        dataIndex: "genderRefId",
        key: AppUniqueId.div_gender_refid,
        render: (genderRefId, record, index) => (
            record.genderRestriction && (
                <Form.Item
                    name={`genderRefId${record.parentIndex}${index}`}
                    rules={[{ required: true, message: ValidationConstants.genderRestriction }]}
                >
                    <Select
                        className="division-age-select w-100"
                        style={{ minWidth: 120 }}
                        onChange={genderRefId => this_Obj.divisionTableDataOnchange(genderRefId, record, index, "genderRefId")}
                        value={genderRefId}
                        placeholder="Select"
                        disabled={(this_Obj.state.competitionStatus == 1 || this_Obj.state.permissionState.divisionsDisable)}
                    >
                        {this_Obj.props.commonReducerState.genderDataEnum.map(item => (
                            <Option key={'gender_' + item.id} value={item.id}>
                                {item.description}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            )
        )
    },
    {
        title: "Age Restriction",
        dataIndex: "ageRestriction",
        key: AppUniqueId.div_ageres_chkbox,
        filterDropdown: true,
        filterIcon: () => (
            <CustomToolTip placement="top">
                <span>{AppConstants.ageRestrictionMsg}</span>
            </CustomToolTip>
        ),
        render: (ageRestriction, record, index) => (
            <div>
                <Checkbox
                    className="single-checkbox mt-1"
                    checked={ageRestriction}
                    onChange={e => this_Obj.divisionTableDataOnchange(e.target.checked, record, index, "ageRestriction")}
                    disabled={(this_Obj.state.competitionStatus == 1 || this_Obj.state.permissionState.divisionsDisable)}
                />
            </div>
        )
    },
    {
        title: "DOB From",
        dataIndex: "fromDate",
        key: AppUniqueId.div_ageres_fromdate,
        width: "25%",
        render: (fromDate, record, index) => (
            <Form.Item
                name={`fromDate${record.parentIndex}${index}`}
                rules={[{ required: record.ageRestriction, message: ValidationConstants.pleaseSelectDOBFrom }]}
            >
                <DatePicker
                    size="default"
                    className="comp-venue-time-datepicker w-100"
                    style={{ minWidth: 135 }}
                    onChange={date => this_Obj.divisionTableDataOnchange(moment(date).format("YYYY-MM-DD"), record, index, "fromDate")}
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    disabled={(!record.ageRestriction || this_Obj.state.competitionStatus == 1 || this_Obj.state.permissionState.divisionsDisable)}
                    value={fromDate !== null && moment(fromDate)}
                    disabledDate={d => !d || d.isSameOrAfter(record.toDate)}
                />
            </Form.Item>
        )
    },
    {
        title: "DOB To",
        dataIndex: "toDate",
        width: "25%",
        key: AppUniqueId.div_ageres_todate,
        render: (toDate, record, index) => (
            <Form.Item
                name={`toDate${record.parentIndex}${index}`}
                rules={[{ required: record.ageRestriction, message: ValidationConstants.PleaseSelectDOBTo }]}
            >
                <DatePicker
                    size="default"
                    className="comp-venue-time-datepicker w-100"
                    style={{ minWidth: 135 }}
                    onChange={date => this_Obj.divisionTableDataOnchange(moment(date).format("YYYY-MM-DD"), record, index, "toDate")}
                    format="DD-MM-YYYY"
                    placeholder="dd-mm-yyyy"
                    showTime={false}
                    disabled={(!record.ageRestriction || this_Obj.state.competitionStatus == 1 || this_Obj.state.permissionState.divisionsDisable)}
                    value={toDate !== null && moment(toDate)}
                    disabledDate={d => moment(record.fromDate).isSameOrAfter(d, 'day')}
                />
            </Form.Item>
        )
    },
    {
        title: "",
        dataIndex: "clear",
        key: "clear",
        render: (clear, record, index) => (
            <span className="d-flex justify-content-center w-100 pointer">
                <img
                    className="dot-image"
                    src={AppImages.redCross}
                    alt=""
                    width="16"
                    height="16"
                    onClick={() => !this_Obj.state.permissionState.divisionsDisable ? this_Obj.addRemoveDivision(index, record, "remove") : null}
                />
            </span>
        )
    }
];

class CompetitionOpenRegForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearRefId: null,
            value: "NETSETGO",
            division: "Division",
            sourceModule: "COMP",
            competitionTabKey: "1",
            profileImage: null,
            image: null,
            loading: false,
            getDataLoading: false,
            statusRefId: 1,
            visible: false,
            buttonPressed: "next",
            logoIsDefault: false,
            logoSetDefault: false,
            logoUrl: "",
            isSetDefaul: false,
            competitionIsUsed: false,
            firstTimeCompId: "",
            organisationTypeRefId: 0,
            isCreatorEdit: false, //////// user is owner of the competition than isCreatorEdit will be false
            isPublished: false,
            isRegClosed: false,
            permissionState: permissionObject,
            tooltipVisibleDelete: false,
            tooltipVisibleDraft: false,
            tooltipVisiblePublish: false,
            deleteDivModalVisible: false,
            competitionDivisionId: null,
            deleteLoading: false,
            competitionStatus: 0,
            divisionState: false,
            nextButtonClicked: false,
            onYearLoad: false
        };
        this_Obj = this;
        this.props.clearCompReducerDataAction("all")
        this.formRef = createRef();
    }

    async componentDidUpdate(nextProps) {
        let competitionFeesState = this.props.competitionFeesState
        if (competitionFeesState.onLoad === false && this.state.loading === true) {
            this.setState({ loading: false })
            if (!competitionFeesState.error) {
                this.setState({
                    competitionTabKey: JSON.stringify(JSON.parse(this.state.competitionTabKey) + 1),
                    logoSetDefault: false,
                    image: null
                })
            }
            if (this.state.buttonPressed === "save" || this.state.buttonPressed === "publish" || this.state.buttonPressed === "delete") {
                history.push('/competitionDashboard');
            }
        }
        if (nextProps.competitionFeesState !== competitionFeesState) {

            if (competitionFeesState.getCompAllDataOnLoad === false && this.state.getDataLoading) {
                let isPublished = competitionFeesState.competitionDetailData.statusRefId == 2

                let registrationCloseDate = competitionFeesState.competitionDetailData.registrationCloseDate
                    && moment(competitionFeesState.competitionDetailData.registrationCloseDate)
                let isRegClosed = registrationCloseDate ? !registrationCloseDate.isSameOrAfter(moment()) : false;

                let creatorId = competitionFeesState.competitionCreator
                let orgData = getOrganisationData() ? getOrganisationData() : null
                let organisationUniqueKey = orgData ? orgData.organisationUniqueKey : 0
                let isCreatorEdit = creatorId == organisationUniqueKey ? false : true;

                this.setPermissionFields(isPublished, isRegClosed, isCreatorEdit)

                this.setState({
                    getDataLoading: false,
                    profileImage: competitionFeesState.competitionDetailData.competitionLogoUrl,
                    competitionIsUsed: competitionFeesState.competitionDetailData.isUsed,
                    isPublished,
                    isRegClosed,
                    isCreatorEdit
                })
                this.setDetailsFieldValue()
            }

            if (competitionFeesState.deleteDivisionLoad == false && this.state.deleteLoading) {
                this.setState({ deleteLoading: false });
                this.setDivisionFormFields();
            }
        }
        if (nextProps.appState !== this.props.appState) {
            let competitionTypeList = this.props.appState.all_own_CompetitionArr
            if (nextProps.appState.all_own_CompetitionArr !== competitionTypeList) {
                if (competitionTypeList.length > 0) {
                    let screenKey = this.props.location.state ? this.props.location.state.screenKey : null;
                    let fromReplicate = this.props.location.state ? this.props.location.state.fromReplicate : null
                    let competitionId = null
                    let statusRefId = null
                    let competitionStatus = null
                    let finalTypeRefId = null

                    if (screenKey === "compDashboard" || fromReplicate == 1) {
                        competitionId = getOwn_competition()
                        let compIndex = competitionTypeList.findIndex(x => x.competitionId == competitionId)
                        statusRefId = compIndex > -1 ? competitionTypeList[compIndex].statusRefId : competitionTypeList[0].statusRefId
                        competitionId = compIndex > -1 ? competitionId : competitionTypeList[0].competitionId
                        competitionStatus = competitionTypeList[compIndex] ? competitionTypeList[compIndex].competitionStatus : 0
                        setOwn_competitionStatus('')
                        setOwn_competition('')
                        setOwn_CompetitionFinalRefId('')
                    } else {
                        competitionId = competitionTypeList[0].competitionId
                        statusRefId = competitionTypeList[0].statusRefId
                        competitionStatus = competitionTypeList[0].competitionStatus
                        finalTypeRefId = competitionTypeList[0].finalTypeRefId
                    }
                    let yearRefId = getGlobalYear() ? getGlobalYear() : this.props.appState.own_YearArr.length > 0 && getCurrentYear(this.props.appState.own_YearArr)

                    this.props.getAllCompetitionFeesDeatilsAction(competitionId, null, this.state.sourceModule, null, yearRefId)
                    if (competitionStatus == 2) {
                        setOwn_competitionStatus(statusRefId)
                        setOwn_competition(competitionId)
                        setOwn_CompetitionFinalRefId(finalTypeRefId)
                    }

                    this.setState({
                        getDataLoading: true,
                        firstTimeCompId: competitionId,
                        competitionStatus: statusRefId,
                        yearRefId: JSON.parse(yearRefId)
                    })
                }
            }
        }

        if (competitionFeesState.onLoad === false && this.state.divisionState === true) {
            setTimeout(() => {
                this.setDetailsFieldValue();
            }, 100);
            this.setState({ divisionState: false });
        }

        if (competitionFeesState.onLoad === false && this.state.loading === true) {
            if (!competitionFeesState.error) {
                if (this.state.nextButtonClicked === true) {
                    this.setState({
                        nextButtonClicked: false,
                        loading: false
                    });
                    let fromReplicate = this.props.location.state ? this.props.location.state.fromReplicate : null;
                    await setGlobalYear(this.state.yearRefId)
                    await setOwn_competition(this.props.competitionFeesState.competitionId);
                    await setOwn_competitionStatus(this.state.statusRefId);
                    history.push("/competitionPlayerGrades", { fromReplicate: fromReplicate });
                } else {
                    this.setState({
                        loading: false
                    })
                }
            } else {
                this.setState({
                    nextButtonClicked: false,
                    loading: false
                })
            }
        }

        if (this.state.onYearLoad == true && this.props.appState.onLoad == false) {
            if (this.props.appState.yearList.length > 0) {
                let mainYearRefId = getCurrentYear(this.props.appState.yearList)
                this.props.add_editcompetitionFeeDeatils(mainYearRefId, "yearRefId")

                this.getMembershipDetails(mainYearRefId)

                this.setState({
                    onYearLoad: false,
                    yearRefId: mainYearRefId
                })
                this.formRef.current.setFieldsValue({
                    yearRefId: mainYearRefId
                });
                this.setDetailsFieldValue(mainYearRefId)
            }
        }
    }

    ////disable or enable particular fields
    setPermissionFields = (isPublished, isRegClosed, isCreatorEdit) => {
        // let invitees = this.props.competitionFeesState.competitionDetailData.invitees
        // let hasRegistration = this.props.competitionFeesState.competitionDetailData.hasRegistration
        if (isPublished) {
            if (isRegClosed) {
                let permissionObject = {
                    compDetailDisable: false,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    divisionsDisable: false,  // Updated for Comp Division Handling
                    feesTableDisable: true,
                    paymentsDisable: true,
                    discountsDisable: true,
                    allDisable: false,
                    isPublished: true
                }
                this.setState({ permissionState: permissionObject })
                return
            }

            if (isCreatorEdit) {
                let permissionObject = {
                    compDetailDisable: true,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    divisionsDisable: false,// Updated for Comp Division Handling
                    feesTableDisable: true,
                    paymentsDisable: true,
                    discountsDisable: true,
                    allDisable: true,
                    isPublished: true
                }
                this.setState({ permissionState: permissionObject })
            } else {
                let permissionObject = {
                    compDetailDisable: false,
                    regInviteesDisable: true,
                    membershipDisable: true,
                    // divisionsDisable: hasRegistration == 1,
                    divisionsDisable: false, // Updated for Comp Division Handling
                    feesTableDisable: true,
                    paymentsDisable: false,
                    discountsDisable: true,
                    allDisable: false,
                    isPublished: true
                }
                this.setState({ permissionState: permissionObject })
            }
        } else {
            let permissionObject = {
                compDetailDisable: false,
                regInviteesDisable: false,
                membershipDisable: false,
                divisionsDisable: false,
                feesTableDisable: false,
                paymentsDisable: false,
                discountsDisable: false,
                allDisable: false,
                isPublished: false
            }
            this.setState({ permissionState: permissionObject })
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        let orgData = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null
        this.setState({ organisationTypeRefId: orgData.organisationTypeRefId })
        let competitionId = null
        this.apiCalls(competitionId)
        this.getRefernce()
        this.setDetailsFieldValue()
    }

    getRefernce() {
        let yearId = getGlobalYear()
        let storedCompetitionId = getOwn_competition()
        let storedCompetitionStatus = getOwn_competitionStatus()
        // let storedfinalTypeRefId = getOwn_CompetitionFinalRefId()
        let propsData = this.props.appState.own_YearArr.length > 0 ? this.props.appState.own_YearArr : undefined
        let compData = this.props.appState.all_own_CompetitionArr.length > 0 ? this.props.appState.all_own_CompetitionArr : undefined;
        let fromReplicate = this.props.location.state ? this.props.location.state.fromReplicate : null;

        if (fromReplicate != 1) {
            if (storedCompetitionId && yearId && propsData && compData) {
                this.props.getAllCompetitionFeesDeatilsAction(storedCompetitionId, null, this.state.sourceModule, null, JSON.parse(yearId))
                this.setState({
                    yearRefId: JSON.parse(yearId),
                    firstTimeCompId: storedCompetitionId,
                    competitionStatus: storedCompetitionStatus,
                    getDataLoading: true
                })
            } else if (yearId) {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
                this.setState({
                    yearRefId: JSON.parse(yearId)
                });
            } else {
                this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, null, 'own_competition')
            }
        } else {
            this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
            this.setState({
                yearRefId: JSON.parse(yearId),
                firstTimeCompId: storedCompetitionId
            });
        }
    }

    ////all the api calls
    apiCalls = (competitionId) => {
        this.props.getDefaultCompFeesLogoAction();
        this.props.competitionDiscountTypesAction();
        this.props.competitionFeeInit();
        this.props.paymentFeeDeafault();
        this.props.paymentSeasonalFee();
        this.props.paymentPerMatch();
        this.props.getCommonDiscountTypeTypeAction();
        this.props.getVenuesTypeAction('all');
        this.props.fixtureTemplateRoundsAction();
        // this.props.venueListAction();

    }

    getMembershipDetails = (yearRefId) => {
        let affiliateOrgId = this.props.location.state ? this.props.location.state.affiliateOrgId : null;
        let competitionId = this.props.location.state ? this.props.location.state.id : null;
        if (competitionId !== null) {
            let hasRegistration = 1;
            this.props.getAllCompetitionFeesDeatilsAction(
                competitionId,
                hasRegistration,
                "REG",
                affiliateOrgId,
                yearRefId
            );
            this.setState({ getDataLoading: true });
        } else {
            let hasRegistration = 1;
            this.props.getDefaultCompFeesMembershipProductTabAction(hasRegistration, yearRefId);
            this.props.getDefaultCharity();
        }
    }

    setDetailsFieldValue() {
        let compFeesState = this.props.competitionFeesState
        this.formRef.current.setFieldsValue({
            competition_name: compFeesState.competitionDetailData.competitionName,
            numberOfRounds: compFeesState.competitionDetailData.noOfRounds,
            yearRefId: compFeesState.competitionDetailData.yearRefId,
            competitionTypeRefId: compFeesState.competitionDetailData.competitionTypeRefId,
            competitionFormatRefId: compFeesState.competitionDetailData.competitionFormatRefId,
            selectedVenues: compFeesState.selectedVenues,
            startDate: compFeesState.competitionDetailData.startDate && moment(compFeesState.competitionDetailData.startDate),
            endDate: compFeesState.competitionDetailData.endDate && moment(compFeesState.competitionDetailData.endDate),
            finalTypeRefId: compFeesState.competitionDetailData.finalTypeRefId,
        })
        let data = this.props.competitionFeesState.competionDiscountValue
        let discountData = data && data.competitionDiscounts !== null ? data.competitionDiscounts[0].discounts : []
        discountData.forEach((item, index) => {
            let competitionMembershipProductTypeId = `competitionMembershipProductTypeId${index}`
            let membershipProductUniqueKey = `membershipProductUniqueKey${index}`
            this.formRef.current.setFieldsValue({
                [competitionMembershipProductTypeId]: item.competitionMembershipProductTypeId,
                [membershipProductUniqueKey]: item.membershipProductUniqueKey,
            })
        })

        this.setDivisionFormFields();
    }

    setDivisionFormFields = () => {
        let divisionData = this.props.competitionFeesState.competitionDivisionsData
        let divisionArray = divisionData !== null ? divisionData : []
        divisionArray.forEach((item, index) => {
            item.divisions.forEach((divItem, divIndex) => {
                let divisionName = `divisionName${index}${divIndex}`
                let genderRefId = `genderRefId${index}${divIndex}`
                let fromDate = `fromDate${index}${divIndex}`
                let toDate = `toDate${index}${divIndex}`
                this.formRef.current.setFieldsValue({
                    [divisionName]: divItem.divisionName,
                    [genderRefId]: divItem.genderRefId ? divItem.genderRefId : [],
                    [fromDate]: divItem.fromDate && moment(divItem.fromDate),
                    [toDate]: divItem.toDate && moment(divItem.toDate),
                });
            })
        })
    }

    checkDivisionEmpty(data) {
        for (let i in data) {
            if (data[i].divisions.length === 0) {
                return true
            }
        }
    }

    saveAPIsActionCall = (values) => {
        let tabKey = this.state.competitionTabKey
        let compFeesState = this.props.competitionFeesState
        let competitionId = compFeesState.competitionId
        let postData = compFeesState.competitionDetailData
        let nonPlayingDate = JSON.stringify(postData.nonPlayingDates)
        let venue = JSON.stringify(compFeesState.postVenues)
        let invitees = JSON.stringify(compFeesState.postInvitees)
        if (tabKey == "1") {
            if (compFeesState.competitionDetailData.competitionLogoUrl !== null) {
                let formData = new FormData();
                formData.append("competitionUniqueKey", competitionId);
                formData.append("name", postData.competitionName);
                formData.append("yearRefId", this.state.yearRefId);
                formData.append("description", postData.description);
                formData.append("competitionTypeRefId", postData.competitionTypeRefId);
                formData.append("competitionFormatRefId", postData.competitionFormatRefId);
                formData.append("finalTypeRefId", postData.finalTypeRefId);
                formData.append("startDate", postData.startDate);
                formData.append("endDate", postData.endDate);
                if (postData.competitionFormatRefId == 4) {
                    if (postData.noOfRounds !== null && postData.noOfRounds !== '') formData.append("noOfRounds", postData.noOfRounds);
                }
                if (postData.roundInDays !== null && postData.roundInDays !== '') formData.append("roundInDays", postData.roundInDays);
                if (postData.roundInHours !== null && postData.roundInHours !== '') formData.append("roundInHours", postData.roundInHours);
                if (postData.roundInMins !== null && postData.roundInMins !== '') formData.append("roundInMins", postData.roundInMins);
                if (postData.minimunPlayers !== null && postData.minimunPlayers !== '') formData.append("minimunPlayers", postData.minimunPlayers);
                if (postData.maximumPlayers !== null && postData.maximumPlayers !== '') formData.append("maximumPlayers", postData.maximumPlayers);
                formData.append("venues", venue);
                formData.append("registrationCloseDate", postData.registrationCloseDate);
                formData.append("statusRefId", this.state.isPublished ? 2 : this.state.statusRefId);
                formData.append("nonPlayingDates", nonPlayingDate);
                formData.append("invitees", invitees);
                formData.append("logoSetAsDefault", this.state.logoSetDefault)
                formData.append("hasRegistration", 0);
                if (this.state.logoSetDefault) {
                    formData.append("organisationLogoId", compFeesState.defaultCompFeesOrgLogoData.id)
                }
                if (postData.logoIsDefault) {
                    formData.append("competitionLogoId", postData.competitionLogoId ? postData.competitionLogoId : 0);
                    formData.append("logoFileUrl", compFeesState.defaultCompFeesOrgLogo);
                    formData.append("competition_logo", compFeesState.defaultCompFeesOrgLogo)
                } else {
                    if (this.state.image !== null) {
                        formData.append("competition_logo", this.state.image)
                        formData.append("competitionLogoId", postData.competitionLogoId ? postData.competitionLogoId : 0);
                    } else {
                        formData.append("competitionLogoId", postData.competitionLogoId ? postData.competitionLogoId : 0);
                        formData.append("logoFileUrl", postData.competitionLogoUrl);
                        // formData.append("competition_logo", compFeesState.defaultCompFeesOrgLogo)
                    }
                }
                formData.append("logoIsDefault", postData.logoIsDefault)

                if (this.state.image) {
                    formData.append("uploadFileType", 1);
                }

                this.props.saveCompetitionFeesDetailsAction(formData, compFeesState.defaultCompFeesOrgLogoData.id, this.state.sourceModule)
                setOwn_CompetitionFinalRefId(postData.finalTypeRefId)
                this.setState({ loading: true, divisionState: true });
            } else {
                message.error(ValidationConstants.competitionLogoIsRequired)
            }
        } else if (tabKey == "2") {
            let divisionArrayData = compFeesState.competitionDivisionsData
            let finalDivisionArray = []
            for (let i in divisionArrayData) {
                finalDivisionArray = [...finalDivisionArray, ...divisionArrayData[i].divisions]
            }
            let payload = finalDivisionArray
            let finalDivisionPayload = {
                statusRefId: this.state.isPublished ? 2 : this.state.statusRefId,
                divisions: payload,
                sourceModule: this.state.sourceModule
            }
            if (this.checkDivisionEmpty(divisionArrayData)) {
                message.error(ValidationConstants.pleaseAddDivisionForMembershipProduct)
            } else {
                this.props.saveCompetitionFeesDivisionAction(finalDivisionPayload, competitionId)
                this.setState({ loading: true })
            }
        }
    }

    divisionTableDataOnchange(checked, record, index, keyword) {
        this.props.divisionTableDataOnchangeAction(checked, record, index, keyword)
        this.setState({ divisionState: true })
    }

    dateOnChangeFrom = (date, key) => {
        if (date !== null) {
            this.props.add_editcompetitionFeeDeatils((moment(date).format("YYYY-MM-DD")), key)
        }
    };

    headerView = () => (
        <div className="header-view">
            <Header className="form-header-view d-flex bg-transparent align-items-center">
                <Breadcrumb separator="">
                    <Breadcrumb.Item className="breadcrumb-add">
                        {AppConstants.competitionDetails}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="mt-n20">
                    <CustomToolTip placement="top">
                        <span>{AppConstants.compDetailsMsg}</span>
                    </CustomToolTip>
                </div>
            </Header>
        </div>
    );

    // year change and get competition lost
    onYearChange(yearId) {
        setGlobalYear(yearId)
        setOwn_competition(undefined)
        setOwn_competitionStatus(undefined)
        setOwn_CompetitionFinalRefId(undefined)
        this.props.clearCompReducerDataAction("all")
        this.props.getYearAndCompetitionOwnAction(this.props.appState.own_YearArr, yearId, 'own_competition')
        // this.props.getCompetitionTypeListAction(yearRefId);
        this.setState({ firstTimeCompId: null, yearRefId: yearId, competitionStatus: 0 })
        this.setDetailsFieldValue()
        this.getMembershipDetails(yearId)
    }

    onCompetitionChange(competitionId, competitionArray) {
        let competititionIndex = competitionArray.findIndex((x) => x.competitionId == competitionId)
        let competitionStatus = competitionArray[competititionIndex].competitionStatus
        let statusRefId = competitionArray[competititionIndex].statusRefId
        let finalTypeRefId = competitionArray[competititionIndex].finalTypeRefId
        if (competitionStatus == 2) {
            setOwn_competition(competitionId)
            setOwn_competitionStatus(statusRefId)
            setOwn_CompetitionFinalRefId(finalTypeRefId)
        }
        this.props.clearCompReducerDataAction("all")
        this.props.getAllCompetitionFeesDeatilsAction(competitionId, null, this.state.sourceModule, null, this.state.yearRefId)
        this.setState({ getDataLoading: true, firstTimeCompId: competitionId, competitionStatus: statusRefId })
    }

    dropdownView = () => {
        const { own_YearArr, all_own_CompetitionArr } = this.props.appState
        return (
            <div className="comp-venue-courts-dropdown-view mt-0">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm-3 pb-3">
                            <div className="w-ft d-flex flex-row align-items-center">
                                <span className="year-select-heading">
                                    {AppConstants.year}:
                                </span>
                                <Select
                                    name="yearRefId"
                                    className="year-select reg-filter-select-year ml-2"
                                    onChange={yearRefId => this.onYearChange(yearRefId)}
                                    value={this.state.yearRefId}
                                >
                                    {own_YearArr.map(item => (
                                        <Option key={'year_' + item.id} value={item.id}>
                                            {item.description}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                        <div className="col-sm-3 pb-3">
                            <div className="w-ft d-flex flex-row align-items-center" style={{ minWidth: 300, marginRight: 50 }}>
                                <span id={AppUniqueId.existing_comp_dropdown} className="year-select-heading">
                                    {AppConstants.competition}:
                                </span>
                                <Select
                                    name="competition"
                                    className="year-select reg-filter-select-competition ml-2"
                                    onChange={(competitionId) => this.onCompetitionChange(competitionId, all_own_CompetitionArr)}
                                    value={JSON.parse(JSON.stringify(this.state.firstTimeCompId))}
                                >
                                    {all_own_CompetitionArr.map(item => (
                                        <Option key={'competition_' + item.competitionId} value={item.competitionId}>
                                            {item.competitionName}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // setImage = (data) => {
    //     if (data.files[0] !== undefined) {
    //         let files_ = data.files[0].type.split("image/")
    //         let fileType = files_[1]

    //         if (data.files[0].size > AppConstants.logo_size) {
    //             message.error(AppConstants.logoImageSize);
    //             return
    //         }

    //         if (fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') {
    //             this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]), isSetDefaul: true })
    //             this.props.add_editcompetitionFeeDeatils(URL.createObjectURL(data.files[0]), "competitionLogoUrl")
    //             this.props.add_editcompetitionFeeDeatils(false, "logoIsDefault")
    //         } else {
    //             message.error(AppConstants.logoType);
    //         }
    //     }
    // };

    setImage = (data) => {
        if (data.files[0] !== undefined) {
            let file = data.files[0]
            let extension = file.name.split('.').pop().toLowerCase();
            let imageSizeValid = isImageSizeValid(file.size)
            let isSuccess = isImageFormatValid(extension);
            if (!isSuccess) {
                message.error(AppConstants.logo_Image_Format);
                return
            }
            if (!imageSizeValid) {
                message.error(AppConstants.logo_Image_Size);
                return
            }
            this.setState({ image: data.files[0], profileImage: URL.createObjectURL(data.files[0]), isSetDefaul: true })
            this.props.add_editcompetitionFeeDeatils(URL.createObjectURL(data.files[0]), "competitionLogoUrl")
            this.props.add_editcompetitionFeeDeatils(false, "logoIsDefault")
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

    /// add-edit non playing dates and name
    updateNonPlayingNames(data, index, key) {
        let detailsData = this.props.competitionFeesState
        let array = detailsData.competitionDetailData.nonPlayingDates
        if (key === "name") {
            array[index].name = data
        } else {
            array[index].nonPlayingDate = moment(data).format("YYYY-MM-DD")
        }

        this.props.add_editcompetitionFeeDeatils(array, "nonPlayingDates")
    }

    // Non playing dates view
    nonPlayingDateView(item, index) {
        let compDetailDisable = this.state.permissionState.compDetailDisable
        let disabledStatus = this.state.competitionStatus == 1
        return (
            <div className="fluid-width mt-3">
                <div className="row">
                    <div className="col-sm">
                        <InputWithHead
                            auto_complete={`new-name${index}`}
                            placeholder={AppConstants.name}
                            value={item.name}
                            onChange={(e) => this.updateNonPlayingNames(e.target.value, index, "name")}
                            disabled={disabledStatus || compDetailDisable}
                        />
                    </div>
                    <div className="col-sm">
                        <DatePicker
                            className="comp-dashboard-botton-view-mobile w-100"
                            // size="large"
                            placeholder="dd-mm-yyyy"
                            onChange={date => this.updateNonPlayingNames(date, index, "date")}
                            format="DD-MM-YYYY"
                            showTime={false}
                            value={item.nonPlayingDate && moment(item.nonPlayingDate, "YYYY-MM-DD")}
                            disabled={disabledStatus || compDetailDisable}
                        />
                    </div>
                    <div className="col-sm-2 transfer-image-view" onClick={() => !compDetailDisable ? this.removeNonPlaying(index) : null}>
                        <a className="transfer-image-view">
                            <span className="user-remove-btn">
                                <i className="fa fa-trash-o" aria-hidden="true" />
                            </span>
                            <span className="user-remove-text mr-0">{AppConstants.remove}</span>
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    //On selection of venue
    onSelectValues(item, detailsData) {
        this.props.add_editcompetitionFeeDeatils(item, "venues")
        this.props.clearFilter()
    }

    //remove non playing dates
    removeNonPlaying(index) {
        if (this.state.competitionStatus == 1) {

        } else {
            this.props.add_editcompetitionFeeDeatils(index, "nonPlayingDataRemove")
        }
    }

    ///// Add Non Playing dates
    addNonPlayingDate() {
        if (this.state.competitionStatus == 1) {

        } else {
            let nonPlayingObject = {
                competitionNonPlayingDatesId: 0,
                name: "",
                nonPlayingDate: ""
            }
            this.props.add_editcompetitionFeeDeatils(nonPlayingObject, "nonPlayingObjectAdd")
        }
    }

    /////on change logo isdefault
    logoIsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(value, key)
        this.setState({ logoSetDefault: false, isSetDefaul: false, image: null })
    }

    ////onChange save as default logo
    logoSaveAsDefaultOnchange = (value, key) => {
        this.props.add_editcompetitionFeeDeatils(false, key)
        this.setState({ logoSetDefault: value })
    }

    // search venue
    handleSearch = (value, data) => {
        const filteredData = data.filter(memo => {
            return memo.name.toLowerCase().indexOf(value.toLowerCase()) > -1
        })
        this.props.searchVenueList(filteredData)
    };

    setGradesAndPools = (value) => {
        this.props.add_editcompetitionFeeDeatils(value, "finalTypeRefId")
    }

    ///////form content view - fee details
    contentView = () => {
        let roundsArray = this.props.competitionManagementState.fixtureTemplate;
        let appState = this.props.appState
        // const { venueList, mainVenueList } = this.props.commonReducerState
        let detailsData = this.props.competitionFeesState
        let defaultCompFeesOrgLogo = detailsData.defaultCompFeesOrgLogo
        let compDetailDisable = this.state.permissionState.compDetailDisable
        let disabledStatus = this.state.competitionStatus == 1
        return (
            <div className="content-view pt-4">
                <Form.Item
                    name="competition_name"
                    rules={[{ required: true, message: ValidationConstants.competitionNameIsRequired }]}
                >
                    <InputWithHead
                        auto_complete="off"
                        required="required-field"
                        heading={AppConstants.competition_name}
                        placeholder={AppConstants.competition_name}
                        onChange={(e) => this.props.add_editcompetitionFeeDeatils(captializedString(e.target.value), "competitionName")}
                        disabled={disabledStatus || compDetailDisable}
                        onBlur={(i) => this.formRef.current.setFieldsValue({
                            'competition_name': captializedString(i.target.value)
                        })}
                    />
                </Form.Item>

                <InputWithHead required="required-field" heading={AppConstants.competitionLogo} />
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-competition-logo-view" onClick={this.selectImage}>
                                <label>
                                    <img
                                        src={detailsData.competitionDetailData.competitionLogoUrl == null ? AppImages.circleImage : detailsData.competitionDetailData.competitionLogoUrl}
                                        alt=""
                                        height="120"
                                        width="120"
                                        style={{ borderRadius: 60 }}
                                        name="image"
                                        onError={ev => {
                                            ev.target.src = AppImages.circleImage;
                                        }}
                                    />
                                </label>
                            </div>
                            <input
                                disabled={disabledStatus || compDetailDisable}
                                type="file"
                                id="user-pic"
                                className="d-none"
                                onChange={(evt) => this.setImage(evt.target)}
                                onClick={(event) => {
                                    event.target.value = null
                                }}
                            />
                        </div>
                        <div className="col-sm d-flex justify-content-center align-items-start flex-column">
                            {defaultCompFeesOrgLogo !== null && (
                                <Checkbox
                                    className="single-checkbox"
                                    checked={detailsData.competitionDetailData.logoIsDefault}
                                    onChange={e =>
                                        this.logoIsDefaultOnchange(e.target.checked, "logoIsDefault")
                                    }
                                    disabled={disabledStatus || compDetailDisable}
                                >
                                    {AppConstants.useDefault}
                                </Checkbox>
                            )}

                            {this.state.isSetDefaul && (
                                <Checkbox
                                    className="single-checkbox ml-0"
                                    checked={this.state.logoSetDefault}
                                    onChange={e =>
                                        this.logoSaveAsDefaultOnchange(e.target.checked, "logoIsDefault")
                                    }
                                    disabled={disabledStatus || compDetailDisable}
                                >
                                    {AppConstants.useAffiliateLogo}
                                </Checkbox>
                            )}
                        </div>
                    </div>
                    <span className="image-size-format-text">
                        {AppConstants.imageSizeFormatText}
                    </span>
                </div>

                <InputWithHead heading={AppConstants.description} />

                <TextArea
                    placeholder={AppConstants.addShortNotes_registering}
                    allowClear
                    value={detailsData.competitionDetailData.description}
                    onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "description")}
                    disabled={disabledStatus || compDetailDisable}
                />

                <div>
                    <InputWithHead required="required-field" heading={AppConstants.venue} />
                    <Form.Item
                        name="selectedVenues"
                        rules={[{ required: true, message: ValidationConstants.pleaseSelectVenue }]}
                    >
                        <Select
                            id={AppUniqueId.select_Venues}
                            mode="multiple"
                            className="w-100"
                            style={{ paddingRight: 1, minWidth: 182 }}
                            onChange={venueSelection => {
                                this.onSelectValues(venueSelection, detailsData)
                            }}
                            placeholder={AppConstants.selectVenue}
                            filterOption={false}
                            onSearch={(value) => { this.handleSearch(value, appState.mainVenueList) }}
                            disabled={disabledStatus || compDetailDisable}
                        >
                            {appState.venueList.map((item) => (
                                <Option key={'venue_' + item.id} value={item.id}>{item.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                {this.state.competitionStatus == 1 ? (
                    <span className="input-heading-add-another">+{AppConstants.addVenue}</span>
                ) : (
                        <NavLink
                            to={{ pathname: `/competitionVenueAndTimesAdd`, state: { key: AppConstants.competitionDetails } }}
                        >
                            <span className="input-heading-add-another">+{AppConstants.addVenue}</span>
                        </NavLink>
                    )}
                <span className="applicable-to-heading required-field">{AppConstants.typeOfCompetition}</span>
                <Form.Item
                    name="competitionTypeRefId"
                    rules={[{ required: true, message: ValidationConstants.pleaseSelectCompetitionType }]}
                >
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionTypeRefId")}
                        value={detailsData.competitionTypeRefId}
                        disabled={disabledStatus || compDetailDisable}
                    >
                        {appState.typesOfCompetition.map(item => (
                            <Radio key={'competitionType_' + item.id} value={item.id}>{item.description}</Radio>
                        ))}
                    </Radio.Group>
                </Form.Item>

                <span className="applicable-to-heading required-field">{AppConstants.competitionFormat}</span>
                <Form.Item
                    name="competitionFormatRefId"
                    rules={[{ required: true, message: ValidationConstants.pleaseSelectCompetitionFormat }]}
                >
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.props.add_editcompetitionFeeDeatils(e.target.value, "competitionFormatRefId")}
                        value={detailsData.competitionFormatRefId}
                        disabled={disabledStatus || compDetailDisable}
                    >
                        {appState.competitionFormatTypes.map(item => (
                            <div className="contextualHelp-RowDirection" key={item.id}>
                                <Radio key={item.id} value={item.id}>{item.description}</Radio>
                                <div className="ml-n20 mt-3">
                                    <CustomToolTip>
                                        <span>{item.helpMsg}</span>
                                    </CustomToolTip>
                                </div>
                            </div>
                        ))}
                    </Radio.Group>
                </Form.Item>

                <span className="applicable-to-heading required-field">{AppConstants.gradesOrPools}</span>
                <Form.Item
                    name="finalTypeRefId"
                    initialValue={detailsData.competitionDetailData.finalTypeRefId}
                    rules={[{ required: true, message: ValidationConstants.pleaseSelectGradesOrPools }]}
                >
                    <Radio.Group
                        className="reg-competition-radio"
                        onChange={e => this.setGradesAndPools(e.target.value)}
                        value={detailsData.competitionDetailData.finalTypeRefId}
                    >
                        <Radio value={1}>{AppConstants.grades}</Radio>
                        <Radio value={2}>{AppConstants.pools}</Radio>
                    </Radio.Group>
                </Form.Item>
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm">
                            <InputWithHead heading={AppConstants.compStartDate} required="required-field" />
                            <Form.Item name="startDate" rules={[{ required: true, message: ValidationConstants.startDateIsRequired }]}>
                                <DatePicker
                                    size="default"
                                    className="w-100"
                                    onChange={date => this.dateOnChangeFrom(date, "startDate")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    disabled={disabledStatus || compDetailDisable}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-sm">
                            <InputWithHead heading={AppConstants.compCloseDate} required="required-field" />
                            <Form.Item
                                name="endDate"
                                rules={[{ required: true, message: ValidationConstants.endDateIsRequired }]}
                            >
                                <DatePicker
                                    size="default"
                                    className="w-100"
                                    onChange={date => this.dateOnChangeFrom(date, "endDate")}
                                    format="DD-MM-YYYY"
                                    placeholder="dd-mm-yyyy"
                                    showTime={false}
                                    disabledDate={d => !d || d.isBefore(detailsData.competitionDetailData.startDate)}
                                    disabled={disabledStatus || compDetailDisable}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
                {detailsData.competitionDetailData.competitionFormatRefId == 4 && (
                    <div>
                        <InputWithHead heading={AppConstants.numberOfRounds} required="required-field pb-1" />
                        <Form.Item name="numberOfRounds" rules={[{ required: true, message: ValidationConstants.numberOfRoundsNameIsRequired }]}>
                            <Select
                                className="w-100"
                                style={{ paddingRight: 1, minWidth: 182 }}
                                placeholder={AppConstants.selectRound}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e, "noOfRounds")}
                                value={detailsData.competitionDetailData.noOfRounds}
                                disabled={disabledStatus || compDetailDisable}
                            >
                                {roundsArray.map(item => (
                                    <Option key={'round_' + item.noOfRounds} value={item.noOfRounds}>
                                        {item.noOfRounds}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                )}
                <InputWithHead heading={AppConstants.timeBetweenRounds} />
                <div className="fluid-width">
                    <div className="row">
                        <div id={AppUniqueId.time_rounds_days} className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.days}
                                value={detailsData.competitionDetailData.roundInDays}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInDays")}
                                disabled={disabledStatus || compDetailDisable}
                                heading={AppConstants._days}
                                required={'pt-0'}
                            />
                        </div>
                        <div id={AppUniqueId.time_rounds_hrs} className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.hours}
                                value={detailsData.competitionDetailData.roundInHours}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInHours")}
                                disabled={disabledStatus || compDetailDisable}
                                heading={AppConstants._hours}
                                required={'pt-0'}
                            />
                        </div>
                        <div id={AppUniqueId.time_rounds_mins} className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.mins}
                                value={detailsData.competitionDetailData.roundInMins}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "roundInMins")}
                                disabled={disabledStatus || compDetailDisable}
                                heading={AppConstants._minutes}
                                required={'pt-0'}
                            />
                        </div>
                    </div>
                </div>
                <div className="inside-container-view pt-4">
                    <InputWithHead heading={AppConstants.nonPlayingDates} />
                    {detailsData.competitionDetailData.nonPlayingDates && detailsData.competitionDetailData.nonPlayingDates.map((item, index) =>
                        this.nonPlayingDateView(item, index))
                    }
                    <a>
                        <span onClick={() => !compDetailDisable ? this.addNonPlayingDate() : null} className="input-heading-add-another">
                            + {AppConstants.addAnotherNonPlayingDate}
                        </span>
                    </a>
                </div>
                <InputWithHead heading={AppConstants.playerInEachTeam} />
                <div className="fluid-width">
                    <div className="row">
                        <div id={AppUniqueId.team_min_players} className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.minNumber}
                                value={detailsData.competitionDetailData.minimunPlayers}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "minimunPlayers")}
                                disabled={disabledStatus || compDetailDisable}
                            />
                        </div>
                        <div id={AppUniqueId.team_max_players} className="col-sm">
                            <InputWithHead
                                auto_complete="off"
                                placeholder={AppConstants.maxNumber}
                                value={detailsData.competitionDetailData.maximumPlayers}
                                onChange={(e) => this.props.add_editcompetitionFeeDeatils(e.target.value, "maximumPlayers")}
                                disabled={disabledStatus || compDetailDisable}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    //////add or remove another division in the division tab
    addRemoveDivision = (index, item, keyword) => {
        if (this.state.competitionStatus == 1) {

        } else {
            if (keyword === "add") {
                this.props.addRemoveDivisionAction(index, item, keyword);
            } else if (item.competitionDivisionId != 0) {
                this.setState({ deleteDivModalVisible: true, divisionIndex: index, competitionDivision: item })
            } else {
                this.props.addRemoveDivisionAction(index, this.state.competitionDivision, "removeDivision");
                this.setDivisionFormFields();
            }
        }
    }

    handleDeleteDivision = (key) => {
        if (key === "ok") {
            let payload = {
                competitionDivisionId: this.state.competitionDivision.competitionDivisionId
            }
            this.props.addRemoveDivisionAction(this.state.divisionIndex, this.state.competitionDivision, "remove");
            this.props.removeCompetitionDivisionAction(payload);
            this.setState({ deleteLoading: true });
        }
        this.setState({ deleteDivModalVisible: false })
    }

    divisionsView = () => {
        let divisionData = this.props.competitionFeesState.competitionDivisionsData
        let divisionArray = divisionData !== null ? divisionData : []
        let divisionsDisable = this.state.permissionState.divisionsDisable
        // let disabledStatus = this.state.competitionStatus == 1
        return (
            <div className="fees-view pt-5">
                <div className="contextualHelp-RowDirection">
                    <span className="form-heading required-field">{AppConstants.divisions}</span>
                    <CustomToolTip placement="top">
                        <span>{AppConstants.compDivisionMsg}</span>
                    </CustomToolTip>
                </div>
                {divisionArray.length === 0 && (
                    <span className="applicable-to-heading pt-0">
                        {AppConstants.please_Sel_mem_pro}
                    </span>
                )}
                {divisionArray.map((item, index) => (
                    <div key={item.competitionMembershipProductId}>
                        <div className="inside-container-view">
                            <span className="form-heading pt-2 pl-2">
                                {item.membershipProductName}
                            </span>
                            {item.isPlayingStatus ? (
                                <div>
                                    <div className="table-responsive content-responsive">
                                        <Table
                                            className="fees-table"
                                            columns={divisionTableColumns}
                                            dataSource={[...item.divisions]}
                                            pagination={false}
                                            rowKey="competitionDivisionId"
                                        />
                                    </div>
                                    <a>
                                        <span
                                            id={AppUniqueId.add_div_button}
                                            className="input-heading-add-another"
                                            onClick={() =>
                                                !divisionsDisable
                                                    ? this.addRemoveDivision(index, item, 'add')
                                                    : null
                                            }
                                        >
                                            + {AppConstants.addDivision}
                                        </span>
                                    </a>
                                </div>
                            ) : (
                                    <span className="applicable-to-heading pt-0 pl-2">
                                        {AppConstants.nonPlayerDivisionMessage}
                                    </span>
                                )}
                        </div>
                    </div>
                ))}

                <Modal
                    className="add-membership-type-modal"
                    title={AppConstants.deleteDivision}
                    visible={this.state.deleteDivModalVisible}
                    onOk={() => this.handleDeleteDivision("ok")}
                    onCancel={() => this.handleDeleteDivision("cancel")}
                >
                    <p>{AppConstants.competitionDivisionValidation}</p>
                </Modal>
            </div>
        );
    };

    //////delete the membership product
    showDeleteConfirm = () => {
        let competitionId = this.props.competitionFeesState.competitionId
        let this_ = this
        confirm({
            title: 'Are you sure delete this product?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                if (competitionId.length > 0) {
                    this_.deleteProduct(competitionId)
                }
            },
            onCancel() {
            },
        });
    }

    deleteProduct = (competitionId) => {
        this.setState({ loading: true, buttonPressed: "delete" })
        this.props.regCompetitionListDeleteAction(competitionId)
    }

    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        let tabKey = this.state.competitionTabKey
        let isPublished = this.state.permissionState.isPublished
        let allDisable = this.state.permissionState.allDisable
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            <div className="reg-add-save-button">
                                <Button id={AppUniqueId.compdiv_cancel_button} disabled={this.state.competitionStatus == 1} className="cancelBtnWidth" type="cancel-button" onClick={() => history.push('/competitionDashboard')}>{AppConstants.back}</Button>
                            </div>
                        </div>
                        <div className="col-sm">
                            {this.state.competitionStatus == 1 && tabKey == "2" ? (
                                <div className="comp-buttons-view">
                                    <Tooltip
                                        className="h-100"
                                        onMouseEnter={() => this.setState({ tooltipVisiblePublish: true })}
                                        onMouseLeave={() => this.setState({ tooltipVisiblePublish: false })}
                                        visible={this.state.tooltipVisiblePublish}
                                        title={AppConstants.statusPublishHover}
                                    >
                                        <Button
                                            id={AppUniqueId.compdiv_save_button}
                                            className="publish-button save-draft-text"
                                            type="primary"
                                            disabled={this.state.competitionStatus == 1}
                                            htmlType="submit"
                                            onClick={() => this.setState({
                                                statusRefId: tabKey == "2" ? 2 : 1,
                                                buttonPressed: tabKey == "2" ? "publish" : "next"
                                            })}
                                            style={{ width: 92.5 }}
                                        >
                                            {tabKey === "2" ? AppConstants.save : AppConstants.next}
                                        </Button>
                                    </Tooltip>
                                    {tabKey == "2" && (
                                        <Button
                                            onClick={() => this.setState({
                                                nextButtonClicked: true,
                                                statusRefId: tabKey == "2" ? 2 : 1
                                            })}
                                            className="publish-button"
                                            type="primary"
                                            htmlType="submit"
                                            disabled={this.state.competitionStatus == 1}
                                        >
                                            {AppConstants.next}
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                    <div className="comp-buttons-view">
                                        <Tooltip
                                            className="h-100"
                                            onMouseEnter={() => this.setState({ tooltipVisiblePublish: allDisable })}
                                            onMouseLeave={() => this.setState({ tooltipVisiblePublish: false })}
                                            visible={this.state.tooltipVisiblePublish}
                                            title={ValidationConstants.compIsPublished}
                                        >
                                            <Button
                                                id={AppUniqueId.compdiv_save_button}
                                                className="publish-button save-draft-text"
                                                type="primary"
                                                disabled={tabKey === "1" || tabKey === "2" ? this.state.competitionStatus == 1 ? true : allDisable : isPublished}
                                                htmlType="submit"
                                                onClick={() => this.setState({
                                                    statusRefId: tabKey == "2" ? 2 : 1,
                                                    buttonPressed: tabKey == "2" ? "publish" : "next"
                                                })}
                                                style={{ width: 92.5 }}
                                            >
                                                {tabKey === "2" ? this.state.isPublished ? AppConstants.save : AppConstants.publish : AppConstants.next}
                                            </Button>
                                        </Tooltip>
                                        {tabKey == "2" && (
                                            <Button
                                                onClick={() => this.setState({
                                                    nextButtonClicked: true,
                                                    statusRefId: tabKey == "2" ? 2 : 1
                                                })}
                                                htmlType="submit"
                                                className="publish-button"
                                                type="primary"
                                            >
                                                {AppConstants.next}
                                            </Button>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    tabCallBack = (key) => {
        let competitionId = this.props.competitionFeesState.competitionId
        if (competitionId !== null && competitionId.length > 0) {
            this.setState({ competitionTabKey: key, divisionState: key == "2" })
        }
        this.setDetailsFieldValue()
    }

    onFinishFailed = (errorInfo) => {
        message.config({ maxCount: 1, duration: 1.5 })
        message.error(ValidationConstants.plzReviewPage)
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu="competition" compSelectedKey="3" />
                <Layout>
                    <Form
                        ref={this.formRef}
                        autoComplete="off"
                        onFinish={this.saveAPIsActionCall}
                        onFinishFailed={(err) => {
                            this.formRef.current.scrollToField(err.errorFields[0].name)
                            this.onFinishFailed()
                        }}
                        initialValues={{
                            competitionTypeRefId: 1,
                            competitionFormatRefId: 1,
                        }}
                        noValidate="noValidate"
                    >
                        {this.headerView()}

                        {this.dropdownView()}

                        <Content>
                            <div className="tab-view">
                                <Tabs activeKey={this.state.competitionTabKey} onChange={this.tabCallBack}>
                                    <TabPane tab={AppConstants.details} key="1">
                                        <div className="tab-formView mt-5">{this.contentView()}</div>
                                    </TabPane>
                                    <TabPane tab={AppConstants.divisions} key="2">
                                        <div className="tab-formView">{this.divisionsView()}</div>
                                    </TabPane>
                                </Tabs>
                            </div>
                            <Loader
                                visible={
                                    this.props.competitionFeesState.onLoad ||
                                    this.props.appState.onLoad || this.state.getDataLoading ||
                                    this.props.competitionFeesState.deleteDivisionLoad
                                }
                            />
                        </Content>

                        <Footer>{this.footerView()}</Footer>
                    </Form>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        competitionFeeInit,
        getVenuesTypeAction,
        getAllCompetitionFeesDeatilsAction,
        saveCompetitionFeesDetailsAction,
        getDefaultCompFeesMembershipProductTabAction,
        saveCompetitionFeesDivisionAction,
        divisionTableDataOnchangeAction,
        addRemoveDivisionAction,
        paymentFeeDeafault,
        paymentSeasonalFee,
        paymentPerMatch,
        add_editcompetitionFeeDeatils,
        competitionDiscountTypesAction,
        getCommonDiscountTypeTypeAction,
        regCompetitionListDeleteAction,
        getDefaultCharity,
        getYearListAction,
        getCompetitionTypeListAction,
        clearCompReducerDataAction,
        getDefaultCompFeesLogoAction,
        getYearAndCompetitionOwnAction,
        searchVenueList,
        venueListAction,
        clearFilter,
        removeCompetitionDivisionAction,
        fixtureTemplateRoundsAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        competitionFeesState: state.CompetitionFeesState,
        appState: state.AppState,
        commonReducerState: state.CommonReducerState,
        competitionManagementState: state.CompetitionManagementState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionOpenRegForm);
