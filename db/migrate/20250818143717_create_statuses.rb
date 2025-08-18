class CreateStatuses < ActiveRecord::Migration[8.0]
  def change
    create_table :statuses do |t|
      t.string :name
      t.string :for_class

      t.timestamps
    end
    add_column :companies, :allowed_statuses, :text, array: true, default: []
  end
end
