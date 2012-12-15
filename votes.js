
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

var comments = [
  "קצת מצחיק, לא?",
  "קצת עצוב, לא?",
  "לפני שבוחרים ראש ממשלה אולי כדאי גם לבחור חברים...?",
  "לא נגענו.",
  "שמעת פעם על כפתור אנפריינד?"
]

function showVotes()
{
  FB.api('/me', function(response) {
    $("#first_name").text(response.first_name)    
  });

  $("#comment").text(comments[Math.floor(Math.random()*(comments.length-1))])

  //data = [{name: 'avoda', votes: 10}]
  getVotesData(function(data) {    
    showVotesData(data)
  })

  buildFriendDetails()
}

function buildFriendDetails() {
  for (var p in parties) {    
    var party = parties[p]
    var div = $("#friends")    

    for (var s in party.pages) {
      var person = party.pages[s]
      div.append("<h5 style='margin-top: 0px; margin-bottom: 5px'>חברים שאוהבים את "+person.name+"</h5>")      
      div.append('<fb:facepile href="http://www.facebook.com/'+person.id+'" size="large" max_rows="12" width="400" colorscheme="light" s></fb:facepile>')      
      if (p<parties.length-1 || s<party.pages.length-1) 
        div.append('<hr />')
    } 
  }  

  FB.XFBML.parse();   
}

function showVotesData(data) {

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 600 - margin.left - margin.right,
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


  x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d.votes; })+5]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
   
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.votes); })
      .attr("height", function(d) { return height - y(d.votes); })
    
  svg.selectAll("span")
    .data(data)
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
  parties.forEach(function(party) {
    party.pages.forEach(function(page) {
      page_hash[page.id] = party.name
      if (!first) ids+= ","
        first = false
      ids += page.id
    })
  })

  var q1 = "SELECT page_id FROM page_fan WHERE uid in (select uid1 from friend where uid2 = me()) and page_id in ("+ids+")"
  //var q2 = "SELECT uid, first_name, last_name from user WHERE uid in (SELECT uid FROM #query1)"

  FB.api('/fql', {q:{"query1": q1/*,"query2":q2*/}}, 
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

