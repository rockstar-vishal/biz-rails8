import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["searchInput", "table", "row"]

  search() {
    const searchTerm = this.searchInputTarget.value.toLowerCase()
    
    this.rowTargets.forEach(row => {
      const companyName = row.querySelector('.text-sm.font-medium.text-gray-900')?.textContent.toLowerCase() || ''
      const companyCode = row.querySelector('.inline-flex.px-2.py-1')?.textContent.toLowerCase() || ''
      const companyDomain = row.querySelector('.text-sm.text-gray-900')?.textContent.toLowerCase() || ''
      
      const isVisible = companyName.includes(searchTerm) || 
                       companyCode.includes(searchTerm) || 
                       companyDomain.includes(searchTerm)
      
      row.style.display = isVisible ? '' : 'none'
    })
    
    this.updateNoResultsMessage(searchTerm)
  }

  updateNoResultsMessage(searchTerm) {
    const visibleRows = this.rowTargets.filter(row => row.style.display !== 'none')
    const tbody = this.tableTarget.querySelector('tbody')
    
    const existingMessage = tbody.querySelector('.no-results-message')
    if (existingMessage) {
      existingMessage.remove()
    }
    
    if (visibleRows.length === 0 && searchTerm.length > 0) {
      const noResultsRow = document.createElement('tr')
      noResultsRow.className = 'no-results-message'
      noResultsRow.innerHTML = `
        <td colspan="7" class="px-6 py-12 text-center">
          <div class="text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">No companies found</h3>
            <p class="mt-2 text-sm text-gray-500">No companies match your search criteria "${searchTerm}".</p>
          </div>
        </td>
      `
      tbody.appendChild(noResultsRow)
    }
  }
}
