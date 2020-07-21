import React, { Component } from "react";

class TreeLeaf extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  componentDidUpdate() {
    const { collapsed } = this.state;
    const { searchedArray, content } = this.props;
    if (!collapsed && searchedArray && searchedArray.indexOf(content.id) > -1) {
      this.setState({ collapsed: true });
    } else if (collapsed && searchedArray.length === 0 && searchedArray.indexOf(content.id) === -1) {
      this.setState({ collapsed: false });
    }
  }

  onCollapse = (e) => {
    this.setState({ collapsed: e ? true : !this.state.collapsed });
  }

  onShow = e => {
    this.props.selectArticle(e);
  }

  render() {
    const { searchedArray, data, content } = this.props;
    const { collapsed } = this.state;
    let leaves = [];
    data.forEach((art) => {
      if (art.id === content.id) {
        content.subArticles = art.subArticles;
      } else {
        leaves.push({ ...art });
      }
    });

    return (
      <div className="side-bar-item">
        <ul
          onClick={() => this.onShow(content.id)}
          onDoubleClick={this.onCollapse}
        >
          {content.article === 'Home' ? (
            <i className="fa fa-home" />
          ) : (
            <i
              className={"fa " + (content.subArticles.length > 0
                ? (collapsed
                  ? "fa-angle-right fa-lg tree-collapse"
                  : "fa-angle-right fa-lg tree-not-collapse")
                : "fa-minus fa-sm")
              }
            />
          )}

          {content.article}
        </ul>
        <div className={`side-bar-child-item ${(collapsed ? "tree-item-show" : "tree-item-hide")}`}>
          {content.subArticles && content.subArticles.map((leaf) => (
            <TreeLeaf
              searchedArray={searchedArray}
              key={leaf.article}
              data={leaves}
              content={leaf}
              selectArticle={this.props.selectArticle}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default TreeLeaf;
