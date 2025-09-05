class Settings::UsersController < ApplicationController
  before_action :set_user_configs
  before_action :set_user, only: %i[show edit update destroy]

  def index
    if params[:search].present?
      @pagy, @users = pagy(@users.where("name ILIKE ? OR email ILIKE ?", "%#{params[:search]}%", "%#{params[:search]}%"))
    else
      @pagy, @users = pagy(@users.order(created_at: :desc))
    end
  rescue Pagy::OverflowError
    redirect_to settings_users_path(page: 1), alert: "Page not found"
  end

  def show
    @projects = current_user.company.projects
  end

  def new
    @user = @users.new
    @roles = Role.all
  end

  def edit
    @roles = Role.all
  end

  def create
    @user = @users.new(user_params)

    respond_to do |format|
      if @user.save
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if user_params[:password].blank?
        params[:user].delete(:password)
        params[:user].delete(:password_confirmation)
      end
      
      if @user.update(user_params)
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    respond_to do |format|
      if @user.destroy
        handle_success(format, 'deleted')
      else
        message = @user.errors.full_messages.to_sentence.presence || "User could not be deleted."
        handle_failure(format, 'delete', message)
      end
    end
  end

  private

  def set_user_configs
    @users = User.all
    @companies = Company.all
    @roles = Role.all
  end

  def set_user
    @user = @users.find(params[:id])
  end

  def handle_success(format, action)
    page = params.dig(:user, :page) || params.dig(:page) || 1
    if ['updated'].include?(action)
      format.html { redirect_to settings_users_path(page: page), notice: "User was successfully #{action}." }
      format.turbo_stream { redirect_to settings_user_path(user: @user, page: page), status: :see_other, notice: "User was successfully #{action}." }
    else
      format.html { redirect_to settings_users_path(page: page), notice: "User was successfully #{action}." }
      format.turbo_stream { redirect_to settings_users_path(page: page), status: :see_other, notice: "User was successfully #{action}." }
    end
  end

  def handle_failure(format, action, message = nil)
    if ['new', 'edit'].include?(action)
      flash.now[:alert] = message || @user.errors.full_messages.to_sentence
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("flash-container", partial: "layouts/flash_messages"),
          turbo_stream.update("form", partial: "form", locals: { user: @user })
        ]
      end
    elsif action == 'delete'
      format.html { redirect_to settings_users_path(page: params[:page] || 1) }
      format.turbo_stream { redirect_to settings_users_path(page: params[:page] || 1), status: :see_other, alert: "#{@user.errors.full_messages.to_sentence}" }
    end
  end

  def user_params
    params.require(:user).permit(
      :email, :name, :phone, :employee_no,
      :role_id, :company_id, :password, :password_confirmation
    )
  end
end
