var _fileService;

var _docViewer;

var _localizer;

var _openFileHelper;

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
    var docViewer = uiElement.get_RootControl();
    if (docViewer != null) {
        // if dialog does not exist
        if (_previouslyUploadedFilesDialog == null)
            // create dialog
            _previouslyUploadedFilesDialog = new PreviouslyUploadedFilesDialogJS(_fileService, docViewer, _openFileHelper, __showErrorMessage);
        // show the dialog
        _previouslyUploadedFilesDialog.show();
    }
}



// === "Tools" toolbar ===

/**
 Creates UI button for activating the visual tool, which allows to navigate and select text in image viewer.
*/
function __createNavigationAndTextSelectionToolButton() {
    return new Vintasoft.Imaging.DocumentViewer.UIElements.WebUiVisualToolButtonJS({
        cssClass: "vsdv-tools-textSelectionToolButton",
        title: "Text Selection",
        localizationId: "textSelectionToolButton"
    }, "DocumentNavigationTool,TextSelectionTool");
}



// === Init UI ===

/**
 Registers custom UI elements in "WebUiElementsFactoryJS".
*/
function __registerNewUiElements() {
    // register the "Previously uploaded files" button in web UI elements factory
    Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.registerElement("previousUploadFilesButton", __createPreviouslyUploadedFilesButton);

    // register the "TextSelectionTool" button in web UI elements factory
    Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.registerElement("textSelectionToolButton", __createNavigationAndTextSelectionToolButton);
}

/**
 Initializes main menu of document viewer.
 @param {object} docViewerSettings Settings of document viewer.
*/
function __initMenu(docViewerSettings) {
    // get items of document viewer
    var items = docViewerSettings.get_Items();

    var uploadFileButton = items.getItemByRegisteredId("uploadFileButton");
    if (uploadFileButton != null)
        uploadFileButton.set_FileExtensionFilter(".pdf");

    // get the main menu of document viewer
    var mainMenu = items.getItemByRegisteredId("mainMenu");
    // if main menu is found
    if (mainMenu != null) {
        // get items of main menu
        var mainMenuItems = mainMenu.get_Items();

        // get the "Visual tools" menu panel
        var toolsSubmenu = mainMenuItems.getItemByRegisteredId("toolsMenuPanel");
        // if menu panel is found
        if (toolsSubmenu != null) {
            toolsSubmenuItems = toolsSubmenu.get_Items();

            toolsSubmenuItems.clearItems();

            toolsSubmenuItems.addItem("panToolButton");
            toolsSubmenuItems.addItem("textSelectionToolButton");
            toolsSubmenuItems.addItem("pdfImageExtractorToolButton");
            toolsSubmenuItems.addItem("pdfInteractiveFormToolButton");
        }

        // add "PdfRedactionMarks" menu panel
        mainMenuItems.addItem("pdfRedactionMenuPanel");
    }

    // get the "File" menu panel
    var fileMenuPanel = items.getItemByRegisteredId("fileToolbarPanel");
    // if menu panel is found
    if (fileMenuPanel != null) {
        // get items of file menu panel
        var fileMenuPanelItems = fileMenuPanel.get_Items();

        // get the "Upload file" button
        var uploadFileButton = fileMenuPanelItems.getItem(0);
        // specify that file must be uploaded but not opened when "Upload file" button is clicked, file will be opened later
        uploadFileButton.set_OpenFile(false);

        // add the "Previous uploaded files" button to the menu panel
        fileMenuPanelItems.insertItem(1, "previousUploadFilesButton");
    }
}

/**
 Initializes side panel of document viewer.
 @param {object} docViewerSettings Settings of document viewer.
*/
function __initSidePanel(docViewerSettings) {
    // get items of document viewer
    var items = docViewerSettings.get_Items();

    var sidePanel = items.getItemByRegisteredId("sidePanel");
    if (sidePanel != null) {
        var sidePanelItems = sidePanel.get_PanelsCollection();
        sidePanelItems.addItem("pdfBookmarksPanel");


        var textSelectionPanel = Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.createElementById("textSelectionPanel");
        Vintasoft.Shared.subscribeToEvent(textSelectionPanel, "stateChanged", __textSelectionPanel_stateChanged);
        sidePanelItems.addItem(textSelectionPanel);


        var textSearchPanel = Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.createElementById("textSearchPanel");
        Vintasoft.Shared.subscribeToEvent(textSearchPanel, "stateChanged", __textSearchPanel_stateChanged);
        sidePanelItems.addItem(textSearchPanel);


        var pdfImageResourceExtractionPanel = Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.createElementById("pdfImageResourceExtractionPanel");
        Vintasoft.Shared.subscribeToEvent(pdfImageResourceExtractionPanel, "imageDataReceived", __pdfImageResourceExtractionPanel_imageDataReceived);
        Vintasoft.Shared.subscribeToEvent(pdfImageResourceExtractionPanel, "stateChanged", __pdfImageResourceExtractionPanel_stateChanged);
        sidePanelItems.addItem(pdfImageResourceExtractionPanel);


        var pdfInteractiveFormFieldsPanel = Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.createElementById("pdfInteractiveFormFieldsPanel");
        Vintasoft.Shared.subscribeToEvent(pdfInteractiveFormFieldsPanel, "stateChanged", __pdfInteractiveFormFieldsPanel_stateChanged);
        sidePanelItems.addItem(pdfInteractiveFormFieldsPanel);


        var pdfRedactionMarksPanel = Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.createElementById("pdfRedactionMarkListPanel");
        Vintasoft.Shared.subscribeToEvent(pdfRedactionMarksPanel, "stateChanged", __pdfRedactionMarksPanel_stateChanged);
        sidePanelItems.addItem(pdfRedactionMarksPanel);
    }

    // get the thumbnail viewer panel of document viewer
    var thumbnailViewerPanel = items.getItemByRegisteredId("thumbnailViewerPanel");
    // if panel is found
    if (thumbnailViewerPanel != null)
        // subscribe to the "actived" event of the thumbnail viewer panel of document viewer
        Vintasoft.Shared.subscribeToEvent(thumbnailViewerPanel, "activated", __thumbnailsPanelActivated);
}

/**
 Activates the visual tool when panel becomes active.
 @param {object} panel UI panel.
 @param {object} panelState Panel state.
 @param {string} toolId ID of visual tool.
 */
function __activateToolWhenPanelBecomeActive(panel, panelState, toolId) {
    if (panelState.get_Name() === "active") {
        var docViewer = panel.get_RootControl();
        var tool = docViewer.getVisualToolById(toolId);
        docViewer.set_CurrentVisualTool(tool);
    }
}



// === Init UI, Text selection panel ===

function __textSelectionPanel_stateChanged(event, eventArgs) {
    __activateToolWhenPanelBecomeActive(this, eventArgs.newState, "DocumentNavigationTool,TextSelectionTool");
}



// === Init UI, Text search panel ===

function __textSearchPanel_stateChanged(event, eventArgs) {
    __activateToolWhenPanelBecomeActive(this, eventArgs.newState, "DocumentNavigationTool,TextSelectionTool");
}



// === Init UI, PDF image-resource extraction panel ===

function __pdfImageResourceExtractionPanel_imageDataReceived(event, contentImage) {
    // if previous image processing dialog exists
    if (_pdfImageResourceDialog != null) {
        // remove dialog from web document viewer
        _docViewer.get_Items().removeItem(_pdfImageResourceDialog);
        // destroy dialog
        delete _pdfImageResourceDialog;
        // clear link to dialog
        _pdfImageResourceDialog = null;
    }

    // create dialog to view the PDF image resource info
    _pdfImageResourceDialog = new Vintasoft.Imaging.DocumentViewer.Dialogs.WebUiPdfImageResourceDialogJS(contentImage);
    // add dialog to the document viewer
    _docViewer.get_Items().addItem(_pdfImageResourceDialog);
    // localize the dialog
    _localizer.localizeDocument();
    // show dialog
    _pdfImageResourceDialog.show();
}

function __pdfImageResourceExtractionPanel_stateChanged(event, eventArgs) {
    __activateToolWhenPanelBecomeActive(this, eventArgs.newState, "PdfImageExtractorTool");
}



// === Init UI, PDF interactive form fields panel ===

function __pdfInteractiveFormFieldsPanel_stateChanged(event, eventArgs) {
    __activateToolWhenPanelBecomeActive(this, eventArgs.newState, "PdfInteractiveFormTool");
}



// === Init UI, PDF redaction marks panel ===

function __pdfRedactionMarksPanel_stateChanged(event, eventArgs) {
    __activateToolWhenPanelBecomeActive(this, eventArgs.newState, "PdfRemoveContentTool");
}



// Init UI, thumbnails panel

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



// === Visual Tools ===

/**
 Initializes visual tools.
 @param {object} docViewer The document viewer.
*/
function __initializeVisualTools(docViewer) {
    // get navigation tool
    var documentNavigationTool = docViewer.getVisualToolById("DocumentNavigationTool");
    // create navigation action executor
    var nagivationActionExecutor = new Vintasoft.Imaging.WebNavigationActionExecutorJS();
    // create URI action executor
    var uriActionExecutor = new WebUriActionExecutor();
    // create composite action executor
    var compositeActionExecutor = new Vintasoft.Imaging.WebPageContentActionCompositeExecutorJS([uriActionExecutor, nagivationActionExecutor]);

    // use composite action executer in document navigation tool
    documentNavigationTool.set_ActionExecutor(compositeActionExecutor);
}



// === Document viewer events ===

/**
 Warning occured in document viewer.
*/
function __docViewer_warningOccured(event, eventArgs) {
    // show the alert if warning occured
    __showErrorMessage(eventArgs.message);
};

/**
 Asynchronous operation is started in document viewer.
*/
function __docViewer_asyncOperationStarted(event, data) {
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
 Asynchronous operation is finished in document viewer.
*/
function __docViewer_asyncOperationFinished(event, data) {
    // unblock UI
    __unblockUI();
}

/**
 Asynchronous operation is failed in document viewer.
*/
function __docViewer_asyncOperationFailed(event, data) {
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

/**
 Document viewer sends a request for file authentication.
*/
function __docViewer_fileAuthenticationRequest(event, eventArgs) {
    // specify that we processed the event and web document viewer does not need to show standard password dialog
    eventArgs.handled = true;

    // open document password dialog
    _openFileHelper.showPasswordDialog(eventArgs.fileId);
}

/**
 File is opened in document viewer.
*/
function __docViewer_fileOpened(event, data) {
    // open PDF document
    _openFileHelper.openPdfDocument(data.fileId, data.filePassword);
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
    __createDocumentViewerDialogsForLocalization(tempDialogs);

    var localizationDict = _localizer.getDocumentLocalizationDictionary();
    var localizationDictString = JSON.stringify(localizationDict, null, '\t');
    console.log(localizationDictString);

    var floatingContainer = document.getElementById("documentViewerContainer");
    for (var i = 0; i < tempDialogs.length; i++) {
        floatingContainer.removeChild(tempDialogs[i].get_DomElement());
        delete tempDialogs[i];
    }
}

/**
 Creates the dialogs, which are used in Web Document Viewer, for localization.
*/
function __createDocumentViewerDialogsForLocalization(tempDialogs) {
    var floatingContainer = document.getElementById("documentViewerContainer");

    var documentPasswordDialog = new Vintasoft.Imaging.DocumentViewer.Dialogs.WebUiDocumentPasswordDialogJS();
    documentPasswordDialog.render(floatingContainer);
    tempDialogs.push(documentPasswordDialog);

    var imageSelectionDialog = new Vintasoft.Imaging.DocumentViewer.Dialogs.WebImageSelectionDialogJS();
    imageSelectionDialog.render(floatingContainer);
    tempDialogs.push(imageSelectionDialog);

    var printImagesDialog = new Vintasoft.Imaging.DocumentViewer.Dialogs.WebPrintImagesDialogJS();
    printImagesDialog.render(floatingContainer);
    tempDialogs.push(printImagesDialog);

    var imageViewerSettingsDialog = new Vintasoft.Imaging.DocumentViewer.Dialogs.WebImageViewerSettingsDialogJS();
    imageViewerSettingsDialog.render(floatingContainer);
    tempDialogs.push(imageViewerSettingsDialog);

    var thumbnailViewerSettingsDialog = new Vintasoft.Imaging.DocumentViewer.Dialogs.WebThumbnailViewerSettingsDialogJS();
    thumbnailViewerSettingsDialog.render(floatingContainer);
    tempDialogs.push(thumbnailViewerSettingsDialog);

    var pdfRedactionMarkAppearanceDialog = new Vintasoft.Imaging.DocumentViewer.Dialogs.WebPdfRedactionMarkAppearanceDialogJS();
    pdfRedactionMarkAppearanceDialog.render(floatingContainer);
    tempDialogs.push(pdfRedactionMarkAppearanceDialog);

    var pdfImageResourceDialog = new Vintasoft.Imaging.DocumentViewer.Dialogs.WebUiPdfImageResourceDialogJS();
    pdfImageResourceDialog.render(floatingContainer);
    tempDialogs.push(pdfImageResourceDialog);

    var exportFileSettingsDialog = new Vintasoft.Imaging.DocumentViewer.Dialogs.WebExportFileSettingsDialogJS();
    exportFileSettingsDialog.render(floatingContainer);
    tempDialogs.push(exportFileSettingsDialog);
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

    // subscribe to the "dialogShown" event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "dialogShown", function (event, data) {
        _localizer.localizeDocument();
    });
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

    // create the document viewer settings
    var docViewerSettings = new Vintasoft.Imaging.DocumentViewer.WebDocumentViewerSettingsJS("documentViewerContainer", "documentViewer");
    // specify that document viewer should show "Export and download file" button instead of "Download file" button
    docViewerSettings.set_CanExportAndDownloadFile(true);
    docViewerSettings.set_CanDownloadFile(false);

    // initialize main menu of document viewer
    __initMenu(docViewerSettings);

    // initialize side panel of document viewer
    __initSidePanel(docViewerSettings);

    // create the document viewer
    _docViewer = new Vintasoft.Imaging.DocumentViewer.WebDocumentViewerJS(docViewerSettings);

    // subscribe to the fileAuthenticationRequest event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "fileAuthenticationRequest", __docViewer_fileAuthenticationRequest);
    // subscribe to the fileOpened event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "fileOpened", __docViewer_fileOpened);
    // subscribe to the "warningOccured" event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "warningOccured", __docViewer_warningOccured);
    // subscribe to the asyncOperationStarted event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "asyncOperationStarted", __docViewer_asyncOperationStarted);
    // subscribe to the asyncOperationFinished event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "asyncOperationFinished", __docViewer_asyncOperationFinished);
    // subscribe to the asyncOperationFailed event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "asyncOperationFailed", __docViewer_asyncOperationFailed);

    // initialize visual tools
    __initializeVisualTools(_docViewer);

    // get the image viewer of document viewer
    var imageViewer1 = _docViewer.get_ImageViewer();
    // specify that image viewer must show images in the single continuous column mode
    imageViewer1.set_DisplayMode(new Vintasoft.Imaging.WebImageViewerDisplayModeEnumJS("SingleContinuousColumn"));
    // specify that image viewer must show images in the fit width mode
    imageViewer1.set_ImageSizeMode(new Vintasoft.Imaging.WebImageSizeModeEnumJS("FitToWidth"));

    // create the progress image
    var progressImage = new Image();
    progressImage.src = __getApplicationUrl() + "Images/fileUploadProgress.gif";
    // specify that the image viewer must use the progress image for indicating the image loading progress
    imageViewer1.set_ProgressImage(progressImage);

    // get the visual tool, which allows to select text
    var visualTool = _docViewer.getVisualToolById("DocumentNavigationTool,TextSelectionTool");
    // set the visual tool as active visual tool in image viewer
    _docViewer.set_CurrentVisualTool(visualTool);

    // copy the default file to the uploaded image files directory and open the file
    _openFileHelper = new OpenFileHelperJS(_docViewer, __showErrorMessage);
    _openFileHelper.openDefaultPdfFile();

    $(document).ready(function () {
        //// create the dictionary for localization of application UI
        //__createUiLocalizationDictionary();

        // enable the localization of application UI
        __enableUiLocalization();
    });
}



// run main function
__main();
