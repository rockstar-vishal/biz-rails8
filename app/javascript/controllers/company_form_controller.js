import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "brokerMandatoryFields",
    "clientMandatoryFields", 
    "allowedConfigs",
    "allowedBanks",
    "allowedCostMaps",
    "allowedStatuses",
    "fieldRow"
  ]

  connect() {
    console.log("Company form controller connected")
  }

  addBrokerField() {
    this.addField(this.brokerMandatoryFieldsTarget, "company[broker_mandatory_fields][]")
  }

  addClientField() {
    this.addField(this.clientMandatoryFieldsTarget, "company[client_mandatory_fields][]")
  }

  addAllowedConfig() {
    this.addField(this.allowedConfigsTarget, "company[allowed_configs][]")
  }

  addAllowedBank() {
    this.addField(this.allowedBanksTarget, "company[allowed_banks][]")
  }

  addAllowedCostMap() {
    this.addField(this.allowedCostMapsTarget, "company[allowed_cost_maps][]")
  }

  addAllowedStatus() {
    this.addField(this.allowedStatusesTarget, "company[allowed_statuses][]")
  }

  addField(container, fieldName) {
    const fieldRow = document.createElement('div')
    fieldRow.className = 'flex items-center space-x-2'
    fieldRow.setAttribute('data-company-form-target', 'fieldRow')
    
    fieldRow.innerHTML = `
      <input type="text" 
             name="${fieldName}" 
             value=""
             class="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             placeholder="${this.getPlaceholderText(fieldName)}">
      <button type="button" 
              class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-150"
              data-action="click->company-form#removeField"
              title="Remove field">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    `
    
    container.appendChild(fieldRow)
    
    const input = fieldRow.querySelector('input')
    input.focus()
  }

  removeField(event) {
    const fieldRow = event.target.closest('[data-company-form-target="fieldRow"]')
    if (fieldRow) {
      fieldRow.remove()
    }
  }

  getPlaceholderText(fieldName) {
    const placeholders = {
      'company[broker_mandatory_fields][]': 'Enter field name',
      'company[client_mandatory_fields][]': 'Enter field name',
      'company[allowed_configs][]': 'Enter config name',
      'company[allowed_banks][]': 'Enter bank name',
      'company[allowed_cost_maps][]': 'Enter cost map name',
      'company[allowed_statuses][]': 'Enter status name'
    }
    
    return placeholders[fieldName] || 'Enter value'
  }
}
