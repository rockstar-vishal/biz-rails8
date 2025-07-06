require "test_helper"

class Settings::UsersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_users_index_url
    assert_response :success
  end
end
