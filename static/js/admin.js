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

   const fileDropDown = $('#filedropdown');
   var log_table;

   $.ajax({
    url: "/api/uploadedFiles",
    type: "GET",
    cache: false,
    success: function(res){
      files = JSON.parse(res);

      if (files.success){
        files.logs.forEach(function(file){
          let option = '<option value="'+file+'">'+file+'</option>';
          fileDropDown.append(option);
        });

      }else{
        alert("Enable to load the file list");
      }
    },
    error: function(err){

    }
   });

   log_table = $('#mytable').DataTable({
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

  fileDropDown.on("change",function(e){
    console.log(fileDropDown.val())
    API_PATH = "/api/ia/prediction/"+fileDropDown.val();
    log_table.destroy();
    log_table.clear();

    log_table = $('#mytable').DataTable({
      ajax: {
        url: API_PATH,
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

});
