Rails.application.routes.draw do
  namespace :settings do
    get "tds/index"
    get "taxes/index"
    get "cost_types/index"
    get "transactions/index"
    get "fund_sources/index"
    get "bank/index"
  end
  
  get '/', to: 'login#index', as: :login
  get '/reset', to: 'login#reset'
  get 'dashboard', to: 'dashboard#index'
  get 'project', to: "projects#index"
  get 'building', to: "projects#building"
  get 'parking', to: "projects#parking"
  get 'paymentsPlan', to: "projects#paymentsPlan"
  get 'inventory', to: "projects#inventory"
  get 'cancelledBookings', to: "projects#cancelledBookings"
  get 'exportBookingList', to: "projects#exportBookingList"
  get 'flatBooking', to: "projects#flatBooking"
  get 'showBooking', to: "projects#showBooking"
  get 'projectSummary', to: "projects#projectSummary"
  get 'todaysCall', to: "projects#todaysCall"
  get 'backlog', to: "projects#backlog"
  get 'demandLetter', to: "projects#demandLetter"
  get 'reminderLetter', to: "projects#reminderLetter"
  get 'search', to: "projects#search"
  get 'flatFacing', to: "settings/flat_facing#flatFacing",  as: 'flat_facing'
  get 'flatConfiguration', to: "settings/flat_configuration#index",  as: 'flat_configuration'
  get 'brokers', to: "settings/brokers#index",  as: 'brokers'
  get 'clients', to: "settings/clients#index",  as: 'clients'
  get 'offers', to: "settings/offers#index",  as: 'offers'
  get 'users', to: "settings/users#index",  as: 'users'
  get 'accounts', to: "settings/accounts#index",  as: 'accounts'
  get 'interest', to: "settings/interest#index",  as: 'interest'
  get 'bank', to: "settings/bank#index",  as: 'bank'
  get 'fund_sources', to: "settings/fund_sources#index",  as: 'fund_sources'
  get 'transactions', to: "settings/transactions#index",  as: 'transactions'
  get 'cost_types', to: "settings/cost_types#index",  as: 'cost_types'
  get 'taxes', to: "settings/taxes#index",  as: 'taxes'
  get 'tds', to: "settings/tds#index",  as: 'tds'

  get "up" => "rails/health#show", as: :rails_health_check

  
end
