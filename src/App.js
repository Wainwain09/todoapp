import React, { useState, useEffect } from "react";
import TodoList from "./TodoList";
import "./styles.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", startTime: "", startDate: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedCompletedTasks = localStorage.getItem("completedTasks");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedCompletedTasks) setCompletedTasks(JSON.parse(savedCompletedTasks));
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || completedTasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    }
  }, [tasks, completedTasks]);

  const formatTime = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let formattedHour = parseInt(hour, 10);
    const period = formattedHour >= 12 ? "PM" : "AM";
    formattedHour = formattedHour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const validateTask = () => {
    const { name, startTime, startDate } = newTask;
    const now = new Date();
    const selectedDate = new Date(startDate);

    if (!name.trim()) return "Task name is required.";
    if (!startDate) return "Task date is required.";
    if (!startTime) return "Task time is required.";

    const today = new Date().setHours(0, 0, 0, 0);
    if (selectedDate.setHours(0, 0, 0, 0) < today) {
      return "You can't select a past date.";
    }

    if (selectedDate.toDateString() === now.toDateString()) {
      const [hour, minute] = startTime.split(":").map(Number);
      const taskTime = new Date();
      taskTime.setHours(hour, minute, 0);

      if (taskTime < now) return "You can't select a past time for today.";
    }

    return "";
  };

  const addTask = () => {
    const validationError = validateTask();
    if (validationError) {
      alert(validationError); 
      return;
    }

    const newTaskObject = {
      ...newTask,
      id: Date.now(),
      status: "Incomplete",
      startTime: formatTime(newTask.startTime),
    };

    const updatedTasks = [...tasks, newTaskObject];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    setNewTask({ name: "", startTime: "", startDate: "" });
    setIsAdding(false);
  };

  const updateTask = (id, updatedTask) => {
    const updatedList = tasks.map((task) => (task.id === id ? updatedTask : task));
    setTasks(updatedList);
    localStorage.setItem("tasks", JSON.stringify(updatedList));

    if (updatedTask.status === "Complete") {
      const updatedCompletedTasks = [...completedTasks, updatedTask];
      setCompletedTasks(updatedCompletedTasks);
      setTasks(tasks.filter((task) => task.id !== id));

      localStorage.setItem("completedTasks", JSON.stringify(updatedCompletedTasks));
      localStorage.setItem("tasks", JSON.stringify(tasks.filter((task) => task.id !== id)));
    }
  };

  const deleteTask = (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this task?");
    if (!confirmation) return;
  
    if (showCompleted) {
      const updatedCompletedTasks = completedTasks.filter((task) => task.id !== id);
      setCompletedTasks(updatedCompletedTasks);
      localStorage.setItem("completedTasks", JSON.stringify(updatedCompletedTasks));
    } else {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  };
  

  const handleSelectTask = (id) => {
    setSelectedTasks((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((taskId) => taskId !== id) : [...prevSelected, id]
    );
  };

  const bulkDelete = () => {
    const confirmation = window.confirm("Are you sure you want to delete the selected tasks?");
    if (!confirmation) return; 
  
    if (showCompleted) {
      const updatedCompletedTasks = completedTasks.filter((task) => !selectedTasks.includes(task.id));
      setCompletedTasks(updatedCompletedTasks);
      localStorage.setItem("completedTasks", JSON.stringify(updatedCompletedTasks));
    } else {
      const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.id));
      setTasks(updatedTasks);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
  
    setSelectedTasks([]);
  };
  
  const bulkComplete = () => {
    const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.id));
    const completed = tasks.filter((task) => selectedTasks.includes(task.id)).map((task) => ({ ...task, status: "Complete" }));
    
    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, ...completed]);
    setSelectedTasks([]);
    
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem("completedTasks", JSON.stringify([...completedTasks, ...completed]));
  };

  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      if (dateA - dateB !== 0) return dateA - dateB;

      const convertTimeTo24Hour = (time) => {
        if (!time) return 0;
        const [hour, minute, period] = time.match(/(\d+):(\d+)\s(AM|PM)/).slice(1);
        let hour24 = period === "PM" && hour !== "12" ? parseInt(hour) + 12 : parseInt(hour);
        if (period === "AM" && hour === "12") hour24 = 0;
        return hour24 * 60 + parseInt(minute);
      };

      return convertTimeTo24Hour(a.startTime) - convertTimeTo24Hour(b.startTime);
    });
  };

  return (
    <div className="app-container">
      <img src="/main-white.png" alt="LexMeet Logo" className="logo" />
      <h1> Lex-Do-It List</h1>

      {!isAdding && !showCompleted && (
        <div className="button-container">
          <button className="add-btn" onClick={() => setIsAdding(true)}>Add Task</button>
          {completedTasks.length > 0 && (
            <button className="toggle-btn" onClick={() => {
              setShowCompleted(true);
              setSelectedTasks([]);
            }}>
              View Completed Tasks
            </button>
          )}
        </div>
      )}

      {selectedTasks.length > 0 && (
        <div className="button-container">
          {!showCompleted && (
            <button className="complete-btn" onClick={bulkComplete}>Mark as Complete</button>
          )}
          <button className="deletesel-btn" onClick={bulkDelete}>Delete Selected</button>
        </div>
      )}

      {showCompleted ? (
        <div>
          <button className="toggle-btn" onClick={() => {
              setShowCompleted(false);
              setSelectedTasks([]);
            }}>Back</button>
          <TodoList tasks={sortTasks(completedTasks)} updateTask={updateTask} deleteTask={deleteTask} handleSelectTask={handleSelectTask} selectedTasks={selectedTasks} />
        </div>
      ) : isAdding ? (
        <div className="task-form">
          <input type="text" placeholder="Task Name" value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} />
          <input type="time" value={newTask.startTime} onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })} />
          <input type="date" value={newTask.startDate} onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })} />
          <div className="button-group">
            <button className="save-btn" onClick={addTask}>Save</button>
            <button className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <TodoList tasks={sortTasks(tasks)} updateTask={updateTask} deleteTask={deleteTask} handleSelectTask={handleSelectTask} selectedTasks={selectedTasks} />
      )}
    </div>
  );
}

export default App;
