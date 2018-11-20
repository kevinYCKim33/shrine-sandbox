var uppy = Uppy.Core()
// uppy.use(Uppy.DragDrop, { target: '#drag-drop-area' });

// Outputs a boring Upload File button
uppy.use(Uppy.FileInput, { target: '.UppyForm', replaceTargetContent: true });

// uppy.use(Uppy.ProgressBar, { target: '.UppyDragDrop-Two-Progress', replaceTargetContent: true });

// will call Shrine's presign endpoint mounted on `/s3/params`
uppy.use(Uppy.AwsS3, { serverUrl: '/' })
// demo route to get progress bar going;
// most likely want S3 and some styling going too...

// uppy.use(Uppy.Tus, { endpoint: 'https://master.tus.io/files/' });

uppy.on('file-added', (file) => {
  console.log('Added file', file);
});

uppy.on('file-removed', (file) => {
  console.log('Removed file', file)
});

uppy.on('upload-progress', (file, progress) => {
  // file: { id, name, type, ... }
  // progress: { uploader, bytesUploaded, bytesTotal }
  console.log(file.id, progress.bytesUploaded, progress.bytesTotal);
  var progress   = parseInt(progress.bytesUploaded / progress.bytesTotal * 100, 10);
  var percentage = progress.toString() + '%';
  $(".progress-bar").css("width", percentage).html(percentage);

});

uppy.on('upload-success', (file, resp, uploadURL) => {
  console.log(file.name, uploadURL);
  console.log("File's done!");
  // alert("File's done!");
  // construct uploaded file data in the format that Shrine expects
  var uploadedFileData = JSON.stringify({
    // file.meta['key'] ~~ retrieving parameters generated in getUploadParameters
    id: file.meta['key'].match(/^cache\/(.+)/)[1], // object key without prefix
    storage: 'cache',
    metadata: {
      size:      file.size,
      filename:  file.name,
      mime_type: file.type,
    }
  });

  // set hidden field value to the uploaded file data so that it's submitted with the form as the attachment
  var hiddenInput = $("#immaHidden");
  // debugger;
  hiddenInput.val(uploadedFileData);
  // var img = new Image()
  // img.width = 300
  // img.alt = fileId
  // img.src = uploadURL
  // document.body.appendChild(img)
});

uppy.on('complete', (result) => {
  console.log('successful files:', result.successful)
  console.log('failed files:', result.failed)
});

uppy.on('upload-error', (file, error) => {
  console.log('error with file:', file.id)
  console.log('error message:', error)
});

var uploadBtn = document.querySelector('.UppyDragDrop-Two-Upload')
uploadBtn.addEventListener('click', function (e) {
  // debugger;
  e.preventDefault();
  uppy.upload();
})

// uppy.cancelAll(); use sparingly;

// var uppy = Uppy.Core({
//   id: 'uppy',
//   autoProceed: false,
//   allowMultipleUploads: true,
//   debug: false,
//   restrictions: {
//     maxFileSize: null,
//     maxNumberOfFiles: null,
//     minNumberOfFiles: null,
//     allowedFileTypes: null
//   },
//   meta: {},
//   onBeforeFileAdded: (currentFile, files) => currentFile,
//   onBeforeUpload: (files) => {},
//   locale: defaultLocale,
//   store: new DefaultStore()
// })
