import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, MessageSquare, User, Briefcase } from 'lucide-react';
import '../styles/ActivityFeed.css';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  // Simulate loading from API/localStorage
  useEffect(() => {
    const storedActivities = localStorage.getItem('activityFeed');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      const mockData = [
        { id: 1, type: 'upload', message: 'Uploaded a new file', timestamp: '2025-10-01T10:00:00' },
        { id: 2, type: 'task', message: 'Completed a task', timestamp: '2025-10-01T11:30:00' },
        { id: 3, type: 'comment', message: 'Commented on a post', timestamp: '2025-10-01T12:15:00' },
        { id: 4, type: 'profile', message: 'Updated profile information', timestamp: '2025-10-01T13:45:00' },
        { id: 5, type: 'project', message: 'Joined a new project', timestamp: '2025-10-01T14:20:00' },
      ];
      setActivities(mockData);
      localStorage.setItem('activityFeed', JSON.stringify(mockData));
    }
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'upload': return <Upload className="activity-icon upload" />;
      case 'task': return <CheckCircle className="activity-icon task" />;
      case 'comment': return <MessageSquare className="activity-icon comment" />;
      case 'profile': return <User className="activity-icon profile" />;
      case 'project': return <Briefcase className="activity-icon project" />;
      default: return null;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const diff = (new Date() - new Date(timestamp)) / 1000; // in seconds
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="activity-feed">
      <h3 className="activity-feed-title">Recent Activity</h3>
      <ul className="activity-list">
        {activities.map((activity) => (
          <li key={activity.id} className="activity-item">
            {getIcon(activity.type)}
            <div className="activity-details">
              <span className="activity-message">{activity.message}</span>
              <span className="activity-timestamp">{formatTimeAgo(activity.timestamp)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
