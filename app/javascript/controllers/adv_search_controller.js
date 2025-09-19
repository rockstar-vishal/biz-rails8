import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "searchInput", "modelsGrid", "totalModels", "activeModels", "totalFields", "lastUpdated", "searchForm", "fieldsContainer", "fieldGroup", "searchField", "clearBtn", "activeFiltersCount", "filterCount", "clearAllBtn", "submitBtn", "submitText","activeLabel", "fieldIndicator"
  ]
  
  connect() {
    this.updateStats()
    this.initializeAdvancedSearch()
  }

  initializeAdvancedSearch() {
    this.addCSSAnimations()
    this.animateFieldsOnLoad()
    this.setupFieldMonitoring()
    this.updateActiveFiltersCount()
  }

  addCSSAnimations() {
    if (!document.getElementById('adv-search-styles')) {
      const style = document.createElement('style')
      style.id = 'adv-search-styles'
      style.textContent = `
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.8); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .search-field-group {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-field-group:hover {
          transform: translateY(-2px);
        }

        .search-field-active {
          border-color: #6366f1 !important;
          background-color: #eef2ff !important;
        }

        .field-indicator-active {
          width: 100% !important;
        }

        .animate-field-entry {
          animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        .animate-pulse-custom {
          animation: pulse 0.5s ease-in-out;
        }
      `
      document.head.appendChild(style)
    }
  }

  animateFieldsOnLoad() {
    if (this.hasFieldGroupTargets) {
      this.fieldGroupTargets.forEach((group, index) => {
        group.style.opacity = '0'
        group.style.transform = 'translateY(20px)'
        
        setTimeout(() => {
          group.classList.add('animate-field-entry')
        }, index * 100)
      })
    }
  }

  setupFieldMonitoring() {
    if (this.hasSearchFieldTargets) {
      this.searchFieldTargets.forEach(field => {
        field.addEventListener('input', this.handleFieldInput.bind(this))
        field.addEventListener('change', this.handleFieldChange.bind(this))
        field.addEventListener('focus', this.handleFieldFocus.bind(this))
        field.addEventListener('blur', this.handleFieldBlur.bind(this))
      })
    }
  }

  handleFieldInput(event) {
    const field = event.target
    this.updateActiveFiltersCount()
    this.updateFieldVisualState(field)
  }

  handleFieldChange(event) {
    const field = event.target
    this.updateActiveFiltersCount()
    this.updateFieldVisualState(field)
    this.updateClearButtonVisibility(field)
  }

  handleFieldFocus(event) {
    const field = event.target
    const indicator = this.getFieldIndicator(field)
    if (indicator) {
      indicator.classList.add('field-indicator-active')
    }
  }

  handleFieldBlur(event) {
    const field = event.target
    if (!this.hasFieldValue(field)) {
      const indicator = this.getFieldIndicator(field)
      if (indicator) {
        indicator.classList.remove('field-indicator-active')
      }
    }
  }

  updateFieldVisualState(field) {
    if (this.hasFieldValue(field)) {
      field.classList.add('search-field-active')
      this.showActiveLabel(field)
    } else {
      field.classList.remove('search-field-active')
      this.hideActiveLabel(field)
    }
  }

  updateClearButtonVisibility(field) {
    const fieldGroup = field.closest('[data-field]')
    if (!fieldGroup) return

    const existingClearBtn = fieldGroup.querySelector('[data-adv-search-target="clearBtn"]')
    
    if (this.hasFieldValue(field) && !existingClearBtn) {
      this.addClearButton(fieldGroup, field.dataset.field)
    } else if (!this.hasFieldValue(field) && existingClearBtn) {
      this.removeClearButton(existingClearBtn)
    }
  }

  addClearButton(fieldGroup, fieldName) {
    const inputContainer = fieldGroup.querySelector('.relative')
    const clearBtn = document.createElement('button')
    clearBtn.type = 'button'
    clearBtn.className = 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200'
    clearBtn.dataset.field = fieldName
    clearBtn.dataset.action = 'click->adv-search#clearField'
    clearBtn.dataset.advSearchTarget = 'clearBtn'
    clearBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
    inputContainer.appendChild(clearBtn)
  }

  removeClearButton(clearBtn) {
    clearBtn.classList.add('animate-fade-out')
    setTimeout(() => {
      if (clearBtn.parentNode) {
        clearBtn.remove()
      }
    }, 300)
  }

  showActiveLabel(field) {
    const fieldGroup = field.closest('[data-field]')
    if (!fieldGroup) return

    const label = fieldGroup.querySelector('label')
    if (!label || label.querySelector('[data-adv-search-target="activeLabel"]')) return

    const activeLabel = document.createElement('span')
    activeLabel.className = 'px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full'
    activeLabel.dataset.advSearchTarget = 'activeLabel'
    activeLabel.textContent = 'Active'
    label.appendChild(activeLabel)
  }

  hideActiveLabel(field) {
    const fieldGroup = field.closest('[data-field]')
    if (!fieldGroup) return

    const activeLabel = fieldGroup.querySelector('[data-adv-search-target="activeLabel"]')
    if (activeLabel) {
      activeLabel.remove()
    }
  }

  getFieldIndicator(field) {
    const fieldGroup = field.closest('[data-field]')
    return fieldGroup ? fieldGroup.querySelector('[data-adv-search-target="fieldIndicator"]') : null
  }

  hasFieldValue(field) {
    return field.value && field.value.trim() !== ''
  }

  clearField(event) {
    const fieldName = event.target.dataset.field
    const field = this.searchFormTarget.querySelector(`[name="advance_search[${fieldName}]"]`)
    
    if (field) {
      field.value = ''
      field.focus()
      
      this.updateFieldVisualState(field)
      this.updateActiveFiltersCount()
      
      event.target.classList.add('animate-fade-out')
      setTimeout(() => {
        if (event.target.parentNode) {
          event.target.remove()
        }
      }, 300)
    }
  }

  clearAllFields(event) {
    if (!this.hasSearchFieldTargets) return

    this.searchFieldTargets.forEach(field => {
      field.value = ''
      field.classList.add('animate-shake')
      this.updateFieldVisualState(field)
    })

    if (this.hasClearBtnTargets) {
      this.clearBtnTargets.forEach(btn => {
        btn.classList.add('animate-fade-out')
        setTimeout(() => {
          if (btn.parentNode) {
            btn.remove()
          }
        }, 300)
      })
    }

    this.updateActiveFiltersCount()
    
    event.target.classList.add('animate-pulse-custom')
  }

  updateActiveFiltersCount() {
    if (!this.hasActiveFiltersCountTarget || !this.hasFilterCountTarget) return

    let activeCount = 0
    
    if (this.hasSearchFieldTargets) {
      activeCount = this.searchFieldTargets.filter(field => this.hasFieldValue(field)).length
    }

    this.filterCountTarget.textContent = activeCount
    
    if (activeCount > 0) {
      this.activeFiltersCountTarget.style.display = 'block'
      this.activeFiltersCountTarget.classList.add('animate-pulse-custom')
    } else {
      this.activeFiltersCountTarget.style.display = 'none'
    }
  }

  submitSearch(event) {
    if (!this.hasSubmitBtnTarget || !this.hasSubmitTextTarget) return

    this.submitBtnTarget.classList.add('animate-pulse-custom')
    this.submitTextTarget.textContent = 'Searching...'
    
    setTimeout(() => {
      this.submitTextTarget.textContent = 'Search'
    }, 2000)
  }

  toggleModel(event) {
    const modelName = event.target.dataset.model
    const modelCard = this.modelsGridTarget.querySelector(`[data-model="${modelName}"]`)
    const isEnabled = event.target.checked
    
    const fieldCheckboxes = modelCard.querySelectorAll('.field-item input[type="checkbox"]')
    fieldCheckboxes.forEach(checkbox => {
      checkbox.checked = isEnabled
      this.toggleFieldVisualState(checkbox.closest('.field-item'), isEnabled)
    })
    
    this.toggleModelVisualState(modelCard, isEnabled)
    
    this.updateStats()
  }
  
  toggleField(event) {
    const fieldItem = event.target.closest('.field-item')
    const isEnabled = event.target.checked
    
    this.toggleFieldVisualState(fieldItem, isEnabled)
    
    const modelName = event.target.dataset.model
    const modelCard = this.modelsGridTarget.querySelector(`[data-model="${modelName}"]`)
    this.updateModelToggleState(modelCard)
    
    this.updateStats()
  }
  
  toggleFieldVisualState(fieldItem, isEnabled) {
    if (isEnabled) {
      fieldItem.classList.remove('disabled')
    } else {
      fieldItem.classList.add('disabled')
    }
  }
  
  toggleModelVisualState(modelCard, isEnabled) {
    if (isEnabled) {
      modelCard.classList.remove('disabled')
    } else {
      modelCard.classList.add('disabled')
    }
  }
  
  updateModelToggleState(modelCard) {
    const fieldCheckboxes = modelCard.querySelectorAll('.field-item input[type="checkbox"]')
    const enabledFields = Array.from(fieldCheckboxes).filter(checkbox => checkbox.checked)
    const modelToggle = modelCard.querySelector('input[type="checkbox"]')
    
    if (enabledFields.length === 0) {
      modelToggle.checked = false
      this.toggleModelVisualState(modelCard, false)
    } else if (enabledFields.length === fieldCheckboxes.length) {
      modelToggle.checked = true
      this.toggleModelVisualState(modelCard, true)
    } else {
      modelToggle.checked = false
      modelCard.classList.remove('disabled')
    }
  }
  
  filterModels() {
    const searchTerm = this.searchInputTarget.value.toLowerCase()
    const modelCards = this.modelsGridTarget.querySelectorAll('.model-card')
    
    modelCards.forEach(card => {
      const modelName = card.dataset.model.toLowerCase()
      if (modelName.includes(searchTerm)) {
        card.style.display = 'block'
      } else {
        card.style.display = 'none'
      }
    })
    
    this.updateStats()
  }
  
  updateStats() {
    if (!this.hasModelsGridTarget || !this.hasActiveModelsTarget || !this.hasTotalFieldsTarget) {
      return
    }

    const modelCards = this.modelsGridTarget.querySelectorAll('.model-card')
    let activeModels = 0
    let totalFields = 0
    
    modelCards.forEach(card => {
      if (card.style.display !== 'none') {
        const fieldCheckboxes = card.querySelectorAll('.field-item input[type="checkbox"]')
        const enabledFields = Array.from(fieldCheckboxes).filter(checkbox => checkbox.checked)
        
        if (enabledFields.length > 0) {
          activeModels++
          totalFields += enabledFields.length
        }
      }
    })
    
    this.activeModelsTarget.textContent = activeModels
    this.totalFieldsTarget.textContent = totalFields
  }
  
  async saveAllConfigurations(event) {
    const button = event.target
    const originalHtml = button.innerHTML
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'
    button.disabled = true
    
    try {
      const config = {}
      const modelCards = this.modelsGridTarget.querySelectorAll('.model-card')
      
      modelCards.forEach(card => {
        const modelName = card.dataset.model
        const fields = {}
        
        const fieldCheckboxes = card.querySelectorAll('.field-item input[type="checkbox"]')
        fieldCheckboxes.forEach(checkbox => {
          const fieldName = checkbox.dataset.field
          fields[fieldName] = checkbox.checked.toString()
        })
        
        config[modelName] = {
          fields: fields
        }
      })
      
      const response = await fetch('/settings/update_adv_search_config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ config: config })
      })
      
      if (response.ok) {
        const data = await response.json()
        this.showToast('Configuration saved successfully!', 'success')        
        
        if (data.last_updated && this.hasLastUpdatedTarget) {
          this.lastUpdatedTarget.textContent = data.last_updated
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Server error')
      }
    } catch (error) {
      console.error('Error saving configuration:', error)
      this.showToast(`Error: ${error.message}`, 'error')
    } finally {
      button.innerHTML = originalHtml
      button.disabled = false
    }
  }
  
  showToast(message, type = 'info') {
    const existingToasts = document.querySelectorAll('.custom-toast')
    existingToasts.forEach(toast => toast.remove())
    
    const toast = document.createElement('div')
    toast.className = `custom-toast custom-toast-${type}`
    toast.innerHTML = `
      <div class="custom-toast-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
      </div>
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.classList.add('show')
    }, 10)
    
    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, 5000)
  }
}
