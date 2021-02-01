import React from "react";
import PropTypes from 'prop-types';
import {
    Checkbox, Radio, Select, Spin,
} from "antd";

import AppConstants from "../../../themes/appConstants";
import { getOrganisationData } from "../../../util/sessionStorage";
import { isArrayNotEmpty } from "../../../util/helpers";
import InputWithHead from "../../../customComponents/InputWithHead";

const { Option } = Select;

const CommunicationTargets = (props) => {
    const {
        state,
        setState,
        allOrg,
        individualOrg,
        individualUsers,
        allUser,
        selectedRoles,
        onTextualLoad,
        userDashboardTextualList,
        userName,
        orgName,
        affiliateTo,
        onLoadSearch,
        updateCommunicationModuleData,
        userSearchApi,
        getAffiliateToOrganisationAction,
    } = props;

    const organisationUniqueKey = getOrganisationData() ? getOrganisationData().organisationUniqueKey : null;
    const affiliateToData = isArrayNotEmpty(affiliateTo.affiliatedTo) ? affiliateTo.affiliatedTo : [];
    const userData = isArrayNotEmpty(userDashboardTextualList) ? userDashboardTextualList : [];

    const selectedRolArr = [
        { label: 'Managers', value: "manager" },
        { label: 'Coaches', value: "coaches" },
        { label: 'Scorers', value: "scorers" },
        { label: 'Players', value: "players" },
        { label: 'Umpires', value: "umpires" },
    ];

    return (
        <div>
            <InputWithHead heading={`${AppConstants.organisation}(s)`} />
            <div className="d-flex flex-column">
                <Radio
                    className="mt-3"
                    onChange={(e) => updateCommunicationModuleData(
                        { data: e.target.checked, key: "allOrg" },
                    )}
                    checked={allOrg}
                >
                    {AppConstants.allOrganisation}
                </Radio>
                <Radio
                    className="mt-3"
                    onChange={(e) => updateCommunicationModuleData(
                        { data: e.target.checked, key: "individualOrg" },
                    )}
                    checked={individualOrg}
                >
                    {`${AppConstants.individualOrganisation}(s)`}
                </Radio>
            </div>

            {individualOrg && (
                <div className="mt-3">

                    <Select
                        mode="multiple"
                        className="ml-5"
                        style={{ width: '97%', height: '44px' }}
                        placeholder={AppConstants.selectOrganisation}
                        onChange={(item, option) => {
                            const orgId = option.key;
                            updateCommunicationModuleData(
                                {
                                    dara: orgId, key: 'orgId', selectedName: option.children, subKey: 'orgName',
                                },
                            );
                        }}
                        notFoundContent={onLoadSearch === true ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={(value) => {
                            setState({ exsitingValue: value });
                            if (value && value.length > 2) {
                                getAffiliateToOrganisationAction(organisationUniqueKey, value);
                            }
                        }}
                        value={orgName || undefined}
                    >
                        {
                            state.exsitingValue
                                && affiliateToData.map((org) => (
                                    <Option key={org.organisationId} value={org.organisationId}>
                                        {org.name}
                                    </Option>
                                ))
                        }
                    </Select>

                </div>
            )}

            <InputWithHead heading={AppConstants.recipients} />

            <div
                className="mt-3"
                style={{ display: "flex", alignItems: "center" }}
            >
                <Radio
                    onChange={(e) => updateCommunicationModuleData({ data: e.target.checked, key: "allUser" })}
                    checked={allUser}
                >
                    All Users
                </Radio>
            </div>

            <div
                style={{ display: "flex", alignItems: "center" }}
            >
                <Radio
                    className="mt-3"
                    onChange={(e) => updateCommunicationModuleData({ data: e.target.checked, key: "selectedRoles" })}
                    checked={selectedRoles}
                >
                    Selected Role(s)
                </Radio>

            </div>

            <div className="col-sm">
                {selectedRoles && (
                    <Checkbox.Group>

                        {selectedRolArr.map((item) => (
                            <div>
                                <Checkbox className="single-checkbox-radio-style pt-4 ml-0" value={item.value}>
                                    {item.label}
                                </Checkbox>
                            </div>
                        ))}

                    </Checkbox.Group>
                )}
            </div>

            <div
                style={{ display: "flex", alignItems: "center" }}
            >
                <Radio
                    className="mt-3"
                    onChange={(e) => updateCommunicationModuleData({ data: e.target.checked, key: "individualUsers" })}
                    checked={individualUsers}
                >
                    Individual User(s)
                </Radio>
            </div>

            {individualUsers && (
                <div className="mt-3">
                    <Select
                        className="ml-5"
                        mode="multiple"
                        style={{ width: '97%', height: '44px' }}
                        placeholder="Select User"
                        filterOption={false}
                        onChange={(item, option) => {
                            const userId = option.value;
                            updateCommunicationModuleData({
                                data: userId, key: 'userId', selectedName: option.children, subKey: "userName",
                            });
                        }}
                        notFoundContent={onTextualLoad === true ? <Spin size="small" /> : null}
                        onSearch={(value) => {
                            setState({ userValue: value });
                            if (value && value.length > 2) {
                                userSearchApi(value);
                            }
                        }}
                        value={userName || undefined}
                    >
                        {
                            state.userValue
                                && userData.map((item) => (
                                    <Option key={item.userId} value={item.userId}>
                                        {item.name}
                                    </Option>
                                ))
                        }
                    </Select>
                </div>
            )}
        </div>
    );
};

CommunicationTargets.propTypes = {
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
    allOrg: PropTypes.bool.isRequired,
    individualOrg: PropTypes.bool.isRequired,
    individualUsers: PropTypes.array.isRequired,
    allUser: PropTypes.bool.isRequired,
    selectedRoles: PropTypes.array.isRequired,
    onTextualLoad: PropTypes.bool.isRequired,
    userDashboardTextualList: PropTypes.array.isRequired,
    userName: PropTypes.string.isRequired,
    orgName: PropTypes.string.isRequired,
    affiliateTo: PropTypes.object.isRequired,
    onLoadSearch: PropTypes.bool.isRequired,
    updateCommunicationModuleData: PropTypes.func.isRequired,
    userSearchApi: PropTypes.func.isRequired,
    getAffiliateToOrganisationAction: PropTypes.func.isRequired,
};

export default CommunicationTargets;
