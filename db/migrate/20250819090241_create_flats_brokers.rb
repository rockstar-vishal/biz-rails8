class CreateFlatsBrokers < ActiveRecord::Migration[8.0]
  def change
    create_table :flats_brokers do |t|
      t.references :flat, null: false, foreign_key: true
      t.string :clientable_type, null: false
      t.integer :clientable_id, null: false
      t.references :broker, null: false, foreign_key: true
      t.float :brokerage_percent
      t.float :brokerage_amount

      t.timestamps
    end
  end
end
