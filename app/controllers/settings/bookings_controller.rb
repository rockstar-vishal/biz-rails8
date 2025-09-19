class Settings::BookingsController < ApplicationController

	def index
    @bookings = Booking.all.order(created_at: :desc)
    @bookings = @bookings.advanced_search(params[:advance_search]) if params[:advance_search].present?

    @pagy, @bookings = pagy(@bookings)
  rescue Pagy::OverflowError
    redirect_to settings_booking_path(page: 1)
  end
end