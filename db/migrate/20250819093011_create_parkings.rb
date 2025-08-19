class CreateParkings < ActiveRecord::Migration[8.0]
  def change
    create_table :parkings do |t|
      t.references :project, null: false, foreign_key: true
      t.string :name
      t.references :status, null: false, foreign_key: true
      t.integer :parking_type
      t.integer :area

      t.timestamps
    end
  end
end
