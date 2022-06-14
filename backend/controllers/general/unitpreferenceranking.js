const Unitpreferenceranking = require("../../models/general/unitpreferenceranking");

exports.findById = async(req, res) => {
  const unitpreferenceranking = await Unitpreferenceranking.findOne().where({_id:req.params.id})
  
  if(!unitpreferenceranking){
      res.status(500).json({success: false})
  }
  res.send(unitpreferenceranking)
  
 }

exports.find = (req, res) => {
    Unitpreferenceranking.find()
    .then((unitpreferenceranking) => res.json(unitpreferenceranking))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const unitpreferenceranking = new Unitpreferenceranking(req.body);
  unitpreferenceranking.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Unitpreferenceranking.findByIdAndUpdate(req.params.unitpreferencerankingId,req.body)
    .then((unitpreferenceranking) => res.json(unitpreferenceranking))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Unitpreferenceranking.deleteOne({ _id: req.params.id })
    .then((unitpreferenceranking) => res.json(unitpreferenceranking))
    .catch((err) => res.status(400).json("Error: " + err));
};