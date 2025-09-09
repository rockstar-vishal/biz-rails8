class Settings::ConfigurationsController < ApplicationController
  before_action :set_configurations
  before_action :set_configuration, only: %i[show edit update destroy]

  def index
    if params[:search].present?
      @pagy, @configurations = pagy(@configurations.where("name ILIKE ?", "%#{params[:search]}%"))
    else
      @pagy, @configurations = pagy(@configurations.order(created_at: :desc))
    end
  rescue Pagy::OverflowError
    redirect_to settings_configurations_path(page: 1), alert: "Page not found"
  end

  def show
  end

  def new
    @configuration = @configurations.new
  end

  def edit
  end

  def create
    @configuration = @configurations.new(configuration_params)

    respond_to do |format|
      if @configuration.save
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if @configuration.update(configuration_params)
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    respond_to do |format|
      if @configuration.destroy
        handle_success(format, 'deleted')
      else
        message = @configuration.errors.full_messages.to_sentence.presence || "Configuration could not be deleted."
        handle_failure(format, 'delete', message)
      end
    end
  end

  private

  def set_configurations
    @configurations = ::Configuration.all
  end

  def set_configuration
    @configuration = @configurations.find(params[:id])
  end

  def handle_success(format, action)
    page = params.dig(:configuration, :page) || params.dig(:page) || 1
    if ['updated'].include?(action)
      format.html { redirect_to settings_configurations_path(page: page), notice: "Configuration was successfully #{action}." }
      format.turbo_stream { redirect_to settings_configuration_path(configuration: @configuration, page: page), status: :see_other, notice: "Configuration was successfully #{action}." }
    else
      format.html { redirect_to settings_configurations_path(page: page), notice: "Configuration was successfully #{action}." }
      format.turbo_stream { redirect_to settings_configurations_path(page: page), status: :see_other, notice: "Configuration was successfully #{action}." }
    end
  end

  def handle_failure(format, action, message = nil)
    if ['new', 'edit'].include?(action)
      flash.now[:alert] = message || @configuration.errors.full_messages.to_sentence
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("flash-container", partial: "layouts/flash_messages"),
          turbo_stream.update("form", partial: "form", locals: { configuration: @configuration })
        ]
      end
    elsif action == 'delete'
      format.html { redirect_to settings_configurations_path(page: params[:page] || 1) }
      format.turbo_stream { redirect_to settings_configurations_path(page: params[:page] || 1), status: :see_other, alert: "#{@configuration.errors.full_messages.to_sentence}" }
    end
  end

  def configuration_params
    params.fetch(:configuration, {}).permit(:name)
  end
end
