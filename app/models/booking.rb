class Booking < ApplicationRecord
  include Codeable
  include AdvancedSearchable
  CODEABLE = {
    prefix: "BO",
    length: 4
  }
  belongs_to :company
  belongs_to :flat
  belongs_to :project
  belongs_to :payment_plan, class_name: "Projects::PaymentPlan"
  belongs_to :booked_by, class_name: "User"
  belongs_to :loan_bank, class_name: "Bank", optional: true
  
  validates :date, :application_no, :application_date, :sdr_percent, :registration_charges, :legal_charges, presence: true

  validates :registration_date, :registration_no, presence: true, if: :registered

  validates_uniqueness_of :flat

  before_validation :set_defaults, on: :create

  def set_defaults
    self.project_id = self.flat&.project_id if self.project_id.blank?
    self.company_id = self.flat&.company_id if self.company_id.blank?
  end
end
