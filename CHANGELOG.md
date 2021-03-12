# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

# 1.4.0

* Migrate from husky to simple-git-hooks (https://github.com/toplenboren/simple-git-hooks)

# 1.3.1

* Update dependencies

# 1.3.0

* Allow custom serialization/deserialization functions (by https://github.com/kamil7x)

# 1.2.0

* Update dependencies and README.md

# 1.1.0

* Update dependencies

# 1.0.0

* Add support SSR (by https://github.com/rayriffy)
* Update dependencies

# 0.19.0

* Update docs about SSR (by https://github.com/rayriffy)

# 0.18.0

* Update dependencies

# 0.17.0

* Update dependencies and update new lint rules

# 0.16.1

* Remove useless `return` and reduce size by 2 bytes (by https://github.com/rndr)

# 0.16.0

* Refactoring main code and fixing test (by https://github.com/rndr)
* Decrease size of library by 16 bytes: from 269 to 253 bytes (by https://github.com/rndr)

# 0.15.0

* Fix TypeScript typing for package. (by Andrey Chalkin https://github.com/L2jLiga)

## 0.14.0

* Migrate to storeon ^2.0.0. Add dual publisher.

## 0.13.1

* Add .idea to .npmignore

## 0.13.0

* Update TypeScript typing for package. (by Andrey Chalkin https://github.com/L2jLiga)

## 0.12.0

* Move project to ES2015+

## 0.11.0

* Rewrite async/await to use Promise

## 0.10.0

* Now library can work with storages that return Promise for `getItem` and `setItem`

## 0.9.0

* Add configuration to use `sessionStorage` instead of `localStorage`

## 0.8.0

* Ignore storeon `@changed` events so that data is not stored twice.

## 0.7.0

* Adding support for RegExp for using in `path` param. (by Andy Chen https://github.com/KsRyY)
* Update dependencies

## 0.6.3

* Update dependencies

## 0.6.2

* Update dependencies

## 0.6.1

* Update new eslint styles for test files
* Update dependencies

## 0.6

* Fix dispatching before @init. (by Tomas Sandven)
* Update dependencies

## 0.5.1

* Update dependencies

## 0.5

* Added types for module

## 0.4

* Rewrite the module to use only ES5 syntax
* Reduce the size
* Add tests
* Update documentation

## 0.3

* Use only array of string in param

## 0.2

* Handle string and array of strings in param

## 0.1
* Initial release.
