import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import * as express from 'express';
import { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get("/", (req: Request, resp: Response) => {
    resp.send("Hello there!");
})
app.listen(4000, () => console.log("Listening on port", 4000))

createConnection().then(async connection => {

   

}).catch(error => console.log(error)); 
