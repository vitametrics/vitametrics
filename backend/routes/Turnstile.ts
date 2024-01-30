import express, {Request, Response} from 'express';

const router = express.Router();

router.post('/verify', async (req: Request, res: Response) => { 
    const token = req.body["cf-turnstile-response"];
    
    let formData = new FormData();
    formData.append("secret", process.env.TURNSTILE_SECRET as string);
    formData.append("token", token);

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, {
        body: formData,
        method: "POST",
    });

    const outcome = await result.json();

    if (!outcome.success) {
        res.status(403).json({"success": false, "msg": "Captcha Verification Failed"});
        return;
    } else if (outcome.success) {
        return res.status(200).json({"success": true});
    }
    
    return res.status(500).json({"msg": "Internal Server Error"});
}); 

export default router;