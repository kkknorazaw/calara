import type { AddressItem } from "@/types";

interface AddressListProps {
  title: string;
  items: AddressItem[];
}

export function AddressList({ title, items }: AddressListProps): JSX.Element {
  return (
    <div className="address-box">
      <h3>{title}</h3>
      {items.map((item) => (
        <div className="address-row" key={`${item.label}-${item.value}`}>
          <span>{item.label}</span>
          <code>{item.value}</code>
        </div>
      ))}
    </div>
  );
}
