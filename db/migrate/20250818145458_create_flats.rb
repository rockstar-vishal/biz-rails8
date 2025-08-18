class CreateFlats < ActiveRecord::Migration[8.0]
  def change
    create_table :flats do |t|
      t.references :company, null: false, foreign_key: true
      t.references :building, null: false, foreign_key: true
      t.string :name
      t.references :config, null: false, foreign_key: {to_table: :configurations}
      t.integer :facing
      t.integer :carpet_area
      t.references :status, null: false, foreign_key: true
      t.references :floor, null: false, foreign_key: true
      t.string :code

      t.timestamps
    end
  end
end
