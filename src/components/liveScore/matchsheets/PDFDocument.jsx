import React from 'react';
import PropTypes from 'prop-types';
import { Document as ReactPdfDocument, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        width: '100%',
        padding: 16,
        backgroundColor: '#FFFFFF'
    },
    document: {
        width: '100%',
    }
});

// Create Document Component
const PDFDocument = (props) => {
    const { pages } = props;

    return (
        <ReactPdfDocument style={styles.document} width="100%" height="100%">
            {pages.map((page, index) => (
                <Page size="A4" style={styles.page} key={`page_${index}`}>
                    {page}
                </Page>
            ))}
        </ReactPdfDocument>
    )
};

PDFDocument.propTypes = {
    pages: PropTypes.array,
};

PDFDocument.defaultProps = {
    pages: [],
};

export default PDFDocument;
