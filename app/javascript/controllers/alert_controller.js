import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    autoDismiss: { type: Boolean, default: true },
    dismissAfter: { type: Number, default: 5000 }
  }

  connect() {
    if (this.autoDismissValue) {
      this.startAutoDismissTimer()
    }
    
    this.element.classList.add('animate-slide-in-down')
  }

  dismiss() {
    this.element.classList.add('animate-fade-out')    
    setTimeout(() => {
      if (this.element.parentNode) {
        this.element.remove()
      }
    }, 300)
  }

  startAutoDismissTimer() {
    this.timeout = setTimeout(() => {
      this.dismiss()
    }, this.dismissAfterValue)
  }

  disconnect() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  pauseAutoDismiss() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  resumeAutoDismiss() {
    if (this.autoDismissValue) {
      this.startAutoDismissTimer()
    }
  }
}
