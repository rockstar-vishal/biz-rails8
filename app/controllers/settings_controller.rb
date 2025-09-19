class SettingsController < ApplicationController
  def adv_search_fields
    @models = get_specified_models_with_fields
  end

  def update_adv_search_config
    if params[:config].present?
      params[:config].each do |model_name, model_config|
        enabled_fields = model_config[:fields].select { |_, enabled| enabled == "true" }.keys
        
        SearchConfig.update_fields_for(model_name, enabled_fields)
      end
      
     	render json: { 
	      status: 'success', 
	      message: 'Advanced search configuration updated successfully.',
	      last_updated: Time.now.strftime("%d/%m/%Y %H:%M")
	    }
    else
       render json: { 
	      status: 'error', 
	      message: 'No configuration data received.' 
	    }, status: :unprocessable_entity
    end
    
  end

  private

  def get_specified_models_with_fields
    models = []
    
    SearchConfig::SEARCHABLE_MODELS.each do |name|
      model_class = name.constantize rescue nil
      next unless model_class && model_class < ApplicationRecord
      
      current_searchable_fields = SearchConfig.fields_for(name)
      fields = model_class.columns.map do |column|
        next if ['id', 'created_at', 'updated_at'].include?(column.name)
        
        {
          name: column.name,
          type: column.type.to_s,
          enabled: current_searchable_fields.include?(column.name)
        }
      end.compact
      
      models << {name:, icon: get_model_icon(name), fields:}
    end
    models.sort_by { |model| model[:name] }
  end

  def get_model_icon(model_name)
    icon_map = {
      'Bank' => 'fa-university',
      'Status' => 'fa-flag',
      'Configuration' => 'fa-cog',
      'CostMap' => 'fa-map',
      'Floor' => 'fa-building',
      'User' => 'fa-user',
      'Company' => 'fa-briefcase',
      'Project' => 'fa-project-diagram',
      'PaymentPlan' => 'fa-credit-card',
      'Client' => 'fa-users',
      'Broker' => 'fa-handshake',
      'Booking' => 'fa-calendar-check',
      'Blocking' => 'fa-ban'
    }
    
    icon_map[model_name] || 'fa-table'
  end
end
