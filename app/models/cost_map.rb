class CostMap < ApplicationRecord
  belongs_to :cost_type
  validates :title, presence: true
  validates_uniqueness_of :title, case_sensitive: false
end
