class CreateCompaniesBankAccounts < ActiveRecord::Migration[8.0]
  def change
    create_table :companies_bank_accounts do |t|
      t.references :company, null: false, foreign_key: true
      t.string :ac_no
      t.references :bank, null: false, foreign_key: true
      t.string :benf_name
      t.string :branch
      t.string :ifsc

      t.timestamps
    end
  end
end
