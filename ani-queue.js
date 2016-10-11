;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory)
    } else if (typeof exports === 'object') {
        // Node, CommonJS
        module.exports = factory()
    } else {
        // Window
        root.AniQueue = factory()
    }
}(this, function () {
    var AniQueue = function () {
        this.queue = []
    }

    AniQueue.prototype = {
        construct: AniQueue,

        start: function (cb) {
            var elemTask = this.queue.filter(function (item) {
                return item.type === 'add'
            })
            elemTask.forEach(function (item) {
                $(item.params[0]).hide()
            })

            this._execute(function () {
                elemTask.forEach(function (item) {
                    $(item.params[0]).removeClass(item.params[1]).removeClass('animated').css('animationDuration','')
                })

                cb && cb()
            })
        },

        _execute: function (cb) {
            var that = this
            var task = this.queue.shift()
            var params = task.params

            var _cb = function () {
                if(that.queue.length) {
                    that._execute(cb)
                } else {
                    cb && cb()
                }
            }

            switch (task.type) {
                case 'add':
                    var $elem = $(params[0])


                    $elem
                        .show()
                        .addClass(params[1]).addClass('animated')

                    if(params[2] !== undefined) $elem.css('animationDuration', params[2] + 's')

                    if(this.queue.length === 0) {
                        $elem.on('webkitAnimationEnd', function () {
                            _cb()
                        })
                    } else {
                        _cb()
                    }
                    break;

                case 'delay':
                    setTimeout(_cb, params[0] * 1000)
                    break;

                default:
                //
            }
        },

        add: function (selector, animateClass, duration) {
            this.queue.push({
                type:'add',
                params: arguments
            })

            return this
        },


        delay: function (time) {
            this.queue.push({
                type:'delay',
                params: arguments
            })
            return this
        }
    }

    return AniQueue
}))