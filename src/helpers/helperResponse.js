const message = messages => {
  return typeof messages === 'object' ? messages : { messages: [messages] };
};

const Response = {
  Ok: (res, msg) => res.status(200).json(message(msg || { succes: true })),
  Create: (res, msg) => res.status(201).json(message(msg || { succes: true })),
  Forbidden: (res, msg) => res.status(403).json(message(msg || 'Access is denied')),
  BadRequest: (res, msg) => res.status(400).json(message(msg || 'Bad Request')),
  Unauthorized: (res, msg) => res.status(401).json(message(msg || 'Unauthorized')),
  NotFound: (res, msg) => res.status(404).json(message(msg || 'Not found')),
  InternalServerError: (res, msg) => res.status(500).json(message(msg || 'Internal Server Error')),

  // Custome
  NotFoundUser: (res, msg) => res.status(400).json(message(msg || 'Not found user')),
  InvalidUserOrPass: (res, msg) => res.status(400).json(message(msg || 'Invalid Username/Password')),
  InvalidParams: (res, msg) => res.status(400).json(message(msg || 'Invalid params data')),
};

export default Response;
