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

  static values = {
    brokerFields: Array,
    clientFields: Array,
    configOptions: Array,
    bankOptions: Array,
    costMapOptions: Array,
    statusOptions: Array
  }

  addBrokerField() {
    this.addDropdownField(this.brokerMandatoryFieldsTarget, "company[broker_mandatory_fields][]", "Select broker field", this.generateOptions(this.brokerFieldsValue))
  }

  addClientField() {
    this.addDropdownField(this.clientMandatoryFieldsTarget, "company[client_mandatory_fields][]", "Select client field", this.generateOptions(this.clientFieldsValue))
  }

  addAllowedConfig() {
    this.addDropdownField(this.allowedConfigsTarget, "company[allowed_configs][]", "Select config", this.generateOptions(this.configOptionsValue))
  }

  addAllowedBank() {
    this.addDropdownField(this.allowedBanksTarget, "company[allowed_banks][]", "Select bank", this.generateOptions(this.bankOptionsValue))
  }

  addAllowedCostMap() {
    this.addDropdownField(this.allowedCostMapsTarget, "company[allowed_cost_maps][]", "Select cost map", this.generateOptions(this.costMapOptionsValue))
  }

  addAllowedStatus() {
    const statusOptions = this.statusOptionsValue.map(status => ({
      value: status.id,
      text: status.name
    }));
    this.addDropdownField(this.allowedStatusesTarget, "company[allowed_statuses][]", "Select status", this.generateOptions(statusOptions))
  }

  addDropdownField(container, fieldName, placeholder, optionsHtml) {
    const fieldRow = document.createElement('div')
    fieldRow.className = 'flex items-center space-x-2'
    fieldRow.setAttribute('data-company-form-target', 'fieldRow')
    
    fieldRow.innerHTML = `
      <select name="${fieldName}" 
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <option value="">${placeholder}</option>
        ${optionsHtml}
      </select>
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
  }

  generateOptions(options) {
    if (!options || options.length === 0) return '';
    
    return options.map(option => {
      if (typeof option === 'object') {
        return `<option value="${option.value}">${option.text}</option>`;
      } else {
        const displayName = this.formatFieldName(option);
        return `<option value="${option}">${displayName}</option>`;
      }
    }).join('');
  }

  formatFieldName(field) {
    return field.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  removeField(event) {
    const fieldRow = event.target.closest('[data-company-form-target="fieldRow"]')
    if (fieldRow) {
      fieldRow.remove()
    }
  }
}
