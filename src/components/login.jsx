import React, { Component } from "react";
import { Layout, Breadcrumb, Button, Form, Spin } from 'antd';
import InputWithHead from "../customComponents/InputWithHead";
import { Formik } from "formik";
import * as Yup from 'yup';
import { loginAction } from "../store/actions/authentication"
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
    password: Yup.string().min(5, 'Too Short!').required('Password is required')
});
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginButton: false,

        }
    }

    componentDidMount() {
        if (localStorage.token != null) {
            history.push("/")
        }
    }

    contentView = (values, errors, setFieldValue, touched, handleChange, handleBlur) => {
        return (
            <div className="content-view">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={AppImages.netballLogo1} alt="" />
                </div>
                <InputWithHead heading={AppConstants.username} placeholder={AppConstants.username}
                    name={"userName"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.userName}
                />
                {errors.userName && touched.userName && (
                    <span className="form-err">{errors.userName}</span>
                )}
                <InputWithHead heading={AppConstants.password} placeholder={AppConstants.password}
                    name={"password"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type={"password"}
                    value={values.password}
                />
                {errors.password && touched.password && (
                    <span className="form-err">{errors.password}</span>
                )}
                <NavLink to={{ pathname: `/forgotPassword`, state: { email: values.userName } }}>
                    <span className="forgot-password-link-text">{AppConstants.forgotResetPassword}</span>
                </NavLink>
                <div className="row pt-5" >
                    <div className="col-sm" >
                        <div className="comp-finals-button-view">
                            <Button className="open-reg-button" htmlType="submit" type="primary" disabled={this.state.loginButton}>{AppConstants.login}</Button>
                        </div>
                    </div>
                </div>
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
                                password: "",
                            }}
                            validationSchema={loginFormSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                setSubmitting(false);
                                this.setState({ loginButton: true })

                                if (this.props.loginstate.onLoad == false) {
                                    this.props.loginAction(values)
                                }
                                setTimeout(() => {
                                    this.setState({ loginButton: false })
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
    return bindActionCreators({ loginAction }, dispatch)
}

function mapStatetoProps(state) {
    return {
        loginstate: state.LoginState
    }
}
export default connect(mapStatetoProps, mapDispatchToProps)((Login));
