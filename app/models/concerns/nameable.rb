module Nameable
  extend ActiveSupport::Concern
  
  class_methods do
    def nameable_with_scope(*scope_attributes)
      validates :name, presence: true
      
      if scope_attributes.any?
        validates_uniqueness_of :name, case_sensitive: false, scope: scope_attributes
      else
        validates_uniqueness_of :name, case_sensitive: false
      end
    end
  end
end