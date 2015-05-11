
//barChart directive takes d3 factory as a dependecy to allow use of d3 library stored in d3.js factory
angular.module('rolliePollie.rollieDir')
.directive( 'barChart', ['d3', function(d3) {
  return {

    restrict: 'EA',                                             //It is restricted to instantiation as an element - a regular html tag  or an attribute of a tag
    scope: {
      data: "=",                                                //An isolated scope is set for the directive to utilise. Data variable is bound bi-directionally between
      label: "@"                                                //local and parent scope
                                                                //label var is bound to a local string using @ making the outer scope available to directives isolated one
    },
      link: function(scope, iElement, iAttrs) {                 //Link option                   
          var svg = d3.select(iElement[0])                      //SVG var selects element[0] - the element that the directive is called within
          .append("svg")
          .attr("width", "100%");



          // on window resize, re-render d3 canvas
          window.onresize = function() {                        //If the window is resized the function is called that reprocesses all the scope watchers
            return scope.$apply();                              //ie the directive is reprocessed
          };
          scope.$watch(function(){                              //Creating a function that monitors the scope for changes and then re renders the svg
            return angular.element(window)[0].innerWidth;       //based on the new innerWidth of the window element  
          }, function(){
            return scope.render(scope.data);
            
          }
          );

          scope.render = function(data){                        
              // remove all previous items before render
              svg.selectAll("*").remove();

              var width = d3.select(iElement[0])[0][0].offsetWidth - 1;
                // 20 is for margins and can be changed
                var height = scope.data.length * 35;
                // 35 = 30(bar height) + 5(margin between bars)
                var max = 98;
                              
              // set the height based on the calculations above
              svg.attr('height', height);

              
              svg.selectAll("svg")                                 //Traverse the DOM and store all "svg" objects in selection
              .data(data)                                          //Joins the data array from the scope to the selection of svgs
              .enter()                                             //Opens placeholders to assign nodes to each element in the selection array 
              .append("rect")                                      //Appends new rect to each element in selection and returns new selection with appended
              .attr("height", 30)                                  //Height of each bar
              .attr("width", 0)                                    //Initial width of 0 to allow for transition to actual value
              .attr("x", 10)                                       //Set "x" position of rect elements within svg                                       
              .attr("y", function(d, i){                           //Y pos of rect elements is set as function containing the votes 
                    return i * 35;
                                      })

              .on("mouseover", function(d, i){                     //MouseOver event that selects body elements                   
                  return d3.select("body")                         //
                    .append("div")                                 //Appends div with class mike that appears with
                    .attr('class', 'mike' + i)                     //datas votes number 
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "visible")
                    .text("Votes " + d.votes);
                 })
                .on("mousemove", function(d, i){                  //On MouseMove the appended div is set
                  return d3.select(".mike" + i)                   
                  .style("top", (event.pageY+5)+"px")           
                  .style("left",(event.pageX+20)+"px");           //div sits beside pointer
                  })         
                .on("mouseout", function(d, i){                   //On MouseOut event the .mike class is removed from the markup
                  return d3.select(".mike"+i).remove()
                })                                          
              .transition()                                        //Set transition to interpolate from initial "0" width to data.votes                                      
              .duration(1000)                                      //Duration of transition in ms
              .attr("width", function(d){
                    return d.votes/(max/width)*20;                    // Width based on custom scale
                                        }); 

                    svg.selectAll("text")                          //Traverse DOM and add text elements from data array
                    .data(data)
                    .enter()                                      
                    .append("text")
                    .attr("fill", "#fa9007")                       //Color of text 
                    .attr("y", function(d, i){return i * 35 + 22;})
                    .attr("x", 15)
                    .text(function(d){return d[scope.label];});    //Set text labels to scope label value which is "text" field of poll object

          }
    }
  }
}]);