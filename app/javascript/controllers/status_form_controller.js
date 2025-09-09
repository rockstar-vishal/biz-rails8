import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "step",
    "progressBar", 
    "prevButton",
    "nextButton",
    "nextButtonText",
    "submitButton",
    "submitButtonText",
    "nameField",
    "nameValidIcon",
    "classField", 
    "tagField",
    "errorContainer",
    "errorList"
  ]
  
  static values = {
    errors: Array
  }
  
  connect() {
    this.currentStep = 1
    this.totalSteps = 3
    this.showCurrentStep()
    this.updateProgress()
    this.updateButtons()
    this.showErrors()
    this.hideErrorContainer()

    if (this.errorsValue.length > 0 && this.hasErrorContainerTarget) {
      this.errorContainerTarget.classList.remove('hidden')
    }
    
    this.boundHandleSubmitEnd = this.handleSubmitEnd.bind(this)
    this.element.addEventListener('turbo:submit-end', this.boundHandleSubmitEnd)
    
    this.ensureModalPosition()
  }
  
  disconnect() {
    if (this.boundHandleSubmitEnd) {
      this.element.removeEventListener('turbo:submit-end', this.boundHandleSubmitEnd)
    }
  }

  goToStep(event) {
    const step = parseInt(event.target.dataset.step);
    
    if (step >= 1 && step <= this.totalSteps) {
      if (step > this.currentStep && !this.validateCurrentStep()) {
        return;
      }
      
      this.hideErrorContainer();
      this.currentStep = step;
      this.showCurrentStep();
      this.updateProgress();
      this.updateButtons();
    }
  }

  ensureModalPosition() {
    setTimeout(() => {
      const modalElement = this.element.closest('[data-controller*="modal"]')
      if (modalElement) {
        const modalController = this.application.getControllerForElementAndIdentifier(modalElement, 'modal')
        if (modalController && typeof modalController.repositionModal === 'function') {
          modalController.repositionModal()
        }
      }
    }, 10)
  }

   handleSubmitEnd(event) {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = false
      const isEdit = this.element.querySelector('input[name="_method"][value="patch"]')
      this.submitButtonTextTarget.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        ${isEdit ? 'Update Status' : 'Create Status'}
      `
    }
    
    if (event.detail.success) {
      console.log("Form submitted successfully")
    } else {
      console.log("Form submission failed with errors")
      this.repositionModal()
    }
  }
  
  repositionModal() {
    const modalElement = this.element.closest('[data-controller*="modal"]')
    if (modalElement) {
      const modalController = this.application.getControllerForElementAndIdentifier(modalElement, 'modal')
      if (modalController && typeof modalController.repositionModal === 'function') {
        modalController.repositionModal()
      }
    }
    
    setTimeout(() => {
      const modalContent = this.element.closest('.fixed') || this.element.closest('[data-modal-target="modal"]')
      if (modalContent) {
        modalContent.scrollIntoView({ behavior: 'instant', block: 'center' })
      }
    }, 100)
  }
  
  showErrors() {
    if (this.errorsValue && this.errorsValue.length > 0 && this.hasErrorListTarget) {
      this.errorListTarget.innerHTML = ''
      this.errorsValue.forEach(error => {
        const li = document.createElement('li')
        li.textContent = error
        li.className = 'text-sm text-red-700'
        this.errorListTarget.appendChild(li)
      })
      
      if (this.hasErrorContainerTarget) {
        this.errorContainerTarget.classList.remove('hidden')
      }
    }
  }
  
  hideErrorContainer() {
    if (this.hasErrorContainerTarget) {
      this.errorContainerTarget.classList.add('hidden')
    }
  }
  
  nextStep() {
    if (this.validateCurrentStep()) {
      this.hideErrorContainer()
      
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
        this.showCurrentStep()
        this.updateProgress()
        this.updateButtons()        
        this.celebrateStepCompletion()
      }
    }
  }
  
  prevStep() {
    if (this.currentStep > 1) {
      this.hideErrorContainer()
      this.currentStep--
      this.showCurrentStep()
      this.updateProgress()
      this.updateButtons()
    }
  }
  
  showCurrentStep() {
    this.stepTargets.forEach((step, index) => {
      const stepNumber = index + 1
      if (stepNumber === this.currentStep) {
        step.classList.remove('hidden')
        step.style.animation = 'slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      } else {
        step.classList.add('hidden')
      }
    })
  }
  
  updateProgress() {
    const steps = Math.max(this.totalSteps || 0, 1);
    const stepIndex = Math.min(Math.max(this.currentStep || 1, 1), steps);

    let progress = 0;
    if (steps > 1) {
      progress = ((stepIndex - 1) / (steps - 1)) * 100;
    }

    progress = Math.min(100, Math.max(0, Math.round(progress * 100) / 100));
    this.progressBarTarget.style.width = `${progress}%`;
    this.progressBarTarget.style.boxShadow = `0 0 0 4px rgba(59, 130, 246, 0.2)`;
    setTimeout(() => {
      this.progressBarTarget.style.boxShadow = 'none';
    }, 300);
  }


  
  updateButtons() {
    if (this.currentStep === 1) {
      this.prevButtonTarget.classList.add('hidden')
    } else {
      this.prevButtonTarget.classList.remove('hidden')
    }
    
    if (this.currentStep === this.totalSteps) {
      this.nextButtonTarget.classList.add('hidden')
      this.submitButtonTarget.classList.remove('hidden')
    } else {
      this.nextButtonTarget.classList.remove('hidden')
      this.submitButtonTarget.classList.add('hidden')
    }
    
    if (this.hasNextButtonTextTarget) {
      if (this.currentStep === this.totalSteps - 1) {
        this.nextButtonTextTarget.innerHTML = `
          Review & Finish
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        `
      } else {
        this.nextButtonTextTarget.innerHTML = `
          Next
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        `
      }
    }
  }
  
  validateCurrentStep() {
    let isValid = true
    
    switch (this.currentStep) {
      case 1:
        isValid = this.validateName()
        break
      case 2:
        isValid = this.validateClass()
        break
      case 3:
        isValid = this.validateTag()
        break
    }
    
    return isValid
  }
  
  validateName() {
    const name = this.nameFieldTarget.value.trim()
    if (name.length === 0) {
      this.showFieldError(this.nameFieldTarget, 'Status name is required')
      return false
    } else if (name.length > 50) {
      this.showFieldError(this.nameFieldTarget, 'Status name must be less than 50 characters')
      return false
    } else {
      this.showFieldSuccess(this.nameFieldTarget)
      return true
    }
  }
  
  validateClass() {
    const selectedClass = this.element.querySelector('input[name="status[for_class]"]:checked')
    if (!selectedClass) {
      this.showStepError('Please select a property type')
      return false
    }
    return true
  }
  
  validateTag() {
    const selectedTag = this.element.querySelector('input[name="status[tag]"]:checked')
    if (!selectedTag) {
      this.showStepError('Please select a status tag')
      return false
    }
    return true
  }
  
  showFieldError(field, message) {
    field.classList.add('border-red-500', 'bg-red-50')
    field.classList.remove('border-gray-200', 'border-green-500', 'bg-gray-50', 'bg-green-50')
    
    if (this.hasNameValidIconTarget) {
      this.nameValidIconTarget.classList.add('hidden')
    }    
    this.showToast(message, 'error')
  }
  
  showFieldSuccess(field) {
    field.classList.add('border-green-500', 'bg-green-50')
    field.classList.remove('border-red-500', 'border-gray-200', 'bg-red-50', 'bg-gray-50')
    
    if (this.hasNameValidIconTarget) {
      this.nameValidIconTarget.classList.remove('hidden')
      this.nameValidIconTarget.style.animation = 'bounceIn 0.5s ease-out'
    }
  }
  
  showStepError(message) {
    this.showToast(message, 'error')
  }
  
  showToast(message, type = 'info') {
    const existingToasts = document.querySelectorAll('.status-form-toast')
    existingToasts.forEach(toast => toast.remove())
    
    const toast = document.createElement('div')
    toast.className = `status-form-toast fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium ${
      type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`
    toast.textContent = message
    toast.style.animation = 'slideInRight 0.3s ease-out'
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in'
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast)
        }
      }, 300)
    }, 3000)
  }
  
  validateField(event) {
    if (event.target === this.nameFieldTarget) {
      this.validateName()
    }
  }
  
  focusField(event) {
    event.target.classList.add('ring-2', 'ring-blue-500')
    event.target.style.transform = 'scale(1.02)'
    event.target.style.transition = 'all 0.2s ease'
  }
  
  blurField(event) {
    event.target.classList.remove('ring-2', 'ring-blue-500')
    event.target.style.transform = 'scale(1)'
  }
  
  selectClass(event) {
    const selectedOption = event.target.closest('label')
    if (selectedOption) {
      const allClassOptions = this.element.querySelectorAll('input[name="status[for_class]"]')
      allClassOptions.forEach(option => {
        const label = option.closest('label')
        const card = label.querySelector('div')
        card.style.transform = 'scale(1)'
      })
      
      const card = selectedOption.querySelector('div')
      card.style.transform = 'scale(1.05)'
      card.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      
      setTimeout(() => {
        card.style.transform = 'scale(1)'
      }, 300)
    }
  }
  
  selectTag(event) {
    const selectedOption = event.target.closest('label')
    if (selectedOption) {
      const allTagOptions = this.element.querySelectorAll('input[name="status[tag]"]')
      allTagOptions.forEach(option => {
        const label = option.closest('label')
        const card = label.querySelector('div')
        card.style.transform = 'scale(1)'
      })
      
      const card = selectedOption.querySelector('div')
      card.style.transform = 'scale(1.02)'
      card.style.transition = 'all 0.2s ease'
      
      setTimeout(() => {
        card.style.transform = 'scale(1)'
      }, 200)
    }
  }
  
  celebrateStepCompletion() {
    const progressBar = this.progressBarTarget
    progressBar.style.animation = 'pulse 0.5s ease-in-out'
    
    setTimeout(() => {
      progressBar.style.animation = ''
    }, 500)
  }
  
  handleSubmit(event) {
    if (this.hasSubmitButtonTarget && this.hasSubmitButtonTextTarget) {
      this.submitButtonTarget.disabled = true
      this.submitButtonTextTarget.innerHTML = `
        <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      `
    }    
  }
  
  closeModal() {    
    const modalElement = this.element.closest('[data-controller*="modal"]')
    if (modalElement) {
      const modalController = this.application.getControllerForElementAndIdentifier(modalElement, 'modal')
      if (modalController && modalController.close) {
        modalController.close()
      }
    }
    
    const turboFrame = this.element.closest('turbo-frame')
    if (turboFrame) {
      turboFrame.src = ''
      turboFrame.innerHTML = ''
    }
  }
  
  reset() {
    this.currentStep = 1
    this.showCurrentStep()
    this.updateProgress()
    this.updateButtons()
    this.hideErrorContainer()
    
    if (this.hasNameFieldTarget) {
      this.nameFieldTarget.classList.remove('border-red-500', 'border-green-500', 'bg-red-50', 'bg-green-50')
      this.nameFieldTarget.classList.add('border-gray-200', 'bg-gray-50')
    }
    
    if (this.hasNameValidIconTarget) {
      this.nameValidIconTarget.classList.add('hidden')
    }
    
    if (this.hasSubmitButtonTarget && this.hasSubmitButtonTextTarget) {
      this.submitButtonTarget.disabled = false
      const isEdit = this.element.querySelector('input[name="_method"][value="patch"]')
      this.submitButtonTextTarget.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        ${isEdit ? 'Update Status' : 'Create Status'}
      `
    }    
    this.ensureModalPosition()
  }
}
