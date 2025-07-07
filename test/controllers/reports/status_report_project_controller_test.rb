require "test_helper"

class Reports::StatusReportProjectControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_status_report_project_index_url
    assert_response :success
  end
end
