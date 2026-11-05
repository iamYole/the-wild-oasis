import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All" },
          { value: "with-discount", label: "With Discount" },
          { value: "no-discount", label: "No Discount" },
        ]}
      />
      <SortBy
        options={[
          { value: "name-asc", label: "Sort by name [A-Z]" },
          { value: "name-desc", label: "Sort by name [Z-A]" },
          { value: "regularPrice-desc", label: "Sort by price [High - Low]" },
          { value: "regularPrice-asc", label: "Sort by price [Low - High]" },
          {
            value: "maxCapacity-desc",
            label: "Sort by Maximum Capacity [High - Low]",
          },
          {
            value: "maxCapacity-asc",
            label: "Sort by Maximum Capacity [Low - High]",
          },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
