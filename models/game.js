const Joi = require('joi')

const game_model = Joi.object({
    id: Joi.number().integer(),
    game_mode_id: Joi.number().integer(),
    status: Joi.string().valid('created', 'team_match', 'game_match', 'terminated'),
    created_at: Joi.date().timestamp(),
    updated_at: Joi.date().timestamp()
})

module.exports = game_model

