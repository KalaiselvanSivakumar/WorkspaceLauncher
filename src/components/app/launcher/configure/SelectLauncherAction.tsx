import { FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SelectLauncherAction() {
  return (
    <div className="space-y-1.5">
      <FieldLabel className="text-xs">Action</FieldLabel>
      <Select disabled defaultValue="Open">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Open">Open</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectLauncherAction;
