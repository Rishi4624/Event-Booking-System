import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Success from "./pages/Success";
import EventDetail from "./pages/EventDetail";
import Events from "./pages/Events";
import Login from "./pages/Login";
import EventList from "./admin/EventList";
import AdminLayout from "./admin/AdminLayout";
import AddEvent from "./admin/AddEvent";
import EditEvent from "./admin/EditEvent";
import AddAdmin from "./admin/AddAdmin";
import BookingManagement from "./admin/BookingManagment";
import BookingPage from "./pages/BookingPage";
import Signup from "./pages/Signup";
import { PrivateRoute, PublicRoute } from "../middleware.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>
        

        
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/success" element={<Success />} />
        <Route path="/book/event/:id" element={<BookingPage />} />
        
        <Route element={<PrivateRoute allow={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="add-event" element={<AddEvent />} />
            <Route path="edit-event/:id" element={<EditEvent />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="events" element={<EventList />} />
            <Route path="add-admin" element={<AddAdmin />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
