const validateData = (req, res, next) => {
  const { id, value } = req.body;

  if (id === undefined || value === undefined) {
    return res.status(400).json({
      error: 'Invalid Data Packet: Missing ID or Value'
    });
  }

  next();
};

export default validateData;
