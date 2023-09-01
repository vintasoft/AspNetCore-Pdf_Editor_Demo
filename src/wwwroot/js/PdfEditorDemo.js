var _fileService;

var _docViewer;

var _openFileHelper;

var _previouslyUploadedFilesDialog;

var _imageViewerSettingsDialog;

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



// === "View" toolbar ===

/**
 Creates UI button that shows image viewer settings dialog.
*/
function __createImageViewerSettingsButton() {
    // create the button that allows to show a dialog with image viewer settings
    return new Vintasoft.Imaging.UI.UIElements.WebUiButtonJS({
        cssClass: "vsdv-imageViewerSettingsButton",
        title: "Show Image Viewer Settings",
        localizationId: "imageViewerSettingsButton",
        onClick: __imageViewerSettingsButton_clicked
    });
}

function __imageViewerSettingsButton_clicked(event, uiElement) {
    var docViewer = uiElement.get_RootControl();
    if (docViewer != null) {
        var imageViewer = docViewer.get_ImageViewer();
        if (imageViewer != null) {
            if (_imageViewerSettingsDialog == null)
                _imageViewerSettingsDialog = new ImageViewerSettingsDialogJS(imageViewer);
            _imageViewerSettingsDialog.show();
        }
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
    var downloadPdfFileHelper = new DownloadPdfFileHelperJS(__showErrorMessage);

    // register the "Previously uploaded files" button in web UI elements factory
    Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.registerElement("previousUploadFilesButton", __createPreviouslyUploadedFilesButton);
    // override the "Download image" button in web UI elements factory
    Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.registerElement("downloadFileButton", downloadPdfFileHelper.createDownloadPdfFileWithFilledFieldsButton);

    // register the "Image viewer settings" button in web UI elements factory
    Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.registerElement("imageViewerSettingsButton", __createImageViewerSettingsButton);

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

    // get the "View" menu panel
    var viewMenuPanel = items.getItemByRegisteredId("viewMenuPanel");
    // if menu panel is found
    if (viewMenuPanel != null) {
        // get items of menu panel
        var viewMenuPanelItems = viewMenuPanel.get_Items();
        // add the "Image viewer settings" button to the menu panel
        viewMenuPanelItems.insertItem(viewMenuPanelItems.get_Count() - 1, "imageViewerSettingsButton");
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
        textSearchPanel.set_CreatePageResultHeaderContentCallback(__createPageSearchResultHeaderContent);
        Vintasoft.Shared.subscribeToEvent(textSearchPanel, "stateChanged", __textSearchPanel_stateChanged);
        sidePanelItems.addItem(textSearchPanel);


        var pdfImageResourceExtractionPanel = Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.createElementById("pdfImageResourceExtractionPanel");
        pdfImageResourceExtractionPanel.set_ContentImageDescriptionCallback(__getDescriptionForContentImage);
        Vintasoft.Shared.subscribeToEvent(pdfImageResourceExtractionPanel, "imageDataReceived", __pdfImageResourceExtractionPanel_imageDataReceived);
        Vintasoft.Shared.subscribeToEvent(pdfImageResourceExtractionPanel, "stateChanged", __pdfImageResourceExtractionPanel_stateChanged);
        sidePanelItems.addItem(pdfImageResourceExtractionPanel);


        var pdfInteractiveFormFieldsPanel = Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.createElementById("pdfInteractiveFormFieldsPanel");
        pdfInteractiveFormFieldsPanel.set_CreateInteractionFieldContentCallback(__createInteractionFieldContent);
        pdfInteractiveFormFieldsPanel.set_CreatePageFieldsHeaderContentCallback(__createPageFieldsHeaderContent);
        Vintasoft.Shared.subscribeToEvent(pdfInteractiveFormFieldsPanel, "stateChanged", __pdfInteractiveFormFieldsPanel_stateChanged);
        sidePanelItems.addItem(pdfInteractiveFormFieldsPanel);


        var pdfRedactionMarksPanel = Vintasoft.Imaging.UI.UIElements.WebUiElementsFactoryJS.createElementById("pdfRedactionMarkListPanel");
        // set the callback function for creating record for redaction mark
        pdfRedactionMarksPanel.set_CreateRedactionMarkContentCallback(__createContentForRedactionMarkRecord);
        pdfRedactionMarksPanel.set_CreateCollectionHeaderContentCallback(__createContentForRedactionMarksCollectionHeader);
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

/**
 Returns UI elements, which display information about image page search result.
 @param {any} image Image, where text was searched.
 @param {any} imageIndex The zero-based index of the image in the collection.
 @param {any} searchResults Search result.
*/
function __createPageSearchResultHeaderContent(image, imageIndex, searchResults) {
    return [new Vintasoft.Imaging.UI.UIElements.WebUiLabelElementJS({ text: "Page # " + (imageIndex + 1), css: { cursor: "pointer" } })];
}



// === Init UI, PDF image-resource extraction panel ===

function __pdfImageResourceExtractionPanel_imageDataReceived(event, contentImage) {
    new PdfImageResourceDialogJS(contentImage);
}

function __pdfImageResourceExtractionPanel_stateChanged(event, eventArgs) {
    __activateToolWhenPanelBecomeActive(this, eventArgs.newState, "PdfImageExtractorTool");
}

/**
 Returns description for specified content image.
 @param {object} contentImage Content image.
 @returns {string} Description.
*/
function __getDescriptionForContentImage(contentImage) {
    // get image resource
    var resource = contentImage.get_Resource();
    // get image size
    var imageSize = resource.get_Size();
    // create text
    var text = "#" + resource.get_ObjectNumber() + ", " + imageSize.width + "x" + imageSize.height + "px, ";
    text += "Compression=" + resource.get_Compression() + ", " + resource.get_Length() + " bytes";
    // return text
    return text;
}



// === Init UI, PDF interactive form fields panel ===

function __pdfInteractiveFormFieldsPanel_stateChanged(event, eventArgs) {
    __activateToolWhenPanelBecomeActive(this, eventArgs.newState, "PdfInteractiveFormTool");
}

/**
 Returns UI elements, which display information about PDF interactive field.
 @param {any} field PDF interactive field.
*/
function __createInteractionFieldContent(field) {
    var name = field.get_PartialName();
    if (name === "")
        name = field.get_Type();

    var label = new Vintasoft.Imaging.UI.UIElements.WebUiLabelElementJS({ text: name });

    // create annotation properties button
    var settingsButton = new Vintasoft.Imaging.UI.UIElements.WebUiButtonJS({
        cssClass: "fieldSettingsButton",
        title: "Interactive field properties",
        onClick: function () {
            __showInteractiveFieldPropertyGrid(field);
        }
    });

    return [label, settingsButton];
}

/**
 Returns UI elements, which display information about page header when information about interactive fields is grouped by pages.
 @param {any} image Image, where text was searched.
 @param {any} imageIndex The zero-based index of the image in the collection.
*/
function __createPageFieldsHeaderContent(image, imageIndex) {
    return [new Vintasoft.Imaging.UI.UIElements.WebUiLabelElementJS({ text: "Page # " + (imageIndex + 1), css: { cursor: "pointer" } })];
}

/**
 Shows the property grid dialog with information about interactive field.
 @param {object} pdfInteractiveField The interactive field, which should be shown in property grid dialog.
*/
function __showInteractiveFieldPropertyGrid(pdfInteractiveField) {
    new PdfInteractiveFieldSettingsDialogJS(pdfInteractiveField);
}



// === Init UI, PDF redaction marks panel ===

function __pdfRedactionMarksPanel_stateChanged(event, eventArgs) {
    __activateToolWhenPanelBecomeActive(this, eventArgs.newState, "PdfRemoveContentTool");
}

/**
 Returns UI elements, which will display information about redaction mark. 
 @param {object} redactionMark Redaction mark.
 @param {object} collection Collection of redaction marks.
 */
function __createContentForRedactionMarkRecord(redactionMark, collection) {
    // get mark type
    var markName = redactionMark.get_MarkType();
    // create label
    var nameLabel = new Vintasoft.Imaging.UI.UIElements.WebUiLabelElementJS({ text: markName.toString(), cssClass: "mark-type" });
    // create redaction mark properties button
    var redactionMarkSettingsButton = new Vintasoft.Imaging.UI.UIElements.WebUiButtonJS({
        cssClass: "redactionMarkSettingsButton",
        title: "PDF redaction mark properties",
        onClick: function () {
            __showRedactionMarkPropertyGrid(redactionMark);
        }
    });

    // return elements
    return [nameLabel, redactionMarkSettingsButton];
}

/**
 Returns UI elements, which will display information about redaction marks collection. 
 @param {object} collection Redaction marks collection.
 @param {number} index Zero-based index of redaction marks collection.
 */
function __createContentForRedactionMarksCollectionHeader(collection, index) {
    var text = "Page #" + (index + 1) + " [" + collection.get_Count() + "]";
    return [new Vintasoft.Imaging.UI.UIElements.WebUiLabelElementJS({ text: text })];
}

/**
 Shows the property grid dialog with information about redaction mark.
 @param {object} pdfRedactionMark Redaction mark, which should be shown in property grid dialog.
*/
function __showRedactionMarkPropertyGrid(pdfRedactionMark) {
    new PdfRedactionMarkSettingsDialogJS(pdfRedactionMark);
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
    var panTool = docViewer.getVisualToolById("PanTool");
    var panCursorUrl = __getApplicationUrl() + 'Content/Cursors/CloseHand.cur';
    var panCursor = "url('" + panCursorUrl  + "'), auto";

    panTool.set_Cursor("pointer");
    panTool.set_ActionCursor(panCursor);

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
 Document viewer shown the "standard" dialog.
*/
function __docViewer_dialogShown(event, data) {
    // shown dialog
    var dialog = data.dialog;

    // add color picker to the color inputs in document viewer
    __addColorPickerToColorInputs();
}

/**
 Document viewer sends a request for file authentication.
*/
function __docViewer_fileAuthenticationRequest(event, eventArgs) {
    // specify that processed the event and web document viewer does not need to show standard password dialog
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
 Adds color picker to the color inputs in document viewer.
*/
function __addColorPickerToColorInputs() {
    $(".vsdv-colorInput").colorpicker({ format: 'rgba' });
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

    // register new UI elements
    __registerNewUiElements();

    // create the document viewer settings
    var docViewerSettings = new Vintasoft.Imaging.DocumentViewer.WebDocumentViewerSettingsJS("documentViewerContainer", "documentViewer");

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
    // subscribe to the dialogShown event of document viewer
    Vintasoft.Shared.subscribeToEvent(_docViewer, "dialogShown", __docViewer_dialogShown);

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
        // add color picker to the color inputs in document viewer
        __addColorPickerToColorInputs();
    });
}



// run main function
__main();
