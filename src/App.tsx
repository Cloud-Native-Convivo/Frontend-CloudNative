import { useState } from "react";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthProvider";
import { GlobalLoader } from "./components/GlobalLoader";
import router from "./routes/router";
import { Toaster } from "sileo";
import "sileo/styles.css";

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  return (
    <AuthProvider>
      {!isAppReady && (
        <GlobalLoader onComplete={() => setIsAppReady(true)} />
      )}
      
      <div 
        className={`transition-opacity duration-300 ease-out ${
          isAppReady ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <Toaster
          position="bottom-right"
          theme="light"
          options={{
            duration: 3500,
            autopilot: true,
          }}
        />
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}
