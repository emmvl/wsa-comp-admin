import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Spin } from 'antd';
import InputWithHead from "../customComponents/InputWithHead";
import { Formik } from "formik";
import * as Yup from 'yup';
import { forgotPasswordAction, clearReducerAction } from "../store/actions/authentication"
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from "../util/history";
import AppConstants from "../themes/appConstants";
import AppImages from "../themes/appImages";
import { NavLink } from "react-router-dom";
import Loader from "../customComponents/loader";
const { Header, Content } = Layout;
const loginFormSchema = Yup.object().shape({
    userName: Yup.string().min(2, 'Username must be at least 2 characters').required('Username is required'),
});
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sentEmailButton: false,
        }
        this.props.clearReducerAction("forgotPasswordSuccess")
    }


    contentView = (values, errors, setFieldValue, touched, handleChange, handleBlur) => {
        let forgotPasswordSuccess = this.props.loginstate.forgotPasswordSuccess
        return (
            <div className="content-view">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={AppImages.netballLogo1} alt="" />
                </div>
                {forgotPasswordSuccess ?
                    <div >
                        <InputWithHead heading={this.props.loginstate.forgotPasswordMessage}
                        />
                        <div className="forgotPasswordSuccess--button-div">
                            <NavLink to={{ pathname: `/login` }}>
                                <Button className="open-reg-button" type="primary"
                                >{AppConstants.returnToLogin}</Button>
                            </NavLink>
                        </div>
                    </div>
                    :
                    <div>
                        <InputWithHead heading={AppConstants.username} placeholder={AppConstants.username}
                            name={"userName"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.userName}
                        />
                        {errors.userName && touched.userName && (
                            <span className="form-err">{errors.userName}</span>
                        )}
                        <NavLink to={{ pathname: `/login` }}>
                            <span className="forgot-password-link-text">{AppConstants.returnToLogin}</span>
                        </NavLink>

                        <div className="row pt-5" >
                            <div className="col-sm" >
                                <div className="comp-finals-button-view">
                                    <Button className="open-reg-button" htmlType="submit" type="primary"
                                        disabled={this.state.sentEmailButton}>{AppConstants.sendEmail}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }


    render() {
        return (
            <div className="fluid-width"  >
                <img src={AppImages.loginImage} className="bg" />
                <Layout >
                    <Content className="container" style={{ zIndex: 15 }}>
                        <Formik
                            enableReinitialize
                            initialValues={{
                                userName: "",
                            }}
                            validationSchema={loginFormSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(false);
                                this.setState({ sentEmailButton: true })

                                if (this.props.loginstate.onLoad == false) {
                                    this.props.forgotPasswordAction(values.userName)
                                }
                                setTimeout(() => {
                                    this.setState({ sentEmailButton: false })
                                }, 1000);
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue
                            }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <div className="login-formView" style={{ zIndex: 15 }} >
                                            {this.contentView(values, errors, setFieldValue, touched, handleChange, handleBlur)}
                                        </div>
                                    </Form>
                                )}
                        </Formik>
                        <Loader visible={this.props.loginstate.onLoad} />
                    </Content>
                </Layout>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ forgotPasswordAction, clearReducerAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        loginstate: state.LoginState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((ForgotPassword));
