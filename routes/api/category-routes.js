const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findALL({ include: [{ model: Product }] });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Product not found!' });
  }
});

router.get('/:id', async (req, res) => {
try {
  const category = await Category.findByPk(req.params.id, { include: [{ model: Product }] });
if (!category) {
  res.status(404).json({ message: 'ID not found!'});
  return;
}
res.status(200).json(category);
} catch (err) {
  res.status(500).json({ message: 'Product not found!' });
}
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
