# ts5

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## TS5 Practices

- Commit early and often
- 2 space indent
- All code must have tests 

### Naming conventions:

 - snake-case for element id, classes, and file names
 - camelCase for Javascript definitions

### Branching:

 - branch from master to feature/name or bug/name

### Commiting

 - commit message template "{TicketNumber} {Username} - {Description}"
 - example "TSVPORTAL-713 maxfelker - Updated readme"

### Testing SSL and CORS 
When testing your local build against the API, there are issues with SSL due to a self signed certificate on the API's server. Browse to the 
development environment URL and accept the browser's SSL warning. This will resolve the SSL warning notice

When testing your local build against the API, there are issues with CORS. Close chrome and use the command below in you CLI:

     open -a Google\ Chrome --args --enable-extensions --disable-web-security --allow-file-access-from-files --ignore-certificate-errors

## Yeoman Recipes
Below are a few helpful things when using yeoman to generate Angular code

### Creating a Service
Create a service named {serviceName}Service 

    yo angular:service {serviceName}Service

    yo angular:service itemsService

Yeoman generates the service files and the file names are in lowercase. ** Please rename them to use camelCase and update app/index.html**  