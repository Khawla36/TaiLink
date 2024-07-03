const cron = require('node-cron');
const mysql = require('./mysql');
const { do_login_and_get_access_token, get_user_details, get_account_descendants, get_device_last_location_reports, ask_device_to_send_location } = require('../../controler/trackipet'); 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'your_database_name'
});

async function fetchAndStoreLocation() {
    try {
        const access_token = await do_login_and_get_access_token();
        const user_details = await get_user_details(access_token);
        const account_descendants = await get_account_descendants(access_token, user_details.account_id);
        const device_1 = account_descendants.devices[0];

        await ask_device_to_send_location(access_token, user_details.account_id, device_1.device_id);

        const last_reports = await get_device_last_location_reports(access_token, user_details.account_id, device_1.device_id);

        const locations = last_reports.slice(0, 5); 

        const query = `INSERT INTO points (pet_id, point1_lat, point1_lng, point2_lat, point2_lng, point3_lat, point3_lng, point4_lat, point4_lng, point5_lat, point5_lng) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                       ON DUPLICATE KEY UPDATE 
                       point1_lat = VALUES(point1_lat), point1_lng = VALUES(point1_lng),
                       point2_lat = VALUES(point2_lat), point2_lng = VALUES(point2_lng),
                       point3_lat = VALUES(point3_lat), point3_lng = VALUES(point3_lng),
                       point4_lat = VALUES(point4_lat), point4_lng = VALUES(point4_lng),
                       point5_lat = VALUES(point5_lat), point5_lng = VALUES(point5_lng)`;

        const values = [device_1.device_id,
                        locations[0]?.lat, locations[0]?.lng,
                        locations[1]?.lat, locations[1]?.lng,
                        locations[2]?.lat, locations[2]?.lng,
                        locations[3]?.lat, locations[3]?.lng,
                        locations[4]?.lat, locations[4]?.lng];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error inserting locations:', error);
            } else {
                console.log('Locations inserted successfully');
            }
        });
    } catch (error) {
        console.error('Error fetching and storing location:', error);
    }
}

cron.schedule('*/5 * * * *', fetchAndStoreLocation);
