
//barChart directive takes d3 factory as a dependecy to allow use of d3 library stored in d3.js factory
angular.module('rolliePollie.rollieDir')
.directive( 'pieChart', ['d3', function(d3) {
  return {
    
    restrict: 'EA',                                                           //It is restricted to instantiation as an element - a regular html tag  or an attribute of a tag
    
    scope: {                                                                  //An isolated scope is set for the directive to utilise. Data variable is bound bi-directionally between
      data: "=",                                                              //local and parent scope
      label: "@"                                                              //label var is bound to a local string using @ making the outer scope available to directives isolated one
      
    },
    
    link: function(scope, iElement, iAttrs) {
      
      var width = 300;
      var height = 500;
      var radius = Math.min(width, height) /2;

        //data to be used for the chart
        var data = scope.data;
   
        //data for colours to be used for the pie chart. Constructs a new ordinal scale with output range  specified.
        var color = d3.scale.category20b();

        var nested = d3.nest()
            .key(function(d) {
                return d.votes;
            })
            .entries(scope.data);

        //creates an arc of an svg(scalable vector object)
        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(110);

        var pie = d3.layout.pie()
            .value(function(d) {
                return d.votes;
            })
            .sort(null);

        //code to create an svg object, d3 selects the body tag and appends(adds) svg tag and attribute tags for size
        var svg = d3.select(iElement[0])
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("display", "block")
            .style("margin", "auto")
            .append("g")
            .attr("transform", "translate(" + width /2 +  "," + height/2 + ")" );

        var slice_group = svg.datum(nested[0].values).selectAll("path")
            .data(pie(scope.data))
            .enter()
            .append("g")

        var slice_path = slice_group.append("path")
            .attr("fill", function (d, i){
                return color(i);
            })
            .attr("d", arc)
            .each(function (d){
                this._current = d;
            })

        var label = slice_group.append("g")
            .attr("transform", function (d, i) {
                
                var c = arc.centroid(d);
                return "translate(" + c[0] + "," + c[1] +")";
            })
        
        var line1 = label.append("text")
            .text(function (d, i) {
                return d[scope];
            })
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")

        var line2 = label.append("text")
            .text(function (d,i) {
                return d[scope.data[i].text];
                console.log(scope.data[i]);
            })
            
            .attr("dy", "1.6em")
            .attr("text-anchor", "middle");
              console.log(scope.data[0].text);
        //switch data
        // d3.selectAll("input")
        //     .on("change", change);

        }
      }
    }
     ]);