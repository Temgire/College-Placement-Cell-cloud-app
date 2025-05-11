import React, { useEffect } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        console.log('Full Applicants Data:', JSON.stringify(applicants, null, 2));
    }, [applicants]);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return dateString.split('T')[0];
        } catch (error) {
            return 'N/A';
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants?.applications?.length > 0 ? (
                        applicants.applications.map((item) => {
                            console.log('Current Application:', item);
                            return (
                                <tr key={item._id}>
                                    <TableCell>{item.applicant?.fullname || 'N/A'}</TableCell>
                                    <TableCell>{item.applicant?.email || 'N/A'}</TableCell>
                                    <TableCell>{item.applicant?.phoneNumber || 'N/A'}</TableCell>
                                    <TableCell>
                                        {item.applicant?.profile?.resume ? (
                                            <a 
                                                className="text-blue-600 cursor-pointer" 
                                                href={item.applicant.profile.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {item.applicant.profile.resumeOriginalName || 'Resume'}
                                            </a>
                                        ) : (
                                            <span>NA</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                                    <TableCell className="float-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32">
                                                {shortlistingStatus.map((status, index) => (
                                                    <div 
                                                        onClick={() => statusHandler(status, item?._id)} 
                                                        key={index} 
                                                        className='flex w-fit items-center my-2 cursor-pointer'
                                                    >
                                                        <span>{status}</span>
                                                    </div>
                                                ))}
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <TableCell colSpan={6} className="text-center">
                                No applicants found
                            </TableCell>
                        </tr>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable