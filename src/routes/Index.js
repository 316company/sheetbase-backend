Router.get('/', function(req, res) {
    return res.html(
        '<h1>Sheetbase Backend</h1>'+
        '<p>Homepage: <a href="https://sheetbase.net">https://sheetbase.net</a></p>'+
        '<p>Docs: <a href="https://sheetbase.net/docs">https://sheetbase.net/docs</a></p>'
    );
});

Router.post('/', function(req, res) {
    return res.json({
        title: 'Sheetbase Backend',
        homepage: 'https://sheetbase.net',
        docs: 'https://sheetbase.net/docs'
    });
});