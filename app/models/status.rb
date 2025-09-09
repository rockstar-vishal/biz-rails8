class Status < ApplicationRecord
	has_many :flats
	has_many :parkings
	enum :tag, {
	    'available': 1,
	    'booked': 2,
	    'blocked': 3
	}, suffix: :tag
	validates :for_class, presence: true
	include Nameable
	nameable_with_scope :for_class
	scope :for_parkings, -> { where(for_class: "Parking") }
	scope :for_flats, -> { where(for_class: "Flat") }
	scope :for_company, -> (company){where(id: company.allowed_statuses.uniq)}
end
