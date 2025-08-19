class CreateBlockings < ActiveRecord::Migration[8.0]
  def change
    create_table :blockings do |t|
      t.references :company, null: false, foreign_key: true
      t.references :flat, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.date :date
      t.text :comment
      t.references :blocked_by, null: false, foreign_key: {to_table: :users}
      t.string :code
      t.date :blocked_upto

      t.timestamps
    end
  end
end
