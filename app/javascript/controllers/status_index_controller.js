import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "searchInput", 
    "statusGrid", 
    "row", 
    "tbody",
    "emptyState",
    "totalCount",
    "availableCount", 
    "bookedCount",
    "blockedCount",
    "clearSearch",
    "quickFilters",
    "searchInfo",
    "resultsCount",
    "searchTermDisplay"
  ]
  
  static values = {
    statuses: Array
  }
  
  connect() {
    this.originalStatuses = [...this.statusesValue]
    this.filteredStatuses = [...this.statusesValue]
    this.currentFilter = 'all'
    this.currentSearchTerm = ''
    this.searchTimeout = null
    
    this.updateCounts()
    
    this.boundHandleStatusCreated = this.handleStatusCreated.bind(this)
    this.boundHandleStatusUpdated = this.handleStatusUpdated.bind(this)
    this.boundHandleStatusDeleted = this.handleStatusDeleted.bind(this)
    this.boundUpdateCounts = this.updateCounts.bind(this)
    this.boundHandleTurboStreamRender = this.handleTurboStreamRender.bind(this)
    
    document.addEventListener('status:created', this.boundHandleStatusCreated)
    document.addEventListener('status:updated', this.boundHandleStatusUpdated)
    document.addEventListener('status:deleted', this.boundHandleStatusDeleted)
    document.addEventListener('counts:updated', this.boundUpdateCounts)
    
    document.addEventListener('turbo:before-stream-render', this.boundHandleTurboStreamRender)
    
    this.setupSearchDebouncing()
    
    this.updateLastUpdated()
  }

  disconnect() {
    document.removeEventListener('status:created', this.boundHandleStatusCreated)
    document.removeEventListener('status:updated', this.boundHandleStatusUpdated)
    document.removeEventListener('status:deleted', this.boundHandleStatusDeleted)
    document.removeEventListener('counts:updated', this.boundUpdateCounts)
    document.removeEventListener('turbo:before-stream-render', this.boundHandleTurboStreamRender)
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  }
  
  handleTurboStreamRender(event) {
    const streamElement = event.target
    
    if (streamElement.action === 'replace' || streamElement.action === 'update') {
      setTimeout(() => {
        this.syncLocalDataFromDOM()
      }, 100)
    }
  }
  
  syncLocalDataFromDOM() {
    const statusCards = this.element.querySelectorAll('[data-status-id]')
    const updatedStatuses = []
    
    statusCards.forEach(card => {
      const statusId = parseInt(card.dataset.statusId)
      const nameElement = card.querySelector('[data-searchable="name"]')
      const classElement = card.querySelector('[data-searchable="class"]')
      const tagElement = card.querySelector('[data-searchable="tag"]')
      
      if (nameElement && classElement && tagElement) {
        updatedStatuses.push({
          id: statusId,
          name: nameElement.textContent.trim(),
          for_class: classElement.textContent.trim(),
          tag: tagElement.textContent.trim().toLowerCase()
        })
      }
    })
    
    this.originalStatuses = updatedStatuses
    this.statusesValue = updatedStatuses
    this.applyFilters()    
  }
  
  setupSearchDebouncing() {
    if (this.hasSearchInputTarget) {
      this.searchInputTarget.addEventListener('input', (e) => {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.handleSearch(e.target.value)
        }, 300)
      })
    }
  }
  
  handleStatusCreated(event) {
    if (event.detail && event.detail.stats) {
      this.updateCountsFromData(event.detail.stats)      
      if (event.detail.status) {
        this.originalStatuses.unshift(event.detail.status)
        this.statusesValue = [...this.originalStatuses]
        this.applyFilters()
      }
      
      this.updateLastUpdated()
      this.refreshStats()
    }
  }
  
  handleStatusUpdated(event) {    
    if (event.detail && event.detail.stats) {
      this.updateCountsFromData(event.detail.stats)
      
      if (event.detail.status) {
        const index = this.originalStatuses.findIndex(s => s.id === event.detail.status.id)
        if (index !== -1) {
          this.originalStatuses[index] = event.detail.status
          this.statusesValue = [...this.originalStatuses]
          this.applyFilters()
        }
      } else {
        this.syncLocalDataFromDOM()
      }
      
      this.updateLastUpdated()
      this.refreshStats()
    }
  }
  
  handleStatusDeleted(event) {    
    if (event.detail && event.detail.stats) {
      if (event.detail.statusId) {
        this.originalStatuses = this.originalStatuses.filter(s => s.id !== event.detail.statusId)
        this.statusesValue = [...this.originalStatuses]
      }
      
      this.updateCountsFromData(event.detail.stats)
      this.applyFilters()
      this.updateLastUpdated()
      this.refreshStats()
    }
  }

  search(event) {
    if (event && event.target) {
      this.handleSearch(event.target.value)
    }
  }
  
  handleSearch(searchTerm) {
    this.currentSearchTerm = searchTerm.toLowerCase()
    
    if (this.hasClearSearchTarget) {
      if (searchTerm) {
        this.clearSearchTarget.classList.remove('hidden')
      } else {
        this.clearSearchTarget.classList.add('hidden')
      }
    }
    
    this.applyFilters()
  }
  
  clearSearch() {
    if (this.hasSearchInputTarget) {
      this.searchInputTarget.value = ''
      this.handleSearch('')
    }
  }
  
  handleFilter(event) {
    const filter = event.currentTarget.getAttribute('data-filter')
    this.currentFilter = filter
    this.updateFilterButtons(event.currentTarget)
    this.applyFilters()
  }
  
  clearAllFilters() {
    if (this.hasSearchInputTarget) {
      this.searchInputTarget.value = ''
    }
    this.currentSearchTerm = ''
    this.currentFilter = 'all'
    
    const allButton = this.element.querySelector('[data-filter="all"]')
    if (allButton) {
      this.updateFilterButtons(allButton)
    }
    
    this.applyFilters()
  }
  
  applyFilters() {
    let filtered = [...this.originalStatuses]
    
    if (this.currentSearchTerm) {
      filtered = filtered.filter(status => 
        (status.name && status.name.toLowerCase().includes(this.currentSearchTerm)) ||
        (status.for_class && status.for_class.toLowerCase().includes(this.currentSearchTerm)) ||
        (status.tag && status.tag.toLowerCase().includes(this.currentSearchTerm))
      )
    }
    
    if (this.currentFilter !== 'all') {
      filtered = filtered.filter(status => status.tag === this.currentFilter)
    }
    
    this.filteredStatuses = filtered
    this.updateVisibleRows()
    this.updateSearchInfo()
    this.updateFilteredCounts()
  }
  
  updateVisibleRows() {
    if (this.hasRowTarget) {
      this.rowTargets.forEach(row => {
        const statusId = row.dataset.statusId
        const isVisible = this.filteredStatuses.some(status => status.id.toString() === statusId)
        row.style.display = isVisible ? '' : 'none'
      })
    } else {
      const statusCards = this.element.querySelectorAll('[data-status-id]')
      statusCards.forEach(card => {
        const statusId = card.dataset.statusId
        const isVisible = this.filteredStatuses.some(status => status.id.toString() === statusId)
        card.style.display = isVisible ? '' : 'none'
      })
    }
    
    this.updateEmptyState()
  }
  
  updateEmptyState() {
    const visibleCards = this.element.querySelectorAll('[data-status-id]:not([style*="display: none"])')
    
    if (this.hasEmptyStateTarget) {
      if (visibleCards.length === 0) {
        this.emptyStateTarget.classList.remove('hidden')
        if (this.hasStatusGridTarget) {
          this.statusGridTarget.classList.add('hidden')
        }
      } else {
        this.emptyStateTarget.classList.add('hidden')
        if (this.hasStatusGridTarget) {
          this.statusGridTarget.classList.remove('hidden')
        }
      }
    }
  }
  
  updateSearchInfo() {
    if (this.hasSearchInfoTarget) {
      if (this.currentSearchTerm || this.currentFilter !== 'all') {
        this.searchInfoTarget.classList.remove('hidden')
        
        if (this.hasResultsCountTarget) {
          this.resultsCountTarget.textContent = this.filteredStatuses.length
        }
        
        if (this.hasSearchTermDisplayTarget) {
          if (this.currentSearchTerm) {
            this.searchTermDisplayTarget.textContent = `"${this.currentSearchTerm}"`
            this.searchTermDisplayTarget.classList.remove('hidden')
          } else {
            this.searchTermDisplayTarget.classList.add('hidden')
          }
        }
      } else {
        this.searchInfoTarget.classList.add('hidden')
      }
    }
  }
  
  updateFilterButtons(activeButton) {
    this.element.querySelectorAll('.filter-chip').forEach(btn => {
      btn.className = 'filter-chip px-3 py-2 text-xs font-medium rounded-full border transition-all duration-200 hover:bg-gray-50'
    })
    
    const filter = activeButton.getAttribute('data-filter')
    const colors = {
      all: 'bg-blue-50 text-blue-700 border-blue-200',
      available: 'bg-green-50 text-green-700 border-green-200',
      booked: 'bg-orange-50 text-orange-700 border-orange-200',
      blocked: 'bg-red-50 text-red-700 border-red-200'
    }
    
    if (colors[filter]) {
      activeButton.className = `filter-chip px-3 py-2 text-xs font-medium rounded-full border transition-all duration-200 ${colors[filter]}`
    }
  }
  
  updateCounts() {
    fetch('/settings/statuses/stats.json')
      .then(response => response.json())
      .then(data => {
        this.updateCountsFromData(data)
      })
      .catch(error => {
        console.error('Failed to update counts:', error)
      })
  }
  
  updateCountsFromData(data) {
    if (this.hasTotalCountTarget) this.animateCount(this.totalCountTarget, data.total || data.by_tag?.total || 0)
    if (this.hasAvailableCountTarget) this.animateCount(this.availableCountTarget, data.by_tag?.available || data.available || 0)
    if (this.hasBookedCountTarget) this.animateCount(this.bookedCountTarget, data.by_tag?.booked || data.booked || 0)
    if (this.hasBlockedCountTarget) this.animateCount(this.blockedCountTarget, data.by_tag?.blocked || data.blocked || 0)
  }
  
  updateFilteredCounts() {
    if (!this.currentSearchTerm && this.currentFilter === 'all') {
      this.updateCounts()
      return
    }
    
    const total = this.filteredStatuses.length
    const available = this.filteredStatuses.filter(s => s.tag === 'available').length
    const booked = this.filteredStatuses.filter(s => s.tag === 'booked').length
    const blocked = this.filteredStatuses.filter(s => s.tag === 'blocked').length
    
    if (this.hasTotalCountTarget) this.animateCount(this.totalCountTarget, total)
    if (this.hasAvailableCountTarget) this.animateCount(this.availableCountTarget, available)
    if (this.hasBookedCountTarget) this.animateCount(this.bookedCountTarget, booked)
    if (this.hasBlockedCountTarget) this.animateCount(this.blockedCountTarget, blocked)
  }
  
  animateCount(element, targetValue) {
    if (!element) return
    
    const currentValue = parseInt(element.textContent) || 0
    
    if (currentValue === targetValue) return
    
    element.classList.add('count-animate')
    
    const increment = targetValue > currentValue ? 1 : -1
    const duration = 300
    const steps = Math.abs(targetValue - currentValue)
    const stepDuration = steps > 0 ? duration / steps : 0
    
    let current = currentValue
    
    const animate = () => {
      if (current !== targetValue) {
        current += increment
        element.textContent = current
        setTimeout(animate, stepDuration)
      } else {
        setTimeout(() => {
          element.classList.remove('count-animate')
        }, 300)
      }
    }
    
    animate()
  }
  
  updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('lastUpdated')
    if (lastUpdatedElement) {
      lastUpdatedElement.textContent = 'just now'
    }
  }
  
  refreshStats() {
    const statsContainer = this.element.querySelector('.bg-white.rounded-xl')
    if (statsContainer) {
      statsContainer.style.transform = 'scale(1.02)'
      setTimeout(() => {
        statsContainer.style.transform = 'scale(1)'
      }, 200)
    }
  }
  
  highlightSearchTerm(text, searchTerm) {
    if (!searchTerm || !text) return text
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<span class="bg-yellow-200 px-1 rounded">$1</span>')
  }
}
