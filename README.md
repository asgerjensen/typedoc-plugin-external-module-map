## typedoc-plugin-external-module-map

### What

A plugin for [Typedoc](http://typedoc.org)

When trying to unify documentation for multiple modules residing inside a shared source repository, the default way Typedoc assignes top-level 
module names might not satisfy. 

This plugin allows you to specify a regular expression with a capture group. This is then used to collect related items into one module.

This plugin is inspired by, and based on, https://github.com/christopherthielen/typedoc-plugin-external-module-name , but does not require you to 
add additional annotations to each .ts file in your project.


Suppose you have
```
module/@mycompany/thing1/index.ts
module/@mycompany/thing1/src/otherfiles.ts
module/@mycompany/thing2/index.ts
module/@mycompany/thing2/src/otherfiles.ts
```

Typedoc will create four "External Modules", named for each .ts file.

- "@mycompany/thing1/index"
- "@mycompany/thing1/src/otherfiles"
- "@mycompany/thing2/index"
- "@mycompany/thing1/src/otherfiles"

This plugin allows each file to specify the Typedoc External Module its code should belong to.
If multiple files belong to the same module, they are merged.

This allows more control over the modules that Typedoc generates.
Instead of the four modules above, we could group them into two:

- thing1
- thing2

### Installing

Typedoc 0.4 has the ability to discover and load typedoc plugins found in node_modules.
Simply install the plugin and run typedoc.

However, Typedoc 0.24 did away with that, so now you have to specify it explicitly every time.

```
npm install --save typedoc-plugin-external-module-map
typedoc --plugin typedoc-plugin-external-module-map
```


### Usage

This plugin adds a new input option
```
--external-modulemap  ".*\/modules\/@mycompany\/([\\w\\-_]+)\/"
```

If you specify it from the command line, be sure to escape the input string so bash doesn't expand it.

It is probably easier to create a typedoc options file (typedoc.json) and add it there:

```
{
  "name": "My Library",
  "mode": "modules",
  "out": "doc",
  "theme": "default",
  "ignoreCompilerErrors": "false",
  "preserveConstEnums": "true",
  "exclude": "*.spec.ts",
  "external-modulemap": ".*\/modules\/@mycompany\/([\\w\\-_]+)\/",
  "stripInternal": "false"
}
```

If your pattern is not expressable in a single regexp, you can provide an array of regexps in the .json file. First to match will return the value.

Example:
```
{
  "name": "My Library",
  "mode": "modules",
  "out": "doc",
  "theme": "default",
  "ignoreCompilerErrors": "false",
  "preserveConstEnums": "true",
  "exclude": "*.spec.ts",
  "external-modulemap": [
	   ".*/(types/[\\w\\-_]+)/",
	   ".*/(core/decorators/[\\w\\-_]+)/",
	   ".*/subfolder/(core/[\\w\\-_]+)/",
   ],
  "stripInternal": "false"
}
```


### Entrypoint Strategy "Packages"

The new features in Typedoc of `"entryPointStrategy": "packages"`, or using `@group` or `@category`  with the appropriate base plugins have mostly superseeded this plugin, but there are still a few cases in which it makes sense. Ie if you have sub-packages, or multiple entry points.

In these cases, you use the entrypoint strategy for the top level navigation, and then in the individual projects, place a typedoc.json with the external-modulemap configuration specific to the package. 

The configuration will *not* be picked up from the top-level typedoc.json
