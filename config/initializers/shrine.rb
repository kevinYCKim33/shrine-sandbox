## FOR LOCAL PRODUCTION

# require "shrine"
# require "shrine/storage/file_system" #for development
#
# Shrine.storages = {
#   cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"),
#   store: Shrine::Storage::FileSystem.new("public", prefix: "uploads/store"),
#   # this will be saved in production to S3 instead not in hard drive...
# }
#
# Shrine.plugin :activerecord #changed from :sequel by go rails
# Shrine.plugin :cached_attachment_data # for forms # use just to see how it works...

## FOR S3 PRODUCTION

require "shrine/storage/s3"

s3_options = {
  bucket:            "beat-shrine", # required
  access_key_id:     Rails.application.credentials.aws[:access_key_id],
  secret_access_key: Rails.application.credentials.aws[:secret_access_key],
  region:            "us-east-2", #ohio
}

Shrine.storages = {
  cache: Shrine::Storage::S3.new(prefix: "cache", upload_options: {acl: "public-read"},  **s3_options), #all our files will be public readable but non-writable... hmmm
  store: Shrine::Storage::S3.new(prefix: "store", upload_options: {acl: "public-read"}, **s3_options), # i could always do that before this public-read option #public readable...
}

Shrine.plugin :activerecord #changed from :sequel by go rails
Shrine.plugin :upload_endpoint # for direct upload # SHRINE DEPRECATION WARNING: The direct_upload plugin has been deprecated in favor of upload_endpoint and presign_endpoint plugins. The direct_upload plugin will be removed in Shrine 3.
# Shrine.plugin :presign_endpoint # for direct upload # SHRINE DEPRECATION WARNING: The direct_upload plugin has been deprecated in favor of upload_endpoint and presign_endpoint plugins. The direct_upload plugin will be removed in Shrine 3.
Shrine.plugin :presign_endpoint, presign_options: -> (request) {
  # Uppy will send the "filename" and "type" query parameters
  # binding.pry
  filename = request.params["filename"]
  type     = request.params["type"]

  {
    content_disposition:    "inline; filename=\"#{filename}\"", # set download filename
    content_type:           type                               # set content type (defaults to "application/octet-stream")
    # content_length_range:   0..(10*1024*1024),                  # limit upload size to 10 MB
  }
}
Shrine.plugin :restore_cached_data #for metadata
