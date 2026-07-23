import { useUIStore } from "./stores/ui-store";
import HomeScreen from "./screens/HomeScreen";
import CreateWorkspaceScreen from "./screens/CreateWorkspaceScreen";
import EditWorkspaceScreen from "./screens/EditWorkspaceScreen";

function App() {
  const screen = useUIStore((state) => state.screen);

  switch (screen.type) {
    case "home":
      return <HomeScreen />;
    case "create":
      return <CreateWorkspaceScreen />;
    case "edit":
      return <EditWorkspaceScreen />;
    default:
      return null;
  }
}

export default App;
