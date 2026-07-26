import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

interface ViewFieldValuePairProps {
  fieldName: string;
  value: string;
}

function ViewFieldValuePair({ fieldName, value }: ViewFieldValuePairProps) {
  return (
    <div>
      <Item className="p-0">
        <ItemContent>
          <ItemTitle className="capitalize">{fieldName}</ItemTitle>
          <ItemDescription className="capitalize">{value}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}

export default ViewFieldValuePair;
