import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Username field: must be unique and at least 3 characters
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    // Email field: must be unique and match standard email format
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    // Password field: min length 4, further validation handled in routes
    password: {
        type: String,
        required: true,
        minlength: 4
    }
});

export default mongoose.model('User', userSchema);
