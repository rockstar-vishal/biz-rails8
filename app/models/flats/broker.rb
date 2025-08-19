class Flats::Broker < ApplicationRecord
  belongs_to :flat
  belongs_to :broker

  belongs_to :clientable, polymorphic: true
  validates :clientable, presence: true
end
