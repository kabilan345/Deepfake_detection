import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [chartData, setChartData] = useState([]);

  const COLORS = ['#00C49F', '#FF4444'];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const q = query(collection(db, 'detections'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRecords(data);

      const realCount = data.filter(d => d.label === 'real').length;
      const fakeCount = data.filter(d => d.label === 'fake').length;

      setChartData([
        { name: 'Real', value: realCount },
        { name: 'Fake', value: fakeCount }
      ]);
    };

    fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'detections', id));
    const updatedRecords = records.filter(r => r.id !== id);
    setRecords(updatedRecords);

    const realCount = updatedRecords.filter(d => d.label === 'real').length;
    const fakeCount = updatedRecords.filter(d => d.label === 'fake').length;

    setChartData([
      { name: 'Real', value: realCount },
      { name: 'Fake', value: fakeCount }
    ]);
  };

  return (
    <div className="dashboard-container">
      <h1 className="glow-heading">Dashboard</h1>

      <div className="profile-section">
        <img
          src={user?.photoURL}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          <p><strong>Name:</strong> {user?.displayName || 'Not provided'}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <button onClick={handleLogout} className="glow-button">Logout</button>
        </div>
      </div>

      <h2 className="section-heading-d">Detection History</h2>
      {records.length > 0 ? (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Video Name</th>
              <th>Label</th>
              <th>Date/Time</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td>{record.videoName}</td>
                <td className={record.label === 'real' ? 'label-real' : 'label-fake'}>
                  {record.label}
                </td>
                <td>{record.timestamp ? new Date(record.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</td>
                <td><button onClick={() => handleDelete(record.id)} className="delete-button">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="no-records">No records found.</p>}

      <h2 className="section-heading-d">Detection Summary</h2>
      <div className="chart-container">
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;
