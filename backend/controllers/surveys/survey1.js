const Survey1 = require("../../models/surveys/survey1");
const mongoose = require('mongoose');

exports.read = async (req, res) => {
  const survey1 = await Survey1.findById(req.params.id);
  if (!survey1) {
    res.status(500).json({ message: 'הרמ"מ לא נמצא' })
  } else {
    res.status(200).send([survey1])
  }
}

exports.find = (req, res) => {
  Survey1.find()
    .then((survey1) => res.json(survey1))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const survey1 = new Survey1(req.body);
  survey1.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Survey1.findByIdAndUpdate(req.params.survey1Id, req.body)
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
}

exports.remove = (req, res) => {
  Survey1.deleteOne({ _id: req.params.id })
    .then((survey1) => res.json(survey1))
    .catch((err) => res.status(400).json("Error: " + err));
};

//

exports.survey1byuserid = (req, res) => {
  Survey1.find({ userid: req.params.userid })
    .then((survey1) => res.json(survey1))
    .catch((err) => res.status(400).json("Error: " + err));
};

// exports.survey1byuserid = (req, res) => {
//   let readtipul = [
//     {
//       $lookup: {
//         from: "users",
//         localField: "userid",
//         foreignField: "_id",
//         as: "user"
//       }
//     },
//     {
//       $unwind: "$user"
//     }
//   ];

//   let tipulfindquerry = readtipul.slice();
//   let finalquerry = tipulfindquerry;

//   let andquery = [];

//   //userid
//   if (req.params.unitid != 'undefined') {
//     andquery.push({ "userid": mongoose.Types.ObjectId(req.params.userid) });
//   }

//   if (andquery.length != 0) {
//     let matchquerry = {
//       "$match": {
//         "$and": andquery
//       }
//     };
//     finalquerry.push(matchquerry)
//   }

//   // console.log(matchquerry)
//   //console.log(andquery)

//   Survey1.aggregate(finalquerry)
//     .then((result) => {
//       res.json(result);
//     })
//     .catch((error) => {
//       res.status(400).json('Error: ' + error);
//     });
// };