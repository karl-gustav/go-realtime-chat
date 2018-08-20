new Vue({
    el: '#app',

    data: {
        ws: null, // Our websocket
        newMsg: '', // Holds new messages to be sent to the server
        chatContent: '', // A running list of chat messages displayed on the screen
        username: null, // Our username
        joined: false // True if email and username have been filled in
    },

    created: function() {
        var self = this;
        this.ws = new WebSocket('ws://' + window.location.host + '/ws');
        this.ws.addEventListener('message', function(e) {
            var msg = JSON.parse(e.data);
            self.chatContent += '<div class="chip">'
                    + '<img src="https://robohash.org/' + msg.username + '?size=32x32">' // Avatar
                    + msg.username
                    + '</div>' + msg.message + '<br/>';

            var element = document.getElementById('chat-messages');
            element.scrollTop = element.scrollHeight; // Auto scroll to the bottom
        });
    },

    methods: {
        send: function () {
            if (this.newMsg) {
                this.ws.send(
                    JSON.stringify({
                        username: this.username,
                        message: this.newMsg.replace(/<(?:.|\n)*?>/gm, '') // Strip out html
                    }
                ));
                this.newMsg = ''; // Reset newMsg
            }
        },

        join: function () {
            if (!this.username) {
                alert('You must choose a username', 2000);
                return
            }
            this.username = this.username.replace(/<(?:.|\n)*?>/gm, '');
            this.joined = true;
        }
    }
});
