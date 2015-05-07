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

 - commit message template "{TicketNumber} {Username} | {Description}"
 - example "TSVPORTAL-713 maxfelker | Updated readme"

### Testing SSL and CORS 
When testing your local build against the API, there are issues with SSL due to a self signed certificate on the API's server. Browse to the development environment URL and accept the browser's SSL warning. This will resolve the SSL warning notice

When testing your local build against the API, there are issues with CORS. Close chrome and use the command below in you CLI:

     open -a Google\ Chrome --args --enable-extensions --disable-web-security --allow-file-access-from-files --ignore-certificate-errors

## Yeoman Recipes
Below are a few helpful things when using yeoman to generate Angular code

### Creating a Route 
Create a Route named {feature}-{action}

    yo angular:route {feature}-{action}

    yo angular:route item-create

### Creating a Directive 
Create a Route named {directive-name}

    yo angular:directive {directive-name}

    yo angular:directive image-upload

### Creating a Factory 
Create a factory named {factory-name}-factory , appending the keyword -factory to the end

    yo angular:factory {factory-name}-factory

    yo angular:factory items-factory

### Creating a Service 
Create a service named {service-name}-service , appending the keyword -service to the end

    yo angular:service {service-name}-service

    yo angular:service price-types-service

## API
The Angular app hits an API. This accepts and returns JSON.

DEV API URL:

    https://ec2-52-6-49-188.compute-1.amazonaws.com/api/