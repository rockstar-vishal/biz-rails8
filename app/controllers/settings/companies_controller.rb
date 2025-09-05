class Settings::CompaniesController < ApplicationController
  before_action :set_companies
  before_action :set_company, only: [:show, :edit, :update, :destroy]
  
  def index
    if params[:search].present?
      @pagy, @companies = pagy(@companies.where("name ILIKE ?", "%#{params[:search]}%"))
    else
      @pagy, @companies = pagy(@companies.order(created_at: :desc))
    end
  rescue Pagy::OverflowError
    redirect_to settings_companies_path(page: 1), alert: "Page not found"
  end
  
  def new
    @company = @companies.new
  end
  
  def edit; end
  def show; end
  
  def create
    @company = @companies.new(company_params)
    
    if @company.save
      flash[:notice] = "Company was successfully created."
      redirect_to settings_companies_path
    else
      flash.now[:alert] = "There was a problem creating the company."
      render :new, status: :unprocessable_entity
    end
  end
  
  def update
    if @company.update(company_params)
      flash[:notice] = "Company was successfully updated."
      redirect_to settings_companies_path
    else
      flash.now[:alert] = "There was a problem updating the company."
      render :edit, status: :unprocessable_entity
    end
  end
  
  def destroy
    @company.destroy
    flash[:notice] = "Company was successfully destroyed."
    redirect_to settings_companies_path
  end
  
  private

  def set_companies
    @companies = Company.all
  end
  
  def set_company
    @company = @companies.find(params[:id])
  end
  
  def company_params
    params.require(:company).permit(
      :name, 
      :domain, 
      :project_limit, 
      :unit_limit, 
      :code, 
      :user_project_restricted, 
      :max_registration_charges, 
      :default_sdr_percent, 
      :default_registration_percent, 
      :default_legal_charges,
      broker_mandatory_fields: [],
      client_mandatory_fields: [],
      allowed_configs: [],
      allowed_banks: [],
      allowed_cost_maps: [],
      allowed_statuses: []
    )
  end
end
