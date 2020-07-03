import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';

const PdfViewer = ({ children }) => (
    <PDFViewer>
        {children}
    </PDFViewer>
);

export default PdfViewer;
