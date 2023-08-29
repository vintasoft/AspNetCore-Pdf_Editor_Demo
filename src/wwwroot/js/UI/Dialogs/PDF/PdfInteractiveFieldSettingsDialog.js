/**
 A dialog that allows to view and change settings of PDF interactive field.
*/
PdfInteractiveFieldSettingsDialogJS = function (pdfInteractiveField) {

    var blackList = ["get_Parent", "get_PdfDocument", "get_ObjectNumber"];
    // create the property grid with information about interactive field properties
    var propertyGrid = new Vintasoft.Shared.WebPropertyGridJS(pdfInteractiveField, "", "", blackList);

    // create the property grid control
    var propertyGridControl = new PropertyGridControlJS(propertyGrid, "interactiveFieldPropertyGrid");
    propertyGridControl.createMarkup();

    // show the dialog
    $('#pdfInteractiveFieldSettingsDialog').modal('show');
}
