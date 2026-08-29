type StatCardProps = {
  title: string;
  value: string | number;
};

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-gray-500 text-lg font-medium">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-3 text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default StatCard;