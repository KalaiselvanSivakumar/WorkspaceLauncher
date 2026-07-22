import { useUIStore } from "./stores/ui-store";
import HomeScreen from "./screens/HomeScreen";
import CreateLauncherScreen from "./screens/CreateLauncherScreen";
import EditLauncherScreen from "./screens/EditLauncherScreen";

function App() {
  const screen = useUIStore((state) => state.screen);

  switch (screen.type) {
    case "home":
      return <HomeScreen />;
    case "create":
      return <CreateLauncherScreen />;
    case "edit":
      return <EditLauncherScreen />;
    default:
      return null;
  }
}

export default App;
