# express-mvc-scaffold
scaffold for express mvc web development

## Major Dependencies

* Database: mysql (supported), mongo (planned)
* ORM: jugglingdb (supported), mongoose (planned)
* Web Framework: express
* Template Engine: ect
* Frontend: angularjs
* Test: jasmine (planned)
* Build: gulp (planned)
* Logger: winston
* Process Manager: pm2 (planned)

## Guidance

### Start server

1. clone repository2. 

	```
	clone https://github.com/Alvansea/express-mvc-scaffold/
	```
2. modify package.json for your own project
3. install depepencies
	
	```
	npm install
	bower install
	```
4. modify conf files
5. start server
    npm start            

### Add/Edit models
1. modify /models/_schema.js
2. add [ModelName].js in /models folder (optional)
3. sync schema with database

### Add/Edit routes
1. add controller file in /routes folder
2. modify routing config
3. add route handler

### Add/Edit views
1. add view file in /views folder
2. add template
3. add partial/include/widgets
