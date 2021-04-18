import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Layout,
  Input,
  Select,
  Checkbox,
  Tree,
  DatePicker,
  Button,
  Table,
  Breadcrumb,
  Form,
} from 'antd';
import moment from 'moment';
import { Formik } from 'formik';
import * as Yup from 'yup';

import './product.scss';
import InputWithHead from '../../customComponents/InputWithHead';
import InnerHorizontalMenu from '../../pages/innerHorizontalMenu';
import DashboardLayout from '../../pages/dashboardLayout';
import AppConstants from '../../themes/appConstants';
import AppImages from '../../themes/appImages';

const { Header, Footer, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;
const productAddRegistrationSchema = Yup.object().shape({
  registrationOepn: Yup.mixed().required('Registration Open Date is Required'),
  registrationClose: Yup.mixed().required('Registration Close Date is Required'),
});
let this_Obj = null;
const columns = [
  {
    title: AppConstants.category,
    dataIndex: 'category',
    key: 'category',
    render: category => <Input className="input-inside-table-fees-category" value={category} />,
  },
  {
    title: AppConstants.division,
    dataIndex: 'division',
    key: 'division',
    render: division => <Input className="input-inside-table-fees" value={division} />,
  },

  {
    title: AppConstants.stateTitle,
    dataIndex: 'state',
    key: 'state',
    render: state => <Input className="input-inside-table-fees" value={state} />,
  },
  {
    title: AppConstants.startDate,
    dataIndex: 'startDate',
    key: 'startDate',
    width: '20%',
    render: startDate => (
      <DatePicker
        className="date-picker-inside-table-fees"
        onChange={date => this_Obj.dateOnChangeFrom(date)}
        format="DD-MM-YYYY"
        placeholder="dd-mm-yyyy"
        showTime={false}
        defaultValue={moment()}
      />
    ),
  },
  {
    title: AppConstants.endDate,
    dataIndex: 'endDate',
    key: 'endDate',
    width: '20%',
    render: endDate => (
      <DatePicker
        className="date-picker-inside-table-fees"
        onChange={date => this_Obj.dateOnChangeTo(date)}
        format="DD-MM-YYYY"
        placeholder="dd-mm-yyyy"
        showTime={false}
        defaultValue={moment()}
      />
    ),
  },
  {
    title: AppConstants.frequency,
    dataIndex: 'frequency',
    key: 'frequency',
    render: frequency => (
      <Select
        className="select-inside-table-fees"
        style={{ width: '100%', paddingRight: 1 }}
        onChange={frequency => this_Obj.setState({ frequency })}
        // value={this_Obj.state.frequency}
        defaultValue={frequency}
      >
        <Option value="once">Once</Option>
        <Option value="match">Match</Option>
      </Select>
    ),
  },
  {
    title: AppConstants.total,
    dataIndex: 'total',
    key: 'total',
  },
  {
    title: '',
    dataIndex: 'clear',
    key: 'clear',
    render: clear => (
      <span className="d-flex justify-content-center w-100">
        <img className="dot-image" src={AppImages.redCross} alt="" width="16" height="16" />
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    category: 'NETSETGO',
    division: 'NET',
    state: '$40.00',
    frequency: 'once',
    startDate: '2019-11-26T05:58:34.739Z',
    endDate: '2019-11-26T05:58:34.739Z',
    total: '$170',
    clear: 'yes',
  },
  {
    key: '2',
    category: 'NETSETGO',
    division: 'SET',
    state: '$40.00',
    startDate: '2019-11-26T05:58:34.739Z',
    endDate: '2019-11-26T05:58:34.739Z',
    frequency: 'match',
    total: '$170',
    clear: 'yes',
  },
];

class ProductAddRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registrationType: 'playingMember',
      category: 'NETSETGO',
      paymentFrequency: 'oncePerYear',
      applyTo: 'stateFees',
      feesType: 'differentiateBy1&2Registration',
      frequency: ['year', 'once'],
    };
    this_Obj = this;
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

  headerView = () => {
    return (
      <div className="header-view">
        <Header className="form-header-view d-flex bg-transparent align-items-center">
          <Breadcrumb separator=" > ">
            <NavLink to="/registration">
              <Breadcrumb.Item separator=" > " className="breadcrumb-product">
                {AppConstants.products}
              </Breadcrumb.Item>
            </NavLink>
            <Breadcrumb.Item className="breadcrumb-add">{AppConstants.add}</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
      </div>
    );
  };

  contentView = (values, errors, setFieldValue, touched, handleChange, handleBlur) => {
    return (
      <div className="content-view pt-5">
        <span className="form-heading">{AppConstants.productDetails}</span>

        <InputWithHead heading={AppConstants.registrationType} />
        <Select
          className="w-100"
          style={{ paddingRight: 1, minWidth: 182 }}
          onChange={registrationType => this.setState({ registrationType })}
          value={this.state.registrationType}
        >
          <Option value="playingMember">{AppConstants.playingMember}</Option>
          <Option value="nonPlayingMember">{AppConstants.nonPlayingMember}</Option>
          <Option value="umpire/referee">{AppConstants.Umpire_Referee}</Option>
        </Select>

        <InputWithHead heading={AppConstants.category} />
        <Select
          className="w-100"
          style={{ paddingRight: 1, minWidth: 182 }}
          onChange={category => this.setState({ category })}
          value={this.state.category}
        >
          <Option value="NETSETGO">{AppConstants.netSetGo}</Option>
        </Select>

        <span className="applicable-to-heading">{AppConstants.applicableTo}</span>

        <Checkbox className="single-checkbox" defaultChecked onChange={e => this.onChange(e)}>
          {AppConstants.level1_Affiliate_Associations}
          <span className="reg-pro-rename-text">{AppConstants.rename}</span>
        </Checkbox>
        <div style={{ marginTop: 5 }}>
          <Checkbox className="single-checkbox" defaultChecked onChange={e => this.onChange(e)}>
            {AppConstants.Level2_Affiliate_Clubs}
            <span className="reg-pro-rename-text">{AppConstants.rename}</span>
          </Checkbox>
        </div>

        <InputWithHead heading={AppConstants.paymentFrequency} />
        <Select
          className="w-100"
          style={{ paddingRight: 1, minWidth: 182 }}
          onChange={paymentFrequency => this.setState({ paymentFrequency })}
          value={this.state.paymentFrequency}
        >
          <Option value="oncePerYear">{AppConstants.oncePerYear}</Option>
          <Option value="eachMatch">{AppConstants.eachMatch}</Option>
          <Option value="eachCompetition">{AppConstants.eachCompetition}</Option>
        </Select>

        <InputWithHead heading={AppConstants.description} />
        <TextArea placeholder={AppConstants.enterShortDescription} allowClear />

        <div className="fluid-width">
          <div className="row">
            <div className="col-sm">
              <InputWithHead heading={AppConstants.dob__From} />
              <DatePicker
                // size="large"
                className="w-100"
                onChange={date => this.dateOnChangeFrom(date)}
                format="DD-MM-YYYY"
                placeholder="dd-mm-yyyy"
                showTime={false}
                name="registrationOepn"
              />
              {errors.registrationOepn && touched.registrationOepn && (
                <span className="form-err">{errors.registrationOepn}</span>
              )}
            </div>
            <div className="col-sm">
              <InputWithHead heading={AppConstants.dob__To} />
              <DatePicker
                // size="large"
                className="w-100"
                disabledDate={this.disabledDate}
                disabledTime={this.disabledTime}
                onChange={date => this.dateOnChangeTo(date)}
                format="DD-MM-YYYY"
                placeholder="dd-mm-yyyy"
                showTime={false}
                name={'registrationClose'}
              />
              {errors.registrationClose && touched.registrationClose && (
                <span className="form-err">{errors.registrationClose}</span>
              )}
            </div>
          </div>
          <Checkbox
            className="single-checkbox pt-3"
            defaultChecked
            onChange={e => this.onChange(e)}
          >
            {AppConstants.mandateAgeRestrictions}
          </Checkbox>
        </div>
      </div>
    );
  };

  ////fees view inside the content
  feesView = () => {
    return (
      <div className="fees-view pt-5">
        <span className="form-heading">{AppConstants.fees}</span>
        <div className="inside-container-view">
          <div className="table-responsive">
            <Table
              className="fees-table"
              columns={columns}
              dataSource={data}
              pagination={false}
              Divider="false"
            />
          </div>
          <span className="input-heading-add-another">+ {AppConstants.addAnotherDivision}</span>
        </div>
        <Checkbox className="gst-single-checkbox" defaultChecked onChange={e => this.onChange(e)}>
          {AppConstants.addGst10}
        </Checkbox>
      </div>
    );
  };

  ////discount view inside the content
  discountView = () => {
    return (
      <div className="discount-view pt-5">
        <span className="form-heading">{AppConstants.discounts}</span>

        <InputWithHead heading={AppConstants.applyTo} />
        <Select
          className="w-100"
          style={{ paddingRight: 1, minWidth: 182 }}
          onChange={applyTo => this.setState({ applyTo })}
          value={this.state.applyTo}
        >
          <Option value="clubFees" disabled>
            {AppConstants.clubFees}
          </Option>
          <Option value="associationFees" disabled>
            {AppConstants.associationFees}
          </Option>
          <Option value="stateFees">{AppConstants.stateFees}</Option>
          <Option value="allFees">{AppConstants.allFees}</Option>
        </Select>

        <div className="prod-reg-inside-container-view">
          <Checkbox
            className="single-checkbox pt-3"
            defaultChecked
            onChange={e => this.onChange(e)}
          >
            {AppConstants.discountCode}
          </Checkbox>
          <div className="row">
            <div className="col-3" style={{ minWidth: 150 }}>
              <InputWithHead
                heading={AppConstants.percentageOff}
                placeholder={AppConstants.percentageOff}
              />
            </div>
            <div className="col-9" style={{ minWidth: 150 }}>
              <InputWithHead
                heading={AppConstants.description}
                placeholder={AppConstants.generalDiscount}
              />
            </div>
          </div>
          <InputWithHead heading={AppConstants.code} placeholder={AppConstants.code} />
          <div className="fluid-width">
            <div className="row">
              <div className="col-sm">
                <InputWithHead heading={AppConstants.availableFrom} />
                <DatePicker
                  // size="large"
                  className="w-100"
                  onChange={date => this.dateOnChangeFrom(date)}
                  format="DD-MM-YYYY"
                  placeholder="dd-mm-yyyy"
                  showTime={false}
                />
              </div>
              <div className="col-sm">
                <InputWithHead heading={AppConstants.availableTo} />
                <DatePicker
                  // size="large"
                  className="w-100"
                  disabledDate={this.disabledDate}
                  disabledTime={this.disabledTime}
                  onChange={date => this.dateOnChangeTo(date)}
                  format="DD-MM-YYYY"
                  placeholder="dd-mm-yyyy"
                  showTime={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="prod-reg-inside-container-view">
          <Checkbox
            className="single-checkbox pt-3"
            defaultChecked
            onChange={e => this.onChange(e)}
          >
            {AppConstants.earlyDiscount}
          </Checkbox>
          <div className="row">
            <div className="col-3" style={{ minWidth: 150 }}>
              <InputWithHead
                heading={AppConstants.percentageOff}
                placeholder={AppConstants.percentageOff}
              />
            </div>
            <div className="col-9" style={{ minWidth: 150 }}>
              <InputWithHead heading={'Description'} placeholder={'General Discount'} />
            </div>
          </div>
          <div className="fluid-width">
            <div className="row">
              <div className="col-sm">
                <InputWithHead heading={AppConstants.availableFrom} />
                <DatePicker
                  // size="large"
                  className="w-100"
                  onChange={date => this.dateOnChangeFrom(date)}
                  format="DD-MM-YYYY"
                  placeholder="dd-mm-yyyy"
                  showTime={false}
                />
              </div>
              <div className="col-sm">
                <InputWithHead heading={AppConstants.availableTo} />
                <DatePicker
                  // size="large"
                  className="w-100"
                  placeholder="dd-mm-yyyy"
                  disabledDate={this.disabledDate}
                  disabledTime={this.disabledTime}
                  onChange={date => this.dateOnChangeTo(date)}
                  format="DD-MM-YYYY"
                  showTime={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="prod-reg-inside-container-view">
          <Checkbox
            className="single-checkbox pt-3"
            defaultChecked
            onChange={e => this.onChange(e)}
          >
            {AppConstants.familyDiscount}
          </Checkbox>
          <InputWithHead heading={AppConstants.child1} placeholder={AppConstants.child1} />
          <InputWithHead heading={AppConstants.child2} placeholder={AppConstants.child2} />
          <span className="input-heading-add-another">+ {AppConstants.addChild}</span>
        </div>
      </div>
    );
  };

  ///setting the available from date
  dateOnChangeFrom = date => {
    // this.setState({ endDate: moment(date).utc().toISOString() })
    console.log(date);
  };

  ////setting the available to date
  dateOnChangeTo = date => {
    console.log(date);
  };

  //////footer view containing all the buttons like submit and cancel
  footerView = isSubmitting => {
    return (
      <div className="fluid-width">
        <div className="footer-view">
          <div className="row">
            <div className="col-sm">
              <div className="reg-add-save-button">
                <Button className="publish-button" type="primary">
                  {AppConstants.save}
                </Button>
              </div>
            </div>
            <div className="col-sm">
              <div className="comp-buttons-view">
                <Button className="save-draft-text" type="save-draft-text">
                  {AppConstants.review}
                </Button>
                <Button
                  className="publish-button"
                  htmlType="submit"
                  type="primary"
                  disabled={isSubmitting}
                >
                  {AppConstants.publish}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  ///vouchersView inside the content view
  vouchersView = () => {
    const voucherSetting = [
      {
        title: AppConstants.enableUseOfVouchers,
        children: [
          { title: AppConstants.nswActiveKids, children: [] },
          { title: AppConstants.qldActiveKids, children: [] },
          { title: AppConstants.noValue, children: [] },
        ],
      },
    ];
    return (
      <div className="advanced-setting-view pt-5">
        <span className="form-heading">{AppConstants.vouchers}</span>

        <div className="inside-container-view">
          <Tree
            className="tree-government-rebate"
            checkable
            defaultExpandedKeys={['0']}
            defaultCheckedKeys={['0-0', '0-1']}
          >
            {this.ShowVoucherSettingSettingTree(voucherSetting)}
          </Tree>
          <span className="input-heading-add-another">+ {AppConstants.addAnotherVoucher}</span>
        </div>
      </div>
    );
  };

  ShowVoucherSettingSettingTree = tree => {
    const { TreeNode } = Tree;
    return tree.map((item, catIndex) => {
      return (
        <TreeNode title={this.voucherNode(item)} key={catIndex}>
          {this.showSubVoucherNode(item, catIndex)}
        </TreeNode>
      );
    });
  };

  voucherNode = item => {
    return <span>{item.title}</span>;
  };

  showSubVoucherNode(item, catIndex) {
    const { TreeNode } = Tree;
    return item.children.map((inItem, scatIndex) => {
      return <TreeNode title={this.makeSubVoucherNode(inItem)} key={`${catIndex}-${scatIndex}`} />;
    });
  }

  makeSubVoucherNode(item) {
    return <span>{item.title}</span>;
  }

  render() {
    return (
      <div className="fluid-width default-bg">
        <DashboardLayout
          menuHeading={AppConstants.registration}
          menuName={AppConstants.registration}
        />
        <InnerHorizontalMenu menu="registration" regSelectedKey="1" />
        <Layout>
          {this.headerView()}
          <Formik
            enableReinitialize
            initialValues={{
              orgName: '',
              registrationOepn: '',
              registrationClose: '',
              disclaimerLink: '',
              disclaimers: '',
              name: '',
              role: '',
              email: '',
              phone: '',
            }}
            validationSchema={productAddRegistrationSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
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
              setFieldValue,
            }) => (
              <Form onFinish={handleSubmit}>
                <Content>
                  <div className="formView">
                    {this.contentView(
                      values,
                      errors,
                      setFieldValue,
                      touched,
                      handleChange,
                      handleBlur,
                    )}
                  </div>

                  <div className="formView">{this.feesView()}</div>

                  <div className="formView">{this.discountView()}</div>

                  <div className="formView">{this.vouchersView()}</div>
                </Content>

                <Footer>{this.footerView(isSubmitting)}</Footer>
              </Form>
            )}
          </Formik>
        </Layout>
      </div>
    );
  }
}

export default ProductAddRegistration;
