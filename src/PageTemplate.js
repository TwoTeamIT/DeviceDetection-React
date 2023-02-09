import { Suspense, lazy, useEffect } from "react";
import { Spinner } from "@fluentui/react";
import { Navigate, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

const SmsService = lazy(() => import("./routes/SmsService"));
const NumberManagement = lazy(() => import("./routes/NumberManagement"));
const MessageGenerator = lazy(() => import("./routes/MessageGenerator"));
const UserManagement = lazy(() => import("./routes/UserManagement"));
const BrandIdentity = lazy(() => import("./routes/BrandIdentity"));
const SmsSend = lazy(() => import("./routes/SmsSend"));

const ADMIN = "0";
const READER = "1";

const PageTemplate = ({ apiToken, apiUser, toggleSidebarText, logout }) => {
  const token = apiToken ? apiToken : window.localStorage.getItem("token");
  const expiration = window.localStorage.getItem("expiration");
  const userName = apiUser
    ? apiUser.userName
    : window.localStorage.getItem("userName");
  const role = apiUser ? apiUser.role : window.localStorage.getItem("role");

  useEffect(() => {
    if (new Date().toISOString() > expiration) window.localStorage.clear();
  });

  if (!token) return <Navigate replace to="/login" />;
  else
    return (
      <div className="mw-100 h-100 d-flex flex-row">
        <div className="sidebar col-2 col-md-3">
          <Sidebar toggleSidebarText={toggleSidebarText} user={apiUser} />
        </div>
        <div className="page-content col-10 col-md-9 d-flex flex-column justify-content-between">
          <div>
            <div className="sticky-top">
              <Navbar logout={logout} adminPanel={true} />
            </div>
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/send-sms" element={<SmsSend token={token} />} />
                {role !== READER && (
                  <>
                    <Route
                      path="/number-management"
                      element={<NumberManagement token={token} />}
                    />
                    <Route
                      path="/message-generator"
                      element={<MessageGenerator token={token} />}
                    />
                  </>
                )}
                {role === ADMIN && (
                  <>
                    <Route
                      path="/sms-service"
                      element={<SmsService token={token} />}
                    />
                    <Route
                      path="/user-management"
                      element={<UserManagement token={token} />}
                    />
                    <Route
                      path="/brand-identity"
                      element={<BrandIdentity token={token} />}
                    />
                  </>
                )}
              </Routes>
            </Suspense>
          </div>
          <div className="p-2 text-center">
            <Footer />
          </div>
        </div>
      </div>
    );
};

export default PageTemplate;
