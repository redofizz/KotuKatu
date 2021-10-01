Rails.application.routes.draw do
  
  namespace 'api' do
    namespace 'v1' do
      namespace :auth do
        resources :sessions, only: %i[index]
      end

      resources :articles

      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        omniauth_callbacks: 'overrides/omniauth_callbacks',
        registrations: 'api/v1/auth/registrations'
      }
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
