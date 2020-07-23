import React, { Component } from "react";
import { Input, Layout, Breadcrumb, Button, Table, Pagination, Icon, Select } from 'antd';
import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
const { Content } = Layout;
const { Option } = Select;

/////function to sort table column
function tableSort(a, b, key) {
    let stringA = JSON.stringify(a[key])
    let stringB = JSON.stringify(b[key])
    return stringA.localeCompare(stringB)
}

var _this = null

const columns_1 = [
    {
        title: 'Match Id',
        dataIndex: 'id',
        key: 'id',
        sorter: (a, b) => tableSort(a, b, "id"),
    },
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => tableSort(a, b, "team"),
    },
    {
        title: 'First Name',
        dataIndex: 'fName',
        key: 'fName',
        sorter: (a, b) => tableSort(a, b, "fName"),
    },
    {
        title: 'Last Name',
        dataIndex: 'lName',
        key: 'lName',
        sorter: (a, b) => tableSort(a, b, "lName"),

    },
    {
        title: 'GS',
        dataIndex: 'gs',
        key: 'gs',
        sorter: (a, b) => tableSort(a, b, "gs"),
    },
    {
        title: 'GA',
        dataIndex: 'ga',
        key: 'ga',
        sorter: (a, b) => tableSort(a, b, "ga"),
    },
    {
        title: 'WA',
        dataIndex: 'wa',
        key: 'wa',
        sorter: (a, b) => tableSort(a, b, "wa"),
    },
    {
        title: 'C',
        dataIndex: 'c',
        key: 'c',
        sorter: (a, b) => tableSort(a, b, "c"),
    },
    {
        title: 'WD',
        dataIndex: 'wd',
        key: 'wd',
        sorter: (a, b) => tableSort(a, b, "wd"),
    },
    {
        title: 'GD',
        dataIndex: 'gd',
        key: 'gd',
        sorter: (a, b) => tableSort(a, b, "gd"),
    },
    {
        title: 'GK',
        dataIndex: 'gk',
        key: 'gk',
        sorter: (a, b) => tableSort(a, b, "gk"),
    },
    {
        title: 'Played',
        dataIndex: 'played',
        key: 'played',
        sorter: (a, b) => tableSort(a, b, "played"),
    },
    {
        title: 'Bench',
        dataIndex: 'bench',
        key: 'bench',
        sorter: (a, b) => tableSort(a, b, "bench"),
    },
    {
        title: 'No Play',
        dataIndex: 'noPlay',
        key: 'noPlay',
        sorter: (a, b) => tableSort(a, b, "noPlay"),
    },
];

const columns_2 = [
    {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        sorter: (a, b) => tableSort(a, b, "team"),
    },
    {
        title: 'First Name',
        dataIndex: 'fName',
        key: 'fName',
        sorter: (a, b) => tableSort(a, b, "fName"),
    },
    {
        title: 'Last Name',
        dataIndex: 'lName',
        key: 'lName',
        sorter: (a, b) => tableSort(a, b, "lName"),

    },
    {
        title: 'GS',
        dataIndex: 'gs',
        key: 'gs',
        sorter: (a, b) => tableSort(a, b, "gs"),
    },
    {
        title: 'GA',
        dataIndex: 'ga',
        key: 'ga',
        sorter: (a, b) => tableSort(a, b, "ga"),
    },
    {
        title: 'WA',
        dataIndex: 'wa',
        key: 'wa',
        sorter: (a, b) => tableSort(a, b, "wa"),
    },
    {
        title: 'C',
        dataIndex: 'c',
        key: 'c',
        sorter: (a, b) => tableSort(a, b, "c"),
    },
    {
        title: 'WD',
        dataIndex: 'wd',
        key: 'wd',
        sorter: (a, b) => tableSort(a, b, "wd"),
    },
    {
        title: 'GD',
        dataIndex: 'gd',
        key: 'gd',
        sorter: (a, b) => tableSort(a, b, "gd"),
    },
    {
        title: 'GK',
        dataIndex: 'gk',
        key: 'gk',
        sorter: (a, b) => tableSort(a, b, "gk"),
    },
    {
        title: 'Played',
        dataIndex: 'played',
        key: 'played',
        sorter: (a, b) => tableSort(a, b, "played"),
    },
    {
        title: 'Bench',
        dataIndex: 'bench',
        key: 'bench',
        sorter: (a, b) => tableSort(a, b, "bench"),
    },
    {
        title: 'No Play',
        dataIndex: 'noPlay',
        key: 'noPlay',
        sorter: (a, b) => tableSort(a, b, "noPlay"),
    },
];


var DATA = [
    {
        "team": 'Peninsula 22',
        "fName": 'Marissa',
        "lName": 'Cooper',
        "gs": '2',
        "ga": '2',
        "wa": '2',
        "c": '2',
        "wd": '2',
        "gd": '2',
        "gk": '4',
        "played": '4',
        "bench": '4',
        "noPlay": '4',

    },
    {
        "team": 'Peninsula 23',
        "fName": 'Zoe ',
        "lName": 'Scamps',
        "gs": '2',
        "ga": '2',
        "wa": '2',
        "c": '2',
        "wd": '2',
        "gd": '2',
        "gk": '4',
        "played": '4',
        "bench": '4',
        "noPlay": '4',

    },
    {
        "team": 'Peninsula 24',
        "fName": 'Darren',
        "lName": 'Geros',
        "gs": '2',
        "ga": '2',
        "wa": '2',
        "c": '2',
        "wd": '2',
        "gd": '2',
        "gk": '4',
        "played": '4',
        "bench": '4',
        "noPlay": '4',

    },
    {
        "team": 'Peninsula 245',
        "fName": 'Sam',
        "lName": 'OBrien',
        "gs": '2',
        "ga": '2',
        "wa": '2',
        "c": '2',
        "wd": '2',
        "gd": '2',
        "gk": '4',
        "played": '4',
        "bench": '4',
        "noPlay": '4',

    }
]

class LiveScorePositionTrackReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            competitionId: null,
            searchText: "",
            period: 'All',
            game: 'All'
        }
        _this = this
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view mt-4">
                <div className="row">
                    <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.positionTrackReport}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div className="col-sm-8" style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                        <div className="row">

                            <div className="col-sm">
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
                                    <Button className="primary-add-comp-form" type="primary">

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

                        </div>
                    </div>
                </div>
            </div>
        )
    }


    //////// tableView
    tableView = () => {
        return (
            <div className="comp-dash-table-view mt-4">
                <div className="table-responsive home-dash-table-view">
                    <Table
                        // loading={this.props.liveScoreMatchListState.onLoad == true && true}
                        className="home-dashboard-table"
                        columns={this.state.game == 'total' ? columns_1 : columns_2}
                        dataSource={DATA}
                        pagination={false}
                    // rowKey={(record, index) => record.id + index} 
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Pagination
                        className="antd-pagination pb-5"
                        // current={liveScoreMatchListState.liveScoreMatchListPage}
                        // total={total}
                        // onChange={(page) => this.onPageChange(page)}
                        defaultPageSize={10}
                    />
                </div>

            </div>
        )
    }


    ///dropdown view containing all the dropdown of header
    dropdownView = () => {
        return (
            <div className="comp-player-grades-header-drop-down-view">
                <div className="row">
                    <div className="col-sm"  >
                        <div className="reg-filter-col-cont pb-3"  >
                            <span className='year-select-heading'>{AppConstants.periodFilter}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 160 }}
                                onChange={(periodId) => this.setState({ period: periodId })}
                                value={this.state.period}
                            >
                                <Option value={'All'}>{'All'}</Option>
                                <Option value={'percent'}>{'%'}</Option>
                                <Option value={'minutes'}>{'Minutes'}</Option>

                            </Select>
                        </div>
                    </div>
                    <div className="col-sm" >
                        <div className="reg-filter-col-cont pb-3"  >
                            <span className='year-select-heading'>{AppConstants.byGame}:</span>
                            <Select
                                className="year-select reg-filter-select1 ml-2"
                                style={{ minWidth: 160 }}
                                onChange={(gameId) => this.setState({ game: gameId })}
                                value={this.state.game}
                            >
                                <Option value={'All'}>{'All'}</Option>
                                <Option value={'total'}>{'Total'}</Option>

                            </Select>
                        </div>
                    </div>

                    <div className="col-sm" style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }} >
                        <div className="comp-product-search-inp-width pb-3" >
                            <Input className="product-reg-search-input"
                                // onChange={(e) => this.onChangeSearchText(e)}
                                placeholder="Search..."
                                // onKeyPress={(e) => this.onKeyEnterSearchText(e)}
                                prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)", height: 16, width: 16 }}
                                // onClick={() => this.onClickSearchIcon()}
                                />}
                                allowClear
                            />
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />

                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"24"} />
                <Layout>
                    {this.headerView()}
                    {this.dropdownView()}
                    <Content>
                        {this.tableView()}
                    </Content>
                </Layout>
            </div >
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch)
}

function mapStateToProps(state) {
    return {
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((LiveScorePositionTrackReport));

