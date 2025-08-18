class Bank < ApplicationRecord
	include Nameable
	nameable_with_scope
end
