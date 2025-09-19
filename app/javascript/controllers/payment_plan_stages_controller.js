import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["stagesContainer", "stageTemplate", "stageRow", "percentageInput", "amountInput"]
  
  connect() {
    this.stageIndex = this.stageRowTargets.length
    this.addValidationListeners()
    this.initializeAnimations()
  }

  addStage(event) {
    event.preventDefault()
    
    const template = this.stageTemplateTarget.content.cloneNode(true)
    const stageRow = template.querySelector('[data-payment-plan-stages-target="stageRow"]')
    
    stageRow.style.opacity = '0'
    stageRow.style.transform = 'translateY(-20px)'
    stageRow.style.transition = 'all 0.4s ease-out'
    
    const inputs = stageRow.querySelectorAll('input, select')
    inputs.forEach(input => {
      if (input.name) {
        input.name = input.name.replace('NEW_RECORD', this.stageIndex)
      }
    })
    
    const percentageInput = stageRow.querySelector('[data-payment-plan-stages-target="percentageInput"]')
    const amountInput = stageRow.querySelector('[data-payment-plan-stages-target="amountInput"]')
    
    if (percentageInput) {
      percentageInput.addEventListener('input', this.validateFields.bind(this))
      this.addInputAnimation(percentageInput)
    }
    if (amountInput) {
      amountInput.addEventListener('input', this.validateFields.bind(this))
      this.addInputAnimation(amountInput)
    }
    
    this.stagesContainerTarget.appendChild(stageRow)
    
    setTimeout(() => {
      stageRow.style.opacity = '1'
      stageRow.style.transform = 'translateY(0)'
    }, 50)
    
    this.stageIndex++
    
    const firstInput = stageRow.querySelector('input[type="text"]')
    if (firstInput) {
      setTimeout(() => {
        firstInput.focus()
        this.addFocusAnimation(firstInput)
      }, 400)
    }

    this.updateTotalsDisplay()
  }

  removeStage(event) {
    event.preventDefault()
    
    const stageRow = event.target.closest('[data-payment-plan-stages-target="stageRow"]')
    
    if (stageRow) {
      stageRow.style.transition = 'all 0.3s ease-out'
      stageRow.style.opacity = '0'
      stageRow.style.transform = 'translateX(-100%)'
      stageRow.style.maxHeight = stageRow.offsetHeight + 'px'
      
      const destroyField = stageRow.querySelector('input[name*="[_destroy]"]')
      
      setTimeout(() => {
        if (destroyField) {
          destroyField.value = '1'
          stageRow.style.display = 'none'
        } else {
          stageRow.style.maxHeight = '0'
          stageRow.style.padding = '0'
          stageRow.style.margin = '0'
          
          setTimeout(() => {
            stageRow.remove()
          }, 300)
        }
        
        this.updateTotalsDisplay()
      }, 300)
    }
  }

  validateFields(event) {
    const currentRow = event.target.closest('[data-payment-plan-stages-target="stageRow"]')
    if (!currentRow) return
    
    const percentageInput = currentRow.querySelector('[data-payment-plan-stages-target="percentageInput"]')
    const amountInput = currentRow.querySelector('[data-payment-plan-stages-target="amountInput"]')
    
    if (!percentageInput || !amountInput) return
    
    const percentageValue = percentageInput.value.trim()
    const amountValue = amountInput.value.trim()
    
    this.clearFieldErrors(percentageInput)
    this.clearFieldErrors(amountInput)
    
    if (percentageValue && amountValue) {
      this.showFieldError(percentageInput, 'Cannot have both percentage and amount')
      this.showFieldError(amountInput, 'Cannot have both percentage and amount')
      return
    }
    
    if (percentageValue) {
      const percentage = parseFloat(percentageValue)
      if (percentage < 0 || percentage > 100) {
        this.showFieldError(percentageInput, 'Percentage must be between 0 and 100')
      } else {
        this.addSuccessAnimation(percentageInput)
      }
    }
    
    if (amountValue) {
      const amount = parseFloat(amountValue)
      if (amount < 0) {
        this.showFieldError(amountInput, 'Amount must be positive')
      } else {
        this.addSuccessAnimation(amountInput)
      }
    }

    this.updateTotalsDisplay()    
    this.validateTotalPercentage()
  }

  showFieldError(field, message) {
    field.classList.add('border-red-500', 'bg-red-50')
    field.style.animation = 'shake 0.5s ease-in-out'
    
    const existingError = field.parentNode.querySelector('.field-error')
    if (existingError) {
      existingError.remove()
    }
    
    const errorDiv = document.createElement('div')
    errorDiv.className = 'field-error text-red-600 text-xs mt-1 animate-slide-down'
    errorDiv.textContent = message
    errorDiv.style.animation = 'fadeIn 0.3s ease-out'
    field.parentNode.appendChild(errorDiv)
  }

  clearFieldErrors(field) {
    field.classList.remove('border-red-500', 'bg-red-50')
    field.style.animation = ''
    
    const errorMessage = field.parentNode.querySelector('.field-error')
    if (errorMessage) {
      errorMessage.style.animation = 'fadeOut 0.3s ease-out'
      setTimeout(() => {
        errorMessage.remove()
      }, 300)
    }
  }

  addInputAnimation(input) {
    input.addEventListener('focus', () => {
      input.style.transform = 'scale(1.02)'
      input.style.transition = 'transform 0.2s ease-out'
    })
    
    input.addEventListener('blur', () => {
      input.style.transform = 'scale(1)'
    })
  }

  addFocusAnimation(input) {
    input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
    input.style.transition = 'box-shadow 0.3s ease-out'
    
    setTimeout(() => {
      input.style.boxShadow = ''
    }, 1000)
  }

  addSuccessAnimation(field) {
    field.classList.add('border-green-500')
    field.style.animation = 'pulse 0.5s ease-in-out'
    
    setTimeout(() => {
      field.classList.remove('border-green-500')
      field.style.animation = ''
    }, 1000)
  }

  addValidationListeners() {
    this.percentageInputTargets.forEach(input => {
      input.addEventListener('input', this.validateFields.bind(this))
      this.addInputAnimation(input)
    })
    
    this.amountInputTargets.forEach(input => {
      input.addEventListener('input', this.validateFields.bind(this))
      this.addInputAnimation(input)
    })
  }

  calculateTotals() {
    let totalPercentage = 0
    let totalAmount = 0
    
    this.stageRowTargets.forEach(row => {
      if (row.style.display === 'none') return
      
      const percentageInput = row.querySelector('[data-payment-plan-stages-target="percentageInput"]')
      const amountInput = row.querySelector('[data-payment-plan-stages-target="amountInput"]')
      
      if (percentageInput?.value) {
        totalPercentage += parseFloat(percentageInput.value) || 0
      }
      
      if (amountInput?.value) {
        totalAmount += parseFloat(amountInput.value) || 0
      }
    })
    
    return { totalPercentage, totalAmount }
  }

  updateTotalsDisplay() {
    const { totalPercentage, totalAmount } = this.calculateTotals()
    
    const percentageDisplay = document.querySelector('[data-totals-target="percentage"]')
    const amountDisplay = document.querySelector('[data-totals-target="amount"]')
    
    if (percentageDisplay) {
      percentageDisplay.textContent = `${totalPercentage.toFixed(1)}%`
      percentageDisplay.className = totalPercentage === 100 
        ? 'text-green-600 font-semibold' 
        : totalPercentage > 100 
          ? 'text-red-600 font-semibold' 
          : 'text-yellow-600 font-semibold'
    }
    
    if (amountDisplay) {
      amountDisplay.textContent = `₹${totalAmount.toLocaleString()}`
      amountDisplay.className = 'text-gray-900 font-semibold'
    }
  }

  validateTotalPercentage() {
    const { totalPercentage } = this.calculateTotals()
    const percentageInputs = this.element.querySelectorAll('[data-payment-plan-stages-target="percentageInput"]')
    
    if (totalPercentage > 100) {
      percentageInputs.forEach(input => {
        if (input.value && !input.parentNode.querySelector('.field-error')) {
          this.showFieldError(input, `Total percentage exceeds 100% (currently ${totalPercentage.toFixed(1)}%)`)
        }
      })
    }
  }

  initializeAnimations() {
    this.stageRowTargets.forEach((row, index) => {
      row.style.opacity = '0'
      row.style.transform = 'translateY(20px)'
      
      setTimeout(() => {
        row.style.transition = 'all 0.4s ease-out'
        row.style.opacity = '1'
        row.style.transform = 'translateY(0)'
      }, index * 100)
    })

    this.addCustomCSS()
  }

  addCustomCSS() {
    if (document.getElementById('payment-plan-animations')) return
    
    const style = document.createElement('style')
    style.id = 'payment-plan-animations'
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
      
      .animate-slide-down {
        animation: fadeIn 0.3s ease-out;
      }
      
      .field-error {
        animation: fadeIn 0.3s ease-out;
      }
    `
    
    document.head.appendChild(style)
  }

  disconnect() {
    const style = document.getElementById('payment-plan-animations')
    if (style) {
      style.remove()
    }
  }
}
