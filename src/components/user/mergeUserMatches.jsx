import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import AppConstants from '../../themes/appConstants';
import { Button, Breadcrumb, Layout, notification, Table, Typography } from 'antd';
import DashboardLayout from '../../pages/dashboardLayout';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import { bindActionCreators } from 'redux';
import { useHistory } from 'react-router-dom';
import userHttp from '../../store/http/userHttp/userHttp';
import { addUsersToBeCompared } from '../../store/actions/userAction/userAction';
const { Content } = Layout;
const { Text } = Typography;

const HeaderView = () => {
  return (
    <div className="comp-player-grades-header-view-design">
      <div className="row">
        <div className="col-sm d-flex align-content-center">
          <Breadcrumb separator=" > ">
            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.mergeUser}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};

const UserDetailView = () => {
  const history = useHistory();

  const {
    UserState: { personalData: selectedUser },
  } = useSelector(state => state);

  if (!Object.keys(selectedUser).length) {
    history.push('/userPersonal');
  }

  const dataSource = [
    {
      key: selectedUser.userId,
      id: selectedUser.userId,
      name: `${selectedUser.firstName} ${selectedUser.lastName ? selectedUser.lastName : ''}`,
      dob: selectedUser.dateOfBirth || '',
      email: selectedUser.email,
      mobile: selectedUser.mobileNumber,
    },
  ];

  const columns = [
    {
      title: AppConstants.id,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: AppConstants.name,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: AppConstants.dateOfBirth,
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: AppConstants.emailAdd,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: AppConstants.contactNumber,
      dataIndex: 'mobile',
      key: 'mobile',
    },
  ];

  return (
    <div className="comp-dash-table-view mt-5">
      <h2>{AppConstants.userToMerge}</h2>
      <div className="table-responsive home-dash-table-view">
        <Table
          className="home-dashboard-table"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  );
};

const MatchesDetailView = () => {
  const history = useHistory();
  const [matches, setMatches] = useState([]);
  const {
    UserState: { personalData: selectedUser },
  } = useSelector(state => state);
  const dispatch = useDispatch();
  let userToBeMerged = null;

  const getMatches = async userId => {
    const result = await userHttp.get(
      `${process.env.REACT_APP_USER_API_URL}/userMerge/matches/${userId}`,
    );
    setMatches(result.data);
  };

  useEffect(() => {
    getMatches(selectedUser.userId);
  }, []);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      userToBeMerged = selectedRows;
    },
    getCheckboxProps: record => ({
      name: record.name,
    }),
  };

  const dataSource = matches.map(user => ({
    key: user.id,
    id: user.id,
    name: `${user.firstName} ${user.lastName ? user.lastName : ''}`,
    dob: user.dateOfBirth,
    email: user.email,
    mobile: user.mobileNumber,
    affiliate: user.affiliates && user.affiliates.length ? user.affiliates.join(', ') : '',
  }));

  const columns = [
    {
      title: AppConstants.id,
      dataIndex: 'id',
      key: 'key',
    },
    {
      title: AppConstants.name,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: AppConstants.dateOfBirth,
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: AppConstants.emailAdd,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: AppConstants.contactNumber,
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: AppConstants.affiliate,
      dataIndex: 'affiliate',
      key: 'affiliate',
    },
  ];

  const openDecisionScreen = () => {
    if (!userToBeMerged) {
      const openNotificationWithIcon = type => {
        notification[type]({
          message: AppConstants.unableToContinue,
          description: AppConstants.pleaseSelectUserToMerge,
        });
      };
      return openNotificationWithIcon('error');
    }
    const secondUser = matches.find(match => match.id === userToBeMerged[0].id);

    dispatch(addUsersToBeCompared([selectedUser, secondUser]));

    history.push(`/mergeUserDetail?masterId=${selectedUser.userId}&secondId=${secondUser.id}`);
  };

  return (
    <div className="comp-dash-table-view mt-5">
      <h2>{AppConstants.possibleMatches}</h2>
      <Text type="secondary">{AppConstants.possibleMatchesDescription}</Text>
      <div className="table-responsive home-dash-table-view mt-3">
        <Table
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          className="home-dashboard-table"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
      <div className="d-flex align-items-center justify-content-between mt-4">
        <Button onClick={history.goBack}>{AppConstants.cancel}</Button>
        <Button
          type="primary"
          onClick={() => {
            openDecisionScreen();
          }}
        >
          {AppConstants.next}
        </Button>
      </div>
    </div>
  );
};

function MergeUserMatches() {
  return (
    <div className="fluid-width default-bg">
      <DashboardLayout menuHeading={AppConstants.user} menuName={AppConstants.user} />
      <InnerHorizontalMenu menu="user" userSelectedKey="1" />
      <Layout>
        <HeaderView></HeaderView>
        <Content>
          <UserDetailView></UserDetailView>
          <MatchesDetailView></MatchesDetailView>
        </Content>
      </Layout>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
  return {
    userState: state.UserState,
    appState: state.AppState,
    commonReducerState: state.CommonReducerState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MergeUserMatches);
