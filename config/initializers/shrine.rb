require "shrine"
require "shrine/storage/file_system"

Shrine.storages = {
  cache: Shrine::Storage::FileSystem.new("public", prefix: "uploads/cache"),
  store: Shrine::Storage::FileSystem.new("public", prefix: "uploads/store"),
  # this will be saved in production to S3 instead not in hard drive...
}

Shrine.plugin :activerecord #changed from :sequel by go rails
Shrine.plugin :cached_attachment_data # for forms # use just to see how it works...
