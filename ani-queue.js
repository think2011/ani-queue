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
            this.queue.forEach(function (item) {
                if(item.type !== 'add') return

                $(item.params[0]).hide()
            })

            this._execute(cb)
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
                        .on('webkitAnimationEnd', function () {
                            $elem.removeClass(params[1]).removeClass('animated').css('animationDuration','')
                        })

                    if(params[2] !== undefined) $elem.css('animationDuration', params[2] + 's')

                    _cb()
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