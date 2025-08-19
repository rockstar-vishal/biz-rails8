# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_19_094026) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "banks", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "blockings", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.bigint "flat_id", null: false
    t.bigint "project_id", null: false
    t.date "date"
    t.text "comment"
    t.bigint "blocked_by_id", null: false
    t.string "code"
    t.date "blocked_upto"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["blocked_by_id"], name: "index_blockings_on_blocked_by_id"
    t.index ["company_id"], name: "index_blockings_on_company_id"
    t.index ["flat_id"], name: "index_blockings_on_flat_id"
    t.index ["project_id"], name: "index_blockings_on_project_id"
  end

  create_table "bookings", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.bigint "flat_id", null: false
    t.bigint "project_id", null: false
    t.date "date"
    t.string "code"
    t.boolean "registered", default: false
    t.date "registration_date"
    t.string "registration_no"
    t.string "application_no"
    t.date "application_date"
    t.date "posession_date"
    t.datetime "ncd"
    t.text "comment"
    t.bigint "payment_plan_id", null: false
    t.text "remark"
    t.bigint "booked_by_id", null: false
    t.float "loan_amount"
    t.bigint "loan_bank_id"
    t.float "sdr_percent"
    t.float "registration_charges"
    t.float "legal_charges"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booked_by_id"], name: "index_bookings_on_booked_by_id"
    t.index ["company_id"], name: "index_bookings_on_company_id"
    t.index ["flat_id"], name: "index_bookings_on_flat_id"
    t.index ["loan_bank_id"], name: "index_bookings_on_loan_bank_id"
    t.index ["payment_plan_id"], name: "index_bookings_on_payment_plan_id"
    t.index ["project_id"], name: "index_bookings_on_project_id"
  end

  create_table "bookings_payment_schedules", force: :cascade do |t|
    t.bigint "booking_id", null: false
    t.bigint "stage_id", null: false
    t.string "title"
    t.float "percent"
    t.integer "amount"
    t.date "due_date"
    t.bigint "cost_type_id", null: false
    t.integer "gst"
    t.integer "interest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["booking_id"], name: "index_bookings_payment_schedules_on_booking_id"
    t.index ["cost_type_id"], name: "index_bookings_payment_schedules_on_cost_type_id"
    t.index ["stage_id"], name: "index_bookings_payment_schedules_on_stage_id"
  end

  create_table "brokers", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "name"
    t.string "firm_name"
    t.string "code"
    t.string "leadquest_code"
    t.string "pan"
    t.string "aadhar"
    t.string "rera"
    t.string "gst"
    t.string "mobile"
    t.string "email"
    t.text "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_brokers_on_company_id"
  end

  create_table "buildings", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.string "name"
    t.boolean "is_default", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_buildings_on_project_id"
  end

  create_table "clients", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "name"
    t.string "email"
    t.string "phone"
    t.string "pan"
    t.string "aadhar"
    t.date "dob"
    t.string "job_company"
    t.string "job_designation"
    t.string "code"
    t.string "leadquest_code"
    t.boolean "is_nri", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_clients_on_company_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.string "domain"
    t.integer "project_limit"
    t.integer "unit_limit"
    t.string "code"
    t.text "broker_mandatory_fields", default: [], array: true
    t.text "client_mandatory_fields", default: [], array: true
    t.text "allowed_configs", default: [], array: true
    t.text "allowed_banks", default: [], array: true
    t.boolean "user_project_restricted", default: false
    t.text "allowed_cost_maps", default: [], array: true
    t.integer "max_registration_charges"
    t.integer "default_sdr_percent"
    t.integer "default_registration_percent"
    t.integer "default_legal_charges"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "allowed_statuses", default: [], array: true
  end

  create_table "companies_bank_accounts", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "ac_no"
    t.bigint "bank_id", null: false
    t.string "benf_name"
    t.string "branch"
    t.string "ifsc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bank_id"], name: "index_companies_bank_accounts_on_bank_id"
    t.index ["company_id"], name: "index_companies_bank_accounts_on_company_id"
  end

  create_table "configurations", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cost_maps", force: :cascade do |t|
    t.string "title"
    t.bigint "cost_type_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cost_type_id"], name: "index_cost_maps_on_cost_type_id"
  end

  create_table "cost_types", force: :cascade do |t|
    t.string "name"
    t.string "tag"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "flats", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.bigint "building_id", null: false
    t.string "name"
    t.bigint "config_id", null: false
    t.integer "facing"
    t.integer "carpet_area"
    t.bigint "status_id", null: false
    t.bigint "floor_id", null: false
    t.string "code"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["building_id"], name: "index_flats_on_building_id"
    t.index ["company_id"], name: "index_flats_on_company_id"
    t.index ["config_id"], name: "index_flats_on_config_id"
    t.index ["floor_id"], name: "index_flats_on_floor_id"
    t.index ["status_id"], name: "index_flats_on_status_id"
  end

  create_table "flats_brokers", force: :cascade do |t|
    t.bigint "flat_id", null: false
    t.string "clientable_type", null: false
    t.integer "clientable_id", null: false
    t.bigint "broker_id", null: false
    t.float "brokerage_percent"
    t.float "brokerage_amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["broker_id"], name: "index_flats_brokers_on_broker_id"
    t.index ["flat_id"], name: "index_flats_brokers_on_flat_id"
  end

  create_table "flats_clients", force: :cascade do |t|
    t.bigint "flat_id", null: false
    t.string "clientable_type", null: false
    t.integer "clientable_id", null: false
    t.bigint "client_id", null: false
    t.boolean "is_primary", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_flats_clients_on_client_id"
    t.index ["flat_id"], name: "index_flats_clients_on_flat_id"
  end

  create_table "flats_costs", force: :cascade do |t|
    t.bigint "flat_id", null: false
    t.bigint "cost_map_id", null: false
    t.float "amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cost_map_id"], name: "index_flats_costs_on_cost_map_id"
    t.index ["flat_id"], name: "index_flats_costs_on_flat_id"
  end

  create_table "flats_users", force: :cascade do |t|
    t.bigint "flat_id", null: false
    t.string "clientable_type", null: false
    t.integer "clientable_id", null: false
    t.bigint "user_id", null: false
    t.float "contribution"
    t.integer "team"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["flat_id"], name: "index_flats_users_on_flat_id"
    t.index ["user_id"], name: "index_flats_users_on_user_id"
  end

  create_table "floors", force: :cascade do |t|
    t.string "name"
    t.integer "sequence"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "gst_rates", force: :cascade do |t|
    t.bigint "cost_type_id", null: false
    t.integer "amount_from"
    t.float "rate"
    t.date "effective_from"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cost_type_id"], name: "index_gst_rates_on_cost_type_id"
  end

  create_table "parkings", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.string "name"
    t.bigint "status_id", null: false
    t.integer "parking_type"
    t.integer "area"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "company_id", null: false
    t.index ["company_id"], name: "index_parkings_on_company_id"
    t.index ["project_id"], name: "index_parkings_on_project_id"
    t.index ["status_id"], name: "index_parkings_on_status_id"
  end

  create_table "payment_plans_stages", force: :cascade do |t|
    t.bigint "payment_plan_id", null: false
    t.string "name"
    t.float "amount"
    t.float "percentage"
    t.bigint "cost_type_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cost_type_id"], name: "index_payment_plans_stages_on_cost_type_id"
    t.index ["payment_plan_id"], name: "index_payment_plans_stages_on_payment_plan_id"
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "name"
    t.json "letter_builder_templates", default: {}
    t.boolean "restrict_bank_for_transaction", default: false
    t.text "allowed_bank_accounts", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_projects_on_company_id"
  end

  create_table "projects_payment_plans", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_projects_payment_plans_on_project_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "tag"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "statuses", force: :cascade do |t|
    t.string "name"
    t.string "for_class"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "tag"
  end

  create_table "users", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "name"
    t.string "phone"
    t.bigint "role_id", null: false
    t.text "allowed_projects", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "employee_no"
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role_id"], name: "index_users_on_role_id"
  end

  add_foreign_key "blockings", "companies"
  add_foreign_key "blockings", "flats"
  add_foreign_key "blockings", "projects"
  add_foreign_key "blockings", "users", column: "blocked_by_id"
  add_foreign_key "bookings", "banks", column: "loan_bank_id"
  add_foreign_key "bookings", "companies"
  add_foreign_key "bookings", "flats"
  add_foreign_key "bookings", "projects"
  add_foreign_key "bookings", "projects_payment_plans", column: "payment_plan_id"
  add_foreign_key "bookings", "users", column: "booked_by_id"
  add_foreign_key "bookings_payment_schedules", "bookings"
  add_foreign_key "bookings_payment_schedules", "cost_types"
  add_foreign_key "bookings_payment_schedules", "payment_plans_stages", column: "stage_id"
  add_foreign_key "brokers", "companies"
  add_foreign_key "buildings", "projects"
  add_foreign_key "clients", "companies"
  add_foreign_key "companies_bank_accounts", "banks"
  add_foreign_key "companies_bank_accounts", "companies"
  add_foreign_key "cost_maps", "cost_types"
  add_foreign_key "flats", "buildings"
  add_foreign_key "flats", "companies"
  add_foreign_key "flats", "configurations", column: "config_id"
  add_foreign_key "flats", "floors"
  add_foreign_key "flats", "statuses"
  add_foreign_key "flats_brokers", "brokers"
  add_foreign_key "flats_brokers", "flats"
  add_foreign_key "flats_clients", "clients"
  add_foreign_key "flats_clients", "flats"
  add_foreign_key "flats_costs", "cost_maps"
  add_foreign_key "flats_costs", "flats"
  add_foreign_key "flats_users", "flats"
  add_foreign_key "flats_users", "users"
  add_foreign_key "gst_rates", "cost_types"
  add_foreign_key "parkings", "companies"
  add_foreign_key "parkings", "projects"
  add_foreign_key "parkings", "statuses"
  add_foreign_key "payment_plans_stages", "cost_types"
  add_foreign_key "payment_plans_stages", "projects_payment_plans", column: "payment_plan_id"
  add_foreign_key "projects", "companies"
  add_foreign_key "projects_payment_plans", "projects"
  add_foreign_key "users", "companies"
  add_foreign_key "users", "roles"
end
