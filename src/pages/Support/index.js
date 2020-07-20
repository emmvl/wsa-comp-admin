import React, { useEffect } from "react";
import { connect } from "react-redux";

import AppConstants from "../../themes/appConstants";
import { getSupportContentAction } from "../../store/actions/supportAction";
import Loader from "../../customComponents/loader";
import DashboardLayout from "../dashboardLayout";
import SideBar from "./SideBar";
import ContentPanel from "./ContentPanel";

import "./style.scss";

function Support(props) {
  const { supportState, getSupportContent } = props;

  const { onLoad, result: content } = supportState;

  useEffect(() => {
    getSupportContent();
  }, [getSupportContent]);

  console.log(content);

  return (
    <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
      <DashboardLayout menuHeading={AppConstants.support} menuName={AppConstants.support} />

      <div className="support-panel">
        <SideBar content={content} />
        <ContentPanel content={<></>} />
      </div>

      <Loader visible={onLoad} />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => ({
  getSupportContent: (email) => dispatch(getSupportContentAction(email)),
});

const mapStateToProps = (state) => ({
  appState: state.AppState,
  supportState: state.SupportState,
});

export default connect(mapStateToProps, mapDispatchToProps)(Support);
