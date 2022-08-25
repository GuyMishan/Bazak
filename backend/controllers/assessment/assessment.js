const Assessment = require("../../models/assessment/assessment");

exports.read = async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);
  if (!assessment) {
    res.status(500).json({ message: 'האימון לא נמצא' })
  } else {
    res.status(200).send([assessment])
  }
}

exports.find = (req, res) => {
  Assessment.find()
    .then((assessment) => res.json(assessment))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const assessment = new Assessment(req.body);
  assessment.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Assessment.findByIdAndUpdate(req.params.assessmentId, req.body)
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
}

exports.remove = (req, res) => {
  Assessment.deleteOne({ _id: req.params.id })
    .then((assessment) => res.json(assessment))
    .catch((err) => res.status(400).json("Error: " + err));
};