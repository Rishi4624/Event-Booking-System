import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Success from "./pages/Success";
import EventDetail from "./pages/EventDetail";
import Events from "./pages/Events";
import AdminLogin from "./admin/AdminLogin";
import EventList from "./admin/EventList";
import AdminLayout from "./admin/AdminLayout";
import AddEvent from "./admin/AddEvent";
import EditEvent from "./admin/EditEvent";
import AddAdmin from "./admin/AddAdmin";
import BookingManagement from "./admin/BookingManagment";
import BookingPage from "./pages/bookingPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/success" element={<Success />} />
        <Route path="/book/event/:id" element={<BookingPage />} />
        
          <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/add-event" element={<AddEvent />} />
          <Route path="/admin/edit-event/:id" element={<EditEvent />} />
          <Route path="/admin/bookings" element={<BookingManagement />} />
          <Route path="/admin/events" element={<EventList />} />
          <Route path="/admin/add-admin" element={<AddAdmin />} />
          
          
          </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
