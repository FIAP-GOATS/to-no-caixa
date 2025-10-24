import { Router } from "express";
import { verifyToken } from "../middlewares/auth/verify-token.js"

export default function userRoutes(userService) {
    const router = Router()

    router.post('/', verifyToken, async (req, res) => {
        try {
            const { name, email, password } = req.body.user

            const user = await userService.create({
                name,
                email,
                password
            })

            let payload = { user }

        res.status(201).json(payload);

        } catch (error) {
            console.error('Error POST user', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    })

    router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await userService.get({ id: req.user.id })
        res.status(200).json(user);
    } catch (error) {
        console.error('Error GET user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  })

  router.post('/token', async (req, res) => {
    try{
      if(!req.body.user)
        return res.status(400).json({ error: 'Bad request' });
  
      const { email, password } = req.body.user

      const user = await userService.authenticate({ email, password })

      let payload = { token: user.token }

      res.status(200).json(payload);
    } catch (error) {
      if(error.message === 'User not found' || error.message === 'Invalid password') {
        res.status(401).json({ error: error.message });
      }
      else {
        console.error('Error POST token', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  })

  return router
}