# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


Bank.find_or_create_by(name: "HDFC Bank")
Bank.find_or_create_by(name: "ICICI Bank")
Bank.find_or_create_by(name: "SBI")

Configuration.find_or_create_by(name: "Studio")
Configuration.find_or_create_by(name: "1 RK")
Configuration.find_or_create_by(name: "1 BHK")
Configuration.find_or_create_by(name: "1.5 BHK")
Configuration.find_or_create_by(name: "2 BHK")
Configuration.find_or_create_by(name: "2.5 BHK")
Configuration.find_or_create_by(name: "3 BHK")
Configuration.find_or_create_by(name: "3.5 BHK")
Configuration.find_or_create_by(name: "4 BHK")
Configuration.find_or_create_by(name: "4.5 BHK")
Configuration.find_or_create_by(name: "Penthouse")
Configuration.find_or_create_by(name: "Villa")
Configuration.find_or_create_by(name: "Bungalow")

agr_ct = CostType.find_or_create_by(name: "Agreement", tag: "agreement")
nagr_ct = CostType.find_or_create_by(name: "Non Agreement", tag: "non_agr")
taxes_ct = CostType.find_or_create_by(name: "Taxes & Others", tag: "taxes")

CostMap.find_or_create_by(title: "Flat Base Cost", cost_type: agr_ct)
CostMap.find_or_create_by(title: "Infrastructure Development Charges", cost_type: agr_ct)
CostMap.find_or_create_by(title: "Preferencial Locational Charges", cost_type: agr_ct)
CostMap.find_or_create_by(title: "Club House Charges", cost_type: nagr_ct)
CostMap.find_or_create_by(title: "Maintenance Charges", cost_type: nagr_ct)
CostMap.find_or_create_by(title: "Society Formation Charges", cost_type: nagr_ct)

Floor.find_or_create_by(name: "Ground", sequence: 1)
Floor.find_or_create_by(name: "First", sequence: 2)
Floor.find_or_create_by(name: "Second", sequence: 3)
Floor.find_or_create_by(name: "Third", sequence: 4)
Floor.find_or_create_by(name: "Fourth", sequence: 5)
Floor.find_or_create_by(name: "Fifth", sequence: 6)
Floor.find_or_create_by(name: "Sixth", sequence: 7)
Floor.find_or_create_by(name: "Seventh", sequence: 8)
Floor.find_or_create_by(name: "Eight", sequence: 9)
Floor.find_or_create_by(name: "Ninth", sequence: 10)
Floor.find_or_create_by(name: "Tenth", sequence: 11)
Floor.find_or_create_by(name: "Eleventh", sequence: 12)
Floor.find_or_create_by(name: "Twelfth", sequence: 13)
Floor.find_or_create_by(name: "Thirteenth", sequence: 14)
Floor.find_or_create_by(name: "Fourteenth", sequence: 15)
Floor.find_or_create_by(name: "Fifteenth", sequence: 16)
Floor.find_or_create_by(name: "Sixteenth", sequence: 17)
Floor.find_or_create_by(name: "Seventeenth", sequence: 18)
Floor.find_or_create_by(name: "Eighteenth", sequence: 19)
Floor.find_or_create_by(name: "Nineteenth", sequence: 20)
Floor.find_or_create_by(name: "Twentieth", sequence: 21)
Floor.find_or_create_by(name: "Twenty-First", sequence: 22)
Floor.find_or_create_by(name: "Twenty-Second", sequence: 23)
Floor.find_or_create_by(name: "Twenty-Third", sequence: 24)
Floor.find_or_create_by(name: "Twenty-Fourth", sequence: 25)
Floor.find_or_create_by(name: "Twenty-Fifth", sequence: 26)

Role.find_or_create_by(name: "SystemAdmin", tag: "sysad")
Role.find_or_create_by(name: "SuperAdmin", tag: "admin")
Role.find_or_create_by(name: "Manager", tag: "manager")
Role.find_or_create_by(name: "Executive", tag: "exec")

Status.find_or_create_by(name: "Available", for_class: "Flat", tag: "available")
Status.find_or_create_by(name: "Blocked", for_class: "Flat", tag: "blocked")
Status.find_or_create_by(name: "Booked", for_class: "Flat", tag: "booked")
Status.find_or_create_by(name: "Available", for_class: "Parking", tag: "available")
Status.find_or_create_by(name: "Booked", for_class: "Parking", tag: "booked")
