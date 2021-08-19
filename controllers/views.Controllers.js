class ViewsController {
  getHomePage(req, res, next) {
    res.status(200).render('index', { title: 'Home' });
  }
}

module.exports = new ViewsController();
