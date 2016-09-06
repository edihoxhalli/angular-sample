angular.module('starter.services', ['firebase'])

.factory("Auth", ["$firebaseAuth", "$rootScope",
    function($firebaseAuth, $rootScope) {
        var ref = new Firebase(firebaseUrl);
        return $firebaseAuth(ref);
    }
    ])

//fillim - rezervime
.factory('Respond', function($location, $firebaseAuth, $firebaseArray, $firebaseObject, $rootScope, Chats) {

    var ref = new Firebase(firebaseUrl);
    var uid = $rootScope.uuid;
    var selectedResId;
    var messages;
    var res;

    return {
        all: function() {
            return messages;
        },
        selectMessage: function(userId, resId) {
            console.log("selecting the messages with id: " + resId + ' and UID:' + userId);
            selectedResId = resId;
            if (!isNaN(resId)) {
                var roomRef = ref.child("devices").child(userId).child("messages").child(selectedResId);
                messages = $firebaseArray(roomRef);
            }
        },
        res: function() {
            return res;
        },
        selectRes: function(userId, resId) {
            console.log("selecting the room with id: " + resId + ' and UID:' + userId);
            selectedResId = "u"+userId+"id"+resId;
            console.log(selectedResId); 
            status = 1;
            if (!isNaN(resId)) {
                var chatRef = ref.child("devices").child("reservations").child(selectedResId);
                res = $firebaseObject(chatRef);
            }
        },
        send: function(from, message) {
            console.log(from);
            if (from && message) {
                var chatMessage = {
                    from: "SPEEDTAXI",
                    message: message,
                    createdAt: Firebase.ServerValue.TIMESTAMP
                };
                messages.$add(chatMessage).then(function (data) {
                    console.log("message added");
                });
            }
        },
        remove: function(chat) {
            messages.$remove(chat).then(function(ref) {
                ref.key() === chat.$id;
                console.log("Deleted message with id: " + chat.$id);
            });
        },
        nosolution: function(userId, resId){
            var roomRef = ref.child("devices").child(userId).child("reservations").child(resId);
            roomRef.update({"status": 2 });
            var allRooms = ref.child("devices").child("reservations").child("u"+userId+"id"+resId);
            allRooms.update({"status": 2 });
            var chatMessage = {
                from: 'SPEEDTAXI',
                message: "Biseda u mbyll nga SPEEDTAXI",
                createdAt: Firebase.ServerValue.TIMESTAMP,
            };
            messages.$add(chatMessage).then(function (data) {
                console.log("message added");
            }).then(function(data) {
                console.log('Chat is closed.');
                $location.path('chatrequests');
            });
        },
        close: function(userId, resId){
            var roomRef = ref.child("devices").child(userId).child("reservations").child(resId);
            roomRef.update({"status": 0 });
            var allRooms = ref.child("devices").child("reservations").child("u"+userId+"id"+resId);
            allRooms.update({"status": 0 });
            var chatMessage = {
                from: 'SPEEDTAXI',
                message: "Biseda u mbyll nga SPEEDTAXI",
                createdAt: Firebase.ServerValue.TIMESTAMP,
            };
            messages.$add(chatMessage).then(function (data) {
                console.log("message added");
            }).then(function(data) {
                console.log('Chat is closed.');
                $location.path('chatrequests');
            });
        }
    }
})

.factory('Res', function($rootScope, $firebaseArray, $state, $location) {
    var ref = new Firebase(firebaseUrl);
    var uid = $rootScope.uuid;
    var res;
    
    return {
        all: function() {
            return res;
        },
        selectRes: function() {
            var allRes = ref.child("devices").child("reservations").orderByChild("status").equalTo(1);
            res = $firebaseArray(allRes);
        }
    }
})

//fund - rezervime
.factory('Chats', function($location, $firebaseAuth, $firebaseArray, $firebaseObject, $rootScope) {

    var ref = new Firebase(firebaseUrl);
    var uid = $rootScope.uuid;
    var selectedRoomId;
    var chats;
    var rooms;

    return {
        all: function() {
            return chats;
        },
        selectChats: function(userId, roomId) {
            console.log("selecting the messages with id: " + roomId + ' and UID:' + userId);
            selectedRoomId = roomId;
            var chatRef = ref.child("chats").child(selectedRoomId);
            chats = $firebaseArray(chatRef);
        },
        rooms: function() {
            return rooms;
        },
        selectRoom: function(userId, roomId) {
            console.log("selecting the room with id: " + roomId + ' and UID:' + userId);
            selectedRoomId = roomId;
            status = 1;
            var roomRef = ref.child("rooms").child(roomId);
            rooms = $firebaseObject(roomRef);
        },
        send: function(from, message) {
            console.log(from);
            if (from && message) {
                var chatMessage = {
                    from: "SPEEDTAXI",
                    message: message,
                    createdAt: Firebase.ServerValue.TIMESTAMP
                };
                chats.$add(chatMessage).then(function (data) {
                    console.log("message added");
                });
            }
        },
        remove: function(chat) {
            chats.$remove(chat).then(function(ref) {
                ref.key() === chat.$id;
                console.log("Deleted message with id: " + chat.$id);
            });
        },
        nosolution: function(userId, roomId){
            var roomRef = ref.child("rooms").child(roomId);
            roomRef.update({"status": 2 });
            var chatMessage = {
                from: 'SYSTEM',
                message: "Biseda u mbyll me statusin pa zgjidhje nga SPEEDTAXI",
                createdAt: Firebase.ServerValue.TIMESTAMP,
            };
            chats.$add(chatMessage).then(function (data) {
                console.log("message added");
            }).then(function(data) {
                console.log('Chat is closed.');
                $location.path('chatrequests');
            });
        },
        close: function(userId, roomId){
            var allRooms = ref.child("rooms").child(roomId);
            allRooms.update({"status": 0 });
            var chatMessage = {
                from: 'SYSTEM',
                message: "Biseda u mbyll nga SPEEDTAXI",
                createdAt: Firebase.ServerValue.TIMESTAMP,
            };
            chats.$add(chatMessage).then(function (data) {
                console.log("message added");
            }).then(function(data) {
                console.log('Chat is closed.');
                $location.path('chatrequests');
            });
        }
    }
})
.factory('Rooms', function($rootScope, $firebaseArray, $state, $location) {
    var ref = new Firebase(firebaseUrl);
    var uid = $rootScope.uuid;
    var rooms;
    
    return {
        all: function() {
            return rooms;
        },
        selectRooms: function() {
            var allRooms = ref.child("rooms").orderByChild("status").equalTo(1);
            rooms = $firebaseArray(allRooms);
        }
    }
})
.factory('TaxiRequest', function($rootScope, $firebaseArray, $state, $location) {
    var ref = new Firebase(firebaseUrl),
    uid = $rootScope.uuid,
    taxi;
    
    return {
        all: function() {
            return taxi;
        },
        selectTaxiRequests: function() {
            var allTaxiRequests = ref.child("taxirequests").orderByChild("status").equalTo(1);
            taxi = $firebaseArray(allTaxiRequests);
        }
    }
})
.factory('Taxi', function($rootScope, $firebaseArray, $state, $location) {

    var ref = new Firebase(firebaseUrl),
    taxis;
    
    return {
        all: function() {
            return taxis;
        },
        getTaxis: function() {
            var allTaxiRequests = ref.child("taxis");
            taxis = $firebaseArray(allTaxiRequests);
        },
        getActiveTaxis: function() {
            var allTaxiRequests = ref.child("taxis").orderByChild("status").equalTo(1);
            taxis = $firebaseArray(allTaxiRequests);
        },
        add: function(newtaxi) {
            console.log(newtaxi);
            if (newtaxi) {
                var taxissRef = ref.child("taxis");
                tx = $firebaseArray(taxissRef);
                var taxiData = {
                    number: newtaxi.number,
                    server: newtaxi.server,
                    status: 1
                };
                tx.$add(taxiData).then(function (data) {
                    console.log("taxi added");
                    $state.go('taxis');
                });
            }
        },  
        updateStatus: function(taxiId, status) {
            var statusRef = ref.child("taxis").child(taxiId);
            if(status == 1){
                statusRef.update({"status": 0 });
            } else {
                statusRef.update({"status": 1 });
            }
        },
        delete: function(taxi) {
            taxis.$remove(taxi).then(function(ref) {
                ref.key() === taxi.$id;
                console.log("Deleted taxi with id: " + taxi.$id);
            });
        }
    }
})

.factory('Track', function($firebaseObject, $state, $location) {

    var ref = new Firebase(firebaseUrl),
    selectedRequestId,
    requests,
    options;

    return {
        all: function() {
            return requests;
        },
        selectRequest: function(requestId) {
            console.log("selecting the request with id: " + requestId);
            selectedRequestId = requestId;
            var chatRef = ref.child("taxirequests").child(selectedRequestId);
            requests = $firebaseObject(chatRef);
        },
        trackingpath: function() {
            return options;
        },
        getTrackingpath: function() {
            var trackingpathRef = ref.child("options");
            options = $firebaseObject(trackingpathRef);
        },
        cakto: function(requestId, taxiId, userId, trackingpath) {
            //console.log("TaxiID: " + taxiId);
            var requestRef = ref.child("taxirequests").child(requestId);
            requestRef.update({"status": 0 });
            path = trackingpath + '?cid='+ taxiId +'&type=single';
            allNotificatins = ref.child("notifications").child(userId);
            allNotificatins.push({
                title: "Taksia juaj është aprovuar! Gjurmo taksinë?",
                data: path,  
                status: 1,
                action: "track",
                createdAt: Firebase.ServerValue.TIMESTAMP
            });
        },
        nosolution: function(requestId){
            var noSolutionRef = ref.child("taxirequests").child(requestId);
            noSolutionRef.update({"status": 2 });
        }
    }
})
.factory('Stations', function($rootScope, $firebaseArray, $state, $location) {
    var ref = new Firebase(firebaseUrl);
    var uid = $rootScope.uuid;
    var stations;
    
    return {
        all: function() {
            return stations;
        },
        selectStation: function() {
            var allStations = ref.child("stations").orderByChild("name");
            stations = $firebaseArray(allStations);
        },
        add: function(station) {
            console.log(station);
            if (station) {
                var stationsRef = ref.child("stations");
                st = $firebaseArray(stationsRef);
                var stationData = {
                    name: station.name,
                    address: station.address,
                    lat: station.lat,
                    lng: station.lng
                };
                st.$add(stationData).then(function (data) {
                    console.log("station added");
                    $state.go('stations');
                });
            }
        },
        delete: function(station) {
            stations.$remove(station).then(function(ref) {
                ref.key() === station.$id;
                console.log("Deleted station with id: " + station.$id);
            });
        }
    }
});
