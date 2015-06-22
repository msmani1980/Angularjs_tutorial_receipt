# TS5

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.

1.  [Development environment](section1)
2.  [TDD](section2) 

## Development environment
Below is the IP for the development environment and API

    https://54.83.17.106/

    // API
    https://54.83.17.106/api/

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

### <a name="section2"></a>TDD
*   [Using HTML](html2js)
*   [Using JSON](json2js)

#### <a name="html2js"></a>Using HTML
HTML is resolved using the [karma-ng-json2js-preprocessor](https://www.npmjs.com/package/karma-ng-html2js-preprocessor) 
plugin. This is help when testing directives.

*   [Configuration](https://www.npmjs.com/package/karma-ng-html2js-preprocessor#configuration)
*   [How does it work?](https://www.npmjs.com/package/karma-ng-html2js-preprocessor#how-does-it-work)

#### <a name="json2js"></a>Using JSON
JSON is resolved using the [karma-ng-json2js-preprocessor](https://www.npmjs.com/package/karma-ng-json2js-preprocessor) 
plugin.

*   [Configuration](https://www.npmjs.com/package/karma-ng-json2js-preprocessor#configuration)
*   [How does it work?](https://www.npmjs.com/package/karma-ng-json2js-preprocessor#how-does-it-work)


