class Building < ApplicationRecord
  include Nameable
  nameable_with_scope :project
  belongs_to :project
  scope :defaults, -> { where(is_default: true) }
end
