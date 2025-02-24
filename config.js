module.exports = {
  baseUrl: 'http://localhost:8080',
  port: 8080,
  maxUploadSize: '50mb',
  contentDeletable: false,
  mediaTypes: ['images', 'audios', 'videos'],
  folders: {
    assets: 'assets',
    libraries: 'libraries',
    cache: 'cache',
    temp: 'temp'
  },
  files: {
    watch: true,
    patterns: {
      allowed: /\.(json|png|jpg|jpeg|gif|bmp|tif|tiff|svg|eot|ttf|woff|woff2|otf|webm|mp4|ogg|mp3|txt|pdf|rtf|doc|docx|xls|xlsx|ppt|pptx|odt|ods|odp|xml|csv|diff|patch|swf|md|textile|js|css)$/,
      ignored: /^\.|~$/gi
    }
  },
  urls: {
    registry: 'https://raw.githubusercontent.com/hoangbinh/h5p-registry/main/libraries.json',
    library: {
      language: 'https://raw.githubusercontent.com/{org}/{dep}/{version}/language/en.json',
      semantics: 'https://raw.githubusercontent.com/{org}/{dep}/{version}/semantics.json',
      list: 'https://raw.githubusercontent.com/{org}/{dep}/{version}/library.json',
      clone: 'https://github.com/{org}/{repo}.git',
      sshClone: 'git@github.com:{org}/{repo}.git',
      zip: 'https://github.com/{org}/{repo}/archive/refs/heads/{version}.zip'
    }
  },
  core: {
    org: 'hoangbinh',
    branch: 'master',
    clone: ['h5p-editor-php-library', 'h5p-php-library'],
    setup: ['h5p-math-display']
  },
  registry: 'libraryRegistry.json',
  authenticate: {
    enable: true,
    users: [
      { id: 1, name: 'admin', password: '123', roles: ['admin'] },
      { id: 2, name: 'user', password: '321', roles: ['user'] }
    ]
  }
}
// files.patterns.allowed & files.patterns.ignored are used in the export logic to determine which files are allowed/ignored in the .h5p zip archive
module.exports.files.patterns.allowed = process.env.h5p_cli_allowed_files ? new RegExp(process.env.h5p_cli_allowed_files, process.env.h5p_cli_allowed_modifiers) : module.exports.files.patterns.allowed;
module.exports.files.patterns.ignored = process.env.h5p_cli_ignored_files ? new RegExp(process.env.h5p_cli_ignored_files, process.env.h5p_cli_ignored_modifiers) : module.exports.files.patterns.ignored;
