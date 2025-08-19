class CreateBookingsPaymentSchedules < ActiveRecord::Migration[8.0]
  def change
    create_table :bookings_payment_schedules do |t|
      t.references :booking, null: false, foreign_key: true
      t.references :stage, null: false, foreign_key: {to_table: :payment_plans_stages}
      t.string :title
      t.float :percent
      t.integer :amount
      t.date :due_date
      t.references :cost_type, null: false, foreign_key: true
      t.integer :gst
      t.integer :interest

      t.timestamps
    end
  end
end
