
var parties = [
  {name: 'labour', pages: [{name: 'shelly', id: 162319074217}]},
  {name: 'atid', pages: [{name: 'lapid', id: 107836625941364}]},
  {name: 'meretz', pages: [{name: 'zehava', id: 115028251920872}]},
  {name: 'hatnua', pages: [{name: 'tzipi', id: 37665519437}]},
  {name: 'likud beitenu', pages: [{name: 'bibi', id: 268108602075}, {name: 'ivet', id: 178433145502975}]},
  {name: 'mafdal', pages: [{name: 'benet', id: 396697410351933}]},
  {name: 'shas', pages: [{name: 'ishai', id: 137409609701165}]},
  {name: 'hadash', pages: [{name: 'khenin', id: 295104730523499}]},
  {name: 'otzma', pages: [{name: 'eldad', id: 149782518386564}]}
]

function showVotes()
{
  getVotesData(function(data) {
    showVotesData(data)
  })
}

function showVotesData(data) {
  var chart;
  
  var colors = Highcharts.getOptions().colors;
  var categories = []
  parties.forEach(function(item) {
    categories.push(item.name)
  })

  for (var i in data)
    data[i].color = colors[i]

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
      text: '2013 Friends Election Restuls'
    },
    subtitle: {
      text: ''
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
    res.push({y: hash[p]}) 

  res.sort(function(a,b) {
    return a[1]-b[1]
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

