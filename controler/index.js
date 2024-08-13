const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const { 
  do_login_and_get_access_token,
  get_user_details,
  get_account_descendants,
  ask_device_to_send_location,
  get_device_last_location_reports,
} = require('./trackipet');
const locationQuery = require('../model/database/LocationQuery');
const pageQuery = require('../model/database/Pagequary');
const connectionfc = require('../model/database/Connection');
const connectionmp = require('../model/database/Menupagesquary');
const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

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
    const { pet_id } = req.body;
    if (!pet_id) {
      return res.status(400).send("pet_id is required");
    }

    const access_token = await do_login_and_get_access_token();
    const user_details = await get_user_details(access_token);
    const account_descendants = await get_account_descendants(
      access_token,
      user_details.account_id
    );

    const device_1 = account_descendants.devices[0];
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

    const locationData = last_reports[0];
    const { lat, lng } = locationData;

    await locationQuery.addLocationPoint(pet_id, lat, lng);

    res.json({ lat, lng });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred");
  }
});

app.use("/locations", async (req, res) => {
  try {
    const { pet_id } = req.query;
    if (!pet_id) {
      return res.status(400).send("pet_id is required");
    }

    const points = await locationQuery.getAllLocationPoints(pet_id);
    res.json(points);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred");
  }
});

app.use("/locationhistory", async (req, res) => {
  try {
    const { pet_id, time } = req.query;
    console.log("Received pet_id:", pet_id, "and time:", time);
    if (!pet_id || !time) {
      return res.status(400).send("pet_id and time are required");
    }

    console.log(`Fetching location history for pet_id: ${pet_id}, time: ${time}`);
    const points = await locationQuery.getLocationPointsByTime(pet_id, time);
    console.log(`Fetched points: ${JSON.stringify(points)}`);
    res.json(points);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred");
  }
});


cron.schedule('* * * * *', async () => {
  try {
    const pet_id = 1;

    const access_token = await do_login_and_get_access_token();
    const user_details = await get_user_details(access_token);
    const account_descendants = await get_account_descendants(
      access_token,
      user_details.account_id
    );

    const device_1 = account_descendants.devices[0];
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

    const locationData = last_reports[0];
    const { lat, lng } = locationData;

    await locationQuery.addLocationPoint(pet_id, lat, lng);

    console.log(`Location updated for pet_id ${pet_id}: lat ${lat}, lng ${lng}`);
  } catch (error) {
    console.error("Error in scheduled task:", error.message);
  }
});

server.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
