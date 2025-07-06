require "test_helper"

class Settings::AccountsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_accounts_index_url
    assert_response :success
  end
end
