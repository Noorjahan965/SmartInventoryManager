import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DashboardPage from './pages/dashboardPage/DashboardPage';
import LoginPage from './pages/loginPage/LoginPage';

import BillingPage from './pages/billingPage/BillingPage';
import ProductManagementPage from './pages/productPage/ProductManagementPage';
import AdminPanel from './pages/adminPage/AdminPanel';

import UnauthorizedPage from './pages/otherPages/UnauthorizedPage';

import ProtectedRoute from './routes/ProtectedRoute';
import Mainlayout from './layout/Mainlayout';

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<ProtectedRoute />}>    
                    <Route element={<Mainlayout />}>
                        <Route path="/home" element={<DashboardPage />} />

                        <Route path="/billing" element={<BillingPage />}/>
                        <Route path="/product-management" element={<ProductManagementPage />}/>
                        <Route path="/admin-panel" element={<AdminPanel />}/>
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
        </Router>
    );
}

export default App;
