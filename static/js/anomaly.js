(() => {
  'use strict'
  feather.replace({ 'aria-hidden': 'true' })
})()

$(document).ready( function () {

   const fileDropDown = $('#filedropdown');
   var anomaly;

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

   anomaly = $('#anomaly').DataTable({
    ajax: {
      url: "/api/ia/conflit/prod_logs.txt",
      type: "GET",
      dataSrc: "predictions"
    },
    dom: 'Bfrtip',
    buttons: [
        'csv', 'excel'
    ],
    columns: [
      {'data': 'id','width': '5%'},
      {'data': 'ip','width': '5%'},
      {'data': 'date','width': '15%'},
      {'data': 'url','width': '40%'},
      {'data': 'user_agent','width': '25%'},
      {'data': 'prediction','width': '25%'},
      {'data': 'cluster','width': '25%'},
    ]
  });

  fileDropDown.on("change",function(e){
    API_PATH = "/api/ia/conflit/"+fileDropDown.val();
    if (anomaly !== undefined){
      anomaly.destroy();
    }

    anomaly = $('#anomaly').DataTable({
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
        {'data': 'ip','width': '5%'},
        {'data': 'date','width': '15%'},
        {'data': 'url','width': '40%'},
        {'data': 'user_agent','width': '25%'},
        {'data': 'prediction','width': '25%'},
        {'data': 'cluster','width': '25%'},
      ]
    });

  });

});
