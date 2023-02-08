const Tipul = require("../../models/tipuls/tipul");

exports.findById = async(req, res) => {
  const tipul = await Tipul.findOne().where({_id:req.params.id})
  
  if(!tipul){
      res.status(500).json({success: false})
  }
  res.send(tipul)
  
 }


exports.find = (req, res) => {
    Tipul.find().sort({index: 1})
    .then((tipuls) => res.json(tipuls))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const tipul = new Tipul(req.body);
  tipul.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};
exports.update = (req, res) => {
  const tipul = new Tipul(req.body);
  Tipul.updateOne(tipul)
    .then((tipuls) => res.json(tipuls))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Tipul.deleteOne({ _id: req.params.id })
    .then((tipuls) => res.json(tipuls))
    .catch((err) => res.status(400).json("Error: " + err));
};