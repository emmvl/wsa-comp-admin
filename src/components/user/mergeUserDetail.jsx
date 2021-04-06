import React, { useState, useEffect } from "react";
import { bindActionCreators } from 'redux';
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
    notification,
} from "antd";
import { get, isEmpty } from "lodash";
import { useHistory } from "react-router-dom";
import { connect, useSelector } from 'react-redux'
import { getOrganisationData } from 'util/sessionStorage'
import UserAxiosApi from 'store/http/userHttp/userAxiosApi'
import Loader from 'customComponents/loader'
import { liveScore_formateDate } from 'themes/dateformate'
import userHttp from '../../store/http/userHttp/userHttp'
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

const { Content } = Layout;
const { Text } = Typography;

const HeaderView = () => (
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

const selectAll = 'selectAll';
const userTypes = {
    master: "master",
    second: "second",
}
const MatchesDetailView = (props) => {
    const { usersToBeMerged } = useSelector((state) => state.UserState);
    const master = usersToBeMerged[0];
    const second = usersToBeMerged[1];
    const history = useHistory();
    const searchParams = new URLSearchParams(props.location.search);
    const paramMasterId = searchParams.get('masterId')
    const paramSecondId = searchParams.get('secondId')
    const masterId = master ? master.userId : paramMasterId
    const secondId = second ? second.id : paramSecondId

    const [masterUserData, setMasterUserData] = useState(null);
    const [secondUserData, setSecondUserData] = useState(null);
    const [values, setValues] = useState({});

    const getMasterValue = (keyPath) => get(masterUserData, keyPath) || "";
    const getSecondValue = (keyPath) => get(secondUserData, keyPath) || "";
    const getDateTypeValue = (value) => liveScore_formateDate(value) || "";
    const isMasterSelected = (radioKey) => values[radioKey] === userTypes.master;
    const isSecondSelected = (radioKey) => values[radioKey] === userTypes.second;

    const getUserValueByKeys = (valueKey, userTypeKey) => {
        if (!masterUserData || !secondUserData) return ''

        const isMasterValue = userTypeKey === userTypes.master;
        const payloadValue = isMasterValue ? masterUserData[valueKey] : secondUserData[valueKey];

        return payloadValue || '';
    }

    const fields = [
        { key: "firstName", title: AppConstants.firstName },
        { key: "lastName", title: AppConstants.lastName },
        { key: "middleName", title: AppConstants.middleName },
        {
            key: "dateOfBirth",
            title: AppConstants.dateOfBirth,
            onValueFormat: getDateTypeValue,
        },
        { key: "email", title: AppConstants.emailAdd },
        { key: "mobileNumber", title: AppConstants.contactNumber },
        { key: "gender", title: AppConstants.gender },
        {
            key: "accreditationUmpireExpiryDate",
            title: AppConstants.nationalAccreditationLevelUmpire,
            getValue: (radioValue) => {
                const value = getUserValueByKeys('umpireAccreditationLevel', radioValue)
                const dateValue = getDateTypeValue(
                    getUserValueByKeys("accreditationUmpireExpiryDate", radioValue),
                )

                return value + ' ' + dateValue;
            },
        },
        {
            key: "accreditationCoachExpiryDate",
            title: AppConstants.nationalAccreditationLevelCoach,
            getValue: (radioValue) => {
                const value = getUserValueByKeys("coachAccreditationLevel", radioValue)
                const dateValue = getDateTypeValue(
                    getUserValueByKeys("accreditationCoachExpiryDate", radioValue),
                )

                return value + ' ' + dateValue;
            },
        },
        { key: "childrenCheckNumber", title: AppConstants.childrenNumber },
        {
            key: "childrenCheckExpiryDate",
            title: AppConstants.checkExpiryDate,
            onValueFormat: getDateTypeValue,
        },
        { key: "postalCode", title: AppConstants.postalCode },
        { key: "street1", title: AppConstants.street1 },
        { key: "street2", title: AppConstants.street2 },
        { key: "suburb", title: AppConstants.suburb },
        { key: "stripeCustomerAccountId", title: AppConstants.stripeCustomerAccountId },
    ];

    const getNewValuesByKey = (userKey) => {
        const newValues = {}
        fields.forEach((field) => newValues[field.key] = userKey)

        return newValues;
    }

    const handleRadioSelected = (radioKey, userTypeKey) => {
        if (radioKey === selectAll) {
            const newValues = {
                [radioKey]: userTypes[userTypeKey],
                ...getNewValuesByKey(userTypes[userTypeKey]),
            }

            setValues(newValues)
        } else {
            setValues({
                ...values,
                selectAll: values.selectAll === userTypes[userTypeKey] ? userTypes[userTypeKey] : null,
                [radioKey]: userTypes[userTypeKey],
            })
        }
    }

    const handleMasterRadioSelected = (radioKey) => {
        handleRadioSelected(radioKey, userTypes.master)
    }

    const handleSecondRadioSelected = (radioKey) => {
        handleRadioSelected(radioKey, userTypes.second)
    }

    const getCorrectedUserData = (valueKey, value, userTypeKey) => {
        switch (valueKey) {
            case "gender": {
                const correctedKey = "genderRefId";
                const correctedValue = getUserValueByKeys(correctedKey, userTypeKey);

                return {
                    correctedKey,
                    correctedValue,
                }
            }
            default:
                return {
                    correctedKey: valueKey,
                    correctedValue: value,
                }
        }
    }

    const mergeUser = async () => {
        const payload = {}

        if (values.selectAll) {
            const isMasterSelected = values.selectAll === userTypes.master;
            const fromValues = isMasterSelected ? masterUserData : secondUserData;

            fields.forEach(field => {
                const payloadValue = fromValues[field.key];
                const { correctedKey, correctedValue } = getCorrectedUserData(field.key, payloadValue, values.selectAll);

                payload[correctedKey] = correctedValue;
            })
        } else {
            delete values.selectAll
            Object.keys(values).forEach((valueKey) => {
                const radioValue = values[valueKey];
                const payloadValue = getUserValueByKeys(valueKey, radioValue);
                const { correctedKey, correctedValue } = getCorrectedUserData(valueKey, payloadValue, values.selectAll);

                payload[correctedKey] = correctedValue;
            })
        }

        const openNotificationWithIcon = (type, message) => {
            notification[type]({
                message: AppConstants.success,
                description: message || AppConstants.userMergedSuccessfully,
            });
        };

        try {
            await userHttp.post(
                `${process.env.REACT_APP_USER_API_URL}/userMerge/merge`, {
                    masterUserId: masterId,
                    otherUserId: secondId,
                    payload,
                }
            )
            openNotificationWithIcon('success')
            return history.push("/userTextualDashboard");
        } catch (e) {
            console.error(e)
            openNotificationWithIcon('error', AppConstants.somethingWentWrong)
        }
    }

    const fetchUserData = async (userId) => {
        const organisationId = get(getOrganisationData(), 'organisationUniqueKey', null);
        const PersonalInfoResultPromise = UserAxiosApi.getUserModulePersonalData({
            userId,
            organisationId,
        });
        const CompInfoResultPromise = UserAxiosApi.getUserModulePersonalByCompData({
            userId,
            organisationId,
        });

        const [PersonalInfoResult, CompInfoResult] = await Promise.all([PersonalInfoResultPromise, CompInfoResultPromise])

        return {
            ...PersonalInfoResult.result.data,
            ...CompInfoResult.result.data[0],
        };
    }

    useEffect(() => {
        async function anyNameFunction() {
            if (!masterId || !secondId) return;

            const masterData = await fetchUserData(masterId)
            const secondData = await fetchUserData(secondId)

            setMasterUserData(masterData);
            setSecondUserData(secondData);
        }

        anyNameFunction()
    }, [masterId, secondId])

    if (!masterId || !secondId) {
        return history.replace("/userPersonal");
    }

    return (
        <>
            <Loader visible={!(masterUserData && secondUserData)} />

            <div className="row">
                <div className="col-sm-12">

                    <div className="comp-dash-table-view">
                        <Text type="secondary">
                            {AppConstants.possibleMatchesDescription}
                        </Text>
                        <Card className="mt-4">
                            <Row>
                                <Col span={8} className="pr-4"><Text strong>{AppConstants.userInformation}</Text></Col>
                                <Col span={8}>
                                    <Radio
                                        checked={isMasterSelected("selectAll")}
                                        onChange={() => handleMasterRadioSelected("selectAll")}
                                    >
                                        {AppConstants.selectAllFromThisUser}
                                    </Radio>
                                </Col>
                                <Col span={8}>
                                    <Radio
                                        checked={isSecondSelected("selectAll")}
                                        onChange={() => handleSecondRadioSelected("selectAll")}
                                    >
                                        {AppConstants.selectAllFromThisUser}
                                    </Radio>
                                </Col>
                            </Row>
                            <Divider style={{ margin: '8px' }} />


                            { fields.map((field) => {
                                const { getValue, onValueFormat, key } = field;
                                let masterValue = getMasterValue(key);
                                let secondValue = getSecondValue(key);

                                if (typeof getValue === 'function') {
                                    masterValue = getValue(userTypes.master)
                                    secondValue = getValue(userTypes.second)
                                }

                                if (typeof onValueFormat === 'function') {
                                    masterValue = onValueFormat(masterValue)
                                    secondValue = onValueFormat(secondValue)
                                }

                                if (
                                    isEmpty(masterValue.replace(/\s/g, '')) &&
                                    isEmpty(secondValue.replace(/\s/g, ''))) {
                                    return null
                                }

                                return (
                                    <Row key={field.key}>
                                        <Col span={8} className="pr-4"><Text strong>{field.title}</Text></Col>
                                        <Col span={8}>
                                            <Radio
                                                checked={isMasterSelected(field.key)}
                                                onChange={() => handleMasterRadioSelected(field.key)}
                                            >
                                                {masterValue}
                                            </Radio>
                                        </Col>
                                        <Col span={8}>
                                            <Radio
                                                checked={isSecondSelected(field.key)}
                                                onChange={() => handleSecondRadioSelected(field.key)}
                                            >
                                                {secondValue}
                                            </Radio>
                                        </Col>
                                    </Row>
                                )
                            })}

                        </Card>
                        <div className="d-flex align-items-center justify-content-between mt-4">
                            <Button onClick={history.goBack}>{AppConstants.cancel}</Button>
                            <Button onClick={mergeUser} type="primary">{AppConstants.merge}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

function MergeUserDetail(props) {

    return (
        <div className="fluid-width default-bg">

            <DashboardLayout
                menuHeading={AppConstants.user}
                menuName={AppConstants.user}
            />
            <InnerHorizontalMenu menu="user" userSelectedKey="1" />
            <Layout>
                <HeaderView />
                <Content>
                    <MatchesDetailView {...props} />
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

export default connect(mapStateToProps, mapDispatchToProps)(MergeUserDetail);
