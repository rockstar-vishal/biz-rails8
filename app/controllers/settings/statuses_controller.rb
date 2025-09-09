class Settings::StatusesController < ApplicationController
  before_action :set_status, only: [:show, :edit, :update, :destroy]
  before_action :set_statuses
  helper_method :calculate_stats

  def index
    @search_param = params[:search]
    @filter_param = params[:filter]
    
    @statuses = @statuses.where("name ILIKE ? OR for_class ILIKE ? OR tag ILIKE ?", 
                             "%#{@search_param}%", "%#{@search_param}%", "%#{@search_param}%") if @search_param.present?
    @statuses = @statuses.where(tag: @filter_param) if @filter_param.present? && @filter_param != 'all'
    
    @pagy, @statuses = pagy(@statuses)
    @statuses_json = @statuses.as_json(only: [:id, :name, :for_class, :tag])
    
    respond_to do |format|
      format.html
    end
  end

  def new
    @status = @statuses.new
    respond_to do |format|
      format.html
    end
  end

  def edit
    respond_to do |format|
      format.html
    end
  end

  def show    
    @flat_statuses_count = @statuses.joins(:flats)
                                    .where(for_class: 'Flat')
                                    .group('statuses.name')
                                    .count
    
    @parking_statuses_count = @statuses.joins(:parkings)
                                       .where(for_class: 'Parking')
                                       .group('statuses.name')
                                       .count
  end

  def create
    @status = @statuses.new(status_params)

    respond_to do |format|
      if @status.save
        handle_success(format, 'created')
      else
        handle_failure(format, 'new')
      end
    end
  end

  def update
    respond_to do |format|
      if @status.update(status_params)
        handle_success(format, 'updated')
      else
        handle_failure(format, 'edit')
      end
    end
  end

  def destroy
    @status_name = @status.name
    
    respond_to do |format|
      if @status.destroy
        handle_success(format, 'deleted', "Status '#{@status_name}' was successfully deleted.")
      else
        handle_failure(format, 'index', 'Status could not be deleted.')
      end
    end
  end

  def stats
    total_count = @statuses.count
    available_count = @statuses.where(tag: 'available').count
    booked_count = @statuses.where(tag: 'booked').count
    blocked_count = @statuses.where(tag: 'blocked').count
    parking_count = @statuses.where(for_class: 'Parking').count
    flat_count = @statuses.where(for_class: 'Flat').count
    
    stats = {
      total: total_count,
      by_tag: {
        available: available_count,
        booked: booked_count,
        blocked: blocked_count
      },
      by_class: {
        parking: parking_count,
        flat: flat_count
      }
    }
    
    respond_to do |format|
      format.json { render json: stats }
    end
  end

  private

  def set_status
    @status = Status.find(params[:id])
  end

  def set_statuses
    @statuses = Status.all
  end

  def status_params
    params.require(:status).permit(:name, :for_class, :tag)
  end

  def calculate_stats
    {
      total: @statuses.count,
      available: @statuses.where(tag: 'available').count,
      booked: @statuses.where(tag: 'booked').count,
      blocked: @statuses.where(tag: 'blocked').count
    }
  end

  def handle_success(format, action, custom_message = nil)
    message = custom_message || "Status was successfully #{action}."
    @stats = calculate_stats
    @search_param = params[:search]
    @filter_param = params[:filter]

    format.html do
      redirect_to settings_statuses_path, notice: message
    end

    format.turbo_stream do
      flash.now[:notice] = message
      
      if action == 'deleted'
        render turbo_stream: [
          turbo_stream.remove("status_#{@status.id}"),
          turbo_stream.update("stats_section", partial: "stats_section", locals: { stats: @stats }),
          (@search_param.present? || (@filter_param.present? && @filter_param != 'all')) ?
            turbo_stream.update("filter_section", partial: "filter_section", locals: { search_param: @search_param, filter_param: @filter_param }) : nil,
          turbo_stream.update("flash_messages", partial: "layouts/flash_messages"),
          turbo_stream.append("body", "<script>
            document.dispatchEvent(new CustomEvent('status:deleted', {
              detail: { 
                statusId: #{@status.id}, 
                stats: #{@stats.to_json} 
              }
            }));
          </script>")
        ].compact
      else
        render turbo_stream: [
          action == 'created' ? 
            turbo_stream.prepend("status_grid", partial: "status_card", locals: { status: @status }) :
            turbo_stream.replace("status_#{@status.id}", partial: "status_card", locals: { status: @status }),
          turbo_stream.update("stats_section", partial: "stats_section", locals: { stats: @stats }),
          turbo_stream.update("status_modal", ""),
          turbo_stream.append("flash_messages", partial: "layouts/flash_messages"),
          turbo_stream.append("body", "<script>
            document.dispatchEvent(new CustomEvent('status:#{action}', {
              detail: { 
                status: #{@status.as_json(only: [:id, :name, :for_class, :tag]).to_json}, 
                stats: #{@stats.to_json} 
              }
            }));
          </script>")
        ]
      end
    end
  end

  def handle_failure(format, action, custom_message = nil)
    message = custom_message || @status.errors.full_messages.to_sentence.presence || "Something went wrong."

    format.html do
      if action == 'new'
        render :new, status: :unprocessable_entity
      elsif action == 'edit'
        render :edit, status: :unprocessable_entity
      else
        redirect_to settings_statuses_path, alert: message
      end
    end

    format.turbo_stream do
      flash.now[:alert] = message
      
      if action == 'new' || action == 'edit'
        render turbo_stream: [
          turbo_stream.replace(
            "status_modal",
            template: "settings/statuses/#{action}"
          )
        ], status: :unprocessable_entity
      else
        render turbo_stream: turbo_stream.update("flash_messages", partial: "layouts/flash_messages")
      end
    end
  end
end
