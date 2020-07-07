import React from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
} from 'antd';

import './styles.css';

import CustomPDFViewer from './PDFViewer';
import PDFDocument from './PDFDocument';
import MatchSheetTemplate from "./MatchSheetTemplate";

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
            footer={false}
        >
            <CustomPDFViewer>
                <PDFDocument
                    pages={[
                        <MatchSheetTemplate />,
                        <MatchSheetTemplate templateType='Carnival' />,
                        <MatchSheetTemplate templateType='Social' />,
                    ]}
                />
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
