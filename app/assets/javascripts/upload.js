$(document).on("turbolinks:load", function() {

  // allow CSRF for post requests (i.e. unique email validation)
  $.ajaxSetup({
      async: true,
      beforeSend: function (xhr) {
          xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
      }
  });

  //fileupload coming via jquery-uploader gem
  $("[type=file]").fileupload({
    // whenever you choose a file add will trigger
    // we need to presign the file in order to make it safe to upload to S3
    // we need to use the Shrine route
    // talk to it,
    // hey we have new file, want to send to S3, send us presigned info to make it safe
    add: function(e, data) {
      // add: once file is selected, presigns it and automatically starts submitting it over to S3
      console.log('add', data);
      // should of course customize
      // insertAfter wherever it makes the most sense
      // i guess some of it is bootstrap specific
      // potentially different progress bars for video and pictures
      data.progressBar = $('<div class="progress" style="width: 300px"><div class="progress-bar"></div></div>').insertAfter("body");

      // setting up a ruby hash like thing
      var options      = {
        extension: data.files[0].name.match(/(\.\w+)?$/)[0], // set the file extension pulls out the file extension
        _: Date.now() // prevent caching // if it did get cached inside roda/rack application, should help prevent that...
      };

      // use jQuery to get some json and point it to the route we created before...//in routes.rb
      // mount ImageUploader::UploadEndpoint => "/images/upload"
      debugger;
      $.getJSON("/images/upload/monkey/presign", options, function(result) {
        console.log('presign', result);
        debugger;
        data.formData  = result.fields;
        data.url       = result.url;
        data.paramName = "file"; //apparently attribute name in rails may be image/video/avatar
        // amazon gives 400 error if it's not named file
        // needs to be needs to be file! for S3!
        data.submit(); //the line that pushes the file to S3
        // data i.e. form in memory;
      });

    },

    progress: function(e, data) {
      console.log('progress', data);

      var progress   = parseInt(data.loaded / data.total * 100, 10);
      var percentage = progress.toString() + '%';
      data.progressBar.find(".progress-bar").css("width", percentage).html(percentage);
      // find the progress bar and update its length
      // very ActivStorage like
    },

    done: function(e, data) {
      // file has processed uploading...
      console.log('done', data);

      data.progressBar.remove();

      // we are doing this in memory and not shrine...

      // gonna submit all this back to rails with shrine...
      var image = {
        id:       data.formData.key.match(/cache\/(.+)/)[1], // we have to remove the prefix part
        storage:  'cache',
        metadata: {
          size:      data.files[0].size,
          filename:  data.files[0].name.match(/[^\/\\]+$/)[0], // IE return full path
          mime_type: data.files[0].type
        }
      };

      // 15:10
      // create a sort of new form; somewhat of a duplicate
      // in order to send file over to rails
      // quite a lot to take in...
      var form      = $(this).closest("form");
      var form_data = new FormData(form[0]); //form 0 is the input
      form_data.append($(this).attr("name"), JSON.stringify(image)); //append the image we just uploaded, with the same name as was in the form
      // rememeber when we renamed it to file, even though our Rails app is called photo_image
      // we use this in order to keep track of it actually being called photo_image, even though S3 wants it to be called file
      // we created all this, create into JSOn string...


      // DONT send the form here yet in Beat45 here...

      // use a bit of AJAX  send the ajax to the form's post route
      $.ajax(form.attr("action"), {
        contentType: false,
        processData: false,
        data:        form_data,
        method:      form.attr("method"),
        dataType:    "json",
        success: function(response) {
          var $img = $("<img/>", {src: response.image_url, width: 400});
          var $div = $("<div/>").append($img);
          $("#photos").append($div);
        }
      });
    }
  });

});

// don't need 'done', do 'success'
// send it to rails at the same time

//created a record inside rails and submitted it to rails

// Started GET "/images/upload/cache/presign?extension=.jpg&_=1475628110564" for ::1 at 2016-10-04 19:41:50 -0500
// Started POST "/photos" for ::1 at 2016-10-04 19:41:41 -0500
// Processing by PhotosController#create as JSON


// $.ajax(form.attr('action'), {
//   contentType: false,
//   processData: false,
//   data: form_data,
//   method: form.attr("method"),
//   dataType: "json",
// }).done(function(data) {
//   console.log("done from rails", data);
// });
