require "test_helper"

class Reports::StatusReportAreawiseControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_status_report_areawise_index_url
    assert_response :success
  end
end
