import React from "react";

function ContentPanel(props) {
  const { content } = props;

  return (
    <div className="support-content-panel" dangerouslySetInnerHTML={{ __html: content }}>
    </div>
  );
}

export default ContentPanel;
