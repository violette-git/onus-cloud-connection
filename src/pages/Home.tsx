import { Navbar } from "@/components/Navbar";

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <div className="onus-container">
          <h1 className="text-3xl font-bold">Welcome to Onus</h1>
        </div>
      </main>
    </div>
  );
};