require "test_helper"

class Settings::TdsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_tds_index_url
    assert_response :success
  end
end
