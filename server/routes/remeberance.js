var _ = require('lodash');
var db = require('mongo_schemas');

module.exports = (function() {
    var _return = {};

    _return.get = function(req, res, next) {
        if (req.query && req.query.type == "all") {
            var from = req.query.from || 0;
            var to = req.query.to || 10;

            db.rememberance
                .find({}, {
                    __v: false
                })
                .skip(from)
                .limit(to - from)
                .lean()
                .exec(function(err,
                    rememberances) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            add: false,
                            err: err
                        });
                    } else {
                        rememberances.forEach(function(
                            rememberance) {
                            Date.en_to_persion_date(
                                rememberance._id.getTimestamp(),
                                function(date) {
                                    rememberance.date =
                                        date.date;
                                    rememberance.time =
                                        date.time;
                                })
                        })
                        res.json(rememberances);
                    }
                })
        }
        // now this part in useless!

        /*else if (req.query && req.query.type == "single" && req.query
                   ._id) {
                   db.rememberance.findOne({
                       _id: req.query
                           ._id
                   }, {
                       _id: false,
                       __v: false
                   }).lean().exec(function(err,
                       rememberances) {
                       if (err) {
                           console.log(err);
                           res.status(500).json({
                               add: false,
                               err: err
                           });
                       } else {
                           res.json(rememberances);
                       }
                   })
               }*/
    };

    _return.post = function(req, res, next) {
        // add rememberance is for users only
        // and other should register if wan to add
        if (req.user && req.body.type == "add") {
            new db.rememberance(req.body.data).save(function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        add: false,
                        err: err
                    });
                } else {
                    console.log(req.user.first_name + " " +
                        req.user.last_name +
                        " add a new remeberance");
                    res.json({
                        add: true
                    });
                }
            });
            // like a remembrane and add it to set of likers
        } else if (req.user && req.body.type == "like" && req.body.data &&
            req.body.data._remeberance_id) {
            db.remeberance.update({
                _id: _remeberance_id
            }, {
                $addToSet: {
                    like: req.user._id
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        like: false,
                        err: err
                    });
                } else {
                    console.log(req.user.first_name + " " +
                        req.user.last_name +
                        " like a remeberance");
                    res.json({
                        like: true
                    });
                }
            });
            // add comment to a remembrane in it's array
        } else if (req.user && req.body.type == "comment" && req.body
            .data && req.body.data._remeberance_id && req.body.data
            .text) {
            db.remeberance.update({
                _id: _remeberance_id
            }, {
                $addToSet: {
                    comment: {
                        _writer: req.user._id,
                        text: req.body.data.text
                    }
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        comment: false,
                        err: err
                    });
                } else {
                    console.log(req.user.first_name + " " +
                        req.user.last_name +
                        " comment a remeberance");
                    res.json({
                        comment: true
                    });
                }
            });
        }
    };

    return _return;
})();
