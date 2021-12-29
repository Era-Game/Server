const Joi = require('joi')

const game_model = Joi.object({
    id: Joi.number().integer(),
    team_id: Joi.number().integer(),
    user_id: Joi.number().integer(),
    skin_id: Joi.number().integer(),
    status: Joi.string().valid('joined', 'left'),
    created_at: Joi.date().timestamp(),
    updated_at: Joi.date().timestamp()
})

module.exports = game_model

