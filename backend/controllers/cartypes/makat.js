const Makat = require("../../models/cartypes/makat");

exports.read = async (req, res) => {
  const makat = await Makat.findById(req.params.id);
  if (!makat) {
    res.status(500).json({ message: 'האימון לא נמצא' })
  } else {
    res.status(200).send([makat])
  }

}
exports.findById = async(req, res) => {
  const makat = await Makat.findOne().where({_id:req.params.id})
  
  if(!makat){
      res.status(500).json({success: false})
  }
  res.send(makat)
  
 }

exports.find = (req, res) => {
  Makat.find().sort({index: 1})
    .then((makat) => res.json(makat))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const makat = new Makat(req.body);
  makat.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  Makat.deleteOne({ _id: req.params.id })
    .then((makat) => res.json(makat))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.update = (req, res) => {
  Makat.updateOne({ _id: req.body[0] }, req.body[1])
    .then(makat => res.json(makat))
    .catch(err => res.status(400).json('Error: ' + err));;
}

exports.makatsbymkabaz = (req, res) => {
  Makat.find({ mkabaz: req.params.mkabazid }).sort({index: 1})
    .then((makat) => res.json(makat))
    .catch((err) => res.status(400).json("Error: " + err));
};