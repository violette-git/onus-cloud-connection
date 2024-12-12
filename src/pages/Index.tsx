import { Navbar } from "@/components/Navbar";
import { Profile } from "@/components/Profile";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Profile />
      </main>
    </div>
  );
};

export default Index;