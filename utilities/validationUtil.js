const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const results = Joi.validate(req.body, schema);
      if(results.error){
        return res.status(400).json({
          message: results.error.details[0].message
        })
      }
      if(!req.value){
        req.value = {};
      }
      req.value['body'] = results.value;
      next();
    }
  },
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }
}
