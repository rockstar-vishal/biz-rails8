require "test_helper"

class Settings::CostTypesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_cost_types_index_url
    assert_response :success
  end
end
