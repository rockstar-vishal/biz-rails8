class CreateBookings < ActiveRecord::Migration[8.0]
  def change
    create_table :bookings do |t|
      t.references :company, null: false, foreign_key: true
      t.references :flat, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.date :date
      t.string :code
      t.boolean :registered, default: false
      t.date :registration_date
      t.string :registration_no
      t.string :application_no
      t.date :application_date
      t.date :posession_date
      t.datetime :ncd
      t.text :comment
      t.references :payment_plan, null: false, foreign_key: {to_table: :projects_payment_plans}
      t.text :remark
      t.references :booked_by, null: false, foreign_key: {to_table: :users}
      t.float :loan_amount
      t.references :loan_bank, foreign_key: {to_table: :banks}
      t.float :sdr_percent
      t.float :registration_charges
      t.float :legal_charges

      t.timestamps
    end
  end
end
