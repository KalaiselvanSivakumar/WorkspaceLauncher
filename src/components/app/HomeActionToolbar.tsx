import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

interface HomeActionToolbarProps {
  readonly setFilterWorkspaceName: (title: string) => void;
}

function HomeActionToolbar({ setFilterWorkspaceName }: HomeActionToolbarProps) {
  return (
    <div className="flex justify-between px-6 pt-4">
      <InputGroup className="w-3/5 max-w-md">
        <InputGroupInput
          placeholder="Search Workspace..."
          onChange={(e) => setFilterWorkspaceName(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export default HomeActionToolbar;
