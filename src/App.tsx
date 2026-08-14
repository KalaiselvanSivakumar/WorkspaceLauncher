import { Screen, useUIStore } from "./stores/ui-store";
import HomeScreen from "./screens/HomeScreen";
import CreateWorkspaceScreen from "./screens/CreateWorkspaceScreen";
import ConfigureWorkspaceScreen from "./screens/ConfigureWorkspaceScreen";
import StyledToaster from "./components/ui/StyledToast";

function getScreenComponent(screenType: Screen["type"]) {
  switch (screenType) {
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

function App() {
  const screen = useUIStore((state) => state.screen);

  const screenComponent = getScreenComponent(screen.type);

  return (
    <>
      {screenComponent}
      <StyledToaster expand position="top-center" duration={6000} />
    </>
  );
}

export default App;
