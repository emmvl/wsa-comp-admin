import React, {Component} from 'react';
import {
    Modal,
} from 'antd';

import '../liveScore.css';

class LiveScoreMatchSheetPreviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { modalTitle, handleOK, onCancel } = this.props;
        return (
            <div>
                <Modal
                    {...this.props}
                    className="live-score-match-sheet-modal"
                    title={modalTitle}
                    visible={this.props.visible}
                    onOk={handleOK}
                    onCancel={onCancel}
                    width="900px"
                >
                    Preview
                </Modal>
            </div>
        )
    }
}

export default LiveScoreMatchSheetPreviewModal;
