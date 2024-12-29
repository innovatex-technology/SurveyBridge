import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/dashboard/Profile';
import LoginPage from './components/login/LoginPage';
import SurveyFormPage from './components/surveys/SurveyFormPage';
import SurveyListPage from './components/surveys/SurveyListPage';
import SurveyDetailPage from './components/surveys/SurveyDetailPage';
import UserSurveySystem from './components/surveys/UserSurveySystem';
import SurveyReportPage from './components/report/SurveyReportPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-survey" element={<SurveyFormPage />} />
            <Route path="/surveys" element={<SurveyListPage />} />
            <Route path="/survey/:id" element={<SurveyDetailPage/>} />
            <Route path="/reports" element={<SurveyReportPage/>} />
            <Route path="/reports/:id" element={<SurveyReportPage/>} />
            <Route path="/user-survey" element={<UserSurveySystem/>} />
            <Route path="/user-survey/:id" element={<UserSurveySystem/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
