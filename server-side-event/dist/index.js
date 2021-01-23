"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const nanoid_1 = require("nanoid");
const app = express_1.default();
app.use(express_1.default.json());
let clients = [];
app.get('/events', (req, res) => {
    console.log(req.headers);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    });
    const client = {
        res,
        id: nanoid_1.nanoid(10)
    };
    sendEventToAll({
        type: 'join',
        data: {
            joined: client.id
        },
        id: nanoid_1.nanoid(10)
    });
    clients.push(client);
    req.on('close', () => {
        console.log(`connection closed by client ${client.id}`);
        clients = clients.filter(c => c.id !== client.id);
    });
});
function sendEventToAll(event) {
    console.log('sending event', event);
    clients.forEach(c => {
        let eventString = `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n`;
        if (event.retry) {
            eventString += `retry: ${event.retry}\n`;
        }
        eventString += `id: ${event.id}\n\n`;
        c.res.write(eventString);
    });
}
const PORT = +process.env.PORT || 3000;
app.use(express_1.default.static(path_1.join(__dirname, '../public')));
app.listen(PORT, () => console.log(`> http://localhost:${PORT}`));
//# sourceMappingURL=index.js.map