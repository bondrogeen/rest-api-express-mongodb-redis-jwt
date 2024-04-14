export default () => (error, req, res, next) => {
    if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
            if (!errors[key]) errors[key] = []
            errors[key].push(error.errors[key].message);
        });
        return res.status(400).json({ errors });
    }
    res.status(error.code || 500)
    return res.json({ message: error.message || "An unknown error occured!" });
};