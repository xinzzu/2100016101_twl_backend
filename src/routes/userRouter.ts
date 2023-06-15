import express, { Request, Response } from 'express';
import UserModel from '../models/User';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { email, displayName, password, profile } = req.body;

        const newUser = new UserModel({
            email,
            displayName,
            password,
            profile
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat pengguna baru.', error });
    }
});


router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil daftar pengguna.', error });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil pengguna.', error });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { email, displayName, password, profile } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { email, displayName, password, profile },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui pengguna', error })
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedUser = await UserModel.findByIdAndRemove(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.json({ message: 'Pengguna berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat menghapus pengguna.', error });
    }
});


export default router;
