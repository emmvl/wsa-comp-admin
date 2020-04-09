import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Select,
    Checkbox,
    Button,
    Radio,
    Tabs,
    Table,
    Input,
    Form
} from "antd";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ValidationConstants from "../../themes/validationConstant";
import history from "../../util/history";
const { Header, Footer } = Layout;
const { Option } = Select;

const columns = [
    {
        title: 'Result type/Byes',
        dataIndex: 'resultType',
        key: 'resultType',
    },
    {
        title: 'Points',
        dataIndex: 'points',
        key: 'points',
        render: points => <Input className="input-inside-table-fees" value={points} />,
        width: "10%"
    },
];

const data = [
    {
        key: '1',
        resultType: "Won",
        points: "3",
    },
    {
        key: '2',
        resultType: "Lost",
        points: "1",
    },

    {
        key: '3',
        resultType: "Abandoned (no match)",
        points: "0",
    },
    {
        key: '4',
        resultType: "Abandoned (incomplete)",
        points: "3",
    },
    {
        key: '5',
        resultType: "Won on Forefeit",
        points: "3",

    },
    {
        key: '6',
        resultType: "Loss on Forefeit",
        points: "0",

    },
    {
        key: '7',
        resultType: "Double Forefeit",
        points: "0",

    },
    {
        key: '8',
        resultType: "Bye",
        points: "3",
    },

];
class LiveScoreLadderSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            venueData: []
        };
    }

    contentView = () => {
        return (
            <div className="content-view pt-4">
                {/* ladder setting view */}

                <div className="inside-container-view" >
                    <div className="table-responsive">
                        <Table className="fees-table" columns={columns} dataSource={data} pagination={false} Divider=" false" />
                    </div>
                </div>
            </div>
        )

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
                            {AppConstants.ladderSettings}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
            </div>
        );
    };
    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width">
                <div className="footer-view">
                    <div className="row">
                        <div className="col-sm">
                            {/* <div className="reg-add-save-button">
                                <Button type="cancel-button">{AppConstants.delete}</Button>
                            </div> */}
                        </div>
                        <div className="col-sm">
                            <div className="comp-buttons-view">
                                {/* <Button className="save-draft-text" type="save-draft-text">
                                    {AppConstants.saveAsDraft}
                                </Button> */}
                                <Button onClick={this.handleSubmit} className="publish-button" type="primary">
                                    {this.state.competitionTabKey == 6 ? AppConstants.publish : AppConstants.save}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    };


    render() {
        return (


            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} onMenuHeadingClick ={()=>history.push("./liveScoreCompetitions")}/>
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"19"} />
                <Layout>
                    {this.headerView()}
                    {/* <Content> */}
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <div className="formView">{this.contentView()}</div>
                    </Form>

                    <Footer>{this.footerView()}</Footer>
                </Layout>
            </div>

        )
    }
}

export default LiveScoreLadderSettings