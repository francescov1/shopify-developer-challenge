
# Shopify Developer Challenge - Francesco Virga

API URL: https://shopify-developer-challenge.herokuapp.com/<br/>
[API Documentation](https://francescov1.github.io/shopify-developer-challenge-docs)

## File Structure

The structure of this project is how I have designed most APIs I've worked on in the past. I split up my routes, controllers, models, and error in separate folders. Although it is somewhat overkill to also place config in its own folder, I find it to be useful for large-scale projects thus I like to start in a scalable manner. All external SDKs required (only mongoose in this case) have their own configuration file under the <i>config</i> folder.

The entry point is <i>index.js</i>, which creates the express app and adds basic middleware. It then passes the express app into <i>router.js</i> which mounts all routes and additional middleware.

<i>Note: I realize that the .env file should usually be ignored from git but to allow for local testing I included it for this specific case</i>


## API Design

The API design is simple. All product routes live at `/api/products` and all shopping cart routes live at `/api/carts`. Errors are handled by error middleware and a catch-all route shows a basic API landing page.


## Database

A MongoDB database is used for this project, along with mongoose as the driver. I have found this combination of database and driver to work extremely well for Node.js projects as it is both very powerful (ie. aggregation, geo queries, population, etc.) but also quick and easy to setup for a small project. The MongoDB deployment is managed through mLab.

## Hosting

The API is deployed and hosted on Heroku. Although I considered deploying on IAAS such as Google Compute Engine or AWS EC2, I chose to go with Heroku as it comes at zero cost for such tier and provides a nice interface to quickly deploy an application without the need for much additional configuration. Its add-ons also allow for seamless integration with mLab.

## Security

For security, I added a simple IP rate limiter to protect against DOS attacks. If this application were to be scaled across multiple servers, this would have to be configured with a data store such as [Redis](https://www.npmjs.com/package/rate-limit-redis) or [Mongo](https://www.npmjs.com/package/rate-limit-mongo) as storing in memory would not support tracking IPs across multiple instances.

I also added [Helmet](https://github.com/helmetjs/helmet) middleware to protect against various attacks through HTTP headers. Although it is not a fully robust security framework, it is a simple way to add a bit of a security layer to an express app.

## Documentation

The API documentation was made using [Slate](https://github.com/lord/slate). It outline all routes and errors associated with the API.

## Tests

I wrote integration tests using [Jest](https://jestjs.io) and [Supertest](https://www.npmjs.com/package/supertest). These tests cover basic usage of the API and can be found in the <i>tests</i> folder. To run them, simply enter `npm test` after cloning the repository.
