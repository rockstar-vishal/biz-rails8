class CreateConfigurations < ActiveRecord::Migration[8.0]
  def change
    create_table :configurations do |t|
      t.string :name

      t.timestamps
    end
  end
end
