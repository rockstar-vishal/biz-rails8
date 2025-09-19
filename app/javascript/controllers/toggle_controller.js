import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toggle"]
  static values = { selector: String }

  connect() {
    this.selector = this.element.dataset.toggleSelector || '.toggle-target'
  }

  toggle(event) {
    const isChecked = event.target.checked
    const targets = document.querySelectorAll(this.selector)
    
    targets.forEach(target => {
      target.style.display = isChecked ? '' : 'none'
      target.querySelectorAll('input, select, textarea').forEach(field => {
        if (!field.hasAttribute('data-keep-enabled')) {
          field.disabled = !isChecked
        }
      })
    })
  }
}
