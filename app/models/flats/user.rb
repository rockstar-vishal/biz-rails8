class Flats::User < ApplicationRecord
  belongs_to :flat
  belongs_to :user

  belongs_to :clientable, polymorphic: true

  validates :clientable, :team, :contribution, presence: true

  enum :team, {
    'sourcing': 1,
    'closing': 2
  }, suffix: :team
end
