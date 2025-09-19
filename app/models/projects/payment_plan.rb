class Projects::PaymentPlan < ApplicationRecord
  belongs_to :project
  include Nameable
  nameable_with_scope :project

  has_many :stages, class_name: 'PaymentPlans::Stage', foreign_key: 'payment_plan_id', dependent: :destroy, inverse_of: :payment_plan
  
  accepts_nested_attributes_for :stages, allow_destroy: true, reject_if: :all_blank
end
