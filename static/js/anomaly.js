(() => {
    'use strict'
    feather.replace({ 'aria-hidden': 'true' })
  })()  
  
  $(document).ready( function () {
    $('#mytable').DataTable();
  } );
  let table = new DataTable('#mytable', {
  });
  
  