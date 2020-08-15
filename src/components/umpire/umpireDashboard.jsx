import React, { Component } from "react";
import { Input, Layout, Button, Table, Select, Menu, Icon, Pagination, message } from 'antd';
import './umpire.css';
import { NavLink } from 'react-router-dom';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isArrayNotEmpty } from "../../util/helpers";
import { getUmpireDashboardList, getUmpireDashboardVenueList, getUmpireDashboardDivisionList, umpireRoundListAction, umpireDashboardUpdate } from "../../store/actions/umpireAction/umpireDashboardAction"
import { umpireCompetitionListAction } from "../../store/actions/umpireAction/umpireCompetetionAction"
import { entityTypes } from '../../util/entityTypes'
import { refRoleTypes } from '../../util/refRoles'
import {
    getUmpireCompetiton,
    setUmpireCompition,
    getOrganisationData,
    setUmpireCompitionData,
    getUmpireCompetitonData,
    getLiveScoreUmpireCompition,
    getLiveScoreUmpireCompitionData,
    setLiveScoreUmpireCompition,
    setLiveScoreUmpireCompitionData
} from '../../util/sessionStorage'
import moment, { utc } from "moment";
import { exportFilesAction } from "../../store/actions/appAction"
import AppColor from "../../themes/appColor";
import history from "../../util/history";
import ValidationConstants from "../../themes/validationConstant";

let this_obj = null

const { Content } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

function tableSort(key, key2) {
    let sortBy = key;
    let sortOrder = null;
    if (this_obj.state.sortBy !== key) {
        sortOrder = 'ASC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'ASC') {
        sortOrder = 'DESC';
    } else if (this_obj.state.sortBy === key && this_obj.state.sortOrder === 'DESC') {
        sortBy = sortOrder = null;
    }
    const body =
    {
        "paging": {
            "limit": 10,
            "offset": this_obj.state.offsetData
        }
    }
    this_obj.setState({ sortBy: sortBy, sortOrder: sortOrder });
    this_obj.props.getUmpireDashboardList({ compId: this_obj.state.selectedComp, divisionid: this_obj.state.division == 'All' ? "" : this_obj.state.division, venueId: this_obj.state.venue == 'All' ? "" : this_obj.state.venue, orgId: this_obj.state.orgId, roundId: this_obj.state.round == 'All' ? "" : this_obj.state.round, pageData: body, sortBy: sortBy, sortOrder: sortOrder })
}



//listeners for sorting
const listeners = (key, key2) => ({
    onClick: () => tableSort(key, key2),
});

function validateColor(data) {

    if (data.verifiedBy !== null || data.status == 'YES') {
        return AppColor.umpireTextGreen;
    } else if (data.verifiedBy !== null || data.status == 'NO') {
        return AppColor.umpireTextRed;
    } else {
        return AppColor.standardTxtColor
    }
}

function checkUmpireType(umpireArray, key) {
    let object = null
    for (let i in umpireArray) {
        if (umpireArray[i].sequence === key) {
            object = umpireArray[i]
        }
    }
    return object

}


const columns_Invite = [
    {
        title: 'Match ID',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (id) => {
            return (
                <NavLink to={{
                    pathname: '/liveScoreMatchDetails',
                    state: { matchId: id, umpireKey: 'umpire' }
                }} >
                    <span className="input-heading-add-another pt-0" >{id}</span>
                </NavLink>
            )
        }
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: 'startTime',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (startTime, record) =>
            <span >{moment(startTime).format("DD/MM/YYYY HH:mm")}</span>
    },
    {
        title: 'Home',
        dataIndex: 'team1',
        key: 'team1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (team1, record) =>
            <span >{team1.name}</span>
    },
    {
        title: 'Away',
        dataIndex: 'team2',
        key: 'team2',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (team2, record) =>
            <span >{team2.name}</span>
    },
    {
        title: 'Round',
        dataIndex: 'round',
        key: 'round',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (round, record) =>
            <span >{round.name}</span>
    },
    {
        title: 'Umpire 1',
        dataIndex: 'umpires',
        key: 'umpires_1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("umpire1"),
        render: (umpires, record) => {
            let umpire1 = checkUmpireType(umpires, 1) ? checkUmpireType(umpires, 1) : []
            return (

                // umpires ?
                //     umpires[0] ?
                //         <span style={{ color: validateColor(umpire1), cursor: 'pointer' }} onClick={() => this_obj.checkUserIdUmpire(umpire1)} >{umpire1.umpireName}</span>
                //         :
                //         <span>{''}</span>
                //     :
                //     <span>{''}</span>
                <span style={{ color: validateColor(umpire1), cursor: 'pointer' }} onClick={() => this_obj.checkUserIdUmpire(umpire1)} >{umpire1.umpireName}</span>

            )
        }


    },
    {
        title: 'Umpire 1 Organisation',
        dataIndex: 'umpires',
        key: 'umpires1_Org',
        sorter: false,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (umpires, record) => {
            let umpire1 = checkUmpireType(umpires, 1) ? checkUmpireType(umpires, 1) : []
            return (
                <>
                    {/* {
                        umpires ?
                            umpires[0] ?

                                isArrayNotEmpty(umpire1.organisations) && umpire1.organisations.map((item, index) => (
                                    <span style={{ color: validateColor(umpire1) }} className='multi-column-text-aligned' >{item.name}</span>
                                ))
                                :
                                <span>{''}</span>
                            :
                            <span>{''}</span>} */}
                    {isArrayNotEmpty(umpire1.organisations) && umpire1.organisations.map((item, index) => (
                        <span style={{ color: validateColor(umpire1) }} className='multi-column-text-aligned' >{item.name}</span>
                    ))}

                </>
            )
        }
    },
    {
        title: 'Umpire 2',
        dataIndex: 'umpires',
        key: 'umpires_2',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("umpire2"),
        render: (umpires, record) => {
            let umpire2 = checkUmpireType(umpires, 2) ? checkUmpireType(umpires, 2) : []
            return (
                // umpires ?
                //     umpires[1] ?
                //         <span style={{ color: validateColor(umpire2), cursor: 'pointer' }} onClick={() => this_obj.checkUserIdUmpire(umpire2)} >{umpire2.umpireName}</span>
                //         :
                //         <span>{''}</span>
                //     :
                //     <span>{''}</span>

                <span style={{ color: validateColor(umpire2), cursor: 'pointer' }} onClick={() => this_obj.checkUserIdUmpire(umpire2)} >{umpire2.umpireName}</span>
            )
        }
    },
    {
        title: 'Umpire 2 Organisation',
        dataIndex: 'umpires',
        key: 'umpires2_Org',
        sorter: false,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (umpires, record) => {
            let umpire2 = checkUmpireType(umpires, 2) ? checkUmpireType(umpires, 2) : []
            return (
                <>
                    {/* {
                        umpires ?
                            umpires[1] ?
                                isArrayNotEmpty(umpires[1].organisations) && umpires[1].organisations.map((item, index) => (
                                    <span style={{ color: validateColor(umpires[1]) }} key={index} className='multi-column-text-aligned' >{item.name}</span>
                                ))

                                :
                                <span>{''}</span>
                            :
                            <span>{''}</span>} */}
                    {isArrayNotEmpty(umpire2.organisations) && umpire2.organisations.map((item, index) => (
                        <span style={{ color: validateColor(umpire2) }} key={index} className='multi-column-text-aligned' >{item.name}</span>
                    ))}

                </>
            )
        }
    },
    {
        title: 'Verified By',
        dataIndex: 'umpires',
        key: 'umpires',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("verifiedBy"),
        render: (umpires, record) => <span className='multi-column-text-aligned'>{isArrayNotEmpty(record.umpires) ? record.umpires[0].verifiedBy : ""}</span>
    },
    {
        title: "Action",
        dataIndex: 'action',
        key: 'action',
        render: (umpires, record) => <Menu
            className="action-triple-dot-submenu"
            theme="light"
            mode="horizontal"
            style={{ lineHeight: '25px' }}
        >
            <Menu.SubMenu
                key="sub1"
                style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                title={
                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                }
            >
                <Menu.Item key="3" >
                    <NavLink to={{
                        pathname: "./addUmpire",
                        state: { record: record, screenName: 'umpireDashboard' }
                    }}>
                        <span >Invite</span>
                    </NavLink>
                </Menu.Item>
                {
                    umpires ?
                        umpires[0] ?
                            umpires[0].verifiedBy == null ?
                                <Menu.Item key={'1'}>
                                    <NavLink to={{
                                        pathname: '/liveScoreAddMatch',
                                        state: { matchId: record.id, umpireKey: 'umpire', isEdit: true }
                                    }} >
                                        <span >Edit</span>
                                    </NavLink>
                                </Menu.Item>
                                :
                                null
                            :
                            null
                        :
                        <Menu.Item key={'1'}>
                            <NavLink to={{
                                pathname: '/liveScoreAddMatch',
                                state: { matchId: record.id, umpireKey: 'umpire', isEdit: true }
                            }} >
                                <span >Edit</span>
                            </NavLink>
                        </Menu.Item>
                }
            </Menu.SubMenu>
        </Menu>
    }


];


const columns = [

    {
        title: 'Match ID',
        dataIndex: 'id',
        key: '_id',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (id) => {
            return (
                <NavLink to={{
                    pathname: '/liveScoreMatchDetails',
                    state: { matchId: id, umpireKey: 'umpire' }
                }} >
                    <span className="input-heading-add-another pt-0" >{id}</span>
                </NavLink>
            )
        }
    },
    {
        title: 'Start Time',
        dataIndex: 'startTime',
        key: '_startTime',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (startTime, record) =>
            <span >{moment(startTime).format("DD/MM/YYYY HH:mm")}</span>
    },
    {
        title: 'Home',
        dataIndex: 'team1',
        key: '_team1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (team1, record) =>
            <span >{team1.name}</span>
    },
    {
        title: 'Away',
        dataIndex: 'team2',
        key: '_team2',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (team2, record) =>
            <span >{team2.name}</span>
    },
    {
        title: 'Round',
        dataIndex: 'round',
        key: '_round',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (round, record) =>
            <span >{round.name}</span>
    },
    {
        title: 'Umpire 1',
        dataIndex: 'umpires',
        key: '_umpires_1',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("umpire1"),
        render: (umpires, record) => {
            let umpire1 = checkUmpireType(umpires, 1) ? checkUmpireType(umpires, 1) : []
            return (

                //         umpires ?
                //             umpires[0] ?
                // <span style={{ color: validateColor(umpires[0]) }} onClick={() => this_obj.checkUserIdUmpire(record.umpires[0])} >{umpires[0].umpireName}</span>

                //                 :
                //                 <span>{''}</span>
                //             :
                //             <span>{''}</span>
                <span style={{ color: validateColor(umpire1) }} onClick={() => this_obj.checkUserIdUmpire(umpire1)} >{umpire1.umpireName}</span>

            )
        }


    },
    {
        title: 'Umpire 1 Organisation',
        dataIndex: 'umpires',
        key: '_umpires1_Org',
        sorter: false,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (umpires, record) => {
            let umpire1 = checkUmpireType(umpires, 1) ? checkUmpireType(umpires, 1) : []
            return (
                <>
                    {/* {
                        umpires ?
                            umpires[0] ?

                                isArrayNotEmpty(umpire1.organisations) && umpire1.organisations.map((item, index) => (
                                    <span className='multi-column-text-aligned' >{item.name}</span>
                                ))

                                :
                                <span>{''}</span>
                            :
                            <span>{''}</span>} */}
                    {isArrayNotEmpty(umpire1.organisations) && umpire1.organisations.map((item, index) => (
                        <span style={{ color: validateColor(umpire1) }} className='multi-column-text-aligned' >{item.name}</span>
                    ))}

                </>
            )
        }
    },
    {
        title: 'Umpire 2',
        dataIndex: 'umpires',
        key: '_umpires_2',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("umpire2"),
        render: (umpires, record) => {
            let umpire2 = checkUmpireType(umpires, 2) ? checkUmpireType(umpires, 2) : []
            return (

                // umpires ?
                //     umpires[1] ?

                //         <span style={{ color: validateColor(umpire2) }} onClick={() => this_obj.checkUserIdUmpire(umpire2)} >{umpire2.umpireName}</span>


                //         :
                //         <span>{''}</span>
                //     :
                //     <span>{''}</span>
                <span style={{ color: validateColor(umpire2) }} onClick={() => this_obj.checkUserIdUmpire(umpire2)} >{umpire2.umpireName}</span>

            )
        }
    },
    {
        title: 'Umpire 2 Organisation',
        dataIndex: 'umpires',
        key: '_umpires2_Org',
        sorter: false,
        // onHeaderCell: ({ dataIndex }) => listeners(dataIndex),
        render: (umpires, record) => {
            let umpire2 = checkUmpireType(umpires, 2) ? checkUmpireType(umpires, 2) : []
            return (
                <>
                    {/* {
                        umpires ?
                            umpires[1] ?
                                isArrayNotEmpty(umpire1.organisations) && umpire1.organisations.map((item, index) => (
                                    <span className='multi-column-text-aligned' >{item.name}</span>
                                ))

                                :
                                <span>{''}</span>
                            :
                            <span>{''}</span>} */}
                    {isArrayNotEmpty(umpire2.organisations) && umpire2.organisations.map((item, index) => (
                        <span style={{ color: validateColor(umpire2) }} className='multi-column-text-aligned' >{item.name}</span>
                    ))}

                </>
            )
        }
    },
    {
        title: 'Verified By',
        dataIndex: 'umpires',
        key: 'umpires',
        sorter: true,
        onHeaderCell: ({ dataIndex }) => listeners("verifiedBy"),
        render: (umpires, record) => <span className='multi-column-text-aligned'>{isArrayNotEmpty(record.umpires) ? record.umpires[0].verifiedBy : ""}</span>
    },
    {
        title: "Action",
        dataIndex: 'action',
        key: '_action',
        render: (umpires, record) => <Menu
            className="action-triple-dot-submenu"
            theme="light"
            mode="horizontal"
            style={{ lineHeight: '25px' }}
        >
            <Menu.SubMenu
                key="sub1"
                style={{ borderBottomStyle: "solid", borderBottom: 0 }}
                title={
                    <img className="dot-image" src={AppImages.moreTripleDot} alt="" width="16" height="16" />
                }
            >
                {
                    umpires ?
                        umpires[0] ?
                            umpires[0].verifiedBy == null ?
                                <Menu.Item key={'1'}>
                                    <NavLink to={{
                                        pathname: '/liveScoreAddMatch',
                                        state: { matchId: record.id, umpireKey: 'umpire', isEdit: true }
                                    }} >
                                        <span >Edit</span>
                                    </NavLink>
                                </Menu.Item>
                                :
                                null
                            :
                            null
                        :
                        <Menu.Item key={'1'}>
                            <NavLink to={{
                                pathname: '/liveScoreAddMatch',
                                state: { matchId: record.id, umpireKey: 'umpire', isEdit: true }
                            }} >
                                <span >Edit</span>
                            </NavLink>
                        </Menu.Item>
                }
            </Menu.SubMenu>
        </Menu>
    }


];



class UmpireDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionid: null,
            searchText: "",
            selectedComp: null,
            loading: false,
            competitionUniqueKey: null,
            venue: "All",
            venueLoad: false,
            division: "All",
            divisionLoad: false,
            venueSuccess: false,
            divisionSuccess: false,
            orgId: null,
            compArray: [],
            compititionObj: null,
            liveScoreUmpire: props.location ? props.location.state ? props.location.state.liveScoreUmpire ? props.location.state.liveScoreUmpire : null : null : null,
            round: "All",
            offsetData: 0
        }
        this_obj = this
    }

    componentDidMount() {
        let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'))
        let orgId = getOrganisationData().organisationId;
        this.setState({ loading: true, orgId: orgId })
        this.props.umpireCompetitionListAction(null, null, organisationId)

    }

    componentDidUpdate(nextProps) {
        if (nextProps.umpireCompetitionState !== this.props.umpireCompetitionState) {
            if (this.state.loading == true && this.props.umpireCompetitionState.onLoad == false) {
                let compList = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
                let firstComp = compList.length > 0 && compList[0].id

                let compData = compList.length > 0 && compList[0]

                if (getUmpireCompetiton()) {
                    if (this.state.liveScoreUmpire === 'liveScoreUmpire') {

                        let compId = JSON.parse(getLiveScoreUmpireCompition())
                        firstComp = compId
                        let compObj = JSON.parse(getLiveScoreUmpireCompitionData())
                        compData = compObj

                        setUmpireCompition(firstComp)
                        setUmpireCompitionData(JSON.stringify(compData))

                    } else {

                        let compId = JSON.parse(getUmpireCompetiton())
                        firstComp = compId

                        let compObj = JSON.parse(getUmpireCompetitonData())
                        compData = compObj

                    }
                } else {
                    setUmpireCompition(firstComp)
                    setUmpireCompitionData(JSON.stringify(compData))

                }

                if (firstComp !== false) {
                    if (this.state.liveScoreUmpire === 'liveScoreUmpire') {

                        let compId = JSON.parse(getLiveScoreUmpireCompition())

                        this.props.getUmpireDashboardVenueList(compId)

                        const { uniqueKey } = JSON.parse(getLiveScoreUmpireCompitionData())
                        let compObjData = JSON.parse(getLiveScoreUmpireCompitionData())

                        this.setState({ selectedComp: compId, loading: false, competitionUniqueKey: uniqueKey, compArray: compList, venueLoad: true, compititionObj: compObjData })

                    } else {
                        this.props.getUmpireDashboardVenueList(firstComp)
                        let compKey = compList.length > 0 && compList[0].competitionUniqueKey

                        this.setState({ selectedComp: firstComp, loading: false, competitionUniqueKey: compKey, compArray: compList, venueLoad: true, compititionObj: compData })

                    }
                }
                else {
                    this.setState({ loading: false })
                }



            }
        }

        if (nextProps.umpireDashboardState !== this.props.umpireDashboardState) {
            if (this.props.umpireDashboardState.onVenueLoad === false && this.state.venueLoad === true) {
                this.props.getUmpireDashboardDivisionList(this.state.selectedComp)
                this.setState({ venueLoad: false, divisionLoad: true })
            }
        }

        if (nextProps.umpireDashboardState !== this.props.umpireDashboardState) {
            if (this.props.umpireDashboardState.onDivisionLoad === false && this.state.divisionLoad === true) {
                const body =
                {
                    "paging": {
                        "limit": 10,
                        "offset": 0
                    }
                }
                this.setState({ divisionLoad: false })
                this.props.getUmpireDashboardList({ compId: this.state.selectedComp, divisionid: this.state.division == 'All' ? "" : this.state.division, venueId: this.state.venue == 'All' ? "" : this.state.venue, orgId: this.state.orgId, roundId: this.state.round == 'All' ? "" : this.state.round, pageData: body })
                this.props.umpireRoundListAction(this.state.selectedComp, this.state.division == 'All' ? "" : this.state.division)

            }
        }

    }

    checkUserIdUmpire(record) {

        if (record.userId) {
            history.push("/userPersonal", { userId: record.userId, screenKey: "umpire", screen: "/umpireDashboard" })
        }
        // else if (record.matchUmpiresId) {
        //     history.push("/userPersonal", { userId: record.matchUmpiresId, screenKey: "umpire", screen: "/umpireDashboard" })
        // }
        else {
            // message.config({ duration: 1.5, maxCount: 1 })
            // message.warn(ValidationConstants.umpireMessage)
        }
    }

    /// Handle Page change
    handlePageChnage(page) {
        let offset = page ? 10 * (page - 1) : 0;
        this.setState({
            offsetData: offset
        })
        const body =
        {
            "paging": {
                "limit": 10,
                "offset": offset
            }
        }

        this.props.getUmpireDashboardList({ compId: this.state.selectedComp, divisionid: this.state.division == 'All' ? "" : this.state.division, venueId: this.state.venue == 'All' ? "" : this.state.venue, orgId: this.state.orgId, roundId: this.state.round == 'All' ? "" : this.state.round, pageData: body })

    }

    ////////form content view
    contentView = () => {
        const { umpireDashboardList, totalPages } = this.props.umpireDashboardState
        let umpireListResult = isArrayNotEmpty(umpireDashboardList) ? umpireDashboardList : []

        let umpireType = this.state.compititionObj ? this.state.compititionObj.recordUmpireType : ""
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        loading={this.props.umpireDashboardState.onLoad}
                        className="home-dashboard-table"
                        columns={umpireType == "USERS" ? columns_Invite : columns}
                        // columns={ columns_Invite}
                        dataSource={umpireListResult}
                        pagination={false}
                        rowKey={(record, index) => "umpireListResult" + record.id + index}
                    />
                </div>
                <div className="comp-dashboard-botton-view-mobile">
                    <div
                        className="comp-dashboard-botton-view-mobile"
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }} >
                    </div>
                    <div className="d-flex justify-content-end">
                        <Pagination
                            className="antd-pagination"
                            total={totalPages}
                            defaultPageSize={10}
                            onChange={(page) => this.handlePageChnage(page)}
                        />
                    </div>
                </div>
            </div>
        )
    }

    onChangeComp(compID) {
        let selectedComp = compID.comp
        let compKey = compID.competitionUniqueKey
        this.props.getUmpireDashboardVenueList(selectedComp)
        this.props.getUmpireDashboardDivisionList(selectedComp)


        let compObj = null
        for (let i in this.state.compArray) {
            if (compID.comp == this.state.compArray[i].id) {
                compObj = this.state.compArray[i]
                break;
            }
        }
        setUmpireCompition(selectedComp)
        setUmpireCompitionData(JSON.stringify(compObj))

        setLiveScoreUmpireCompition(selectedComp)
        setLiveScoreUmpireCompitionData(JSON.stringify(compObj))
        this.setState({ selectedComp, competitionUniqueKey: compKey, venueLoad: true, divisionLoad: true, venue: "All", division: "All", compititionObj: compObj, round: 'All' })

    }

    onVenueChange(venueId) {
        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }

        this.props.getUmpireDashboardList({ compId: this.state.selectedComp, divisionid: this.state.division == 'All' ? "" : this.state.division, venueId: venueId == 'All' ? "" : venueId, orgId: this.state.orgId, roundId: this.state.round == 'All' ? "" : this.state.round, pageData: body })
        this.setState({ venue: venueId })

    }

    onDivisionChange(divisionid) {
        this.setState({ division: divisionid, round: 'All' })
        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }

        setTimeout(() => {
            this.props.getUmpireDashboardList({ compId: this.state.selectedComp, divisionid: divisionid == 'All' ? "" : divisionid, venueId: this.state.venue == 'All' ? "" : this.state.venue, orgId: this.state.orgId, roundId: this.state.round == 'All' ? "" : this.state.round, pageData: body })
        }, 100);
        this.props.umpireRoundListAction(this.state.selectedComp, divisionid == 'All' ? "" : divisionid)
        this.setState({ division: divisionid, round: 'All' })
    }

    onRoundChange(roundId) {

        if (roundId == 'All') {

        } else {
            this.props.umpireDashboardUpdate(roundId)
        }

        const body =
        {
            "paging": {
                "limit": 10,
                "offset": 0
            }
        }
        const { allRoundIds } = this.props.umpireDashboardState
        this.props.getUmpireDashboardList({ compId: this.state.selectedComp, divisionid: this.state.division == 'All' ? "" : this.state.division, venueId: this.state.venue == 'All' ? "" : this.state.venue, orgId: this.state.orgId, roundId: roundId == 'All' ? "" : allRoundIds, pageData: body })

        this.setState({ round: roundId })
    }

    // on Export
    onExport() {
        let url = AppConstants.umpireDashboardExport + `competitionId=${this.state.selectedComp}&organisationId=${this.state.orgId}`
        this.props.exportFilesAction(url)
    }
    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="fluid-width">
                    <div className="row">
                        <div className="col-sm pt-1" style={{ display: "flex", alignContent: "center" }}>
                            <span className="form-heading">
                                {AppConstants.dashboard}
                            </span>
                        </div>

                        <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                            <div className="row">

                                {/* <div className="col-sm pt-1">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <NavLink to={`/addUmpire`} className="text-decoration-none">
                                        <Button className="primary-add-comp-form" type="primary">
                                            + {AppConstants.addUmpire}
                                        </Button>
                                        </NavLink>
                                    </div>
                                </div> */}
                                <div className="col-sm pt-1">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <Button onClick={() => this.onExport()} className="primary-add-comp-form" type="primary">
                                            <div className="row">
                                                <div className="col-sm">
                                                    <img
                                                        src={AppImages.export}
                                                        alt=""
                                                        className="export-image"
                                                    />
                                                    {AppConstants.export}
                                                </div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-sm pt-1">
                                    <div
                                        className="comp-dashboard-botton-view-mobile"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}
                                    >
                                        <NavLink to={{
                                            pathname: `/umpireImport`,
                                            state: { screenName: 'umpireDashboard' }
                                        }} className="text-decoration-none">
                                            <Button className="primary-add-comp-form" type="primary">
                                                <div className="row">
                                                    <div className="col-sm">
                                                        <img
                                                            src={AppImages.import}
                                                            alt=""
                                                            className="export-image"
                                                        />
                                                        {AppConstants.import}
                                                    </div>
                                                </div>
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    };

    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        let competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList) ? this.props.umpireCompetitionState.umpireComptitionList : []
        const { umpireVenueList, umpireDivisionList, umpireRoundList } = this.props.umpireDashboardState
        let venueList = isArrayNotEmpty(umpireVenueList) ? umpireVenueList : []
        let divisionList = isArrayNotEmpty(umpireDivisionList) ? umpireDivisionList : []
        let roundList = isArrayNotEmpty(umpireRoundList) ? umpireRoundList : []

        let umpireType = this.state.compititionObj ? this.state.compititionObj.recordUmpireType : null

        let round

        return (
            <div className="comp-player-grades-header-drop-down-view mt-1">
                <div className="fluid-width" >
                    <div className="row reg-filter-row" >

                        {/* Comp List */}

                        <div className="reg-col" >
                            <div className="reg-filter-col-cont">
                                <div className='year-select-heading'>{AppConstants.competition}</div>
                                <Select
                                    // showSearch
                                    // optionFilterProp="children"
                                    className="year-select reg-filter-select1"
                                    style={{ minWidth: 200 }}
                                    onChange={(comp) => this.onChangeComp({ comp })}
                                    value={this.state.selectedComp}
                                >
                                    {
                                        competition.map((item, index) => {
                                            return <Option key={`longName` + index} value={item.id}>{item.longName}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>

                        {/* Venue List */}
                        <div className="reg-col1 ml-5" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.venue}</div>
                                <Select
                                    className="year-select reg-filter-select1"
                                    onChange={(venueId) => this.onVenueChange(venueId)}
                                    value={this.state.venue}
                                >
                                    <Option value={'All'}>{'All'}</Option>
                                    {
                                        venueList.map((item, index) => {
                                            return <Option key={`venueName` + index} value={item.venueId}>{item.venueName}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>


                        {/* Division List */}

                        <div className="reg-col1 ml-5" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.division}</div>
                                <Select
                                    className="year-select reg-filter-select1"
                                    onChange={(divisionId) => this.onDivisionChange(divisionId)}
                                    value={this.state.division}
                                >
                                    <Option value={'All'}>{'All'}</Option>
                                    {
                                        divisionList.map((item, index) => {
                                            return <Option key={`division` + index} value={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>

                        {/* Round List */}

                        <div className="reg-col1 ml-5" >
                            <div className="reg-filter-col-cont" >
                                <div className='year-select-heading'>{AppConstants.round}</div>
                                <Select
                                    className="year-select reg-filter-select1"
                                    onChange={(roundId) => this.onRoundChange(roundId)}
                                    value={this.state.round}
                                >
                                    <Option value={'All'}>{'All'}</Option>
                                    {
                                        roundList.map((item, index) => {
                                            return <Option key={`division` + index} value={item.id}>{item.name}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        </div>




                    </div>
                    {
                        umpireType && umpireType !== 'USERS' ?
                            <div>
                                <NavLink to={{
                                    pathname: '/liveScoreSettingsView',
                                    state: { selectedComp: this.state.selectedComp, screenName: 'umpireDashboard', edit: 'edit' }
                                }}>
                                    <span class="input-heading-add-another pt-0">
                                        {AppConstants.competitionEnabled}
                                    </span>
                                </NavLink>
                            </div>
                            :
                            <></>
                    }


                </div>
            </div>
        )
    }

    countView = () => {
        // let userRegistrationState = this.props.userRegistrationState;
        // let userRegDashboardList = userRegistrationState.userRegDashboardListData;
        // let total = userRegistrationState.userRegDashboardListTotalCount;
        return (
            <div className="comp-dash-table-view mt-2">
                <div>
                    <div className="row">
                        <div className="col-sm" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of umpires</div>
                                <div className="reg-payment-price-text">{0}</div>
                            </div>
                        </div>
                        <div className="col-sm" >
                            <div className="registration-count">
                                <div className="reg-payment-paid-reg-text">No. of registered umpires</div>
                                <div className="reg-payment-price-text">{0}</div>
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
                <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
                <InnerHorizontalMenu menu={"umpire"} umpireSelectedKey={"1"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        {this.dropdownView()}
                        {/* {this.countView()} */}
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
        getUmpireDashboardVenueList,
        getUmpireDashboardDivisionList,
        getUmpireDashboardList,
        exportFilesAction,
        umpireRoundListAction,
        umpireDashboardUpdate
    }, dispatch)
}

function mapStatetoProps(state) {
    return {
        umpireDashboardState: state.UmpireDashboardState,
        umpireCompetitionState: state.UmpireCompetitionState
    }
}

export default connect(mapStatetoProps, mapDispatchToProps)((UmpireDashboard));

