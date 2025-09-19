import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "projectSelect",
    "flatSelect", 
    "flatLoading",
    "submitButton"
  ]

  static values = {
    projectsUrl: String
  }

  connect() {
    this.originalFlatOptions = this.flatSelectTarget.innerHTML
    this.setupInitialState()
  }

  setupInitialState() {
    const projectId = this.projectSelectTarget.value
    if (projectId && projectId !== "") {
      this.loadFlatsForProject(projectId)
    }
  }

  projectChanged(event) {
    const projectId = event.target.value
    
    if (!projectId || projectId === "") {
      this.resetFlatSelect()
      return
    }

    this.loadFlatsForProject(projectId)
  }

  async loadFlatsForProject(projectId) {
    try {
      this.showFlatLoading()
      this.disableFlatSelect()
      
      const response = await fetch(`/settings/projects/${projectId}/flats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': this.getCSRFToken()
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.populateFlatOptions(data.flats || [])
      
    } catch (error) {
      console.error('Error loading flats:', error)
      this.showFlatError()
    } finally {
      this.hideFlatLoading()
      this.enableFlatSelect()
    }
  }

  populateFlatOptions(flats) {
    const currentFlatId = this.flatSelectTarget.value
    let optionsHTML = '<option value="">Choose a flat/unit...</option>'
    
    flats.forEach(flat => {
      const buildingName = flat.building_name ? `${flat.building_name} - ` : ''
      const isSelected = flat.id.toString() === currentFlatId ? 'selected' : ''
      optionsHTML += `<option value="${flat.id}" ${isSelected}>${buildingName}${flat.name}</option>`
    })
    
    this.flatSelectTarget.innerHTML = optionsHTML
    
    // Add visual feedback for successful load
    this.flatSelectTarget.classList.add('border-green-300', 'focus:ring-green-500')
    setTimeout(() => {
      this.flatSelectTarget.classList.remove('border-green-300', 'focus:ring-green-500')
    }, 2000)
  }

  resetFlatSelect() {
    this.flatSelectTarget.innerHTML = '<option value="">Choose a flat/unit...</option>'
    this.flatSelectTarget.value = ""
  }

  showFlatLoading() {
    if (this.hasFlatLoadingTarget) {
      this.flatLoadingTarget.classList.remove('hidden')
    }
  }

  hideFlatLoading() {
    if (this.hasFlatLoadingTarget) {
      this.flatLoadingTarget.classList.add('hidden')
    }
  }

  disableFlatSelect() {
    this.flatSelectTarget.disabled = true
    this.flatSelectTarget.classList.add('opacity-50', 'cursor-not-allowed')
  }

  enableFlatSelect() {
    this.flatSelectTarget.disabled = false
    this.flatSelectTarget.classList.remove('opacity-50', 'cursor-not-allowed')
  }

  showFlatError() {
    const errorDiv = document.createElement('div')
    errorDiv.className = 'text-sm text-red-600 mt-1 flex items-center space-x-1 animate-fade-in'
    errorDiv.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>Unable to load flats. Please try again.</span>
    `
    
    this.flatSelectTarget.parentNode.appendChild(errorDiv)
    
    setTimeout(() => {
      errorDiv.remove()
    }, 5000)
    
    this.resetFlatSelect()
  }

  getCSRFToken() {
    const token = document.querySelector('[name="csrf-token"]')
    return token ? token.content : ''
  }

  submitForm(event) {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = true
      this.submitButtonTarget.classList.add('opacity-75', 'cursor-not-allowed')
      
      const buttonText = this.submitButtonTarget.querySelector('span span')
      const originalText = buttonText.textContent
      buttonText.innerHTML = `
        <svg class="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Processing...
      `
    }

    return this.validateForm()
  }

  validateForm() {
    const errors = []
    
    if (!this.projectSelectTarget.value) {
      errors.push('Project is required')
      this.highlightErrorField(this.projectSelectTarget)
    }
    
    if (!this.flatSelectTarget.value) {
      errors.push('Flat/Unit is required')
      this.highlightErrorField(this.flatSelectTarget)
    }
    
    const dateField = this.element.querySelector('[name*="[date]"]')
    if (dateField && !dateField.value) {
      errors.push('Blocking date is required')
      this.highlightErrorField(dateField)
    }
    
    const blockedUptoField = this.element.querySelector('[name*="[blocked_upto]"]')
    if (dateField && blockedUptoField && dateField.value && blockedUptoField.value) {
      const startDate = new Date(dateField.value)
      const endDate = new Date(blockedUptoField.value)
      
      if (endDate <= startDate) {
        errors.push('Blocked until date must be after blocking date')
        this.highlightErrorField(blockedUptoField)
      }
    }
    
    if (errors.length > 0) {
      this.showValidationErrors(errors)
      this.resetSubmitButton()
      return false
    }
    
    return true
  }

  highlightErrorField(field) {
    field.classList.add('border-red-300', 'focus:ring-red-500')
    
    const removeErrorStyling = () => {
      field.classList.remove('border-red-300', 'focus:ring-red-500')
      field.removeEventListener('input', removeErrorStyling)
      field.removeEventListener('change', removeErrorStyling)
    }
    
    field.addEventListener('input', removeErrorStyling)
    field.addEventListener('change', removeErrorStyling)
  }

  showValidationErrors(errors) {
    const existingErrors = this.element.querySelectorAll('.validation-error-message')
    existingErrors.forEach(error => error.remove())
    
    const errorDiv = document.createElement('div')
    errorDiv.className = 'validation-error-message bg-red-50 border border-red-200 rounded-xl p-4 animate-shake mb-6'
    
    const errorHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-medium text-red-800">
            Please fix the following ${errors.length === 1 ? 'error' : 'errors'}:
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <ul class="list-disc space-y-1 pl-5">
              ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="flex-shrink-0">
          <button type="button" class="text-red-400 hover:text-red-600 transition-colors duration-200" data-action="click->blocking-form#dismissError">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `
    
    errorDiv.innerHTML = errorHTML
    
    this.element.insertBefore(errorDiv, this.element.firstChild)
    
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  dismissError(event) {
    const errorDiv = event.target.closest('.validation-error-message')
    if (errorDiv) {
      errorDiv.remove()
    }
  }

  resetSubmitButton() {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = false
      this.submitButtonTarget.classList.remove('opacity-75', 'cursor-not-allowed')
      
      const buttonText = this.submitButtonTarget.querySelector('span span')
      const isEdit = this.element.querySelector('[name="_method"][value="patch"]')
      buttonText.innerHTML = isEdit ? 'Update Blocking' : 'Create Blocking'
    }
  }

  handleSubmit(event) {
    if (!this.validateForm()) {
      event.preventDefault()
      return false
    }
    
    return this.submitForm(event)
  }

  // autoSave() {
  //   const formData = new FormData(this.element)
  //   const data = Object.fromEntries(formData.entries())
    
  //   if (data['blocking[project_id]'] && data['blocking[flat_id]'] && data['blocking[date]']) {
  //     this.saveToLocalStorage(data)
  //   }
  // }

  // saveToLocalStorage(data) {
  //   try {
  //     const key = `blocking_form_${window.location.pathname}`
  //     localStorage.setItem(key, JSON.stringify(data))
  //   } catch (error) {
  //     console.warn('Unable to save form data to localStorage:', error)
  //   }
  // }

  // loadFromLocalStorage() {
  //   try {
  //     const key = `blocking_form_${window.location.pathname}`
  //     const savedData = localStorage.getItem(key)
      
  //     if (savedData) {
  //       const data = JSON.parse(savedData)
  //       this.populateFormFromData(data)
  //     }
  //   } catch (error) {
  //     console.warn('Unable to load form data from localStorage:', error)
  //   }
  // }

  // populateFormFromData(data) {
  //   Object.entries(data).forEach(([key, value]) => {
  //     const field = this.element.querySelector(`[name="${key}"]`)
  //     if (field && !field.value) { // Only populate if field is empty
  //       field.value = value
        
  //       // Trigger change event to update any dependent fields
  //       field.dispatchEvent(new Event('change', { bubbles: true }))
  //     }
  //   })
  // }

  clearLocalStorage() {
    try {
      const key = `blocking_form_${window.location.pathname}`
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Unable to clear localStorage:', error)
    }
  }

  // Cleanup on disconnect
  disconnect() {
    // Clear any timeouts or intervals if you add them
    this.clearLocalStorage()
  }
}
