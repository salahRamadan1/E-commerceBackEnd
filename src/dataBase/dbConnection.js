import { connect } from "mongoose";
const dbCOnnection = () => {
    connect(process.env.CONNECTION_STRING)
    .then(() => {
      console.log("dbConnection");
    })
    .catch((err) => {
      console.log(err);
    });
};
export { dbCOnnection };
