import React, { Component } from 'react';

import TreeLeaf from './TreeLeaf';

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchMode: "Refine",
      searchContent: "",
      searchApply: "",
    }
  }

  onChange = (e) => {
    if (e.target.value.length === 0) {
      this.setState({
        searchApply: e.target.value,
      });
    }

    this.setState({
      searchContent: e.target.value,
    });
  };

  onSearch = () => {
    this.setState({
      searchApply: "" + this.state.searchContent,
    });
  };

  render() {
    const { searchApply } = this.state;
    const { content } = this.props;

    return (
      <div className="support-side-bar">
        <div className="search-box">
          <select>
            <option value="Refine">Refine</option>
            <option value="Apart">Apart</option>
          </select>

          <input type="text" placeholder="Search for articles..." onChange={this.onChange} />

          <button onClick={this.onSearch}>
            <i className="fa fa-search" />
          </button>
        </div>

        <div className="separator" />

        {content.map((cont) => {
          if (searchApply.length === 0 || cont.article.indexOf(searchApply) > -1) {
            return (
              <div key={cont.id}>
                <TreeLeaf key={cont.key} content={cont} />
                <div className="separator" />
              </div>
            );
          }

          return <></>;
        })}
      </div>
    );
  }
}

export default SideBar;
