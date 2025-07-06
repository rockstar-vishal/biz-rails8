require "test_helper"

class Settings::BankControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_bank_index_url
    assert_response :success
  end
end
