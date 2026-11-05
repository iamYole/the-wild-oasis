import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBookingHook } from "./useBookingHook";
import Spinner from "../../ui/Spinner";

import { useNavigate } from "react-router-dom";
import { useCheckinHook } from "../check-in-out/useCheckinHook";
import Empty from "../../ui/Empty";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const {
    bookingDetails: booking,
    deleteBooking,
    isDeleteing,
    isLoadingOne,
  } = useBookingHook();
  const { checkOut, isCheckingOut } = useCheckinHook();
  const navigate = useNavigate();

  const moveBack = useMoveBack();

  if (isLoadingOne) return <Spinner />;

  if (!booking) return <Empty resourceName="bookings" />;

  const { status, id: bookingId } = booking;
  // console.log(booking);

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking ref: {bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "checked-in" && (
          <Button onClick={() => checkOut(bookingId)} disable={isCheckingOut}>
            Check out
          </Button>
        )}
        {status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}
        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger" disabled={isDeleteing}>
              Delete booking
            </Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              onConfirm={() =>
                deleteBooking(bookingId, { onSettled: () => navigate(-1) })
              }
            />
          </Modal.Window>
        </Modal>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
