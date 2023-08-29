/**
 A dialog that allows to view and change settings of PDF redaction mark.
*/
PdfRedactionMarkSettingsDialogJS = function (pdfRedactionMark) {

    // create the property grid with information about annotation properties
    var propertyGrid = new Vintasoft.Shared.WebPropertyGridJS(pdfRedactionMark);

    // create the property grid control
    var propertyGridControl = new PropertyGridControlJS(propertyGrid, "redactionMarkPropertyGrid", { showReadOnlyElements: false, hideNestedElements: false });
    propertyGridControl.createMarkup();

    // show the dialog
    $('#pdfRedactionMarkSettingsDialog').modal('show');

}
