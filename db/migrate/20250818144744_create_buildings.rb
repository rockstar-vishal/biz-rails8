class CreateBuildings < ActiveRecord::Migration[8.0]
  def change
    create_table :buildings do |t|
      t.references :project, null: false, foreign_key: true
      t.string :name
      t.boolean :is_default, default: false

      t.timestamps
    end
  end
end
