import React from 'react';
import StudentHeader from '../StudentHeader/StudentHeader';
import StudentDashboardView from './views/StudentDashboardView';
import StudentProfileView from '../StudentProfileView/StudentProfileView';
import StudentHistoryView from '../StudentHistoryView/StudentHistoryView';
import StudentMoodHistoryView from '../StudentMoodHistoryView/StudentMoodHistoryView';
import './StudentMainContent.css';
const StudentMainContent = ({ activeSection, user, metrics, onSectionChange }) => {
  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <StudentDashboardView user={user} metrics={metrics} onSectionChange={onSectionChange} />;
      case 'profile':
        return <StudentProfileView user={user} />;
      case 'history':
        return <StudentHistoryView user={user} />;
      case 'mood':
        return <StudentMoodHistoryView user={user} />;
      case 'catalogo':
        return <StudentDashboardView user={user} metrics={metrics} onSectionChange={onSectionChange} />;
      case 'timer':
        return <StudentDashboardView user={user} metrics={metrics} onSectionChange={onSectionChange} />;
      default:
        return <StudentDashboardView user={user} metrics={metrics} onSectionChange={onSectionChange} />;
    }
  };
  return (
    <div className="student-main-content">
      <StudentHeader user={user} />
      {renderContent()}
    </div>
  );
};
export default StudentMainContent;
