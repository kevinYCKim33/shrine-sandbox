https://gorails.com/episodes/direct-file-uploads-to-s3-part-1?autoplay=1

just some s3 tutorial

upload file to us?

user's browser sends request to rails, then rails sends to s3...

you're transferring the file twice this way...

===

makes request to web server...

has keys to s3

keys transformed to access token...

send along to s3 where it gets verified and stored...

grab access token and upload the file...

process them once they're done...


we'll set up bucket...

set up bucket that only one user of the aws...

user and a bucket for dev, staging, for production...

go to s3 and make a bucket

cloudfront...

data center...

more money...

upload file from chicago...

anyone further away will have a bit of a slower time with s3

now add cors configuration...

check out mozilla article... kinda hard to wrap head around

add http headers...

amazon s3 service...

we don't allow you to add files here except from these domains

i accept files from go rails .com

i'm on go rails.com and it's okay for me to send files over to s3

set user account too

https://gorails.com/episodes/direct-file-uploads-to-s3-part-2?autoplay=1

`rails g scaffold Photo image_data:text`

`rake db:migrate`

need to set up shrine s3

just copy and paste the guy...

go direct to

[2:45] set up shrine via s3

grab and paste the code from here

https://shrinerb.com/rdoc/files/doc/direct_s3_md.html

```
require "shrine/storage/s3"

s3_options = {
  bucket:            "<YOUR BUCKET>", # required
  access_key_id:     "<YOUR KEY>",
  secret_access_key: "<YOUR SECRET>",
  region:            "<REGION>",
}

Shrine.storages = {
  cache: Shrine::Storage::S3.new(prefix: "cache", **s3_options),
  store: Shrine::Storage::S3.new(**s3_options),
}
```

`config/initializers/shrine.rb` file we will edit it...

test s3 credentials set up proplery

run rails

but don't use direct uploads

upload to rails, then have it upload to amazon

we just want to check it's actually getting to s3 first...
