const User = require('../../models/authentication/user');
const mongoose = require('mongoose');

exports.getuserbyid = (req, res) => {
    //  console.log(req.body.userid); //prints userid
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
// exports.update = (req, res) => {
//     //console.log(req.body); //prints {...}
//   //  console.log(req.params); //prints { id: '608e42b1cedc2a3a18492ae5' }
//     const user = new User(req.body)
//     User.updateOne({_id: req.params.id},user)
//     .then(orders => res.json(orders))
//     .catch(err => res.status(400).json('Error: ' + err));;
// }

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

exports.usersbyroleandpopulation = (req, res) => {
    User.find({ role: req.params.role, population: req.params.population })
        .then(orders => res.json(orders))
        .catch(err => res.status(400).json('Error: ' + err));
}

exports.smartgetuserbyid = (req, res) => {
    let readtipul3 = [
        {
          $lookup: {
            from: "populations",
            localField: "population",
            foreignField: "_id",
            as: "population"
          }
        },
        {
          $unwind: "$population"
        },
        {
          $lookup: {
            from: "jobs",
            localField: "job",
            foreignField: "_id",
            as: "job"
          }
        },
        {
          $unwind: "$job"
        },
        {
          $lookup: {
            from: "units",
            localField: "job.unit",
            foreignField: "_id",
            as: "job.unit"
          }
        },
        {
          $unwind: "$job.unit"
        },
      ];
      
      let tipulfindquerry = readtipul3.slice();
      let finalquerry = tipulfindquerry;
    
        let matchquerry = {
          "$match": {
            "_id": mongoose.Types.ObjectId(req.body.userid),
          }
        };
        finalquerry.push(matchquerry)
    
      // console.log(matchquerry)
      //console.log(andquery)
    
      User.aggregate(finalquerry)
        .then((result) => {
          res.json(result[0]);
        })
        .catch((error) => {
          res.status(400).json('Error: ' + error);
        });
}

