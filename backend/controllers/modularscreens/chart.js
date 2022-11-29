const Chart = require("../../models/modularscreens/chart");

exports.read = async (req, res) => {
  const chart = await Chart.findById(req.params.id);
  if (!chart) {
    res.status(500).json({ message: 'השעון לא נמצא' })
  } else {
    res.status(200).send([chart])
  }
}

exports.find = (req, res) => {
  Chart.find()
    .then((chart) => res.json(chart))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const chart = new Chart(req.body);
  chart.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Chart.findByIdAndUpdate(req.params.chartId, req.body)
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
}

exports.remove = (req, res) => {
  Chart.deleteOne({ chartid: req.params.id })
    .then((chart) => res.json(chart))
    .catch((err) => res.status(400).json("Error: " + err));
};

//

exports.chartsbyscreenid = (req, res) => {
  Chart.find({ screenid: req.params.screenid })
    .then((chart) => res.json(chart))
    .catch((err) => res.status(400).json("Error: " + err));
};

//

exports.chartbychartid = (req, res) => {
  Chart.find({chartid: req.params.chartid})
    .then((chart) => res.json(chart))
    .catch((err) => res.status(400).json("Error: " + err));
};