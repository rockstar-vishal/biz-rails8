import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "title", 
    "detailsCard", 
    "timestampsCard", 
    "deleteModal", 
    "deleteModalContent",
    "toast",
    "toastMessage"
  ]

  connect() {
    this.animateCardsOnLoad()
  }

  animateCardsOnLoad() {
    this.typewriterEffect(this.titleTarget, this.titleTarget.textContent)
    
    const cards = [this.detailsCardTarget, this.timestampsCardTarget]
    cards.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0'
        card.style.transform = 'translateY(20px)'
        
        setTimeout(() => {
          card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          card.style.opacity = '1'
          card.style.transform = 'translateY(0)'
        }, 200 + (index * 150))
      }
    })
  }

  typewriterEffect(element, text) {
    element.textContent = ''
    let index = 0
    
    const typeInterval = setInterval(() => {
      element.textContent += text[index]
      index++
      
      if (index >= text.length) {
        clearInterval(typeInterval)
        this.addCursorBlink(element)
      }
    }, 100)
  }

  addCursorBlink(element) {
    const cursor = document.createElement('span')
    cursor.textContent = '|'
    cursor.style.animation = 'blink 1s infinite'
    cursor.style.marginLeft = '2px'
    element.appendChild(cursor)
    
    setTimeout(() => {
      if (cursor.parentNode) {
        cursor.remove()
      }
    }, 3000)
  }

  animateButton(event) {
    const button = event.currentTarget
    
    const ripple = document.createElement('span')
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.classList.add('ripple')
    
    button.style.position = 'relative'
    button.style.overflow = 'hidden'
    button.appendChild(ripple)
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove()
      }
    }, 600)
  }

  highlightField(event) {
    const field = event.currentTarget
    const originalBg = field.style.backgroundColor
    
    field.style.transition = 'all 0.3s ease'
    field.style.backgroundColor = '#EBF8FF'
    field.style.transform = 'scale(1.02)'
    
    setTimeout(() => {
      field.style.backgroundColor = originalBg
      field.style.transform = 'scale(1)'
    }, 300)
    
    this.createFloatingIcon(event.target, '✨')
  }

  createFloatingIcon(element, icon) {
    const floatingIcon = document.createElement('span')
    floatingIcon.textContent = icon
    floatingIcon.style.position = 'absolute'
    floatingIcon.style.pointerEvents = 'none'
    floatingIcon.style.fontSize = '20px'
    floatingIcon.style.zIndex = '1000'
    
    const rect = element.getBoundingClientRect()
    floatingIcon.style.left = (rect.left + rect.width / 2) + 'px'
    floatingIcon.style.top = rect.top + 'px'
    
    document.body.appendChild(floatingIcon)
    
    let position = 0
    let opacity = 1
    
    const animate = () => {
      position -= 2
      opacity -= 0.02
      
      floatingIcon.style.transform = `translateY(${position}px)`
      floatingIcon.style.opacity = opacity
      
      if (opacity > 0) {
        requestAnimationFrame(animate)
      } else {
        floatingIcon.remove()
      }
    }
    
    requestAnimationFrame(animate)
  }

  toggleDeleteModal() {
    const modal = this.deleteModalTarget
    const content = this.deleteModalContentTarget
    
    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden')
      
      setTimeout(() => {
        content.style.transform = 'scale(1)'
        content.style.opacity = '1'
      }, 10)
      
      this.modalEscapeHandler = (event) => {
        if (event.key === 'Escape') {
          this.toggleDeleteModal()
        }
      }
      document.addEventListener('keydown', this.modalEscapeHandler)
      
    } else {
      content.style.transform = 'scale(0.95)'
      content.style.opacity = '0'
      
      setTimeout(() => {
        modal.classList.add('hidden')
      }, 300)
      
      if (this.modalEscapeHandler) {
        document.removeEventListener('keydown', this.modalEscapeHandler)
        this.modalEscapeHandler = null
      }
    }
  }

  async copyCostMapInfo(event) {
    const costMapTitle = this.titleTarget.textContent.replace('|', '').trim()
    const costType = this.element.querySelector('[data-field="cost_type"] p').textContent.trim()
    const copyText = `Cost Map: ${costMapTitle}, Cost Type: ${costType}`

    try {
      await navigator.clipboard.writeText(copyText)
      this.showToast('Cost Map information copied to clipboard! 📋')

      const copyButton = event.currentTarget
      if (copyButton) {
        this.pulseAnimation(copyButton)
      }

    } catch (err) {
      console.error('Failed to copy text: ', err)
      this.showToast('Failed to copy information', 'error')
    }
  }

  showToast() {
    const toast = this.toastTarget
    toast.classList.remove("hidden", "opacity-0")
    toast.classList.add("opacity-100")

    setTimeout(() => {
      toast.classList.remove("opacity-100")
      toast.classList.add("opacity-0")
      
      setTimeout(() => {
        toast.classList.add("hidden")
      }, 500)
    }, 2000)
  }

  pulseAnimation(element) {
    if (!element) return
    element.style.transform = 'scale(0.95)'
    
    setTimeout(() => {
      element.style.transform = 'scale(1.05)'
      
      setTimeout(() => {
        element.style.transform = 'scale(1)'
      }, 150)
    }, 150)
  }
}
