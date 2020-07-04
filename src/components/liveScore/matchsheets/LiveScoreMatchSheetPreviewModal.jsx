import React from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
} from 'antd';

import './styles.css';

import PDFDocument from './PDFDocument';
import CustomPDFViewer from './PDFViewer';

const LiveScoreMatchSheetPreviewModal = (props) => {
    const { visible, modalTitle, handleOK, handleCancel } = props;

    return (
        <Modal
            {...props}
            className="live-score-match-sheet-modal"
            title={modalTitle}
            visible={visible}
            onOk={handleOK}
            onCancel={handleCancel}
            okText="Print"
            cancelText="Download"
            width="900px"
        >
            <CustomPDFViewer>
                <PDFDocument pages={[<h1>Page1</h1>, 'Page2', 'Page3', 'Page4', 'Page5', 'Page6']}/>
            </CustomPDFViewer>
        </Modal>
    );
};

LiveScoreMatchSheetPreviewModal.propTypes = {
    visible: PropTypes.bool,
    modalTitle: PropTypes.string,
    handleOK: PropTypes.func,
    handleCancel: PropTypes.func
};

LiveScoreMatchSheetPreviewModal.defaultProps = {
    visible: false,
    modalTitle: 'LiveScores Match Sheet',
    handleOK: () => {},
    handleCancel: () => {}
};

export default LiveScoreMatchSheetPreviewModal;
