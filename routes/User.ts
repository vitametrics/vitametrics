import express, {Request, Response} from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.use(express.json());

router.post('/register', async(req: Request, res: Response) => {

    const accessToken = req.headers.authorization?.split(' ')[1];
    const {userId, email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields'});
    } else {

        try {
            const user = await User.findOne({userId});

            if (!user) {
                return res.status(404).json({msg: 'User does not exist'});
            } else {
                if (user.fitbitAccessToken !== accessToken) {
                    return res.status(403).json({ msg: 'Unauthorized Access'});
                } else {
                    user.email = email;

                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(password, salt);

                    const updatedUser = await user.save();

                    const token = jwt.sign({id: updatedUser._id}, process.env.JWT_SECRET as string, {expiresIn: 3600});
                    
                    res.json({
                        token,
                        user: {
                            id: updatedUser.userId,
                            email: updatedUser.email,
                            // TODO: return data here
                        }
                    })

                }
            }

        } catch (err) {
            console.error(err);
            return res.status(500).json({msg: 'Internal Server Error'});
        }

    }

    return res.status(500);
});

export default router;
