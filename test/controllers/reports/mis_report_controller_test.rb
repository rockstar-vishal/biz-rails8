require "test_helper"

class Reports::MisReportControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_mis_report_index_url
    assert_response :success
  end
end
