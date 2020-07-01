import React, {Component} from 'react';
import {
    Modal,
} from 'antd';

import './liveScore.css';

class LiveScoreMatchSheetPreviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { modalTitle, handleOK, onCancel } = this.props;
        return (
            <div className="match-sheet-fixtures">

            </div>
        )
    }
}

export default LiveScoreMatchSheetPreviewModal;
