import React from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
} from 'antd';

import './styles.css';

import CustomPDFViewer from './PDFViewer';
import PDFDocument from './PDFDocument';
import MatchSheetTemplate from './MatchSheetTemplate';

const LiveScoreMatchSheetPreviewModal = (props) => {
    const { visible, matchTemplateTypes, organisation, matchList, modalTitle, handleOK, handleCancel } = props;

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
                    pages={matchList.length > 0 ? matchList.map((match) => (
                        <MatchSheetTemplate
                            organisation={organisation}
                            match={match}
                        />
                    )) : []}
                />
            </CustomPDFViewer>
        </Modal>
    );
};

LiveScoreMatchSheetPreviewModal.propTypes = {
    visible: PropTypes.bool,
    matchTemplateTypes: PropTypes.array,
    organisation: PropTypes.object,
    matchList: PropTypes.array,
    modalTitle: PropTypes.string,
    handleOK: PropTypes.func,
    handleCancel: PropTypes.func
};

LiveScoreMatchSheetPreviewModal.defaultProps = {
    visible: false,
    matchTemplateTypes: [],
    organisation: null,
    matchList: [],
    modalTitle: 'LiveScores Match Sheet',
    handleOK: () => {},
    handleCancel: () => {}
};

export default LiveScoreMatchSheetPreviewModal;
