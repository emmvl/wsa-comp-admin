import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";

import AppConstants from "../../../themes/appConstants";
import history from "../../../util/history";

const CommunicationRichTextEditor = (props) => {
    const { onChangeEditorData, onEditorStateChange } = props;

    const { editorState } = useState(null);

    return (
        <div className="fluid-width mt-2" style={{ border: "1px solid rgb(212, 212, 212)" }}>
            <div className="livescore-editor-news col-sm">
                <Editor
                    editorState={editorState}
                    editorClassName="newsDetailEditor"
                    placeholder={AppConstants.communicationBody}
                    onChange={(e) => onChangeEditorData(e.blocks)}
                    onEditorStateChange={onEditorStateChange}
                    toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'remove', 'history'],
                        inline: { inDropdown: true },
                        list: { inDropdown: true },
                        textAlign: { inDropdown: true },
                        link: { inDropdown: true },
                        history: { inDropdown: true },
                    }}
                />
            </div>
        </div>
    );
};

export default CommunicationRichTextEditor;
