import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
import AppConstants from "../../themes/appConstants";
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Divider,
    Layout,
    Radio,
    Row,
    Typography,
    notification
} from "antd";
import DashboardLayout from "../../pages/dashboardLayout";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import userHttp from '../../store/http/userHttp/userHttp'
import { useHistory } from "react-router-dom";
import { connect, useSelector } from "react-redux";
const { Content } = Layout;
const { Text } = Typography;

const HeaderView = () => {
    return (
        <div className="comp-player-grades-header-view-design">
            <div className="row">
                <div className="col-sm d-flex align-content-center">
                    <Breadcrumb separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">
                            {AppConstants.mergeUser}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        </div>
    );
};

const MatchesDetailView = () => {

    const [masterUser, setMasterUser] = useState(false);
    const [secondUser, setSecondUser] = useState(false);

    const [masterUserFirstName, setMasterUserFirstName] = useState(false);
    const [secondUserFirstName, setSecondUserFirstName] = useState(false);

    const [masterUserLastName, setMasterUserLastName] = useState(false);
    const [secondUserLastName, setSecondUserLastName] = useState(false);

    const [masterUserDateOfBirth, setMasterUserDateOfBirth] = useState(false);
    const [secondUserDateOfBirth, setSecondUserDateOfBirth] = useState(false);

    const [masterUserEmail, setMasterUserEmail] = useState(false);
    const [secondUserEmail, setSecondUserEmail] = useState(false);

    const [masterUserMobile, setMasterUserMobile] = useState(false);
    const [secondUserMobile, setSecondUserMobile] = useState(false);

    const [masterUserAddress, setMasterUserAddress] = useState(false);
    const [secondUserAddress, setSecondUserAddress] = useState(false);

    const checkFullSelection = () => {
        if (
            masterUserFirstName &&
            masterUserLastName &&
            masterUserDateOfBirth &&
            masterUserEmail &&
            masterUserMobile &&
            masterUserAddress
        ) {
            setMasterUser(true)
            setSecondUser(false)
        } else if (
            secondUserFirstName &&
            secondUserLastName &&
            secondUserDateOfBirth &&
            secondUserEmail &&
            secondUserMobile &&
            secondUserAddress
        ) {
            setSecondUser(true)
            setMasterUser(false)
        } else {
            setMasterUser(false)
            setSecondUser(false)
        }
    }

    const masterUserChanged = (e) => {
        setMasterUser(true)
        setSecondUser(false)

        setMasterUserFirstName(true)
        setMasterUserLastName(true)
        setMasterUserDateOfBirth(true)
        setMasterUserEmail(true)
        setMasterUserMobile(true)
        setMasterUserAddress(true)

        setSecondUserFirstName(false)
        setSecondUserLastName(false)
        setSecondUserDateOfBirth(false)
        setSecondUserEmail(false)
        setSecondUserMobile(false)
        setSecondUserAddress(false)
    }

    const secondUserChanged = (e) => {
        setSecondUser(true)
        setMasterUser(false)

        setSecondUserFirstName(true)
        setSecondUserLastName(true)
        setSecondUserDateOfBirth(true)
        setSecondUserEmail(true)
        setSecondUserMobile(true)
        setSecondUserAddress(true)

        setMasterUserFirstName(false)
        setMasterUserLastName(false)
        setMasterUserDateOfBirth(false)
        setMasterUserEmail(false)
        setMasterUserMobile(false)
        setMasterUserAddress(false)
    }
    const masterUserFirstNameChanged = (e) => {
        setMasterUserFirstName(true)
        setSecondUserFirstName(false)
    }
    const secondUserFirstNameChanged = (e) => {
        setSecondUserFirstName(true)
        setMasterUserFirstName(false)
    }
    const masterUserLastNameChanged = (e) => {
        setMasterUserLastName(true)
        setSecondUserLastName(false)
    }
    const secondUserLastNameChanged = (e) => {
        setSecondUserLastName(true)
        setMasterUserLastName(false)
    }
    const masterUserDateOfBirthChanged = (e) => {
        setMasterUserDateOfBirth(true)
        setSecondUserDateOfBirth(false)
    }
    const secondUserDateOfBirthChanged = (e) => {
        setSecondUserDateOfBirth(true)
        setMasterUserDateOfBirth(false)
    }
    const masterUserEmailChanged = (e) => {
        setMasterUserEmail(true)
        setSecondUserEmail(false)
    }
    const secondUserEmailChanged = (e) => {
        setSecondUserEmail(true)
        setMasterUserEmail(false)
    }
    const masterUserMobileChanged = (e) => {
        setMasterUserMobile(true)
        setSecondUserMobile(false)
    }
    const secondUserMobileChanged = (e) => {
        setSecondUserMobile(true)
        setMasterUserMobile(false)
    }
    const masterUserAddressChanged = (e) => {
        setMasterUserAddress(true)
        setSecondUserAddress(false)
    }
    const secondUserAddressChanged = (e) => {
        setSecondUserAddress(true)
        setMasterUserAddress(false)
    }

    const triggerMerge = async () => {
        const payload = {}
        if (masterUserFirstName || secondUserFirstName) {
            payload.firstName = masterUserFirstName ? master.firstName: second.firstName
        }

        if (masterUserLastName || secondUserLastName) {
            payload.lastName = masterUserLastName ? master.lastName: second.lastName
        }

        if (masterUserEmail || secondUserEmail) {
            payload.email = masterUserEmail ? master.email: second.email
        }

        if (masterUserDateOfBirth || secondUserDateOfBirth) {
            payload.dateOfBirth = masterUserDateOfBirth ? master.dateOfBirth: second.dateOfBirth
        }

        if (masterUserMobile || secondUserMobile) {
            payload.mobileNumber = masterUserMobile ? master.mobileNumber: second.mobileNumber
        }

        if (masterUserAddress || secondUserAddress) {
            payload.address = masterUserAddress ? master.address: second.address
        }

        const openNotificationWithIcon = (type, message) => {
            notification[type]({
                message: AppConstants.success,
                description: message || AppConstants.userMergedSuccessfully
            });
        };

        try {
            await userHttp.post(
                `${process.env.REACT_APP_USER_API_URL}/userMerge/merge`, {
                    masterUserId: master.userId,
                    otherUserId: second.id,
                    payload: payload
                }
            )
            openNotificationWithIcon('success')
            return history.push("/userTextualDashboard");
        } catch(e) {
            console.error(e)
            openNotificationWithIcon('error', AppConstants.somethingWentWrong)
        }
    }

    useEffect(() => {
        checkFullSelection()
    })

    const {
        UserState: {
            usersToBeMerged: usersToBeMerged
        },
    } = useSelector((state) => state);
    const master = usersToBeMerged[0];
    const second = usersToBeMerged[1];
    
    const history = useHistory();
    if (!usersToBeMerged.length) {
        return history.replace("/userPersonal");
    }

    return (
        <Row>
            <Col span={19}>
                <div className="comp-dash-table-view">
                    <Text type="secondary">
                        {AppConstants.possibleMatchesDescription}
                    </Text>
                    <Card className="mt-4">
                        <Row>
                            <Col span={8}><Text strong>{AppConstants.userInformation}</Text></Col>
                            <Col span={8}>
                                <Radio checked={masterUser} onChange={masterUserChanged}>
                                    <Text strong>{AppConstants.selectAllFromThisUser}</Text>
                                </Radio>
                            </Col>
                            <Col span={8}>
                                <Radio checked={secondUser} onChange={secondUserChanged}>
                                    <Text strong>{AppConstants.selectAllFromThisUser}</Text>
                                </Radio>
                            </Col>
                        </Row>
                        <Divider style={{ margin: '8px' }} />
                        <Row>
                            <Col span={8}><Text strong>{AppConstants.firstName}</Text></Col>
                            <Col span={8}>
                                <Radio checked={masterUserFirstName} onChange={masterUserFirstNameChanged}>
                                    {master.firstName}
                                </Radio>
                            </Col>
                            <Col span={8}>
                                <Radio checked={secondUserFirstName} onChange={secondUserFirstNameChanged}>
                                    {second.firstName}
                                </Radio>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}><Text strong>{AppConstants.lastName}</Text></Col>
                            <Col span={8}>
                                <Radio checked={masterUserLastName} onChange={masterUserLastNameChanged}>
                                    {master.lastName}
                                </Radio>
                            </Col>
                            <Col span={8}>
                                <Radio checked={secondUserLastName} onChange={secondUserLastNameChanged}>
                                    {second.lastName}
                                </Radio>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}><Text strong>{AppConstants.dateOfBirth}</Text></Col>
                            <Col span={8}>
                                <Radio checked={masterUserDateOfBirth} onChange={masterUserDateOfBirthChanged}>
                                    {master.dateOfBirth}
                                </Radio>
                            </Col>
                            <Col span={8}>
                                <Radio checked={secondUserDateOfBirth} onChange={secondUserDateOfBirthChanged}>
                                    {second.dateOfBirth}
                                </Radio>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}><Text strong>{AppConstants.emailAdd}</Text></Col>
                            <Col span={8}>
                                <Radio checked={masterUserEmail} onChange={masterUserEmailChanged}>
                                    {master.email}
                                </Radio>
                            </Col>
                            <Col span={8}>
                                <Radio checked={secondUserEmail} onChange={secondUserEmailChanged}>
                                    {second.email}
                                </Radio>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}><Text strong>{AppConstants.contactNumber}</Text></Col>
                            <Col span={8}>
                                <Radio checked={masterUserMobile} onChange={masterUserMobileChanged}>
                                    {master.mobileNumber}
                                </Radio>
                            </Col>
                            <Col span={8}>
                                <Radio checked={secondUserMobile} onChange={secondUserMobileChanged}>
                                    {second.mobileNumber}
                                </Radio>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}><Text strong>{AppConstants.address}</Text></Col>
                            <Col span={8}>
                                <Radio checked={masterUserAddress} onChange={masterUserAddressChanged}>
                                    {master.address}
                                </Radio>
                            </Col>
                            <Col span={8}>
                                <Radio checked={secondUserAddress} onChange={secondUserAddressChanged}>
                                    {second.address}
                                </Radio>
                            </Col>
                        </Row>
                    </Card>
                    <div className="d-flex align-items-center justify-content-between mt-4">
                        <Button onClick={history.goBack}>{AppConstants.cancel}</Button>
                        <Button onClick={triggerMerge} type="primary">{AppConstants.merge}</Button>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

function MergeUserDetail() {
    return (
        <div className="fluid-width default-bg">
            <DashboardLayout
                menuHeading={AppConstants.user}
                menuName={AppConstants.user}
            />
            <InnerHorizontalMenu menu="user" userSelectedKey="1" />
            <Layout>
                <HeaderView></HeaderView>
                <Content>
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
        commonReducerState: state.CommonReducerState
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MergeUserDetail);
