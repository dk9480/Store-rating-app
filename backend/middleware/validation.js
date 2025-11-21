const userValidation = (req, res, next) => {
    const { name, email, password, address } = req.body;
    const errors = [];

    if (!name || name.length < 20 || name.length > 60) {
        errors.push('Name must be between 20 and 60 characters');
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('Must be a valid email');
    }

    if (!password || password.length < 8 || password.length > 16 || 
        !/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
        errors.push('Password must be 8-16 characters with at least one uppercase letter and one special character');
    }

    if (!address || address.length > 400) {
        errors.push('Address must not exceed 400 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

const storeValidation = (req, res, next) => {
    const { name, email, address } = req.body;
    const errors = [];

    if (!name || name.length < 1 || name.length > 60) {
        errors.push('Store name must be between 1 and 60 characters');
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('Must be a valid email');
    }

    if (!address || address.length > 400) {
        errors.push('Address must not exceed 400 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

const ratingValidation = (req, res, next) => {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    next();
};

module.exports = {
    userValidation,
    storeValidation,
    ratingValidation
};