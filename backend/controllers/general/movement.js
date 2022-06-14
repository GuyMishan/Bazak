const Movement = require("../../models/general/movement");

exports.findById = async(req, res) => {
  const movement = await Movement.findOne().where({_id:req.params.id})
  
  if(!movement){
      res.status(500).json({success: false})
  }
  res.send(movement)
  
 }

exports.find = (req, res) => {
    Movement.find()
    .then((movement) => res.json(movement))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const movement = new Movement(req.body);
  movement.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Movement.findByIdAndUpdate(req.params.movementId,req.body)
    .then((movement) => res.json(movement))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Movement.deleteOne({ _id: req.params.id })
    .then((movement) => res.json(movement))
    .catch((err) => res.status(400).json("Error: " + err));
};