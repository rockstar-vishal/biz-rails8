class CreateClients < ActiveRecord::Migration[8.0]
  def change
    create_table :clients do |t|
      t.references :company, null: false, foreign_key: true
      t.string :name
      t.string :email
      t.string :phone
      t.string :pan
      t.string :aadhar
      t.date :dob
      t.string :job_company
      t.string :job_designation
      t.string :code
      t.string :leadquest_code
      t.boolean :is_nri, default: false

      t.timestamps
    end
  end
end
