(() => {
  'use strict'
  feather.replace({ 'aria-hidden': 'true' })
})()

$(document).ready( function () {

   const fileDropDown = $('#filedropdown');
   var log_table;
   var nuts;
   const ctx = $("#mytable");

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
      {'data': 'date','width': '15%'},
      {'data': 'url','width': '40%'},
      {'data': 'user_agent','width': '25%'},
      {'data': 'prediction','width': '25%'},
    ]
  });


    $.ajax({
      url: '/api/ia/predictions/stats/'+fileDropDown.val(),
      type: "GET",
      cache: false,
      success: function(res){
        ia = JSON.parse(res);
  
        if (ia.success){
          
          if (nuts !== undefined){
            console.log("undif")
            nuts.destroy();
          }
            console.log("chart")
             nuts = new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: [
                  'NORMAL',
                  'LFI/RFI',
                  'SQLI',
                  'Comand Injection',
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
                    display: true
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
