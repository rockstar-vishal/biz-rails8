class CreateSearchConfigs < ActiveRecord::Migration[8.0]
  def change
    create_table :search_configs do |t|
      t.string :klass_name
      t.text :searchable_fields, array: true, default: [] 

      t.timestamps
    end
  end
end
