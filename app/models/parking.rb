class Parking < ApplicationRecord
  belongs_to :company
  belongs_to :project
  belongs_to :status

  before_validation :set_defaults, on: :create

  def set_defaults
    self.company_id = self.project&.company_id if self.company_id.blank?
    self.status_id = Status.for_company(self.company).for_parkings.available_tag.first&.id if self.status_id.blank?
  end
end
