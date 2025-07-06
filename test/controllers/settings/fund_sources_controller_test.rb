require "test_helper"

class Settings::FundSourcesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_fund_sources_index_url
    assert_response :success
  end
end
