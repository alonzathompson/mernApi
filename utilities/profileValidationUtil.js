const Joi = require('joi');

module.exports = {
  validateProfile: (schema) => {
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
      profile.firstName: Joi.string().required(),
      profile.lastName: Joi.string().required()
    })
  }
}
