/**
 A helper that helps to open PDF file.
*/
OpenFileHelperJS = function (pdfDocumentEditor, showErrorMessageFunc) {

    // === Open default PDF file ===

    /**
     Opens the default PDF file in image viewer.
    */
    OpenFileHelperJS.prototype.openDefaultPdfFile = function () {
        // open uploaded file in image viewer
        pdfDocumentEditor.openFile("VintasoftImagingDemo.pdf", null, __openDefaultPdfFileFromSessionFolder_error);
    }

    /**
     Default PDF file is NOT opened from default session folder.
     @param {object} data Information about error.
    */
    function __openDefaultPdfFileFromSessionFolder_error(data) {
        // copy the default PDF document from global folder to the session folder
        Vintasoft.Imaging.VintasoftFileAPI.copyFile("UploadedImageFiles/VintasoftImagingDemo.pdf", __copyDefaultPdfFileToSessionFolder_success, __copyDefaultPdfFileToSessionFolder_error);
    }

    /**
     Default PDF file is copied to the default session folder.
     @param {object} data Information about copied file.
    */
    function __copyDefaultPdfFileToSessionFolder_success(data) {
        // open PDF document
        pdfDocumentEditor.openFileWithAuthentication(data.fileId, null, __openFile_error);
    }

    /**
     Default PDF file is NOT copied to the default session folder.
     @param {object} data Information about error.
    */
    function __copyDefaultPdfFileToSessionFolder_error(data) {
        showErrorMessageFunc(data);
    }

    /**
     Default PDF file is NOT copied to the default session folder.
     @param {object} data Information about error.
    */
    function __openFile_error(data) {
        showErrorMessageFunc(data);
    }

}
