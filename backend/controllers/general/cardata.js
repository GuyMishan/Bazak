const Cardata = require("../../models/general/cardata");
const mongoose = require('mongoose');

let readtipul = [
  {
    $lookup: {
      from: "gdods",
      localField: "gdod",
      foreignField: "_id",
      as: "gdod_data"
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
  {
    $lookup: {
      from: "makats",
      localField: "makat",
      foreignField: "_id",
      as: "makat_data"
    }
  },
  {
    $unwind: "$makat_data"
  },
  {
    $lookup: {
      from: "mkabazs",
      localField: "makat_data.mkabaz",
      foreignField: "_id",
      as: "mkabaz_data"
    }
  },
  {
    $set: {
      mkabaz: { $arrayElemAt: ["$mkabaz_data._id", 0] }
    }
  },
  {
    $lookup: {
      from: "magads",
      localField: "mkabaz_data.magad",
      foreignField: "_id",
      as: "magad_data"
    }
  },
  {
    $set: {
      magad: { $arrayElemAt: ["$magad_data._id", 0] }
    }
  },
  {
    $lookup: {
      from: "magadals",
      localField: "magad_data.magadal",
      foreignField: "_id",
      as: "magadal_data"
    }
  },
  {
    $set: {
      magadal: { $arrayElemAt: ["$magadal_data._id", 0] }
    }
  },
];

let readtipulnotype = [
  {
    $lookup: {
      from: "makats",
      localField: "makat",
      foreignField: "_id",
      as: "makat_data"
    }
  },
  {
    $unwind: "$makat_data"
  },
  {
    $lookup: {
      from: "mkabazs",
      localField: "makat_data.mkabaz",
      foreignField: "_id",
      as: "mkabaz_data"
    }
  },
  {
    $set: {
      mkabaz: { $arrayElemAt: ["$mkabaz_data._id", 0] }
    }
  },
  {
    $lookup: {
      from: "magads",
      localField: "mkabaz_data.magad",
      foreignField: "_id",
      as: "magad_data"
    }
  },
  {
    $set: {
      magad: { $arrayElemAt: ["$magad_data._id", 0] }
    }
  },
  {
    $lookup: {
      from: "magadals",
      localField: "magad_data.magadal",
      foreignField: "_id",
      as: "magadal_data"
    }
  },
  {
    $set: {
      magadal: { $arrayElemAt: ["$magadal_data._id", 0] }
    }
  },
];

exports.read = async (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  andquery.push({ "_id": mongoose.Types.ObjectId(req.params.id) });

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

  Cardata.aggregate(finalquerry)
    .then((result) => {
      if (result.length != 0) {
        res.json(result);
      }
      else {
        let tipulfindquerry = readtipulnotype.slice();
        let finalquerry = tipulfindquerry;

        let andquery = [];

        andquery.push({ "_id": mongoose.Types.ObjectId(req.params.id) });

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

        Cardata.aggregate(finalquerry)
          .then((result) => {
            res.json(result);
          })
          .catch((error) => {
            res.status(400).json('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
}


exports.find = (req, res) => {
  Cardata.find()
    .then((cardata) => res.json(cardata))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const cardata = new Cardata(req.body);
  cardata.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Cardata.findByIdAndUpdate(req.params.cardataId, req.body, { overwrite: true })
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
}

exports.remove = (req, res) => {
  Cardata.deleteOne({ _id: req.params.id })
    .then((cardata) => res.json(cardata))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.cardatabyunittypeandunitid = (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  switch (req.params.unittype) {
    case 'admin':
      break;
    case 'pikod': andquery.push({ "pikod_data._id": req.params.unitid });
      break;
    case 'ogda': andquery.push({ "ogda_data._id": req.params.unitid });
      break;
    case 'hativa': andquery.push({ "hativa_data._id": req.params.unitid });
      break;
    case 'gdod': andquery.push({ "gdod_data._id": req.params.unitid });
      break;
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

  Cardata.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};

exports.cardatabycarnumber = (req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  andquery.push({ "carnumber": req.params.carnumber });

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

  Cardata.aggregate(finalquerry)
    .then((result) => {
      if(result.length!=0){
        res.json(result);
      }
      else{
        let tipulfindquerry = readtipulnotype.slice();
        let finalquerry = tipulfindquerry;
      
        let andquery = [];
      
        andquery.push({ "carnumber": req.params.carnumber });
      
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
      
        Cardata.aggregate(finalquerry)
          .then((result) => {
              res.json(result);
          })
          .catch((error) => {
            res.status(400).json('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};

exports.cardatanotype = (req, res) => {
  let tipulfindquerry = readtipulnotype.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  andquery.push({ "gdod": null });

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

  Cardata.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};
