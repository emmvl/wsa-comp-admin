import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button, Form, message } from "antd";

import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";
import { userPasswordUpdateAction } from "../../store/actions/userAction/userAction";
import Loader from "../../customComponents/loader";
import ValidationConstants from "../../themes/validationConstant";

function Password(props) {
  const { getFieldDecorator } = props.form
  const { userState, form, userPasswordUpdateAction } = props;

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
        if (security.newPassword !== security.confirmPassword) {
          message.error('Password does not match');
          return;
        }

        userPasswordUpdateAction({
          password: security.password,
          newPassword: security.newPassword,
        });
      }
    });
  }, [security, form, userPasswordUpdateAction]);

  return (
    <div className="inside-table-view">
      <Form colon={false} onSubmit={handleSubmit}>
        <div className="fluid-width">
          <Form.Item>
            {getFieldDecorator(AppConstants.password, {
              rules: [
                {
                  min: 8,
                  message: ValidationConstants.passwordVerification
                }
              ]
            })(
              <InputWithHead
                required="required-field"
                heading={AppConstants.currentPassword}
                type="password"
                name="password"
                min={8}
                placeholder={AppConstants.enterCurrentPassword}
                value={security.password}
                onChange={onChangeField}
              />
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator(AppConstants.newPassword, {
              rules: [
                {
                  min: 8,
                  message: ValidationConstants.passwordVerification
                }
              ]
            })(
              <InputWithHead
                required="required-field"
                heading={AppConstants.newPassword}
                type="password"
                name="newPassword"
                min={8}
                placeholder={AppConstants.enterNewPassword}
                value={security.newPassword}
                onChange={onChangeField}
              />
            )}
          </Form.Item>

          <Form.Item>
            {getFieldDecorator(AppConstants.confirmPassword, {
              rules: [
                {
                  min: 8,
                  message: ValidationConstants.passwordVerification
                }
              ]
            })(
              <InputWithHead
                required="required-field"
                heading={AppConstants.confirmPassword}
                type="password"
                name="confirmPassword"
                min={8}
                placeholder={AppConstants.enterConfirmPassword}
                value={security.confirmPassword}
                onChange={onChangeField}
              />
            )}
          </Form.Item>

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

      <Loader visible={userState.userPasswordUpdate} />
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    userPasswordUpdateAction,
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    appState: state.AppState,
    userState: state.UserState,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Password));
