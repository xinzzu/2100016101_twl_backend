import express, { Request, Response } from 'express';
import ProductModel from '../models/Product';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, description, price, productCategory, thumbnails, owner } = req.body;

        const newProduct = new ProductModel({
            name,
            description,
            price,
            productCategory,
            thumbnails,
            owner
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat produk baru.', error });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil daftar produk.', error });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil produk.', error });
    }
});

router.get('/owner/:ownerId/:page/:limit', async (req: Request, res: Response) => {
    try {
        // const ownerId = req.params.ownerId;
        // const products = await ProductModel.find({owner: ownerId}).exec()
        // res.status(200).json(products);

        const ownerId = req.params.ownerId;
        const page = parseInt(req.params.page) || 1;
        const limit = parseInt(req.params.limit) || 10

        const skip = (page - 1) * limit;
        const countPromise = ProductModel.countDocuments({ owner: ownerId }).exec();
        const productsPromise = ProductModel.find({ owner: ownerId })
            .skip(skip)
            .limit(limit)
            .exec();

        const [count, products] = await Promise.all([countPromise, productsPromise]);

        const totalPages = Math.ceil(count / limit);

        res.json({
            page,
            limit,
            totalProducts: count,
            totalPages,
            products,
        });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil produk berdasarkan pemilik.', error })
    }
})

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { name, description, price, productCategory, thumbnails } = req.body;

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            req.params.id,
            { name, description, price, productCategory, thumbnails },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui produk.', error });
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndRemove(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }

        res.json({ message: 'Produk berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus produk.', error });
    }
});

export default router;
