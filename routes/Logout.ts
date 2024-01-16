import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    req.session.destroy(err => {
        if(err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error destroying session:', err);
                return res.json({ success: false, message: 'Error logging out' });
            }
            return res.json({ success: false, message: 'An error occured.' });
        } 
        res.clearCookie('token');
        return res.json({ success: true });
    });
});

export default router;