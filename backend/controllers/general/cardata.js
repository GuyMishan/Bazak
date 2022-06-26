const Cardata = require("../../models/general/cardata");

exports.read = async (req, res) => {
  const cardata = await Cardata.findById(req.params.id);
  if (!cardata) {
    res.status(500).json({ message: 'האימון לא נמצא' })
  } else {
    res.status(200).send([cardata])
  }
}

exports.find = (req, res) => {
  Cardata.find()
    .then((cardata) => res.json(cardata))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const cardata = new Cardata(req.body);
  cardata.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Cardata.findByIdAndUpdate(req.params.cardataId, req.body)
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
}

exports.remove = (req, res) => {
  Cardata.deleteOne({ _id: req.params.id })
    .then((cardata) => res.json(cardata))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.cardatabyunittypeandunitid = (req, res) => {
  if (req.params.unittype == 'admin' && req.params.unitid == '0') {
    Cardata.find({ pikod: { $ne: null }, ogda: { $ne: null }, hativa: { $ne: null }, gdod: { $ne: null } })
      .then((cardata) => res.json(cardata))
      .catch((err) => res.status(400).json("Error: " + err));
  }
  else
    if (req.params.unittype == 'pikod') {
      Cardata.find({ pikod: req.params.unitid })
        .then((cardata) => res.json(cardata))
        .catch((err) => res.status(400).json("Error: " + err));
    }
    else
      if (req.params.unittype == 'ogda') {
        Cardata.find({ ogda: req.params.unitid })
          .then((cardata) => res.json(cardata))
          .catch((err) => res.status(400).json("Error: " + err));
      }
      else
        if (req.params.unittype == 'hativa') {
          Cardata.find({ hativa: req.params.unitid })
            .then((cardata) => res.json(cardata))
            .catch((err) => res.status(400).json("Error: " + err));
        }
        else
          if (req.params.unittype == 'gdod') {
            Cardata.find({ gdod: req.params.unitid })
              .then((cardata) => res.json(cardata))
              .catch((err) => res.status(400).json("Error: " + err));
          }
          else
            if (req.params.unittype == 'notype') {
              Cardata.find({ pikod: null, ogda: null, hativa: null, gdod: null })
              .then((cardata) => res.json(cardata))
              .catch((err) => res.status(400).json("Error: " + err));
            }
};

exports.cardatabycarnumber = (req, res) => {
  Cardata.find({ carnumber: req.params.carnumber })
    .then((cardata) => res.json(cardata))
    .catch((err) => res.status(400).json("Error: " + err));
};