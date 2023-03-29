import { Response } from 'express';

const message = (messages: any): any => {
  return typeof messages === 'object' ? messages : { messages: [messages] };
};

export default {
  Ok: (res: Response, msg?: any): Response => res.status(200).json(message(msg || { succes: true })),
  Create: (res: Response, msg?: any): Response => res.status(201).json(message(msg || { succes: true })),
  Forbidden: (res: Response, msg?: any): Response => res.status(403).json(message(msg || 'Access is denied')),
  BadRequest: (res: Response, msg?: any): Response => res.status(400).json(message(msg || 'Bad Request')),
  Unauthorized: (res: Response, msg?: any): Response => res.status(401).json(message(msg || 'Unauthorized')),
  NotFound: (res: Response, msg?: any): Response => res.status(404).json(message(msg || 'Not found')),
  InternalServerError: (res: Response, msg?: any): Response => res.status(500).json(message(msg || 'Internal Server Error')),

  // Custome
  NotFoundUser: (res: Response, msg?: any): Response => res.status(400).json(message(msg || 'Not found user')),
  InvalidUserOrPass: (res: Response, msg?: any): Response => res.status(400).json(message(msg || 'Invalid Username/Password')),
  InvalidParams: (res: Response, msg?: any): Response => res.status(400).json(message(msg || 'Invalid params data')),
};
