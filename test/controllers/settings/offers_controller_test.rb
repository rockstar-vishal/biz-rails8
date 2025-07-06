require "test_helper"

class Settings::OffersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_offers_index_url
    assert_response :success
  end
end
