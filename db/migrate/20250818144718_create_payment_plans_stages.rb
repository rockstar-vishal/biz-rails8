class CreatePaymentPlansStages < ActiveRecord::Migration[8.0]
  def change
    create_table :payment_plans_stages do |t|
      t.references :payment_plan, null: false, foreign_key: {to_table: :projects_payment_plans}
      t.string :name
      t.float :amount
      t.float :percentage
      t.references :cost_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
