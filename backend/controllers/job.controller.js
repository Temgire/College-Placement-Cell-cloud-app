import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to post job.",
            success: false
        });
    }
};

// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const { keyword, location, industry, salary } = req.query;
        const query = {};

        // Add keyword search if provided
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }

        // Add location filter if provided
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // Add industry filter if provided
        if (industry) {
            query.title = { $regex: industry, $options: "i" };
        }

        // Add salary filter if provided
        if (salary) {
            const [minSalary, maxSalary] = salary.split('-').map(Number);
            if (!isNaN(minSalary) && !isNaN(maxSalary)) {
                query.salary = { $gte: minSalary, $lte: maxSalary };
            }
        }

        const jobs = await Job.find(query)
            .populate("company")
            .sort({ createdAt: -1 });

        // Return empty array instead of error when no jobs found
        return res.status(200).json({
            jobs: jobs || [],
            success: true,
            message: jobs.length === 0 ? "No jobs found matching your criteria" : "Jobs fetched successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch jobs.",
            success: false
        });
    }
};

// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications",
            populate: {
                path: "applicant"
            }
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch job.",
            success: false
        });
    }
};

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate("company")
            .sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to fetch admin jobs.",
            success: false
        });
    }
};
