const Joi = require('joi')

const game_model = Joi.object({
    id: Joi.number().integer(),
    leader_id: Joi.number().integer(),
    game_id: Joi.number().integer(),
    status: Joi.string().valid('created', 'matching', 'ready', 'dismissed'),
    created_at: Joi.date().timestamp(),
    updated_at: Joi.date().timestamp()
})

module.exports = game_model

