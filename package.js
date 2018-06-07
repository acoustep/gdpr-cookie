Package.describe({
  name: "thany:gdpr-cookie",
  version: "0.2.0",
  summary: "A jQuery plugin to manage cookie settings in compliance with EU law",
  git: "https://github.com/thany/gdpr-cookie.git",
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.6.1.1");
  api.use("ecmascript");
  api.mainModule("gdpr-cookie.js");
});