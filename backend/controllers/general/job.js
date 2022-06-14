const Job = require("../../models/general/job");
const mongoose = require('mongoose');

let readtipul = [
  {
    $lookup: {
      from: "units",
      localField: "unit",
      foreignField: "_id",
      as: "unit"
    }
  },
  {
    $unwind: "$unit"
  },
  {
    $lookup: {
      from: "users",
      localField: "meaish",
      foreignField: "_id",
      as: "meaish"
    }
  },
  {
    $unwind: "$meaish"
  },
  {
    $lookup: {
      from: "users",
      localField: "commander",
      foreignField: "_id",
      as: "commander"
    }
  },
  {
    $unwind: "$commander"
  },
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
];

let readtipul2 = [
  {
    $lookup: {
      from: "units",
      localField: "unit",
      foreignField: "_id",
      as: "unit"
    }
  },
  {
    $unwind: "$unit"
  },
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
];

let readtipul3 = [
  {
    $lookup: {
      from: "units",
      localField: "unit",
      foreignField: "_id",
      as: "unit"
    }
  },
  {
    $unwind: "$unit"
  }
];

let readtipul4 = [
  {
    $lookup: {
      from: "units",
      localField: "unit",
      foreignField: "_id",
      as: "unit"
    }
  },
  {
    $unwind: "$unit"
  },
  {
    $lookup: {
      from: "users",
      localField: "meaish",
      foreignField: "_id",
      as: "meaish"
    }
  },
  {
    $unwind: "$meaish"
  },
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
];

let readtipul5 = [
  {
    $lookup: {
      from: "units",
      localField: "unit",
      foreignField: "_id",
      as: "unit"
    }
  },
  {
    $unwind: "$unit"
  },
  {
    $lookup: {
      from: "users",
      localField: "commander",
      foreignField: "_id",
      as: "commander"
    }
  },
  {
    $unwind: "$commander"
  },
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
];
exports.findById = async(req, res) => {
  let tipulfindquerry = readtipul2.slice();
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

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

 exports.smartjobbyid = async(req, res) => {
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

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

exports.find = (req, res) => {
    Job.find()
    .then((job) => res.json(job))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const job = new Job(req.body);
  job.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Job.findByIdAndUpdate(req.params.jobId,req.body)
    .then((job) => res.json(job))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Job.deleteOne({ _id: req.params.id })
    .then((job) => res.json(job))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.smartjobs = async(req, res) => {
  let tipulfindquerry = readtipul2.slice();
  let finalquerry = tipulfindquerry;

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

exports.jobsbymahzorid = async(req, res) => {
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

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

 exports.smartjobs2 = async(req, res) => {
  let tipulfindquerry = readtipul.slice();
  let finalquerry = tipulfindquerry;

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

 exports.smartjobs3 = async(req, res) => {
  let tipulfindquerry = readtipul3.slice();
  let finalquerry = tipulfindquerry;

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

 exports.jobsbypopulation = (req, res) => {
  Job.find({population: req.params.population })
      .then(orders => res.json(orders))
      .catch(err => res.status(400).json('Error: ' + err));
}

exports.jobbyjobcode = (req, res) => {
  // Job.find({jobcode: req.params.jobcode })
  //     .then(orders => res.json(orders))
  //     .catch(err => res.status(400).json('Error: ' + err));
  let tempnumberedjobcode=parseInt(req.params.jobcode)
  let tipulfindquerry = readtipul3.slice();
  let finalquerry = tipulfindquerry;

  let andquery = [];

  //jobcode
    andquery.push({ "jobcode": tempnumberedjobcode});

    let matchquerry = {
      "$match": {
        "$and": andquery
      }
    };
    finalquerry.push(matchquerry)

  // console.log(matchquerry)
  // console.log(andquery)

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
}

exports.smartjobbyidwithoutcommander = async(req, res) => {
  let tipulfindquerry = readtipul4.slice();
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

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }

 exports.smartjobbyidwithoutmeaish = async(req, res) => {
  let tipulfindquerry = readtipul5.slice();
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

  Job.aggregate(finalquerry)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json('Error: ' + error);
    });
 }