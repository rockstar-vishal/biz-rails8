require "test_helper"

class Settings::TaxesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_taxes_index_url
    assert_response :success
  end
end
