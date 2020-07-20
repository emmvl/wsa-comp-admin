import React from 'react';

function ContentPanel(props) {
  const { content } = props;

  return (
    <div className="support-content-panel">
      {content}
    </div>
  );
}

export default ContentPanel;
