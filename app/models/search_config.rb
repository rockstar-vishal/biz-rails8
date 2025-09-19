class SearchConfig < ApplicationRecord
	SEARCHABLE_MODELS = ['Client', 'Broker','Booking', 'Blocking'].freeze
  
  validates :klass_name, presence: true, uniqueness: true
  
  def self.fields_for(klass_name)
    find_by(klass_name:)&.searchable_fields || []
  end
  
  def self.update_fields_for(klass_name, fields)
    config = find_or_initialize_by(klass_name:)
    config.searchable_fields = fields
    config.save
  end
end
