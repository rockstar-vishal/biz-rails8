class Flat < ApplicationRecord
  belongs_to :building
  include Nameable
  nameable_with_scope :building
  belongs_to :company
  belongs_to :config, class_name: "Configuration"
  belongs_to :status
  belongs_to :floor

  has_one :blocking
  has_one :booking

  has_many :costs, class_name: "Flats::Cost", dependent: :destroy

  validates :facing, :carpet_area, presence: true

  accepts_nested_attributes_for :costs, allow_destroy: true, reject_if: :all_blank

  before_validation :set_defaults, on: :create

  enum :facing, {
    'north': 1,
    'east': 2,
    'west': 3,
    'south': 4,
    'north-east': 5,
    'north-west': 6,
    'south-east': 7,
    'south-west': 8
  }, suffix: :facing

  def set_defaults
    self.company_id = self.building&.company_id if self.company_id.blank?
    self.status_id = Status.for_company(self.company).for_flats.available_tag.first&.id if self.status_id.blank?
  end
end
