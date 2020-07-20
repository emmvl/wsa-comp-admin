import React, { useCallback, useState } from 'react';

function TreeLeaf(props) {
  const { content, showArticle } = props;
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = useCallback(() => {
    setCollapsed(prevState => !prevState);
    showArticle(content.id);
  }, [setCollapsed, showArticle, content]);

  const onSelect = useCallback((id) => () => {
    showArticle(id);
  }, [showArticle]);

  return (
    <div className="side-bar-item">
      <ul onClick={onCollapse}>
        {content.article === 'Home' ? (
          <i className="fa fa-home" />
        ) : (
          <i className="fa fa-angle-right fa-lg" />
        )}

        {content.article}
      </ul>

      {collapsed && (
        content.children.map((leaf) => (
          <ul
            className="child-leaf"
            onClick={onSelect(leaf.id)}
            key={leaf.article}
          >
            {leaf.article}
          </ul>
        ))
      )}
    </div>
  );
}

export default TreeLeaf;
