class Role < ApplicationRecord
	include Nameable
	nameable_with_scope
	validates :tag, presence: true

	def system_admin?
    tag == 'sysad'
  end
  
  def super_admin?
    tag == 'admin'
  end
end
