import "./App.css";
import Login from "./components/Auth/login/Login";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import SplashScreen from "./components/UI/splashScreen/SplashScreen";
import Feed from "./components/UI/feed/Feed";
import Profile from "./components/UI/profile/Profile";
import Layout from "./components/UI/layout/Layout";
import Comments from "./components/UI/comment section/Comments";
import Plank from "./components/UI/plank/Plank";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/feed" element={<Feed />} />
        <Route path="/feed">
          <Route index element={<Feed />} />
          <Route path="details/:id" element={<Comments />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/createPost" element={<Plank />} /> */}
        
        <Route path="/*" element={<Plank />} />
        
      </Routes>
    </Layout>
  );
}

export default App;
