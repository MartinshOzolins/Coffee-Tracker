//Layout
import Layout from "./components/Layout";

//components
import CoffeeForm from "./components/CoffeeForm";
import Stats from "./components/Stats";
import History from "./components/History";
import Hero from "./components/Hero";

//useAuth() - custom hook created inside AuthContext.jsx, which provied all values that we pass in AuthContext.Provider
import { useAuth } from "./context/AuthContext";

export default function App() {
  const {globalUser, globalData, isLoading} = useAuth()
  const isAuthenticated = globalUser
  const isData = globalData && !!Object.keys(globalData || {}).length //checks if globalData exists and whether it has entries

  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  );
  return (
    <Layout>
      <Hero />
      <CoffeeForm isAuthenticated={isAuthenticated} />
      {isAuthenticated && isLoading && (
        <p>Loading data....</p>
      )}
      {(isAuthenticated && isData) && authenticatedContent}
    </Layout>
  );
}
