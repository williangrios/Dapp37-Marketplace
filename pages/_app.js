import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@styles/globals.css";

//no operation component (empty component)
const Noop = ({ children }) => <>{children}</>;

function MyApp({ Component, pageProps }) {
  const { Layout } = Component ?? Noop;

  return (
    <Layout>
      <ToastContainer />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
