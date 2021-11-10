import express from 'express';
import bodyParser = require('body-parser');
import ordersRouter from "./Routes/Orders/OrdersRouter";
const app = express();
const PORT = 3232;
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	next();
});

app.use("/Orders",ordersRouter);

app.listen(PORT);
console.log('Listening on port', PORT);
