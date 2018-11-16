https://gorails.com/episodes/direct-file-uploads-to-s3-part-3?autoplay=1

finally ready to

file field to s3 wait for resp, wait for response with jquery upload

gonna be a bit complex...

using jquery file upload gem...

just gonna grab javascript stuff...

ui-widget...
iframem-transport
fileupload

paste into js assets

$("input")

$("input"[type])

then call fileupload() on it...

// seems important

write ol' plain ol javascript

ecma 6 will kill coffee script going forward

app/assets/javascripts/puload.js

$(document).on("turbolinks:load", function() {
  $('[type=file]').fileupload({
    add: function(e, data) {
      // whenever you choose a file upload
      // gotta presign it so it's safe to upload to s3
      // shrine route to s3
      // we have new file, send to s3, give me presigned something
      console.log("add", data);
      data.progressBar = $('<div class="progress" style="width: 300px"').insertAfter("body")
      // find relevant tag on page to add this progressBar
      // 300px wide thing to show our progress...

      // insert it where it makes the most sense...
      var options = {
        extensions: data.files[0].name.match(/)
        some regex...to pull out extension for us...
        // set the file extension
        _: Date.now() // prevent caching
        // inside roda rack app it might get cached...

      }

      $.getJSON("/images/upload/cache/presign")
    },
    progress: function(e, data) {

    },

    done: function(e, data) {

    }
    })
  })
