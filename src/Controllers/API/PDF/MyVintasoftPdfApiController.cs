using Microsoft.AspNetCore.Hosting;
using Vintasoft.Imaging.Pdf.AspNetCore.ApiControllers;

namespace AspNetCorePdfEditorDemo.Controllers
{
    /// <summary>
    /// A Web API controller that handles HTTP requests from clients and allows to work with PDF documents.
    /// </summary>
    public class MyVintasoftPdfApiController : VintasoftPdfApiController
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="MyVintasoftPdfApiController"/> class.
        /// </summary>
        public MyVintasoftPdfApiController(IWebHostEnvironment hostingEnvironment)
            : base(hostingEnvironment)
        {
        }

    }
}