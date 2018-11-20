Rails.application.routes.draw do
  # mount ImageUploader::UploadEndpoint => "/images/upload" #go rails tutorial

  # FOR DEVELOPMENT
    # mount ImageUploader.upload_endpoint(:cache) => "/images/upload" #new doc
  # FOR PRODUCTION AND S3
  mount Shrine.presign_endpoint(:cache) => "/s3/params"

  resources :photos
  resources :posts
  # root to: "posts#index" #for vanilla upload example
  root to: 'photos#index' #for s3 example
end
