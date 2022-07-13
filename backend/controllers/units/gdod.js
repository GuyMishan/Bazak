const Gdod = require("../../models/units/gdod");

exports.findById = async(req, res) => {
  const gdod = await Gdod.findOne().where({_id:req.params.id})
  
  if(!gdod){
      res.status(500).json({success: false})
  }
  res.send(gdod)
  
 }


exports.find = (req, res) => {
    Gdod.find().sort({index: 1})
    .then((gdod) => res.json(gdod))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const gdod = new Gdod(req.body);
  gdod.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};
exports.update = (req, res) => {
  const gdod = new Gdod(req.body);
  Pikod.updateOne(gdod)
    .then((gdod) => res.json(gdod))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    Gdod.deleteOne({ _id: req.params.id })
    .then((gdod) => res.json(gdod))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.findgdodbyid = (req, res) => {
  Gdod.find({_id: req.body})
  .then(job => res.json(job))
  .catch(err => res.status(400).json('Error: ' + err));
}

exports.updatehativa = (req, res) => {
  Gdod.updateOne({_id: req.body[0]},{hativa:req.body[1]})
  .then(orders => res.json(orders))
  .catch(err => res.status(400).json('Error: ' + err));;
 // console.log(req.body);
}

exports.updatekshirot = (req, res) => {
  Gdod.updateOne({_id: req.body[0]},{kshirot:req.body[1]})
  .then(orders => res.json(orders))
  .catch(err => res.status(400).json('Error: ' + err));;
 // console.log(req.body);
}

exports.updatehistory = (req, res) => {
  Gdod.updateOne({_id: req.body[0]}, { $push: { history: req.body[1] } })
  .then(orders => res.json(orders))
  .catch(err => res.status(400).json('Error: ' + err));;
 // console.log(req.body);
}

exports.updatetraining = (req, res) => {
  Gdod.updateOne({_id: req.body[0]},{training:req.body[1]})
  .then(orders => res.json(orders))
  .catch(err => res.status(400).json('Error: ' + err));;
 // console.log(req.body);
}

exports.updatetraininghistory = (req, res) => {
  Gdod.updateOne({_id: req.body[0]}, { $push: { traininghistory: req.body[1] } })
  .then(orders => res.json(orders))
  .catch(err => res.status(400).json('Error: ' + err));;
 // console.log(req.body);
}

exports.updateallhistoryarray = (req, res) => {
  Gdod.updateOne({ _id: req.body[0] }, { history: req.body[1] })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));;
  // console.log(req.body);
}

exports.updatealltraininghistoryarray = (req, res) => {
  Gdod.updateOne({ _id: req.body[0] }, { traininghistory: req.body[1] })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));;
  // console.log(req.body);
}

exports.gdodsbyhativaid = (req, res) => {
  Gdod.find({hativa: req.body.hativa}).sort({index: 1})
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));;
  // console.log(req.body);
}