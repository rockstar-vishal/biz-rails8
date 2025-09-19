class Settings::ClientsController < ApplicationController
  before_action :set_client_configs
  before_action :set_client, only: %i[show edit update destroy destroy_attachment]

  def index
    if params[:search].present?
      @pagy, @clients = pagy(@clients.where("name ILIKE ? OR email ILIKE ? OR phone ILIKE ? OR code ILIKE ? OR leadquest_code ILIKE ?", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%", "%#{params[:search]}%"))
    elsif params[:advance_search].present?
      @clients = @clients.advanced_search(params[:advance_search])
    end
    @pagy, @clients = pagy(@clients.order(created_at: :desc))
  rescue Pagy::OverflowError
    redirect_to settings_clients_path(page: 1), alert: "Page not found"
  end

  def show
    @projects = current_user.company.projects
  end

  def new
    @client = @clients.new
  end

  def edit
  end

  def create
    @client = @clients.new(client_params)
    
    respond_to do |format|
      if @client.save
        attach_documents if params[:client][:documents]
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if @client.update(client_params)
        attach_documents if params[:client][:documents]
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    respond_to do |format|
      if @client.destroy
        handle_success(format, 'deleted')
      else
        message = @client.errors.full_messages.to_sentence.presence || "Client could not be deleted."
        handle_failure(format, 'delete', message)
      end
    end
  end

  def destroy_attachment
    document = @client.send(params[:attachment_type])
    document.purge
    
    respond_to do |format|
      format.turbo_stream do
        turbo_stream.remove("document_#{params[:id]}")
        redirect_to settings_client_path(@client), notice: "#{params[:attachment_type].humanize} deleted successfully!"
      end
      format.json { head :no_content }
    end
  end

  private

  def set_client_configs
    @clients = Client.all
    @companies = Company.all
  end

  def set_client
    @client = @clients.find(params[:id])
  end

  def handle_success(format, action)
    page = params.dig(:client, :page) || params.dig(:page) || 1
    if ['updated'].include?(action)
      format.html { redirect_to settings_clients_path(page: page), notice: "Client was successfully #{action}." }
      format.turbo_stream { redirect_to settings_client_path(client: @client, page: page), status: :see_other, notice: "Client was successfully #{action}." }
    else
      format.html { redirect_to settings_clients_path(page: page), notice: "Client was successfully #{action}." }
      format.turbo_stream { redirect_to settings_clients_path(page: page), status: :see_other, notice: "Client was successfully #{action}." }
    end
  end

  def handle_failure(format, action, message = nil)
    if ['new', 'edit'].include?(action)
      flash.now[:alert] = message || @client.errors.full_messages.to_sentence
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("flash-container", partial: "layouts/flash_messages"),
          turbo_stream.update("form", partial: "form", locals: { client: @client })
        ]
      end
    elsif action == 'delete'
      format.html { redirect_to settings_clients_path(page: params[:page] || 1) }
      format.turbo_stream { redirect_to settings_clients_path(page: params[:page] || 1), status: :see_other, alert: "#{@client.errors.full_messages.to_sentence}" }
    end
  end

  def attach_documents
    return unless params[:document_title] && params[:document_file]
    
    params[:document_title].each_with_index do |title, index|
      next if title.blank?
      
      file = params[:document_file][index]
      next if file.blank?
      
      @client.documents.attach(
        io: file,
        filename: "#{title.parameterize}.#{file.original_filename.split('.').last}",
        content_type: file.content_type
      )
    end
  end

  def client_params
    params.require(:client).permit(
      :name, :email, :phone, :pan, :aadhar, :dob,
      :job_company, :job_designation, :code, :leadquest_code,
      :is_nri, :company_id, :photo, :pan_scan, :aadhar_scan
    )
  end
end
