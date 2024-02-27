import express from 'express';

export const app = express();

app.use(express.json());

/*
app.post('/users', validateUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, role_id } = req.body;

    const newUser = await User.create({
        name,
        email,
        password,
        role_id
    });
    res.json(newUser);
});

*/ 