var reload = function() {
  drawGraph("game-enjoyment",                "Average Opinion of Fun");
  drawGraph("game-duration",                 "Average Opinion of Duration");
  drawGraph("game-engagement",               "Average Opinion of Engagement");
  drawGraph("game-price",                    "Average Opinion of Price");
  drawMetric("game-enjoyment");
  drawMetric("game-duration");
  drawMetric("game-engagement");
  drawMetric("game-price");

  drawGraph("rules-understandability",       "Average Opinion of Rulebook Text");
  drawGraph("rules-cardUnderstandability",   "Average Opinion of Card Text");
  drawGraph("rules-reminders",               "Average Opinion of Reminder Cards");
  drawMetric("rules-understandability");
  drawMetric("rules-cardUnderstandability");
  drawMetric("rules-reminders");

  drawGraph("map-dilemma-a",                  "Reported action of map");
  drawGraph("map-dilemma-b",                  "Reported action of map");
  drawGraph("map-dilemma-c",                  "Reported action of map");
  drawGraph("map-dilemma-d",                  "Reported action of map");
  drawMetric("map-dilemma-a");
  drawMetric("map-dilemma-b");
  drawMetric("map-dilemma-c");
  drawMetric("map-dilemma-d");

  drawMultigraph("role-preferred",            "Preferred Roles",
    ["Captain", "Admiral", "First Mate", "Lieutenant", "Old Salt", "Officer", "Swindler", "Quartermaster", "Looter", "Smuggler", "Thug",
    "Weaponsmith", "Cabin Boy", "Gambler", "Conscript", "Parrot", "Mutineer", "Sovereign"]);
  drawMetric("role-preferred-comments");

  drawMultigraph("role-disfavored",            "Disfavored Roles",
    ["Captain", "Admiral", "First Mate", "Lieutenant", "Old Salt", "Officer", "Swindler", "Quartermaster", "Looter", "Smuggler", "Thug",
    "Weaponsmith", "Cabin Boy", "Gambler", "Conscript", "Parrot", "Mutineer", "Sovereign"]);
  drawMetric("role-disfavored-comments");

  drawMultigraph("loot-pivotal",               "Preferred Scoring Methods",
    ["Grog/Limes", "Instruments", "Snuff", "Doubloons", "Jewelry", "Curios", "Trade Goods", "Maps" "Spyglass", "Scrimshaw", "Daggers", "Unknown"]);
  drawMetric("loot-pivotal-comments");

  drawMultigraph("loot-ineffectual",            "Disfavored Scoring Methods",
    ["Grog/Limes", "Instruments", "Snuff", "Doubloons", "Jewelry", "Curios", "Trade Goods", "Maps" "Spyglass", "Scrimshaw", "Daggers", "Unknown"]);
  drawMetric("loot-ineffectual-comments");

  drawMultiAvgGraph("role-rating",            "Average Role Ratings",
    ["Captain", "Admiral", "First Mate", "Lieutenant", "Old Salt", "Officer", "Swindler", "Quartermaster", "Looter", "Smuggler", "Thug",
    "Weaponsmith", "Cabin Boy", "Gambler", "Conscript", "Parrot", "Mutineer", "Sovereign"]);
  drawMetric("role-ratings-comments");

  drawMultiAvgGraph("loot-rating",            "Average Loot Ratings",
    ["Grog/Limes", "Instruments", "Snuff", "Doubloons", "Jewelry", "Curios", "Trade Goods", "Maps", "Scrimshaw", "Daggers"]);
  drawMetric("loot-ratings-comments");

  drawUniqueMetric("misc-feedback",         "Other Feedback");
  drawUniqueMetric("name",                  "Names");
}

Keen.ready(function(){
  reload();
});
/* ********************
** FILTERS
** *******************/

var createFilter = function(value) {
  if (value == "none") {
    return {
      "property_name": "roles.value",
      "operator": "ne",
      "property_value": "none"
    }
  } else {
    return {
      "property_name": "roles.value",
      "operator": "eq",
      "property_value": value
    }
  }
}

var filter_rank1 = createFilter('none'),
    filter_rank2 = createFilter('none'),
    filter_rank3 = createFilter('none'),
    filter_rank4 = createFilter('none'),
    filter_rank5 = createFilter('none'),
    filter_rank6 = createFilter('none'),
    filter_rank7 = createFilter('none'),
    filter_rank8 = createFilter('none'),
    filter_rank9 = createFilter('none');


var queryFilters = function(property_name) {
  return  [filter_rank1, filter_rank2, filter_rank3, filter_rank4, filter_rank5,
           filter_rank6, filter_rank7, filter_rank8, filter_rank9,
           {
              "property_name": property_name,
              "operator": "exists",
              "property_value": true
          }
          ];
}

$('input[type=radio][name=rank1]').on('change', function() {
  filter_rank1 = createFilter($(this).val());
  reload();
});
$('input[type=radio][name=rank2]').on('change', function() {
  filter_rank2 = createFilter($(this).val());
  reload();
});
$('input[type=radio][name=rank3]').on('change', function() {
  filter_rank3 = createFilter($(this).val());
  reload();
});
$('input[type=radio][name=rank4]').on('change', function() {
  filter_rank4 = createFilter($(this).val());
  reload();
});
$('input[type=radio][name=rank5]').on('change', function() {
  filter_rank5 = createFilter($(this).val());
  reload();
});
$('input[type=radio][name=rank6]').on('change', function() {
  filter_rank6 = createFilter($(this).val());
  reload();
});
$('input[type=radio][name=rank7]').on('change', function() {
  filter_rank7 = createFilter($(this).val());
  reload();
});
$('input[type=radio][name=rank8]').on('change', function() {
  filter_rank8 = createFilter($(this).val());
  reload();
});
$('input[type=radio][name=rank9]').on('change', function() {
  filter_rank9 = createFilter($(this).val());
  reload();
});


/* ***********************
// SUITE
** **********************/
var suite = "feedback submission";

/* ***********************
// METRIC HANDLER
** **********************/
var drawMetric = function(key) {
  var chart = new Keen.Dataviz();
  chart
    .el(document.getElementById("viz-"+key+"-comments"))
    .chartType("metric")
    //.chartOptions({legend: { position: "none" },})
    .height(75)
    .colors(["#49c5b1"])
    .prepare();

  var query = new Keen.Query("count", {
    eventCollection: suite,
    filters: queryFilters(key + ".comments"),
    //group_by: "game-players.value",
    targetProperty: key + ".comments",
    timeframe: "this_1_years",
    maxAge: 900
  });

  var req = client.run(query, function(err, res){
      console.log(this)
      if (err || this.data.result == null) {
          document.getElementById("viz-"+key).innerHTML =
              "<div class='keen-widget keen-metric keen-metric-nodata'>"
            +   "<span class='keen-metric-title'>"
            +     "No feedback found"
            +   "</span>"
            +   "<div class='keen-metric-value'>"
            +     "?"
            +   "</div>"
            +   "<span class='keen-metric-title'>"
            +     "comments"
            +   "</span>"
            + "</div>";
      } else {
        chart
          .parseRequest(this)
          .title("comments")
          .render();
      }
    });

}

/* ***********************
// UNIQUE METRIC HANDLER
** **********************/
var drawUniqueMetric = function(key, title) {
  var chart = new Keen.Dataviz();
  chart
    .el(document.getElementById("viz-"+key))
    .chartType("metric")
    //.chartOptions({legend: { position: "none" },})
    .height(75)
    .colors(["#49c5b1"])
    .prepare();

  var query = new Keen.Query("count_unique", {
    eventCollection: suite,
    filters: queryFilters(key),
    //group_by: "game-players.value",
    targetProperty: key,
    timeframe: "this_1_years",
    maxAge: 900
  });

  var req = client.run(query, function(err, res){
      console.log(this)
      if (err || this.data.result == null) {
          document.getElementById("viz-"+key).innerHTML =
              "<div class='keen-widget keen-metric keen-metric-nodata'>"
            +   "<span class='keen-metric-title'>"
            +     "No feedback found"
            +   "</span>"
            +   "<div class='keen-metric-value'>"
            +     "?"
            +   "</div>"
            +   "<span class='keen-metric-title'>"
            +     "comments"
            +   "</span>"
            + "</div>";
      } else {
        chart
          .parseRequest(this)
          .title(title)
          .render();
      }
    });

}

/* ***********************
// GRAPH HANDLER
** **********************/
var drawGraph = function(key, title) {
  var chart = new Keen.Dataviz();
  chart
    .el(document.getElementById("viz-"+key))
    .chartType("columnchart")
    .chartOptions({legend: { position: "none" },})
    .height(125)
    .colors(["#49c5b1"])
    .prepare();

  var query = new Keen.Query("average", {
    eventCollection: suite,
    filters: queryFilters(key + ".value"),
    group_by: "game-players.value",
    targetProperty: key + ".value",
    timeframe: "this_1_years",
    maxAge: 900
  });

    var req = client.run(query, function(err, res){
      console.log(this)
      if (err || this.data.result == null) {
          document.getElementById("viz-"+key).innerHTML =
              "<div class='keen-widget keen-metric keen-metric-nodata'>"
            +   "<span class='keen-metric-title'>"
            +     "No feedback found"
            +   "</span>"
            +   "<div class='keen-metric-value'>"
            +     "?"
            +   "</div>"
            +   "<span class='keen-metric-title'>"
            +     title
            +   "</span>"
            + "</div>";
      } else {
        chart
          .parseRequest(this)
          .title(title)
          .render();
      }
    });
}


/* ***********************
// MULTIGRAPH HANDLER
** **********************/
var drawMultigraph = function(key, title, subchannels) {
  var chart = new Keen.Dataviz();
  chart
    .el(document.getElementById("viz-"+key))
    .chartType("columnchart")
    .chartOptions({legend: { position: "none" },})
    .height(250)
    .colors(["#49c5b1"])
    .prepare();

  var query = [];

  for(sc in subchannels) {
    query.push(new Keen.Query("count", {
      eventCollection: suite,
      filters: queryFilters(key+"."+subchannels[sc]),
      group_by: key+"."+subchannels[sc],
      //targetProperty: key + ".value",
      timeframe: "this_1_years",
      maxAge: 900
    }));
  }

    var req = client.run(query, function(err, res){
      console.log(this)
      if (err) {
          document.getElementById("viz-"+key).innerHTML =
              "<div class='keen-widget keen-metric keen-metric-nodata'>"
            +   "<span class='keen-metric-title'>"
            +     "No feedback found"
            +   "</span>"
            +   "<div class='keen-metric-value'>"
            +     "?"
            +   "</div>"
            +   "<span class='keen-metric-title'>"
            +     title
            +   "</span>"
            + "</div>";
      } else {

        var compositeData = {result:[]};
        for (i = 0; i < res.length; i++) {
          if(res[i].result[0] != null) {
            //compositeData.result.push(res[i].result[0]);
            var ta = Object.keys(res[i].result[0]);
            ta.splice(ta.indexOf("result"),1);
            var name = ta[0];
            compositeData.result.push({
              name: res[i].result[0][name],
              result: res[i].result[0].result
            });
          }
        }

        chart
          .parseRawData(compositeData )
          //.parseRequest(this)
          .title(title)
          .render();
      }
    });
}


/* ***********************
// MULTI-AVERAGE-GRAPH HANDLER
** **********************/
var drawMultiAvgGraph = function(key, title, subchannels) {
  var chart = new Keen.Dataviz();
  chart
    .el(document.getElementById("viz-"+key))
    .chartType("columnchart")
    .chartOptions({legend: { position: "none" },})
    .height(250)
    .colors(["#49c5b1"])
    .prepare();

  var query = [];

  for(sc in subchannels) {
    query.push(new Keen.Query("average", {
      eventCollection: suite,
      filters: queryFilters(key+"."+subchannels[sc]),
      group_by: key+"."+subchannels[sc],
      targetProperty: key+"."+subchannels[sc],
      timeframe: "this_1_years",
      maxAge: 900
    }));
  }

    var req = client.run(query, function(err, res){
      console.log(this)
      if (err) {
          document.getElementById("viz-"+key).innerHTML =
              "<div class='keen-widget keen-metric keen-metric-nodata'>"
            +   "<span class='keen-metric-title'>"
            +     "No feedback found"
            +   "</span>"
            +   "<div class='keen-metric-value'>"
            +     "?"
            +   "</div>"
            +   "<span class='keen-metric-title'>"
            +     title
            +   "</span>"
            + "</div>";
      } else {

        var compositeData = {result:[]};
        for (i = 0; i < res.length; i++) {
          if(res[i].result[0] != null) {
            //compositeData.result.push(res[i].result[0]);
            var ta = Object.keys(res[i].result[0]);
            ta.splice(ta.indexOf("result"),1);
            var name = ta[0].substr(ta[0].indexOf('.')+1);
            compositeData.result.push({
              name: name,
              result: res[i].result[0].result
            });
          }
        }

        chart
          .parseRawData(compositeData )
          //.parseRequest(this)
          .title(title)
          .render();
      }
    });
}
