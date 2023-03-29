const CarDataFilter = require("../../models/filters/CarDataFilter");

exports.read = async (req, res) => {
  const cardatafilter = await CarDataFilter.findById(req.params.id);
  if (!cardatafilter) {
    res.status(500).json({ message: 'הסינון לא נמצא' })
  } else {
    res.status(200).send([cardatafilter])
  }
}

exports.find = (req, res) => {
  CarDataFilter.find()
    .then((chart) => res.json(chart))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const chart = new CarDataFilter(req.body);
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
  CarDataFilter.findOneAndUpdate({filterid: req.params.filterId}, req.body)
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
}

exports.remove = (req, res) => {
  CarDataFilter.deleteOne({ filterid: req.params.id })
    .then((filter) => res.json(filter))
    .catch((err) => res.status(400).json("Error: " + err));
};

//

exports.cardatafilterbyuserperonalnumber = (req, res) => {
  CarDataFilter.find({ userperonalnumber: req.params.userperonalnumber })
    .then((filter) => res.json(filter))
    .catch((err) => res.status(400).json("Error: " + err));
};

//

exports.cardatafilterbyfilterid = (req, res) => {
  CarDataFilter.find({filterid: req.params.filterid})
    .then((filter) => res.json(filter))
    .catch((err) => res.status(400).json("Error: " + err));
};