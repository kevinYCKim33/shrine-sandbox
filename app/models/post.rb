class Post < ApplicationRecord
  include ImageUploader[:image] #this line is clutch
  # [:image] is the value you get to use in your form data
  # column that we created called image_data
  # except for ease of working with this ...it'll be called image
  # shrine will know to convert it to :image_data at the db level... (?!!!)

  validates :description, presence: true # for testing uploads (cached) that fail validation
end
