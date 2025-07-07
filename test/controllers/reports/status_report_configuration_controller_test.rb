require "test_helper"

class Reports::StatusReportConfigurationControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_status_report_configuration_index_url
    assert_response :success
  end
end
