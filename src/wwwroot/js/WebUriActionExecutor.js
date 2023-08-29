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
            if (confirm("Open URL '" + uri + "' ?")) {
                // open URL
                window.open(uri, "_blank");
            }
        }
    }
}
Vintasoft.Shared.extend(WebUriActionExecutor, Vintasoft.Imaging.WebPageContentActionExecutorJS);
