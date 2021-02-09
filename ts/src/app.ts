import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';

class App{
    public app: express.Application;
    public port: number;

    constructor(controllers: Controller[]){
        this.app = express();

        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    public listen(){
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        })
    }

    private initializeMiddlewares(){
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers: Controller[]){
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        })
    }

    private connectToTheDatabase(){
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            MONGO_PATH
        } = process.env;
        mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    }
}

export default App;