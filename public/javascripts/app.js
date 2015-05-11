var rolliePollie = angular.module('rolliePollie', ['ui.router']);

rolliePollie.config([
    '$stateProvider',
    '$urlRouterProvider',
    //bug here fixed spelling error

    function($stateProvider, $urlRouterProvider) {
        
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
        .state('poll', {
            url: '/polls/{id}',
            templateUrl: '/polls.html',
            controller: 'PollCtrl',
            reslove: {
                post: ['$stateParams', 'polls', function($stateParams, polls){
                    return polls.get($stateParams.id);
        }]
        }

            });
        
        $stateProvider
        .state('new', {
            url: '/new',
            templateUrl: '/new.html',
            controller: 'NewCtrl'
            
        });
        
        $urlRouterProvider.otherwise('home');
}])
//Angular services.

//When using a factory, we create an object, Add properties to it
//and return the same object. So in the case we have a questio, choice and votes
//when we pass this service/factory into the controller the properties and
//functions will be available through the factory.

rolliePollie.factory('polls', ['$http', function($http){
    var o = {
        polls: [{question: '', choices: [{ text: ''}, { text: ''}, { text: ''}]}]
    };
    
    //to return all the polls in database
    o.getAll = function() {
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
        return $http.get('/polls/' + id).then(function(res){
            return res.data;
        });
    };
    
    return o;
    


}]);

//Controllers are JavaScript constructor function. When this is attached to the 
//DOM using directives, it creates a new child scope.
//We use controllers to: Set up the initial state of the scope Object
// and add behaviour to it

//Managing the poll list & homepage
rolliePollie.controller('ListCtrl', [
    '$scope',
    'polls',
    function($scope, polls){
        $scope.polls = polls.polls;
        
//        $scope.polls = [
//            {question: 'pollx 1',
//             choice: [{ text: 'a'}, { text: 'b'}, { text: 'c'}]},
//            {question: 'poll 2',
//             choice: [{ text: 'a'}, { text: 'b'}, { text: 'c'}]}
//        ]; 
    }
]);


//Voting and viewing results
rolliePollie.controller('PollCtrl', [
    '$scope',
    'polls',
    'poll',
    function($scope, polls, poll){
        $scope.poll = poll;
        $scope.vote = function(){};
    }
]);

//to create a new poll
rolliePollie.controller('NewCtrl', [
    '$scope',
    'polls',
    function($scope, polls) {
        //creates a Poll template
        $scope.poll = {
            question: '',
            choices: [{ text: ''}, { text: ''}, { text: ''}, { text: ''}]
        };
        
        //adds extra choice to the poll
        $scope.addChoice = function(){
            $scope.poll.choices.push({ text: ''})
            console.log('choice added');
        };
        
        //creates a new poll object
        $scope.addPoll = function(){
            polls.create({
                question: $scope.poll.question,
                choices: $scope.poll.choices
            });
//            $scope.question = '';
//            $scope.choices = [];
            console.log('poll created');
        }

    }]);























