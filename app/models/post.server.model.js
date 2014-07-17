'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
    title: {
        type: String,
        default: '',
        required: 'Please fill Post title',
        trim: true,
        validate : [
            function(v) { return v.length >= 4; },
            'Title must be at least 5 letters']

    },
    // calling the body post_body because just body is a pretty common string
    post_body: {
        type: String,
        default: '',
        required: 'Please fill Post body'
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Post', PostSchema);