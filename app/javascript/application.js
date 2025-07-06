// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('turbo:load', () => {
    //sidebar
  
      const expandMenuButton = document.getElementById('expandMenu');
      const sideBar = document.getElementById('sideBar');
      const mainWrapper = document.getElementById('main-wrapper');
    
      const updateMarginLeft = () => {
        if (window.innerWidth > 767) {
          if (sideBar.classList.contains('expanded')) {
            mainWrapper.style.marginLeft = '250px';
          } else {
            mainWrapper.style.marginLeft = '80px';
          }
        } else {
          mainWrapper.style.marginLeft = '80px';
        }
      };
    
      expandMenuButton.addEventListener('click', () => {
        if (sideBar.classList.contains('expanded')) {
          sideBar.classList.remove('expanded');
          sideBar.classList.add('mini');
        } else {
          sideBar.classList.remove('mini');
          sideBar.classList.add('expanded');
        }
        updateMarginLeft();
      });
    
      window.addEventListener('resize', updateMarginLeft);
    
      // Initial call to set the correct margin on page load
      updateMarginLeft();
      
    });
    document.addEventListener('turbo:load', function() {
      function toggleIcon() {
          document.getElementById('icon1').classList.toggle('hidden');
          document.getElementById('icon2').classList.toggle('hidden');
      }
  
      // Assuming you have a button or some element to trigger the toggleIcon function
      document.getElementById('toggleButton').addEventListener('click', toggleIcon);
  });
  
  
  document.addEventListener('turbo:load', function() {
    const toggleButton = document.getElementById('toggleButton');
    const toggleDiv = document.getElementById('toggleDiv');
  
    toggleButton.addEventListener('click', function() {
      toggleDiv.classList.toggle('hidden');
    });
  
    
  });
document.addEventListener('turbo:load', function() {
  google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.setOnLoadCallback(drawBasic);

  function drawBasic() {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Flats');
    data.addColumn('number', 'Count');
    data.addColumn({type: 'string', role: 'style'});

    data.addRows([
      ['Total', 352, '#3B82F6'],
      ['Available', 200, '#22C55E'],
      ['Sold', 150, '#EF4444'],
      ['Blocked', 20, '#000000']
    ]);

   var options = {
      backgroundColor: 'transparent',
      chartArea: {
        left: 80,
        top: 30,
        width: '80%',
        height: '70%'
      },
      hAxis: {
        textStyle: { 
          color: '#6B7280', 
          fontSize: 12,
          fontName: 'Arial'
        },
        gridlines: { 
          color: '#E5E7EB',
          count: 5,
          minSpacing: 50
        },
        minorGridlines: {
          color: '#F3F4F6',
          count: 2
        },
        baselineColor: '#9CA3AF'
      },
      vAxis: {
        textStyle: { 
          color: '#6B7280', 
          fontSize: 12,
          fontName: 'Arial'
        },
        gridlines: { 
          color: '#E5E7EB',
          count: 5
        },
        minorGridlines: {
          color: '#F9FAFB',
          count: 1
        },
        baselineColor: '#9CA3AF',
        format: '0'
      },
      legend: { position: 'none' },
      animation: {
        startup: true,
        duration: 1200,
        easing: 'out'
      },
      bar: { 
        groupWidth: '60%' 
      },
      tooltip: {
        textStyle: {
          color: '#374151',
          fontSize: 13
        },
        showColorCode: true
      }
    };

    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }
});