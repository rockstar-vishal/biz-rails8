class Broker < ApplicationRecord
  include Nameable
  include AdvancedSearchable
  nameable_with_scope :company
  validates_uniqueness_of :firm_name, case_sensitive: false, scope: :company
  validates_uniqueness_of :mobile, case_sensitive: false, scope: :company
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
    return if company.blank? || company.broker_mandatory_fields.blank?
    
    company.broker_mandatory_fields.each do |field|
      if send(field).blank?
        errors.add(field, "is required")
      end
    end
  end

  class << self
    def allowed_columns
      return self.column_names - ["id", "company_id", "code", "mobile", "created_at", "updated_at", "name", "firm_name"] + ["pan_scan", "aadhar_scan", "gst_scan", "rera_scan"]
    end
  end
end
