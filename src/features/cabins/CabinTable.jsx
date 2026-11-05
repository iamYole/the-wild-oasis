import styled from "styled-components";

import Spinner from "./../../ui/Spinner";
import CabinRow from "./CabinRow";
import toast from "react-hot-toast";
import { useCabinHooks } from "./useCabinHook";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

function CabinTable() {
  const [searchParams] = useSearchParams();
  const { isLoading, error, cabins } = useCabinHooks();

  if (isLoading) return <Spinner />;

  // Filter
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;

  if (filterValue === "all") filteredCabins = cabins;
  if (filterValue === "no-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  if (filterValue === "with-discount")
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  // Sorting
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  function compare(a, b) {
    if (a["name"].toLowerCase() < b["name"].toLowerCase()) {
      return -1 * modifier;
    }
    if (a["name"].toLowerCase() > b["name"].toLowerCase()) {
      return 1 * modifier;
    }
    return 0;
  }

  const sortedCabins =
    field === "name"
      ? filteredCabins.sort(compare)
      : filteredCabins.sort((a, b) => (a[field] - b[field]) * modifier);
  // const sortedCabin = filteredCabins.sort(
  //   (a, b) => (a[field] - b[field]) * modifier,
  // );

  if (error || !sortedCabins.length) {
    toast.error(error.message);
    return (
      <Empty resourceName="cabins" />
      // <Menus>
      //   <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
      //     <Table.Header>
      //       <div></div>
      //       <div>Cabin</div>
      //       <div>Capacity</div>
      //       <div>Price</div>
      //       <div>Discount</div>
      //       <div></div>
      //     </Table.Header>
      //   </Table>
      // </Menus>
    );
  }
  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <TableHeader role="row">
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </TableHeader>
        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
