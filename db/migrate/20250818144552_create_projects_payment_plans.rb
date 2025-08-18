class CreateProjectsPaymentPlans < ActiveRecord::Migration[8.0]
  def change
    create_table :projects_payment_plans do |t|
      t.references :project, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
