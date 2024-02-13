const { Member } = require("../../../modules/MemberModule")

const findMemberbyId = async (req, res) => {
    const memberId = req.params.id;
    console.log(memberId);
    const member = await Member.findById(memberId);
    console.log(member);
    if (member) {
        res.json(member);
    } else {
        res.status(404).json({ message: 'Member not found' });
    }
}
const memberget = async (req, res) => {
    try {
        const { id } = req.params;
        const email = id;
        console.log("emal:", email);
        // Find the member by email in the database
        const member = await Member.findOne({ email });

        if (!member) {
            return res.status(200).json({ message: 'Member not found' });
        }

        // Send member info as a response
        res.status(200).json(member);
    } catch (error) {
        console.error('Error fetching member info:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
module.exports = { findMemberbyId, memberget };