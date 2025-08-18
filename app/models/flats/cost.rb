class Flats::Cost < ApplicationRecord
  belongs_to :flat
  belongs_to :cost_map
  validates_uniqueness_of :cost_map, scope: :flat
  validates :amount, presence: true
end
