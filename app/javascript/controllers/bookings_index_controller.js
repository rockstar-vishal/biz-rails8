import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification-toast')
    existingNotifications.forEach(n => n.remove())
    
    const notification = document.createElement('div')
    notification.className = `notification-toast fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg border-l-4 p-4 z-50 transform transition-all duration-300 ease-in-out translate-x-full`
    
    let borderColor = 'border-blue-500'
    let iconColor = 'text-blue-500'
    let icon = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    
    if (type === 'success') {
      borderColor = 'border-green-500'
      iconColor = 'text-green-500'
      icon = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    } else if (type === 'warning') {
      borderColor = 'border-yellow-500'
      iconColor = 'text-yellow-500'
      icon = 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    } else if (type === 'error') {
      borderColor = 'border-red-500'
      iconColor = 'text-red-500'
      icon = 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    }
    
    notification.classList.add(borderColor)
    
    notification.innerHTML = `
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"></path>
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-gray-700">${message}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button type="button" class="inline-flex bg-white rounded-md p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()">
              <span class="sr-only">Dismiss</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.classList.remove('translate-x-full')
    }, 10)
    
    setTimeout(() => {
      notification.classList.add('translate-x-full')
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 5000)
  }
}
