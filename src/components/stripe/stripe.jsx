import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    CardElement,
    Elements,
    useElements,
    useStripe
} from '@stripe/react-stripe-js';
import './stripe.css';
import {
    Button,
    Layout,
    Breadcrumb
} from "antd";
import AppConstants from "../../themes/appConstants";
import DashboardLayout from "../../pages/dashboardLayout";
import StripeKeys from "./stripeKeys";

const { Header, Content } = Layout;
// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
};

///////view for breadcrumb
const headerView = () => {
    return (
        <Header className="login-header-view" >
            <div className="row" >
                <div className="col-sm" style={{ display: "flex", alignContent: "center" }} >
                    <Breadcrumb style={{
                        display: 'flex', lignItems: 'center', alignSelf: 'center'
                    }} separator=" > ">
                        <Breadcrumb.Item className="breadcrumb-add">{AppConstants.payment}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>
        </Header >
    )
}

//////footer view containing all the buttons
const footerView = () => {
    return (
        <div className="container" >
            <div className="login-footer-view">
                <div className="row" >
                    <div className="col-sm" >
                        <div className="comp-finals-button-view">
                            <Button
                                className="open-reg-button"
                                htmlType="submit"
                                type="primary"
                                form='my-form'
                            >
                                {AppConstants.submitPayment}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

const CheckoutForm = () => {
    const [error, setError] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    // Handle real-time validation errors from the card Element.
    const handleChange = (event) => {
        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
        }
    }

    // Handle form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        const card = elements.getElement(CardElement);
        const result = await stripe.createToken(card)
        if (result.error) {
            // Inform the user if there was an error.
            setError(result.error.message);
        } else {
            setError(null);
            // Send the token to your server.
            stripeTokenHandler(result.token);
        }
    };

    return (
        <div className="content-view">
            <form id='my-form' className="form" onSubmit={handleSubmit} >
                <label className='home-dash-left-text' for="card-element">
                    Credit or debit card
                 </label>
                <div className="pt-5">
                    <CardElement
                        id="card-element"
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={handleChange}
                        className='StripeElement'
                    />
                    <div className="card-errors" role="alert">{error}</div>
                </div>
            </form>
        </div>
    );
}

// Setup Stripe.js and the Elements provider
const stripePromise = loadStripe(StripeKeys.publicKey);

const Stripe = () => {
    return (
        <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
            <DashboardLayout
                menuHeading={""}
                menuName={""}
            />
            <Layout >
                <Content className="container">
                    {headerView()}
                    <div className="login-formView">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    </div>
                    {footerView()}
                </Content>
            </Layout>
        </div>
    );
}

// POST the token ID to your backend.
async function stripeTokenHandler(token) {
    const response = await fetch('/charge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token.id })
    });

    return response.json();
}
export default Stripe