const { Member } = require("../../../modules/MemberModule");
const { KanbanProject } = require("../../../modules/KanbanModule");
const { ScrumProject } = require("../../../modules/ScrumModule");
const nodemailer = require('nodemailer');
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
const findMemberRoleInProject = async (req, res) => {
    const { projectType, projectId, memberId } = await req.params;
    try {
        // Find the project with the specific _id
        let project;
        console.log("fg", projectType, projectId, memberId)
        if (projectType === 'kanban') {
            project = await KanbanProject.findById(projectId);
        }
        else {
            project = await ScrumProject.findById(projectId);
        }
        if (!project) {
            return res.status(404).send('Project not found');
        }

        // Find the member in the project's members array
        const member = project.members.find(m => m.member_id.toString() === memberId);

        if (!member) {
            return res.status(404).send('Member not found in the project');
        }

        // Respond with the found member
        res.json(member);
    } catch (error) {
        console.error('Failed to find member:', error);
        res.status(500).send('Server error');
    }
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abdurrayhancse19018@gmail.com', // Replace with your Gmail email
        pass: 'geoz zrbf zsss ncki',  // Replace with your Gmail password or an App Password if using 2-factor authentication
    },
});
const sendOtpEmail = (toEmail, text) => {
    const mailOptions = {
        from: 'abdurrayhancse19018@gmail.com',  // Replace with your Gmail email
        to: toEmail,
        subject: 'OTP Verification',
        text: `${text}`,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {

        }
    })
};
const sendNotificationEmail = (toEmail, subject, html) => {
    const mailOptions = {
        from: 'abdurrayhancse19018@gmail.com',  // Replace with your Gmail email
        to: toEmail,
        subject: subject,
        html: html,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    })
};
module.exports = { findMemberbyId, memberget, findMemberRoleInProject, sendOtpEmail, sendNotificationEmail };