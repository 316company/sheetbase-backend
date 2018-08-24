Router.post('/mail', Middleware.authorize, function (req, res) {
    return res.standard(
        Mail.send(req.body.mailData, req.body.transporter)
    );
});

Router.get('/mail/quota', Middleware.authorize, function (req, res) {
    return res.standard(
        Mail.quota()
    );
});