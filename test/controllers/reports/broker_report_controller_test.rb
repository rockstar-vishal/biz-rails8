require "test_helper"

class Reports::BrokerReportControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_broker_report_index_url
    assert_response :success
  end
end
