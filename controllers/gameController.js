const gameService = require('../services/gameService');
const game_model = require("../models/game");

const create = async (req, res, next) => {
    // passes correct user and pass
    console.log("[Controller Start] create game")
    console.log("request body:" + JSON.stringify(req.body));

    // validate req body
    const {error} = game_model.validate(req.body)

    // validate success
    if (! error){
        try {
            // create game
            const game = await gameService.create(req, res, next)
            return res.status(200).json(game);
        } catch(err) {
            console.error(err)
            res.status(500).json({ status: "An error occurred while creating game." });
        } finally {
            console.log("[Controller End] create game")
        }
    } else {
        res.status(500).json({ status: error.message });
    }
};

const findById = async (req, res) => {
    console.log("[Start Game Controller] findById")

    try{
        const game = await gameService.findById(req.body.id)
        return res.status(200).json(game);
    } catch(err) {
        return res.status(404).json({"status": "user not found"})
    } finally {
        console.log("[End of Game Controller] findById")
    }
};

module.exports = {
    create,
    findById,
};
