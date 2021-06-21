const pagination = (req, res, next) => {
  const paseAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = Number.isNaN(paseAsNumber) ? 0 : paseAsNumber;
  if (page < 0) {
    page = 0;
  }
  let size = Number.isNaN(sizeAsNumber) ? 10 : sizeAsNumber;
  if (size > 10 || size < 1) {
    size = 10;
  }
  req.pagination = { size, page };
  next();
};

module.exports = pagination;
