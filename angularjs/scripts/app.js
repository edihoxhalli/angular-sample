var firebaseUrl = "https://speedtaxi.firebaseio.com/";

angular.module('starter', ['firebase', 'angularMoment', 'starter.controllers', 'starter.services', 'ui.router'])

.run(function($rootScope, $location, Auth, TaxiRequest, Rooms) {

    angular.element(document).ready(function () {

        $rootScope.firebaseUrl = firebaseUrl;

        Auth.$onAuth(function(authData) {
            if (authData) {
                console.log("Logged in as:", authData.uid);
                console.log("Autority Provider:", authData.provider);
                userId = authData.uid.split(":");
                $rootScope.uuid = parseInt(userId[1],10); //getting User ID

                var ref = new Firebase(firebaseUrl);
                ref.child("users").child(authData.uid).on('value', function(snapshot) {
                    var val = snapshot.val();
                    $rootScope.$apply(function() {
                        $rootScope.displayName = val.displayName; //getting User NickName
                    });
                });

            } else {
                console.log("Logged out");
                $location.path('/login');
            }
        });
        $rootScope.logout = function() {
            console.log("Logging out from the app");
            Auth.$unauth();
        }
        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });

        //Find new taxi requests
        TaxiRequest.selectTaxiRequests();
        $rootScope.newTaxiRequestsNotifications = TaxiRequest.all();

        //Find new chat requests
        Rooms.selectRooms();
        $rootScope.newChatRequestsNotifications = Rooms.all();

    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl',
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                // $waitForAuth returns a promise so the resolve waits for it to complete
                return Auth.$waitForAuth();
            }
            ]
        }
    })
    .state('taxiRequests', {
        url: '/taxirequests',
        templateUrl: 'templates/taxi_requests.html',
        controller: 'TaxiRequestCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
            }
            ]
        }
    })
    .state('taxiRequest', {
        url: '/taxirequest/:request/:lat/:lng',
        templateUrl: 'templates/taxi_request.html',
        controller: 'TrackCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
            }
            ]
        }
    })
    .state('taxis', {
        url: '/taxis',
        templateUrl: 'templates/taxis.html',
        controller: 'TaxiCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
            }
            ]
        }
    })
    .state('addTaxi', {
        url: '/addtaxi',
        templateUrl: 'templates/add_taxi.html',
        controller: 'TaxiCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
            }
            ]
        }
    })
    .state('chatRequests', {
        url: '/chatrequests',
        templateUrl: 'templates/chat_requests.html',
        controller: 'RoomsCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
            }
            ]
        }
    })
    .state('chat', {
        url: '/chat/:roomId',
        templateUrl: 'templates/chat.html',
        controller: 'ChatCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
            }
            ]
        }
    })
    .state('stations', {
        url: "/stations",
        templateUrl: "templates/stations.html",
        controller: 'StationsCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
            }
            ]
        }
    })
    .state('addStation', {
        url: "/addstation",
        templateUrl: "templates/add_station.html",
        controller: 'AddStationCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
            }
            ]
        }
    }) 
    // fillim - rezervimet
    .state('res', {
        url: '/res/:userId/:resId',
        templateUrl: 'templates/res.html',
        controller: 'RespondCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireAuth();
                }
                ]
            }
        })
    .state('resRequests', {
        url: '/resrequests',
        templateUrl: 'templates/res_requests.html',
        controller: 'ResCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
            function(Auth) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireAuth();
                }
                ]
            }
        })
    // fund - rezervimet
    .state('lockScreen', {
        url: "/lockscreen",
        templateUrl: "templates/lock_screen.html"
    })
    .state('notFound', {
        url: "/notfound",
        templateUrl: "templates/404.html"
    });
    $urlRouterProvider.otherwise('/chatrequests');
})

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (e) {
            var code = (e.keyCode ? e.keyCode: e.which);
            if((code === 13) || (code === 10)) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                e.preventDefault();
            }
        });
    };
});