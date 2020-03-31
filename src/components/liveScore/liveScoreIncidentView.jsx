import React, { Component } from "react";
import {
    Layout,
    Breadcrumb,
    Modal,
    Table,
} from "antd";
import "./liveScore.css";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import ReactPlayer from 'react-player';
import { liveScore_formateDateTime } from '../../themes/dateformate'

const { Header, Content } = Layout;

class LiveScoreIncidentView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            modaldata: '',
            isVideo: false,
            incidentItem: props.location.state.item
        };

    }

    ////method to show modal view after click
    showModal = (data, isVideo) => {
        this.setState({
            visible: true,
            modaldata: data,
            isVideo: isVideo
        });
    };

    ////method to hide modal view after ok click
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    ////method to hide modal view after click on cancle button
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    ///////view for breadcrumb
    headerView = () => {
        return (
            <Header className="comp-venue-courts-header-view">
                <div className="row">
                    <div
                        className="col-sm"
                        style={{ display: "flex", alignContent: "center" }}
                    >
                        <Breadcrumb separator=" > ">
                            <Breadcrumb.Item className="breadcrumb-add">
                                {AppConstants.incidentDetails}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </div>
            </Header>
        );
    };


    //// this method called insside modal view function to show content of the modal 
    innerViewOfModal() {
        return (
            <div className="comp-dashboard-botton-view-mobile" style={{ display: 'flex', justifyContent: 'center', }} onClick={this.showModal}>
                {
                    this.state.isVideo == true ?
                        <ReactPlayer playing={this.state.visible == true ? true : false} url={this.state.modaldata} controls={true} />
                        :
                        <img src={this.state.modaldata} height='250' width='250' />
                }

            </div>
        )
    }

    ////modal view
    ModalView() {
        return (
            <Modal
                title="WSA 1"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelButtonProps={{ style: { display: 'none' } }}
                okButtonProps={{ style: { display: 'none' } }}
                centered={true}
            >
                {this.innerViewOfModal()}
            </Modal>
        )
    }

    // Detail List
    detailsView = () => {
        let DATA = this.state.incidentItem
        return (
            <div className="row p-4" >
                <div className="col-sm" >
                    <div><span className="year-select-heading">Incident Time</span></div>
                    <div className="pt-2"><span className="side-bar-profile-data">{liveScore_formateDateTime(DATA.createdAt)}</span>
                    </div>
                </div>

                <div className="col-sm" >
                    <div><span className="year-select-heading">Time</span></div>
                    <div className="pt-2"><span className="side-bar-profile-data">{liveScore_formateDateTime(DATA.createdAt)}</span>
                    </div>
                </div>
                <div className="col-sm" >
                    <div><span className="year-select-heading">Match Id</span></div>
                    <div className="pt-2"><span className="side-bar-profile-data">{DATA.matchId}</span>
                    </div>
                </div>
                <div className="col-sm" >
                    <div><span className="year-select-heading">Incident Type</span></div>
                    <div className="pt-2"><span className="side-bar-profile-data">{DATA.incidentType.name}</span>
                    </div>
                </div>
            </div>

        )
    }
    mediaView = () => {
        let array = this.state.incidentItem.incidentPlayers
        let mediaPlayer = this.state.incidentItem.incidentMediaList

        return (
            <div className="col-sm pt-3 pb-3 mt-5">
                <div className="row " >
                    <div className="col-sm-2">
                        <div className="year-select-heading">
                            <span>{AppConstants.playerHeading}</span>
                        </div>
                    </div>

                    <div className="col-sm-10" >
                        {array.map((item) => {
                            return <div className="side-bar-profile-data">
                                <span>{item.player.firstName} {item.player.lastName}</span>
                            </div>
                        }
                        )}
                    </div>
                </div>
                <div className="row mt-2 " >
                    <div className="col-sm-2">
                        <div className="year-select-heading">
                            <span>{AppConstants.description}</span>
                        </div>
                    </div>

                    <div className="col-sm-10" >
                        {array.map((item) => {
                            return <div className="side-bar-profile-data">
                                <span>{this.state.incidentItem.description}</span>
                            </div>
                        }
                        )}
                    </div>
                </div>
                <div className="row mt-5" >
                    <div className="col-sm-2">
                        <div className="year-select-heading">
                            <span>{AppConstants.photos}</span>
                        </div>
                    </div>


                    <div className="col-sm-10" >
                        <div className="row pl-3">
                            {mediaPlayer.map((item) => {
                                return <div className="side-bar-profile-data">
                                    <img className='col-sum m-2  ' style={{ cursor: 'pointer', }} onClick={() => this.showModal(item.mediaUrl, true)} src={item.mediaUrl} height='70' width='70' />
                                </div>
                            }
                            )}
                        </div>

                    </div>
                </div>
            </div>
        )
    }


    ////main render method
    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
                <DashboardLayout menuHeading={AppConstants.liveScores} menuName={AppConstants.liveScores} />
                <InnerHorizontalMenu menu={"liveScore"} liveScoreSelectedKey={"17"} />
                <Layout>
                    {this.headerView()}
                    <Content>
                        <div className="formView">{this.detailsView()}</div>
                        <div className="formView">{this.mediaView()}</div>
                        {this.ModalView()}
                    </Content>
                </Layout>
            </div>
        );
    }
}
export default LiveScoreIncidentView 