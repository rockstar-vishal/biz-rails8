class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  before_action :authenticate_user!
  include Pagy::Backend
  include Pundit::Authorization

  before_action :authorize_settings_access, if: :settings_controller?

  private

  def settings_controller?
    params[:controller]&.start_with?('settings/')
  end

  def authorize_settings_access
    controller_name = params[:controller].gsub('settings/', '')
    
    sysadmin_routes = %w[companies banks statuses configurations cost_maps floors users]
    superadmin_routes = %w[projects payment_plans clients brokers bookings blockings transactions reports]
    
    if sysadmin_routes.include?(controller_name) && !current_user.system_admin?
      handle_unauthorized("System Administrators")
    elsif superadmin_routes.include?(controller_name) && !current_user.super_admin?
      handle_unauthorized("Super Administrators")
    end
  end

  def handle_unauthorized(required_role)
    flash[:alert] = "Access denied. This section is only available to #{required_role}."
    redirect_to root_path
  end
end
