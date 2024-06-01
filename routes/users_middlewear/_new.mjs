const getForm = async function (req, res, next) {
  res.render(
    "users/register",
    {
      isGuest: req.session.isGuest,
      id: req.session.user,
    },
    async (err, html) => {
      if (err) {
        next(err);
      } else {
        res.send(html);
      }
    },
  );
};

export { getForm };
