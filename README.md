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

 Committing:

 - commit message template "{TicketNumber} {Username} - {Description}"
 - example "TSVPORTAL-713 maxfelker - Updated readme"

 ### Testing Against the API
 When testing against the API, there are issues with CORS and SSL. Close chrome and use the command below in you CLI:

     open -a Google\ Chrome --args --enable-extensions --disable-web-security --allow-file-access-from-files --ignore-certificate-errors
