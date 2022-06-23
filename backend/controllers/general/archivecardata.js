const ArchiveCardata = require("../../models/general/archivecardata");

exports.read = async (req, res) => {
  const archivecardata = await ArchiveCardata.findById(req.params.id);
  if (!archivecardata) {
    res.status(500).json({ message: 'האימון לא נמצא' })
  } else {
    res.status(200).send([archivecardata])
  }
}

exports.find = (req, res) => {
  ArchiveCardata.find()
    .then((archivecardata) => res.json(archivecardata))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const archivecardata = new ArchiveCardata(req.body);
  archivecardata.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  ArchiveCardata.findByIdAndUpdate(req.params.archivecardataId, req.body)
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
}

exports.remove = (req, res) => {
  ArchiveCardata.deleteOne({ _id: req.params.id })
    .then((archivecardata) => res.json(archivecardata))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.archivecardatabyunittypeandunitid = (req, res) => {
  if (req.params.unittype == 'admin' && req.params.unitid == '0') {
    ArchiveCardata.find({ pikod: { $ne: null },ogda: { $ne: null },hativa: { $ne: null },gdod: { $ne: null } })
      .then((archivecardata) => res.json(archivecardata))
      .catch((err) => res.status(400).json("Error: " + err));
  }
  else
    if (req.params.unittype == 'pikod') {
      ArchiveCardata.find({ pikod: req.params.unitid })
        .then((archivecardata) => res.json(archivecardata))
        .catch((err) => res.status(400).json("Error: " + err));
    }
    else
      if (req.params.unittype == 'ogda') {
        ArchiveCardata.find({ ogda: req.params.unitid })
          .then((archivecardata) => res.json(archivecardata))
          .catch((err) => res.status(400).json("Error: " + err));
      }
      else
        if (req.params.unittype == 'hativa') {
          ArchiveCardata.find({ hativa: req.params.unitid })
            .then((archivecardata) => res.json(archivecardata))
            .catch((err) => res.status(400).json("Error: " + err));
        }
        else
          if (req.params.unittype == 'gdod') {
            ArchiveCardata.find({ gdod: req.params.unitid })
              .then((archivecardata) => res.json(archivecardata))
              .catch((err) => res.status(400).json("Error: " + err));
          }
};

exports.archivecardatabycarnumber = (req, res) => {
  ArchiveCardata.find({ carnumber: req.params.carnumber })
    .then((archivecardata) => res.json(archivecardata))
    .catch((err) => res.status(400).json("Error: " + err));
};