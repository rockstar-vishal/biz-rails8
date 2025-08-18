class Projects::PaymentPlan < ApplicationRecord
  belongs_to :project
  include Nameable
  nameable_with_scope :project
end
