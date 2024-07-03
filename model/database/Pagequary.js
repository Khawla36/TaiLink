const connection = require('./mysql')

const getPageById = (pageId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      SELECT *
      FROM pages
      WHERE pageId = ?
    `;

    connection.query(sqlQuery, [pageId], (error, results) => {
      if (error) {
        return reject(error);
      }
      console.log("db", results);
      resolve(results.length ? results[0] : null);
    });
  });
};

module.exports = {
  getPageById
};
