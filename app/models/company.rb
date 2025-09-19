class Company < ApplicationRecord
	include Nameable
	nameable_with_scope
	include Codeable
	CODEABLE = {
		prefix: 'CY',
		length: 3
	}
	has_many :projects
	has_many :users
	has_many :brokers
	has_many :flats
	has_many :blockings
	has_many :payment_plans, class_name: 'Projects::PaymentPlan', through: :projects
	validates :domain, :project_limit, :unit_limit, :allowed_configs, :allowed_banks, :allowed_cost_maps, :max_registration_charges, :default_sdr_percent, :default_registration_percent, :default_legal_charges, :allowed_statuses, presence: true
end
