module AdvancedSearchable
  extend ActiveSupport::Concern

  def advanced_search(search_params)
    self.class.advanced_search_on_relation(self, search_params)
  end

  module ClassMethods
    def advanced_search(search_params)
      advanced_search_on_relation(all, search_params)
    end

    def advanced_search_on_relation(relation, search_params)
      return relation if search_params.blank?

      results = relation
      
      search_params.each do |field, value|
        next if value.blank?
        
        if field =~ /_(gt|lt|gte|lte|from|to)$/
          results = handle_range_query(results, field, value)
        else
          if field.end_with?('_id') && reflect_on_association(field.gsub('_id', '').to_sym)
            results = handle_association_search(results, field, value)
          else
            next unless column_exists?(field)
            results = apply_search_filter(results, field, value)
          end
        end
      end
      
      results
    end

    private

    def handle_association_search(relation, field, value)
      association_name = field.gsub('_id', '').to_sym
      association = reflect_on_association(association_name)
      
      return relation unless association
      
      if association.macro == :belongs_to
        relation.where(field => value)
      else
        relation.joins(association_name).where(association.klass.table_name => { id: value })
      end
    end

    def handle_range_query(relation, field, value)
      operator = field.split('_').last
      base_field = field.gsub("_#{operator}", "")
      return relation unless column_exists?(base_field)
      
      column_type = column_type(base_field)      
      converted_value = convert_value(column_type, value)
      
      case operator
      when 'gt', 'from'
        relation.where("#{base_field} > ?", converted_value)
      when 'lt', 'to'
        relation.where("#{base_field} < ?", converted_value)
      when 'gte'
        relation.where("#{base_field} >= ?", converted_value)
      when 'lte'
        relation.where("#{base_field} <= ?", converted_value)
      else
        relation
      end
    end

    def apply_search_filter(relation, column_name, value)
      column_type = column_type(column_name)
      converted_value = convert_value(column_type, value)
      
      case column_type
      when :string, :text
        relation.where("#{column_name} ILIKE ?", "%#{converted_value}%")
      when :boolean
        boolean_value = ['true', '1', 'yes', 't', true].include?(value.to_s.downcase)
        relation.where("#{column_name} = ?", boolean_value)
      else
        relation.where("#{column_name} = ?", converted_value)
      end
    end

    def convert_value(column_type, value)
      case column_type
      when :integer, :bigint
        value.to_i
      when :decimal, :float
        value.to_f
      when :date
        value.to_date
      when :datetime, :timestamp
        value.to_time
      when :boolean
        value
      else
        value
      end
    end

    def column_exists?(column_name)
      column_names.include?(column_name.to_s)
    end

    def column_type(column_name)
      columns_hash[column_name.to_s]&.type || :string
    end
  end
end
