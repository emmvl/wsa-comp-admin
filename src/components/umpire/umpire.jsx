import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Layout, Button, Table, Select, Menu, Pagination, message, Icon, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getRefBadgeData } from '../../store/actions/appAction'

import AppConstants from "themes/appConstants";
import AppImages from "themes/appImages";
import ValidationConstants from "themes/validationConstant";
// import { entityTypes } from "util/entityTypes";
import { isArrayNotEmpty } from "util/helpers";
import history from "util/history";
import { getUmpireCompetiton, setUmpireCompition, setUmpireCompitionData, getOrganisationData } from "util/sessionStorage";
import { userExportFilesAction } from "store/actions/appAction";
import { umpireMainListAction } from "store/actions/umpireAction/umpireAction";
import { umpireCompetitionListAction } from "store/actions/umpireAction/umpireCompetetionAction";
import InnerHorizontalMenu from "pages/innerHorizontalMenu";
import DashboardLayout from "pages/dashboardLayout";

import "./umpire.css";

const { Content } = Layout;
const { Option } = Select;

let this_obj = null;

const listeners = (key) => ({
    onClick: () => tableSort(key),
});

function checkUserRoll(rolesArr, index) {
    let isClub = "NO"
    if (isArrayNotEmpty(rolesArr)) {
        for (let i in rolesArr) {
            let roles = rolesArr[i].role
            if (roles.name === "umpire_coach") {
                isClub = "YES"
            }
        }
    }
    return isClub
}

function checkUmpireUserRoll(rolesArr, key) {
    let isUmpire = "NO"
    if (isArrayNotEmpty(rolesArr)) {
        for (let i in rolesArr) {
            if (rolesArr[i].roleId === key) {
                isUmpire = "YES"

            }
        }
    }
    return isUmpire
}

function tableSort(key) {
    let sortBy = key;
    let sortOrder = null;
    if (this_obj.state.sortBy !== key) {
        sortOrder = "ASC";
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === "ASC") {
        sortOrder = "DESC";
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === "DESC") {
        sortBy = sortOrder = null;
    }

    this_obj.setState({ sortBy, sortOrder });
    this_obj.props.umpireMainListAction({
        refRoleId: JSON.stringify([15, 20]),
        entityTypes: this_obj.state.isCompParent ? 1 : 6,
        compId: this_obj.state.selectedComp,
        offset: this_obj.state.offsetData,
        sortBy,
        sortOrder,
        userName: this_obj.state.searchText,
        competitionOrgId: this_obj.state.compOrganisationId
    })
}

const mockedSelectNumbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

const columns = [
    {
        title: "Rank",
        dataIndex: "rank",
        key: "rank",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (rank, record) => {
            console.log('sfssdfsdf', rank, record);
            return (
                <Form>
                    <Select
                        onChange={(a) => console.log('AAAAAA', a)}
                    >
                        {mockedSelectNumbers.map((number, i) => <Option key={i}>{number}</Option>)}
                    </Select>
                    <Icon type="check" style={{ fontSize: '16px', color: 'green' }} theme='twoTone'/>
                </Form>
                
                
            )
        },
    },
    {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstsName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (firstName, record) => (
            <NavLink
                to={{
                    pathname: "/userPersonal",
                    state: {
                        userId: record.id,
                        screenKey: "umpire",
                        screen: "/umpire",
                    },
                }}
            >
                <span className="input-heading-add-another pt-0">{firstName}</span>
            </NavLink>
        ),
    },
    {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (lastName, record) => (
            <NavLink
                to={{
                    pathname: "/userPersonal",
                    state: {
                        userId: record.id,
                        screenKey: "umpire",
                        screen: "/umpire",
                    },
                }}
            >
                <span className="input-heading-add-another pt-0">{lastName}</span>
            </NavLink>
        ),
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: "Contact No",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
    },
    {
        title: 'Accreditation',
        dataIndex: 'accreditationLevelUmpireRefId',
        key: 'accreditationLevelUmpireRefId',
        sorter: false,
        render: (accreditationLevelUmpireRefId, record) => (
            <span>{this_obj.checkAccreditationLevel(accreditationLevelUmpireRefId)}</span>
        )
    },
    {
        title: "Organisation",
        dataIndex: "linkedEntity",
        key: "linkedEntity",
        sorter: true,
        onHeaderCell: () => listeners("linkedEntityName"),
        render: (linkedEntity) => (
            <div>
                {linkedEntity.map((item, index) => (
                    <span key={`entityName ${index}`} className="multi-column-text-aligned">{item.name}</span>
                ))}
            </div>
        )
    },
    {
        title: "Umpire",
        dataIndex: "umpire",
        key: "umpire",
        sorter: true,
        onHeaderCell: () => listeners("umpire"),
        render: (umpireCoach, record) => <span>{checkUmpireUserRoll(record.userRoleEntities, 15)}</span>,
    },
    {
        title: "Umpire Coach",
        dataIndex: "umpireCoach",
        key: "umpireCoach",
        sorter: true,
        onHeaderCell: () => listeners("umpireCoach"),
        render: (umpireCoach, record, index) => <span>{checkUserRoll(record.userRoleEntities, index)}</span>,
    },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (data, record) => (
            <Menu
                className="action-triple-dot-submenu"
                theme="light"
                mode="horizontal"
                style={{ lineHeight: "25px" }}
            >
                <Menu.SubMenu
                    key="sub1"
                    style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                    title={
                        <img
                            className="dot-image"
                            src={AppImages.moreTripleDot}
                            width="16"
                            height="16"
                            alt=""
                        />
                    }
                >
                    <Menu.Item key="1">
                        <NavLink
                            to={{
                                pathname: "/addUmpire",
                                state: { isEdit: true, tableRecord: record },
                            }}
                        >
                            <span>Edit</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <NavLink
                            to={{
                                pathname: "./assignUmpire",
                                state: { record },
                            }}
                        >
                            <span>Assign to match</span>
                        </NavLink>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
        ),
    }
];

class Umpire extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            compArray: [],
            offsetData: 0,
            sortBy: null,
            sortOrder: null,
            isCompParent: false,
            compOrganisationId: 0
        };

        this_obj = this;
    }

    async componentDidMount() {
        const { umpireListActionObject } = this.props.umpireState
        let sortBy = this.state.sortBy
        let sortOrder = this.state.sortOrder
        if (umpireListActionObject) {
            let offsetData = umpireListActionObject.offset
            let searchText = umpireListActionObject.userName ? umpireListActionObject.userName : ""
            sortBy = umpireListActionObject.sortBy
            sortOrder = umpireListActionObject.sortOrder
            await this.setState({ sortBy, sortOrder, offsetData, searchText })
        }

        let { organisationId } = JSON.parse(localStorage.getItem("setOrganisationData"));
        this.setState({ loading: true });
        this.props.umpireCompetitionListAction(null, null, organisationId, "USERS");
        this.props.getRefBadgeData(this.props.appstate.accreditation)
    }

    async componentDidUpdate(nextProps) {
        // const { sortBy, sortOrder } = this.state;
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading === true && this.props.umpireCompetitionState.onLoad === false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList)
                    ? this.props.umpireCompetitionState.umpireComptitionList
                    : [];
                let firstComp = compList.length > 0 && compList[0].id;
                let compData = compList.length > 0 && compList[0];

                if (getUmpireCompetiton()) {
                    let compId = JSON.parse(getUmpireCompetiton());
                    let index = compList.findIndex(x => x.id === compId);
                    if (index > -1) {
                        firstComp = compList[index].id;
                        compData = compList[index];
                    } else {
                        setUmpireCompition(firstComp);
                        setUmpireCompitionData(JSON.stringify(compData));
                    }
                } else {
                    // setUmpireCompId(firstComp);
                    setUmpireCompition(firstComp);
                    setUmpireCompitionData(JSON.stringify(compData));
                }
                let compKey = compList.length > 0 && compList[0].competitionUniqueKey;
                let orgItem = await getOrganisationData();
                let userOrganisationId = orgItem ? orgItem.organisationId : 0;
                let compOrgId = compData ? compData.organisationId : 0
                let compOrganisationId = compData ? compData.competitionOrganisation ? compData.competitionOrganisation.id : 0 : 0
                let isCompParent = userOrganisationId === compOrgId
                this.setState({ isCompParent, compOrganisationId });
                let sortBy = this.state.sortBy
                let sortOrder = this.state.sortOrder
                if (firstComp !== false) {
                    this.props.umpireMainListAction({
                        refRoleId: JSON.stringify([15, 20]),
                        entityTypes: isCompParent ? 1 : 6,
                        compId: firstComp,
                        offset: this.state.offsetData,
                        sortBy,
                        sortOrder,
                        userName: this.state.searchText,
                        competitionOrgId: compOrganisationId
                    });
                    this.setState({
                        selectedComp: firstComp,
                        loading: false,
                        competitionUniqueKey: compKey,
                        compArray: compList,
                    });
                } else {
                    this.setState({ loading: false });
                }
            }
        }
    }

    checkUserId = (record) => {
        if (record.userId === null) {
            message.config({ duration: 1.5, maxCount: 1 });
            message.warn(ValidationConstants.umpireMessage);
        } else {
            history.push("/userPersonal", {
                userId: record.userId,
                screenKey: "umpire",
                screen: "/umpire",
            });
        }
    }

    checkAccreditationLevel = (accreditation) => {
        if (this.props.appstate.accreditation) {
            let accreditationArr = this.props.appstate.accreditation
            for (let i in accreditationArr) {
                if (accreditationArr[i].id == accreditation) {
                    return accreditationArr[i].description
                }
            }

        }
        return ""
    }

    handlePageChange = (page) => {
        const { sortBy, sortOrder } = this.state;
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({
            offsetData: offset,
        });

        this.props.umpireMainListAction({
            refRoleId: JSON.stringify([15, 20]),
            entityTypes: this.state.isCompParent ? 1 : 6,
            compId: this.state.selectedComp,
            offset,
            sortBy,
            sortOrder,
            userName: this.state.searchText,
            competitionOrgId: this.state.compOrganisationId
        });
    };

    contentView = () => {
        const { umpireList_Data, totalCount_Data, currentPage_Data } = this.props.umpireState;
        let umpireListResult = isArrayNotEmpty(umpireList_Data) ? umpireList_Data : [];
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.umpireState.onLoad}
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={umpireListResult}
                        pagination={false}
                        rowKey={(record) => "umpireListResult" + record.id}
                    />
                </div>

                <div className="comp-dashboard-botton-view-mobile">
                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end" />

                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            current={currentPage_Data}
                            total={totalCount_Data}
                            // defaultPageSize={10}
                            onChange={this.handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                </div>
            </div>
        );
    };

    onChangeComp = async (compID) => {
        let selectedComp = compID.comp;
        // setUmpireCompId(selectedComp);

        const { sortBy, sortOrder } = this.state;
        let compObj = null;
        for (let i in this.state.compArray) {
            if (compID.comp === this.state.compArray[i].id) {
                compObj = this.state.compArray[i];
                break;
            }
        }
        let orgItem = await getOrganisationData();
        let userOrganisationId = orgItem ? orgItem.organisationId : 0;
        let compOrgId = compObj ? compObj.organisationId : 0
        let isCompParent = userOrganisationId === compOrgId
        this.setState({ isCompParent });

        setUmpireCompition(selectedComp);
        setUmpireCompitionData(JSON.stringify(compObj));

        let compKey = compID.competitionUniqueKey;

        this.props.umpireMainListAction({
            refRoleId: JSON.stringify([15, 20]),
            entityTypes: this.state.isCompParent ? 1 : 6,
            compId: selectedComp,
            offset: 0,
            sortBy,
            sortOrder,
            userName: this.state.searchText,
            competitionOrgId: this.state.compOrganisationId
        });

        this.setState({ selectedComp, competitionUniqueKey: compKey });
    };

    // on change search text
    onChangeSearchText = (e) => {
        this.setState({ searchText: e.target.value, offsetData: 0 });

        const { sortBy, sortOrder } = this.state;
        if (e.target.value === null || e.target.value === "") {
            this.props.umpireMainListAction({
                refRoleId: JSON.stringify([15, 20]),
                entityTypes: this.state.isCompParent ? 1 : 6,
                compId: this.state.selectedComp,
                offset: 0,
                userName: e.target.value,
                sortBy,
                sortOrder,
                competitionOrgId: this.state.compOrganisationId
            });
        }
    };

    // search key
    onKeyEnterSearchText = (e) => {
        this.setState({ offsetData: 0 });
        const { sortBy, sortOrder } = this.state;
        const code = e.keyCode || e.which;
        if (code === 13) { // 13 is the enter keycode
            this.props.umpireMainListAction({
                refRoleId: JSON.stringify([15, 20]),
                entityTypes: this.state.isCompParent ? 1 : 6,
                compId: this.state.selectedComp,
                userName: this.state.searchText,
                offset: 0,
                sortBy,
                sortOrder,
                competitionOrgId: this.state.compOrganisationId
            });
        }
    };

    // on click of search icon
    onClickSearchIcon = () => {
        this.setState({ offsetData: 0 });
        const { sortBy, sortOrder } = this.state;
        if (this.state.searchText === null || this.state.searchText === "") {
        } else {
            this.props.umpireMainListAction({
                refRoleId: JSON.stringify([15, 20]),
                entityTypes: this.state.isCompParent ? 1 : 6,
                compId: this.state.selectedComp,
                userName: this.state.searchText,
                offset: 0,
                sortBy,
                sortOrder,
                competitionOrgId: this.state.compOrganisationId
            });
        }
    };

    onExport = () => {
        const url = AppConstants.umpireListExport + `entityTypeId=${1}&entityId=${this.state.selectedComp}&roleId=${15}`;
        this.props.userExportFilesAction(url);
    };

    headerView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : [];
        let { isCompParent } = this.state
        let isCompetitionAvailable = this.state.selectedComp ? false : true
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1 d-flex align-content-center">
                            <span className="form-heading">
                                {AppConstants.umpireList}
                            </span>
                        </div>

                        <div className="col-sm-8 w-100 d-flex flex-row align-items-center justify-content-end">
                            <div className="row">
                                <div className="col-sm pt-1">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <NavLink to="/addUmpire" className="text-decoration-none">
                                            <Button disabled={isCompetitionAvailable} className="primary-add-comp-form" type="primary">
                                                + {AppConstants.addUmpire}
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>

                                <div className="col-sm pt-1">
                                    <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <Button
                                            className="primary-add-comp-form"
                                            type="primary"
                                            onClick={this.onExport}
                                            disabled={isCompetitionAvailable}
                                        >
                                            <div className="row">
                                                <div className="col-sm">
                                                    <img
                                                        className="export-image"
                                                        src={AppImages.export}
                                                        alt=""
                                                    />
                                                    {AppConstants.export}
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>

                                <div className="col-sm pt-1">
                                    {isCompParent && <div className="comp-dashboard-botton-view-mobile w-100 d-flex flex-row align-items-center justify-content-end">
                                        <NavLink
                                            className="text-decoration-none"
                                            to={{
                                                pathname: `/umpireImport`,
                                                state: { screenName: "umpire" }
                                            }}
                                        >
                                            <Button className="primary-add-comp-form" type="primary">
                                                <div className="row">
                                                    <div className="col-sm">
                                                        <img
                                                            className="export-image"
                                                            src={AppImages.import}
                                                            alt=""
                                                        />
                                                        {AppConstants.import}
                                                    </div>
                                                </div>
                                            </Button>
                                        </NavLink>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 d-flex justify-content-between">
                        <div className="w-ft d-flex flex-row align-items-center" style={{ marginRight: 50 }}>
                            <span className="year-select-heading">{AppConstants.competition}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 200 }}
                                onChange={(comp) => this.onChangeComp({ comp })}
                                value={this.state.selectedComp}
                            >
                                {competition.map((item) => (
                                    <Option key={'competition_' + item.id} value={item.id}>{item.longName}</Option>
                                ))}
                            </Select>
                        </div>

                        <div className="comp-product-search-inp-width">
                            <Input
                                className="product-reg-search-input"
                                onChange={this.onChangeSearchText}
                                placeholder="Search..."
                                onKeyPress={this.onKeyEnterSearchText}
                                value={this.state.searchText}
                                prefix={
                                    <SearchOutlined
                                        style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                        onClick={this.onClickSearchIcon}
                                    />
                                }
                                allowClear
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />

                <InnerHorizontalMenu menu="umpire" umpireSelectedKey="2" />

                <Layout>
                    {this.headerView()}

                    <Content>
                        {/* {this.dropdownView()} */}
                        {this.contentView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        umpireCompetitionListAction,
        umpireMainListAction,
        userExportFilesAction,
        getRefBadgeData
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        umpireState: state.UmpireState,
        umpireCompetitionState: state.UmpireCompetitionState,
        appstate: state.AppState
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Umpire);
