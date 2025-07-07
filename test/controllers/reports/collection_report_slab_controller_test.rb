require "test_helper"

class Reports::CollectionReportSlabControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get reports_collection_report_slab_index_url
    assert_response :success
  end
end
