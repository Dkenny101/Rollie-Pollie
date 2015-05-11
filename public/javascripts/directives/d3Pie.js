
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
      
      var data = scope.data;
      var width = 300;
      var height = 700;
      var center = [width/2, height/2];   
      var radius = Math.min(width, height) / 2;
      var color = d3.scale.ordinal()
          .range(['#3471c5','#60c535','#fa7402','#07faf8','#fa9007','#f0152f','#9034c5']);
      var r;
      var innerRadius;
      var outerRadius;
    
      var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(110)
      

      //This layout creates a 
           var pie = d3.layout.pie()
           .value(function(d) { return d.votes; })
           .sort(null);

      var svg = d3.select(iElement[0])
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("margin", "auto")
      .style("margin-top", "-150px")
      .append("g")
      .attr("transform", "translate(" + width/2 + ","   + height/2 + ')');


           var path = svg.selectAll('path')
           .data(pie(scope.data))
           .enter().append('path')
           .attr('d', arc)
           .attr('fill', function (d, i) { return color(i); })
           .on("mouseover", function(d, i){                     //MouseOver event that selects body elements                   
                  return d3.select("body")                         //
                    .append("div")                                 //Appends div with class mike that appears with
                    .attr('class', 'mike' + i)                     //datas votes number 
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "visible")
                    .text("Votes " + scope.data[i].votes);
                 })
                .on("mousemove", function(d, i){                  //On MouseMove the appended div is set
                  return d3.select(".mike" + i)                   
                  .style("top", (event.pageY+5)+"px")           
                  .style("left",(event.pageX+20)+"px");           //div sits beside pointer
                  })         
                .on("mouseout", function(d, i){                   //On MouseOut event the .mike class is removed from the markup
                  return d3.select(".mike"+i).remove()
                });

          
         var text =  svg.selectAll("text")
              .data(data)
              .enter()
                .append("text")
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .attr("transform", function(d, i) {
                  
                  var horz = 0;                                   //Translate the text to bottom of the svg container
                  var vert = i*20+190;
                  return "translate(" + horz + "," +vert+  ")";})

                .attr("fill", "#fa9007")
                
                .text(function(d){return d[scope.label];})        //The text of the pie slices are set to the label of scope data
                .style('fill', function (d, i) { return color(i); })
                .style("font-weight", "bold");
         

        }
      }
    }
     ]);