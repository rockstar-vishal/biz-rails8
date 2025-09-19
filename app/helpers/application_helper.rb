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

  def foreign_key_options(field, klass)
    association_name = field.gsub('_id', '')
    
    model_class = klass.constantize
    association = model_class.reflect_on_association(association_name.to_sym)
    return [] unless association
    
    associated_class = association.klass
    display_method = if associated_class.column_names.include?('name')
                      :name
                    elsif associated_class.column_names.include?('title')
                      :title
                    else
                      :id
                    end
    
    associated_class.all.map do |record|
      display_value = record.send(display_method)
      [display_value, record.id]
    end
  rescue => e
    Rails.logger.error "Error generating options for #{field}: #{e.message}"
    []
  end

  def is_boolean_field?(field, klass)
    model_class = klass.constantize
    column = model_class.columns_hash[field]
    column&.type == :boolean
  rescue
    field.end_with?('?') || field.start_with?('is_') || field.end_with?('_flag')
  end

  def is_foreign_key?(field, klass)
    return false unless field.end_with?('_id')
    
    model_class = klass.constantize
    association_name = field.gsub('_id', '')
    model_class.reflect_on_association(association_name.to_sym).present?
  rescue
    false
  end
end
