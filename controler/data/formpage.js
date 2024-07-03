const FormJson = require('../data/formid');
const router= express.Router;

app.router()
exports.getpagedata = (req, res) => {
    const FormName = req.params.FormName;
    const formData = FormJson.find(item => item.FormName === FormName);
    if (formData) {
        res.json(formData);
    } else {
        res.status(404).json({ error: 'Page not found' });
    }
};