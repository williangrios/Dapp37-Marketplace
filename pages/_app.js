import '@styles/globals.css';

//no operation component (empty component)
const Noop = ({children}) => <>{children}</>

function MyApp({ Component, pageProps }) {
  const {Layout} = Component ?? Noop

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) 
}

export default MyApp
