export default function Success({ qr }) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <h1 className="text-3xl font-bold mb-5">Booking Successful!</h1>
      <img src={qr} className="w-48" />
      <p>Scan this at the event counter</p>
    </div>
  );
}
