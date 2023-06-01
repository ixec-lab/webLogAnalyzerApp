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
  $('#mytable').DataTable({
    ajax: {
      url: "/api/ia/prediction/test-log.txt",
      type: "GET",
      dataSrc: "predictions"
    },
    columns: [
      {'data': 'id'},
      {'data': 'url'},
      {'data': 'user_agent'},
      {'data': 'prediction'},
      
    ]
  });
});
