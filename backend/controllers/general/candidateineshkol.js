const Candidateineshkol = require("../../models/general/candidateineshkol");

exports.findById = async(req, res) => {
  const candidateineshkol = await Candidateineshkol.findOne().where({_id:req.params.id})
  
  if(!candidateineshkol){
      res.status(500).json({success: false})
  }
  res.send(candidateineshkol)
  
 }

exports.find = (req, res) => {
    Candidateineshkol.find()
    .then((candidateineshkol) => res.json(candidateineshkol))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const candidateineshkol = new Candidateineshkol(req.body);
  candidateineshkol.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Candidateineshkol.findByIdAndUpdate(req.params.candidateineshkolId,req.body)
    .then((candidateineshkol) => res.json(candidateineshkol))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Candidateineshkol.deleteOne({ _id: req.params.id })
    .then((candidateineshkol) => res.json(candidateineshkol))
    .catch((err) => res.status(400).json("Error: " + err));
};