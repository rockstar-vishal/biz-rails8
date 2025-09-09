import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["backdrop", "overlay", "modal"]
  
  connect() {    
    this.originalScrollPosition = window.pageYOffset    
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${this.originalScrollPosition}px`
    document.body.style.width = '100%'
    
    if (this.hasModalTarget) {
      setTimeout(() => {
        this.modalTarget.focus()
      }, 100)
    }
    
    this.boundHandleEscape = this.handleEscape.bind(this)
    document.addEventListener('keydown', this.boundHandleEscape)    
    this.repositionModal()
  }
  
  repositionModal() {
    if (!this.element) return;
    
    this.element.style.display = 'flex'
    this.element.style.alignItems = 'center'
    this.element.style.justifyContent = 'center'
    this.element.style.minHeight = '100vh'
    this.element.style.padding = '1rem'
    
    if (this.hasModalTarget) {
      this.modalTarget.style.margin = 'auto'
      this.modalTarget.style.maxHeight = '90vh'
      this.modalTarget.style.overflowY = 'auto'
    }
    
    window.scrollTo(0, 0)
  }
  
  disconnect() {    
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    
    window.scrollTo(0, this.originalScrollPosition)
    
    document.removeEventListener('keydown', this.boundHandleEscape)
  }
  
  closeOnBackdrop(event) {
    if (event.target === this.backdropTarget || event.target === this.overlayTarget) {
      this.close()
    }
  }
  
  close() {    
    const turboFrame = this.element.closest('turbo-frame')
    if (turboFrame) {
      turboFrame.innerHTML = ''
      turboFrame.removeAttribute('src')
    }
  }
  
  handleEscape(event) {
    if (event.key === 'Escape') {
      this.close()
    }
  }
}
