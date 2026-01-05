export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">Home Page - Protected</h1>
          <p className="text-gray-600">Welcome, you are authenticated!</p>
        </div>
      </div>
    </div>
  );
}
