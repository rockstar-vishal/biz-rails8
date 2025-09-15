class Settings::CostMapsController < ApplicationController
  before_action :set_cost_maps
  before_action :set_cost_map, only: %i[show edit update destroy]

  def index
    if params[:search].present?
      @pagy, @cost_maps = pagy(@cost_maps.where("title ILIKE ?", "%#{params[:search]}%"))
    else
      @pagy, @cost_maps = pagy(@cost_maps.order(created_at: :desc))
    end
  rescue Pagy::OverflowError
    redirect_to settings_cost_maps_path(page: 1), alert: "Page not found"
  end

  def show
  end

  def new
    @cost_map = @cost_maps.new
  end

  def edit
  end

  def create
    @cost_map = @cost_maps.new(cost_map_params)

    respond_to do |format|
      if @cost_map.save
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if @cost_map.update(cost_map_params)
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    respond_to do |format|
      if @cost_map.destroy
        handle_success(format, 'deleted')
      else
        message = @cost_map.errors.full_messages.to_sentence.presence || "Cost map could not be deleted."
        handle_failure(format, 'delete', message)
      end
    end
  end

  private

  def set_cost_maps
    @cost_maps = CostMap.all.includes(:cost_type)
  end

  def set_cost_map
    @cost_map = @cost_maps.find(params[:id])
  end

  def handle_success(format, action)
    page = params.dig(:cost_map, :page) || params.dig(:page) || 1
    if ['updated'].include?(action)
      format.html { redirect_to settings_cost_maps_path(page: page), notice: "Cost map was successfully #{action}." }
      format.turbo_stream { redirect_to settings_cost_map_path(cost_map: @cost_map, page: page), status: :see_other, notice: "Cost map was successfully #{action}." }
    else
      format.html { redirect_to settings_cost_maps_path(page: page), notice: "Cost map was successfully #{action}." }
      format.turbo_stream { redirect_to settings_cost_maps_path(page: page), status: :see_other, notice: "Cost map was successfully #{action}." }
    end
  end

  def handle_failure(format, action, message = nil)
    if ['new', 'edit'].include?(action)
      flash.now[:alert] = message || @cost_map.errors.full_messages.to_sentence
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("flash-container", partial: "layouts/flash_messages"),
          turbo_stream.update("form", partial: "form", locals: { cost_map: @cost_map })
        ]
      end
    elsif action == 'delete'
      format.html { redirect_to settings_cost_maps_path(page: params[:page] || 1) }
      format.turbo_stream { redirect_to settings_cost_maps_path(page: params[:page] || 1), status: :see_other, alert: "#{@cost_map.errors.full_messages.to_sentence}" }
    end
  end

  def cost_map_params
    params.fetch(:cost_map, {}).permit(:title, :cost_type_id)
  end
end
