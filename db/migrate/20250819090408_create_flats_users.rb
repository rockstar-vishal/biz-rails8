class CreateFlatsUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :flats_users do |t|
      t.references :flat, null: false, foreign_key: true
      t.string :clientable_type, null: false
      t.integer :clientable_id, null: false
      t.references :user, null: false, foreign_key: true
      t.float :contribution
      t.integer :team

      t.timestamps
    end
  end
end
