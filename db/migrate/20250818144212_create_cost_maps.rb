class CreateCostMaps < ActiveRecord::Migration[8.0]
  def change
    create_table :cost_maps do |t|
      t.string :title
      t.references :cost_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
