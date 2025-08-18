class CreateBrokers < ActiveRecord::Migration[8.0]
  def change
    create_table :brokers do |t|
      t.references :company, null: false, foreign_key: true
      t.string :name
      t.string :firm_name
      t.string :code
      t.string :leadquest_code
      t.string :pan
      t.string :aadhar
      t.string :rera
      t.string :gst
      t.string :mobile
      t.string :email
      t.text :address

      t.timestamps
    end
  end
end
