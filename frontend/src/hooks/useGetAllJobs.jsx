// useGetAllJobs.jsx

import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import API from '@/lib/api';  // Import your custom API instance
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery, filters } = useSelector((store) => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                // Build query parameters
                const params = new URLSearchParams();
                if (searchedQuery) params.append('keyword', searchedQuery);
                if (filters.location) params.append('location', filters.location);
                if (filters.industry) params.append('industry', filters.industry);
                if (filters.salary) params.append('salary', filters.salary);

                const res = await API.get(`${JOB_API_END_POINT}/get?${params.toString()}`);
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllJobs();
    }, [searchedQuery, filters, dispatch]);
};

export default useGetAllJobs;
