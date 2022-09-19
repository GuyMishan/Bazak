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
    Cardata.find({ pikod: { $ne: null }, ogda: { $ne: null }, hativa: { $ne: null }, gdod: { $ne: null } }).where({ status: { $ne: 'מושבת' } })
      .then((cardata) => res.json(cardata))
      .catch((err) => res.status(400).json("Error: " + err));
  }
  else
    if (req.params.unittype == 'pikod') {
      Cardata.find({ pikod: req.params.unitid }).where({ status: { $ne: 'מושבת' } })
        .then((cardata) => res.json(cardata))
        .catch((err) => res.status(400).json("Error: " + err));
    }
    else
      if (req.params.unittype == 'ogda') {
        Cardata.find({ ogda: req.params.unitid }).where({ status: { $ne: 'מושבת' } })
          .then((cardata) => res.json(cardata))
          .catch((err) => res.status(400).json("Error: " + err));
      }
      else
        if (req.params.unittype == 'hativa') {
          Cardata.find({ hativa: req.params.unitid }).where({ status: { $ne: 'מושבת' } })
            .then((cardata) => res.json(cardata))
            .catch((err) => res.status(400).json("Error: " + err));
        }
        else
          if (req.params.unittype == 'gdod') {
            Cardata.find({ gdod: req.params.unitid }).where({ status: { $ne: 'מושבת' } })
              .then((cardata) => res.json(cardata))
              .catch((err) => res.status(400).json("Error: " + err));
          }
          else
            if (req.params.unittype == 'notype') {
              Cardata.find({ pikod: null, ogda: null, hativa: null, gdod: null }).where({ status: { $ne: 'מושבת' } })
                .then((cardata) => res.json(cardata))
                .catch((err) => res.status(400).json("Error: " + err));
            }
};

exports.cardatabycarnumber = (req, res) => {
  Cardata.find({ carnumber: req.params.carnumber })
    .then((cardata) => res.json(cardata))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.cardatabyunittypeandunitid_mushbat = (req, res) => {
  if (req.params.unittype == 'admin' && req.params.unitid == '0') {
    Cardata.find({ pikod: { $ne: null }, ogda: { $ne: null }, hativa: { $ne: null }, gdod: { $ne: null } }).where({ status: 'מושבת' })
      .then((cardata) => res.json(cardata))
      .catch((err) => res.status(400).json("Error: " + err));
  }
  else
    if (req.params.unittype == 'pikod') {
      Cardata.find({ pikod: req.params.unitid }).where({ status: 'מושבת' })
        .then((cardata) => res.json(cardata))
        .catch((err) => res.status(400).json("Error: " + err));
    }
    else
      if (req.params.unittype == 'ogda') {
        Cardata.find({ ogda: req.params.unitid }).where({ status: 'מושבת' })
          .then((cardata) => res.json(cardata))
          .catch((err) => res.status(400).json("Error: " + err));
      }
      else
        if (req.params.unittype == 'hativa') {
          Cardata.find({ hativa: req.params.unitid }).where({ status: 'מושבת' })
            .then((cardata) => res.json(cardata))
            .catch((err) => res.status(400).json("Error: " + err));
        }
        else
          if (req.params.unittype == 'gdod') {
            Cardata.find({ gdod: req.params.unitid }).where({ status: 'מושבת' })
              .then((cardata) => res.json(cardata))
              .catch((err) => res.status(400).json("Error: " + err));
          }
          else
            if (req.params.unittype == 'notype') {
              Cardata.find({ pikod: null, ogda: null, hativa: null, gdod: null }).where({ status: 'מושבת' })
                .then((cardata) => res.json(cardata))
                .catch((err) => res.status(400).json("Error: " + err));
            }
};

exports.cardatabyunittypeandunitidandcartypeandcarid = (req, res) => {
  if (req.params.unittype == 'admin' && req.params.unitid == '0') {
    if (req.params.cartype == 'magadal' && req.params.carid == '0') {
      Cardata.find({ pikod: { $ne: null }, ogda: { $ne: null }, hativa: { $ne: null }, gdod: { $ne: null }, magadal: { $ne: null }, magad: { $ne: null }, mkabaz: { $ne: null }, makat: { $ne: null } }).where({ status: { $ne: 'מושבת' } })
        .then((cardata) => res.json(cardata))
        .catch((err) => res.status(400).json("Error: " + err));
    }
    else
      if (req.params.cartype == 'magad') {
        Cardata.find({ pikod: { $ne: null }, ogda: { $ne: null }, hativa: { $ne: null }, gdod: { $ne: null }, magadal: req.params.carid }).where({ status: { $ne: 'מושבת' } })
          .then((cardata) => res.json(cardata))
          .catch((err) => res.status(400).json("Error: " + err));
      }
      else
        if (req.params.cartype == 'mkabaz') {
          Cardata.find({ pikod: { $ne: null }, ogda: { $ne: null }, hativa: { $ne: null }, gdod: { $ne: null }, magad: req.params.carid }).where({ status: { $ne: 'מושבת' } })
            .then((cardata) => res.json(cardata))
            .catch((err) => res.status(400).json("Error: " + err));
        }
  }
  else
    if (req.params.unittype == 'pikod') {
      if (req.params.cartype == 'magadal' && req.params.carid == '0') {
        Cardata.find({ pikod: req.params.unitid, magadal: { $ne: null }, magad: { $ne: null }, mkabaz: { $ne: null }, makat: { $ne: null } }).where({ status: { $ne: 'מושבת' } })
          .then((cardata) => res.json(cardata))
          .catch((err) => res.status(400).json("Error: " + err));
      }
      else
        if (req.params.cartype == 'magad') {
          Cardata.find({ pikod: req.params.unitid, magadal: req.params.carid }).where({ status: { $ne: 'מושבת' } })
            .then((cardata) => res.json(cardata))
            .catch((err) => res.status(400).json("Error: " + err));
        }
        else
          if (req.params.cartype == 'mkabaz') {
            Cardata.find({ pikod: req.params.unitid, magad: req.params.carid }).where({ status: { $ne: 'מושבת' } })
              .then((cardata) => res.json(cardata))
              .catch((err) => res.status(400).json("Error: " + err));
          }
    }
    else
      if (req.params.unittype == 'ogda') {
        if (req.params.cartype == 'magadal' && req.params.carid == '0') {
          Cardata.find({ ogda: req.params.unitid, magadal: { $ne: null }, magad: { $ne: null }, mkabaz: { $ne: null }, makat: { $ne: null } }).where({ status: { $ne: 'מושבת' } })
            .then((cardata) => res.json(cardata))
            .catch((err) => res.status(400).json("Error: " + err));
        }
        else
          if (req.params.cartype == 'magad') {
            Cardata.find({ ogda: req.params.unitid, magadal: req.params.carid }).where({ status: { $ne: 'מושבת' } })
              .then((cardata) => res.json(cardata))
              .catch((err) => res.status(400).json("Error: " + err));
          }
          else
            if (req.params.cartype == 'mkabaz') {
              Cardata.find({ ogda: req.params.unitid, magad: req.params.carid }).where({ status: { $ne: 'מושבת' } })
                .then((cardata) => res.json(cardata))
                .catch((err) => res.status(400).json("Error: " + err));
            }
      }
      else
        if (req.params.unittype == 'hativa') {
          if (req.params.cartype == 'magadal' && req.params.carid == '0') {
            Cardata.find({ hativa: req.params.unitid, magadal: { $ne: null }, magad: { $ne: null }, mkabaz: { $ne: null }, makat: { $ne: null } }).where({ status: { $ne: 'מושבת' } })
              .then((cardata) => res.json(cardata))
              .catch((err) => res.status(400).json("Error: " + err));
          }
          else
            if (req.params.cartype == 'magad') {
              Cardata.find({ hativa: req.params.unitid, magadal: req.params.carid }).where({ status: { $ne: 'מושבת' } })
                .then((cardata) => res.json(cardata))
                .catch((err) => res.status(400).json("Error: " + err));
            }
            else
              if (req.params.cartype == 'mkabaz') {
                Cardata.find({ hativa: req.params.unitid, magad: req.params.carid }).where({ status: { $ne: 'מושבת' } })
                  .then((cardata) => res.json(cardata))
                  .catch((err) => res.status(400).json("Error: " + err));
              }
        }
        else
          if (req.params.unittype == 'gdod') {
            if (req.params.cartype == 'magadal' && req.params.carid == '0') {
              Cardata.find({ gdod: req.params.unitid, magadal: { $ne: null }, magad: { $ne: null }, mkabaz: { $ne: null }, makat: { $ne: null } }).where({ status: { $ne: 'מושבת' } })
                .then((cardata) => res.json(cardata))
                .catch((err) => res.status(400).json("Error: " + err));
            }
            else
              if (req.params.cartype == 'magad') {
                Cardata.find({ gdod: req.params.unitid, magadal: req.params.carid }).where({ status: { $ne: 'מושבת' } })
                  .then((cardata) => res.json(cardata))
                  .catch((err) => res.status(400).json("Error: " + err));
              }
              else
                if (req.params.cartype == 'mkabaz') {
                  Cardata.find({ gdod: req.params.unitid, magad: req.params.carid }).where({ status: { $ne: 'מושבת' } })
                    .then((cardata) => res.json(cardata))
                    .catch((err) => res.status(400).json("Error: " + err));
                }
          }
          else
            if (req.params.unittype == 'notype') {
              if (req.params.cartype == 'magadal' && req.params.carid == '0') {
                Cardata.find({ pikod: null, ogda: null, hativa: null, gdod: null, magadal: { $ne: null }, magad: { $ne: null }, mkabaz: { $ne: null }, makat: { $ne: null } }).where({ status: { $ne: 'מושבת' } })
                  .then((cardata) => res.json(cardata))
                  .catch((err) => res.status(400).json("Error: " + err));
              }
              else
                if (req.params.cartype == 'magad') {
                  Cardata.find({ pikod: null, ogda: null, hativa: null, gdod: null, magadal: req.params.carid }).where({ status: { $ne: 'מושבת' } })
                    .then((cardata) => res.json(cardata))
                    .catch((err) => res.status(400).json("Error: " + err));
                }
                else
                  if (req.params.cartype == 'mkabaz') {
                    Cardata.find({ pikod: null, ogda: null, hativa: null, gdod: null, magad: req.params.carid }).where({ status: { $ne: 'מושבת' } })
                      .then((cardata) => res.json(cardata))
                      .catch((err) => res.status(400).json("Error: " + err));
                  }
            }
};