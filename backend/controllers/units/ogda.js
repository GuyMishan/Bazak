const Ogda = require("../../models/units/ogda");

exports.findById = async(req, res) => {
  const ogda = await Ogda.findOne().where({_id:req.params.id})
  if(!ogda){
      res.status(500).json({success: false})
  }
  res.send(ogda)
  
 }

exports.find = (req, res) => {
  Ogda.find().sort({index: 1})
    .then((ogda) => res.json(ogda))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const ogda = new Ogda(req.body);
  ogda.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};
exports.update = (req, res) => {
  const ogda = new Ogda(req.body);
  Ogda.updateOne(ogda)
    .then((ogda) => res.json(ogda))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
  Ogda.deleteOne({ _id: req.params.id })
    .then((ogda) => res.json(ogda))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.findogdabyid = (req, res) => {
  Ogda.find({ _id: req.body })
    .then(job => res.json(job))
    .catch(err => res.status(400).json('Error: ' + err));
}

exports.updatepikod = (req, res) => {
  Ogda.updateOne({ _id: req.body[0] }, { pikod: req.body[1] })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));;
  // console.log(req.body);
}

exports.updatehativas = (req, res) => {
  Ogda.updateOne({ _id: req.body[0] }, { hativa: req.body[1] })
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));;
  // console.log(req.body);
}

exports.ogdasbypikodid = (req, res) => {
  Ogda.find({ pikod: req.body.pikod }).sort({index: 1})
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));;
  // console.log(req.body);
}