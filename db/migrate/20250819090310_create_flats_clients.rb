class CreateFlatsClients < ActiveRecord::Migration[8.0]
  def change
    create_table :flats_clients do |t|
      t.references :flat, null: false, foreign_key: true
      t.string :clientable_type, null: false
      t.integer :clientable_id, null: false
      t.references :client, null: false, foreign_key: true
      t.boolean :is_primary, default: false

      t.timestamps
    end
  end
end
