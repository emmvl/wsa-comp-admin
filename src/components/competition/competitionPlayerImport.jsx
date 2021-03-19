import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table } from "antd";
//import './liveScore.css';
import { NavLink } from "react-router-dom";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    competitionPlayerImportAction, competitionImportDataCleanUpAction
} from "../../store/actions/competitionModuleAction/competitionPartPlayerGradingAction";
import Loader from '../../customComponents/loader'
import { message } from "antd";
import ValidationConstants from "../../themes/validationConstant";
import { getOrganisationData } from "../../util/sessionStorage";
import history from "../../util/history";
import AppUniqueId from "../../themes/appUniqueId";

const {
    Content,
    Header,
    // Footer
} = Layout;

const columns = [
    {
        title: AppConstants.firstName,
        dataIndex: 'firstName',
        key: 'firstName'
    },
    {
        title: AppConstants.lastName,
        dataIndex: 'lastName',
        key: 'lastName'
    },
    {
        title: AppConstants.email,
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: AppConstants.phoneNumber,
        dataIndex: 'mobileNumber',
        key: 'mobileNumber'
    }
];

class CompetitionPlayerImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            csvdata: null,
            divisionId: 0,
            competitionId: "",
            buttonPressed: "",
            loading: false,
            isProceed: 0,
            screenNavigationKey: ""
        }
    }

    componentDidMount() {
        this.props.competitionImportDataCleanUpAction("player");
        let divisionId = this.props.location.state.divisionId;
        let competitionId = this.props.location.state.competitionId;
        let screenNavigationKey = this.props.location.state.screenNavigationKey;
        this.setState({ divisionId, competitionId, screenNavigationKey: screenNavigationKey })
    }

    componentDidUpdate(nextProps) {
        let assignedPlayerData = this.props.partPlayerGradingState.playerImportData;
        if (nextProps.partPlayerGradingState != this.props.partPlayerGradingState) {
            if (this.props.partPlayerGradingState.onLoad == false && this.state.loading === true) {
                this.setState({ loading: false });

                if (!this.props.partPlayerGradingState.error && this.props.partPlayerGradingState.status == 1) {
                    if (this.state.buttonPressed == "upload") {
                        if (assignedPlayerData.length === 0) {
                            if (this.state.screenNavigationKey == "ProposedPlayerGrading") {
                                history.push('/competitionPartPlayerGrades');
                            } else if (this.state.screenNavigationKey == "PlayerGrading") {
                                history.push('/competitionPlayerGrades');
                            }
                        } else {
                            this.setState({ isProceed: 1 });
                        }
                    }
                }
            }
        }
    }

    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view bg-transparent d-flex align-items-center">
                    <div className="row">
                        <div className="col-sm d-flex align-content-center">
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importPlayer}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header>
            </div>
        )
    }

    handleForce = data => {
        this.setState({ csvdata: data.target.files[0], isProceed: 0 })
    };

    onUploadBtn() {
        let payload = {
            competitionMembershipProductDivisionId: this.state.divisionId,
            competitionUniqueKey: this.state.competitionId,
            organisationUniqueKey: getOrganisationData() ? getOrganisationData().organisationUniqueKey : null,
            csvFile: this.state.csvdata,
            isProceed: this.state.isProceed
        }

        if (this.state.csvdata) {
            this.props.competitionPlayerImportAction(payload)
            this.setState({ buttonPressed: "upload", loading: true });
            let e = document.getElementById("playerImport");
            e.value = null;
        } else {
            message.config({ duration: 0.9, maxCount: 1 })
            message.error(ValidationConstants.csvField)
        }
    }

    contentView = () => {
        return (
            <div className="content-view pt-4">
                <span className="user-contact-heading">{AppConstants.fileInput}</span>
                <div className="col-sm">
                    <div className="row">
                        <input
                            className="pt-2 pb-2 pointer"
                            type="file"
                            ref={(input) => { this.filesInput = input }}
                            name="file"
                            id="playerImport"
                            // icon="file text outline"
                            // iconPosition="left"
                            // label="Upload CSV"
                            // labelPosition="right"
                            placeholder="UploadCSV..."
                            onChange={this.handleForce}
                            accept=".csv"
                        />
                    </div>
                </div>

                <div className="col-sm mt-10">
                    <div className="row">
                        <div className="reg-add-save-button">
                            <Button id={AppUniqueId.importPlayerBtn} onClick={() => this.onUploadBtn()} className="primary-add-comp-form" type="primary">
                                {AppConstants.upload}
                            </Button>
                        </div>
                        <div className="reg-add-save-button" style={{ marginLeft: 20 }}>
                            <NavLink to="/templates/wsa-import-player.csv" target="_blank" download>
                                <Button id={AppUniqueId.downLoadTempletebtn} className="primary-add-comp-form" type="primary">
                                    {AppConstants.downloadTemplate}
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    invalidPlayerView = () => {
        let invalidPlayers = this.props.partPlayerGradingState.playerImportData;
        return (
            <div className="comp-dash-table-view mt-2">
                <span className="user-contact-heading">{AppConstants.invalidPlayers}</span>
                <div className="table-responsive home-dash-table-view">
                    <Table
                        className="home-dashboard-table"
                        columns={columns}
                        dataSource={invalidPlayers}
                        pagination={false}
                    />
                </div>
                <div className="d-flex justify-content-end" style={{ marginTop: 20 }}>
                    <div className="reg-add-save-button">
                        <Button onClick={() => this.onUploadBtn()} className="primary-add-comp-form" type="primary">
                            {AppConstants.proceed}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="fluid-width default-bg">
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu="competition" compSelectedKey={this.state.screenNavigationKey == "PlayerGrading" ? "4" : "14"} />
                <Loader visible={this.props.partPlayerGradingState.onLoad} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>
                        {this.state.isProceed && (
                            <div className="formView">
                                {this.invalidPlayerView()}
                            </div>
                        )}
                    </Content>
                </Layout>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        competitionPlayerImportAction,
        competitionImportDataCleanUpAction
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        partPlayerGradingState: state.CompetitionPartPlayerGradingState,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionPlayerImport);
