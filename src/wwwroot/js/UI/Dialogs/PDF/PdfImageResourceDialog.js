/**
 A dialog that allows to view information about PDF image resource.
*/
PdfImageResourceDialogJS = function (image) {

    $('#pdfImageResourceDialog').on('show.bs.modal', function () {
        __open();

        $('#pdfImageResourceDialog').off('show.bs.modal');
    });

    /**
     Creates the dialog.
    */
    function __create() {
        // show the dialog
        $('#pdfImageResourceDialog').modal('show');

        return false;
    }

    /**
     Dialog is opened.
    */
    function __open() {
        var image = that._image;
        // get resoure of content image
        var resource = image.get_Resource();

        // get image input
        var imageInput = $("#pdfImageResourceInput");
        // change src of input (content image data - base64 image)
        imageInput.attr("src", resource.getResourceData());

        // get div that contains image input
        var divImageInput = imageInput.parent();
        // get div height
        var divHeight = divImageInput.height();
        // get content image height
        var imageHeight = resource.get_Size().height;

        // margin top
        var marginTop = 0;
        // if image height less than div height
        if (imageHeight < divHeight)
            // get new margin top
            marginTop = Math.round((divHeight - imageHeight) / 2);
        // change image margin top
        imageInput.css("margin-top", marginTop);

        // write information about image
        __createMarkup(image);
    }

    /**
     Fills the div element with information about the content image
    */
    function __createMarkup(image) {
        // css style of td elements
        var style = 'style="background-color:#DBD7D7; text-align:left"';

        // get image information
        var resolution = image.get_Resolution();
        var resource = image.get_Resource();
        var size = resource.get_Size();
        var compression = resource.get_Compression();
        var length = resource.get_Length();
        var pixelFormat = resource.get_PixelFormat().toString();

        var sizeText = "Size";
        var resolutionText = "Resolution";
        var compressionText = "Compression";
        var pixelFormatText = "PixelFormat";
        var lengthText = "Length";
        var bytesText = "bytes";

        // create markup
        var markup = "<table>";
        markup += "<tr><td " + style + ">" + sizeText + ":</td><td>" + size.width + "x" + size.height + "</td></tr>";
        markup += "<tr><td " + style + ">" + resolutionText + ":</td><td>" + Math.round(resolution.x) + "x" + Math.round(resolution.y) + " dpi</td></tr>";
        markup += "<tr><td " + style + ">" + compressionText + ":</td><td>" + compression + "</td></tr>";
        markup += "<tr><td " + style + ">" + pixelFormatText + ":</td><td>" + pixelFormat + "</td></tr>";
        markup += "<tr><td " + style + ">" + lengthText + ":</td><td>" + length + " " + bytesText + "</td></tr>";
        markup += "</table>";

        // set new markup 
        $("#pdfImageResourceInfo").html(markup);
    }

    this._image = image;
    var that = this;

    __create();
}