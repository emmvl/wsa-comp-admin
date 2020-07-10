import React, { useCallback } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Form } from "antd";

import AppConstants from "../../themes/appConstants";
import InputWithHead from "../../customComponents/InputWithHead";

function Profile(props) {
  const personal = props.userState.personalData;
  console.log(personal);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    console.log(props);
  }, [props]);

  return (
    <div className="inside-table-view">
      <div className="profile-image-view">
        <div className="circular--landscape">
          {personal.photoUrl ? (
            <img src={personal.photoUrl} alt="" />
          ) : (
            <span className="user-contact-heading">{AppConstants.noImage}</span>
          )}
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <InputWithHead
          required="required-field"
          heading={AppConstants.firstName}
          placeholder={AppConstants.enterFirstName}
          defaultValue={personal.firstName}
        />

        <InputWithHead
          required="required-field"
          heading={AppConstants.lastName}
          placeholder={AppConstants.enterLastName}
          defaultValue={personal.lastName}
        />

        <InputWithHead
          required="required-field"
          heading={AppConstants.phoneNumber}
          placeholder={AppConstants.enterPhoneNumber}
          defaultValue={personal.mobileNumber}
        />

        <InputWithHead
          required="required-field"
          heading={AppConstants.email}
          placeholder={AppConstants.enterEmail}
          defaultValue={personal.email}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Profile));
