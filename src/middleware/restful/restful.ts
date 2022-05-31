//
// This shortcut function responses with HTTP 405
// to the requests having a method that does not
// have corresponding request handler. For example
// if a resource allows only GET and POST requests
// then PATCH, DELETE, etc requests will be responded
// with the 405 status code. HTTP 405 is required to have Allow
// header set to a list of allowed methods so in
// this case the response has "Allow: GET, POST" in
// its headers [1].
//
// Example usage
//
//     A handler that allows only GET requests and returns
//
//     const controller = (req, res) => {
//         restful(req, res, {
//             get: function (req, res) {
//                 res.send(200, 'Hello restful world.');
//             }
//         });
//     }
//
// References
//
//     [1] RFC-2616, 10.4.6 405 Method Not Allowed
//     https://tools.ietf.org/html/rfc2616#page-66
//
//     [2] Express.js request method
//     https://expressjs.com/en/guide/routing.html
//
import { NextFunction, Request, Response } from 'express';
import { MethodNotAllowedException } from '@nestjs/common';

export const restful =
	(methods) => (req: Request, res: Response, next: NextFunction) => {
		const { method } = req; // [2]

		if (!methods.includes(method.toLowerCase())) {
			res.set(`Allow`, methods.join(`, `));

			throw new MethodNotAllowedException();
		}

		next();
	};
