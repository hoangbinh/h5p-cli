const express = require('express');
const config = require('./config.js');
const multer = require('multer')({ dest: `./${config.folders.temp}` });
const api = require('./api.js');
let app = express();
app.use(express.json({
  limit: config.maxUploadSize,
}));
app.use(express.urlencoded({
  limit: config.maxUploadSize,
  extended: true
}));
if (config.authenticate.enable) {
  app.get('/', (req, res) => res.redirect('/login'));
  const passport = require('./auth.js')(app);
  app.use((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  });  
} else {
  app.get('/', (req, res) => res.redirect('/dashboard'));
}
app.get('/favicon.ico', api.favicon);
app.get('/dashboard', api.dashboard);
app.get('/projects', api.projects);
app.get('/runnable', api.contentTypes);
app.get('/export/:library/:folder', api.export);
app.post('/import/:folder', multer.single('file'), api.import);
app.post('/create/:type/:folder', api.create);
app.post('/remove/:folder', api.remove);
app.get('/split/:library/:folder', api.splitView);
app.get('/view/:library/:folder', api.view);
app.get('/edit/:library/:folder/libraries', api.ajaxLibraries);
app.post('/edit/:library/:folder/translations', api.ajaxTranslations);
app.get('/edit/:library/:folder', api.edit);
app.post('/edit/:library/:folder/libraries', api.ajaxLibraries);
app.post('/edit/:library/:folder/files', multer.single('file'), api.uploadFile);
app.post('/edit/:library/:folder', multer.none(), api.saveContent);
app.get('/content-user-data/:folder/:type/:id', api.getUserData);
app.post('/content-user-data/:folder/:type/:id', api.setUserData);
app.use(`/${config.folders.assets}`, express.static(`${require.main.path}/${config.folders.assets}`))
app.use(express.static('./'));
app.listen(config.port, () => {
  console.log(`h5p content type development server running on port ${config.port}`);
});
if (config.files.watch) {
  const eye = require('livereload').createServer();
  eye.watch(config.folders.libraries);
}
