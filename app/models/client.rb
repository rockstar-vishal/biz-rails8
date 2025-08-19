class Client < ApplicationRecord
  include Codeable
  CODEABLE = {
    prefix: 'CL',
    length: 3
  }
  belongs_to :company
  validates :name, :phone, presence: true
  validates_uniqueness_of :phone, scope: :company

  has_one_attached :photo
  has_one_attached :pan_scan
  has_one_attached :aadhar_scan

  validate :company_specific_fields

  def company_specific_fields
    return if company.blank? || company.client_mandatory_fields.blank?
    
    company.client_mandatory_fields.each do |field|
      if send(field).blank?
        errors.add(field, "is required")
      end
    end
  end

  class << self
    def allowed_columns
      return self.column_names - ["id", "company_id", "code", "phone", "created_at", "updated_at", "name"] + ["pan_scan", "aadhar_scan"]
    end
  end
end
