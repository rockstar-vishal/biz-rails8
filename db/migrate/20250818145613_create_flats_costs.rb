class CreateFlatsCosts < ActiveRecord::Migration[8.0]
  def change
    create_table :flats_costs do |t|
      t.references :flat, null: false, foreign_key: true
      t.references :cost_map, null: false, foreign_key: true
      t.float :amount

      t.timestamps
    end
  end
end
