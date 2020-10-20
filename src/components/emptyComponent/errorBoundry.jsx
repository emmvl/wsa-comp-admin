import React, { Component } from "react";
import AppImages from "../../themes/appImages";


class ErrorBoundry extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }


  componentDidCatch(error, errorInfo) {
    console.log("error, errorInfo", error, errorInfo, this.props.children)
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          {/* <h2>Something went wrong</h2> */}
          <img
            src={AppImages.wentWrong}
            alt=""
          />
          {/* <details style={{ whiteSpace: 'pre-wrap' }}>
                 {this.state.error && this.state.error.toString()}
                 <br />
                 {this.state.errorInfo.componentStack}
               </details> */}
        </div>
      );
    }
    return this.props.children;
  }
}



export default ErrorBoundry;
