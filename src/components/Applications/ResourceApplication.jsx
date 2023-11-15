import React from 'react'
import DocuPdf from '../../utils/DocuPdf'
import { PDFViewer } from '@react-pdf/renderer'

const ResourceApplication = () => {
    return (
        <div ><PDFViewer style={{ width: '35%', height: '75dvh'}}><DocuPdf /></PDFViewer></div>
    )
}

export default ResourceApplication