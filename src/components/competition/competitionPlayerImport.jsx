import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Table, Select, Menu, Pagination, Modal } from "antd";
//import './liveScore.css';
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import AppImages from "../../themes/appImages";
import CSVReader from 'react-csv-reader'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {competitionPlayerImportAction
} from "../../store/actions/competitionModuleAction/competitionPartPlayerGradingAction";
import Loader from '../../customComponents/loader'
import { message } from "antd";
import ValidationConstants from "../../themes/validationConstant";
import { getOrganisationData } from "../../util/sessionStorage";
import history from "../../util/history";

const { Content, Header, Footer } = Layout;

const columns = [

    {
        title: 'FirstName',
        dataIndex: 'firstName',
        key: 'firstName'
    },
    {
        title: 'LastName',
        dataIndex: 'lastName',
        key: 'lastName'
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: 'Phone No',
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
            isProceed: 0
        }
    }

    componentDidMount(){
     let divisionId =   this.props.location.state.divisionId;
     let competitionId = this.props.location.state.competitionId;
     console.log("divisionId::" + divisionId);
     console.log("competitionId" + competitionId);
     this.setState({divisionId: divisionId, competitionId: competitionId})
    }

    componentDidUpdate(nextProps)
    {
        let assignedPlayerData = this.props.partPlayerGradingState.playerImportData;
        if(nextProps.partPlayerGradingState!= this.props.partPlayerGradingState)
        {
            if(this.props.partPlayerGradingState.onLoad == false && this.state.loading === true)
            {
                this.setState({ loading: false });
                if(!this.props.partPlayerGradingState.error)
                {
                    if(this.state.buttonPressed == "upload")
                    {
                        if(assignedPlayerData.length == 0)
                        {
                            history.push('/competitionPlayerGrades');
                        }
                        else{
                            this.setState({isProceed: 1});
                        }
                    }
                }
            }
        }
    }

    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view" style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                }} >
                    <div className="row" >
                        <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                            <Breadcrumb separator=" > ">
                                <Breadcrumb.Item className="breadcrumb-add">{AppConstants.importPlayer}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Header >
            </div>
        )
    }

    handleForce = data => {
        this.setState({ csvdata: data.target.files[0] , isProceed: 0})

    };

    onUploadBtn() {
       
        let payload = {
            competitionMembershipProductDivisionId : this.state.divisionId,
            competitionUniqueKey: this.state.competitionId,
            organisationUniqueKey: getOrganisationData().organisationUniqueKey,
            csvFile: this.state.csvdata,
            isProceed: this.state.isProceed
        }

        console.log("******" + JSON.stringify(payload));
        if (this.state.csvdata) {
            this.props.competitionPlayerImportAction(payload)
            this.setState({buttonPressed:"upload", loading: true});
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
                            type="file"
                            ref={(input) => { this.filesInput = input }}
                            name="file"
                            icon='file text outline'
                            iconPosition='left'
                            label='Upload CSV'
                            labelPosition='right'
                            placeholder='UploadCSV...'
                            onChange={this.handleForce}
                            accept=".csv"
                        />
                    </div>
                </div>

                <div className="col-sm"
                    style={{ marginTop: 10 }}>
                    <div className="row">
                        <div className="reg-add-save-button">
                            <Button onClick={() => this.onUploadBtn()} className="primary-add-comp-form" type="primary">
                                {AppConstants.upload}
                            </Button>
                        </div>
                        {/* <div className="reg-add-save-button">
                            <Link to="/templates/wsa_import_player.csv" target="_blank" download>Download</Link>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }

    invalidPlayerView = () => {
        let invalidPlayers = this.props.partPlayerGradingState.playerImportData;
        console.log("invalidPlayers" + JSON.stringify(invalidPlayers) );
        return (
            <div className="comp-dash-table-view mt-2">
                 <span className="user-contact-heading">{AppConstants.invalidPlayers}</span>
                <div className="table-responsive home-dash-table-view">
                    <Table className="home-dashboard-table" 
                    columns={columns}
                    dataSource={invalidPlayers} 
                    pagination={false}
                    />
                </div>
                <div className="d-flex justify-content-end" style={{marginTop: '20px'}}>
                    <div className="reg-add-save-button">
                        <Button onClick={() => this.onUploadBtn()} className="primary-add-comp-form" type="primary">
                            {AppConstants.proceed}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    /////// render function 
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.competitions} menuName={AppConstants.competitions} />
                <InnerHorizontalMenu menu={"competition"} compSelectedKey={"4"} />
                <Loader visible={this.props.partPlayerGradingState.onLoad} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>
                        {this.state.isProceed ? 
                        <div className="formView">
                             {this.invalidPlayerView()}
                        </div>
                        : null }
                    </Content>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ competitionPlayerImportAction }, dispatch)
}

function mapStateToProps(state) {
    return {
        partPlayerGradingState: state.CompetitionPartPlayerGradingState,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)((CompetitionPlayerImport));