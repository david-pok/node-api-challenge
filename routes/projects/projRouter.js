const express = require("express");

const router = express.Router();

const Proj = require("../../data/helpers/projectModel");
const Act = require("../../data/helpers/actionModel");

router.post("/", (req, res) => {
  Proj.insert(req.body)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Error adding project to DB"
      });
    });
});

router.post("/:id/actions", (req, res) => {
  const { id } = req.params;
  req.body.project_id = id;

  Act.insert(req.body)
    .then(posted => {
      res.status(201).json(posted);
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "Error creating new action"
      });
    });
});

router.get("/", (req, res) => {
  Proj.get()
    .then(projs => {
      res.status(200).json(projs);
    })
    .catch(err => {
      console.error("Error getting projects from DB...", err);
      res.status(500).json({
        errorMessage: "Projects could not be retrieved"
      });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Proj.get(id)
    .then(project => {
      if (project === null) {
        res
          .status(500)
          .json({ errorMessage: "project with that id does not exist" });
      } else res.status(200).json(project);
    })
    .catch(err => {
      res.status(404).json({
        errorMessage: "project with that ID does not exist"
      });
    });
});

router.get("/:id/actions", (req, res) => {
  const { id } = req.params;

  Proj.getProjectActions(id)
    .then(actions => {
      if (!actions.length) {
        res.status(204).json({ errorMessage: "no actions for this proj" });
      }
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "Error getting actions from that proj"
      });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Proj.remove(id)
    .then(dltd => {
      if (dltd === 0) {
        res.status(500).json({ errorMessage: "That id does not exist" });
      } else
        res.status(200).json({
          message: `${dltd} resource deleted`
        });
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "error deleting" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  Proj.update(id, req.body)
    .then(updtd => {
      if (updtd === null) {
        res.status(500).json({ error: "no project with that id" });
      } else
        Proj.get(id).then(project => {
          if (project === null) {
            res
              .status(500)
              .json({ errorMessage: "project with that id does not exist" });
          } else res.status(200).json(project);
        });
    })
    .catch(err => {
      res.status(500).json({
        error: "Error updating proj"
      });
    });
});

module.exports = router;
