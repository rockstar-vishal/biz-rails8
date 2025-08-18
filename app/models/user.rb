class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  belongs_to :company
  belongs_to :role
  validates :name, :phone, presence: true
  validates_uniqueness_of :phone, scope: :company
  validates_uniqueness_of :employee_no, scope: :company, allow_nil: true

end
