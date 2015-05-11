var rolliePollie = angular.module('rolliePollie', ['ui.router', 'd3','rolliePollie.rollieDir']);

//D3 Module Declaration  
angular.module('d3', []);
//Directive Module Declaration with D3 Dependency Injection
angular.module('rolliePollie.rollieDir', ['d3']);


rolliePollie.config([
    '$stateProvider',
    '$urlRouterProvider',
    //bug here fixed spelling error in '$urlRouterProvider'

    function($stateProvider, $urlRouterProvider) {
        //$stateProvider creates a new application state
        //which takes as parameters stateName which is to be unique
        //and stateConfig, which defines the url, which template is to be 
        //used, the angular controller, and in this case the resolve,
        //that injects to the controller
        $stateProvider
        .state('home', {
           url: '/home',
           templateUrl: '/home.html',
           controller: 'ListCtrl',
            //each time the state is called, resolve calls a function
            //in this case the get all function.
           resolve: {
                postPromise: ['polls', function(polls){
                        return polls.getAll();

                        }]
                }

           });
        
        $stateProvider
        .state('polls', {
            url: '/polls/{id}',
            templateUrl: '/polls.html',
            controller: 'PollCtrl',
            resolve: {
                //each time the state is called, resolve calls a function
                //in this case to return a single poll, using the get() method
                poll: ['$stateParams', 'polls', function($stateParams, polls){
                    return polls.get($stateParams.id);
                    console.log($stateParams.id);
                    }]
                }
          });
        
        $stateProvider
        .state('pollsResult', {
            url: '/pollsResult/{id}',
            templateUrl: '/pollsResult.html',
            controller: 'D3Ctrl',
            resolve: {
                poll: ['$stateParams', 'polls', function($stateParams, polls){
                    return polls.get($stateParams.id);
                    
                    }]
                }
          });

        $stateProvider
        .state('allResults', {
            url: '/allResults/{id}',
            templateUrl: '/allResults.html',
            controller: 'AllCtrl',
            resolve: {
                       postPromise: ['polls', function(polls){
                        return polls.getAll();                

                // poll: ['$stateParams', 'polls', function($stateParams, polls){
                //     return polls.get($stateParams.id);
                    
                    }]
                }
          });
        
        $stateProvider
        .state('new', {
            url: '/new',
            templateUrl: '/new.html',
            controller: 'NewCtrl'
            
        });
        //if anything goes wrong, return to home page
        $urlRouterProvider.otherwise('home');
}])
//Angular services.

//When using a factory, we create an object, Add properties to it
//and return the same object. So in the case we have a questio, choice and votes
//when we pass this service/factory into the controller the properties and
//functions will be available through the factory.

rolliePollie.factory('polls', ['$http', function($http){
    var o = {
        polls: [{question: '', choices: [{ text: '', votes: ''}, { text: '', votes: ''}, { text: '', votes: ''}]}]
    };
    
    //to return all the polls in database
    o.getAll = function() {
        //$http is a AJAX request for angular
        return $http.get('/polls').success(function(data){
            angular.copy(data, o.polls);
        });
    };
    
    //to add a poll to the database
    o.create = function(poll) {
        return $http.post('/polls', poll).success(function(data){
            o.polls.push(data);
        });
    };
    
    //to return a single poll
    o.get = function(id) {
        //use a promise instead of success
        //A promise is a placeholder object
        //that represents the result of an async operation
        return $http.get('/polls/' + id).then(function(res){
            return res.data;
        });
    };
    
    //to add a vote
    o.vote = function(pollId, choiceId){
        return $http.put('/polls/' + pollId + '/choices/' + choiceId);
    };

    //return variable
    return o;
    


}]);

//Controllers are JavaScript constructor function. When this is attached to the 
//DOM using directives, it creates a new child scope.
//We use controllers to: Set up the initial state of the scope Object
// and add behaviour to it

//selectCtrl 
rolliePollie.controller('selectCtrl', [
    '$scope',
    'polls',
    function($scope, items){
        $scope.items = ['Pie Chart', 'Bar Chart'];
        $scope.selection = $scope.items[0];
    }]);

rolliePollie.controller('D3Ctrl', [
    '$scope',
    'poll',
    'polls',
    function($scope, poll, polls, votes){
        //Passes array of polls to "polls" variable in scope
       
        //Trying to pass poll votes to scope here
        $scope.votes = poll.choices;
        
        //passes poll object to "poll" var in scope
        $scope.poll = poll;
      
    }

    ]);

//Managing the poll list & homepage
rolliePollie.controller('AllCtrl', [
    '$scope',
    'polls',
    function($scope, polls){
        $scope.polls = polls.polls;
        }
]);


//Managing the poll list & homepage
rolliePollie.controller('ListCtrl', [
    '$scope',
    'polls',
    function($scope, polls){
        //Passes array of polls to "polls" variable in scope
        $scope.polls = polls.polls;
        
    }
]);


//Voting and viewing results
rolliePollie.controller('PollCtrl', [
    '$scope',
    'poll',
    'polls',
    function($scope, poll, polls){
        //passes poll object to "poll" var in scope
        $scope.poll = poll;
        //this is called when the vote btn is pushed
        $scope.addVote = function(){
            var pollId = $scope.poll._id;
            var choiceId = $scope.poll.userVote;
            
            console.log(choiceId);
            console.log(pollId);
            //call vote function in factory and pass 
            polls.vote(pollId, choiceId);
            console.log("vote pressed");
            //alert box to confirm vote has been pressed
            alert("Your Vote has been added :)");
        }
        
        
        
        }]);

//to create a new poll
rolliePollie.controller('NewCtrl', [
    '$scope',
    'polls',
    function($scope, polls) {
        //creates a Poll template
        $scope.poll = {
            question: '',
            choices: [{ text: '', votes: ''}, { text: '', votes: ''}]
        };
        
        //adds extra choice to the poll
        $scope.addChoice = function(){
            $scope.poll.choices.push({ text: '', votes: '' })
            console.log('choice added');
        };
        
        //creates a new poll object
        $scope.addPoll = function(){
            //calls create function from factory to add poll to data base
            polls.create({
                question: $scope.poll.question,
                choices: $scope.poll.choices
            });
            alert("your new poll has been created");
            console.log('poll created');

        }

    }]);