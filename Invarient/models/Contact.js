const mongoose = require('mongoose');

var contactSchema = new mongoose.Schema(
{
    email: {
    	type: String,
    	required: true
    },
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},
{ 
    collection: 'contactMessages' 
}
);

var Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
