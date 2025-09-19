import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "header", "infoCard", "templatesCard", "statsCard", "bankCard", "actionsCard",
    "modalOverlay", "modal", "modalTitle", "modalContent", "loadingIndicator",
    "templateCounter", "daysCounter", "bankCounter"
  ]

  connect() {
    this.initializeAnimations()
    this.setupScrollAnimations()
    this.startCounterAnimations()
  }

  disconnect() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect()
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect()
    }
  }

  initializeAnimations() {
    // Staggered entrance animations
    const animationSequence = [
      { target: this.headerTarget, delay: 0, direction: 'up' },
      // { target: this.actionsTarget, delay: 200, direction: 'right' },
      { target: this.infoCardTarget, delay: 400, direction: 'up' },
      { target: this.templatesCardTarget, delay: 600, direction: 'up' },
      { target: this.statsCardTarget, delay: 300, direction: 'right' },
      { target: this.bankCardTarget, delay: 500, direction: 'right' },
      // { target: this.actionsCardTarget, delay: 700, direction: 'right' }
    ]

    animationSequence.forEach(({ target, delay, direction }) => {
      if (target) {
        setTimeout(() => {
          this.animateIn(target, direction)
        }, delay)
      }
    })
  }

  animateIn(element, direction = 'up') {
    const transforms = {
      up: 'translate-y-8',
      right: 'translate-x-8',
      down: 'translate-y-8',
      left: 'translate-x-8'
    }

    element.classList.remove(transforms[direction])
    element.classList.remove('opacity-0')
    element.classList.add('transition-all', 'duration-700', 'ease-out')
  }

  setupScrollAnimations() {
    this.addFloatingAnimation()
    this.setupIntersectionObserver()    
    this.setupParallaxEffect()
  }

  addFloatingAnimation() {
    const cards = [
      this.infoCardTarget, this.templatesCardTarget, this.statsCardTarget, 
      this.bankCardTarget
    ]

    cards.forEach((card, index) => {
      if (card) {
        const delay = index * 0.5
        card.style.animation = `float 6s ease-in-out infinite ${delay}s`
        
        if (!document.querySelector('#floating-animation-style')) {
          const style = document.createElement('style')
          style.id = 'floating-animation-style'
          style.textContent = `
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33% { transform: translateY(-3px) rotate(0.5deg); }
              66% { transform: translateY(-1px) rotate(-0.5deg); }
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
              50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
            }
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-2px); }
              75% { transform: translateX(2px); }
            }
            .animate-counter {
              animation: counterPulse 0.6s ease-out;
            }
            @keyframes counterPulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); color: #3b82f6; }
              100% { transform: scale(1); }
            }
          `
          document.head.appendChild(style)
        }
      }
    })
  }

  setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-pulse-glow')
          setTimeout(() => {
            entry.target.classList.remove('animate-pulse-glow')
          }, 2000)
        }
      })
    }, { threshold: 0.1 })

    const cards = [this.infoCardTarget, this.templatesCardTarget, this.statsCardTarget, this.bankCardTarget]
    cards.forEach(card => {
      if (card) this.intersectionObserver.observe(card)
    })
  }

  setupParallaxEffect() {
    let ticking = false
    
    const updateParallax = () => {
      const scrolled = window.pageYOffset
      const parallaxElements = document.querySelectorAll('[data-project-dashboard-target="header"]')
      
      parallaxElements.forEach(element => {
        const speed = 0.5
        const yPos = -(scrolled * speed)
        element.style.transform = `translateY(${yPos}px)`
      })
      
      ticking = false
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax)
        ticking = true
      }
    })
  }

  startCounterAnimations() {
    setTimeout(() => {
      this.animateCounters()
    }, 1000)
  }

  animateCounters() {
    const counters = [
      { target: this.templateCounterTarget, finalValue: parseInt(this.templateCounterTarget?.textContent || 0) },
      { target: this.daysCounterTarget, finalValue: parseInt(this.daysCounterTarget?.textContent || 0) },
      { target: this.bankCounterTarget, finalValue: parseInt(this.bankCounterTarget?.textContent || 0) }
    ]

    counters.forEach(({ target, finalValue }) => {
      if (target && finalValue > 0) {
        let currentValue = 0
        const increment = Math.ceil(finalValue / 20)
        const timer = setInterval(() => {
          currentValue += increment
          if (currentValue >= finalValue) {
            currentValue = finalValue
            clearInterval(timer)
            target.classList.add('animate-counter')
            setTimeout(() => target.classList.remove('animate-counter'), 600)
          }
          target.textContent = currentValue
        }, 50)
      }
    })
  }

  highlightField(event) {
    const field = event.currentTarget
    field.classList.add('transform', 'scale-105', 'shadow-lg')
    
    field.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)'
    field.style.borderColor = '#3b82f6'
  }

  unhighlightField(event) {
    const field = event.currentTarget
    field.classList.remove('shadow-lg')
    field.style.boxShadow = ''
    field.style.borderColor = ''
  }

  expandTemplate(event) {
    const templateDiv = event.currentTarget
    const expandedContent = templateDiv.querySelector('.hidden')
    const arrow = templateDiv.querySelector('svg')
    
    if (expandedContent.classList.contains('hidden')) {
      expandedContent.classList.remove('hidden')
      expandedContent.style.maxHeight = '0px'
      expandedContent.style.overflow = 'hidden'
      
      requestAnimationFrame(() => {
        expandedContent.style.transition = 'max-height 0.3s ease-out'
        expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px'
      })
      
      arrow.style.transform = 'rotate(90deg)'
      
      templateDiv.classList.add('bg-purple-50', 'border-purple-300')
    } else {
      expandedContent.style.maxHeight = '0px'
      arrow.style.transform = 'rotate(0deg)'
      templateDiv.classList.remove('bg-purple-50', 'border-purple-300')
      
      setTimeout(() => {
        expandedContent.classList.add('hidden')
        expandedContent.style.maxHeight = ''
        expandedContent.style.overflow = ''
      }, 300)
    }
  }

  animateCounter(event) {
    const counter = event.currentTarget.querySelector('[data-project-dashboard-target$="Counter"]')
    if (counter) {
      counter.classList.add('animate-counter')
      setTimeout(() => counter.classList.remove('animate-counter'), 600)
    }
  }

  addTemplate() {
    this.showModal('Add New Template', `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Template Name</label>
          <input type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter template name">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Template Type</label>
          <select class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Welcome Letter</option>
            <option>Invoice Template</option>
            <option>Agreement Template</option>
            <option>Custom Template</option>
          </select>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button class="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200" onclick="this.closest('[data-project-dashboard-target=modalOverlay]').querySelector('[data-action*=closeModal]').click()">Cancel</button>
          <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">Create Template</button>
        </div>
      </div>
    `)
  }

  manageBankAccounts() {
    this.showLoading()
    
    setTimeout(() => {
      this.hideLoading()
      this.showModal('Manage Bank Accounts', `
        <div class="space-y-4">
          <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 class="font-medium text-amber-800 mb-2">Current Restriction Status</h4>
            <p class="text-sm text-amber-700">Bank restrictions are currently ${document.querySelector('.bg-red-100') ? 'enabled' : 'disabled'} for this project.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Add New Bank Account</label>
            <input type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Enter bank account details">
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button class="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200" onclick="this.closest('[data-project-dashboard-target=modalOverlay]').querySelector('[data-action*=closeModal]').click()">Cancel</button>
            <button class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200">Save Changes</button>
          </div>
        </div>
      `)
    }, 1000)
  }

  showModal(title, content) {
    this.modalTitleTarget.textContent = title
    this.modalContentTarget.innerHTML = content
    
    this.modalOverlayTarget.classList.remove('hidden')
    
    requestAnimationFrame(() => {
      this.modalOverlayTarget.classList.remove('opacity-0')
      this.modalTarget.classList.remove('scale-95')
    })
    
    document.body.style.overflow = 'hidden'
  }

  closeModal() {
    this.modalOverlayTarget.classList.add('opacity-0')
    this.modalTarget.classList.add('scale-95')
    
    setTimeout(() => {
      this.modalOverlayTarget.classList.add('hidden')
      document.body.style.overflow = ''
    }, 300)
  }

  showLoading() {
    this.loadingIndicatorTarget.classList.remove('hidden', 'opacity-0', 'translate-x-4')
    
    requestAnimationFrame(() => {
      this.loadingIndicatorTarget.classList.add('opacity-100')
      this.loadingIndicatorTarget.classList.remove('translate-x-4')
    })
  }

  hideLoading() {
    this.loadingIndicatorTarget.classList.add('opacity-0', 'translate-x-4')
    
    setTimeout(() => {
      this.loadingIndicatorTarget.classList.add('hidden')
    }, 300)
  }

  showToast(message) {
    const toast = document.createElement('div')
    toast.className = 'fixed bottom-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-y-16 opacity-0 transition-all duration-300'
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>${message}</span>
      </div>
    `
    
    document.body.appendChild(toast)
    
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-16', 'opacity-0')
    })
    
    setTimeout(() => {
      toast.classList.add('translate-y-16', 'opacity-0')
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 3000)
  }

  handleKeydown(event) {
    if (event.key === 'Escape' && !this.modalOverlayTarget.classList.contains('hidden')) {
      this.closeModal()
    }
  }

  startPeriodicUpdates() {
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.animateCounters()
      }
    }, 30000)
  }
}
