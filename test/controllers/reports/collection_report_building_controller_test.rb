require "test_helper"

class Reports::CollectionReportBuildingControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_collection_report_building_index_url
    assert_response :success
  end
end
