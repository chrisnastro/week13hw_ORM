const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: "Cannot find Tag!" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tagData) {
      res.status(404).json({ message: "ID does not have a Tag!" });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ message: "Cannot find Tag!" });
  }
});

router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json({ message: "Unable to create Tag!" });
  }
});

router.put('/:id', async (req, res) => {
try {
  const updatedTag = await Tag.update(req.body, {
    where: { id: req.params.id },
  });
  !updatedTag[0]
  ? res.status(404).json({ message: "ID does not have a Tag to update!"})
  : res.status(200).json(updatedTag);
} catch (err) {
  res.status(500).json({ message: "Could not update Tag!"});
}
});

router.delete('/:id', async (req, res) => {
try {
  const deletedTag = await Tag.destroy({ where: { id: req.params.id } });
  !deletedTag
  ? res.status(404).json({ message: "ID does not have a Tag!" })
  : res.status(200).json(deletedTag);
} catch (err) {
  res.status(500).json({ message: "Could not delete Tag!"});
}
});

module.exports = router;
