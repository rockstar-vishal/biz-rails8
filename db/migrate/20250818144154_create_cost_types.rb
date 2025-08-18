class CreateCostTypes < ActiveRecord::Migration[8.0]
  def change
    create_table :cost_types do |t|
      t.string :name
      t.string :tag

      t.timestamps
    end
  end
end
