import { useUIStore } from "./stores/ui-store";
import HomeScreen from "./screens/HomeScreen";

function App() {
  const screen = useUIStore((state) => state.screen);

  switch (screen.type) {
    case "home":
      return <HomeScreen />;
    case "create":
    case "edit":
      return null; // Placeholder for future implementation
    default:
      return null;
  }
}

export default App;
