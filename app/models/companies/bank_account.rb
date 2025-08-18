class Companies::BankAccount < ApplicationRecord
  belongs_to :company
  belongs_to :bank
  validates :ac_no, :benf_name, :branch, :ifsc, presence: true
  validates_uniqueness_of :ac_no, scope: :company
end
