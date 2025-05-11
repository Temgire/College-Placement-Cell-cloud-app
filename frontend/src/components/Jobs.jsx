import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery, filters } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        let filteredJobs = [...allJobs];

        // Apply search filter
        if (searchedQuery) {
            console.log('Searching for:', searchedQuery); // Debug log
            filteredJobs = filteredJobs.filter((job) => {
                const jobTitle = job.title.toLowerCase();
                const searchTerm = searchedQuery.toLowerCase();
                console.log('Job title:', jobTitle); // Debug log
                
                // Check if the job title contains the exact search term
                return jobTitle.includes(searchTerm);
            });
            console.log('Filtered jobs after search:', filteredJobs); // Debug log
        }

        // Apply location filter
        if (filters.location) {
            filteredJobs = filteredJobs.filter(job => 
                job.location.toLowerCase().trim() === filters.location.toLowerCase().trim()
            );
        }

        // Apply industry filter
        if (filters.industry) {
            filteredJobs = filteredJobs.filter(job => 
                job.title.toLowerCase() === filters.industry.toLowerCase()
            );
        }

        // Apply salary filter
        if (filters.salary) {
            const [minSalary, maxSalary] = filters.salary.split('-').map(Number);
            filteredJobs = filteredJobs.filter(job => {
                const jobSalary = Number(job.salary);
                return jobSalary >= minSalary && jobSalary <= maxSalary;
            });
        }

        setFilterJobs(filteredJobs);
    }, [allJobs, searchedQuery, filters]);

    const NoJobsFound = () => (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h2>
            <p className="text-gray-500">
                {searchedQuery ? `No jobs found matching "${searchedQuery}"` : 
                 Object.values(filters).some(Boolean) ? "No jobs match your selected filters." :
                 "There are no jobs available at the moment."}
            </p>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? (
                            <div className='flex-1'>
                                <NoJobsFound />
                            </div>
                        ) : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs