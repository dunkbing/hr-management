import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import PrincipalLayout from "./layouts/PrincipalLayout";
import LecturerLayout from "./layouts/LecturerLayout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EmployeeList from "./pages/EmployeeList";
import EmployeeDetail from "./pages/EmployeeDetail";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import DepartmentsPositions from "./pages/DepartmentsPositions";
import Settings from "./pages/Settings";
import Faculties from "./pages/Faculties";
import AddEmployee from "./pages/AddEmployee";
import PositionManagement from "./pages/PositionManagement";
import ContractManagement from "./pages/ContractManagement";
import ApprovalPage from "./pages/ApprovalPage";
import RewardDisciplineManagement from "./pages/RewardDisciplineManagement";

import FacultyDashboard from "./pages/FacultyDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import PrincipalApproval from "./pages/PrincipalApproval";
import PrincipalReports from "./pages/PrincipalReports";
import FacultyEmployees from "./pages/FacultyEmployees";

import PrincipalEmployeesPage from "./pages/PrincipalEmployeesPage";
import PrincipalEmployeeDetail from "./pages/PrincipalEmployeeDetail";
import PrincipalDepartmentManagement from "./pages/PrincipalDepartmentManagement";
import PrincipalFacultyManagement from "./pages/PrincipalFacultyManagement";
import PrincipalSettings from "./pages/PrincipalSettings";
import SignatureVerification from "./pages/SignatureVerification";
import FacultyEmployeeDetail from "./pages/FacultyEmployeeDetail";
import FacultyProposal from "./pages/FacultyProposal";
import FacultyHeadApproval from "./pages/FacultyHeadApproval";
import FacultyReports from "./pages/FacultyReport";
import FacultySettings from "./pages/FacultySettings";
// import Departments from "./pages/Departments";
// import FacultyManagement from "./pages/FacultyManagement";
import LecturerDashboard from "./pages/LecturerDashboard";
import LecturerProfile from "./pages/LecturerProfile";
import LecturerSubmitRequest from "./pages/LecturerSubmitRequest";
import LecturerMyRequests from "./pages/LecturerMyRequests";
import NotificationList from "./pages/NotificationList";
import NotificationDetail from "./pages/NotificationDetail";


// Helper component to wrap Profile with correct layout based on role
const ProfileWithLayout = () => {
  const role = localStorage.getItem("role");
  if (role === "hieutruong" || role === "hieu_truong") {
    return <PrincipalLayout><Profile /></PrincipalLayout>;
  }
  if (role === "truongkhoa" || role === "truong_don_vi") {
    return <FacultyLayout><Profile /></FacultyLayout>;
  }
  return <AdminLayout><Profile /></AdminLayout>;
};

// Helper component for notifications
const NotificationWithLayout = () => {
  const role = localStorage.getItem("role");
  if (role === "hieutruong" || role === "hieu_truong") {
    return <PrincipalLayout><NotificationList /></PrincipalLayout>;
  }
  if (role === "truongkhoa" || role === "truong_don_vi") {
    return <FacultyLayout><NotificationList /></FacultyLayout>;
  }
  if (role === "giangvien" || role === "nhan_su") {
    return <LecturerLayout><NotificationList /></LecturerLayout>;
  }
  return <AdminLayout><NotificationList /></AdminLayout>;
};

const NotificationDetailWithLayout = () => {
  const role = localStorage.getItem("role");
  if (role === "hieutruong" || role === "hieu_truong") {
    return <PrincipalLayout><NotificationDetail /></PrincipalLayout>;
  }
  if (role === "truongkhoa" || role === "truong_don_vi") {
    return <FacultyLayout><NotificationDetail /></FacultyLayout>;
  }
  if (role === "giangvien" || role === "nhan_su") {
    return <LecturerLayout><NotificationDetail /></LecturerLayout>;
  }
  return <AdminLayout><NotificationDetail /></AdminLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ------ ADMIN ROUTES ------ */}
        <Route
          path="/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/employees"
          element={
            <AdminLayout>
              <EmployeeList />
            </AdminLayout>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <AdminLayout>
              <EmployeeDetail />
            </AdminLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AdminLayout>
              <Reports />
            </AdminLayout>
          }
        />
        <Route
          path="/departments"
          element={
            <AdminLayout>
              <DepartmentsPositions />
            </AdminLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />
        <Route
          path="/faculties"
          element={
            <AdminLayout>
              <Faculties />
            </AdminLayout>
          }
        />
        <Route
          path="/employees/add"
          element={
            <AdminLayout>
              <AddEmployee />
            </AdminLayout>
          }
        />
        <Route
          path="/employees/edit/:id"
          element={
            <AdminLayout>
              <AddEmployee />
            </AdminLayout>
          }
        />
        <Route
          path="/positions"
          element={
            <AdminLayout>
              <PositionManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/contracts"
          element={
            <AdminLayout>
              <ContractManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/approvals"
          element={
            <AdminLayout>
              <ApprovalPage />
            </AdminLayout>
          }
        />
        <Route
          path="/reward-discipline"
          element={
            <AdminLayout>
              <RewardDisciplineManagement />
            </AdminLayout>
          }
        />

        {/* PROFILE PAGE — Tự động nhận diện layout theo Role */}
        <Route
          path="/profile"
          element={<ProfileWithLayout />}
        />

        {/* ------ FACULTY ROUTES (Trưởng khoa) ------ */}
        <Route
          path="/faculty/dashboard"
          element={
            <FacultyLayout>
              <FacultyDashboard />
            </FacultyLayout>
          }
        />

        {/* ------ PRINCIPAL ROUTES (Hiệu trưởng) ------ */}
        <Route
          path="/principal/dashboard"
          element={
            <PrincipalLayout>
              <PrincipalDashboard />
            </PrincipalLayout>
          }
        />

        {/* ⭐ Thêm route phê duyệt nhân sự của hiệu trưởng */}
        <Route
          path="/principal/approvals"
          element={
            <PrincipalLayout>
              <PrincipalApproval />
            </PrincipalLayout>
          }
        />
        <Route
          path="/principal/reports"
          element={
            <PrincipalLayout>
              <PrincipalReports />
            </PrincipalLayout>
          }
        />

        {/* DEFAULT → Trang admin dashboard */}
        <Route
          path="/"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/faculty/employees"
          element={
            <FacultyLayout>
              <FacultyEmployees />
            </FacultyLayout>
          }
        />
        <Route
          path="/faculty/employees/:id"
          element={
            <FacultyLayout>
              <FacultyEmployeeDetail />
            </FacultyLayout>
          }
        />
        <Route
          path="/faculty/proposals"
          element={
            <FacultyLayout>
              <FacultyProposal />
            </FacultyLayout>
          }
        />
        <Route
          path="/faculty/approvals"
          element={
            <FacultyLayout>
              <FacultyHeadApproval />
            </FacultyLayout>
          }
        />
        <Route
          path="/faculty/reports"
          element={
            <FacultyLayout>
              <FacultyReports />
            </FacultyLayout>
          }
        />
        <Route
          path="/faculty/settings"
          element={
            <FacultyLayout>
              <FacultySettings />
            </FacultyLayout>
          }
        />

        <Route
          path="/principal/employees"
          element={
            <PrincipalLayout>
              <PrincipalEmployeesPage />
            </PrincipalLayout>
          }
        />

        <Route
          path="/principal/employees/:id"
          element={
            <PrincipalLayout>
              <PrincipalEmployeeDetail />
            </PrincipalLayout>
          }
        />
        <Route
          path="/principal/departments"
          element={
            <PrincipalLayout>
              <PrincipalDepartmentManagement />
            </PrincipalLayout>
          }
        />
        <Route
          path="/principal/faculties"
          element={
            <PrincipalLayout>
              <PrincipalFacultyManagement />
            </PrincipalLayout>
          }
        />
        <Route
          path="/principal/settings"
          element={
            <PrincipalLayout>
              <PrincipalSettings />
            </PrincipalLayout>
          }
        />
        <Route
          path="/principal/verify-signature"
          element={
            <PrincipalLayout>
              <SignatureVerification />
            </PrincipalLayout>
          }
        />
        {/* <Route
  path="/departments/list"
  element={
    <AdminLayout>
      <Departments />
    </AdminLayout>
  }
/> */}
        {/* <Route
  path="/faculties/list"
  element={
    <AdminLayout>
      <FacultyManagement />
    </AdminLayout>
  }
/> */}
        <Route
          path="/lecturer/dashboard"
          element={
            <LecturerLayout>
              <LecturerDashboard />
            </LecturerLayout>
          }
        />
        <Route
          path="/lecturer/profile"
          element={
            <LecturerLayout>
              <LecturerProfile />
            </LecturerLayout>
          }
        />
        <Route
          path="/lecturer/submit-request"
          element={
            <LecturerLayout>
              <LecturerSubmitRequest />
            </LecturerLayout>
          }
        />
        <Route
          path="/lecturer/my-requests"
          element={
            <LecturerLayout>
              <LecturerMyRequests />
            </LecturerLayout>
          }
        />

        {/* NOTIFICATIONS */}
        <Route
          path="/notification"
          element={<NotificationWithLayout />}
        />
        <Route
          path="/notification/:id"
          element={<NotificationDetailWithLayout />}
        />
      </Routes>
    </Router>
  );
}

export default App;
