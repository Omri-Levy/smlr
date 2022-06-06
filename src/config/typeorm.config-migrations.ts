export = {
	type: process.env.CI ? `sqlite` : `mysql`,
	host:
		process.env.NODE_ENV === `test` ? `localhost` : process.env.MYSQL_HOST,
	port: Number(process.env.MYSQL_PORT),
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.CI
		? `:memory:`
		: process.env.NODE_ENV === `test`
		? `link-shortener-test`
		: process.env.MYSQL_DATABASE,
	entities: [__dirname + `/../**/*.entity{.js,.ts}`],
	synchronize: process.env.NODE_ENV !== `production`,
	dropSchema: process.env.NODE_ENV === `test` || !!process.env.CI,
	migrations: [__dirname + `/../migrations/*{.js,.ts}`],
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	cli: {
		migrationsDir: __dirname + `/../migrations`,
	},
	extra: {
		charset: `utf8mb4_unicode_ci`,
	},
};
