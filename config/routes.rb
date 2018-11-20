Rails.application.routes.draw do
  # mount ImageUploader::UploadEndpoint => "/images/upload" #go rails tutorial
  mount ImageUploader.upload_endpoint(:cache) => "/images/upload" #new doc
  # mount ImageUploader::UploadEndpoint => "/images/upload"

  resources :photos
  resources :posts
  # root to: "posts#index" #for vanilla upload example
  root to: 'photos#index' #for s3 example
end
