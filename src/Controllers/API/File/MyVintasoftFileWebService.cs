using System.IO;

using Vintasoft.Data;
using Vintasoft.Imaging.Codecs.Decoders;
using Vintasoft.Imaging.Web.Services;
using Vintasoft.Shared.Web;

namespace AspNetCorePdfEditorDemo.Controllers
{
    /// <summary>
    /// A platform-independent web service that
    /// handles HTTP requests from clients and allows to manipulate PDF files on a server.
    /// </summary>
    public class MyVintasoftFileWebService : VintasoftFileWebService
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="MyVintasoftFileWebService"/> class.
        /// </summary>
        /// <param name="dataStorage">Data storage that allows to store images in multipage image files.</param>
        public MyVintasoftFileWebService(IDataStorage dataStorage)
            : base(dataStorage)
        {
        }



        /// <summary>
        /// Validates that specified stream can be saved on a server.
        /// </summary>
        /// <param name="responseParams">Response from the server.</param>
        /// <param name="fileStream">Stream with file data.</param>
        /// <returns>
        /// <b>true</b> - file stream contains PDF document and can be saved on server;
        /// <b>false</b> - file stream cannot be saved on server.
        /// </returns>
        protected override bool FileValidation(
            WebImageFileResponseParams responseParams,
            Stream fileStream)
        {
            // get decoder for uploaded file
            using (DecoderBase decoder = AvailableDecoders.CreateDecoder(fileStream))
            {
                // if decoder is not found
                if (decoder == null)
                {
                    responseParams.errorMessage = "Uploaded file is not PDF document.";
                    responseParams.success = false;
                    return false;
                }
                // if decoder is NOT PDF decoder
                if (decoder.Name != "Pdf")
                {
                    responseParams.success = false;
                    responseParams.errorMessage = "Uploaded file is not PDF document.";
                    return false;
                }
            }
            return true;
        }

    }
}