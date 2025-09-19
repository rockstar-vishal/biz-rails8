class SidebarPolicy < ApplicationPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  # System Admin permissions
  def manage_companies?
    user.system_admin?
  end

  def manage_banks?
    user.system_admin?
  end

  def manage_statuses?
    user.system_admin?
  end

  def manage_configurations?
    user.system_admin?
  end

  def manage_cost_maps?
    user.system_admin?
  end

  def manage_floors?
    user.system_admin?
  end

  def manage_system_users?
    # Only System Admins can manage Super Admins and System Admins
    user.system_admin?
  end

  def manage_adv_search_fields?
    user.system_admin?
  end

  # Super Admin permissions
  def manage_projects?
    user.super_admin? || user.system_admin?
  end

  def manage_payment_plans?
    user.super_admin? || user.system_admin?
  end

  def manage_clients?
    user.super_admin? || user.system_admin?
  end

  def manage_brokers?
    user.super_admin? || user.system_admin?
  end

  def manage_bookings?
    user.super_admin? || user.system_admin?
  end

  def manage_blockings?
    user.super_admin? || user.system_admin?
  end

  def manage_transactions?
    user.super_admin? || user.system_admin?
  end

  def manage_reports?
    user.super_admin?
  end

  private

  def system_admin?
    user.role.system_admin?
  end

  def super_admin?
    user.role.super_admin?
  end
end
