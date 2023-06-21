

$(document).ready( function () {


  (() => {
    'use strict'
    feather.replace({ 'aria-hidden': 'true' })
  })()

  
   const fileDropDown = $('#filedropdown');
   var log_table;
   var nuts;
   var time;
   const ctx = $("#myChart");
   const ctv = $("#time");
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
    dom: 'Bfrtip',
    buttons: [
        'csv', 'excel'
    ],
    columns: [
      {'data': 'id','width': '5%'},
      {'data': 'ip','width': '10%'},
      {'data': 'date','width': '10%'},
      {'data': 'url','width': '40%'},
      {'data': 'user_agent','width': '25%'},
      {'data': 'prediction','width': '10%'},
    ]
  });

  fileDropDown.on("change",function(e){
    console.log(fileDropDown.val())
    API_PATH = "/api/ia/prediction/"+fileDropDown.val();
    if (log_table !== undefined){
      log_table.destroy();
    }

    log_table = $('#mytable').DataTable({
      ajax: {
        url: API_PATH,
        type: "GET",
        dataSrc: "predictions"
      },
      dom: 'Bfrtip',
      buttons: [
        'csv', 'excel'
      ],
      columns: [
        {'data': 'id','width': '5%'},
        {'data': 'ip','width': '10%'},
        {'data': 'date','width': '10%'},
        {'data': 'url','width': '40%'},
        {'data': 'user_agent','width': '25%'},
        {'data': 'prediction','width': '10%'},
      ]
    });


    $.ajax({
      url: '/api/ia/predictions/stats/'+fileDropDown.val(),
      type: "GET",
      cache: false,
      success: function(res){
        ia = JSON.parse(res);
  
        if (ia.success){
          
          if (nuts !== undefined && time !== undefined){
            console.log("undif")
            nuts.destroy();
            time.destroy();
          }
            console.log("chart")
             nuts = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: [
                  'NORMAL',
                  'LFI',
                  'SQLI',
                  'COMINJ',
                  'XSS',
                ],
                datasets: [{
                  data: [
                    ia.stats.NORMAL,
                    ia.stats.LFI,
                    ia.stats.SQLI,
                    ia.stats.CMDINJ,
                    ia.stats.XSS
                  ],
                }]
              },
              options: {
                plugins: {
                  legend: {
                    display: true,
                    position: 'right'
                  },
                  tooltip: {
                    boxPadding: 5
                  }
                }
              }
            });

            /* graph X Y */

            
            time = new Chart(ctv, {
              type: 'bar',
              data: {
                labels: [
                  'NORMAL',
                  'LFI',
                  'SQLI',
                  'COMINJ',
                  'XSS',
                ],
                datasets: [{
                  data: [
                    ia.stats.NORMAL,
                    ia.stats.LFI,
                    ia.stats.SQLI,
                    ia.stats.CMDINJ,
                    ia.stats.XSS
                  ],
                  backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 205, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                  ],
                  borderColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                  ],
                  borderWidth: 1
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
            });
          
        }else{
          alert("Enable to load chart data");
        }
      },
      error: function(err){
  
      }
     });


    
   });

});

  const ctx = document.getElementById('myChart2')
  const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        'NORMAL',
        'ANOMALY',
      ],
      datasets: [{
        data: [
          6,
          21
        ],
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'right'
        },
        tooltip: {
          boxPadding: 0
        }
      }
    }
  })
