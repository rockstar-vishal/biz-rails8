require "test_helper"

class Reports::CollectionReporProjectControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_collection_repor_project_index_url
    assert_response :success
  end
end
