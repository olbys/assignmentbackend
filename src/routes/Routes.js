import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

let appDir = path.dirname(require.main.filename);

const routes = (app) => {
    app.use(redirectUnmatched); 
    // parse application/json
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json())
    app.route('/')
        .get((req, res, next) => {
            // middleware
            console.log(` le lien taper ${req.originalUrl}`);
            next();
        }, (req, res, next) => {
            res.send('GET dash methode');
        });

    ////////////////////////////
    app.route('/api/hello')
        .get((req, res, next) => {
            // middleware
            res.setHeader('Content-Type', 'application/json')
            next();
        }, (req, res, next) => {
            let result = '{"result": "ok" }';
            res.send(JSON.parse(result));
        });
    ////////////

    ////////////////////////////
    app.route('/api/writeFile/:fileName')
        .post((req, res) => {
            // middleware
            let fileName = req.params.fileName;
            let body = req.body;
            fileName += '.txt';
            let filePath = appDir + `/public/${fileName}`;

            console.log("mon name " + appDir);

            // fichier crée dans le dossier public
            fs.writeFile(filePath, JSON.stringify(body), function (err) {
                if (err) {
                    res.status(404).json({ err });
                    return;
                }
                res.status(200).json({
                    message: "File successfully written"
                })
            });
        });
    ////////////
    function redirectUnmatched(req, res) {
        res.sendFile(appDir + '/index.html');
    }
   
}
export default routes;