(() => {
  'use strict'
  feather.replace({ 'aria-hidden': 'true' })
  const ctx = document.getElementById('myChart')
  const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        'LFI/RFI',
        'SQLI',
        'Comand Injection',
        'XSS',
        'XEE',
        'SSTI',
      ],
      datasets: [{
        data: [
          9,
          1,
          0,
          0,
          0,
          0,
          0
        ],
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          boxPadding: 5
        }
      }
    }
  })
  const ctv = document.getElementById('time')
  const time = new Chart(ctv, {
    type: 'line',
    data: {
      labels: [
        'LFI/RFI',
        'SQLI',
        'Comand Injection',
        'XSS',
        'XEE',
        'SSTI',
      ],
      datasets: [{
        data: [
          9,
          1,
          0,
          0,
          0,
          0,
          0
        ],
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          boxPadding: 5
        }
      }
    }
  })
})()

$(document).ready( function () {
  $('#mytable').DataTable();
} );
let table = new DataTable('#mytable', {
});
