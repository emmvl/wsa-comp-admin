import React, { createRef } from 'react';

const PDFContainer = (props) => {
    const { handleCreatePdf } = props;

    const bodyRef = createRef();
    const createPdf = () => handleCreatePdf(bodyRef.current);

    return (
        <section className="pdf-container">
            <section className="pdf-toolbar">
                <button onClick={createPdf}>Create PDF</button>
            </section>
            <section className="pdf-body" ref={bodyRef}>
                {props.children}
            </section>
        </section>
    )
};

export default PDFContainer;
