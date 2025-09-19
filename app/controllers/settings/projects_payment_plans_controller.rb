class Settings::ProjectsPaymentPlansController < ApplicationController
  before_action :set_payment_plan_configs
  before_action :set_payment_plan, only: %i[show edit update destroy]

  def index
    @payment_plans = @payment_plans.includes(:project, :stages)
    
    if params[:project_id].present?
      @payment_plans = @payment_plans.where(project_id: params[:project_id])
    end
    
    if params[:search].present?
      @payment_plans = @payment_plans.joins(:project).where(
        "projects_payment_plans.name ILIKE ? OR projects.name ILIKE ?", 
        "%#{params[:search]}%", "%#{params[:search]}%"
      )
    end

    begin
      @pagy, @payment_plans = pagy(@payment_plans.order(created_at: :desc))
    rescue Pagy::OverflowError
      redirect_to settings_projects_payment_plans_path(page: 1), alert: "Page not found"
    end
  end

  def show
  end

  def new
    @payment_plan = @payment_plans.new
    @payment_plan.stages.build
  end

  def edit
  end

  def create
    @payment_plan = @payment_plans.new(payment_plan_params)
    
    respond_to do |format|
      if @payment_plan.save
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if @payment_plan.update(payment_plan_params)
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    respond_to do |format|
      if @payment_plan.destroy
        handle_success(format, 'deleted')
      else
        message = @payment_plan.errors.full_messages.to_sentence.presence || "Payment plan could not be deleted."
        handle_failure(format, 'delete', message)
      end
    end
  end

  private

  def set_payment_plan_configs
    @payment_plans = current_user.company.payment_plans
    @projects = current_user.company.projects
    @cost_types = CostType.all
  end

  def set_payment_plan
    @payment_plan = @payment_plans.find(params[:id])
  end

  def handle_success(format, action)
    page = params.dig(:payment_plan, :page) || params.dig(:page) || 1
    project_filter = params.dig(:payment_plan, :project_id) || params.dig(:project_id)
    filter_params = project_filter.present? ? { project_id: project_filter } : {}
    
    if ['updated'].include?(action)
      format.html { redirect_to settings_projects_payment_plans_path(filter_params.merge(page: page)), notice: "Payment plan was successfully #{action}." }
      format.turbo_stream { redirect_to settings_projects_payment_plan_path(@payment_plan, filter_params.merge(page: page)), status: :see_other, notice: "Payment plan was successfully #{action}." }
    else
      format.html { redirect_to settings_projects_payment_plans_path(filter_params.merge(page: page)), notice: "Payment plan was successfully #{action}." }
      format.turbo_stream { redirect_to settings_projects_payment_plans_path(filter_params.merge(page: page)), status: :see_other, notice: "Payment plan was successfully #{action}." }
    end
  end

  def handle_failure(format, action, message = nil)
    if ['new', 'edit'].include?(action)
      flash.now[:alert] = message || @payment_plan.errors.full_messages.to_sentence
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("flash-container", partial: "layouts/flash_messages"),
          turbo_stream.update("form", partial: "form", locals: { payment_plan: @payment_plan })
        ]
      end
    elsif action == 'delete'
      format.html { redirect_to settings_projects_payment_plans_path(page: params[:page] || 1) }
      format.turbo_stream { redirect_to settings_projects_payment_plans_path(page: params[:page] || 1), status: :see_other, alert: "#{@payment_plan.errors.full_messages.to_sentence}" }
    end
  end

  def payment_plan_params
    params.require(:projects_payment_plan).permit(
      :name, :project_id,
      stages_attributes: [:id, :name, :amount, :percentage, :cost_type_id, :_destroy]
    )
  end
end
