import { Button, Rating } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function AceeptOrReportOrder({
  data,
  cancelWarning,
  setCancelWarning,
  takeOrder,
  refundAndCancelOrder,
  userInfo,
}) {
  return (
    <div>
      
      {data?.products &&
        data?.products[0]?.businessId !== false &&
        data?.details?.isCancelled === false && (
          <>
            {data?.details && !data?.details?.isTaken ? (
              <div>
                {!cancelWarning && (
                  <div className="d-flex align-items-center mt-2 gap-3">
                    <Button
                      variant="success"
                      className="fw-bold d-flex align-items-center"
                      onClick={() =>
                        takeOrder(data?.details?.businessId, data?.details?._id)
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      className="fw-bold d-flex align-items-center"
                      onClick={() => setCancelWarning(true)}
                    >
                      Refund & Cancel
                    </Button>
                  </div>
                )}
                {cancelWarning && (
                  <div
                    className="d-flex p-2 align-items-center flex-column my-2 border rounded errors"
                    style={{ width: 'fit-content' }}
                  >
                    <span className="text-white fw-bold">
                      Are you sure you want cancel this order now?
                    </span>
                    <div className="d-flex align-items-center mt-2 gap-3">
                      <Button
                        variant="light"
                        className="fw-bold d-flex align-items-center border border-danger"
                        onClick={() => setCancelWarning(false)}
                      >
                        No
                      </Button>
                      <Button
                        variant="success"
                        className="fw-bold d-flex align-items-center"
                        onClick={() => refundAndCancelOrder(data?.details?._id)}
                      >
                        Yes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {userInfo?.user?._id !== data?.details?.buyerId && (
                  <div className="font1bg my-3 p-2 border border-rounded">
                    {data?.details?.isPaid && (
                      <div className="d-flex justify-content-between">
                        {' '}
                        <span className="d-flex text-white fw-bold fs-4 align-items-center gap-1">
                          <DoneAllIcon />
                          Paid
                        </span>{' '}
                        <div className="d-flex flex-column mt-2 text-white">
                          <span>
                            Date {data?.details?.isPaidAt.slice(0, 10)}
                          </span>
                          <span>
                            Time {data?.details?.isPaidAt.slice(11, 16)}
                          </span>
                        </div>
                      </div>
                    )}

                    <span>
                      Note: this order has been comfirmed, for futher enquiries
                      or help, kindly report below{' '}
                    </span>

                    <Button
                      variant="white"
                      className="fw-bold text-danger border-danger mt-1 d-flex align-items-center"
                    >
                      Report/dispute
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      <div className="font1bg">
        <div className="d-grid">
          <Button variant="light">
            {userInfo?.user?._id === data?.details?.buyerId ? (
              <div>
                <div className="d-flex  flex-column text-start">
                  <span className="fw-bold"> Business Details</span>
                  <span>Name: {data?.details?.businessName}</span>
                  <span>
                    Reputation: <Rating product={data?.details} />{' '}
                  </span>
                  <Link
                    className="fw-bold"
                    to={`/kitchen/${data?.details?.businessId}`}
                  >
                    check store{' '}
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <span className="d-flex flex-column text-start">
                  Customer Details:
                  <span>Name: {data?.details?.buyerName}</span>
                  <span>Reputation: Average</span>
                  <span>Id: {data?.details?.buyerId}</span>
                </span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AceeptOrReportOrder;
