require "test_helper"

class Settings::ClientsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get settings_clients_index_url
    assert_response :success
  end
end
