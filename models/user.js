const Joi = require('joi')

const user_model = Joi.object({
    id: Joi.number().integer(),
    org_id: Joi.number().integer(),
    default_skin_id: Joi.number().integer(),
    profileImgUrl: Joi.string().max(255),
    name: Joi.string().max(32),
    username: Joi.string().max(32),
    email: Joi.string().max(255),
    password: Joi.string().max(255),
    status: Joi.string().valid('activated', 'deactivated', 'banned'),
    created_at: Joi.date().timestamp(),
    updated_at: Joi.date().timestamp()
})

module.exports = user_model

