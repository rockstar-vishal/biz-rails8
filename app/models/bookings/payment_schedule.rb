class Bookings::PaymentSchedule < ApplicationRecord
  belongs_to :booking
  belongs_to :stage
  belongs_to :cost_type

  validates :title, presence: true
  validates_uniqueness_of :title, case_sensitive: true, scope: :booking
end
