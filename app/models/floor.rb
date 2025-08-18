class Floor < ApplicationRecord
	include Nameable
 	nameable_with_scope
 	validates :sequence, presence: true
 	validates_uniqueness_of :sequence
end
