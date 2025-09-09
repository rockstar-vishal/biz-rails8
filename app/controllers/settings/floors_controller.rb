class Settings::FloorsController < ApplicationController
  before_action :set_floors
  before_action :set_floor, only: %i[show edit update destroy]

  def index
    if params[:search].present?
      @pagy, @floors = pagy(@floors.where("name ILIKE ?", "%#{params[:search]}%"))
    else
      @pagy, @floors = pagy(@floors.order(sequence: :asc, created_at: :desc))
    end
  rescue Pagy::OverflowError
    redirect_to settings_floors_path(page: 1), alert: "Page not found"
  end

  def show
  end

  def new
    @floor = @floors.new
  end

  def edit
  end

  def create
    @floor = @floors.new(floor_params)

    respond_to do |format|
      if @floor.save
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if @floor.update(floor_params)
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    respond_to do |format|
      if @floor.destroy
        handle_success(format, 'deleted')
      else
        message = @floor.errors.full_messages.to_sentence.presence || "Floor could not be deleted."
        handle_failure(format, 'delete', message)
      end
    end
  end

  private

  def set_floors
    @floors = Floor.all
  end

  def set_floor
    @floor = @floors.find(params[:id])
  end

  def handle_success(format, action)
    page = params.dig(:floor, :page) || params.dig(:page) || 1
    if ['updated'].include?(action)
      format.html { redirect_to settings_floors_path(page: page), notice: "Floor was successfully #{action}." }
      format.turbo_stream { redirect_to settings_floor_path(floor: @floor, page: page), status: :see_other, notice: "Floor was successfully #{action}." }
    else
      format.html { redirect_to settings_floors_path(page: page), notice: "Floor was successfully #{action}." }
      format.turbo_stream { redirect_to settings_floors_path(page: page), status: :see_other, notice: "Floor was successfully #{action}." }
    end
  end

  def handle_failure(format, action, message = nil)
    if ['new', 'edit'].include?(action)
      flash.now[:alert] = message || @floor.errors.full_messages.to_sentence
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("flash-container", partial: "layouts/flash_messages"),
          turbo_stream.update("form", partial: "form", locals: { floor: @floor })
        ]
      end
    elsif action == 'delete'
      format.html { redirect_to settings_floors_path(page: params[:page] || 1) }
      format.turbo_stream { redirect_to settings_floors_path(page: params[:page] || 1), status: :see_other, alert: "#{@floor.errors.full_messages.to_sentence}" }
    end
  end

  def floor_params
    params.fetch(:floor, {}).permit(:name, :sequence)
  end
end
