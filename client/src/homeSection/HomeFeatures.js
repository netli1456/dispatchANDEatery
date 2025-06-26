import React from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { Box, Skeleton } from '@mui/material';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

function HomeFeatures({ carouselData, loading }) {
  return (
    <Row className=" m-1">
      <Col md={12} className="my-3">
        {loading ? (
          <div>
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </div>
        ) : (
          <div>
            {carouselData && carouselData?.length > 0 ? (
              <ResponsiveMasonry
                columnsCountBreakPoints={{
                  300: 1,

                  1000: 3,

                  600: 2,
                  1200: 3,
                }}
              >
                <Masonry gutter="10px">
                  {carouselData?.map((item, index) => (
                    <div key={`${item?._id}-${index}`} style={{ height: '' }}>
                      <Card>
                        <Link
                          className="text-decoration-none"
                          to={`/kitchen/${item?._id}`}
                        >
                          <div>
                            {item ? (
                              <img
                                style={{
                                  width: '100%',
                                  height: '120px',
                                  objectFit: '',
                                }}
                                src={item?.businessImg}
                                alt=""
                              />
                            ) : (
                              <Skeleton variant="rectangular" height={200} />
                            )}
                          </div>

                          <Card.Body>
                            <Card.Title className=" text-capitalize">
                              {' '}
                              <strong className="text-capitalize d-flex gap-2 align-items-center text-succes">
                                {item?.businessName}
                                {item?.verified && (
                                  <img
                                    src="https://cdn-icons-png.freepik.com/512/7641/7641727.png"
                                    alt=""
                                    style={{ width: '20px' }}
                                  />
                                )}
                              </strong>
                            </Card.Title>
                            <div className="d-flex text-black   homefet flex-column mx-2">
                              <span>
                                Delivery time: {item?.deliveryRate}hour{' '}
                              </span>
                              <span>{`${item?.km}km`} away</span>
                            </div>
                          </Card.Body>
                        </Link>
                      </Card>
                    </div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            ) : (
              <div
                className="text-center  d-flex justify-content-center align-items-center"
                style={{ height: '100%' }}
              >
                <img
                  src="https://images.squarespace-cdn.com/content/v1/5ef2b5dcaa910a063d820ff6/91a58a2a-f667-4de2-b792-9efcf557cc88/HCBA_Shop%26Win_DigitalAssets_WebBanner_2500x750.png"
                  alt=""
                  style={{ width: '100%', height: '80%' }}
                  className="border rounded"
                />
              </div>
            )}
          </div>
        )}
      </Col>
    </Row>
  );
}

export default HomeFeatures;
