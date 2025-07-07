require "test_helper"

class Reports::StatusReportBuildingControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_status_report_building_index_url
    assert_response :success
  end
end
