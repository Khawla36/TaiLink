const express = require('express');
const cors = require('cors');
const port = process.env.port || 3001;
const app = express();
app.use(cors());
app.use(express.json());
const { PagesJson } = require('./data/PagesJson');

app.post('/:PageName', (req, res) => {
    const PageName = req.params.PageName;
    const pageData = PagesJson.find(item => item.PageName === PageName);
    if (pageData) {
        res.json(pageData);
    } 
    else {
        res.status(404).json({ error: 'Page not found' });
    }
});



app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});
