class Flats::Client < ApplicationRecord
  belongs_to :flat
  belongs_to :client

  belongs_to :clientable, polymorphic: true
end
