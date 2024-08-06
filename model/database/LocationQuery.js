const connection = require('./mysql');

const addLocationPoint = (pet_id, latitude, longitude) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = 
      `INSERT INTO points_locations (pet_id, latitude, longitude)
      VALUES (?, ?, ?);`;

    connection.query(sqlQuery, [pet_id, latitude, longitude], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.insertId);
    });
  });
};

const getAllLocationPoints = (pet_id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = 
      `SELECT *
      FROM points_locations
      WHERE pet_id = ?
      ORDER BY timestamp DESC;`;

    connection.query(sqlQuery, [pet_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

const getLocationPointsByTime = (pet_id, time) => {
  return new Promise((resolve, reject) => {
    console.log(`Fetching points for pet_id: ${pet_id} from time: ${time}`);
    const sqlQuery = `
      SELECT *
      FROM points_locations
      WHERE pet_id = ? AND timestamp >= ?
      ORDER BY timestamp ASC;
    `;
    connection.query(sqlQuery, [pet_id, time], (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return reject(error);
      }
      console.log('Database query results:', results);
      results.forEach(result => console.log(`Timestamp: ${result.timestamp}`)); // הדפסה של ה-timestamp
      resolve(results);
    });
  });
};

module.exports = {
  addLocationPoint,
  getAllLocationPoints,
  getLocationPointsByTime,
};
