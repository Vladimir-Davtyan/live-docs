'use client';

import { useState } from 'react'; 
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from './ui/select';

const SelectViewType = ({ currentView }: { currentView: string }) => {
    const [view, setView] = useState(currentView);

    const handleViewChange = (newView: string) => {
        setView(newView);
        window.location.search = `?view=${newView}`;
    };

    return (

        <Select value={view} onValueChange={handleViewChange}>
            <SelectTrigger className="shad-select">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-none bg-dark-200">
                <SelectItem value="list" className="shad-select-item">List view</SelectItem>
                <SelectItem value="card" className="shad-select-item">Card View</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default SelectViewType;