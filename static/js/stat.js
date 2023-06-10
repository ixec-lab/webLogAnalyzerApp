(() => {
    'use strict'
    feather.replace({ 'aria-hidden': 'true' })
})()

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
                      display: true
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
  