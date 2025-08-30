import LoginSignupForm from "@/components/auth/LoginSignupForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md w-full z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Notes App
          </h1>
        </nav>
      </header>
      <main className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <LoginSignupForm />
      </main>
    </div>
  );
}
