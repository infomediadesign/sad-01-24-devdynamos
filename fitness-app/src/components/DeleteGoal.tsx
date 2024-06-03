import React, { useState } from 'react';
import calorieServices from '../services/calorieServices';

const DeleteGoal: React.FC = () => {
    const { deleteGoal } = calorieServices(); // Using calorieServices custom hook
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await deleteGoal(startDate, endDate);
            alert(response.message);
        } catch (error) {
            alert('Error deleting goal');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Delete Goal</h2>
            <div>
                <label>Start Date:</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
                <label>End Date:</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <button type="submit">Delete Goal</button>
        </form>
    );
};

export default DeleteGoal;
