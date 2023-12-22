/**
 A helper that helps to open PDF file.
*/
OpenFileHelperJS = function (docViewer, showErrorMessageFunc) {

    var _pdfDocument;
    var that = this;



    // === Open default PDF file ===

    /**
     Opens the default PDF file in image viewer.
    */
    OpenFileHelperJS.prototype.openDefaultPdfFile = function () {
        // open uploaded file in image viewer
        Vintasoft.Imaging.Pdf.WebPdfDocumentControllerJS.openPdfDocument("VintasoftImagingDemo.pdf", "", __openPdfDocument_success, __openDefaultPdfFileFromSessionFolder_error);
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
        that.openPdfDocument(data.fileId, "");
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
    function __copyDefaultPdfFileToSessionFolder_error(data) {
        showErrorMessageFunc(data);
    }



    // === Open PDF file ===

    /**
     Opens the PDF file in image viewer.
    */
    OpenFileHelperJS.prototype.openPdfFile = function (fileId) {
        // if demo has previosly opened PDF document
        if (_pdfDocument != null) {
            // close previously opened PDF document
            Vintasoft.Imaging.Pdf.WebPdfDocumentControllerJS.closeDocument(_pdfDocument);
            _pdfDocument = null;
        }

        var that = this;


        /**
         PDF file is NOT opened with empty password.
         @param {object} data Information about error.
        */
        function __openPdfFile_error(data) {
            that.showPasswordDialog(fileId);
        }


        // open uploaded file in image viewer
        Vintasoft.Imaging.Pdf.WebPdfDocumentControllerJS.openPdfDocument(fileId, "", __openPdfDocument_success, __openPdfFile_error);
    }



    // === Open PDF document ===

    /**
     Opens PDF document.
    */
    OpenFileHelperJS.prototype.openPdfDocument = function (fileId, filePassword) {
        // if demo has previosly opened PDF document
        if (_pdfDocument != null) {
            // close previously opened PDF document
            Vintasoft.Imaging.Pdf.WebPdfDocumentControllerJS.closeDocument(_pdfDocument);
            _pdfDocument = null;
        }

        // open uploaded file in image viewer
        Vintasoft.Imaging.Pdf.WebPdfDocumentControllerJS.openPdfDocument(fileId, filePassword, __openPdfDocument_success, __openPdfDocument_error);
    }

    /**
     PDF document is opened successfully.
    */
    function __openPdfDocument_success(data) {
        // save reference to opened PDF document
        _pdfDocument = data.pdfDocument;

        // get images associated with PDF page
        var newImages = Vintasoft.Imaging.Pdf.WebPdfDocumentControllerJS.getImagesAssociatedWithPdfPages(_pdfDocument);

        // get image collection of image viewer
        var images = docViewer.get_ImageViewer().get_Images();
        // clear image collection of image viewer
        images.clear();

        // add images, which are associated with PDF pages, to the image collection of image viewer
        images.addRange(newImages);
    }

    /**
     PDF document is not opened.
    */
    function __openPdfDocument_error(data) {
        showErrorMessageFunc(data);
    }



    // === Open PDF document (password dialog) ===

    /**
     Creates a modal dialog for entering the password and shows the dialog.
    */
    OpenFileHelperJS.prototype.showPasswordDialog = function (fileId) {
        // create password dialog
        var passwordDialog = new Vintasoft.Imaging.UI.Dialogs.WebUiDocumentPasswordDialogJS(fileId);
        // subscribe to the authenticationSucceeded of password dialog
        Vintasoft.Shared.subscribeToEvent(passwordDialog, "authenticationSucceeded", __passwordDialog_authenticationSucceeded);

        // add password dialog to the document viewer
        docViewer.get_Items().addItem(passwordDialog);

        // show password dialog
        passwordDialog.show();
    }

    /**
     File is authenticated successfully using password dialog.
    */
    function __passwordDialog_authenticationSucceeded(event, data) {
        // destroy password dialog
        __destroyPasswordDialog(this);

        // open PDF document
        that.openPdfDocument(data.fileId, data.filePassword);
    }

    /**
     Destroys password dialog.
    */
    function __destroyPasswordDialog(passwordDialog) {
        // remove password dialog from the document viewer
        docViewer.get_Items().removeItem(passwordDialog);
    }

}
