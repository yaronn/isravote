var x;

var parties = [
  {name: 'העבודה', side: 'left', pages: [{name: "שלי יחימוביץ'", id: 162319074217}]},
  {name: 'יש עתיד', side: 'left', pages: [{name: 'יאיר לפיד', id: 107836625941364}]},
  {name: 'מרצ', side: 'left', pages: [{name: 'זהבה גלאון', id: 115028251920872}, {name: 'ניצן הורוביץ', id: 66398526339}]},
  {name: 'התנועה', side: 'left', pages: [{name: 'ציפי לבני', id: 37665519437}, {name: 'עמיר פרץ', id: 154570404606299}]},
  {name: 'הליכוד ביתנו', side: 'right', pages: [{name: 'בנימין נתניהו', id: 268108602075}, {name: 'אביגדור ליברמן', id: 178433145502975}]},
  {name: 'הבית היהודי', side: 'right',pages: [{name: 'נפתלי בנט', id: 396697410351933}]},
  {name: 'ש"ס', side: 'right', pages: [{name: 'אלי ישי', id: 137409609701165}]},
  {name: 'חד"ש', side: 'left', pages: [{name: 'דב חנין', id: 295104730523499}]},
  {name: 'עוצמה לישראל', side: 'right', pages: [{name: 'אריה אלדד', id: 149782518386564}]}
]

var page_names_by_id = buildPageNamesHash(parties)

var comments = [
  "קצת מצחיק, לא?",
  "קצת עצוב, לא?",
  "לפני שבוחרים ראש ממשלה אולי כדאי גם לבחור חברים...?",
  "לא נגענו.",
  "שמעת פעם על כפתור אנפריינד?"
]

function trackEvent(category, action, label) {
    if (window._gaq !== undefined) {
      _gaq.push(['_trackEvent', category, action, label])
    }
}



function showVotes()
{

  $("#login").hide()
  $("#waiting").show()

  FB.api('/me', function(response) {
    $("#first_name").text(response.first_name)
    trackEvent("user", "login", JSON.stringify(response))
  });

  $("#comment").text(comments[Math.floor(Math.random()*(comments.length-1))])

  //data = [{name: 'avoda', votes: 10}]
  getVotesData(function(parties_results, pages_results) {    
    showVotesData(parties_results)
    buildFriendDetails(pages_results)
    $("#waiting").hide()
    $("#main").show()
  })
  
}

function buildPageNamesHash(parties) {
  var res = {}
  for (var p in parties) {
    var party = parties[p]
    for (var pg in party.pages) {
      var page = party.pages[pg]
      res[page.id] = page.name
    }
  }
  return res
}

function buildFriendDetails(pages_results) {
  
  var div = $("#friends")      

  for (var p in pages_results) {    
    var page = pages_results[p] 
    div.append("<h5 style='margin-top: 0px; margin-bottom: 5px'>חברים שאוהבים את " + page_names_by_id[page.name] + "</h5>")      
    div.append('<fb:facepile href="http://www.facebook.com/'+page.name+'" size="large" max_rows="12" width="400" colorscheme="light" s></fb:facepile>')      
    div.append('<hr />')
    }

  FB.XFBML.parse();   
}

function showVotesData(parties_results) {

  var margin = {top: 20, right: 5, bottom: 30, left: 5},
      width = 550 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      
  var svg = d3.select("#visualization").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  x.domain(parties_results.map(function(d) { return d.name; }));
  y.domain([0, d3.max(parties_results, function(d) { return d.votes; })+5]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
   
  svg.selectAll(".bar")
      .data(parties_results)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.votes); })
      .attr("height", function(d) { return height - y(d.votes); })
    
  svg.selectAll("span")
    .data(parties_results)
    .enter().append("text")      
      .text(function(d) { return d.votes })      
      .attr("x", function(d) { return x(d.name) + x.rangeBand()/2 - 5  })  
      .attr("y", function(d) { return y(d.votes) -10 });                

}

function makeResultsArray(hash) {
  var res = [];

  for (var p in hash)    
    res.push({name: p, votes: hash[p]}) 

  
  res.sort(function(a,b) {
    return a.votes-b.votes
  })

  return res;
}


function getVotesData(cba) {

  var ids = ""
  var page_hash = {}
  var first = true
  for (var i=0; i<parties.length; i++) {
    var party = parties[i]  
    for (var j=0; j<party.pages.length; j++) {
      var page = party.pages[j]    
      page_hash[page.id] = party.name
      if (!first) ids+= ","
        first = false
      ids += page.id
    }
  }

  var q1 = "SELECT page_id, uid FROM page_fan WHERE uid in (select uid1 from friend where uid2 = me()) and page_id in ("+ids+")"
  //var q2 = "SELECT uid, first_name, last_name from user WHERE uid in (SELECT uid FROM #query1)"

  FB.api('/fql', {q:{"query1": q1/*,"query2":q2*/}}, 
    function(data) {
                    
        var results_by_party = {}
        for (var p in parties)
          results_by_party[parties[p].name] = 0        

        var arr = data.data[0].fql_result_set
        x = arr
        var results_by_page = {}        
        for (var i=0; i<arr.length; i++) {
          var vote = arr[i]
          results_by_party[page_hash[vote.page_id]] = results_by_party[page_hash[vote.page_id]] + 1

          if (!results_by_page[vote.page_id])
            results_by_page[vote.page_id] = 0;
          results_by_page[vote.page_id]++;          
        }

        var parties_results_array = makeResultsArray(results_by_party)        
        trackEvent("election", "anonymous_results", JSON.stringify(parties_results_array))
        var pages_results_array = makeResultsArray(results_by_page)
        pages_results_array.reverse()        
        cba(parties_results_array, pages_results_array)
      })

}

