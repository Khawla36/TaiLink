const connection = require('./mysql');

const getMenuPagesByMenuId = (menuId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `
      SELECT DISTINCT mi.*
      FROM menu m
      JOIN menu_pages_connection mpc ON m.menuId = mpc.menuId
      JOIN menu_item mi ON mi.menuId = mpc.menuId
      WHERE m.menuId = ?
    `;
    connection.query(sqlQuery, [menuId], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

module.exports = {
  getMenuPagesByMenuId
};
