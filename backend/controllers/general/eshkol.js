const Eshkol = require("../../models/general/eshkol");
const mongoose = require('mongoose');

let readtipul = [
  {
    $lookup: {
      from: "candidateineshkols",
      localField: "candidatesineshkol",
      foreignField: "_id",
      as: "candidatesineshkol"
    }
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
      from: "jobinmahzors",
      localField: "jobinmahzor",
      foreignField: "_id",
      as: "jobinmahzor"
    }
  },
  {
    $unwind: "$jobinmahzor"
  },
  {
    $lookup: {
      from: "jobs",
      localField: "jobinmahzor.job",
      foreignField: "_id",
      as: "jobinmahzor.job"
    }
  },
  {
    $unwind: "$jobinmahzor.job"
  },
  {
    $lookup: {
      from: "units",
      localField: "jobinmahzor.job.unit",
      foreignField: "_id",
      as: "jobinmahzor.job.unit"
    }
  },
  {
    $unwind: "$jobinmahzor.job.unit"
  },
];

exports.findById = async (req, res) => {
  const eshkol = await Eshkol.findOne().where({ _id: req.params.id })

  if (!eshkol) {
    res.status(500).json({ success: false })
  }
  res.send(eshkol)

}

exports.find = (req, res) => {
  Eshkol.find()
    .then((eshkol) => res.json(eshkol))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const eshkol = new Eshkol(req.body);
  eshkol.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Eshkol.findByIdAndUpdate(req.params.eshkolId, req.body)
    .then((eshkol) => res.json(eshkol))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
  Eshkol.deleteOne({ _id: req.params.id })
    .then((eshkol) => res.json(eshkol))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.deleteMahzorEshkol = (req, res) => {
  Eshkol.deleteMany({ mahzor: req.params.mahzorid })
    .then((eshkol) => res.json(eshkol))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.eshkolbymahzorid = (req, res) => {
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

  Eshkol.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};

exports.eshkolbymahzoridandunitid = (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //mahzorid
  if (req.params.mahzorid != 'undefined') {
    andquery.push({ "mahzor._id": mongoose.Types.ObjectId(req.params.mahzorid) });
  }

  //unitid
  if (req.params.unitid != 'undefined') {
    andquery.push({ "job.unit._id": mongoose.Types.ObjectId(req.params.unitid) });
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

  Eshkol.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};

exports.eshkolbyjobinmahzorid = (req, res) => {
  // let tipulfindquerry = readtipul.slice();
  // let finalquerry = tipulfindquerry;

  // let andquery = [];

  // //jobid
  // if (req.params.jobinmahzorid != 'undefined') {
  //   andquery.push({ "jobinmahzor._id": mongoose.Types.ObjectId(req.params.jobinmahzorid) });
  // }

  // if (andquery.length != 0) {
  //   let matchquerry = {
  //     "$match": {
  //       "$and": andquery
  //     }
  //   };
  //   finalquerry.push(matchquerry)
  // }

  // // console.log(matchquerry)
  // //console.log(andquery)

  // Eshkol.aggregate(finalquerry)
  //   .then((result) => {
  //     res.json(result);
  //   })
  //   .catch((error) => {
  //     res.status(400).json('Error: ' + error);
  //   });
  Eshkol.find({ jobinmahzor: req.params.jobinmahzorid})
  .then((result) => res.json(result))
  .catch((err) => res.status(400).json("Error: " + err));
};

exports.eshkolbyid = (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //id
  if (req.params.id != 'undefined') {
    andquery.push({ "_id": mongoose.Types.ObjectId(req.params.id) });
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

  Eshkol.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};