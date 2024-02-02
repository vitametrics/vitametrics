import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    req.logout((err: Error) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error destroying session' });
            }
            res.clearCookie('connect.sid');
            return res.json({ success: true, message: 'Successfully logged out' });
        });
        return null;
    });
});


export default router;
