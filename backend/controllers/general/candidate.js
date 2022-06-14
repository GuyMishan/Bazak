const Candidate = require("../../models/general/candidate");
const mongoose = require('mongoose');

let readtipul = [
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
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
  {
    $lookup: {
      from: "populations",
      localField: "mahzor.population",
      foreignField: "_id",
      as: "mahzor.population"
    }
  },
  {
    $unwind: "$mahzor.population"
  },
];

let readtipul2 = [
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
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
  {
    $lookup: {
      from: "populations",
      localField: "mahzor.population",
      foreignField: "_id",
      as: "mahzor.population"
    }
  },
  {
    $unwind: "$mahzor.population"
  },
  {
    $lookup: {
      from: "movements",
      localField: "movement",
      foreignField: "_id",
      as: "movement"
    }
  },
  {
    $unwind: "$movement"
  },
];

let readtipul3 = [
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user"
    }
  },
  {
    $unwind: "$user"
  },
  {
    $lookup: {
      from: "jobs",
      localField: "user.job",
      foreignField: "_id",
      as: "user.job"
    }
  },
  {
    $unwind: "$user.job"
  },
  {
    $lookup: {
      from: "units",
      localField: "user.job.unit",
      foreignField: "_id",
      as: "user.job.unit"
    }
  },
  {
    $unwind: "$user.job.unit"
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
  {
    $lookup: {
      from: "populations",
      localField: "mahzor.population",
      foreignField: "_id",
      as: "mahzor.population"
    }
  },
  {
    $unwind: "$mahzor.population"
  },
  {
    $lookup: {
      from: "movements",
      localField: "movement",
      foreignField: "_id",
      as: "movement"
    }
  },
  {
    $unwind: "$movement"
  },
];

exports.findById = async (req, res) => {
  const candidate = await Candidate.findOne().where({ _id: req.params.id })

  if (!candidate) {
    res.status(500).json({ success: false })
  }
  res.send(candidate)

}

exports.find = (req, res) => {
  Candidate.find()
    .then((candidate) => res.json(candidate))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const candidate = new Candidate(req.body);
  candidate.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Candidate.findByIdAndUpdate(req.params.candidateId, req.body)
    .then((candidate) => res.json(candidate))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
  Candidate.deleteOne({ _id: req.params.id })
    .then((candidate) => res.json(candidate))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.candidatesbymahzorid = async (req, res) => {
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

  Candidate.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
}

exports.candidatesbyuser = async (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //userid
  if (req.params.mahzorid != 'undefined') {
    andquery.push({ "user._id": mongoose.Types.ObjectId(req.params.userid) });
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

  Candidate.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
}

exports.smartcandidatebyid = async (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //candidateid
  if (req.params.candidateid != 'undefined') {
    andquery.push({ "_id": mongoose.Types.ObjectId(req.params.candidateid) });
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

  Candidate.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
}


exports.activecandidatesbymahzorid = async (req, res) => {
  let tipulfindquerry = readtipul3.slice();
  let finalquerry = tipulfindquerry;

    let matchquerry = {
      "$match": {
        "mahzor._id": mongoose.Types.ObjectId(req.params.mahzorid),
        "movement.name": { $not: {$in: ['ממשיך', 'רוחב לקידום/ממשיך', 'שחרור', 'פרישה'] } },
      }
    };
    finalquerry.push(matchquerry)

  // console.log(matchquerry)
  //console.log(andquery)

  Candidate.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
}

exports.activecandidatesbyuser = async (req, res) => {
  let tipulfindquerry = readtipul2.slice();
  let finalquerry = tipulfindquerry;

  let matchquerry = {
    "$match": {
      "user._id": mongoose.Types.ObjectId(req.params.userid),
      "movement.name": { $not: {$in: ['ממשיך', 'רוחב לקידום/ממשיך', 'שחרור', 'פרישה'] } },
    }
  };
  finalquerry.push(matchquerry)

  // console.log(matchquerry)
  //console.log(andquery)

  Candidate.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
}