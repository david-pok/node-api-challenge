const express = require("express");

const router = express.Router();

const Act = require("../../data/helpers/actionModel");

router.get("/", (req, res) => {
  Act.get()
    .then(acts => {
      res.status(200).json(acts);
    })
    .catch(err => {
      console.error("Error getting actions from DB...", err);
      res.status(500).json({
        errorMessage: "actions could not be retrieved"
      });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  Act.update(id, req.body)
    .then(updated => {
      if (updated === null) {
        res.status(500).json({
          error: "action with that id does not exist"
        });
      } else res.status(200).json(updated);
    })
    .catch(err => {
      res.status(500).json({ error: "error updating action" });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Act.remove(id)
    .then(rmvd => {
      if (rmvd === 1) {
        res.status(200).json({ message: `${rmvd} item deleted` });
      } else
        res.status(500).json({ error: "action with that id does not exist" });
    })
    .catch(err => {
      res.status(500).json({
        error: "error removing post"
      });
    });
});

module.exports = router;
