const Magadal = require("../../models/cartypes/magadal");

exports.read = async (req, res) => {
  const magadal = await Magadal.findById(req.params.id);
  if (!magadal) {
    res.status(500).json({ message: 'האימון לא נמצא' })
  } else {
    res.status(200).send([magadal])
  }

}

exports.find = (req, res) => {
  Magadal.find()
    .then((magadal) => res.json(magadal))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const magadal = new Magadal(req.body);
  magadal.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  Magadal.deleteOne({ _id: req.params.id })
    .then((magadal) => res.json(magadal))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.update = (req, res) => {
  Magadal.updateOne({ _id: req.body[0] }, req.body[1])
    .then(magadal => res.json(magadal))
    .catch(err => res.status(400).json('Error: ' + err));;
}