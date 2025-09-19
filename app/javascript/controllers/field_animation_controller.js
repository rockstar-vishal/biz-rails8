import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.setupFieldAnimations()
  }

  setupFieldAnimations() {
    const fields = this.element.querySelectorAll('input, select, textarea')
    
    fields.forEach(field => {
      field.addEventListener('focus', this.handleFocus.bind(this))
      field.addEventListener('blur', this.handleBlur.bind(this))
      field.addEventListener('input', this.handleInput.bind(this))
      
      if (field.value) {
        this.addFilledState(field)
      }
    })
  }

  handleFocus(event) {
    const field = event.target
    const container = field.closest('.space-y-2') || field.parentElement
    
    container.classList.add('transform', 'scale-102', 'transition-transform', 'duration-200')
    
    const label = container.querySelector('label')
    if (label) {
      label.classList.add('text-indigo-600', 'transition-colors', 'duration-200')
    }
  }

  handleBlur(event) {
    const field = event.target
    const container = field.closest('.space-y-2') || field.parentElement
    
    container.classList.remove('transform', 'scale-102')
    
    const label = container.querySelector('label')
    if (label) {
      label.classList.remove('text-indigo-600')
    }
    
    if (field.value) {
      this.addFilledState(field)
    } else {
      this.removeFilledState(field)
    }
  }

  handleInput(event) {
    const field = event.target
    
    if (field.value) {
      this.addFilledState(field)
    } else {
      this.removeFilledState(field)
    }
  }

  addFilledState(field) {
    const container = field.closest('.space-y-2') || field.parentElement
    container.classList.add('field-filled')
    
    field.classList.add('bg-indigo-50')
  }

  removeFilledState(field) {
    const container = field.closest('.space-y-2') || field.parentElement
    container.classList.remove('field-filled')
    
    field.classList.remove('bg-indigo-50')
  }
}
