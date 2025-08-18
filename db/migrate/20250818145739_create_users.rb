class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.references :company, null: false, foreign_key: true
      t.string :name
      t.string :phone
      t.references :role, null: false, foreign_key: true
      t.text :allowed_projects, array: true, default: []

      t.timestamps
    end
  end
end
