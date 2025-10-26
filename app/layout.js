import Footer from "./components/Footer";
import Header from "./components/Header";
import { ToastProvider } from "./components/toast/ToastProvider";
import { DataProvider } from "./context/DataContext";
import "./styles/globals.scss";

export const metadata = {
  title: "Robotsaz",
  description: "Robotsaz Green Industry Inc.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <ToastProvider duration={4000}>
          <DataProvider>
            <Header />
            {children}
            <Footer />
          </DataProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
