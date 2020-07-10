import React, { Component } from "react";
import { Layout, Breadcrumb, Input, Select, Checkbox, Tree, DatePicker, Button, Table } from 'antd';
import './product.scss';
import { NavLink } from 'react-router-dom';
import DashboardLayout from "../../pages/dashboardLayout";
import AppConstants from "../../themes/appConstants";

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const columns = [
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: category => <Input className="input-inside-table-fees" value={category} />,
    },
    {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        render: division => <Input className="input-inside-table-fees" value={division} />,
    },
    {
        title: 'Club',
        dataIndex: 'club',
        key: 'club',
        render: club => <Input className="input-inside-table-fees" value={club} />,
    },
    {
        title: 'Association',
        dataIndex: 'association',
        key: 'association',
        render: association => <Input className="input-inside-table-fees" value={association} />,
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state',
        render: state => <Input className="input-inside-table-fees" value={state} />,
    },
    {
        title: 'National',
        dataIndex: 'national',
        key: 'national',
        render: national => <Input className="input-inside-table-fees" value={national} />,
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
    },

];

const data = [
    {
        key: '1',
        category: 'Junior',
        division: "10,11,12",
        club: "$20.00",
        association: '$60.00',
        state: "$40.00",
        national: "$50.00",
        total: "$170"
    },
    {
        key: '2',
        category: 'Net Set Go',
        division: '8,9',
        club: "$20.00",
        association: '$60.00',
        state: "$40.00",
        national: "$50.00",
        total: "$170"
    },

];

class ProductAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productType: "recurring",
            discountType: "applyToClubFeesOnly",
            feesType: "differentiateBy1&2Registration",
        }
    }


    onChange(checkedValues) {
        console.log('checked = ', checkedValues);
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    };




    ///////view for breadcrumb
    headerView = () => {
        return (
            <div className="header-view">
                <Header className="form-header-view" style={{
                    backgroundColor: 'transparent', display: 'flex',
                    alignItems: 'center'
                }}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item className="breadcrumb-product">Products</Breadcrumb.Item>
                        <Breadcrumb.Item className="breadcrumb-add">Add</Breadcrumb.Item>
                    </Breadcrumb>

                </Header>
                <div className="registration-product-view">
                    {/* <NavLink className="text-decoration-none" to={`/productRegistration`}> */}
                    <Button >
                        Registration Products
                    </Button>
                    {/* </NavLink> */}
                </div>
            </div>
        )
    }


    ////////form content view
    contentView = () => {
        const registrationVia = ['Application', 'Website', 'Other'];
        const registrationDetail1 = [
            {
                title: 'Registration Details Required',
                children: [
                    {
                        title: 'Parent Details', children: [
                            { title: 'First Name', children: [] },
                            { title: 'Last Name', children: [] },
                            { title: 'Email', children: [] },
                            { title: 'Phone', children: [] }
                        ]
                    },
                    { title: 'Medical History', children: [] },
                    { title: 'Medicare Number', children: [] },
                    { title: 'Private Insurance Provider & Number', children: [] },
                    { title: 'Other', children: [] },
                ]
            }
        ]
        return (

            <div className="content-view pt-5">
                <span className='form-heading'>Product Details</span>
                {/* <span className="required-field">*</span> */}
                <span className='input-heading'>Name</span>
                <Input className="input" placeholder="Name" />

                <span className='input-heading'>Type</span>
                <Select
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={(productType) => this.setState({ productType })}
                    value={this.state.productType}
                >
                    <Option value={"recurring"}>Recurring</Option>
                </Select>

                <span className='input-heading'>Description</span>
                <Input className="input" placeholder="Description" />

                <span className='applicable-to-heading'>Allow Registration Via</span>
                <Checkbox.Group style={{ display: "-ms-flexbox", flexDirection: 'column', justifyContent: 'center' }} options={registrationVia} defaultValue={['Application', 'Website']} onChange={(e) => this.onChange(e)} />

                <span className='input-heading'>Contact Name</span>
                <Input className="input" placeholder="Contact Name" />

                <span className='input-heading'>Contact Email</span>
                <Input className="input" placeholder="Contact Email" />

                <div className="inside-container-view">

                    <Tree className="tree-government-rebate" checkable
                        defaultExpandedKeys={['0',]}
                        defaultCheckedKeys={['0-0', '0-1', '0-2', '0-3']}>
                        {this.ShowRegistrationDetailTree(registrationDetail1)}
                    </Tree>

                </div>




            </div>


        )
    }


    ShowRegistrationDetailTree = tree => {
        const { TreeNode } = Tree;
        return tree.map((item, catIndex) => {
            return (
                <TreeNode title={this.registrationDetailNode(item)} key={catIndex} defaultCheckedKeys={"Government Rebate"}>
                    {this.showSubRegistrationDetailNode(item, catIndex)}
                </TreeNode>
            );
        });
    };

    registrationDetailNode = item => {
        return (
            <span >
                {item.title}
            </span>
        );
    };

    showSubRegistrationDetailNode(item, catIndex) {
        const { TreeNode } = Tree;
        return (
            item.children.map((inItem, scatIndex) => {
                return (
                    <TreeNode
                        title={this.makeSubRegistrationDetailNode(inItem)}
                        key={`${catIndex}-${scatIndex}`}
                    >
                        {this.showParentDetailRequiredNode(inItem, catIndex, scatIndex)}
                    </TreeNode>
                );
            })
        );
    }
    makeSubRegistrationDetailNode(item) {
        return (
            <span >
                {item.title}
            </span>
        );
    }

    showParentDetailRequiredNode(item, catIndex, scatIndex) {
        const { TreeNode } = Tree;
        return (
            item.children.map((parentItem, parentIndex) => {
                return (
                    <TreeNode
                        title={this.makeParentDetailRequiredNode(parentItem)}
                        key={`${catIndex}-${scatIndex}-${parentIndex}`}
                    >
                    </TreeNode>
                );
            })
        );
    }

    makeParentDetailRequiredNode(parentItem) {
        return (
            <span >
                {parentItem.title}
            </span>
        );
    }


    ///////payment view inside the content
    paymentView = () => {
        const paymentTypes = ['Credit/Debit Card', 'Direct Debit', 'Cash', 'Zip Pay'];
        return (
            <div className="payment-view pt-5">
                <span className='form-heading'>Payment Settings</span>
                <Checkbox.Group style={{ display: "-ms-flexbox", flexDirection: 'column', justifyContent: 'center' }} options={paymentTypes}
                    defaultValue={['Credit/Debit Card', 'Direct Debit', 'Cash']} onChange={(e) => this.onChange(e)} />
                <div className="fluid-width" >
                    <div className="row" >
                        <div className="col-sm" >
                            <span className='input-heading'>Tax Description</span>
                            <Input className="input" placeholder="Tax Description" />
                        </div>
                        <div className="col-sm">
                            <span className='input-heading'>Tax %</span>
                            <Input className="input" placeholder="Tax %" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    ////fees view inside the content
    feesView = () => {
        return (
            <div className="fees-view pt-5">
                <span className='form-heading'>Fees</span>
                <span className='input-heading'>Type</span>
                <Select
                    style={{ minWidth: 182, width: "100%", paddingRight: 1 }}
                    onChange={(feesType) => this.setState({ feesType })}
                    value={this.state.feesType}
                >
                    <Option value={"differentiateBy1&2Registration"}>Differentiate by 1st registration and 2nd+ registration</Option>
                </Select>
                <div className="inside-container-view" >
                    <div className="table-responsive">
                        <Table className="fees-table" columns={columns} dataSource={data} pagination={false} Divider="false" />
                    </div>
                    <span className='input-heading-add-another'>+ Add Another Division</span>
                    <Checkbox className="gst-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>Prices include GST (10%)</Checkbox>
                </div>

                <div className="inside-container-view" >
                    <div className="table-responsive">
                        <Table className="fees-table" columns={columns} dataSource={data} pagination={false} />
                    </div>
                    <span className='input-heading-add-another'>+ Add Another Division</span>
                    <Checkbox className="gst-single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>Prices include GST (10%)</Checkbox>
                </div>
            </div>
        )
    }


    ////discount view inside the content
    discountView = () => {
        return (
            <div className="discount-view pt-5">
                <span className='form-heading'>Discounts</span>
                <span className='input-heading'>Type</span>
                <Select
                    style={{ width: "100%", paddingRight: 1, minWidth: 182 }}
                    onChange={(discountType) => this.setState({ discountType })}
                    value={this.state.discountType}
                >
                    <Option value={"applyToClubFeesOnly"}>Apply to Club fees only</Option>
                </Select>


                <div className="inside-container-view">
                    <Checkbox className="single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>General Discount</Checkbox>
                    <div className="row">
                        <div className="col-3" style={{ minWidth: 150 }}>
                            <span className='input-heading'>Percentage Off</span>
                            <Input className="input" placeholder="Percentage Off" />
                        </div>
                        <div className="col-9" style={{ minWidth: 150 }}>
                            <span className='input-heading'>Description</span>
                            <Input className="input" placeholder="General Discount" />
                        </div>
                    </div>

                    <div className="fluid-width" >
                        <div className="row" >
                            <div className="col-sm" >
                                <span className='input-heading'>Available From</span>
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.dateOnChangeFrom(date)}
                                    format={'DD-MM-YYYY'}
                                    placeholder={"dd-mm-yyyy"}
                                    showTime={false}
                                />
                            </div>
                            <div className="col-sm">
                                <span className='input-heading'>Available To</span>
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    placeholder={"dd-mm-yyyy"}
                                    disabledDate={this.disabledDate}
                                    disabledTime={this.disabledTime}
                                    onChange={date => this.dateOnChangeTo(date)}
                                    format={'DD-MM-YYYY'}
                                    showTime={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inside-container-view">
                    <Checkbox className="single-checkbox" defaultChecked={true} onChange={(e) => this.onChange(e)}>Early Discount</Checkbox>
                    <div className="row">
                        <div className="col-3" style={{ minWidth: 150 }}>
                            <span className='input-heading'>Percentage Off</span>
                            <Input className="input" placeholder="Percentage Off" />
                        </div>
                        <div className="col-9" style={{ minWidth: 150 }}>
                            <span className='input-heading'>Description</span>
                            <Input className="input" placeholder="Early Discount" />
                        </div>
                    </div>

                    <div className="fluid-width" >
                        <div className="row" >
                            <div className="col-sm" >
                                <span className='input-heading'>Available From</span>
                                <DatePicker
                                    size="large"
                                    style={{ width: "100%" }}
                                    onChange={date => this.dateOnChangeFrom(date)}
                                    format={'DD-MM-YYYY'}
                                    placeholder={"dd-mm-yyyy"}
                                    showTime={false}
                                />
                            </div>
                            <div className="col-sm">
                                <span className='input-heading'>Available To</span>
                                <DatePicker
                                    size="large"
                                    placeholder={"dd-mm-yyyy"}
                                    style={{ width: "100%" }}
                                    disabledDate={this.disabledDate}
                                    disabledTime={this.disabledTime}
                                    onChange={date => this.dateOnChangeTo(date)}
                                    format={'DD-MM-YYYY'}
                                    showTime={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inside-container-view">
                    <Checkbox className="single-checkbox mt-1" onChange={(e) => this.onChange(e)}>{AppConstants.familyDiscount}</Checkbox>
                </div>

            </div>

        )
    }

    ///setting the available from date
    dateOnChangeFrom = date => {
        // this.setState({ endDate: moment(date).utc().toISOString() })
        console.log(date)
    }

    ////setting the available to date
    dateOnChangeTo = date => {
        console.log(date)
    }


    //////footer view containing all the buttons like submit and cancel
    footerView = () => {
        return (
            <div className="fluid-width" >
                <div className="footer-view">
                    <div className="row" >
                        <div className="col-sm" style={{ display: 'flex', alignItems: "flex-start" }}>
                            <Button type="cancel-button">Cancel</Button>
                        </div>
                        <div className="col-sm" >
                            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                                <Button className="save-draft-text" type="save-draft-text">Save as Draft</Button>
                                <Button className="publish-button" type="primary">Publish</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    ///advance setting view inside the content view
    advancedSettingView = () => {
        const advancedSetting = ['Allow Team Preference', 'Manually approve all new registrations', 'Allow people to invite friends']

        const governemntRebateSetting1 = [
            {
                title: 'Government Rebate',
                children: [
                    { title: 'NSW Active Kids', children: [] },
                    { title: 'QLD Fair Play Voucher', children: [] },
                    { title: 'Other', children: [] }
                ]
            }
        ];
        return (
            <div className="advanced-setting-view pt-5">
                <span className='form-heading'>Advanced Settings</span>

                <div className="inside-container-view">
                    <Tree className="tree-government-rebate pt-0" checkable
                        defaultExpandedKeys={['0',]}
                        defaultCheckedKeys={['0-0', '0-1']}>
                        {this.ShowGovernemntRebateSettingTree(governemntRebateSetting1)}
                    </Tree>
                </div>

                <Checkbox.Group style={{ display: "-ms-flexbox", flexDirection: 'column', justifyContent: 'center', paddingTop: 10 }} options={advancedSetting}
                    defaultValue={['Allow Team Preference', 'Manually approve all new registrations', 'Allow people to invite friends']} onChange={(e) => this.onChange(e)} />

                <div className="inside-container-view">
                    <Checkbox className="single-checkbox mt-1" defaultChecked={true} onChange={(e) => this.onChange(e)}>Disclaimers</Checkbox>
                    <span className='input-heading'>Disclaimer Link</span>
                    <Input className="input" placeholder="Disclaimer Link" />
                    <span className='input-heading-add-another'>+ Add Another Disclaimer Link</span>
                </div>
            </div>
        )
    }

    ShowGovernemntRebateSettingTree = tree => {
        const { TreeNode } = Tree;
        return tree.map((item, catIndex) => {
            return (
                <TreeNode title={this.governamentRebateNode(item)} key={catIndex} defaultCheckedKeys={"Government Rebate"}>
                    {this.showSubGovernamentRebateNode(item, catIndex)}
                </TreeNode>
            );
        });
    };

    governamentRebateNode = item => {
        return (
            <span >
                {item.title}
            </span>
        );
    };

    showSubGovernamentRebateNode(item, catIndex) {
        const { TreeNode } = Tree;
        return (
            item.children.map((inItem, scatIndex) => {
                return (
                    <TreeNode
                        title={this.makeSubGovernamentRebateNode(inItem)}
                        key={`${catIndex}-${scatIndex}`}
                    >
                    </TreeNode>
                );
            })
        );
    }
    makeSubGovernamentRebateNode(item) {
        return (
            <span >
                {item.title}
            </span>
        );
    }





    render() {
        return (
            <div className="fluid-width" style={{ backgroundColor: "#f7fafc" }} >
                <DashboardLayout menuHeading={AppConstants.registration} menuName={AppConstants.registration} />
                <Layout>
                    {this.headerView()}

                    <Content>
                        <div className="formView">
                            {this.contentView()}
                        </div>

                        <div className="formView">
                            {this.paymentView()}
                        </div>

                        <div className="formView">
                            {this.feesView()}
                        </div>

                        <div className="formView">
                            {this.discountView()}
                        </div>

                        <div className="formView">
                            {this.advancedSettingView()}
                        </div>
                    </Content>


                    <Footer>
                        {this.footerView()}
                    </Footer>
                </Layout>
            </div>

        );
    }
}
export default ProductAdd;
