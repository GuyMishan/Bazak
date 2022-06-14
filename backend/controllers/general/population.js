const Population = require("../../models/general/population");

exports.findById = async(req, res) => {
  const population = await Population.findOne().where({_id:req.params.id})
  
  if(!population){
      res.status(500).json({success: false})
  }
  res.send(population)
  
 }

exports.find = (req, res) => {
    Population.find()
    .then((population) => res.json(population))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const population = new Population(req.body);
  population.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Population.findByIdAndUpdate(req.params.populationId,req.body)
    .then((population) => res.json(population))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Population.deleteOne({ _id: req.params.id })
    .then((population) => res.json(population))
    .catch((err) => res.status(400).json("Error: " + err));
};