const { Member } = require('../../../modules/MemberModule.js');
var bcrypt = require('bcryptjs');
const Userinfostore = async (req, res) => {
    try {
        // Extract data from the request body
        const { username, email, password } = req.body;
        var salt = await bcrypt.genSalt(10);
        var hash_var = await bcrypt.hash(password, salt);
        var memberData = {
            name: username,
            email: email,
            password: hash_var,
        };
        console.log(memberData);
        var info = await Member.create(memberData);
        console.log(info);
        // Respond with the result
        res.status(200).json({ message: 'successful' });
    } catch (error) {
        console.error('Error in endpoint:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const UserinfoUpdate = async (req, res) => {
    try {
        const { email, password } = req.body;
        var salt = await bcrypt.genSalt(10);
        var hash_var = await bcrypt.hash(password, salt);
        const info = await Member.updateOne({ email: email }, { $set: { password: hash_var } });
        console.log(info);
        // Respond with the result
        res.status(200).json({ message: 'successful' });

    } catch (error) {
        console.error('Error in endpoint:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

};


module.exports = { Userinfostore, UserinfoUpdate }