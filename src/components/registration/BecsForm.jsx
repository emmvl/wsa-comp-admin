import React from "react";
import { AuBankAccountElement } from "@stripe/react-stripe-js";
import "./BecsFormStyles.css";
import { Button, Card } from 'antd';
import { useHistory } from "react-router-dom";

// Custom styling can be passed as options when creating an Element.
const AU_BANK_ACCOUNT_STYLE = {
    base: {
        color: "#32325d",
        fontSize: "16px",
        "::placeholder": {
            color: "#aab7c4",
        },
        ":-webkit-autofill": {
            color: "#32325d",
        },
    },
    invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
        ":-webkit-autofill": {
            color: "#fa755a",
        },
    },
};

const AU_BANK_ACCOUNT_ELEMENT_OPTIONS = {
    style: AU_BANK_ACCOUNT_STYLE,
    disabled: false,
    hideIcon: false,
    iconStyle: "default", // or "solid"
};

export default function BecsForm({ onSubmit, disabled }) {
    const history = useHistory();
    return (
        <form onSubmit={onSubmit}>
            <Card>
                <div>
                    <label className="w-100">
                        Bank Account
                        <AuBankAccountElement
                            options={AU_BANK_ACCOUNT_ELEMENT_OPTIONS}
                        />
                    </label>
                    <p>By providing your bank account details and confirming this payment, you agree to this Direct Debit Request and the Direct Debit Request service agreement, and authorise Stripe Payments Australia Pty Ltd ACN 160 180 343 Direct Debit User ID number 507156 (“Stripe”) to debit your account through the Bulk Electronic Clearing System (BECS) on behalf of Word Sport Action Pty Ltd (the “Merchant”) for any amounts separately communicated to you by the Merchant. You certify that you are either an account holder or an authorised signatory on the account listed above.</p>
                </div>
            </Card>
                <div className="d-flex justify-content-between mt-5">
                    <Button onClick={() => history.push("/registrationPayments")}>Cancel</Button>
                    <Button type="primary" htmlType="submit" disabled={disabled}>
                        Save
                    </Button>
                </div>
        </form>
    );
}
