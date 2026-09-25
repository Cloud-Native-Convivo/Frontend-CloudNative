import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthProvider";
import router from "./routes/router";
import { Toaster } from "sileo";
import "sileo/styles.css";

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="bottom-right"
        theme="light"
        options={{
          duration: 3500,
          autopilot: true,
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
