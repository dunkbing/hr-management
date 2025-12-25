const DashboardCard = ({ label, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition">
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

export default DashboardCard;
