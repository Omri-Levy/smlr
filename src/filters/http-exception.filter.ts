import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();
		const req = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const errorMessage =
			status === 429
				? `Too many requests. Please try again later.`
				: /*
				   * Resolves to the validation message instead of just bad request
				   * message.
				   */
				  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
				  /* @ts-ignore */
				  exception.response.message;

		if (process.env.NODE_ENV === `test`) {
			return res.status(status).send({
				statusCode: status,
				error: exception.message,
			});
		}

		res.render(`index`, {
			error: `${errorMessage} (${status})`,
			csrfToken: req.csrfToken instanceof Function ? req.csrfToken() : ``,
			recaptchaSiteKey:
				process.env.NODE_ENV === `test` || process.env.CI
					? process.env.RECAPTCHA_TEST_SITE_KEY
					: process.env.RECAPTCHA_SITE_KEY,
		});
	}
}
