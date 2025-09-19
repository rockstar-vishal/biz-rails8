import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["cardView", "tableView", "viewToggle", "viewText"]
  
  connect() {
    this.isCardView = true
    this.animateOnLoad()
  }

  toggleView() {
    this.isCardView = !this.isCardView
    
    if (this.isCardView) {
      this.showCardView()
      this.viewTextTarget.textContent = "Card View"
    } else {
      this.showTableView()
      this.viewTextTarget.textContent = "Table View"
    }
  }

  showCardView() {
    this.fadeOut(this.tableViewTarget, () => {
      this.tableViewTarget.classList.add('hidden')
      this.cardViewTarget.classList.remove('hidden')
      this.fadeIn(this.cardViewTarget)
    })
    
    this.updateToggleButton('card')
  }

  showTableView() {
    this.fadeOut(this.cardViewTarget, () => {
      this.cardViewTarget.classList.add('hidden')
      this.tableViewTarget.classList.remove('hidden')
      this.fadeIn(this.tableViewTarget)
    })
    
    this.updateToggleButton('table')
  }

  updateToggleButton(view) {
    const button = this.viewToggleTarget
    
    if (view === 'card') {
      button.innerHTML = `
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
        <span data-payment-plan-show-target="viewText">Card View</span>
      `
    } else {
      button.innerHTML = `
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18m-18 8h18m-18 4h18"></path>
        </svg>
        <span data-payment-plan-show-target="viewText">Table View</span>
      `
    }
  }

  fadeOut(element, callback = null) {
    element.style.transition = 'opacity 0.3s ease-out'
    element.style.opacity = '0'
    
    setTimeout(() => {
      if (callback) callback()
    }, 300)
  }

  fadeIn(element) {
    element.style.opacity = '0'
    element.style.transition = 'opacity 0.3s ease-in'
    
    setTimeout(() => {
      element.style.opacity = '1'
    }, 50)
  }

  animateOnLoad() {
    const animatedElements = this.element.querySelectorAll('[class*="animate-"]')
    
    animatedElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.1}s`
    })

    this.addHoverEffects()
  }

  addHoverEffects() {
    const cards = this.element.querySelectorAll('.hover\\:scale-105')
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)'
        card.style.transition = 'transform 0.2s ease-out'
      })
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)'
        card.style.transition = 'transform 0.2s ease-out'
      })
    })

    const stageCards = this.cardViewTarget?.querySelectorAll('.animate-slide-up')
    if (stageCards) {
      this.animateStageCards(stageCards)
    }
  }

  animateStageCards(cards) {
    cards.forEach((card, index) => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(20px)'
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out'
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
      }, index * 100)
    })
  }

  scrollToSection(event) {
    event.preventDefault()
    const targetId = event.currentTarget.getAttribute('href')
    const targetElement = document.querySelector(targetId)
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  showConfirmDialog(event) {
    const message = event.currentTarget.dataset.confirm
    if (message) {
      const confirmed = confirm(message)
      
      if (confirmed) {
        const button = event.currentTarget
        const originalText = button.innerHTML
        
        button.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Deleting...
        `
        button.disabled = true
        
        return true
      } else {
        event.preventDefault()
        return false
      }
    }
    
    return true
  }

  animateProgressBars() {
    const progressBars = this.element.querySelectorAll('.animate-expand-width')
    
    progressBars.forEach((bar, index) => {
      const targetWidth = bar.style.width
      bar.style.width = '0%'
      
      setTimeout(() => {
        bar.style.width = targetWidth
        bar.style.transition = 'width 1s ease-out'
      }, index * 200)
    })
  }

  disconnect() {
    const cards = this.element.querySelectorAll('.hover\\:scale-105')
    cards.forEach(card => {
      card.style.transform = ''
      card.style.transition = ''
    })
  }
}
