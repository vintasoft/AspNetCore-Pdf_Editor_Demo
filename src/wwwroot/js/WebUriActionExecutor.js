/**
 Represents the action executor that executes URI actions.
*/
var WebUriActionExecutor = function () {

    WebUriActionExecutor.superclass.constructor.call(this);

    /**
     Executes the action.
     @param {any} viewer The image viewer.
     @param {any} image The image that contains the action.
     @param {any} action The action to execute.
     @returns {boolean} True if action is executed successfully; otherwise, false.
     @exception Thrown if arguments have wrong types.
     @function @public
    */
    WebUriActionExecutor.prototype.executeAction = function (viewer, image, action) {
        // if action is URI action
        if (action instanceof Vintasoft.Imaging.WebUriActionMetadataJS) {
            // get URL, which is associated with action
            var uri = action.get_Uri();

            // if user wants to open the URL
            if (confirm("Do you want to open the URL '" + uri + "' ?")) {
                // open URL
                window.open(uri, "_blank");
            }
        }
        else if (action instanceof Vintasoft.Imaging.WebResourceActionMetadataJS) {
            // get resource URL, which is associated with action
            var resourceUri = action.get_ResourceUri();
            if (resourceUri != null) {
                // get the image metadata
                var imageMetadata = image.get_Metadata();
                if (imageMetadata != null) {
                    // if user wants to download the resource
                    if (confirm("Do you want to download the resource with Uri '" + resourceUri + "' ?")) {
                        imageMetadata.requestResource(
                            resourceUri,
                            function (data) {
                            },
                            function (data) {
                                alert("Error to download resource: " + data.errorMessage);
                            }
                        );
                    }
                }
            }
        }
    }

}
Vintasoft.Shared.extend(WebUriActionExecutor, Vintasoft.Imaging.WebPageContentActionExecutorJS);
