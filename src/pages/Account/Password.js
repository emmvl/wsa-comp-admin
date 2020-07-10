import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Form } from "antd";

import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";

function Password(props) {
  const { form } = props;
  
  const [security, setSecurity] = useState({});

  const onChangeField = useCallback((e) => {
    setSecurity({
      ...security,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  }, [security, setSecurity]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    form.validateFields((err) => {
      if (!err) {
        console.log(security);
      }
    });
  }, [security, form]);

  return (
    <div className="inside-table-view">
      <Form colon={false} onSubmit={handleSubmit}>
        <div className="fluid-width">
          <InputWithHead
            required="required-field"
            heading={AppConstants.currentPassword}
            type="password"
            name="password"
            placeholder={AppConstants.enterCurrentPassword}
            value={security.password}
            onChange={onChangeField}
          />

          <InputWithHead
            required="required-field"
            heading={AppConstants.newPassword}
            type="password"
            name="newPassword"
            placeholder={AppConstants.enterNewPassword}
            value={security.newPassword}
            onChange={onChangeField}
          />

          <InputWithHead
            required="required-field"
            heading={AppConstants.confirmPassword}
            type="password"
            name="confirmPassword"
            placeholder={AppConstants.enterConfirmPassword}
            value={security.confirmPassword}
            onChange={onChangeField}
          />

          <div className="d-flex justify-content-end mt-4">
            <Button
              className="publish-button"
              type="primary"
              htmlType="submit"
              style={{ height: 48, width: 92.5 }}
            >
              {AppConstants.save}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    appState: state.AppState,
    userState: state.UserState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Password));
