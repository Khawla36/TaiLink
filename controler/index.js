const express = require('express');
const cors = require('cors');
const  {do_login_and_get_access_token,
get_account_descendants,
update_device_settings,
get_user_details,
ask_device_to_send_location,
get_device_last_location_reports}=require('./trackipet')
const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());
const pageQuery = require('../model/database/Pagequary');
const connectionfc = require('../model/database/Connection');
const connectionmp = require('../model/database/Menupagesquary');

app.use('/pages/:pageId', async (req, res) => {
  try {
    const page = await pageQuery.getPageById(req.params.pageId);
    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ error: 'Page not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching page' });
  }
});

app.use('/forms/:formId', async (req, res) => {
  try {
    const formId = req.params.formId;
    console.log(formId);
    const page = await connectionfc.getContactusFormData(formId);
    if (page && page.length > 0) {
      console.log(page);
      res.json(page);
    } else {
      res.status(404).json({ error: 'Form not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching form' });
  }
});

app.use('/menupagesquary/:menuId', async (req, res) => {
  try {
    const menu = await connectionmp.getMenuPagesByMenuId(req.params.menuId);
    if (menu) {
      res.json(menu);
    } else {
      res.status(404).json({ error: 'Menu not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching menu' });
  }
});


  app.use("/trackipetmap", async (req, res) => {
    try {
      const access_token = await do_login_and_get_access_token();
      console.log("Access token:", access_token);
  
      const user_details = await get_user_details(access_token);
      console.log("User details:", user_details);
  
      const account_descendants = await get_account_descendants(
        access_token,
        user_details.account_id
      );
      console.log("Account descendants:", account_descendants);
  
      const device_1 = account_descendants.devices[0];
      console.log("Device:", device_1);
  
      await ask_device_to_send_location(
        access_token,
        user_details.account_id,
        device_1.device_id
      );
  
      const last_reports = await get_device_last_location_reports(
        access_token,
        user_details.account_id,
        device_1.device_id
      );
      console.log("Last reports:", last_reports);
  
      const locationData = last_reports[0]; // Get the first report
  
      res.json({
        lat: locationData.lat,
        lng: locationData.lng,
      });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).send("An error occurred");
    }
  });
  
  app.listen(port, () => {
    console.log(`Server started at port ${port}`);
  });