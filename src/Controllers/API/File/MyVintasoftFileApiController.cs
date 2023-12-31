﻿using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;

using Vintasoft.Data;
using Vintasoft.Imaging.AspNetCore.ApiControllers;
using Vintasoft.Imaging.Web.Services;


namespace AspNetCorePdfEditorDemo.Controllers
{
    /// <summary>
    /// A Web API controller that handles HTTP requests from clients and
    /// allows to manipulate PDF documents on server.
    /// </summary>
    public class MyVintasoftFileApiController : VintasoftFileApiController
    {

        /// <summary>
        /// Initializes a new instance of the <see cref="MyVintasoftFileApiController"/> class.
        /// </summary>
        public MyVintasoftFileApiController(IWebHostEnvironment hostingEnvironment)
            : base(hostingEnvironment)
        {
        }



        /// <summary>
        /// Returns a list of files uploaded during current HTTP session.
        /// </summary>
        /// <param name="session">Identifier of HTTP session.</param>
        /// <returns>Dictionary that provides a mapping from filename to URL of file.</returns>
        [HttpPost]
        public UploadedFilesListResponseParams GetUploadedFilesUrl([FromBody] string session)
        {
            UploadedFilesListResponseParams answer = new UploadedFilesListResponseParams();
            IDataStorage storage = CreateSessionDataStorage(session);
            if (storage != null)
            {
                List<string> files = new List<string>();
                string[] allFiles = storage.GetKeys();
                for (int i = 0; i < allFiles.Length; i++)
                {
                    if (IncludeFileInUploadedFileList(allFiles[i]))
                        files.Add(allFiles[i]);
                }
                answer.files = files.ToArray();
            }
            answer.success = true;
            return answer;
        }


        /// <summary>
        /// Determines that file must be included into the uploaded file list.
        /// </summary>
        /// <param name="filePath">Path to a file.</param>
        /// <returns>
        /// <b>true</b> - file must be included to the uploaded file list;
        /// <b>true</b> - file must NOT be included to the uploaded file list.
        /// </returns>
        protected virtual bool IncludeFileInUploadedFileList(string filePath)
        {
            // get file extension
            string fileExtension = Path.GetExtension(filePath);
            // if file is PDF document
            if (fileExtension.ToUpperInvariant() == ".PDF")
                // include file into the uploaded file list
                return true;
            // does NOT include file into the uploaded file list
            return false;
        }

        /// <summary>
        /// Creates the <see cref="MyVintasoftFileWebService"/>
        /// that handles HTTP requests from clients and allows to manipulate files on a server.
        /// </summary>
        /// <returns>The <see cref="MyVintasoftFileWebService"/>
        /// that handles HTTP requests from clients and allows to manipulate files on a server.</returns>
        protected override VintasoftFileWebService CreateWebService(string sessionId)
        {
            IDataStorage storage = CreateSessionDataStorage(sessionId);
            MyVintasoftFileWebService service = new MyVintasoftFileWebService(storage);
            return service;
        }

    }
}