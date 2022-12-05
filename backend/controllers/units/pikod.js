const Pikod = require("../../models/units/pikod");

exports.findById = async(req, res) => {
  const pikod = await Pikod.findOne().where({_id:req.params.id})
  if(!pikod){
      res.status(500).json({success: false})
  }
  res.send(pikod)
  
 }

exports.find = (req, res) => {
  Pikod.find().sort({index: 1})
    .then((pikods) => res.json(pikods))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const pikod = new Pikod(req.body);
  pikod.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};
exports.update = (req, res) => {
  const pikod = new Pikod(req.body);
  Pikod.updateOne(pikod)
    .then((pikods) => res.json(pikods))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
  Pikod.deleteOne({ _id: req.params.id })
    .then((pikods) => res.json(pikods))
    .catch((err) => res.status(400).json("Error: " + err));
};


exports.findpikodbyid = (req, res) => {
  Pikod.find({_id: req.body})
  .then(job => res.json(job))
  .catch(err => res.status(400).json('Error: ' + err));
}


exports.updateogdas = (req, res) => {
  Pikod.updateOne({_id: req.body[0]},{ogda:req.body[1]})
  .then(orders => res.json(orders))
  .catch(err => res.status(400).json('Error: ' + err));;
 // console.log(req.body);
}
