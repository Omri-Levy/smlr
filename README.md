# Smlr

A link shortener written in Typescript, made with NestJS (Node.js/Express). The
project's main goal was to learn NestJS, and to create a backend that is as
feature complete as possible, adding things that are expected of a production
app.

#### Highlights

* Rate limiting
* Recaptcha
* A cache layer using Redis
* E2E and Integration tests
* MVC architecture, using the repository pattern for accessing the data layer,
  all pieces done using OOP.
* Developed from the start using Docker with a CI pipline (Github Actions), the
  commits were linted using commitlint/comitizen and the pipeline including
  Prettier,
  ESLint, Jest, Playwright, and a build step.
* Deployed to AWS EC2 using Terraform.
