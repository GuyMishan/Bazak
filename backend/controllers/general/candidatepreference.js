const Candidatepreference = require("../../models/general/candidatepreference");
const mongoose = require('mongoose');

let readtipul = [
  {
    $lookup: {
      from: "candidates",
      localField: "candidate",
      foreignField: "_id",
      as: "candidate"
    }
  },
  {
    $unwind: "$candidate"
  },
  {
    $lookup: {
      from: "users",
      localField: "candidate.user",
      foreignField: "_id",
      as: "candidate.user"
    }
  },
  {
    $unwind: "$candidate.user"
  },
  {
    $lookup: {
      from: "mahzors",
      localField: "mahzor",
      foreignField: "_id",
      as: "mahzor"
    }
  },
  {
    $unwind: "$mahzor"
  },
];

let readtipul2 = [
  {
    $lookup: {
      from: "candidates",
      localField: "candidate",
      foreignField: "_id",
      as: "candidate"
    }
  },
  {
    $unwind: "$candidate"
  },
  {
    $lookup: {
      from: "movements",
      localField: "candidate.movement",
      foreignField: "_id",
      as: "candidate.movement"
    }
  },
  {
    $unwind: "$candidate.movement"
  },
  {
    $lookup: {
      from: "users",
      localField: "candidate.user",
      foreignField: "_id",
      as: "candidate.user"
    }
  },
  {
    $unwind: "$candidate.user"
  },
  {
    $lookup: {
      from: "jobs",
      localField: "candidate.user.job",
      foreignField: "_id",
      as: "candidate.user.job"
    }
  },
  {
    $unwind: "$candidate.user.job"
  },
  {
    $lookup: {
      from: "units",
      localField: "candidate.user.job.unit",
      foreignField: "_id",
      as: "candidate.user.job.unit"
    }
  },
  {
    $unwind: "$candidate.user.job.unit"
  },
  {
    $lookup: {
      from: "mahzors",
      localField: "mahzor",
      foreignField: "_id",
      as: "mahzor"
    }
  },
  {
    $unwind: "$mahzor"
  },
];

exports.findById = async(req, res) => {
  const candidatepreference = await Candidatepreference.findOne().where({_id:req.params.id})
  
  if(!candidatepreference){
      res.status(500).json({success: false})
  }
  res.send(candidatepreference)
  
 }

exports.find = (req, res) => {
    Candidatepreference.find()
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const candidatepreference = new Candidatepreference(req.body);
  candidatepreference.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
    Candidatepreference.findByIdAndUpdate(req.params.candidatepreferenceId, req.body)
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Candidatepreference.deleteOne({ _id: req.params.id })
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.candidatepreferencebycandidateid = async (req, res) => {
  Candidatepreference.find({candidate:req.params.candidateid})
  .then((candidatepreference) => res.json(candidatepreference))
  .catch((err) => res.status(400).json("Error: " + err));
}

exports.smartcandidatepreference = async (req, res) => {
  let tipulfindquerry = readtipul2.slice();
  let finalquerry = tipulfindquerry;

  // let andquery = [];

  // //candidateid
  // if (req.params.candidateid != 'undefined') {
  //   andquery.push({ "candidate._id": mongoose.Types.ObjectId(req.params.candidateid) });
  // }

  // if (andquery.length != 0) {
  //   let matchquerry = {
  //     "$match": {
  //       "$and": andquery
  //     }
  //   };
  //   finalquerry.push(matchquerry)
  // }

  // console.log(matchquerry)
  //console.log(andquery)

  Candidatepreference.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
}

exports.candidatepreferencebymahzorid = (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //mahzorid
  if (req.params.mahzorid != 'undefined') {
    andquery.push({ "mahzor._id": mongoose.Types.ObjectId(req.params.mahzorid) });
  }

  if (andquery.length != 0) {
    let matchquerry = {
      "$match": {
        "$and": andquery
      }
    };
    finalquerry.push(matchquerry)
  }

  // console.log(matchquerry)
  //console.log(andquery)

  Candidatepreference.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};