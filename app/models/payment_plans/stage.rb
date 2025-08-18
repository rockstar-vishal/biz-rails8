class PaymentPlans::Stage < ApplicationRecord
  belongs_to :payment_plan
  belongs_to :cost_type
end
