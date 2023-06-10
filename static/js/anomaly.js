(() => {
    'use strict'
    feather.replace({ 'aria-hidden': 'true' })
  })()

  // log_table = $('#mytable').DataTable({
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