import axios from "axios";
const HOST = import.meta.env.VITE_BACKEND_HOST;

interface SignInServiceProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupPayloadProps {
  userOtp: string;
  userId: string;
}

interface LoginPayloadProps {
  email: string;
  password: string;
}

interface ResetPasswordServiceProps {
  otp: string;
  emailId: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const SignUpService = async (formData: SignInServiceProps) => {
  console.table(formData);
  try {
    const resp = await axios.post(`${HOST}/api/user`, formData);
    return { status: "success", data: resp.data, code: resp.request?.status };
  } catch (err) {
    // if malformed request is gone
    console.log(err);
    if (
      axios.isAxiosError(err) &&
      err.code === "ERR_BAD_REQUEST" &&
      err.request?.status === 409
    ) {
      return {
        status: "fail",
        error_msg: err?.response!.data,
        code: err.request?.status,
      };
    }
    // anything else
    console.error("Error while signing Up Service:: ", err);
    throw err;
  }
};

export const OtpVerificationService = async (payload: SignupPayloadProps) => {
  try {
    const resp = await axios.post(`${HOST}/api/user/verify`, payload);
    return { status: "success", data: resp.data, code: resp.request.status };
  } catch (err) {
    console.error("Error at OtpVerificationService :: ", err);
    throw err;
  }
};

export const LoginService = async (payload: LoginPayloadProps) => {
  try {
    const resp = await axios.post(`${HOST}/api/auth/login`, payload);
    return { status: "success", data: resp.data, code: resp.request?.status };
  } catch (err) {
    // special error case handle
    if (
      axios.isAxiosError(err) &&
      err.code === "ERR_BAD_REQUEST" &&
      err.request?.status === 401
    ) {
      return {
        status: "fail",
        error_msg: err?.response!.data,
        code: err.request?.status,
      };
    }
    console.error("Error at LoginService::", err);
    throw err;
  }
};

export const ForgotPasswordService = async (payload: { emailId: string }) => {
  try {
    const resp = await axios.post(`${HOST}/api/user/reset_password`, payload);
    return { status: "success", data: resp.data, code: resp.request?.status };
  } catch (err) {
    // special error case handle
    if (
      axios.isAxiosError(err) &&
      err.code === "ERR_BAD_REQUEST" &&
      err.request?.status === 401
    ) {
      return {
        status: "fail",
        error_msg: err?.response!.data,
        code: err.request?.status,
      };
    }
    console.error("Error at ForgotPasswordService::", err);
    throw err;
  }
};

export const ResetPasswordService = async (
  payload: ResetPasswordServiceProps,
) => {
  try {
    const params = {
      emailId: payload.emailId,
      otp: payload.otp,
    };
    const body = {
      newPassword: payload.newPassword,
      confirmNewPassword: payload.confirmNewPassword,
    };
    const resp = await axios.post(`${HOST}/api/user/change_password`, body, {
      params,
    });
    return { status: "success", data: resp.data, code: resp.request?.status };
  } catch (err) {
    console.error("Error at ResetPasswordService::", err);
    throw err;
  }
};

export const LogoutService = async () => {
  try {
    axios.post(`${HOST}/api/auth/logout`);
  } catch (err) {
    console.error("Error at Logout service:: ", err);
    throw err;
  }
};
