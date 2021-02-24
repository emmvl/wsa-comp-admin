import React from "react";
import { Form, Radio } from "antd";
import ValidationConstants from "themes/validationConstant";
import AppConstants from "themes/appConstants";
import InputWithHead from "customComponents/InputWithHead";
import Tooltip from "react-png-tooltip";

const ScoringAssignmentsFields = ({ onInputChange, values }) => {
    const isScoringEnabled = +process.env.REACT_APP_SCORING_ASSIGNMENTS_FIELDS_ENABLED === 1;

    return (
        <>
            <div className="contextualHelp-RowDirection">
                <Form.Item
                    name="scoring"
                    rules={[
                        {
                            required: true,
                            message: ValidationConstants.scoringField,
                        },
                    ]}
                >
                    <Radio.Group
                        name="scoring"
                        className="reg-competition-radio"
                        onChange={onInputChange}
                        style={{
                            overflowX: "unset",
                        }}
                        value={values.scoring}
                    >
                        <div className="row mt-0">
                            <div className="col-sm-12 d-flex align-items-center">
                                <Radio
                                    style={{
                                        marginRight: 0,
                                        paddingRight: 0,
                                    }}
                                    value="SINGLE"
                                >
                                    {AppConstants.single}
                                </Radio>
                                <div className="mt-n10 ml-n10 mt-1">
                                    <Tooltip>
                                        <span>
                                            {AppConstants.singleScoringMsg}
                                        </span>
                                    </Tooltip>
                                </div>
                            </div>

                            <div className="col-sm-12 d-flex align-items-center">
                                <Radio
                                    style={{
                                        marginRight: 0,
                                        paddingRight: 0,
                                    }}
                                    value="50_50"
                                >
                                    50/50
                                </Radio>
                                <div className="mt-n10 ml-n10 mt-1">
                                    <Tooltip>
                                        <span>
                                            {AppConstants.fiftyScoringMsg}
                                        </span>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </Radio.Group>
                </Form.Item>
            </div>

            {isScoringEnabled && (
                <>
                    <InputWithHead heading={AppConstants.whoScoring} />
                    <div className="row mt-0 ml-1">
                        <Form.Item
                            name="whoScoring"
                            rules={[
                                {
                                    required: true,
                                    message: ValidationConstants.scoringField,
                                },
                            ]}
                        >
                            <Radio.Group
                                name="whoScoring"
                                className="reg-competition-radio"
                                onChange={onInputChange}
                                style={{
                                    overflowX: "unset",
                                }}
                                value={values.whoScoring}
                            >
                                <div className="row mt-0">
                                    <div className="col-sm-12 d-flex align-items-center">
                                        <Radio
                                            style={{
                                                marginRight: 0,
                                                paddingRight: 0,
                                            }}
                                            value="MANAGERS"
                                        >
                                            {AppConstants.managersToScore}
                                        </Radio>
                                    </div>

                                    <div className="col-sm-12 d-flex align-items-center">
                                        <Radio
                                            style={{
                                                marginRight: 0,
                                                paddingRight: 0,
                                            }}
                                            value="COURT"
                                        >
                                            {AppConstants.courtToScope}
                                        </Radio>
                                    </div>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    </div>

                    <InputWithHead heading={AppConstants.acceptScores} />
                    <div className="row mt-0 ml-1">
                        <Form.Item
                            name="acceptScoring"
                            rules={[
                                {
                                    required: true,
                                    message: ValidationConstants.scoringField,
                                },
                            ]}
                        >
                            <Radio.Group
                                name="acceptScoring"
                                className="reg-competition-radio"
                                onChange={onInputChange}
                                style={{
                                    overflowX: "unset",
                                }}
                                value={values.acceptScoring}
                            >
                                <div className="row mt-0">
                                    <div className="col-sm-12 d-flex align-items-center">
                                        <Radio value="REFEREE">
                                            {AppConstants.refereeAcceptScores}
                                        </Radio>
                                    </div>

                                    <div className="col-sm-12 d-flex align-items-center">
                                        <Radio value="SCORER">
                                            {AppConstants.scorerAcceptScores}
                                        </Radio>
                                    </div>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                </>
            )}
        </>
    );
};

ScoringAssignmentsFields.defaultProps = {
    onInputChange: () => {},
    values: {},
};

export default ScoringAssignmentsFields;
