class CreateGstRates < ActiveRecord::Migration[8.0]
  def change
    create_table :gst_rates do |t|
      t.references :cost_type, null: false, foreign_key: true
      t.integer :amount_from
      t.float :rate
      t.date :effective_from

      t.timestamps
    end
  end
end
