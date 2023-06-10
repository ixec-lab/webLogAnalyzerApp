(() => {
  'use strict'
  feather.replace({ 'aria-hidden': 'true' })
})()

$(document).ready( function () {

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

  //  log_table = $('#mytable').DataTable({
  //   ajax: {
  //     url: "/api/ia/prediction/test-log.txt",
  //     type: "GET",
  //     dataSrc: "predictions"
  //   },
  //   dom: 'Bfrtip',
  //   buttons: [
  //       'csv', 'excel'
  //   ],
  //   columns: [
  //     {'data': 'id','width': '5%'},
  //     {'data': 'ip','width': '10%'},
  //     {'data': 'date','width': '15%'},
  //     {'data': 'url','width': '35%'},
  //     {'data': 'user_agent','width': '25%'},
  //     {'data': 'prediction','width': '10%'},
  //   ]
  // });

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
        {'data': 'date','width': '15%'},
        {'data': 'url','width': '35%'},
        {'data': 'user_agent','width': '25%'},
        {'data': 'prediction','width': '10%'},
      ]
    });
    
   });

});
