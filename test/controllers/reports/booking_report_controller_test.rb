require "test_helper"

class Reports::BookingReportControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_booking_report_index_url
    assert_response :success
  end
end
