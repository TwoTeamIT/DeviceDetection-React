import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import "./i18nextConf";
import { useTranslation } from "react-i18next";

import "./components/css/site.css";

import API from "./configurations/apiConfig.json";

import Login from "./routes/Login";
import PageTemplate from "./PageTemplate";
import Default from "./Default";
import ErrorPage from "./routes/ErrorPage";

initializeIcons(
  "https://static2.sharepointonline.com/files/fabric/assets/icons/"
);

const App = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      window.location.pathname !== "/" &&
      document.getElementsByClassName(
        "link-" + window.location.pathname.replace("/", "")
      )[0]
    )
      document
        .getElementsByClassName(
          "link-" + window.location.pathname.replace("/", "")
        )[0]
        .classList.add("selected");
  });

  const login = async (credentials) => {
    const data = await fetch(API.BASE_URL + "/authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((data) => data.json())
      .catch(() => setLoginError(t("ConnectionFailed")));

    if (data || (data && data["title"] !== "Unauthorized")) {
      setToken(data["token"]);
      setUser(data["user"]);
      window.localStorage.setItem("token", data["token"]);
      window.localStorage.setItem("expiration", data["expiration"]);
      window.localStorage.setItem("userName", data["user"].userName);
      window.localStorage.setItem("role", data["user"].type);
    } else {
      setLoginError(t("Login_error"));
    }

    navigate("/send-sms");
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    window.localStorage.clear();

    navigate("/login");
  };

  function toggleSidebarText() {
    Array.prototype.forEach.call(
      document.getElementsByClassName("w-75"),
      function (element) {
        toggleSidebar
          ? element.classList.remove("d-md-block")
          : element.classList.add("d-md-block");
      }
    );

    let sidebar = document.getElementsByClassName("sidebar")[0].classList;
    let pageContent =
      document.getElementsByClassName("page-content")[0].classList;

    if (toggleSidebar) {
      sidebar.remove("col-md-3");
      sidebar.add("col-md-1");
      pageContent.remove("col-md-9");
      pageContent.add("col-md-11");
    } else {
      sidebar.add("col-md-3");
      sidebar.remove("col-md-1");
      pageContent.add("col-md-9");
      pageContent.remove("col-md-11");
    }

    setToggleSidebar(!toggleSidebar);
  }
  
  return (
    <Routes>
      <Route path="/device" element={<Default />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route
        path="*"
        element={
          <PageTemplate
            appToken={token}
            user={user}
            toggleSidebarText={toggleSidebarText}
            logout={logout}
          />
        }
      />
      <Route
        path="/login"
        element={<Login login={login} loginError={loginError} />}
      />
    </Routes>
  );
};

export default App;
