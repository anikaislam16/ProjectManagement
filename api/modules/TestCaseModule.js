const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScrumBoard" // Change "ScrumBoard" to the name of the appropriate model
    },
    task_Name: {
        type: String,
        required: true
    },
    test_cases: [{
        test_Name: {
            type: String,
            required: true
        },
        pre_conditions: {
            type: String
        },
        expected_result: {
            type: String,
            required: true
        },
        test_data: {
            type: String,
            required: true
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member" // Change "ScrumBoard" to the name of the appropriate model
        },
        status: {
            type: String,
            default: 'refactor'
        }
    }]
});

const TestCase = mongoose.model("TestCase", testCaseSchema);

module.exports = TestCase;
