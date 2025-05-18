import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FaTrash, FaCheck, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      alert('Failed to load tasks.');
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description) {
      return alert('Please fill in both title and description.');
    }

    try {
      // make sure status is lowercase for backend
      await api.post('/tasks', {
        title: newTask.title,
        description: newTask.description,
        status: newTask.status.toLowerCase(),
      });
      alert('Task created successfully!');
      setNewTask({ title: '', description: '', status: 'pending' });
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      alert('Task deleted successfully.');
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus =
      task.status === 'pending' ? 'in-progress' :
      task.status === 'in-progress' ? 'completed' :
      'pending';

    try {
      await api.put(`/tasks/${task._id}`, { status: nextStatus });
      alert(`Task marked as ${nextStatus}.`);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task.');
    }
  };

  // Start editing task: populate edit form & set editing id
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditForm({ title: '', description: '', status: '' });
  };

  // Save edited task
  const saveEdit = async () => {
    if (!editForm.title || !editForm.description) {
      return alert('Please fill in both title and description.');
    }

    try {
      await api.put(`/tasks/${editingTaskId}`, {
        title: editForm.title,
        description: editForm.description,
        status: editForm.status.toLowerCase(),
      });
      alert('Task updated successfully!');
      setEditingTaskId(null);
      setEditForm({ title: '', description: '', status: '' });
      fetchTasks();
    } catch (err) {
      console.error('Error saving task:', err);
      alert('Failed to update task.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button className="button logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <h3>Create New Task</h3>
        <input
          className="text-input"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          className="text-input"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          className="select-input"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="button" onClick={handleCreateTask}>Add Task</button>
      </div>

      <div className="card">
        <h3>Your Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id}>
                  <td>
                    {editingTaskId === task._id ? (
                      <input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    ) : (
                      task.title
                    )}
                  </td>
                  <td>
                    {editingTaskId === task._id ? (
                      <input
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    ) : (
                      task.description
                    )}
                  </td>
                  <td>
                    {editingTaskId === task._id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      task.status.charAt(0).toUpperCase() + task.status.slice(1)
                    )}
                  </td>
                  <td>
                    {editingTaskId === task._id ? (
                      <>
                        <button
                          className="icon-button"
                          onClick={saveEdit}
                          title="Save"
                        >
                          <FaSave />
                        </button>
                        <button
                          className="icon-button"
                          onClick={cancelEditing}
                          title="Cancel"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="icon-button"
                          onClick={() => startEditing(task)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="icon-button"
                          onClick={() => handleToggleStatus(task)}
                          title="Toggle Status"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="icon-button"
                          onClick={() => handleDeleteTask(task._id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
