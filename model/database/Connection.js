const connection = require('./mysql');

const getContactusFormData=(formId)=>{
    return new Promise((resolve,reject)=>{
        console.log(formId)
        const sqlQuery=`
        SELECT fc.*
        FROM forms f
        JOIN form_content_connection fcc ON f.formId = fcc.formId
        JOIN form_content fc ON fcc.contentId = fc.contentId
        WHERE f.formId = ?;
        `;
        connection.query(sqlQuery, [formId], (error, results) => {
            if (error) {
              return reject(error);
            }
            resolve(results);
          });
    })
}


  module.exports = {
    getContactusFormData
  };
  
  