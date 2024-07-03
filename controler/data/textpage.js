const PagesJson = require('../data/PageJson');

exports.getpagedata = (req, res) => {
    const PageName = req.params.PageName;
    const PageData = PagesJson.find(page => page.PageName === PageName);
    if (PageData){
        res.json(PageData);
    } else{
        res.status(404).send('Page not found');
    }

};