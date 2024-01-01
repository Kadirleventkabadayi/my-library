export const checkIsOwnPage = (user, urlEmail) => {
  const userEmail = user ? user.email : null;

  return userEmail === urlEmail;
};
