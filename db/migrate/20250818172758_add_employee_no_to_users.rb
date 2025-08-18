class AddEmployeeNoToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :employee_no, :string
    change_column_default :projects, :letter_builder_templates, {}
  end
end
