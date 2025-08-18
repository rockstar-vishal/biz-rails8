class CostType < ApplicationRecord
	include Nameable
	nameable_with_scope
	validates :tag, presence: true
end
