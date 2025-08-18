class Client < ApplicationRecord
  include Codeable
  CODEABLE = {
    prefix: 'CL',
    length: 3
  }
  belongs_to :company
  validates_uniqueness_of :phone, scope: :company
  validates :name, presence: true

  has_one_attached :photo
  has_one_attached :pan_scan
  has_one_attached :aadhar_scan
end
