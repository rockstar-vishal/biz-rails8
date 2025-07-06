require "test_helper"

class Settings::InterestControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_interest_index_url
    assert_response :success
  end
end
