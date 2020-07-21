import React, { Component } from "react";
import { Input, Icon } from "antd";

import TreeLeaf from "./TreeLeaf";

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.searchedArray = [-1];
    this.state = {
      searchMode: "Refine",
      searchContent: "",
      searchApply: "",
    }
  }

  onChangeSearchText = (e) => {
    if (e.target.value.length === 0) {
      this.searchedArray = [-1];
      this.setState({
        searchApply: e.target.value,
      });
    }
    this.setState({
      searchContent: e.target.value,
    });
  };

  onKeyEnterSearchText = (e) => {
    const code = e.keyCode || e.which;
    if (code === 13) { // input enter
      this.onClickSearchIcon();
    }
  };

  onClickSearchIcon = () => {
    this.setState({ searchApply: "" + this.state.searchContent });
  }

  search = id => {
    if (id === -1) {
      this.searchedArray = [];
      for (let i = 0; i < this.props.content.length; i++) {
        if (this.props.content[i].article.toLowerCase().search(this.state.searchApply.toLowerCase()) >= 0) {
          this.searchedArray.push(this.props.content[i].id);
          if (this.props.content[i].parentArticleId) {
            this.search(this.props.content[i].parentArticleId.id);
          }
        }
      }
    } else if (id > 0) {
      for (let i = 0; i < this.props.content.length; i++) {
        if (id === this.props.content[i].id) {
          this.searchedArray.push(this.props.content[i].id);
          if (this.props.content[i].parentArticleId) {
            this.search(this.props.content[i].parentArticleId.id);
          }
        }
      }
    }

    return true;
  };

  render() {
    const { content, func } = this.props;
    const tree = [];
    let leaves = [];
    content.map((art) => art.parentArticleId === null ? tree.push({ ...art }) : leaves.push({ ...art }));
    if (this.state.searchApply.length > 0) {
      this.search(-1);
    }

    return (
      <div className="support-side-bar">
        <div className="search-box">
          <Input
            className="product-reg-search-input"
            onChange={this.onChangeSearchText}
            placeholder="Search for articles..."
            onKeyPress={this.onKeyEnterSearchText}
            prefix={
              <Icon
                type="search"
                className="search-prefix-icon-style"
                onClick={this.onClickSearchIcon}
              />
            }
            allowClear
          />
        </div>

        <div className="separator" />

        {tree.map((cont) => {
          if (this.searchedArray.indexOf(-1) === 0
            || this.searchedArray.indexOf(cont.id) > -1
          ) {
            return (<div key={cont.article}>
              <TreeLeaf
                searchedArray={this.searchedArray}
                data={leaves}
                content={cont}
                selectArticle={this.props.selectArticle}
              />
              <div className="separator"/>
            </div>);
          }
          return <></>;
        })}
      </div>
    );
  }
}

export default SideBar;
