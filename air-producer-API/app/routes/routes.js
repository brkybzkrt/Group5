//const homeController = require('../controllers/home/home');
const { homeIndex, homeIndexGet } = require("../controllers/home/home");
const { airPost } = require("../controllers/producer/producerAir");
const router = express.Router();

//Chain methods
router.route("/home").post(homeIndex).get(homeIndexGet);
router.route("/air").post(airPost);

//HTTP METHODS
/*
POST
GET
PATCH/PUT
DELETE
OPTIONS
*/
module.exports = {
  router,
};
