import React, { useState, useEffect } from 'react';
import './kanbanboard.css';
import ToDoIcon from './components/ToDoIcon'; // Adjust path as needed
import InProgressIcon from './components/InProgressIcon'; // Adjust path as needed
import DoneIcon from './components/DoneIcon'; // Adjust path as needed
import CancelledIcon from './components/CancelledIcon'; // Adjust path as needed
import HighPriorityIcon from './components/HighPriorityIcon'; // Import high priority icon
import MediumPriorityIcon from './components/MediumPriorityIcon'; // Import medium priority icon
import LowPriorityIcon from './components/LowPriorityIcon'; // Import low priority icon
import BacklogIcon from './components/BacklogIcon'; // Import backlog icon
import DisplayIcon from './components/DisplayIcon'; 
import userIcon from './components/userIcon';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [columns, setColumns] = useState([
    { title: 'Todo', icon: <ToDoIcon />, tickets: [] },
    { title: 'In Progress', icon: <InProgressIcon />, tickets: [] },
    { title: 'Done', icon: <DoneIcon />, tickets: [] },
    { title: 'Cancelled', icon: <CancelledIcon />, tickets: [] },
    { title: 'Backlog', icon: <BacklogIcon />, tickets: [] }, // Added backlog column with icon
  ]);
  const [groupBy, setGroupBy] = useState('status'); // Default grouping by status
  const [sortBy, setSortBy] = useState('priority'); // Default sorting by priority
  const [showDisplayOptions, setShowDisplayOptions] = useState(false); // State to control display box visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        
        // Set tickets and distribute them into columns
        setTickets(data.tickets);
        distributeTickets(data.tickets);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const distributeTickets = (tickets) => {
    let groupedTickets;

    if (groupBy === 'status') {
      groupedTickets = columns.map(column => ({
        ...column,
        tickets : tickets.filter(ticket => ticket.status === column.title)
      }));
    } else if (groupBy === 'user') {
      const users = [...new Set(tickets.map(ticket => ticket.userId))]; // Get unique users
      groupedTickets = users.map(userId => ({
        title : userId,
        icon : null,
        tickets : tickets.filter(ticket => ticket.userId === userId)
      }));
    } else if (groupBy === 'priority') {
      groupedTickets = [
        {title : 'High Priority', tickets : tickets.filter(ticket => ticket.priority === 4)},
        {title : 'Medium Priority', tickets : tickets.filter(ticket => ticket.priority === 3)},
        {title : 'Low Priority', tickets : tickets.filter(ticket => ticket.priority <= 2)},
      ];
    }

    setColumns(groupedTickets);
    
    // Sort tickets after grouping
    sortTickets(groupedTickets);
  };

  const sortTickets = (groupedTickets) => {
    groupedTickets.forEach(column => {
      column.tickets.sort((a, b) => {
        if (sortBy === 'priority') return b.priority - a.priority;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return a.id - b.id; // Default sort by ID
      });
    });
    
    setColumns([...groupedTickets]);
  };

  const addColumn = () => {
    const newColumnName = prompt("Enter new column name:");
    if (newColumnName) {
      setColumns([...columns, { title:newColumnName ,tickets : [] }]);
    }
  };

  const deleteColumn = (columnTitle) => {
    if (window.confirm(`Are you sure you want to delete the "${columnTitle}" column?`)) {
      setColumns(columns.filter(column => column.title !== columnTitle));
    }
  };

  const handleGroupChange = (event) => {
    setGroupBy(event.target.value);
    distributeTickets(tickets); // Re-distribute tickets based on current grouping logic
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    
    sortTickets(columns); // Sort based on current sorting logic after grouping
  };

  
return (
    <div className="kanban-board">
      {/* Display Options Box */}
      <div className="display-options">
        <button onClick={() => setShowDisplayOptions(!showDisplayOptions)} className="display-button">
          <DisplayIcon /> Display ▼ {/* Down arrow can be added here */}
        </button>
        
        {showDisplayOptions && (
          <div className="options-container">
            <label>
              Group by:
              <select value={groupBy} onChange={handleGroupChange}>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option>
              </select>
            </label>
            <label>
              Sort by:
              <select value={sortBy} onChange={handleSortChange}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="kanban-columns">
        {columns.map((column) => (
          <div key={column.title} className="kanban-column">
            <div className="kanban-column-header">
              <span className="column-icon">{column.icon}</span> {/* Add icon here */}
              {/* Add SVG for High Priority section */}
              {column.title === 'High Priority' && <HighPriorityIcon style={{ marginRight: '8px' }} />}
              <span>{column.title} ({column.tickets.length})</span> {/* Display count of tickets */}
              <span className="column-actions">
                <button onClick={addColumn} className="add-column-button">+</button>
                <button onClick={() => deleteColumn(column.title)} className="delete-column-button">...</button>
              </span>
            </div>
            <div className="kanban-column-content">
              {column.tickets.map((ticket) => (
                <div key={ticket.id} className="kanban-card">
                  {/* Display Ticket ID in grey at the top */}
                  <div className="ticket-id" style={{ color: 'grey', fontSize: '14px' }}>
                    {ticket.id}
                  </div>

                  {/* Title of the ticket */}
                  <div className="kanban-card-header">
                    <div>{ticket.title}</div> 
                  </div>

                  {/* Description line */}
                  <div className="kanban-card-description">{ticket.description}</div>

                  {/* Priority icon and grey dot with text */}
                  <div className="kanban-card-footer">
                    {/* Display different icons based on priority */}
                    {ticket.priority === 4 && <HighPriorityIcon />}
                    {ticket.priority === 3 && <MediumPriorityIcon />}
                    {ticket.priority === 2 && <LowPriorityIcon />}
                    {/* Grey dot next to Feature Request text */}
                    <span className="grey-dot"></span> {/* Grey dot */}
                    Feature Request {/* Text next to grey dot */}
                    
                    {/* Circular image in top right corner */}
                    <img src="C:/Users/ASUS/Desktop/Untitled/icons_FEtask/my-kanban-app/src/assets/userIcon.png" alt="User Icon" className="user-icon" /> {/* Adjust path as necessary */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
);
};

export default KanbanBoard;