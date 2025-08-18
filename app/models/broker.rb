class Broker < ApplicationRecord
  include Nameable
  nameable_with_scope :company
  validates_uniqueness_of :firm_name, case_sensitive: false, scope: :company
  include Codeable
  CODEABLE = {
    prefix: 'CP',
    length: 3
  }
  belongs_to :company
  has_one_attached :pan_scan
  has_one_attached :aadhar_scan
  has_one_attached :gst_scan
  has_one_attached :rera_scan
  validate :company_specific_fields

  def company_specific_fields
    #tofix
  end
end
