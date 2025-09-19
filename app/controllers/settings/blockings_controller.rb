class Settings::BlockingsController < ApplicationController
  before_action :set_blocking, only: [:show, :edit, :update, :destroy]
  before_action :load_associations, only: [:index, :new, :edit, :create, :update]

  def index
    @blockings = current_user.company.blockings
                            .includes(:company, :flat, :project, :blocked_by)
                            .order(created_at: :desc)
    @pagy, @blockings = pagy(@blockings.order(created_at: :desc))
    @blockings = @blockings.advanced_search(params[:advance_search]) if params[:advance_search].present?
    	
    respond_to do |format|
      format.html
      format.json { render json: @blockings }
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @blocking }
    end
  end

  def new
    @blocking = current_user.company.blockings.build
    @blocking.date = Date.current
    @blocking.blocked_by = current_user
  end

  def create
    @blocking = current_user.company.blockings.build(blocking_params)
    @blocking.blocked_by = current_user

    respond_to do |format|
      if @blocking.save
        format.html { redirect_to settings_blockings_path, notice: 'Blocking was successfully created.' }
        format.json { render json: @blocking, status: :created }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @blocking.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    respond_to do |format|
      if @blocking.update(blocking_params)
        format.html { redirect_to settings_blocking_path(@blocking), notice: 'Blocking was successfully updated.' }
        format.json { render json: @blocking }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @blocking.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @blocking.destroy
    respond_to do |format|
      format.html { redirect_to settings_blockings_path, notice: 'Blocking was successfully deleted.' }
      format.json { head :no_content }
    end
  end

  private

  def set_blocking
    @blocking = current_user.company.blockings.find(params[:id])
  end

  def blocking_params
    params.require(:blocking).permit(:flat_id, :project_id, :date, :comment, :blocked_upto)
  end

  def load_associations
    @projects = current_user.company.projects.order(:name)
    @flats = if params[:project_id].present?
               current_user.company.flats.where(project_id: params[:project_id]).includes(:building)
             else
               current_user.company.flats.includes(:building).limit(100)
             end
  end
end
