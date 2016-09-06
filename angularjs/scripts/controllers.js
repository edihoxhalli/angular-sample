angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, $firebaseAuth, $rootScope) {
    //console.log('Login Controller Initialized');

    var ref = new Firebase($scope.firebaseUrl);
    var auth = $firebaseAuth(ref);

    $scope.createUser = function(user) {
    	console.log("Create User Function called");
    	if (user && user.email && user.password && user.displayname) {

    		auth.$createUser({
    			email: user.email,
    			password: user.password
    		}).then(function(userData) {
    			alert("User created successfully!");
    			ref.child("users").child(userData.uid).set({
    				email: user.email,
    				displayName: user.displayname
    			});
    			$scope.modal.hide();
    		}).catch(function(error) {
    			alert("Error: " + error);
    		});
    	} else
    	alert("Please fill all details");
    }

    $scope.signIn = function(user) {

    	if (user && user.email && user.pwdForLogin) {

    		auth.$authWithPassword({
    			email: user.email,
    			password: user.pwdForLogin
    		}).then(function(authData) {
    			console.log("Logged in as:" + authData.uid);
    			ref.child("users").child(authData.uid).on('value', function(snapshot) {
    				var val = snapshot.val();
                    // To Update AngularJS $scope either use $apply or $timeout
                    $scope.$apply(function() {
                    	$rootScope.displayName = val.displayName;
                    });
                });
    			$state.go('chatRequests');
    		}).catch(function(error) {
    			alert("Authentication failed:" + error.message);
    		});
    	} else
    	alert("Please enter email and password both");
    }
})
.controller('ChatCtrl', function($scope, Chats, $state, $rootScope) {

    $scope.IM = {
        textMessage: ""
    };

    Chats.selectChats($state.params.userId, $state.params.roomId);
    $scope.chats = Chats.all();
    
    Chats.selectRoom($state.params.userId, $state.params.roomId);
    $scope.rooms = Chats.rooms();

    $scope.openMap = 0;

    $scope.googleMap = function(lat, lng){

        $scope.openMap = true;
        $scope.openMaponHide = true;

        var latlng = new google.maps.LatLng(lat, lng);

        var myOptions = {
            zoom: 16,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("gmap_basic"), myOptions);
        latLng = new google.maps.LatLng(lat, lng);
        
        // Creating a marker and putting it on the map
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
        });

    }

    $scope.openGoogleMap = function(lat, lng){
        $scope.openMap = true;
    }

    $scope.closeGoogleMap = function(lat, lng){
        $scope.openMap = false;
    }

    $scope.sendMessage = function(msg) {
        console.log(msg);
        Chats.send($rootScope.displayName, msg);
        $scope.IM.textMessage = "";
    }

    $scope.remove = function(chat) {
        Chats.remove(chat);
    }

    $scope.nosolution = function() {
        Chats.nosolution($state.params.userId, $state.params.roomId);
    }

    $scope.close = function() {
        Chats.close($state.params.userId, $state.params.roomId);
    }

    $scope.back = function() {
        $state.go('home');
    }
})
.controller('RoomsCtrl', function($scope, Rooms, $state, $rootScope, $firebaseArray) {
   
    Rooms.selectRooms();
    $scope.newRooms = Rooms.all();

    $scope.openChat = function(roomId) {
        $state.go('chat', {
            roomId: roomId
        });
    }

})
.controller('TaxiRequestCtrl', function($scope, TaxiRequest, $state, $rootScope, $firebaseArray) {
  
    TaxiRequest.selectTaxiRequests();
    $scope.newTaxiRequests = TaxiRequest.all();
  
    $scope.openTaxiRequest = function(requestId, lat, lng) {
        $state.go('taxiRequest', {
            request: requestId,
            lat: lat,
            lng: lng
        });
    }
})
//fillim - rezervime

.controller('RespondCtrl', function($scope, Respond, $state, $rootScope) {

    $scope.IM = {
        textMessage: ""
    };

    Respond.selectMessage($state.params.userId, $state.params.resId);
    $scope.messages = Respond.all();

    Respond.selectRes($state.params.userId, $state.params.resId);
    $scope.res = Respond.res();

    console.log($rootScope);

    //$scope.openMap = 0;

    $scope.googleMap = function(lat, lng, destLat, destLng){

        $scope.openMap = true;
        $scope.openMaponHide = true;

        var latlng = new google.maps.LatLng(lat, lng);

        var myOptions = {
            zoom: 13,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("gmap_basic"), myOptions);
        latLng = new google.maps.LatLng(lat, lng);
        destlatLng = new google.maps.LatLng(destLat, destLng);
        
        // Creating a marker and putting it on the map
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
        // Creating a marker and putting it on the map
        var destmarker = new google.maps.Marker({
            position: destlatLng,
            map: map,
             icon: 'img/dest.gif'
        });

    }

    $scope.openGoogleMap = function(lat, lng){
        $scope.openMap = true;
    }

    $scope.closeGoogleMap = function(lat, lng){
        $scope.openMap = false;
    }

    $scope.sendMessage = function(msg) {
        console.log($rootScope.displayName);
        Respond.send($rootScope.displayName, msg);
        $scope.IM.textMessage = "";
    }

    $scope.remove = function(chat) {
        Respond.remove(chat);
    }

    $scope.nosolution = function() {
        Respond.nosolution($state.params.userId, $state.params.resId);
    }

    $scope.close = function() {
        Respond.close($state.params.userId, $state.params.resId);
    }

    $scope.back = function() {
        $state.go('home');
    }

})
.controller('ResCtrl', function($scope, Res, $state, $rootScope, $firebaseArray) {
    Res.selectRes();
    $scope.newRes = Res.all();

    $scope.openRes = function(userId, resId) {
        $state.go('res', {
            userId: userId,
            resId: resId
        });
    }

})
//fund - rezervime
.controller('TrackCtrl', function($scope, Track, Taxi, $state, $rootScope, $firebaseArray) {

    lat = $state.params.lat;
    lng = $state.params.lng;

    latLng = new google.maps.LatLng(lat, lng);
    var myOptions = {
        zoom: 16,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("gmap_basic"), myOptions);
    // Creating a marker and putting it on the map
    var marker = new google.maps.Marker({
        position: latLng,
        map: map,
    });

    requestId = $state.params.request;
    Track.selectRequest(requestId);
    $scope.request = Track.all();

    Track.getTrackingpath();
    $scope.options = Track.trackingpath();

    Taxi.getActiveTaxis();
    $scope.taxis = Taxi.all();

    $scope.cakto = function(taxiId, userId) {
        if(taxiId){
            var r = confirm('Ju sapo caktuat një taxi për kërkesën e klientit.\nJeni të sigurtë për zgjedhjen tuaj?');
            if (r == true) {
                trackingpath = $scope.options.trackingpath;
                Track.cakto(requestId, taxiId, userId, trackingpath);
                $state.go('taxiRequests');
            } 
        } else {
            alert("Ju lutem caktoni një taksi për kërkesën e klientit!");
        }
    }

    $scope.nosolution = function() {
        Track.nosolution(requestId);
        $state.go('taxiRequests');
    }

})
.controller('TaxiCtrl', function($scope, Taxi, $state, $rootScope, $firebaseArray) {

    Taxi.getTaxis();
    $scope.taxis = Taxi.all();

    $scope.addTaxiView = function(){
        $state.go('addTaxi');
    }

    $scope.addTaxi = function(newtaxi) {
        //console.log(newtaxi);
        Taxi.add(newtaxi);
    }

    $scope.updateTaxiStatus = function(taxiId, status) {
        Taxi.updateStatus(taxiId, status);
    }

    $scope.deleteStation = function(taxi) {
        //console.log(station);
        Taxi.delete(taxi);
    }

})
.controller('StationsCtrl', function($scope, Stations, $state, $rootScope, $firebaseArray) {

    Stations.selectStation();
    $scope.stations = Stations.all();

    $scope.addStationView = function() {
        $state.go('addStation');
    }

    $scope.deleteStation = function(station) {
        //console.log(station);
        Stations.delete(station);
    }
})
.controller('AddStationCtrl', function($scope, Stations, $state, $rootScope, $firebaseArray) {

    var map,
    markersArray = [],
    geocoder = new google.maps.Geocoder(),
    myOptions = {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("gmap_basic"), myOptions);
    
    // add a click event handler to the map object
    google.maps.event.addListener(map, "click", function(event){
        // place a marker
        placeMarker(event.latLng);
        // display the lat/lng in your form's lat/lng fields
        document.getElementById("lat").value = event.latLng.lat();
        document.getElementById("lng").value = event.latLng.lng();
        name = document.getElementById("name").value;
        getAddress(event.latLng, event.latLng.lat(), event.latLng.lng(), name);
    });

    getAddress = function(latLng, lat, lng, name) {
        geocoder.geocode( {'latLng': latLng},
            function(results, status) {
                if(status == google.maps.GeocoderStatus.OK) {
                    if(results[0]) {
                        document.getElementById('address').value = results[0].formatted_address;
                        $scope.station = {
                            lng: lng,
                            lat: lat,
                            address: results[0].formatted_address,
                            name: name
                        };
                    }
                    else {
                        //document.getElementById(id).value = "No results";
                        document.getElementById('address').value = latLng;
                    }
                }
                else {
                    //document.getElementById(id).value = status;
                    document.getElementById('address').value = latLng;
                }
            });
    }

    // Try HTML5 geolocation
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos,
                content: '<div class="info-window">Ju jeni këtu.</div>'
            });
            map.setCenter(pos);
            var center = map.getCenter();
            var lat = center.lat();
            var lng = center.lng();
            var points_number = 10;
            var center_distance = 5000;
        }, function() {
            handleNoGeolocation(true);
        }, {timeout: 10000, enableHighAccuracy: true, maximumAge: 600000});
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }

    handleNoGeolocation = function(errorFlag) {
        if (errorFlag) {
            console.log('Error: The Geolocation service failed.');
        } else {
            console.log('Error: Your browser doesn\'t support geolocation.');
        }
        var options = {
            map: map,
            position: new google.maps.LatLng(41.320584583379945, 19.810649169189484),
            content: '<div class="info-window">Qendra e Tiranës</div>'
        };
        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
        var center = map.getCenter();
        var lat = center.lat();
        var lng = center.lng();
        var points_number = 10;
        var center_distance = 5000;
    }

    placeMarker = function(location) {
        // first remove all markers if there are any
        deleteOverlays();
        var marker = new google.maps.Marker({
            position: location, 
            map: map
        });
        // add marker in markers array
        markersArray.push(marker);
        map.setCenter(location);
    }

    // Deletes all markers in the array by removing references to them
    deleteOverlays = function(){
        if (markersArray) {
            for (i in markersArray) {
                markersArray[i].setMap(null);
            }
            markersArray.length = 0;
        }
    }

    $scope.addStation = function(station) {
        //console.log(station);
        Stations.add(station);
    }

});