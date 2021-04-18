import React from 'react';
// import ReactMarkdown from "react-markdown";
import ReactMarkdownWithHtml from 'react-markdown/with-html';

const ContentPanel = ({ content }) => (
  <div className="support-content-panel">
    <ReactMarkdownWithHtml
      children={content}
      transformImageUri={uri => `${process.env.REACT_APP_CONTENT_API_URL}${uri}`}
      allowDangerousHtml
    />
  </div>
);

export default ContentPanel;
