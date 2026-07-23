import { useUIStore } from "./stores/ui-store";
import HomeScreen from "./screens/HomeScreen";
import CreateWorkspaceScreen from "./screens/CreateWorkspaceScreen";
import ConfigureWorkspaceScreen from "./screens/ConfigureWorkspaceScreen";

function App() {
  const screen = useUIStore((state) => state.screen);

  switch (screen.type) {
    case "home":
      return <HomeScreen />;
    case "create":
      return <CreateWorkspaceScreen />;
    case "configure":
      return <ConfigureWorkspaceScreen />;
    default:
      return null;
  }
}

export default App;
