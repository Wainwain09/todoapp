import React, { useState, useEffect } from "react";
import TodoList from "./TodoList";
import "./styles.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", startTime: "", startDate: "" });
  const [isAdding, setIsAdding] = useState(false);

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

  const addTask = () => {
    if (newTask.name.trim() && newTask.startTime && newTask.startDate) {
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
    }
  };

  const updateTask = (id, updatedTask) => {
    const updatedList = tasks.map((task) =>
      task.id === id ? updatedTask : task
    );

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

  return (
    <div className="app-container">
      <img src="/lexmeet-logo.png" alt="LexMeet Logo" className="logo" />
      <h1>To-do List</h1>

      {!isAdding && !showCompleted && (
        <div className="button-container">
          <button className="add-btn button-73" onClick={() => setIsAdding(true)}>Add Task</button>
          {completedTasks.length > 0 && (
            <button className="toggle-btn button-73" onClick={() => setShowCompleted(true)}>
              View Completed Tasks
            </button>
          )}
        </div>
      )}

      {showCompleted ? (
        <div>
          <button className="toggle-btn button-73" onClick={() => setShowCompleted(false)}>Back</button>
          <TodoList tasks={completedTasks} deleteTask={deleteTask} isCompletedView={true} />
        </div>
      ) : isAdding ? (
        <div className="task-form">
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <input
            type="time"
            value={newTask.startTime}
            onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
          />
          <input
            type="date"
            value={newTask.startDate}
            onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
          />
          
          <div className="button-group">
            <button className="save-btn button-73" onClick={addTask}>Save</button>
            <button className="cancel-btn button-73" onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <TodoList tasks={tasks} updateTask={updateTask} deleteTask={deleteTask} />
      )}
    </div>
  );
}

export default App;
