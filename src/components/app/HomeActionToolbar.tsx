import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

interface HomeActionToolbarProps {
    readonly setFilterWorkspaceName: (title: string) => void;
}

function HomeActionToolbar({ setFilterWorkspaceName }: HomeActionToolbarProps) {
    const showCreate = useUIStore((state) => state.showCreate);

    return (
        <div className="flex justify-between px-6 py-4">
            <InputGroup className="w-3/5 max-w-md">
                <InputGroupInput
                    placeholder="Search Workspace..."
                    onChange={(e) => setFilterWorkspaceName(e.target.value)}
                />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup>
            <Button type="button" className="gap-1"
                onClick={() => showCreate()}
            >
                <PlusIcon /> Create Workspace
            </Button>
        </div>
    )
}

export default HomeActionToolbar;