import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, clearFilters } from '@/redux/jobSlice'
import { Button } from './ui/button'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["0-40", "40-100", "100-500"]
    },
]

const FilterCard = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector(store => store.job);
    const [selectedFilters, setSelectedFilters] = useState({
        location: "",
        industry: "",
        salary: ""
    });

    const handleFilterChange = (filterType, value) => {
        console.log('Filter changed:', filterType, value); // Debug log
        const newFilters = { ...selectedFilters };
        if (newFilters[filterType.toLowerCase()] === value) {
            newFilters[filterType.toLowerCase()] = "";
        } else {
            newFilters[filterType.toLowerCase()] = value;
        }
        console.log('New filters:', newFilters); // Debug log
        setSelectedFilters(newFilters);
        dispatch(setFilters(newFilters));
    };

    const handleClearFilters = () => {
        setSelectedFilters({
            location: "",
            industry: "",
            salary: ""
        });
        dispatch(clearFilters());
    };

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <div className='flex justify-between items-center'>
                <h1 className='font-bold text-lg'>Filter Jobs</h1>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearFilters}
                >
                    Clear Filters
                </Button>
            </div>
            <hr className='mt-3' />
            {filterData.map((data, index) => (
                <div key={index} className='mt-4'>
                    <h1 className='font-bold text-lg'>{data.filterType}</h1>
                    <RadioGroup 
                        value={selectedFilters[data.filterType.toLowerCase()]}
                        onValueChange={(value) => handleFilterChange(data.filterType, value)}
                        className='mt-2'
                    >
                        {data.array.map((item, idx) => {
                            const itemId = `id${index}-${idx}`;
                            return (
                                <div key={idx} className='flex items-center space-x-2 my-2'>
                                    <RadioGroupItem 
                                        value={item} 
                                        id={itemId}
                                    />
                                    <Label htmlFor={itemId}>{item}</Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
            ))}
        </div>
    );
};

export default FilterCard;