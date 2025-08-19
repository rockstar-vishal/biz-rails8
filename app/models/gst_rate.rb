class GstRate < ApplicationRecord
  belongs_to :cost_type

  validates :amount_from, :rate, :effective_from, presence: true
  validate :no_overlaps

  def no_overlaps
    if self.class.where.not(id: self.id).where(cost_type_id: self.cost_type_id, amount_from: self.amount_from, effective_from: self.effective_from).present?
      errors.add(:base, "Similar Record Exists!")
    end
  end

end
