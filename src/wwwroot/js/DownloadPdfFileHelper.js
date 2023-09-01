/**
 A helper that helps to download PDF file.
*/
DownloadPdfFileHelperJS = function (showErrorMessageFunc) {

    var _docViewer;



    /**
     Creates UI button that allows to download a PDF file with filled interactive fields.
    */
    DownloadPdfFileHelperJS.prototype.createDownloadPdfFileWithFilledFieldsButton = function () {
        // create button that allows to download a PDF file with filled interactive fields
        var element = new Vintasoft.Imaging.UI.UIElements.WebUiButtonJS({
            cssClass: "vsdv-downloadImageFileButton",
            title: "Download Image File",
            localizationId: "downloadFileButton",
            onClick: __downloadImageFileButton_clicked
        });
        return element;
    }

    function __downloadImageFileButton_clicked(event, uiElement) {
        _docViewer = uiElement.get_RootControl();
        // get image viewer
        var imageViewer = _docViewer.get_ImageViewer();
        // get focused image
        var focusedImage = imageViewer.get_FocusedImage();
        // if image exists
        if (focusedImage != null) {
            // get the image file identifier
            var fileId = focusedImage.get_ImageId();
            // get PDF page, which is associated with image
            var focusedPage = Vintasoft.Imaging.Pdf.WebPdfDocumentControllerJS.getPageAssociatedWithImage(focusedImage);
            // if image is associated with PDF page
            if (focusedPage != null) {
                // get PDF document
                var doc = focusedPage.get_Document();
                // if PDF document has interactive form
                if (doc.isInteractiveFormReceived() && doc.getInteractiveForm() != null) {
                    // send the asynchronous request for updating the interactive form
                    doc.updateInteractiveForm(__onCommitInteractiveFormChanges_success, __downloadImageOperation_error);
                }
                // if PDF document does NOT have interactive form
                else {
                    // send the asynchronous request for downloading an image file from server
                    Vintasoft.Imaging.VintasoftFileAPI.downloadImageFile(fileId, __onDownloadFile_success, __downloadImageOperation_error);
                }
            }
            // if image is NOT associated with PDF page
            else {
                // send the asynchronous request for downloading an image file from server
                Vintasoft.Imaging.VintasoftFileAPI.downloadImageFile(fileId, __onDownloadFile_success, __downloadImageOperation_error);
            }
            // start the asynchronous operation in document viewer
            _docViewer.startAsyncOperation("Download file");
        }
    }

    /**
     Saves blob to a file.
     @param {object} blob Blob.
     @param {string} filename File name.
    */
    function __saveBlobToFile(blob, filename) {
        // if blob is defined
        if (blob != null) {
            // if web browser can save blobs
            if (navigator.msSaveBlob) {
                // save the blob using web browser functionality
                return navigator.msSaveBlob(blob, filename);
            }
            // if web browser CANNOT save blobs
            else {
                // create an object URL
                var url = window.URL.createObjectURL(blob);
                // if object URL is created
                if (url != null) {
                    // create an "A" element
                    var a = document.createElement("a");
                    a.style.display = "none";
                    // if "A" element supports the "download" attribute
                    if ("download" in a) {
                        // create "A" element with "download" attribute for saving a file in browser

                        a.setAttribute("href", url);
                        a.setAttribute("download", filename);
                        document.body.appendChild(a);

                        setTimeout(function () {
                            a.click();
                            a.remove();
                            setTimeout(function () { window.URL.revokeObjectURL(url); }, 250);
                        }, 66);
                    }
                    // if "A" element does NOT support the "download" attribute
                    else {
                        // create iframe for saving a file in browser
                        var frame = document.createElement("iframe");
                        document.body.appendChild(a);
                        frame[0].src = url;

                        setTimeout(function () { frame.remove(); }, 333);
                    }
                }
                // if object URL is NOT created
                else {
                    // show the alert if warning occured
                    showErrorMessageFunc("Error: Object URL is not created.");
                }
            }
        }
        // if blob is NOT created
        else {
            // show the alert if warning occured
            showErrorMessageFunc("Error: Blob is not created.");
        }
    }

    /**
     The request for downloading image file from server is executed successfully.
    */
    function __onDownloadFile_success(data) {
        // get a blob, which contains data of downloading file
        var blob = data.blob;
        // get name of downloading file
        var filename = data.filename;
        __saveBlobToFile(blob, filename);

        // stop the asynchronous operation in document viewer
        _docViewer.finishAsyncOperation("Download file", data);
    }

    /**
     The request for commiting changes in interactive form of PDF document is executed successfully.
    */
    function __onCommitInteractiveFormChanges_success(data) {
        // get image viewer
        var imageViewer = _docViewer.get_ImageViewer();
        // get focused image
        var focusedImage = imageViewer.get_FocusedImage();

        // get the image file ID
        var fileId = focusedImage.get_ImageId();
        if (fileId != null)
            // send the asynchronous request for downloading an image file from server
            Vintasoft.Imaging.VintasoftFileAPI.downloadImageFile(fileId, __onDownloadFile_success, __downloadImageOperation_error);
    }

    /**
     Download file operation is failed.
    */
    function __downloadImageOperation_error(data) {
        // stop the asynchronous operation in document viewer
        _docViewer.failAsyncOperation("Download file", data);
    }

}
