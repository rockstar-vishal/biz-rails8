class AddTagToStatuses < ActiveRecord::Migration[8.0]
  def change
    add_column :statuses, :tag, :integer
  end
end
