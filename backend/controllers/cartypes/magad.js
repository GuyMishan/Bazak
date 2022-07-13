const Magad = require("../../models/cartypes/magad");

exports.read = async (req, res) => {
  const magad = await Magad.findById(req.params.id);
  if (!magad) {
    res.status(500).json({ message: 'האימון לא נמצא' })
  } else {
    res.status(200).send([magad])
  }

}

exports.find = (req, res) => {
  Magad.find().sort({index: 1})
    .then((magad) => res.json(magad))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const magad = new Magad(req.body);
  magad.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  Magad.deleteOne({ _id: req.params.id })
    .then((magad) => res.json(magad))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.update = (req, res) => {
  Magad.updateOne({ _id: req.body[0] }, req.body[1])
    .then(magad => res.json(magad))
    .catch(err => res.status(400).json('Error: ' + err));;
}

exports.magadsbymagadal = (req, res) => {
  Magad.find({ magadal: req.params.magadalid }).sort({index: 1})
    .then((magad) => res.json(magad))
    .catch((err) => res.status(400).json("Error: " + err));
};