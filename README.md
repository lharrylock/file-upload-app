# File Upload App

Desktop client application to the File Storage Service. Uploads files to the network
and saves metadata about the files. 

## Development

NOTE:
We're using `electron-builder` to package the app into OS-specific distributables.
This npm package strongly recommends using yarn for dependency management. If you don't have
yarn already, set it up by following these instructions:

https://yarnpkg.com/en/docs/install#debian-stable

Then clone the repo, install the dependencies, and run the dev server:

```bash
git clone ssh://git@aicsbitbucket.corp.alleninstitute.org:7999/sw/file-upload-app.git
cd file-upload-app
yarn
./gradlew dev
```

## Packaging

Use the `bundle` gradle task to package the app for both Windows and Linux. This task can also target
different environments. By default, the `bundle` task builds for the production environment,
meaning that it will connect to aics.corp.alleninstitute.org for LabKey and FSS.

If you'd like to create a staging build (stg-aics.corp.alleninstitute.org), set the `env` argument to `staging`:

```bash
./gradlew bundle -Penv staging
``` 

Likewise to create a dev build (localhost:8080), set `env` to `development`:

```bash
./gradlew bundle -Penv development
```

We accomplish packaging for both Windows and Linux thanks to the docker image provided by `electron-builder`: electronuserland/builder:wine
which provides the dependencies needed.

Packaging the app for MacOS has not been implemented yet as it requires MacOS to be built.

