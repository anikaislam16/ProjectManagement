const checkSession = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { message: "No session found" };
  }

  const response = await fetch(
    `${process.env.REACT_APP_HOST}/signup/loginmatch`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    }
  );

  if (response.ok) {
    const data = await response.json();
    if (data.message === "No session found") {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/signup/login`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message === "No session found") {
          return { message: "Session Expired" };
        } else {
          return data.user;
        }
      }
    } else {
      return data.user;
    }
  }
  return { message: "No session found" };
};

module.exports = { checkSession };
