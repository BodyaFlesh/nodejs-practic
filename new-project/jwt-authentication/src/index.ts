import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import * as express from 'express';
import { Request, Response } from 'express';
import { RegisterDTO } from "./dto/requrest/register.dto";
import { Database } from './database';
import { PasswordHash } from './security/passwordHash';
import { AuthenticationDTO } from "./dto/response/authentication.dto";
import { UserDTO } from "./dto/response/user.dto";

const app = express();

app.use(express.json());

Database.initialize();


app.get("/", (req: Request, resp: Response) => {
    resp.send("Hello there!");
})

app.post("/register", async (req: Request, resp: Response) => {
    try{
        const body: RegisterDTO = req.body;

        // validate the body
        if(body.password !== body.repeatPassword){
            throw new Error("Repeat password does not match the password");
        }

        //validate if the email is already being user
        if(await Database.userRepository.findOne({ email: body.email })){
            throw new Error("Email is already being used");
        }
        //store the user
        const user = new User();
        user.username = body.username;
        user.email = body.email;
        user.password = await PasswordHash.hashPassword(body.password);
        user.age = body.age;

        await Database.userRepository.save(user);

        const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
        const userDTO: UserDTO = new UserDTO();
        userDTO.username = user.username;
        userDTO.email = user.email;
        userDTO.age = user.age;

        authenticationDTO.user = userDTO;

        //implement token generation and refresh tokens

        resp.json({
            body,
            token: "dummy-token",
            refreshToken: "dummy-refreshtoken",
            user: {
                id: 1,
                username: "dummy-username"
            }
        })
    }catch(error){
        resp.status(500).json({
            message: error.message
        });
    }
})

app.listen(4000, () => console.log("Listening on port", 4000))

createConnection().then(async connection => {

   

}).catch(error => console.log(error)); 
