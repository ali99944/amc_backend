// user_auth_controller.js
import {
  ApiError
} from '../lib/api_error.js';
import {
  BAD_REQUEST_CODE
} from '../lib/error_codes.js';
import {
  BAD_REQUEST_STATUS,
  NOT_AUTHORIZED_STATUS,
  OK_STATUS
} from '../lib/status_codes.js';
import Validator from '../lib/validator.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import {
  generateUserToken,
  hashPassword,
  verifyPassword
} from '../lib/user_auth.js';
import prisma from '../lib/prisma.js';
import {
  readFile
} from 'fs/promises';
import {
  join
} from 'path';
import {
  sendEmail
} from '../lib/smtp_service.js';

import Handlebars from 'handlebars'

const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

export const registerUserController = asyncWrapper(
  async (req, res) => {
    const {
      name,
      email,
      password,
      birth_date,
      gender,
      phone_number
    } = req.body;

    const profile_picture = req.file;


    // Validate inputs
    await Validator.validateNotNull({
      name,
      email,
      password,
      birth_date,
      gender
    });
    await Validator.isText(name, {
      minLength: 2,
      maxLength: 100
    });
    await Validator.isEmail(email);
    // await Validator.isPassword(password);
    await Validator.isDate(birth_date, {
      maxDate: new Date().toISOString()
    });
    await Validator.isEnum(gender, ['male', 'female', 'other'], 'Invalid gender');
    if (phone_number) await Validator.isText(phone_number, {
      pattern: /^\+?[1-9]\d{1,14}$/,
      errorMessage: 'Invalid phone number'
    });

    // Check if email exists
    const existingUser = await prisma.users.findUnique({
      where: {
        email
      }
    });
    if (existingUser) {
      throw new ApiError('Email already exists', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        birth_date: new Date(birth_date),
        gender,
        phone_number,
        profile_picture: profile_picture ? 'images/profiles/' + profile_picture.filename : null,
      },
      include: {
        settings: true
      },
    });

    // Generate OTP and send activation email
    const otp = generateOtp();
    await prisma.verification_codes.create({
      data: {
        activation_code: otp.toString(),
        email,
        type: 'activation',
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    const templatePath = join(process.cwd(), 'templates', 'activation_email_template.html');
    let html = await readFile(templatePath, 'utf-8');
    html = html.replace('{{OTP}}', otp).replace('{{USER_NAME}}', name);

    await sendEmail({
      to: email,
      subject: 'Activate Your Music App Account',
      html,
    });

    const token = await generateUserToken({
      id: user.id,
      email: user.email,
    });

    return res.status(OK_STATUS).json({
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date.toISOString(),
        gender: user.gender,
        profile_picture: user.profile_picture,
        phone_number: user.phone_number,
        is_banned: user.is_banned,
        is_active: user.is_active,
        joined_at: user.joined_at.toISOString(),
        is_onboarded: user.is_onboarded
      },
    });
  }
);

export const loginUserController = asyncWrapper(
  async (req, res) => {
    const {
      email,
      password
    } = req.body;

    

    // Validate inputs
    await Validator.validateNotNull({
      email,
      password
    });
    await Validator.isEmail(email);
    // await Validator.isPassword(password);

    

    const user = await prisma.users.findUnique({
      where: {
        email
      },
      include: {
        settings: true
      },
    });
    
    if (!user || user.deleted_at) {
      throw new ApiError('Invalid email or password', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    }

    const isValidPassword = await verifyPassword(user.password, password);
    if (!isValidPassword) {
      
      throw new ApiError('Invalid email or password', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    }

    // if (!user.is_active) {
    //   throw new ApiError('Account not activated', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    // }

    // if (user.is_banned) {
    //   throw new ApiError('Account is banned', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    // }

    await prisma.users.update({
      where: {
        id: user.id
      },
      data: {
        last_login_time: new Date()
      },
    });


    const token = await generateUserToken({
      id: user.id,
      email: user.email,
    });

    return res.status(OK_STATUS).json({
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birth_date: user.birth_date.toISOString(),
        gender: user.gender,
        profile_picture: user.profile_picture,
        phone_number: user.phone_number,
        is_banned: user.is_banned,
        is_active: user.is_active,
        joined_at: user.joined_at.toISOString(),
        is_onboarded: user.is_onboarded
      },
    });
  }
);

export const logoutUserController = asyncWrapper(
  async (req, res) => {
    // Stateless JWT, client discards token
    if (req.user) {
      await prisma.user_sessions.updateMany({
        where: {
          user_id: req.user.id,
          expired_at: null
        },
        data: {
          expired_at: new Date()
        }
      });
    }

    return res.status(OK_STATUS).json({
      message: 'Logged out successfully'
    });
  }
);

export const refreshTokenController = asyncWrapper(
  async (req, res, next) => {
    const {
      token
    } = req.body;

    if (!token) {
      throw new ApiError('Token is required', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    const decoded = await verifyUserToken(token);
    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id
      },
      include: {
        settings: true
      },
    });
    if (!user || !user.is_active || user.is_banned || user.deleted_at) {
      throw new ApiError('Invalid or inactive user', BAD_REQUEST_CODE, NOT_AUTHORIZED_STATUS);
    }

    const newToken = await generateUserToken({
      id: user.id,
      email: user.email,
    });

    return res.status(OK_STATUS).json({
      token: newToken
    });
  }
);

export const activateAccountController = asyncWrapper(
  async (req, res) => {
    const {
      email,
      otp
    } = req.query;

    // Validate inputs
    await Validator.validateNotNull({
      email,
      otp
    });
    await Validator.isEmail(email);
    await Validator.isText(otp, {
      pattern: /^\d{6}$/,
      errorMessage: 'OTP must be a 6-digit number'
    });

    const code = await prisma.verification_codes.findFirst({
      where: {
        email,
        activation_code: otp,
        type: 'activation',
        expires_at: {
          gt: new Date()
        },
      },
    });

    if (!code) {
      throw new ApiError('Invalid or expired OTP', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    const user = await prisma.users.findUnique({
      where: {
        email
      }
    });
    if (!user || user.is_active) {
      throw new ApiError('User not found or already activated', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    await prisma.users.update({
      where: {
        id: user.id
      },
      data: {
        is_active: true,
        activated_at: new Date()
      },
    });

    await prisma.verification_codes.delete({
      where: {
        id: code.id
      }
    });

    return res.status(OK_STATUS).json({
      message: 'Account activated successfully'
    });
  }
);

export const forgotPasswordController = asyncWrapper(
  async (req, res, next) => {
    const {
      email
    } = req.body;

    // Validate inputs
    await Validator.validateNotNull({
      email
    });
    await Validator.isEmail(email);

    const user = await prisma.users.findUnique({
      where: {
        email
      }
    });
    if (!user || user.deleted_at) {
      throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    const otp = generateOtp();
    await prisma.verification_codes.create({
      data: {
        activation_code: otp.toString(),
        email,
        type: 'password_reset',
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    const templatePath = join(process.cwd(), 'templates', 'forgot_password_template.html');
    const template = await readFile(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({
      otp,
      user_name: user.name,
      otp_code: otp,
      expiry_minutes: 15,
    });

    await sendEmail({
      to: email,
      subject: 'Reset Your Music App Password',
      html,
    });

    return res.status(OK_STATUS).json({
      message: 'Password reset OTP sent to email'
    });
  }
);

export const sendRecoveryCodeController = asyncWrapper(
  async (req, res, next) => {
    const { email } = req.body;

    // Validate inputs
    await Validator.validateNotNull({ email });
    await Validator.isEmail(email);

    const user = await prisma.users.findUnique({
      where: { email }
    });
    if (!user || user.deleted_at) {
      throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    // Delete any existing unused OTP for this email
    await prisma.verification_codes.deleteMany({
      where: {
        email,
        type: 'password_reset',
        expires_at: {
          gt: new Date()
        }
      }
    });

    const otp = generateOtp();
    await prisma.verification_codes.create({
      data: {
        activation_code: otp.toString(),
        email,
        type: 'password_reset',
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    const templatePath = join(process.cwd(), 'templates', 'forgot_password_template.html');
    const template = await readFile(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({
      otp,
      user_name: user.name,
      otp_code: otp,
      expiry_minutes: 15,
    });

    await sendEmail({
      to: email,
      subject: 'Reset Your Music App Password',
      html,
    });

    return res.status(OK_STATUS).json({
      message: 'Password reset OTP sent to email'
    });
  }
);


export const verifyOtpController = asyncWrapper(
  async (req, res) => {
    const {
      email,
      otp
    } = req.body;

    // Validate inputs
    await Validator.validateNotNull({
      email,
      otp
    });
    await Validator.isEmail(email);
    await Validator.isText(otp, {
      pattern: /^\d{6}$/,
      errorMessage: 'OTP must be a 6-digit number'
    });

    const code = await prisma.verification_codes.findFirst({
      where: {
        email,
        activation_code: otp,
        type: 'password_reset',
        expires_at: {
          gt: new Date()
        },
      },
    });

    if (!code) {
      throw new ApiError('Invalid or expired OTP', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    return res.status(OK_STATUS).json({
      message: 'OTP verified successfully'
    });
  }
);

export const resetPasswordController = asyncWrapper(
  async (req, res) => {
    const {
      email,
      otp,
      new_password
    } = req.body;

    // Validate inputs
    await Validator.validateNotNull({
      email,
      otp,
      new_password
    });
    await Validator.isEmail(email);
    await Validator.isText(otp, {
      pattern: /^\d{6}$/,
      errorMessage: 'OTP must be a 6-digit number'
    });
    // await Validator.isPassword(new_password);

    const code = await prisma.verification_codes.findFirst({
      where: {
        email,
        activation_code: otp,
        type: 'password_reset',
        expires_at: {
          gt: new Date()
        },
      },
    });

    if (!code) {
      throw new ApiError('Invalid or expired OTP', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    const user = await prisma.users.findUnique({
      where: {
        email
      }
    });
    if (!user || user.deleted_at) {
      throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    const hashedPassword = await hashPassword(new_password);
    await prisma.users.update({
      where: {
        id: user.id
      },
      data: {
        password: hashedPassword
      },
    });

    await prisma.verification_codes.delete({
      where: {
        id: code.id
      }
    });

    return res.status(OK_STATUS).json({
      message: 'Password reset successfully'
    });
  }
);

export const changePasswordController = asyncWrapper(
  async (req, res) => {
    const {
      old_password,
      new_password
    } = req.body;
    const userId = req.user.id;

    // Validate inputs
    await Validator.validateNotNull({
      old_password,
      new_password
    });
    // await Validator.isPassword(old_password);
    // await Validator.isPassword(new_password);

    const user = await prisma.users.findUnique({
      where: {
        id: userId
      }
    });
    if (!user || user.deleted_at) {
      throw new ApiError('User not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
    }

    const isValidPassword = await verifyPassword(user.password, old_password);
    if (!isValidPassword) {
      throw new ApiError('Invalid old password', NOT_AUTHORIZED_STATUS, BAD_REQUEST_CODE);
    }

    const hashedPassword = await hashPassword(new_password);
    await prisma.users.update({
      where: {
        id: userId
      },
      data: {
        password: hashedPassword
      },
    });

    return res.status(OK_STATUS).json({
      message: 'Password changed successfully'
    });
  }
);