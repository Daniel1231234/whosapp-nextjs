export function getInitialFormValues(user:User) {
  return {
    id: user.id ? user.id : "",
    name: user.name ? user.name : "",
    email: user.email ? user.email : "",
    image: user.image ? user.image : "",
    password:user.password ? user.password : "",
    username: user.username ? user.username : "",
    country: user.country ? user.country : "",
    street: user.street ? user.street : "",
    notification: { message: false, friendReq: false },
  };
}