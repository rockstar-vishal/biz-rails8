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

ActiveRecord::Schema[8.0].define(version: 2025_08_18_172758) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "banks", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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

  create_table "flats_costs", force: :cascade do |t|
    t.bigint "flat_id", null: false
    t.bigint "cost_map_id", null: false
    t.float "amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cost_map_id"], name: "index_flats_costs_on_cost_map_id"
    t.index ["flat_id"], name: "index_flats_costs_on_flat_id"
  end

  create_table "floors", force: :cascade do |t|
    t.string "name"
    t.integer "sequence"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
  add_foreign_key "flats_costs", "cost_maps"
  add_foreign_key "flats_costs", "flats"
  add_foreign_key "payment_plans_stages", "cost_types"
  add_foreign_key "payment_plans_stages", "projects_payment_plans", column: "payment_plan_id"
  add_foreign_key "projects", "companies"
  add_foreign_key "projects_payment_plans", "projects"
  add_foreign_key "users", "companies"
  add_foreign_key "users", "roles"
end
