
function ShippingDetails({ shipping }) {
  return (
    <div>
      <div className="d-flex flex-wrap mt-2 flex-column text-capitalize">
        <div className="d-flex flex-wrap align-items-center gap-1">
          <span className='text-gray-600 fw-bold'>Address:</span>
          <div>
            {' '}
            <span >
              {shipping.street} {shipping.localGvt}, {shipping.state}{' '}
              {shipping.country}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center  gap-2">
          <span className='fw-bold text-gray-600'>Name: </span>
          <span className="">{shipping?.name}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className='fw-bold text-gray-600'>phone number: </span>
          <span >{shipping?.phoneNumber}</span>
        </div>
      </div>
    </div>
  );
}

export default ShippingDetails;
