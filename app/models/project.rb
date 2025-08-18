class Project < ApplicationRecord
  belongs_to :company
  include Nameable
  nameable_with_scope :company
  has_many :payment_plans, class_name: "Projects::PaymentPlan", dependent: :destroy

  validates :allowed_bank_accounts, presence: true, if: :restrict_bank_for_transaction
end
