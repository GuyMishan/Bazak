const Ramam = require("../../models/ramam/ramam");

exports.read = async (req, res) => {
  const ramam = await Ramam.findById(req.params.id);
  if (!ramam) {
    res.status(500).json({ message: 'הרמ"מ לא נמצא' })
  } else {
    res.status(200).send([ramam])
  }
}

exports.find = (req, res) => {
  Ramam.find()
    .then((ramam) => res.json(ramam))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const ramam = new Ramam(req.body);
  ramam.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Ramam.findByIdAndUpdate(req.params.ramamId, req.body)
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
}

exports.remove = (req, res) => {
  Ramam.deleteOne({ _id: req.params.id })
    .then((ramam) => res.json(ramam))
    .catch((err) => res.status(400).json("Error: " + err));
};

//

exports.ramambyunitid = (req, res) => {
  let readtipul = [
    {
      $lookup: {
        from: "users",
        localField: "userid",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    }
  ];

  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //unitid
  if (req.params.unitid != 'undefined') {
    andquery.push({ "unitid": req.params.unitid });
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

  Ramam.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
};