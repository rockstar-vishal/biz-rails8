require "test_helper"

class Settings::TransactionsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_transactions_index_url
    assert_response :success
  end
end
