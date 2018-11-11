# for s3 uploading ex
class Photo < ApplicationRecord
  include ImageUploader[:image]
end
