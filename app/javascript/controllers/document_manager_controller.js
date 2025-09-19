import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["previewBtn", "imageModal", "modalTitle", "modalImage", "modalContent", "documentCard"]

  connect() {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this)
    document.addEventListener('keydown', this.boundHandleKeyDown)
    
    this.isModalOpen = false
  }

  disconnect() {
    document.removeEventListener('keydown', this.boundHandleKeyDown)
  }

  previewImage(event) {
    const button = event.currentTarget
    const imageUrl = button.dataset.imageUrl
    const imageTitle = button.dataset.imageTitle

    this.modalTitleTarget.textContent = imageTitle
    this.modalImageTarget.src = imageUrl
    this.modalImageTarget.alt = `${imageTitle} preview`
    
    this.currentDownloadUrl = button.closest('.flex').querySelector('a[title="Download"]')?.href

    this.showModal()
  }

  showModal() {
    this.imageModalTarget.classList.remove('hidden')
    setTimeout(() => {
      this.imageModalTarget.classList.add('opacity-100')
      this.modalContentTarget.classList.remove('scale-95')
      this.modalContentTarget.classList.add('scale-100')
    }, 10)
    
    document.body.classList.add('overflow-hidden')
    this.isModalOpen = true
    
    this.imageModalTarget.focus()
  }

  closeModal(event) {
    if (event) {
      event.preventDefault()
    }
    
    this.imageModalTarget.classList.remove('opacity-100')
    this.modalContentTarget.classList.remove('scale-100')
    this.modalContentTarget.classList.add('scale-95')
    
    setTimeout(() => {
      this.imageModalTarget.classList.add('hidden')
      document.body.classList.remove('overflow-hidden')
      
      this.modalImageTarget.src = ''
      this.isModalOpen = false
    }, 300)
  }

  downloadImage(event) {
    if (this.currentDownloadUrl) {
      window.location.href = this.currentDownloadUrl
    }
  }

  handleKeyDown(event) {
    if (event.key === 'Escape' && this.isModalOpen) {
      this.closeModal()
    }
  }

  backdropClick(event) {
    if (event.target === this.imageModalTarget) {
      this.closeModal()
    }
  }
  
  showUploadForm() {
    const uploadButton = this.element.querySelector('[data-sheet-trigger]')
    if (uploadButton) {
      uploadButton.click()
    }
  }
}
