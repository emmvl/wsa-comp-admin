import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Select, Form, Modal, message } from "antd";
import "./user.css";
import InputWithHead from "../../customComponents/InputWithHead";
import InnerHorizontalMenu from "../../pages/innerHorizontalMenu";
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";
import { NavLink } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { bindActionCreators } from "redux";
import history from "../../util/history";
import { connect } from "react-redux";
import {
  getAffiliateToOrganisationAction,
  saveAffiliateAction,
  updateNewAffiliateAction,
  getUreAction,
  getRoleAction,
} from "../../store/actions/userAction/userAction";
import ValidationConstants from "../../themes/validationConstant";
import { getCommonRefData } from "../../store/actions/commonAction/commonAction";
import { getUserId, getOrganisationData } from "../../util/sessionStorage";
import Loader from "../../customComponents/loader";
import Tooltip from "react-png-tooltip";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const phoneRegExp = /^((\\+[1,9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const userAddAffiliatesSchema = Yup.object().shape({
  name: Yup.string().required("Name is Required"),
  phone: Yup.string()
    .matches(phoneRegExp, "Please Enter Valid Phone Number")
    .required("Phone Number is Required"),
  address: Yup.string().required("Address is Required"),
});

class UserAddAffiliates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organisationId: getOrganisationData().organisationUniqueKey,
      loggedInuserOrgTypeRefId: 0,
      loading: false,
      buttonPressed: "",
      deleteModalVisible: false,
      currentIndex: 0,
      organisationName: "",
      whatIsTheLowestOrgThatCanAddChild: 0,
    };
    this.props.getCommonRefData();
    //this.props.getUreAction();
    this.referenceCalls(this.state.organisationId);
    this.props.getRoleAction();
    this.clearContact();
    this.addContact();
  }

  componentDidMount() {
    console.log("Component Did mount");
  }
  componentDidUpdate(nextProps) {
    console.log("Component componentDidUpdate");
    let userState = this.props.userState;
    let affiliateTo = this.props.userState.affiliateTo;
    if (userState.onLoad === false && this.state.loading === true) {
      if (!userState.error) {
        this.setState({
          loading: false,
        });
      }

      if (userState.status == 1 && this.state.buttonPressed == "save") {
        history.push("/userAffiliatesList");
      }
    }
    if (this.state.buttonPressed == "cancel") {
      history.push("/userAffiliatesList");
    }

    if (nextProps.userState.affiliateTo != affiliateTo) {
      if (userState.affiliateToOnLoad == false) {
        if (
          affiliateTo.organisationName != "" &&
          affiliateTo.organisationTypeRefId != 0
        ) {
          this.setState({
            loggedInuserOrgTypeRefId: affiliateTo.organisationTypeRefId,
            organisationName: affiliateTo.organisationName,
            whatIsTheLowestOrgThatCanAddChild:
              affiliateTo.whatIsTheLowestOrgThatCanAddChild,
          });

          console.log("affiliateTo::" + JSON.stringify(affiliateTo));
        }
      }
    }
  }

  referenceCalls = (organisationId) => {
    this.props.getAffiliateToOrganisationAction(organisationId);
  };

  onChangeSetValue = (val, key) => {
    if (key === AppConstants.organisationTypeRefId) {
      if (
        !(
          (this.state.loggedInuserOrgTypeRefId == 1 &&
            (val == 3 || val == 4)) ||
          (this.state.loggedInuserOrgTypeRefId == 2 && val == 4)
        )
      ) {
        this.props.updateNewAffiliateAction(
          val,
          AppConstants.affiliatedToOrgId
        );

        let orgVal = this.state.organisationId;
        let name = getOrganisationData().name;
        this.props.updateNewAffiliateAction(
          orgVal,
          AppConstants.affiliatedToOrgId
        );
        this.props.updateNewAffiliateAction(name, "affiliatedToOrgName");
      } else {
        this.props.updateNewAffiliateAction(
          null,
          AppConstants.affiliatedToOrgId
        );
        this.props.updateNewAffiliateAction(null, "affiliatedToOrgName");
        this.props.form.setFieldsValue({
          affiliatedToOrgId: null,
        });
      }
    }
    this.props.updateNewAffiliateAction(val, key);
  };

  clearContact = () => {
    let contacts = [];
    this.props.updateNewAffiliateAction(contacts, "contacts");
  };
  addContact = () => {
    let affiliate = this.props.userState.affiliate.affiliate;
    let contacts = affiliate.contacts;
    let obj = {
      userId: 0,
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      permissions: [],
    };
    contacts.push(obj);
    this.props.updateNewAffiliateAction(contacts, "contacts");
  };

  deleteContact = (index) => {
    this.setState({ deleteModalVisible: true, currentIndex: index });
  };

  removeModalHandle = (key) => {
    if (key == "ok") {
      console.log("Index::" + this.state.currentIndex);
      this.removeContact(this.state.currentIndex);
      this.setState({ deleteModalVisible: false });
    } else {
      this.setState({ deleteModalVisible: false });
    }
  };

  removeContact = (index) => {
    let affiliate = this.props.userState.affiliate.affiliate;
    let contacts = affiliate.contacts;
    contacts.splice(index, 1);
    this.props.updateNewAffiliateAction(contacts, "contacts");
  };

  onChangeContactSetValue = (val, key, index) => {
    let contacts = this.props.userState.affiliate.affiliate.contacts;
    let contact = contacts[index];
    if (key == "roles") {
      let permissions = [];
      let obj = {
        userRoleEntityId: 0,
        roleId: val,
      };
      permissions.push(obj);
      contact.permissions = permissions;
    } else {
      contact[key] = val;
    }

    this.props.updateNewAffiliateAction(contacts, "contacts");
  };

  saveAffiliate = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("err::" + err);
      if (!err) {
        let affiliate = this.props.userState.affiliate.affiliate;
        if (
          affiliate.contacts == null ||
          affiliate.contacts == undefined ||
          affiliate.contacts.length == 0
        ) {
          message.error(ValidationConstants.affiliateContactRequired[0]);
        } else {
          let data = affiliate.contacts.find((x) =>
            x.permissions.find((y) => y.roleId == 2)
          );
          if (data == undefined || data == null || data == "") {
            message.error(ValidationConstants.affiliateContactRequired[0]);
          } else {
            let affiliateToOrgId = affiliate.affiliatedToOrgId;
            let contacts = JSON.stringify(affiliate.contacts);
            let formData = new FormData();
            if (affiliateToOrgId == 0) {
              affiliate.affiliatedToOrgId = this.state.organisationId;
              affiliate.organisationId = this.state.organisationId;
            }
            affiliate.whatIsTheLowestOrgThatCanAddChild = this.state.whatIsTheLowestOrgThatCanAddChild;
            formData.append("organisationLogo", null);
            formData.append("affiliateId", affiliate.affiliateId);
            formData.append("affiliateOrgId", affiliate.affiliateOrgId);
            formData.append(
              "organisationTypeRefId",
              affiliate.organisationTypeRefId
            );
            formData.append("affiliatedToOrgId", affiliate.affiliatedToOrgId);
            formData.append(
              "organisationId",
              getOrganisationData().organisationUniqueKey
            );
            formData.append("name", affiliate.name);
            formData.append("street1", affiliate.street1);
            formData.append("street2", affiliate.street2);
            formData.append("suburb", affiliate.suburb);
            formData.append("phoneNo", affiliate.phoneNo);
            formData.append("city", affiliate.city);
            formData.append("postalCode", affiliate.postalCode);
            formData.append("stateRefId", affiliate.stateRefId);
            formData.append(
              "whatIsTheLowestOrgThatCanAddChild",
              affiliate.whatIsTheLowestOrgThatCanAddChild
            );
            formData.append("contacts", contacts);
            console.log("Req Body ::" + JSON.stringify(affiliate));
            this.setState({ loading: true });
            this.props.saveAffiliateAction(formData);
          }
        }
      } else {
        message.error(ValidationConstants.requiredMessage);
      }
    });
  };

  ///////view for breadcrumb
  headerView = () => {
    return (
      <div className="header-view">
        <Header
          className="form-header-view"
          style={{
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Breadcrumb separator=" > ">
            <NavLink to="/userAffiliatesList">
              <Breadcrumb.Item separator=">" className="breadcrumb-product">
                {AppConstants.affiliates}
              </Breadcrumb.Item>
            </NavLink>
            {/* <Breadcrumb.Item className="breadcrumb-product">{AppConstants.user}</Breadcrumb.Item> */}
            <Breadcrumb.Item className="breadcrumb-add">
              {AppConstants.add}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Header>
      </div>
    );
  };

  ////////form content view
  contentView = (getFieldDecorator) => {
    let affiliateToData = this.props.userState.affiliateTo;
    let affiliate = this.props.userState.affiliate.affiliate;
    const { stateList } = this.props.commonReducerState;
    if (affiliate.organisationTypeRefId === 0) {
      if (
        affiliateToData.organisationTypes != undefined &&
        affiliateToData.organisationTypes.length > 0
      )
        affiliate.organisationTypeRefId =
          affiliateToData.organisationTypes[0].id;
    }
    console.log("affiliateaffiliate::" + JSON.stringify(affiliate));
    return (
      <div className="content-view pt-4">
        <InputWithHead
          heading={AppConstants.organisationType}
          conceptulHelp
          conceptulHelpMsg={AppConstants.orgTypeMsg}
          marginTop={5}
        />
        <Select
          style={{ width: "100%", paddingRight: 1 }}
          onChange={(e) =>
            this.onChangeSetValue(e, AppConstants.organisationTypeRefId)
          }
          value={affiliate.organisationTypeRefId}
        >
          {(affiliateToData.organisationTypes || []).map((org, index) => (
            <Option key={org.id} value={org.id}>
              {org.name}
            </Option>
          ))}
        </Select>
        {!(
          (this.state.loggedInuserOrgTypeRefId == 1 &&
            (affiliate.organisationTypeRefId == 3 ||
              affiliate.organisationTypeRefId == 4)) ||
          (this.state.loggedInuserOrgTypeRefId == 2 &&
            affiliate.organisationTypeRefId == 4)
        ) ? (
          <div className="row mt-3">
            <div className="col-sm">
              <InputWithHead heading={AppConstants.affilatedTo} />
            </div>
            <div
              className="col-sm"
              style={{ display: "flex", alignItems: "center" }}
            >
              <InputWithHead
                auto_Complete="new-organisationName"
                heading={affiliateToData.organisationName}
                onChange={(e) =>
                  this.onChangeSetValue(e, AppConstants.organisationTypeRefId)
                }
              />
            </div>
          </div>
        ) : (
          <div>
            <InputWithHead
              heading={AppConstants.affilatedTo}
              required={"required-field"}
            />
            <Form.Item>
              {getFieldDecorator("affiliatedToOrgId", {
                rules: [
                  {
                    required: true,
                    message: ValidationConstants.affiliateToRequired,
                  },
                ],
              })(
                <Select
                  style={{ width: "100%", paddingRight: 1 }}
                  onChange={(e) =>
                    this.onChangeSetValue(e, AppConstants.affiliatedToOrgId)
                  }
                >
                  {(affiliateToData.affiliatedTo || [])
                    .filter(
                      (x) =>
                        x.organisationtypeRefId ==
                        affiliate.organisationTypeRefId - 1
                    )
                    .map((aff, index) => (
                      <Option
                        key={aff.organisationId}
                        value={aff.organisationId}
                      >
                        {aff.name}
                      </Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          </div>
        )}
        <Form.Item>
          {getFieldDecorator("name", {
            rules: [
              { required: true, message: ValidationConstants.nameField[2] },
            ],
          })(
            <InputWithHead
              auto_Complete="new-name"
              required={"required-field pt-0 pb-0"}
              heading={AppConstants.name}
              placeholder={AppConstants.name}
              onChange={(e) => this.onChangeSetValue(e.target.value, "name")}
              //value={affiliate.name}
              setFieldsValue={affiliate.name}
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("addressOne", {
            rules: [
              { required: true, message: ValidationConstants.addressField[2] },
            ],
          })(
            <InputWithHead
              required={"required-field pt-0 pb-0"}
              auto_Complete="new-address"
              heading={AppConstants.addressOne}
              placeholder={AppConstants.addressOne}
              name={AppConstants.addressOne}
              onChange={(e) => this.onChangeSetValue(e.target.value, "street1")}
              //value={affiliate.street1}
              setFieldsValue={affiliate.street1}
            />
          )}
        </Form.Item>

        <InputWithHead
          auto_Complete="new-addressTwo"
          heading={AppConstants.addressTwo}
          placeholder={AppConstants.addressTwo}
          onChange={(e) => this.onChangeSetValue(e.target.value, "street2")}
          value={affiliate.street2}
        />

        <Form.Item>
          {getFieldDecorator("suburb", {
            rules: [
              { required: true, message: ValidationConstants.suburbField[0] },
            ],
          })(
            <InputWithHead
              auto_Complete="new-suburb"
              required={"required-field pt-3 pb-0"}
              heading={AppConstants.suburb}
              placeholder={AppConstants.suburb}
              onChange={(e) => this.onChangeSetValue(e.target.value, "suburb")}
              //value={affiliate.suburb}
              setFieldsValue={affiliate.suburb}
            />
          )}
        </Form.Item>

        <InputWithHead
          required={"required-field"}
          heading={AppConstants.stateHeading}
        />

        <Form.Item>
          {getFieldDecorator("stateRefId", {
            rules: [
              { required: true, message: ValidationConstants.stateField[0] },
            ],
          })(
            <Select
              style={{ width: "100%" }}
              placeholder={AppConstants.select}
              onChange={(e) => this.onChangeSetValue(e, "stateRefId")}
              //value={affiliate.stateRefId}
              setFieldsValue={affiliate.stateRefId}
            >
              {stateList.length > 0 &&
                stateList.map((item) => (
                  <Option value={item.id}> {item.name}</Option>
                ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator("postcode", {
            rules: [
              { required: true, message: ValidationConstants.postCodeField[0] },
            ],
          })(
            <InputWithHead
              auto_Complete="new-postCode"
              required={"required-field"}
              heading={AppConstants.postcode}
              placeholder={AppConstants.postcode}
              onChange={(e) =>
                this.onChangeSetValue(e.target.value, "postalCode")
              }
              //value={affiliate.postalCode}
              setFieldsValue={affiliate.postalCode}
              maxLength={4}
            />
          )}
        </Form.Item>

        <InputWithHead
          heading={AppConstants.phoneNumber}
          placeholder={AppConstants.phoneNumber}
          onChange={(e) => this.onChangeSetValue(e.target.value, "phoneNo")}
          value={affiliate.phoneNo}
          auto_Complete="new-phoneNumber"
        />
      </div>
    );
  };

  contacts = (getFieldDecorator) => {
    let userState = this.props.userState;
    let affiliate = this.props.userState.affiliate.affiliate;
    let roles = this.props.userState.roles.filter(
      (x) => x.applicableToWeb == 1
    );
    console.log("Roles::" + JSON.stringify(roles));
    return (
      <div className="discount-view pt-5">
        <span className="form-heading">{AppConstants.contacts}</span>
        {(affiliate.contacts || []).map((item, index) => (
          <div
            className="prod-reg-inside-container-view pt-4"
            key={"Contact" + (index + 1)}
          >
            <div className="row">
              <div className="col-sm">
                <span className="user-contact-heading">
                  {AppConstants.contact + (index + 1)}
                </span>
              </div>
              <div
                className="transfer-image-view pointer"
                onClick={() => this.deleteContact(index)}
              >
                <span class="user-remove-btn">
                  <i class="fa fa-trash-o" aria-hidden="true"></i>
                </span>
                <span className="user-remove-text">{AppConstants.remove}</span>
              </div>
            </div>

            <Form.Item>
              {getFieldDecorator(`firstName${index}`, {
                rules: [
                  { required: true, message: ValidationConstants.nameField[0] },
                ],
              })(
                <InputWithHead
                  auto_Complete="new-firstName"
                  required={"required-field pt-0 pb-0"}
                  heading={AppConstants.firstName}
                  placeholder={AppConstants.firstName}
                  onChange={(e) =>
                    this.onChangeContactSetValue(
                      e.target.value,
                      "firstName",
                      index
                    )
                  }
                  //value={item.firstName}
                  setFieldsValue={item.firstName}
                />
              )}
            </Form.Item>

            <InputWithHead
              heading={AppConstants.middleName}
              placeholder={AppConstants.middleName}
              onChange={(e) =>
                this.onChangeContactSetValue(
                  e.target.value,
                  "middleName",
                  index
                )
              }
              value={item.middleName}
              auto_Complete="new-middleName"
            />

            <Form.Item>
              {getFieldDecorator(`lastName${index}`, {
                rules: [
                  { required: true, message: ValidationConstants.nameField[1] },
                ],
              })(
                <InputWithHead
                  required={"required-field pt-0 pb-0"}
                  heading={AppConstants.lastName}
                  placeholder={AppConstants.lastName}
                  onChange={(e) =>
                    this.onChangeContactSetValue(
                      e.target.value,
                      "lastName",
                      index
                    )
                  }
                  setFieldsValue={item.lastName}
                  auto_Complete="new-lastName"
                />
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator(`email${index}`, {
                rules: [
                  {
                    required: true,
                    message: ValidationConstants.emailField[0],
                  },
                  {
                    type: "email",
                    pattern: new RegExp(AppConstants.emailExp),
                    message: ValidationConstants.email_validation,
                  },
                ],
              })(
                <InputWithHead
                  auto_Complete="new-email"
                  required={"required-field pt-0 pb-0"}
                  heading={AppConstants.email}
                  placeholder={AppConstants.email}
                  onChange={(e) =>
                    this.onChangeContactSetValue(e.target.value, "email", index)
                  }
                  //value={item.email}
                  setFieldsValue={item.email}
                />
              )}
            </Form.Item>

            <InputWithHead
              heading={AppConstants.phoneNumber}
              placeholder={AppConstants.phoneNumber}
              onChange={(e) =>
                this.onChangeContactSetValue(
                  e.target.value,
                  "mobileNumber",
                  index
                )
              }
              value={item.mobileNumber}
              auto_Complete="new-phoneNumber"
            />

            <InputWithHead
              heading={AppConstants.permissionLevel}
              conceptulHelp
              conceptulHelpMsg={AppConstants.addAfiliatePermisionLevelMsg}
              marginTop={5}
            />
            <Form.Item>
              {getFieldDecorator(`permissions${index}`, {
                rules: [
                  {
                    required: true,
                    message: ValidationConstants.rolesField[0],
                  },
                ],
              })(
                <Select
                  style={{ width: "100%", paddingRight: 1 }}
                  onChange={(e) =>
                    this.onChangeContactSetValue(e, "roles", index)
                  }
                  setFieldsValue={item.roleId}
                >
                  {(roles || []).map((role, index) => (
                    <Option key={role.id} value={role.id}>
                      {role.description}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </div>
        ))}
        {this.deleteConfirmModalView()}
        <div
          className="transfer-image-view mt-2 pointer"
          onClick={() => this.addContact()}
        >
          <span className="user-remove-text">+ {AppConstants.addContact}</span>
        </div>
        {userState.error && userState.status == 4 ? (
          <div style={{ color: "red" }}>
            {userState.error.result.data.message}
          </div>
        ) : null}
      </div>
    );
  };

  deleteConfirmModalView = () => {
    return (
      <div>
        <Modal
          title="Affiliate"
          visible={this.state.deleteModalVisible}
          onOk={() => this.removeModalHandle("ok")}
          onCancel={() => this.removeModalHandle("cancel")}
        >
          <p>Are you sure you want to remove the contact?.</p>
        </Modal>
      </div>
    );
  };

  ///footer view containing all the buttons like submit and cancel
  footerView = (isSubmitting) => {
    return (
      <div className="fluid-width">
        <div className="footer-view">
          <div className="row">
            <div className="col-sm">
              <div className="reg-add-save-button">
                <Button
                  type="cancel-button"
                  onClick={() => this.setState({ buttonPressed: "cancel" })}
                >
                  {AppConstants.cancel}
                </Button>
              </div>
            </div>
            <div className="col-sm">
              <div className="comp-buttons-view">
                <Button
                  className="user-approval-button"
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitting}
                  onClick={() => this.setState({ buttonPressed: "save" })}
                >
                  {AppConstants.addAffiliates}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    let userState = this.props.userState;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }}>
        <DashboardLayout
          menuHeading={AppConstants.user}
          menuName={AppConstants.user}
        />
        <InnerHorizontalMenu menu={"user"} userSelectedKey={"2"} />
        <Layout>
          {this.headerView()}
          <Form
            autoComplete="off"
            onSubmit={this.saveAffiliate}
            noValidate="noValidate"
          >
            <Content>
              <div className="formView">
                {this.contentView(getFieldDecorator)}
              </div>
              <div className="formView">{this.contacts(getFieldDecorator)}</div>
              <Loader visible={userState.onLoad} />
            </Content>
            <Footer>{this.footerView()}</Footer>
          </Form>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getAffiliateToOrganisationAction,
      saveAffiliateAction,
      updateNewAffiliateAction,
      getCommonRefData,
      getUreAction,
      getRoleAction,
    },
    dispatch
  );
}

function mapStatetoProps(state) {
  return {
    userState: state.UserState,
    appState: state.AppState,
    commonReducerState: state.CommonReducerState,
  };
}
export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Form.create()(UserAddAffiliates));
