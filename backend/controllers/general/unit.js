const Unit = require("../../models/general/unit");

exports.findById = async(req, res) => {
  const unit = await Unit.findOne().where({_id:req.params.id})
  
  if(!unit){
      res.status(500).json({success: false})
  }
  res.send(unit)
  
 }

exports.find = (req, res) => {
    Unit.find()
    .then((unit) => res.json(unit))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const unit = new Unit(req.body);
  unit.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  const unit = new Unit(req.body);
  Unit.updateOne(unit)
    .then((unit) => res.json(unit))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Unit.deleteOne({ _id: req.params.id })
    .then((unit) => res.json(unit))
    .catch((err) => res.status(400).json("Error: " + err));
};