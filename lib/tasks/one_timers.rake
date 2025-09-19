namespace :one_timers do
	task :create_search_configs => :environment do
		SearchConfig.destroy_all
		success_count, errors_count = 0
		errors = []
		SearchConfig::SEARCHABLE_MODELS.each do |klass_name|
			searchable_fields = klass_name.constantize.column_names - ['id', 'created_at', 'updated_at']
			sc = SearchConfig.new(klass_name:, searchable_fields:)
			if sc.save
				success_count+= 1
				puts "++++++++++++++++++++++++++++++"
				puts "++++++++++++++++++++++++++++++"
				puts "SEARCH-CONFIG FOR - #{klass_name} created successfully"
				puts "++++++++++++++++++++++++++++++"
				puts "++++++++++++++++++++++++++++++"
			else
				errors_count+= 1
				errros << sc.errors.full_messages.to_sentence
			end
			puts "++++++++++++++++ DONE ++++++++++++++++"
			puts "TOTAL #{SearchConfig.count} records created!! "
		end
	end
end
