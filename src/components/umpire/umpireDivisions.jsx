import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavLink } from 'react-router-dom';
import { Layout, Button, Select, Breadcrumb, Form, Modal, Spin } from 'antd';

import { getRefBadgeData } from '../../store/actions/appAction';
import { umpireCompetitionListAction } from '../../store/actions/umpireAction/umpireCompetetionAction';
import {
  getUmpirePoolData,
  updateUmpirePoolToDivision,
  applyUmpireAllocatioAlgorithm,
} from '../../store/actions/umpireAction/umpirePoolAllocationAction';
import {
  liveScoreGetDivision,
  liveScoreGetRounds,
} from '../../store/actions/LiveScoreAction/liveScoreTeamAction';

import {
  getUmpireCompId,
  setUmpireCompId,
  getUmpireCompetitionData,
} from '../../util/sessionStorage';
import { isArrayNotEmpty } from '../../util/helpers';
import history from 'util/history';

import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import Loader from '../../customComponents/loader';

import AppConstants from '../../themes/appConstants';
import { isEqual } from 'lodash';
import './umpire.css';
import { fastRGLPropsEqual } from 'react-grid-layout/build/utils';

const { Header } = Layout;
const { Option } = Select;

class UmpireDivisions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedComp: JSON.parse(getUmpireCompId()) || null,
      loading: false,
      competitionUniqueKey: null,
      umpirePoolData: props.umpirePoolAllocationState?.umpirePoolData,
      selectedDivisions: [],
      isOrganiserView: false,
      algorithmModalVisible: false,
      selectedRounds: [],
    };
  }

  componentDidMount() {
    let { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
    this.setState({ loading: true });
    this.props.umpireCompetitionListAction(null, null, organisationId, 'USERS');
    this.props.getRefBadgeData();
  }

  componentDidUpdate(prevProps) {
    const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));

    if (!isEqual(prevProps.umpireCompetitionState, this.props.umpireCompetitionState)) {
      if (this.state.loading && this.props.umpireCompetitionState.onLoad == false) {
        let competitionList =
          this.props.umpireCompetitionState.umpireComptitionList &&
          isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList)
            ? this.props.umpireCompetitionState.umpireComptitionList
            : [];

        let compId = getUmpireCompId() ? JSON.parse(getUmpireCompId()) : null;
        let firstComp = compId
          ? compId
          : competitionList && !!competitionList.length
          ? competitionList[0].id
          : null;
        if (firstComp && firstComp !== compId) setUmpireCompId(firstComp);

        const storedUmpireCompetition = getUmpireCompetitionData();
        const parsedData = JSON.parse(storedUmpireCompetition);
        const umpireCompetitionData = parsedData ? parsedData : null;
        if (!!umpireCompetitionData && organisationId && firstComp) {
          this.props.getUmpirePoolData({ orgId: organisationId, compId: firstComp });
        }
        if (firstComp) {
          this.props.liveScoreGetDivision(firstComp);
          this.props.liveScoreGetRounds(firstComp);
        }

        const compKey =
          competitionList && competitionList.length && competitionList[0].competitionUniqueKey
            ? competitionList[0]?.competitionUniqueKey
            : null;

        const selectedComp = competitionList
          ? competitionList.find(item => item.id === firstComp)
          : {};
        const isOrganiser =
          selectedComp && selectedComp.organisationId && organisationId
            ? selectedComp.organisationId === organisationId
            : false;

        if (firstComp)
          this.setState({
            selectedComp: firstComp,
            loading: false,
            competitionUniqueKey: compKey,
            isOrganiserView: isOrganiser,
          });
      }
    }

    const { umpirePoolData } = this.props.umpirePoolAllocationState;

    if (!isEqual(umpirePoolData, prevProps.umpirePoolAllocationState.umpirePoolData)) {
      const selectedDivisions = [];
      umpirePoolData.forEach(poolItem => {
        if (poolItem && poolItem.divisions && Array.isArray(poolItem.divisions)) {
          selectedDivisions.push(...poolItem.divisions.map(division => division.id));
        }
      });

      this.setState({ umpirePoolData, selectedDivisions });
    }
  }

  onChangeComp = compId => {
    const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
    const competitionList = this.props.umpireCompetitionState.umpireComptitionList;

    const selectedComp = competitionList.find(competition => competition.id === compId);
    const isOrganiser = selectedComp.organisationId === organisationId;

    setUmpireCompId(compId);

    this.props.liveScoreGetDivision(compId);
    this.props.getUmpirePoolData({ orgId: organisationId ? organisationId : 0, compId });
    this.props.liveScoreGetRounds(compId);

    this.setState({
      selectedComp: compId,
      isOrganiserView: isOrganiser,
      umpirePoolData: null,
    });
  };

  handleChangeDivisions = (divisions, poolIndex) => {
    const { divisionList } = this.props.liveScoreTeamState;
    const { umpirePoolData, selectedDivisions } = this.state;

    const umpirePoolDataCopy = JSON.parse(JSON.stringify(umpirePoolData));

    const divisionsToChange = umpirePoolDataCopy[poolIndex].divisions.map(division => division.id);

    const selectedDivisionsRest = selectedDivisions.filter(
      selectedDivision =>
        !divisionsToChange.some(divisionToChange => divisionToChange === selectedDivision),
    );

    selectedDivisionsRest.push(...divisions);

    umpirePoolDataCopy[poolIndex].divisions = divisions.map(divisionId =>
      divisionList.find(divisionObj => divisionObj.id === divisionId),
    );

    this.setState({
      umpirePoolData: umpirePoolDataCopy,
      selectedDivisions: selectedDivisionsRest,
    });
  };

  handleOpenAlgorithm = () => {
    this.setState({ algorithmModalVisible: true });
  };

  handleOkAlgorithm = e => {
    const { selectedRounds, selectedComp } = this.state;
    const { organisationId } = JSON.parse(localStorage.getItem('setOrganisationData'));
    const body = {
      rounds: selectedRounds,
      organisationId,
    };

    if (organisationId && selectedComp && selectedRounds && selectedRounds.length) {
      this.props.applyUmpireAllocatioAlgorithm({
        compId: selectedComp,
        body,
      });
    }

    this.setState({
      algorithmModalVisible: false,
      selectedRounds: [],
    });
  };

  handleCancelAlgorithm = e => {
    this.setState({
      algorithmModalVisible: false,
      selectedRounds: [],
    });
  };

  handleChangeRounds = rounds => {
    this.setState({
      selectedRounds: rounds,
    });
  };

  handleSave = () => {
    const { umpirePoolData, selectedComp } = this.state;

    const data = umpirePoolData.reduce((acc, item) => {
      acc[item.id] = item.divisions.map(division => division.id);
      return acc;
    }, {});

    const body = {
      umpirePools: data,
    };

    this.props.updateUmpirePoolToDivision({
      compId: selectedComp,
      body,
    });
  };

  headerView = () => {
    return (
      <div className="header-view divisions">
        <Header className="form-header-view d-flex bg-transparent align-items-center">
          <Breadcrumb separator=" > ">
            <Breadcrumb.Item className="breadcrumb-add">
              {AppConstants.umpirePoolsDivision}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Header>
      </div>
    );
  };

  dropdownView = () => {
    const competition = isArrayNotEmpty(this.props.umpireCompetitionState.umpireComptitionList)
      ? this.props.umpireCompetitionState.umpireComptitionList
      : [];

    return (
      <div className="comp-venue-courts-dropdown-view mt-0 ">
        <div className="fluid-width">
          <div className="row">
            <div className="col-sm">
              <div className="w-ft d-flex flex-row align-items-center" style={{ marginBottom: 12 }}>
                <span className="year-select-heading">{AppConstants.competition}:</span>

                <Select
                  className="year-select reg-filter-select1 ml-2"
                  style={{ minWidth: 200 }}
                  onChange={this.onChangeComp}
                  value={!this.props.umpireCompetitionState.onLoad ? this.state.selectedComp : null}
                  loading={this.props.umpireCompetitionState.onLoad}
                >
                  {competition.map(item => (
                    <Option key={'competition_' + item.id} value={item.id}>
                      {item.longName}
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

  poolView(poolItem, index) {
    const { divisionList } = this.props.liveScoreTeamState;
    const { selectedDivisions, isOrganiserView } = this.state;

    return (
      <div className="row py-3" key={'poolItem' + index} style={{ paddingLeft: 15 }}>
        <div className="d-flex align-items-center w-25">
          <span className="text-overflow">{poolItem.name}</span>
        </div>

        <div className="col-sm">
          <Select
            mode="multiple"
            placeholder="Select"
            style={{ width: '100%', paddingRight: 1, minWidth: 182 }}
            onChange={divisions => this.handleChangeDivisions(divisions, index)}
            value={
              !!poolItem?.divisions?.length && !!divisionList?.length
                ? poolItem?.divisions?.map(division => division?.id)
                : []
            }
            disabled={!isOrganiserView}
          >
            {(divisionList || []).map(item => (
              <Option
                key={item.id}
                disabled={
                  selectedDivisions.some(divisionId => divisionId === item.id) &&
                  !poolItem.divisions.find(division => division.id === item.id)
                }
                value={item.id}
              >
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    );
  }

  noPoolView = () => <div className="mt-4 error-message-inside">{AppConstants.noPoolAdded}</div>;

  contentView = () => {
    const { umpirePoolData } = this.state;
    return (
      <div className="content-view pt-5">
        <span className="text-heading-large pt-3 mb-0">{AppConstants.umpirePools}</span>
        {this.props.umpireCompetitionState.onLoad || this.props.umpirePoolAllocationState.onLoad ? (
          <div
            style={{
              height: 100,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <>
            {!!umpirePoolData && (
              <>
                {!!umpirePoolData.length
                  ? umpirePoolData.map((item, index) => this.poolView(item, index))
                  : this.noPoolView()}
              </>
            )}
          </>
        )}
      </div>
    );
  };

  getRoundsNames = () => {
    const { divisionList, roundsData } = this.props.liveScoreTeamState;
    const roundsWithDivision =
      !roundsData || !roundsData.length
        ? []
        : roundsData
            .filter(round => !!round)
            .map(round => {
              const curDivision =
                divisionList && divisionList.length
                  ? divisionList.find(division => division.id === round.divisionId)
                  : { name: '' };
              const divName = curDivision && curDivision.name ? curDivision.name : null;
              return {
                id: round?.id,
                name: divName !== null ? `${divName} - ${round?.name}` : round?.name,
              };
            });
    return roundsWithDivision;
  };

  algorithmModalView = () => {
    const { roundsData } = this.props.liveScoreTeamState;
    const { selectedRounds } = this.state;
    const roundNames = this.getRoundsNames();

    return (
      <Modal
        className="add-membership-type-modal"
        title={AppConstants.allocationAlgorithmModalTitle}
        visible={this.state.algorithmModalVisible}
        onOk={this.handleOkAlgorithm}
        onCancel={this.handleCancelAlgorithm}
      >
        <div>
          <Select
            mode="multiple"
            placeholder="Select"
            className="w-100"
            onChange={this.handleChangeRounds}
            value={!!selectedRounds ? selectedRounds : []}
          >
            {roundNames.map(item => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    );
  };

  footerView = () => {
    const { isOrganiserView, umpirePoolData } = this.state;
    const isDisabled =
      this.props.appState.onLoad ||
      this.props.umpirePoolAllocationState.onLoad ||
      this.props.liveScoreTeamState.onLoad ||
      !umpirePoolData?.length;
    return (
      <div className="form-footer-button-wrapper justify-content-between">
        <div className="reg-add-save-button">
          <NavLink to="/umpirePoolAllocation">
            <Button className="cancelBtnWidth" type="cancel-button">
              {AppConstants.back}
            </Button>
          </NavLink>
        </div>
        <div>
          {isOrganiserView && (
            <>
              <Button
                className="publish-button save-draft-text mr-4"
                style={{ minWidth: 'fit-content' }}
                type="primary"
                onClick={this.handleOpenAlgorithm}
                disabled={isDisabled}
              >
                {AppConstants.allocateUmpires}
              </Button>

              <Button
                className="publish-button save-draft-text m-0 mr-4"
                type="primary"
                htmlType="submit"
                onClick={this.handleSave}
                disabled={isDisabled}
              >
                {AppConstants.save}
              </Button>
            </>
          )}
          <Button
            className="publish-button save-draft-text mr-0"
            type="primary"
            htmlType="submit"
            onClick={() => {
              if (isOrganiserView && !isDisabled) this.handleSave();
              history.push('/umpirePaymentSetting');
            }}
          >
            {AppConstants.next}
          </Button>
        </div>
      </div>
    );
  };

  render = () => {
    return (
      <div className="fluid-width default-bg">
        <DashboardLayout menuHeading={AppConstants.umpires} menuName={AppConstants.umpires} />
        <InnerHorizontalMenu menu="umpire" umpireSelectedKey="4" />
        <Layout>
          {this.headerView()}
          {this.dropdownView()}
          <Form autoComplete="off" onFinish={this.handleSubmit}>
            <div className="formView">{this.contentView()}</div>

            {this.footerView()}
            {this.algorithmModalView()}
          </Form>
        </Layout>
        <Loader
          visible={
            this.props.appState.onLoad ||
            this.props.umpirePoolAllocationState.onLoad ||
            this.props.liveScoreTeamState.onLoad
          }
        />
      </div>
    );
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      umpireCompetitionListAction,
      getRefBadgeData,
      getUmpirePoolData,
      liveScoreGetDivision,
      liveScoreGetRounds,
      updateUmpirePoolToDivision,
      applyUmpireAllocatioAlgorithm,
    },
    dispatch,
  );
}

function mapStateToProps(state) {
  return {
    umpireCompetitionState: state.UmpireCompetitionState,
    appState: state.AppState,
    umpirePoolAllocationState: state.UmpirePoolAllocationState,
    liveScoreTeamState: state.LiveScoreTeamState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UmpireDivisions);
