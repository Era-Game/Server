const Joi = require('joi')

const game_model = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string().length(255),
    maxOfTeam: Joi.number().integer(),
    minOfTeam: Joi.number().integer(),
    maxOfTeamMember: Joi.number().integer(),
    minOfTeamMember: Joi.number().integer(),
    targetDistance: Joi.number().integer(),
    exchangeDistance: Joi.number().integer(),
    created_at: Joi.date().timestamp(),
    updated_at: Joi.date().timestamp()
})

module.exports = game_model

