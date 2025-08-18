class Flat < ApplicationRecord
  belongs_to :building
  include Nameable
  nameable_with_scope :building
  belongs_to :company
  belongs_to :config, class_name: "Configuration"
  belongs_to :status
  belongs_to :floor

  has_many :costs, class_name: "Flats::Cost", dependent: :destroy

  validates :facing, :carpet_area, presence: true

  accepts_nested_attributes_for :costs, allow_destroy: true, reject_if: :all_blank

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
end
