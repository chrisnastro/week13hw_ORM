const router = require('express').Router();
const { Category, Product } = require('../../models');

// router.get('/', async (req, res) => {
//   try {
//     const categories = await Category.findALL({
//       include: [{ model: Product }]
//     });
//     res.status(200).json(categories);
//   } catch (err) {
//     res.status(500).json({ message: "Category not found!" });
//   }
// });

router.get('/', (req, res) => {
  Category.findAll({
    attributes: ["id", "category_name"],
    include: [{
      model: Product, attributes: ["id", "product_name", "price", "stock", "category_id"],
    },
    ],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: [{ model: Product }] });
    if (!category) {
      res.status(404).json({ message: "ID not found!" });
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: "Product not found!" });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Could not create, try again" });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Category.update(req.body, { where: { id: req.params.id } });
    !updated[0] ? res.status(404).json({ message: 'Category not found!' }) : res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Could not update, try again" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    !deleted ? res.status(404).json({ message: "Category not found!" }) : res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
