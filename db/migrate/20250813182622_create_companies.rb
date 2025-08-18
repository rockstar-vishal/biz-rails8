class CreateCompanies < ActiveRecord::Migration[8.0]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :domain
      t.integer :project_limit
      t.integer :unit_limit
      t.string :code
      t.text :broker_mandatory_fields, array:true, default: []
      t.text :client_mandatory_fields, array:true, default: []
      t.text :allowed_configs, array:true, default: []
      t.text :allowed_banks, array:true, default: []
      t.boolean :user_project_restricted, default: false
      t.text :allowed_cost_maps, array:true, default: []
      t.integer :max_registration_charges
      t.integer :default_sdr_percent
      t.integer :default_registration_percent
      t.integer :default_legal_charges

      t.timestamps
    end
  end
end
