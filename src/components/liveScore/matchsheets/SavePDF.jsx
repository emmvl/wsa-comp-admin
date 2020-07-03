import { render } from '@react-pdf/renderer';

export const savePDF = (dom, path, fileName) => {
    render(dom, `${path}/${fileName}.pdf`);
};
