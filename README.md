https://gorails.com/episodes/file-uploading-with-shrine?autoplay=1

shrine ruby gem...
9.23.2016

shrine a new look

bunch of plugins you can add...or build your own if you want...

add transcoding? plugin for that...

nicely organized and modular...

active record

pop over to the github page...

https://github.com/shrinerb/shrine

pretty confusing

first add gem...

need to require it in an intializer somewhere...

set cache in the store...

cache place where you upload the file...

avatar gets uploaded but doesn't get saved...

re render the form with the cached image...

when it gets permanently stored...it gets sent to the thing...

fully configurable... have place for cache and whatnot...

cache attachment data...

forms that rerender when they fail...

migrations a bit harder to follow since they aren't active reocrds...

have to set image_data as text column...
  json serialized column

  can store metadata...can store video and its thumbnail...

first thing...

generate files uploader...

pretend to build instagram...

post has video or image...

`rails g scaffold Post image_data:text`

5:28

Sequel.migration do
  change do
    add_column :photos, :image_data, :text
  end
end

`rake db:migrate`

get the gem

scaffold thinks the image is a text area...

we'll fix that later...

`gem 'shrine'`


`bundle`

paste all the below straight from the github page...
put into config initializers...
====

require "shrine"
require "shrine/storage/file_system"

Shrine.storages = {
  cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"), # temporary
  store: Shrine::Storage::FileSystem.new("public", prefix: "uploads"),       # permanent
}

Shrine.plugin :sequel # or :activerecord
Shrine.plugin :cached_attachment_data # for retaining the cached file across form redisplays
Shrine.plugin :restore_cached_data # re-extract metadata when attaching a cached file
Shrine.plugin :rack_file # for non-Rails apps

====

paste into `config/intializers/shrine.rb`

`rake db:rollback`

`rake db:migrate`

to accomodate adding description to our post

Now we need to create an uploader class

now create a folder for it in app

`app/uploaders/image_uploader.rb`

check out `post.rb` include ImageUploader magic

====

now shrine is connected in the model level..

modify form and controllers...

form needs to point to shrine

controller to accept the image from shrine...

copy and paste the form_for code from github page into your forms page...

caching;;;background processing....thumbnails...s3 in episodes to come...

much more robust file uploading system...
