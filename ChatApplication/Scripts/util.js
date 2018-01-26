var myApp = angular.module('myApp', []);

myApp.controller('ChatController', ['$scope', function ($scope) {

    function activate() {

        $scope.showChatBody = false;
        $scope.showLoginBlock = true;
        $scope.messages = [];
        $scope.users = [];
    }

    var chat = $.connection.chatHub;
    var client = chat.client;
    var server = chat.server;

    

    client.onConnected = function (id, userName, allUsers) {
       
        $scope.hdId = id;
        $scope.username = userName;

        for (var i = 0; i < allUsers.length; i++) {

            addUser(allUsers[i].ConnectionId, allUsers[i].Name);
        }
    }

    client.onNewUserConnected = function (id, name) {
        addUser(id, name);
    }

    client.onUserDisconnected = function (id, userName) {
        //$('#' + id).remove();
        var index = -1;
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].Id === id && $scope.users[i].Name === userName) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            $scope.users.splice(index, 1)
            $scope.$apply();
        }
    }

    client.addMessage = function (name, message) {
       
        $scope.messages.push({ Name: htmlEncode(name), Message: htmlEncode(message) });
        $scope.$apply();
    };

    $.connection.hub.start().done(function () {

        $scope.onSendMessage = function() {
            if ($scope.message != null && $scope.message.length > 0) {
                server.send($scope.username, $scope.message);
                $scope.message = null;
            }
        }

        $scope.onLogin = function() {
            var name = $scope.txtUserName;
            if (name.length > 0) {
                server.connect(name);
                $scope.showChatBody = true;
                $scope.showLoginBlock = false;
                $scope.greeting = 'Добро пожаловать, ' + name;
                $scope.username = name;
            } else {
                alert("Введите имя");
            }
        }

    });

    function htmlEncode(value) {
        var encodedValue = $('<div />').text(value).html();
        return encodedValue;
    }

    function addUser(id, name) {

        var userId = $scope.hdId;
        $scope.users.push({ Id: id, Name: name });
        $scope.$apply();
        //$("#chatusers").append('<p id="' + id + '"><b>' + name + '</b></p>');
    }

    activate();

}]);

