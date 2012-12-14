
var parties = [
  {name: 'העבודה', side: 'left', pages: [{name: "שלי יחימוביץ'", id: 162319074217}]},
  {name: 'יש עתיד', side: 'left', pages: [{name: 'יאיר לפיד', id: 107836625941364}]},
  {name: 'מרצ', side: 'left', pages: [{name: 'זהבה גלאון', id: 115028251920872}]},
  {name: 'התנועה', side: 'left', pages: [{name: 'ציפי לבני', id: 37665519437}, {name: 'עמיר פרץ', id: 154570404606299}]},
  {name: 'הליכוד ביתנו', side: 'right', pages: [{name: 'בנימין נתניהו', id: 268108602075}, {name: 'אביגדור ליברמן', id: 178433145502975}]},
  {name: 'הבית היהודי', side: 'right',pages: [{name: 'נפתלי בנט', id: 396697410351933}]},
  {name: 'ש"ס', side: 'right', pages: [{name: 'אלי ישי', id: 137409609701165}]},
  {name: 'חד"ש', side: 'left', pages: [{name: 'דב חנין', id: 295104730523499}]},
  {name: 'עוצמה לישראל', side: 'right', pages: [{name: 'אריה אלדד', id: 149782518386564}]}
]

function showVotes()
{
  getVotesData(function(data) {
    showVotesData(data)
  })

  buildLeftRight()
}

function buildLeftRight() {
  for (var p in parties) {    
    var party = parties[p]
    var div = $(party.side=="left"?"#left":"#right")    

    for (var s in party.pages) {
      var person = party.pages[s]
      div.append("<h4>חברים שאוהבים את "+person.name+":</h4>")
      //div.append('<iframe src="//www.facebook.com/plugins/facepile.php?href=http%3A%2F%2Fwww.facebook.com%2F'+person.id+'&amp;action&amp;size=large&amp;max_rows=5&amp;width=500&amp;colorscheme=light&amp;appId=123092357853018" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:340px;" allowTransparency="true"></iframe>');      

      div.append('<fb:facepile href="http://www.facebook.com/'+person.id+'" size="large" max_rows="4" width="400" colorscheme="dark" s></fb:facepile>')
      div.append('<br />')
    } 

  }

  FB.XFBML.parse();   
}

function showVotesData(data) {
  var chart;
  
  
  /**
 * Gray theme for Highcharts JS
 * @author Torstein Hønsi
 */

Highcharts.theme = {
   colors: ["#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee",
      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
   chart: {
      backgroundColor: {
         linearGradient: [0, 0, 0, 400],
         stops: [
            [0, 'rgb(96, 96, 96)'],
            [1, 'rgb(16, 16, 16)']
         ]
      },
      borderWidth: 0,
      borderRadius: 15,
      plotBackgroundColor: null,
      plotShadow: false,
      plotBorderWidth: 0
   },
   title: {
      style: {
         color: '#FFF',
         fontWeight: 'bold',
         font: '28px Arial, Helvetica, sans-serif'         
      }
   },
   subtitle: {
      style: {
         color: '#DDD',
         font: '16px Arial, Helvetica, sans-serif'
      }
   },
   xAxis: {
      gridLineWidth: 0,
      lineColor: '#999',
      tickColor: '#999',
      labels: {
         style: {
            color: '#999',
            fontWeight: 'bold',
            font: '17px Arial, Helvetica, sans-serif'       
         }
      },
      title: {
         style: {
            color: '#AAA',
            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
         }
      }
   },
   yAxis: {
      alternateGridColor: null,
      minorTickInterval: null,
      gridLineColor: 'rgba(255, 255, 255, .1)',
      lineWidth: 0,
      tickWidth: 0,
      labels: {
         style: {
            color: '#999',
            fontWeight: 'bold'
         }
      },
      title: {
         style: {
            color: '#AAA',
            font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
         }
      }
   },
   legend: {
      itemStyle: {
         color: '#CCC'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#333'
      }
   },
   labels: {
      style: {
         color: '#CCC'         
      }
   },
   tooltip: {
      backgroundColor: {
         linearGradient: [0, 0, 0, 50],
         stops: [
            [0, 'rgba(96, 96, 96, .8)'],
            [1, 'rgba(16, 16, 16, .8)']
         ]
      },
      borderWidth: 0,
      style: {
         color: '#FFF'
      }
   },

   plotOptions: {
      line: {
         dataLabels: {
            color: '#CCC'
         },
         marker: {
            lineColor: '#333'
         }
      },
      spline: {
         marker: {
            lineColor: '#333'
         }
      },
      scatter: {
         marker: {
            lineColor: '#333'
         }
      },
      candlestick: {
         lineColor: 'white'
      }
   },

   toolbar: {
      itemStyle: {
         color: '#CCC'
      }
   },

   navigation: {
      buttonOptions: {
         backgroundColor: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#606060'],
               [0.6, '#333333']
            ]
         },
         borderColor: '#000000',
         symbolStroke: '#C0C0C0',
         hoverSymbolStroke: '#FFFFFF'
      }
   },

   exporting: {
      buttons: {
         exportButton: {
            symbolFill: '#55BE3B'
         },
         printButton: {
            symbolFill: '#7797BE'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
         stroke: '#000000',
         style: {
            color: '#CCC',
            fontWeight: 'bold'
         },
         states: {
            hover: {
               fill: {
                  linearGradient: [0, 0, 0, 20],
                  stops: [
                     [0.4, '#BBB'],
                     [0.6, '#888']
                  ]
               },
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: {
                  linearGradient: [0, 0, 0, 20],
                  stops: [
                     [0.1, '#000'],
                     [0.3, '#333']
                  ]
               },
               stroke: '#000000',
               style: {
                  color: 'yellow'
               }
            }
         }
      },
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(16, 16, 16, 0.5)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      }
   },

   scrollbar: {
      barBackgroundColor: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
      barBorderColor: '#CCC',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: {
            linearGradient: [0, 0, 0, 20],
            stops: [
               [0.4, '#888'],
               [0.6, '#555']
            ]
         },
      buttonBorderColor: '#CCC',
      rifleColor: '#FFF',
      trackBackgroundColor: {
         linearGradient: [0, 0, 0, 10],
         stops: [
            [0, '#000'],
            [1, '#333']
         ]
      },
      trackBorderColor: '#666'
   },

   // special colors for some of the demo examples
   legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
   legendBackgroundColorSolid: 'rgb(70, 70, 70)',
   dataLabelsColor: '#444',
   textColor: '#E0E0E0',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);


var colors = Highcharts.getOptions().colors;



  var categories = []
  data.forEach(function(item) {
    categories.push(item.name)
  })

  for (var i in data)
    data[i].color = "#335C07"//colors[i]

  function setChart(name, categories, data, color) {
    chart.xAxis[0].setCategories(categories, false);
    chart.series[0].remove(false);
    chart.addSeries({
      name: name,
      data: data,
      showInLegend: false,
      color: color || 'white'
    }, false);
    chart.redraw();
  }

  chart = new Highcharts.Chart({
    chart: {
      renderTo: 'visualization',
      type: 'column'
    },
    title: {
      text: 'סקר בחירות 2013'
    },
    subtitle: {
      //text: 'למי החברים שלך עשו לייק?'
    },
    xAxis: {
      categories: categories
    },
    yAxis: {
      title: {
        text: ''
      }
    },
    plotOptions: {
      column: {
        cursor: 'pointer',

        dataLabels: {
          enabled: true,
          color: colors[0],
          style: {
            fontWeight: 'bold'
          },
          formatter: function() {
            return this.y;
          }
        }
      }
    },            
    series: [{
      name: name,
      data: data,
      color: 'white',
      showInLegend: false
    }],
    exporting: {
      enabled: false
    }
  });
}

function makeResultsArray(hash) {
  var res = [];

  for (var p in hash)    
    res.push({name: p, y: hash[p]}) 

  
  res.sort(function(a,b) {
    return a.y-b.y
  })

  return res;
}


function getVotesData(cba) {

  var ids = ""
  var page_hash = {}
  var first = true
  parties.forEach(function(party) {
    party.pages.forEach(function(page) {
      page_hash[page.id] = party.name
      if (!first) ids+= ","
        first = false
      ids += page.id
    })
  })

  var q1 = "SELECT page_id, uid FROM page_fan WHERE uid in (select uid1 from friend where uid2 = me()) and page_id in ("+ids+")"
  var q2 = "SELECT uid, first_name, last_name from user WHERE uid in (SELECT uid FROM #query1)"

  FB.api('/fql', {q:{"query1": q1,"query2":q2}}, 
    function(data) {
                    
        var results = {}
        for (var p in parties)
          results[parties[p].name] = 0        
        data.data[0].fql_result_set.forEach(function(vote) {
          results[page_hash[vote.page_id]] = results[page_hash[vote.page_id]] + 1
        })

        var result_array = makeResultsArray(results)
        cba(result_array)
      })

}

