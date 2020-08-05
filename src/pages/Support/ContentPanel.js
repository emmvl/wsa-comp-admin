import React from "react";
import ReactMarkdown from "react-markdown";

const ContentPanel = ({ content }) => (
  <div className="support-content-panel">
    <ReactMarkdown
      source={content}
      transformImageUri={(uri) => `${process.env.REACT_APP_CONTENT_API_URL}${uri}`}
    />
  </div>
);

export default ContentPanel;
