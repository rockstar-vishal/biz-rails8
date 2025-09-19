class PaymentPlans::Stage < ApplicationRecord
  belongs_to :payment_plan, class_name: 'Projects::PaymentPlan', foreign_key: 'payment_plan_id', inverse_of: :stages 
  belongs_to :cost_type
  validates :name, presence: true
  validate :amount_or_percentage_present

  private
   
   def amount_or_percentage_present
    if amount.blank? && percentage.blank?
      errors.add(:base, "Either amount or percentage must be present")
    elsif amount.present? && percentage.present?
      errors.add(:base, "Cannot have both amount and percentage")
    end
  end
end
