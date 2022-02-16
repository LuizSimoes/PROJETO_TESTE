const createToken = require('../auth/createToken');
const service = require('../services/serviceUser');
const {
  created,
  conflict,
  badRequest,
  regexEmail,
  unauthorized,
  OK,
  forbidden,
} = require('../utils/messages');

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const role = 'user';
  if (!name || !email || !password) {
    return res.status(badRequest).json({ message: 'Invalid entries. Try again.' });
   }
  const emailNotExist = await service.emailExist(name, email, password);
  if (!regexEmail.test(email)) {
    return res.status(badRequest)
    .json({ message: 'Invalid entries. Try again.' });
  }
  if (!emailNotExist) return res.status(conflict).json({ message: 'Email already registered' });
  const newUser = await service.userCreate(name, email, password, role);
  res.status(created).json(newUser);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(unauthorized).json({ message: 'All fields must be filled' });
  }
  if (typeof password !== 'string') {
  return res.status(unauthorized).json({ message: 'Incorrect username or password' });
  }
  const emailFounded = await service.findByEmail(email);
  if (!emailFounded || emailFounded.password !== password) {
    return res.status(unauthorized).json({ message: 'Incorrect username or password' });
  }
  // "_" serve para evitar conflito com o password do body
  const { password: _, ...userWithoutPassword } = emailFounded;
  const payload = userWithoutPassword;
  const token = createToken.createToken(payload);
  return res.status(OK).json({ token });
};

const createADM = async (req, res) => {
  const { name, email, password } = req.body;
  const userRole = req.user.role;
  // userRole vem do validateTokenS
  if (userRole !== 'admin') {
    return res.status(forbidden)
  .json({ message: 'Only admins can register new admins' });
}
  const newADM = await service.userCreate(name, email, password, userRole);
  res.status(created).json(newADM);
};

module.exports = {
  createUser,
  loginUser,
  createADM,
};
