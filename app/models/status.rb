class Status < ApplicationRecord
	validates :for_class, presence: true
	include Nameable
	nameable_with_scope :for_class

end
