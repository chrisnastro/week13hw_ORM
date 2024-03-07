const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       include: [{ model: Categoy }, { model: Tag }],
//     });
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ message: "Products not found!" });
//   }
// });

router.get('/', (req, res) => {
  Product.findAll({
    attributes: ["id", "product_name", "price", "stock", "category_id"],
    include: [{ model: Category, attributes: ["id", "category_name"],
  },
  {
model: Tag,
attributes: ["id", "tag_name"],
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
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    !product
      ? res.status(404).json({ message: "Product not found!" })
      : res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Products not found!" });
  }
});

router.post('/', async (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } });
    if (req.body.tagIds && req.body.tags.length > 0) {
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tags
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const deletedProductTags = productTags
        .filter(({ tag_id }) => !req.body.tag.includes(tag_id))
        .map(({ id }) => id);
      await Promise.all([
        ProductTag.destroy({ where: { id: deletedProductTags } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    };

    const product = await Product.findByPk(req.params.id, { include: [{ model: Tag }] });
    return res.json(product);
  } catch (err) {
    res.status(500).json(err);
  };
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    !deleted
    ? res.status(404).json({ message: "Product ID not found!"})
    : res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ message: "Unable to delete product!", error: err })
  }
});

module.exports = router;
