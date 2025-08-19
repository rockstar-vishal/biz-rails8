class Blocking < ApplicationRecord
  include Codeable
  CODEABLE = {
    prefix: 'BL',
    length: 3
  }
  belongs_to :company
  belongs_to :flat
  belongs_to :project
  belongs_to :blocked_by, class_name: "User"
  validates :date, :blocked_upto, presence: true

  validates_uniqueness_of :flat

  before_validation :set_defaults, on: :create

  def set_defaults
    self.project_id = self.flat&.project_id if self.project_id.blank?
    self.company_id = self.flat&.company_id if self.company_id.blank?
  end
end
