import bcrypt from 'bcryptjs';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Account from '../models/accounts.js';

import { deviceCheck } from '../middleWareAuth/midleware.js';
import {
  checkIfCurrentDeviceMatchAnyInDb,
  checkingLoggedInDevices,
  checkOtpexpiration,
  findDeviceByUserId,
  sendToken,
} from '../ultils/ultility.js';
import Device from '../models/deviceLog.js';
import { emailText } from '../ultils/emailBody.js';
import { sendVerificationEmail } from '../ultils/emailSmsHtml.js';
import ResetPassword from '../models/PasswordReset.js';
import User from '../models/userModel.js';

export const userRegister = async (req, res) => {
  const saltRounds = 10;

  try {
    let user = {};
    const device = deviceCheck(req);
    const emailMessage = emailText(device);
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const userExist = await User.findOne({ email: req.body.email });

    if (userExist) {
      if (userExist.otpIsVerified) {
        return res.status(402).json({ message: 'email has already been used' });
      } else {
        userExist.otpCreatedAt = Date.now();
        userExist.otp = await sendVerificationEmail({
          user: userExist,
          text: emailMessage.newUserText,
          subject: emailMessage.newUserSubject,
          warning: emailMessage.newUserWarning,
          res,
        });

        user = userExist;
      }
    } else {
      const newUser = new User({ ...req.body, password: hash });

      newUser.otp = await sendVerificationEmail({
        user: newUser,
        text: emailMessage.newUserText,
        subject: emailMessage.newUserSubject,
        warning: emailMessage.newUserWarning,
        res,
      });
      user = newUser;
    }

    await user.save();

    const creation = 'on_creation';
    await checkingLoggedInDevices({
      fingerprints: req.body.fingerprint,
      req,
      user,
      creation,
      res,
    });

    const userData = {
      email: user.email,
      fingerprint: req.body.fingerprint,
      url:
        user.surname +
        (user.createdAt ? user.createdAt.toISOString() : '') +
        user._id +
        (user.otpCreatedAt ? user.otpCreatedAt.toISOString() : '') +
        user.firstname,
    };
    res.status(200).json({ user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { otpCode, resetPasswordOtp, forTokenFingerPrint } = req.body;

  try {
    let user = {};

    if (resetPasswordOtp) {
      const sentResetOtpUser = await findDeviceByUserId({ req, user, res });
      if (!sentResetOtpUser) {
        return;
      }
      user = sentResetOtpUser;
      const userData = {
        email: user.email,
        name: `${user.firstname} ${user.surname}`,
        img: user.img,
        urlf:
          user.surname +
          (user.createdAt ? user.createdAt.toISOString() : '') +
          user._id +
          (user.otpCreatedAt ? user.otpCreatedAt.toISOString() : '') +
          user.firstname,
      };

      return res.status(200).json({ user: userData });
    } else {
      if (req.body.fingerprint) {
        const newLoginUser = await User.findOne({ email: req.body.email });
        if (!newLoginUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        const newloginDetails = await Device.findOne({
          userId: newLoginUser._id.toString(),
        });

        if (!newloginDetails) {
          return res.status(401).json({ message: 'no login device' });
        }

        const verifyDevice = checkIfCurrentDeviceMatchAnyInDb({
          newloginDetails,
          req,
        });

        if (verifyDevice.otpIsVerified) {
          user = newLoginUser;
        }
        if (!verifyDevice) {
          return res.status(401).json({
            message: 'device verification failed. switch off vpm if active',
          });
        }

        const otpExpireResult = checkOtpexpiration({
          otpCode,
          user: verifyDevice,
          fingerprint: req.body.fingerprint,
          res,
        });
        if (otpExpireResult) {
          return;
        }
        await newloginDetails.save();
        user = newLoginUser;
      } else {
        const createdUser = await User.findOne({ email: req.body.email });
        if (!createdUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        const otpExpireResult = checkOtpexpiration({
          otpCode,
          user: createdUser,
        });

        if (otpExpireResult) {
          return;
        }
        await createdUser.save();

        user = createdUser;
      }

      sendToken({ user, res, fingerprint: forTokenFingerPrint });

      const userDetails = {
        firstname: user.firstname,
        _id: user._id,
      };

      res.status(200).json({ user: userDetails });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    const device = deviceCheck(req);
    const emailMessage = emailText(device);
    if (!user) return res.status(404).json({ message: 'Unauthorized action' });

    const newloginDetails = await Device.findOne({
      userId: user._id.toString(),
    });
    if (!newloginDetails) {
      return res.status(401).json({ message: 'no login device' });
    }

    const verifyDevice = checkIfCurrentDeviceMatchAnyInDb({
      newloginDetails,
      req,
    });

    if (!verifyDevice) {
      return res
        .status(401)
        .json({ message: 'unable to verify, switch off VPN if active' });
    }

    if (user.otpIsVerified && verifyDevice.otpIsVerified) {
      return res
        .status(401)
        .json({ message: 'please login with your details' });
    }
    if (!user.otpIsVerified) {
      user.otp = await sendVerificationEmail({
        user,
        text: emailMessage.newUserText,
        subject: emailMessage.newUserSubject,
        warning: emailMessage.newUserWarning,
        res,
      });
      user.otpCreatedAt = Date.now();
      await user.save();
    } else {
      verifyDevice.otp = await sendVerificationEmail({
        user,
        text: emailMessage.newLoginText,
        subject: emailMessage.newLoginSubject,
        warning: emailMessage.newLoginWarning,
        res,
      });
      verifyDevice.otpCreatedAt = Date.now();
      await newloginDetails.save();
    }

    res.status(200).json('check your email for the code');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { password, fingerprint } = req.body;

    const fingerprints = fingerprint;

    const creation =
      'unfinished registration on another device. otp sent to user document';

    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password) {
      const isCorrect = bcrypt.compareSync(password, user.password);
      if (!isCorrect)
        return res.status(401).json({ message: 'wrong credentials' });
    }

    let userDetails = {
      email: user.email,
      url:
        user.surname +
        (user.createdAt ? user.createdAt.toISOString() : '') +
        user._id +
        (user.otpCreatedAt ? user.otpCreatedAt.toISOString() : '') +
        user.firstname,
      rdt: undefined,
    };

    const device = deviceCheck(req);
    const emailMessage = emailText(device);

    if (!user.otpIsVerified) {
      user.otp = await sendVerificationEmail({
        user,
        text: emailMessage.newUserText,
        subject: emailMessage.newUserSubject,
        warning: emailMessage.newUserWarning,
        res,
      });
      user.otpCreatedAt = Date.now();
      await user.save();

      await checkingLoggedInDevices({
        user,
        fingerprints,
        req,
        creation,
        text: emailMessage.newLoginText,
        subject: emailMessage.newLoginSubject,
        warning: emailMessage.newLoginWarning,
        res,
      });

      return res.status(200).json({ user: userDetails });
    }

    const otpIsRequired = await checkingLoggedInDevices({
      user,
      fingerprints,
      req,
      text: emailMessage.newLoginText,
      subject: emailMessage.newLoginSubject,
      warning: emailMessage.newLoginWarning,
      res,
    });

    if (otpIsRequired) {
      userDetails.rdt = fingerprints;
      return res.status(200).json({ user: userDetails });
    } else {
      const userDetails = {
        firstname: user.firstname,
        _id: user._id,
      };
      sendToken({ user, res, fingerprints });

      return res.status(200).json({ user: userDetails });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logOut = (req, res) => {
  res.cookie('auth_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const passwordChange = async (req, res) => {
  try {
    const fingerprints = req.body.fingerprint;
    const device = deviceCheck(req);
    const emailMessage = emailText(device);
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ message: 'user not found' });
    await ResetPassword.find().deleteMany({ userId: user.id });

    const newPasswordOtp = new ResetPassword({
      userId: user.id,
      fingerprint: fingerprints,
    });

    const hasOtp = await sendVerificationEmail({
      user,
      text: emailMessage.passwordChangeText,
      subject: emailMessage.passwordChangeSubject,
      warning: emailMessage.passwordChangeWarning,
      res,
    });
    newPasswordOtp.otp = hasOtp;
    await newPasswordOtp.save();

    const userDetails = {
      email: user.email,

      url:
        user.surname +
        (user.createdAt ? user.createdAt.toISOString() : '') +
        user._id +
        (user.otpCreatedAt ? user.otpCreatedAt.toISOString() : '') +
        user.firstname,
      rdt: newPasswordOtp.fingerprint,
      resetPasswordOtp: 'resetPasswordOtp',
    };
    res.status(200).json({ user: userDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newloginDetails = await Device.findOne({
      userId: user._id.toString(),
    });
    if (!newloginDetails) {
      return res.status(404).json({ message: 'you cant perform this action' });
    }
    const verifyDevice = checkIfCurrentDeviceMatchAnyInDb({
      newloginDetails,
      req,
    });
    if (!verifyDevice) {
      return res
        .status(404)
        .json({ message: 'failed, switch off VPN if enabled' });
    }
    const passwordChangeSentOtpIsValid = await ResetPassword.findOne({
      userId: user._id.toString(),
      fingerprint: verifyDevice.fingerprint,
      otpIsVerified: true,
    });
    if (!passwordChangeSentOtpIsValid) {
      return res.status(501).json({ message: 'session timeout' });
    }
    const newPassword = bcrypt.hashSync(req.body.password, 10);
    user.password = newPassword;
    await user.save();
    const userDetails = {
      firstname: user.firstname,
      _id: user._id,
    };
    sendToken({ user, res, fingerprints: verifyDevice.fingerprint });
    return res.status(200).json({ user: userDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Riders = async (req, res) => {
  try {
    const { query, page = 1, pageSize = 10 } = req.query;
    const fetchRiders = new Set();

    const aggregationPipeline = [];

    aggregationPipeline.push({
      $match: { isDispatcher: true, _id: { $nin: Array.from(fetchRiders) } },
    });

    aggregationPipeline.push({ $sample: { size: parseInt(pageSize) } });

    if (query) {
      aggregationPipeline.push({
        $match: {
          $or: [{ physicalAddress: { $regex: query, $options: 'i' } }],
        },
      });
    }
    const riders = await User.aggregate(aggregationPipeline);

    res.status(200).json(riders);
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const getRiderAndReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = [];

    const user = await User.findById(id);
    if (user) {
      const review = await Review.find({ userId: id });
      if (!review) {
        return res.status(500).json({ message: 'no reviews' });
      }
      for (const reviewws of review) {
        const reviewerData = await User.findById(reviewws.reviewerId);
        const reviewss = {
          reviewerName: reviewerData.name,
          reviewerImg: reviewerData.img,
          msg: reviewws.msg,
          reviewerId: reviewws.reviewerId,
          _id: reviewws._id,
          positive: reviewws.positive,
        };
        reviews.push(reviewss);
      }

      const userData = {
        name: user.name,
        km: user.km,
        deliveryRate: user.deliveryRate,
        rating: user.rating,
        balance:
          user?._id.toString() === id && user.isDispatcher ? user.balance : '',
      };

      const positiveReviews = reviews
        .filter((review) => review.positive === false)
        .slice(0, 2);
      const negativeReviews = reviews
        .filter((review) => review.positive === true)
        .slice(0, 2);

      const allReviews = [...positiveReviews, ...negativeReviews];

      return res.status(200).json({ allReviews, user: userData });
    } else {
      return res.status(404).json({ message: 'no user available' });
    }
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = [];

    const review = await Review.find({ userId: id });

    if (!review) {
      return res.status(500).json({ message: 'no reviews' });
    }
    if (review.length > 0) {
      for (const reviewws of review) {
        const reviewerData = await User.findById(reviewws.reviewerId);
        const reviewss = {
          reviewerName: reviewerData.name,
          reviewerImg: reviewerData.img,
          msg: reviewws.msg,
          reviewerId: reviewws.reviewerId,
          _id: reviewws._id,
          positive: reviewws.positive,
        };
        reviews.push(reviewss);
      }

      const positiveReviews = reviews
        .filter((rev) => rev.positive === true)
        .slice(0, 2);

      const negativeReviews = reviews
        .filter((rev) => rev.positive === false)
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 1);

      const allReviews = [...positiveReviews, ...negativeReviews];

      return res.status(200).json(allReviews);
    }
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const getUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const account = await Account.findOne({ userId: userId });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res
      .status(200)
      .json({ bank: account.bank, accountNumber: account.accountNumber });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const userBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'something went wrong' });
    }

    res.status(200).json(user.balance.toFixed(2));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const gettingKitchenByLocation = async (req, res) => {
  try {
    const { query } = req.query;

    if (query) {
      const RegisteredKitchens = await User.exists({
        isBusinessOwner: true,
        $or: [
          { physicalAddress: { $regex: query, $options: 'i' } },

          { placesCanDeliverTo: { $regex: query, $options: 'i' } },
        ],
      });

      return RegisteredKitchens
        ? res.status(200).json('store exist')
        : res
            .status(200)
            .json('Sorry, we do not have stores in this location yet');
    } else {
      res.status(200).json('query is required');
    }
  } catch (error) {
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const getStores = async (req, res) => {
  try {
    const {
      query = '',
      rating,
      popularFilter,
      page,
      pageSize = 12,
      searchedLocation,
    } = req.query;

    const ratingNumber = rating ? parseFloat(rating) : null;

    const searchConditions = {
      isBusinessOwner: true,
      blocked: false,
      suspended: false,
    };

    let storesQuery = User.find(searchConditions);

    if (query) {
      // If a query is provided, prioritize it
      storesQuery = storesQuery.or([{ businessName: { $regex: query, $options: 'i' } }]);
    }

    // if (searchedLocation) {
    //   // If a searched location is provided, apply it to the query
    //   storesQuery.or([
    //     { physicalAddress: { $regex: searchedLocation, $options: 'i' } },
    //     { placesCanDeliverTo: { $regex: searchedLocation, $options: 'i' } },
    //   ]);
    // }

    // Execute the query to get stores
   






    
    // if (query) {
    //   searchConditions.$or = [
    //     { businessName: { $regex: query, $options: 'i' } },
    //   ];
    // }

    // const popularStorsStored = [];
   
    // const noduplicateId = new Set();
   
   

    if (searchedLocation) {
      if (query) {
        storesQuery.or( [
          { businessName: { $regex: query, $options: 'i' } },
        ]);
       
      } else if (rating) {
        filteredStores.sort({ rating: -1 });
        const result = await User.find(searchConditions)
        stores =result
      } else if (popularFilter) {
        
        const products = await Product.find({
          $or: [
            { type: { $regex: popularFilter, $options: 'i' } },
            { category: { $regex: popularFilter, $options: 'i' } },
            { name: { $regex: popularFilter, $options: 'i' } },
          ],
        });

        if (products.length > 0) {
          for (const product of products) {
            storesQuery.or({
              _id: product.userId.toString(),
              $or: [
                { physicalAddress: { $regex: searchedLocation, $options: 'i' } },
                {
                  placesCanDeliverTo: {
                    $regex: searchedLocation,
                    $options: 'i',
                  },
                },
              ],
            });
            // if (
            //   popularstores &&
            //   !noduplicateId.has(popularstores._id.toString())
            // ) {
            //   popularStorsStored.push(popularstores);
            //   noduplicateId.add(popularstores._id.toString());
            // }
          }
        }

        // stores = popularStorsStored;
      } else {
        storesQuery.or([
          { physicalAddress: { $regex: searchedLocation, $options: 'i' } },
          { placesCanDeliverTo: { $regex: searchedLocation, $options: 'i' } },
        ]);
      }
     
    }

  

  

    if (popularFilter) {

      const products = await Product.find({
        $or: [
          { type: { $regex: popularFilter, $options: 'i' } },
          { category: { $regex: popularFilter, $options: 'i' } },
          { name: { $regex: popularFilter, $options: 'i' } },
        ],
      });

      if (products.length > 0) {
        for (const product of products) {
          storesQuery.or({_id:product.userId.toString()});
          // if (
          //   popularstores &&
          //   !noduplicateId.has(popularstores._id.toString())
          // ) {
          //   popularStorsStored.push(popularstores);
          //   noduplicateId.add(popularstores._id.toString());
          // }
        }
      }

     
    }
    if (storesQuery.length === 0)
      return res.status(200).json({ message: 'no stores found' });
    let stores = await storesQuery;

    if(!stores) return res.status(404).json({ message:'No stores found'})

    // Apply rating filtering if provided
    if (rating) {
      stores = stores.filter(store => store.rating >= ratingNumber);
    }
    

    let filteredStores = stores.map((store) => ({
      businessName: store.businessName,
      _id: store._id,
      businessImg: store.businessImg,
      verified: store.verified,
      rating: store.rating,
      km: store.km,
      deliveryRate: store.deliveryRate,
      physicalAddress: store.physicalAddress,
      timeOpen: store.timeOpen,
    }));



    const startIndex = (page - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);

    const paginatedStores = filteredStores.slice(startIndex, endIndex);

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    shuffleArray(paginatedStores);
    const totalPages = Math.ceil(filteredStores.length / parseInt(pageSize));

    const productAndDetails = {
      stores: paginatedStores,
      totalPages: totalPages,
    };
    res.status(200).json(productAndDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//VENDOR REGISTRATION

export const vendorRegistration = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId.toString());

    if (!user || !user.otpIsVerified) {
      return res
        .status(404)
        .json({ message: 'you must be a user to register' });
    }
    if (user.isBusinessOwner)
      return res.status(200).json({ message: ' already a registered vendor' });
    if (req.file) {
      user.businessImg = req.file.path;
    }

    user.isBusinessOwner = true;
    user.physicalAddress = req.body.physicalAddress;
    user.placesCanDeliverTo = req.body.placesCanDeliverTo;
    user.businessName = req.body.businessName;

    await user.save();

    res.status(200).json({ message: 'successfully registered' });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
