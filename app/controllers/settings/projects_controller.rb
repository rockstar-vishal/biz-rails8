class Settings::ProjectsController < ApplicationController
  before_action :set_project_configs
  before_action :set_project, only: %i[show edit update destroy flats]

  def index
    if params[:search].present?
      @pagy, @projects = pagy(@projects.where("name ILIKE ?", "%#{params[:search]}%"))
    else
      @pagy, @projects = pagy(@projects.order(created_at: :desc))
    end
  rescue Pagy::OverflowError
    redirect_to settings_projects_path(page: 1), alert: "Page not found"
  end

  def show
  end

  def new
    @project = @projects.new
  end

  def edit
  end

  def flats
    @flats = @project.flats
    render json: { flats: @flats }
  end

  def create
    @project = @projects.new(project_params)

    respond_to do |format|
      if @project.save
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if @project.update(project_params)
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    respond_to do |format|
      if @project.destroy
        handle_success(format, 'deleted')
      else
        message = @project.errors.full_messages.to_sentence.presence || "Project could not be deleted."
        handle_failure(format, 'delete', message)
      end
    end
  end

  private

  def set_project_configs
    @projects = Project.all
    @companies = Company.all
  end

  def set_project
    @project = @projects.find(params[:id])
  end

  def handle_success(format, action)
    page = params.dig(:project, :page) || params.dig(:page) || 1
    if ['updated'].include?(action)
      format.html { redirect_to settings_projects_path(page: page), notice: "Project was successfully #{action}." }
      format.turbo_stream { redirect_to settings_project_path(project: @project, page: page), status: :see_other, notice: "Project was successfully #{action}." }
    else
      format.html { redirect_to settings_projects_path(page: page), notice: "Project was successfully #{action}." }
      format.turbo_stream { redirect_to settings_projects_path(page: page), status: :see_other, notice: "Project was successfully #{action}." }
    end
  end

  def handle_failure(format, action, message = nil)
    if ['new', 'edit'].include?(action)
      flash.now[:alert] = message || @project.errors.full_messages.to_sentence
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("flash-container", partial: "layouts/flash_messages"),
          turbo_stream.update("form", partial: "form", locals: { project: @project })
        ]
      end
    elsif action == 'delete'
      format.html { redirect_to settings_projects_path(page: params[:page] || 1) }
      format.turbo_stream { redirect_to settings_projects_path(page: params[:page] || 1), status: :see_other, alert: "#{@project.errors.full_messages.to_sentence}" }
    end
  end

  def project_params
    params.require(:project).permit(
      :name, :company_id, :restrict_bank_for_transaction,
      allowed_bank_accounts: []
    )
  end
end
