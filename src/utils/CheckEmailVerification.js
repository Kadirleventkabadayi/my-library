export const CheckEmailVerification = (user) => {
  if (user) {
    return user.emailVerified;
  } else {
    return false;
  }
};
