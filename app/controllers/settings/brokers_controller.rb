class Settings::BrokersController < ApplicationController
  before_action :set_broker_configs
  before_action :set_broker, only: %i[show edit update destroy destroy_attachment]

  def index
    if params[:search].present?
      @pagy, @brokers = pagy(@brokers.where("name ILIKE ? OR firm_name ILIKE ? OR email ILIKE ? OR mobile ILIKE ? OR code ILIKE ? OR leadquest_code ILIKE ?", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%"))
    elsif params[:advance_search].present?
    	@brokers = @brokers.advanced_search(params[:advance_search])
    end
    @pagy, @brokers = pagy(@brokers.order(created_at: :desc))
  rescue Pagy::OverflowError
    redirect_to settings_brokers_path(page: 1), alert: "Page not found"
  end

  def show
    @projects = current_user.company.projects
  end

  def new
    @broker = @brokers.new
  end

  def edit
  end

  def create
    @broker = @brokers.new(broker_params)
    
    respond_to do |format|
      if @broker.save
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if @broker.update(broker_params)
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    respond_to do |format|
      if @broker.destroy
        handle_success(format, 'deleted')
      else
        message = @broker.errors.full_messages.to_sentence.presence || "Broker could not be deleted."
        handle_failure(format, 'delete', message)
      end
    end
  end

  def destroy_attachment
    document = @broker.send(params[:attachment_type])
    document.purge
    
    respond_to do |format|
      format.turbo_stream do
        turbo_stream.remove("document_#{params[:id]}")
        redirect_to settings_broker_path(@broker), notice: "#{params[:attachment_type].humanize} deleted successfully!"
      end
      format.json { head :no_content }
    end
  end

  private

  def set_broker_configs
    @brokers = Broker.all
    @companies = Company.all
  end

  def set_broker
    @broker = @brokers.find(params[:id])
  end

  def handle_success(format, action)
    page = params.dig(:broker, :page) || params.dig(:page) || 1
    if ['updated'].include?(action)
      format.html { redirect_to settings_brokers_path(page: page), notice: "Broker was successfully #{action}." }
      format.turbo_stream { redirect_to settings_broker_path(broker: @broker, page: page), status: :see_other, notice: "Broker was successfully #{action}." }
    else
      format.html { redirect_to settings_brokers_path(page: page), notice: "Broker was successfully #{action}." }
      format.turbo_stream { redirect_to settings_brokers_path(page: page), status: :see_other, notice: "Broker was successfully #{action}." }
    end
  end

  def handle_failure(format, action, message = nil)
    if ['new', 'edit'].include?(action)
      flash.now[:alert] = message || @broker.errors.full_messages.to_sentence
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("flash-container", partial: "layouts/flash_messages"),
          turbo_stream.update("form", partial: "form", locals: { broker: @broker })
        ]
      end
    elsif action == 'delete'
      format.html { redirect_to settings_brokers_path(page: params[:page] || 1) }
      format.turbo_stream { redirect_to settings_brokers_path(page: params[:page] || 1), status: :see_other, alert: "#{@broker.errors.full_messages.to_sentence}" }
    end
  end

  def broker_params
    params.require(:broker).permit(
      :name, :firm_name, :code, :leadquest_code, :pan, :aadhar, :rera, :gst,
      :mobile, :email, :address, :company_id, 
      :pan_scan, :aadhar_scan, :gst_scan, :rera_scan
    )
  end
end
