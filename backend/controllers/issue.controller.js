import Issue from "../models/issues.model.js";
import fs from "fs";

export const createIssue = async (req, res) => {
    try {
        const { issue_title, issue_message } = req.body;
        const senderId = req.user._id;
        let imagePath = null;

        if (req.file) {
            imagePath = req.file.path; // Store the file path of the uploaded image
        }

        const newIssue = new Issue({
            senderId,
            issue_title,
            issue_message,
            image: imagePath,
        });

        await newIssue.save();

        res.status(201).json({
            message: "Issue created successfully!",
            issue: newIssue,
        });
    } catch (error) {
        console.error("Error in createIssue controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at createIssue Controller" });
    }
};

export const updateIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { issue_title, issue_message } = req.body;
        const senderId = req.user._id;

        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        if (issue.senderId.toString() !== senderId.toString()) {
            return res.status(403).json({ error: "You are not authorized to update this issue" });
        }

        if (req.file) {
            // Delete old image if a new one is uploaded
            if (issue.image) {
                fs.unlinkSync(issue.image);
            }
            issue.image = req.file.path;
        }

        issue.issue_title = issue_title || issue.issue_title;
        issue.issue_message = issue_message || issue.issue_message;
        await issue.save();

        res.status(200).json({
            message: "Issue updated successfully!",
            issue,
        });
    } catch (error) {
        console.error("Error in updateIssue controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at updateIssue Controller" });
    }
};

export const deleteIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const senderId = req.user._id;

        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        if (issue.senderId.toString() !== senderId.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this issue" });
        }

        if (issue.image) {
            fs.unlinkSync(issue.image);
        }

        await Issue.deleteOne({ _id: issueId });

        res.status(200).json({
            message: "Issue deleted successfully!",
        });
    } catch (error) {
        console.error("Error in deleteIssue controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at deleteIssue Controller" });
    }
};

export const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find().sort({upvotes: -1});
        res.status(200).json(issues);
    } catch (error) {
        console.error("Error in getAllIssues controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at getAllIssues Controller" });
    }
};

export const getSingleIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        res.status(200).json(issue);
    } catch (error) {
        console.error("Error in getSingleIssue controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at getSingleIssue Controller" });
    }
};


export const upvoteIssue =  async (req, res) => {
    try {
        const { issueId } = req.params;
        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        issue.upvotes += 1;
        await issue.save();

        res.status(200).json({ message: "Upvote added successfully!", upvotes: issue.upvotes });
    } catch (error) {
        console.error("Error in upvote route:", error.message);
        res.status(500).json({ error: "Internal Server Error at upvote route" });
    }
}

export const downvotIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const issue = await Issue.findById(issueId);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        issue.downvotes += 1;
        await issue.save();

        res.status(200).json({ message: "Downvote added successfully!", downvotes: issue.downvotes });
    } catch (error) {
        console.error("Error in downvote route:", error.message);
        res.status(500).json({ error: "Internal Server Error at downvote route" });
    }
}

export const updateSingleIssue = async (req, res) => {
    try {
        const { issueId } = req.params; // Extract issueId from params
        const { resolved } = req.body; // Assume resolved status is sent in the request body

        // Validate the resolved status
        if (typeof resolved !== "boolean") {
            return res.status(400).json({ error: "Invalid resolved status. It must be a boolean." });
        }

        // Find and update the issue
        const updatedIssue = await Issue.findByIdAndUpdate(
            issueId,
            { resolved },
            { new: true, runValidators: true } // Return the updated document
        );

        // Check if the issue exists
        if (!updatedIssue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        res.status(200).json({
            message: "Issue updated successfully",
            updatedIssue,
        });
    } catch (error) {
        console.error("Error in updateSingleIssue controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at updateSingleIssue controller" });
    }
};

export const deleteSingleIssue = async (req, res) => {
    try {
        const { issueId } = req.params; // Extract issueId from params

        // Find and delete the issue
        const deletedIssue = await Issue.findByIdAndDelete(issueId);

        // Check if the issue exists
        if (!deletedIssue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        res.status(200).json({
            message: "Issue deleted successfully",
            deletedIssue,
        });
    } catch (error) {
        console.error("Error in deleteSingleIssue controller:", error.message);
        res.status(500).json({ error: "Internal Server Error at deleteSingleIssue controller" });
    }
};
