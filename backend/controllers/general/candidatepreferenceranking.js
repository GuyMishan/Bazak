const Candidatepreferenceranking = require("../../models/general/candidatepreferenceranking");

exports.findById = async(req, res) => {
  const candidatepreferenceranking = await Candidatepreferenceranking.findOne().where({_id:req.params.id})
  
  if(!candidatepreferenceranking){
      res.status(500).json({success: false})
  }
  res.send(candidatepreferenceranking)
  
 }

exports.find = (req, res) => {
    Candidatepreferenceranking.find()
    .then((candidatepreferenceranking) => res.json(candidatepreferenceranking))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const candidatepreferenceranking = new Candidatepreferenceranking(req.body);
  candidatepreferenceranking.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Candidatepreferenceranking.findByIdAndUpdate(req.params.candidatepreferencerankingId,req.body)
    .then((candidatepreferenceranking) => res.json(candidatepreferenceranking))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Candidatepreferenceranking.deleteOne({ _id: req.params.id })
    .then((candidatepreferenceranking) => res.json(candidatepreferenceranking))
    .catch((err) => res.status(400).json("Error: " + err));
};