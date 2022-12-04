const Mkabaz = require("../../models/cartypes/mkabaz");

exports.read = async (req, res) => {
  const mkabaz = await Mkabaz.findById(req.params.id);
  if (!mkabaz) {
    res.status(500).json({ message: 'האימון לא נמצא' })
  } else {
    res.status(200).send([mkabaz])
  }

}

exports.findById = async(req, res) => {
  const mkabaz = await Mkabaz.findOne().where({_id:req.params.id})
  if(!mkabaz){
      res.status(500).json({success: false})
  }
  res.send(mkabaz)
  
 }

exports.find = (req, res) => {
  Mkabaz.find().sort({index: 1})
    .then((mkabaz) => res.json(mkabaz))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const mkabaz = new Mkabaz(req.body);
  mkabaz.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  Mkabaz.deleteOne({ _id: req.params.id })
    .then((mkabaz) => res.json(mkabaz))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.update = (req, res) => {
  Mkabaz.updateOne({ _id: req.body[0] }, req.body[1])
    .then(mkabaz => res.json(mkabaz))
    .catch(err => res.status(400).json('Error: ' + err));;
}

exports.mkabazsbymagad = (req, res) => {
  Mkabaz.find({ magad: req.params.magadid }).sort({index: 1})
    .then((mkabaz) => res.json(mkabaz))
    .catch((err) => res.status(400).json("Error: " + err));
};