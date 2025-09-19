import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    message: { type: String, default: "Are you sure?" },
    confirmText: { type: String, default: "Yes, proceed" },
    cancelText: { type: String, default: "Cancel" }
  }

  connect() {
    this.element.addEventListener('click', this.handleClick.bind(this))
  }

  handleClick(event) {
    event.preventDefault()
    this.showConfirmationModal()
  }

  showConfirmationModal() {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    overlay.innerHTML = this.getModalHTML()
    
    document.body.appendChild(overlay)
    
    setTimeout(() => {
      overlay.classList.add('animate-fade-in')
      const modal = overlay.querySelector('.modal-content')
      modal.classList.add('animate-scale-in')
    }, 10)
    
    this.setupModalEventListeners(overlay)
    
    const cancelButton = overlay.querySelector('.cancel-button')
    if (cancelButton) {
      cancelButton.focus()
    }
  }

  getModalHTML() {
    return `
      <div class="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95">
        <div class="p-6">
          <div class="flex items-center space-x-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Confirm Action</h3>
              <p class="text-sm text-slate-600 mt-1">${this.messageValue}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-end space-x-3">
            <button type="button" 
                    class="cancel-button px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors duration-200">
              ${this.cancelTextValue}
            </button>
            <button type="button" 
                    class="confirm-button px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200">
              ${this.confirmTextValue}
            </button>
          </div>
        </div>
      </div>
    `
  }

  setupModalEventListeners(overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        this.closeModal(overlay)
      }
    })
    
    const cancelButton = overlay.querySelector('.cancel-button')
    cancelButton.addEventListener('click', () => {
      this.closeModal(overlay)
    })
    
    const confirmButton = overlay.querySelector('.confirm-button')
    confirmButton.addEventListener('click', () => {
      this.closeModal(overlay)
      this.proceedWithAction()
    })
    
    const escapeHandler = (event) => {
      if (event.key === 'Escape') {
        this.closeModal(overlay)
        document.removeEventListener('keydown', escapeHandler)
      }
    }
    document.addEventListener('keydown', escapeHandler)
    
    overlay.escapeHandler = escapeHandler
  }

  closeModal(overlay) {
    overlay.classList.add('animate-fade-out')
    const modal = overlay.querySelector('.modal-content')
    modal.classList.add('animate-scale-out')
    
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
      if (overlay.escapeHandler) {
        document.removeEventListener('keydown', overlay.escapeHandler)
      }
    }, 300)
  }

  proceedWithAction() {
    if (this.element.tagName === 'FORM') {
      this.element.submit()
    } 
    else if (this.element.tagName === 'A') {
      const method = this.element.dataset.turboMethod
      if (method && method !== 'get') {
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = this.element.href
        
        const csrfToken = document.querySelector('[name="csrf-token"]')
        if (csrfToken) {
          const tokenInput = document.createElement('input')
          tokenInput.type = 'hidden'
          tokenInput.name = 'authenticity_token'
          tokenInput.value = csrfToken.content
          form.appendChild(tokenInput)
        }
        
        if (method !== 'post') {
          const methodInput = document.createElement('input')
          methodInput.type = 'hidden'
          methodInput.name = '_method'
          methodInput.value = method
          form.appendChild(methodInput)
        }
        
        document.body.appendChild(form)
        form.submit()
      } else {
        window.location.href = this.element.href
      }
    }
    else {
      this.element.click()
    }
  }
}
