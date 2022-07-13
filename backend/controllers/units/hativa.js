const Hativa = require("../../models/units/hativa");

exports.findById = async(req, res) => {
  const hativa = await Hativa.findOne().where({_id:req.params.id})
  if(!hativa){
      res.status(500).json({success: false})
  }
  res.send(hativa)
  
 }
exports.find = (req, res) => {
    Hativa.find().sort({index: 1})
    .then((hativa) => res.json(hativa))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const hativa = new Hativa(req.body);
  hativa.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};
exports.update = (req, res) => {
  const hativa = new Hativa(req.body);
  Pikod.updateOne(hativa)
    .then((hativa) => res.json(hativa))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Hativa.deleteOne({ _id: req.params.id })
    .then((hativa) => res.json(hativa))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.findhativabyid = (req, res) => {
  Hativa.find({_id: req.body})
  .then(job => res.json(job))
  .catch(err => res.status(400).json('Error: ' + err));
}

exports.updateogda = (req, res) => {
  Hativa.updateOne({_id: req.body[0]},{ogda:req.body[1]})
  .then(orders => res.json(orders))
  .catch(err => res.status(400).json('Error: ' + err));;
 // console.log(req.body);
}

exports.updategdods = (req, res) => {
  Hativa.updateOne({ _id: req.body[0] }, { gdod: req.body[1] })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));;
  // console.log(req.body);
}

exports.updatematag = (req, res) => {
  Hativa.updateOne({_id:req.body[0]},{matag:req.body[1]})
  .then(orders => res.json(orders))
  .catch(err => res.status(400).json('Error: ' + err));;
  console.log(req.body);
}

exports.updatemataghistory = (req, res) => {
  Hativa.updateOne({_id:req.body[0]}, { $push: { mataghistory: req.body[1] } })
  .then(orders => res.json(orders))
  .catch(err => res.status(400).json('Error: ' + err));;
  console.log(req.body);
}

exports.updateallmataghistoryarray = (req, res) => {
  Hativa.updateOne({ _id: req.body[0] }, { mataghistory: req.body[1] })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));;
  // console.log(req.body);
}

exports.hativasbyogdaid = (req, res) => {
  Hativa.find({ogda: req.body.ogda}).sort({index: 1})
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));;
  // console.log(req.body);
}