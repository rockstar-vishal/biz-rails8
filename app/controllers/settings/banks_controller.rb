class Settings::BanksController < ApplicationController
  before_action :set_banks
  before_action :set_bank, only: %i[show edit update destroy]

  def index
    if params[:search].present?
      @pagy, @banks = pagy(@banks.where("name ILIKE ?", "%#{params[:search]}%"))
    else
      @pagy, @banks = pagy(@banks.order(created_at: :desc))
    end
  rescue Pagy::OverflowError
    redirect_to settings_banks_path(page: 1), alert: "Page not found"
  end

  def show
  end

  def new
    @bank = @banks.new
  end

  def edit
  end

  def create
    @bank = @banks.new(bank_params)

    respond_to do |format|
      if @bank.save
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if @bank.update(bank_params)
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    respond_to do |format|
      if @bank.destroy
        handle_success(format, 'deleted')
      else
        message = @bank.errors.full_messages.to_sentence.presence || "Bank could not be deleted."
        handle_failure(format, 'delete', message)
      end
    end
  end

  private

  def set_banks
    @banks = Bank.all
  end

  def set_bank
    @bank = @banks.find(params[:id])
  end

  def handle_success(format, action)
    page = params.dig(:bank, :page) || params.dig(:page) || 1
    if ['updated'].include?(action)
      format.html { redirect_to settings_banks_path(page: page), notice: "Bank was successfully #{action}." }
      format.turbo_stream { redirect_to settings_bank_path(bank: @bank, page: page), status: :see_other, notice: "Bank was successfully #{action}." }
    else
      format.html { redirect_to settings_banks_path(page: page), notice: "Bank was successfully #{action}." }
      format.turbo_stream { redirect_to settings_banks_path(page: page), status: :see_other, notice: "Bank was successfully #{action}." }
    end
  end

  def handle_failure(format, action, message = nil)
    if ['new', 'edit'].include?(action)
      flash.now[:alert] = message || @bank.errors.full_messages.to_sentence
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.update("flash-container", partial: "layouts/flash_messages"),
          turbo_stream.update("form", partial: "form", locals: { bank: @bank })
        ]
      end
    elsif action == 'delete'
      format.html { redirect_to settings_banks_path(page: params[:page] || 1) }
      format.turbo_stream { redirect_to settings_banks_path(page: params[:page] || 1), status: :see_other, alert: "#{@bank.errors.full_messages.to_sentence}" }
    end
  end

  def bank_params
    params.fetch(:bank, {}).permit(:name)
  end
end
