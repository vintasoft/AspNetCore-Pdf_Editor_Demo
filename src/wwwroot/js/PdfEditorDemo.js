var _fileService;

var _pdfDocumentEditor;

var _localizer;

var _previouslyUploadedFilesDialog;
var _pdfImageResourceDialog;

var _blockUiDialog;



// === "File" toolbar, "Previously uploaded files" button ===

/**
 Creates UI button for showing the list with previously uploaded files.
*/
function __createPreviouslyUploadedFilesButton() {
    // create the button that allows to show a dialog with previously uploaded image files and select image file
    var button = new Vintasoft.Imaging.UI.UIElements.WebUiButtonJS({
        cssClass: "uploadedFilesList",
        title: "Previously Uploaded Files",
        localizationId: "previousUploadFilesButton",
        onClick: __previousUploadFilesButton_clicked
    });
    return button;
}

function __previousUploadFilesButton_clicked(event, uiElement) {
    var pdfDocumentEditor = uiElement.get_RootControl();
    if (pdfDocumentEditor != null) {
        // if dialog does not exist
        if (_previouslyUploadedFilesDialog == null)
            // create dialog
            _previouslyUploadedFilesDialog = new PreviouslyUploadedFilesDialogJS(_fileService, pdfDocumentEditor, __showErrorMessage);
        // show the dialog
        _previouslyUploadedFilesDialog.show();
    }
}



// === Visual Tools ===

/**
 Creates UI button for activating the visual tool, which allows to pan images in image viewer.
*/
function __createPanToolButton() {
    // if touch device is used
    if (__isTouchDevice()) {
        return new Vintasoft.Imaging.UI.UIElements.WebUiVisualToolButtonJS({
            cssClass: "vsdv-tools-panButton",
            title: "Document navigation, Text selection, Pan, Zoom",
            localizationId: "panToolButton"
        }, "DocumentNavigationTool,TextSelectionTool,PanTool,ZoomTool");
    }
    else {
        return new Vintasoft.Imaging.UI.UIElements.WebUiVisualToolButtonJS({
            cssClass: "vsdv-tools-panButton",
            title: "Document navigation, Text selection, Pan",
            localizationId: "panToolButton"
        }, "DocumentNavigationTool,TextSelectionTool,PanTool");
    }
}

/**
 Initializes visual tools.
 @param {object} pdfDocumentEditor The PDF document editor.
*/
function __initializeVisualTools(pdfDocumentEditor) {
    // get navigation tool
    var documentNavigationTool = pdfDocumentEditor.getVisualToolById("DocumentNavigationTool");
    // create navigation action executor
    var nagivationActionExecutor = new Vintasoft.Imaging.WebNavigationActionExecutorJS();
    // create URI action executor
    var uriActionExecutor = new WebUriActionExecutor();
    // create composite action executor
    var compositeActionExecutor = new Vintasoft.Imaging.WebPageContentActionCompositeExecutorJS([uriActionExecutor, nagivationActionExecutor]);

    // use composite action executer in document navigation tool
    documentNavigationTool.set_ActionExecutor(compositeActionExecutor);
}



// === Init UI ===

/**
 Registers custom UI elements in "WebUiElementsFactoryJS".
*/
function __registerNewUiElements() {
    // register the "Previously uploaded files" button in web UI elements factory
    Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.registerElement("previousUploadFilesButton", __createPreviouslyUploadedFilesButton);

    // register the "Pan" button in web UI elements factory
    Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.registerElement("panToolButton", __createPanToolButton);
}

/**
 Initializes main menu of PDF document editor.
 @param {object} pdfDocumentEditorSettings Settings of PDF document editor.
*/
function __initMenu(pdfDocumentEditorSettings) {
    // get items of PDF document editor
    var items = pdfDocumentEditorSettings.get_Items();

    // get the "File" menu panel
    var fileMenuPanel = items.getItemByRegisteredId("fileToolbarPanel");
    // if menu panel is found
    if (fileMenuPanel != null) {
        // get items of file menu panel
        var fileMenuPanelItems = fileMenuPanel.get_Items();

        // add the "Previous uploaded files" button to the menu panel
        fileMenuPanelItems.insertItem(1, "previousUploadFilesButton");
    }
}

/**
 Initializes side panel of PDF document editor.
 @param {object} pdfDocumentEditorSettings Settings of PDF document editor.
*/
function __initSidePanel(pdfDocumentEditorSettings) {
    // get items of document viewer
    var items = pdfDocumentEditorSettings.get_Items();

    // get the thumbnail viewer panel of document viewer
    var thumbnailViewerPanel = items.getItemByRegisteredId("thumbnailViewerPanel");
    // if panel is found
    if (thumbnailViewerPanel != null) {
        // subscribe to the "actived" event of the thumbnail viewer panel of document viewer
        Vintasoft.Shared.subscribeToEvent(thumbnailViewerPanel, "activated", __thumbnailsPanelActivated);
    }
}

function __pdfDocumentEditor_imageDataReceived(event, contentImage) {
    // if previous image processing dialog exists
    if (_pdfImageResourceDialog != null) {
        // remove dialog from web PDF document editor
        _pdfDocumentEditor.get_Items().removeItem(_pdfImageResourceDialog);
        // destroy dialog
        delete _pdfImageResourceDialog;
        // clear link to dialog
        _pdfImageResourceDialog = null;
    }

    // create dialog to view the PDF image resource info
    _pdfImageResourceDialog = new Vintasoft.Imaging.Pdf.UI.Dialogs.WebUiPdfImageResourceDialogJS(contentImage);
    // add dialog to the PDF document editor
    _pdfDocumentEditor.get_Items().addItem(_pdfImageResourceDialog);
    // localize the dialog
    _localizer.localizeDocument();
    // show dialog
    _pdfImageResourceDialog.show();
}

/**
 Thumbnail viewer panel of document viewer is activated.
*/
function __thumbnailsPanelActivated() {
    var thumbnailViewer = this.get_ThumbnailViewer();
    if (thumbnailViewer != null) {
        // create the progress image
        var progressImage = new Image();
        progressImage.src = __getApplicationUrl() + "Images/fileUploadProgress.gif";
        // specify that the thumbnail viewer must use the progress image for indicating the thumbnail loading progress
        thumbnailViewer.set_ProgressImage(progressImage);

        // additional bottom space for text with page number under thumbnail
        var textCaptionHeight = 18;
        var padding = thumbnailViewer.get_ThumbnailPadding();
        padding[2] += textCaptionHeight
        thumbnailViewer.set_ThumbnailPadding(padding);
        thumbnailViewer.set_DisplayThumbnailCaption(true);
    }
}



// === PDF document editor events ===

/**
 Warning occured in PDF document editor.
*/
function __pdfDocumentEditor_warningOccured(event, eventArgs) {
    // show the alert if warning occured
    __showErrorMessage(eventArgs.message);
};

/**
 Asynchronous operation is started in PDF document editor.
*/
function __pdfDocumentEditor_asyncOperationStarted(event, data) {
    // get description of asynchronous operation
    var description = data.description;
    // for current operations 
    if (description === "Image prepared to print" || description === "Get text region"
        || description === "Get PDF bookmarks" || description === "Get links"
        || description === "Get content images" || description === "Get interactive form") {
        // do not block UI 
    }
    else {
        // block UI
        __blockUI(data.description);
    }
}

/**
 Asynchronous operation is finished in PDF document editor.
*/
function __pdfDocumentEditor_asyncOperationFinished(event, data) {
    // unblock UI
    __unblockUI();
}

/**
 Asynchronous operation is failed in PDF document editor.
*/
function __pdfDocumentEditor_asyncOperationFailed(event, data) {
    // get description of asynchronous operation
    var description = data.description;
    // get additional information about asynchronous operation
    var additionalInfo = data.data;
    // if additional information exists
    if (additionalInfo != null)
        // show error message
        __showErrorMessage(additionalInfo);
    // if additional information does NOT exist
    else
        // show error message
        __showErrorMessage(description + ": unknown error.");
}



// === Utils ===

/**
 Blocks the UI. 
 @param {string} text Message that describes why UI is blocked.
*/
function __blockUI(text) {
    _blockUiDialog = new BlockUiDialogJS(text);
}

/**
 Unblocks the UI.
*/
function __unblockUI() {
    if (_blockUiDialog != null) {
        _blockUiDialog.close();
        _blockUiDialog = null;
    }
}

/**
 Shows an error message.
 @param {object} data Information about error.
*/
function __showErrorMessage(data) {
    __unblockUI();
    new ErrorMessageDialogJS(data);
}

/**
 Returns application URL.
*/
function __getApplicationUrl() {
    var applicationUrl = window.location.toString();
    if (applicationUrl[applicationUrl.length - 1] != '/')
        applicationUrl = applicationUrl + '/';
    return applicationUrl;
}



// === Localization ===

/**
 Creates the dictionary for localization of application UI.
*/
function __createUiLocalizationDictionary() {
    var tempDialogs = [];
    __createPdfDocumentEditorDialogsForLocalization(tempDialogs);

    var localizationDict = _localizer.getDocumentLocalizationDictionary();
    var localizationDictString = JSON.stringify(localizationDict, null, '\t');
    console.log(localizationDictString);

    var floatingContainer = document.getElementById("pdfDocumentEditorContainer");
    for (var i = 0; i < tempDialogs.length; i++) {
        floatingContainer.removeChild(tempDialogs[i].get_DomElement());
        delete tempDialogs[i];
    }
}

/**
 Creates the dialogs, which are used in web PDF document editor, for localization.
*/
function __createPdfDocumentEditorDialogsForLocalization(tempDialogs) {
    var floatingContainer = document.getElementById("pdfDocumentEditorContainer");

    // create a temporary document password dialog - dialog is necessary for localization purposes only
    var documentPasswordDialog = new Vintasoft.Imaging.UI.Dialogs.WebUiDocumentPasswordDialogJS();
    documentPasswordDialog.render(floatingContainer);
    tempDialogs.push(documentPasswordDialog);

    // create a temporary image selection dialog - dialog is necessary for localization purposes only
    var imageSelectionDialog = new Vintasoft.Imaging.UI.Dialogs.WebImageSelectionDialogJS();
    imageSelectionDialog.render(floatingContainer);
    tempDialogs.push(imageSelectionDialog);

    // create a temporary print images dialog - dialog is necessary for localization purposes only
    var printImagesDialog = new Vintasoft.Imaging.UI.Dialogs.WebPrintImagesDialogJS();
    printImagesDialog.render(floatingContainer);
    tempDialogs.push(printImagesDialog);

    // create a temporary image viewer setting dialog - dialog is necessary for localization purposes only
    var imageViewerSettingsDialog = new Vintasoft.Imaging.UI.Dialogs.WebImageViewerSettingsDialogJS();
    imageViewerSettingsDialog.render(floatingContainer);
    tempDialogs.push(imageViewerSettingsDialog);

    // create a temporary thumbnail viewer setting dialog - dialog is necessary for localization purposes only
    var thumbnailViewerSettingsDialog = new Vintasoft.Imaging.UI.Dialogs.WebThumbnailViewerSettingsDialogJS();
    thumbnailViewerSettingsDialog.render(floatingContainer);
    tempDialogs.push(thumbnailViewerSettingsDialog);

    // create a temporary PDF redaction mark appearance dialog - dialog is necessary for localization purposes only
    var pdfRedactionMarkAppearanceDialog = new Vintasoft.Imaging.Pdf.UI.Dialogs.WebPdfRedactionMarkAppearanceDialogJS();
    pdfRedactionMarkAppearanceDialog.render(floatingContainer);
    tempDialogs.push(pdfRedactionMarkAppearanceDialog);

    // create a temporary PDF image resource dialog - dialog is necessary for localization purposes only
    var pdfImageResourceDialog = new Vintasoft.Imaging.Pdf.UI.Dialogs.WebUiPdfImageResourceDialogJS();
    pdfImageResourceDialog.render(floatingContainer);
    tempDialogs.push(pdfImageResourceDialog);

    // create a temporary PDF/A conversion and validation dialog - dialog is necessary for localization purposes only
    var pdfAConversionAndValidationDialog = new Vintasoft.Imaging.Pdf.UI.Dialogs.WebUiPdfAConversionAndValidationDialogJS();
    pdfAConversionAndValidationDialog.render(floatingContainer);
    tempDialogs.push(pdfAConversionAndValidationDialog);

    // create a temporary PDF document compressor dialog - dialog is necessary for localization purposes only
    var pdfDocumentCompressDialog = new Vintasoft.Imaging.Pdf.UI.Dialogs.WebPdfDocumentCompressorDialogJS();
    pdfDocumentCompressDialog.render(floatingContainer);
    tempDialogs.push(pdfDocumentCompressDialog);

    // create a temporary export file setting dialog - dialog is necessary for localization purposes only
    var exportFileSettingsDialog = new Vintasoft.Imaging.UI.Dialogs.WebExportFileSettingsDialogJS();
    exportFileSettingsDialog.render(floatingContainer);
    tempDialogs.push(exportFileSettingsDialog);

    // create a temporary thumbnail viewer context menu panel - panel is necessary for localization purposes only
    var thumbnailViewerContextMenu = new Vintasoft.Imaging.UI.UIElements.WebThumbnailViewerContextMenuJS(_pdfDocumentEditor._thumbnailViewer, {});
    thumbnailViewerContextMenu.render(floatingContainer);
    tempDialogs.push(thumbnailViewerContextMenu);
}

/**
 Enables the localization of application UI.
*/
function __enableUiLocalization() {
    // if localizer is ready (localizer loaded localization dictionary)
    if (_localizer.get_IsReady()) {
        // localize DOM-elements of web page
        _localizer.localizeDocument();
    }
    // if localizer is NOT ready
    else
        // wait when localizer will be ready
        Vintasoft.Shared.subscribeToEvent(_localizer, "ready", function () {
            // localize DOM-elements of web page
            _localizer.localizeDocument();
        });

    // subscribe to the "dialogShown" event of PDF document editor
    Vintasoft.Shared.subscribeToEvent(_pdfDocumentEditor, "dialogShown", function (event, data) {
        _localizer.localizeDocument();
    });
}

/**
 Returns a value indicating whether touch device is used.
*/
function __isTouchDevice() {
    return (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
}



// === Main ===

/**
 Main function.
*/
function __main() {
    // set the session identifier
    var hiddenSessionFieldElement = document.getElementById('hiddenSessionField');
    Vintasoft.Shared.WebImagingEnviromentJS.set_SessionId(hiddenSessionFieldElement.value);

    // specify web services, which should be used in this demo

    _fileService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftFileApi");

    Vintasoft.Shared.WebServiceJS.defaultFileService = _fileService;
    Vintasoft.Shared.WebServiceJS.defaultImageCollectionService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftImageCollectionApi");
    Vintasoft.Shared.WebServiceJS.defaultImageService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftImageApi");
    Vintasoft.Shared.WebServiceJS.defaultPdfService = new Vintasoft.Shared.WebServiceControllerJS(__getApplicationUrl() + "vintasoft/api/MyVintasoftPdfApi");

    // create UI localizer
    _localizer = new Vintasoft.Shared.VintasoftLocalizationJS();

    // register new UI elements
    __registerNewUiElements();

    // create the PDF document editor settings
    var pdfDocumentEditorSettings = new Vintasoft.Imaging.Pdf.UI.WebPdfDocumentEditorControlSettingsJS("pdfDocumentEditorContainer", "pdfDocumentEditor");

    // initialize main menu of PDF document editor
    __initMenu(pdfDocumentEditorSettings);
    // initialize side panel of PDF document editor
    __initSidePanel(pdfDocumentEditorSettings);

    // create the PDF document editor
    _pdfDocumentEditor = new Vintasoft.Imaging.Pdf.UI.WebPdfDocumentEditorControlJS(pdfDocumentEditorSettings);

    // subscribe to the "warningOccured" event of PDF document editor
    Vintasoft.Shared.subscribeToEvent(_pdfDocumentEditor, "warningOccured", __pdfDocumentEditor_warningOccured);
    // subscribe to the "asyncOperationStarted"" event of PDF document editor
    Vintasoft.Shared.subscribeToEvent(_pdfDocumentEditor, "asyncOperationStarted", __pdfDocumentEditor_asyncOperationStarted);
    // subscribe to the "asyncOperationFinished"" event of PDF document editor
    Vintasoft.Shared.subscribeToEvent(_pdfDocumentEditor, "asyncOperationFinished", __pdfDocumentEditor_asyncOperationFinished);
    // subscribe to the "asyncOperationFailed"" event of PDF document editor
    Vintasoft.Shared.subscribeToEvent(_pdfDocumentEditor, "asyncOperationFailed", __pdfDocumentEditor_asyncOperationFailed);
    // subscribe to the "imageDataReceived"" event of PDF document editor
    Vintasoft.Shared.subscribeToEvent(_pdfDocumentEditor, "imageDataReceived", __pdfDocumentEditor_imageDataReceived);

    // initialize visual tools
    __initializeVisualTools(_pdfDocumentEditor);

    // get the image viewer of PDF document editor
    var imageViewer1 = _pdfDocumentEditor.get_ImageViewer();
    // specify that image viewer must show images in the single continuous column mode
    imageViewer1.set_DisplayMode(new Vintasoft.Imaging.WebImageViewerDisplayModeEnumJS("SingleContinuousColumn"));
    // specify that image viewer must show images in the fit width mode
    imageViewer1.set_ImageSizeMode(new Vintasoft.Imaging.WebImageSizeModeEnumJS("FitToWidth"));

    // create the progress image
    var progressImage = new Image();
    progressImage.src = __getApplicationUrl() + "Images/fileUploadProgress.gif";
    // specify that the image viewer must use the progress image for indicating the image loading progress
    imageViewer1.set_ProgressImage(progressImage);

    // names of visual tools in composite visual tool
    var visualToolNames = "DocumentNavigationTool,TextSelectionTool,PanTool";
    // if touch device is used
    if (__isTouchDevice()) {
        // get zoom tool from document viewer
        var zoomTool = _pdfDocumentEditor.getVisualToolById("ZoomTool");
        // specify that zoom tool should not disable context menu
        zoomTool.set_DisableContextMenu(false);

        // add name of zoom tool to the names of visual tools of composite visual tool
        visualToolNames = visualToolNames + ",ZoomTool";
    }
    // get the visual tool, which allows to select text
    var visualTool = _pdfDocumentEditor.getVisualToolById(visualToolNames);
    // set the visual tool as active visual tool in image viewer
    _pdfDocumentEditor.set_CurrentVisualTool(visualTool);

    // copy the default file to the uploaded image files directory and open the file
    var openFileHelper = new OpenFileHelperJS(_pdfDocumentEditor, __showErrorMessage);
    openFileHelper.openDefaultPdfFile();

    $(document).ready(function () {
        //// create the dictionary for localization of application UI
        //__createUiLocalizationDictionary();

        // enable the localization of application UI
        __enableUiLocalization();
    });
}



// run main function
__main();
