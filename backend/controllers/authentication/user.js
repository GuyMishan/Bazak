const User = require('../../models/authentication/user');
const mongoose = require('mongoose');

exports.getuserbyid = (req, res) => {
    User.findById(req.body.userid).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'משתמש לא נמצא'
            })
        }
        else {
            res.send(user)
        }
    })
}

exports.find = (req, res) => {
    User.find().sort({ updatedAt: 'descending' })
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
}
exports.update = async (req, res) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!user) {
        res.status(404).send({ message: 'שגיאה בעדכון' })
    }
    res.status(200).send(user)


}

exports.remove = (req, res) => {
    console.log(req.body); //prints {}
    console.log(req.params); //prints { userId: '608e42b1cedc2a3a18492ae5' }
    User.deleteOne({ _id: req.params.userId })
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));;
}

exports.findvalidated = (req, res) => {
    User.find({ validated: true }).sort({ updatedAt: 'descending' })
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.findnotvalidated = (req, res) => {
    User.find({ validated: false }).sort({ updatedAt: 'descending' })
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.usersbyrole = (req, res) => {
    User.find({ role: req.params.role })
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
}

//3.1.2023

exports.usersvalidatedaggregate = (req, res) => {

    let readgdoduser = [
        {
            $lookup: {
                from: "gdods",
                localField: "gdodid",
                foreignField: "_id",
                as: "gdod_data"
            }
        },
        {
            $set: {
                gdod: { $arrayElemAt: ["$gdod_data._id", 0] }
            }
        },
        {
            $unwind: "$gdod_data"
        },
        {
            $lookup: {
                from: "hativas",
                localField: "gdod_data.hativa",
                foreignField: "_id",
                as: "hativa_data"
            }
        },
        {
            $set: {
                hativa: { $arrayElemAt: ["$hativa_data._id", 0] }
            }
        },
        {
            $lookup: {
                from: "ogdas",
                localField: "hativa_data.ogda",
                foreignField: "_id",
                as: "ogda_data"
            }
        },
        {
            $set: {
                ogda: { $arrayElemAt: ["$ogda_data._id", 0] }
            }
        },
        {
            $lookup: {
                from: "pikods",
                localField: "ogda_data.pikod",
                foreignField: "_id",
                as: "pikod_data"
            }
        },
        {
            $set: {
                pikod: { $arrayElemAt: ["$pikod_data._id", 0] }
            }
        },
    ];

    let readhativauser = [
        {
            $lookup: {
                from: "hativas",
                localField: "hativaid",
                foreignField: "_id",
                as: "hativa_data"
            }
        },
        {
            $set: {
                hativa: { $arrayElemAt: ["$hativa_data._id", 0] }
            }
        },
        {
            $unwind: "$hativa_data"
        },
        {
            $lookup: {
                from: "ogdas",
                localField: "hativa_data.ogda",
                foreignField: "_id",
                as: "ogda_data"
            }
        },
        {
            $set: {
                ogda: { $arrayElemAt: ["$ogda_data._id", 0] }
            }
        },
        {
            $lookup: {
                from: "pikods",
                localField: "ogda_data.pikod",
                foreignField: "_id",
                as: "pikod_data"
            }
        },
        {
            $set: {
                pikod: { $arrayElemAt: ["$pikod_data._id", 0] }
            }
        },
    ];

    let readogdauser = [
        {
            $lookup: {
                from: "ogdas",
                localField: "ogdaid",
                foreignField: "_id",
                as: "ogda_data"
            }
        },
        {
            $set: {
                ogda: { $arrayElemAt: ["$ogda_data._id", 0] }
            }
        },
        {
            $unwind: "$ogda_data"
        },
        {
            $lookup: {
                from: "pikods",
                localField: "ogda_data.pikod",
                foreignField: "_id",
                as: "pikod_data"
            }
        },
        {
            $set: {
                pikod: { $arrayElemAt: ["$pikod_data._id", 0] }
            }
        },
    ];

    let readpikoduser = [
        {
            $lookup: {
                from: "pikods",
                localField: "pikodid",
                foreignField: "_id",
                as: "pikod_data"
            }
        },
        {
            $set: {
                pikod: { $arrayElemAt: ["$pikod_data._id", 0] }
            }
        },
        {
            $unwind: "$pikod_data"
        },
    ];

    let tempallusers = [];
    User.aggregate(readgdoduser)
        .then((result) => {
            tempallusers = [...result]
            User.aggregate(readhativauser)
                .then((result) => {
                    tempallusers = tempallusers.concat([...result]);
                    User.aggregate(readogdauser)
                        .then((result) => {
                            tempallusers = tempallusers.concat([...result]);
                            User.aggregate(readpikoduser)
                                .then((result) => {
                                    tempallusers = tempallusers.concat([...result]);
                                    User.find({ role: "0" })
                                        .then((result) => {
                                            tempallusers = tempallusers.concat([...result])
                                            tempallusers = tempallusers.filter((el) => {
                                                return true === el.validated;
                                            });
                                            tempallusers.sort(function (a, b) {
                                                var c = new Date(a.updatedAt);
                                                var d = new Date(b.updatedAt);
                                                return c - d;
                                            });
                                            res.json(tempallusers.reverse());
                                        })
                                        .catch(err => res.status(400).json('Error: ' + err));
                                })
                                .catch((error) => {
                                    res.status(400).json('Error: ' + error);
                                });
                        })
                        .catch((error) => {
                            res.status(400).json('Error: ' + error);
                        });
                })
                .catch((error) => {
                    res.status(400).json('Error: ' + error);
                });
        })
        .catch((error) => {
            res.status(400).json('Error: ' + error);
        });
}

exports.usersnotvalidatedaggregate = (req, res) => {

    let readgdoduser = [
        {
            $lookup: {
                from: "gdods",
                localField: "gdodid",
                foreignField: "_id",
                as: "gdod_data"
            }
        },
        {
            $set: {
                gdod: { $arrayElemAt: ["$gdod_data._id", 0] }
            }
        },
        {
            $unwind: "$gdod_data"
        },
        {
            $lookup: {
                from: "hativas",
                localField: "gdod_data.hativa",
                foreignField: "_id",
                as: "hativa_data"
            }
        },
        {
            $set: {
                hativa: { $arrayElemAt: ["$hativa_data._id", 0] }
            }
        },
        {
            $lookup: {
                from: "ogdas",
                localField: "hativa_data.ogda",
                foreignField: "_id",
                as: "ogda_data"
            }
        },
        {
            $set: {
                ogda: { $arrayElemAt: ["$ogda_data._id", 0] }
            }
        },
        {
            $lookup: {
                from: "pikods",
                localField: "ogda_data.pikod",
                foreignField: "_id",
                as: "pikod_data"
            }
        },
        {
            $set: {
                pikod: { $arrayElemAt: ["$pikod_data._id", 0] }
            }
        },
    ];

    let readhativauser = [
        {
            $lookup: {
                from: "hativas",
                localField: "hativaid",
                foreignField: "_id",
                as: "hativa_data"
            }
        },
        {
            $set: {
                hativa: { $arrayElemAt: ["$hativa_data._id", 0] }
            }
        },
        {
            $unwind: "$hativa_data"
        },
        {
            $lookup: {
                from: "ogdas",
                localField: "hativa_data.ogda",
                foreignField: "_id",
                as: "ogda_data"
            }
        },
        {
            $set: {
                ogda: { $arrayElemAt: ["$ogda_data._id", 0] }
            }
        },
        {
            $lookup: {
                from: "pikods",
                localField: "ogda_data.pikod",
                foreignField: "_id",
                as: "pikod_data"
            }
        },
        {
            $set: {
                pikod: { $arrayElemAt: ["$pikod_data._id", 0] }
            }
        },
    ];

    let readogdauser = [
        {
            $lookup: {
                from: "ogdas",
                localField: "ogdaid",
                foreignField: "_id",
                as: "ogda_data"
            }
        },
        {
            $set: {
                ogda: { $arrayElemAt: ["$ogda_data._id", 0] }
            }
        },
        {
            $unwind: "$ogda_data"
        },
        {
            $lookup: {
                from: "pikods",
                localField: "ogda_data.pikod",
                foreignField: "_id",
                as: "pikod_data"
            }
        },
        {
            $set: {
                pikod: { $arrayElemAt: ["$pikod_data._id", 0] }
            }
        },
    ];

    let readpikoduser = [
        {
            $lookup: {
                from: "pikods",
                localField: "pikodid",
                foreignField: "_id",
                as: "pikod_data"
            }
        },
        {
            $set: {
                pikod: { $arrayElemAt: ["$pikod_data._id", 0] }
            }
        },
        {
            $unwind: "$pikod_data"
        },
    ];

    let tempallusers = [];
    User.aggregate(readgdoduser)
        .then((result) => {
            tempallusers = [...result]
            User.aggregate(readhativauser)
                .then((result) => {
                    tempallusers = tempallusers.concat([...result]);
                    User.aggregate(readogdauser)
                        .then((result) => {
                            tempallusers = tempallusers.concat([...result]);
                            User.aggregate(readpikoduser)
                                .then((result) => {
                                    tempallusers = tempallusers.concat([...result]);
                                    User.find({ role: "0" })
                                        .then((result) => {
                                            tempallusers = tempallusers.concat([...result])
                                            tempallusers = tempallusers.filter((el) => {
                                                return false === el.validated;
                                            });
                                            tempallusers.sort(function (a, b) {
                                                var c = new Date(a.updatedAt);
                                                var d = new Date(b.updatedAt);
                                                return c - d;
                                            });
                                            res.json(tempallusers.reverse());
                                        })
                                        .catch(err => res.status(400).json('Error: ' + err));
                                })
                                .catch((error) => {
                                    res.status(400).json('Error: ' + error);
                                });
                        })
                        .catch((error) => {
                            res.status(400).json('Error: ' + error);
                        });
                })
                .catch((error) => {
                    res.status(400).json('Error: ' + error);
                });
        })
        .catch((error) => {
            res.status(400).json('Error: ' + error);
        });
}
