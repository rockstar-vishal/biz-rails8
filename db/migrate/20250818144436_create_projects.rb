class CreateProjects < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.references :company, null: false, foreign_key: true
      t.string :name
      t.json :letter_builder_templates
      t.boolean :restrict_bank_for_transaction, default: false
      t.text :allowed_bank_accounts, array: true, default: []

      t.timestamps
    end
  end
end
