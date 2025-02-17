import React, { useState } from "react";

function TodoList({ tasks, updateTask, deleteTask, isCompletedView = false }) {
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState({});

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditedTask(task);
  };

  const saveEdit = () => {
    updateTask(editedTask.id, editedTask);
    setEditingTask(null);
  };

  return (
    <div className="todo-container">
      <table className="todo-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Start Time</th>
            <th>Start Date</th>
            {!isCompletedView && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                {editingTask === task.id ? (
                  <input
                    type="text"
                    value={editedTask.name}
                    onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                  />
                ) : (
                  task.name
                )}
              </td>
              <td>
                {isCompletedView ? (
                  <span className="status-btn complete">Complete</span>
                ) : (
                  <button
                    className={`status-btn ${task.status === "Complete" ? "complete" : "incomplete"}`}
                    onClick={() =>
                      updateTask(task.id, {
                        ...task,
                        status: task.status === "Complete" ? "Incomplete" : "Complete",
                      })
                    }
                  >
                    {task.status}
                  </button>
                )}
              </td>
              <td>
                {editingTask === task.id ? (
                  <input
                    type="time"
                    value={editedTask.startTime}
                    onChange={(e) => setEditedTask({ ...editedTask, startTime: e.target.value })}
                  />
                ) : (
                  task.startTime
                )}
              </td>
              <td>
                {editingTask === task.id ? (
                  <input
                    type="date"
                    value={editedTask.startDate}
                    onChange={(e) => setEditedTask({ ...editedTask, startDate: e.target.value })}
                  />
                ) : (
                  task.startDate
                )}
              </td>
              <td className="actions">
  {isCompletedView ? (
    <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
  ) : editingTask === task.id ? (
    <div className="flex">
      <button className="save-btn" onClick={saveEdit}>Save</button>
      <button className="cancel-btn" onClick={() => setEditingTask(null)}>Cancel</button>
    </div>
  ) : (
    <div className="flex">
      <button className="edit-btn" onClick={() => handleEdit(task)}>Edit</button>
      <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
    </div>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodoList;
