import express, {Request, Response} from 'express';

const router = express.Router();

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logs out the current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates successful logout.
 *                 message:
 *                   type: string
 *                   description: A message confirming the logout.
 *       500:
 *         description: Error occurred while trying to log out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates failure in logout process.
 *                 message:
 *                   type: string
 *                   description: Error message detailing the issue.
 */

router.get('/', (req: Request, res: Response) => {
    req.session.destroy(err => {
        if(err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error destroying session:', err);
                return res.json({ success: false, message: 'Error logging out' });
            }
            return res.json({ success: false, message: 'An error occurred.' });
        } 
        res.clearCookie('token');
        return res.json({ success: true, message: 'Successfully logged out' });
    });
});

export default router;
