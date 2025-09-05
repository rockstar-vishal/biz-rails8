module ApplicationHelper
	include Pagy::Frontend

	def system_admin_access?
    policy(:sidebar).manage_banks? || 
    policy(:sidebar).manage_statuses? || 
    policy(:sidebar).manage_configurations? || 
    policy(:sidebar).manage_cost_maps? || 
    policy(:sidebar).manage_floors? || 
    policy(:sidebar).manage_system_users?
  end

  def super_admin_access?
    policy(:sidebar).manage_projects? || 
    policy(:sidebar).manage_payment_plans? || 
    policy(:sidebar).manage_clients? || 
    policy(:sidebar).manage_brokers? || 
    policy(:sidebar).manage_bookings? || 
    policy(:sidebar).manage_blockings? || 
    policy(:sidebar).manage_transactions? || 
    policy(:sidebar).manage_reports?
  end
end
