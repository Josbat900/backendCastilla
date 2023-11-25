const express = require('express');
const app = express()
const {Pool} = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authMiddleware = require('./apikeycb.js')
const PORT = 3000;

app.use(express.json());
app.use(authMiddleware)

const pool = new Pool({
    user: 'default',
    host: 'ep-polished-firefly-14723610-pooler.us-east-1.postgres.vercel-storage.com',
    database: 'verceldb',
    password: 'f58nBceAuFsO',
    port: 5432,
    ssl: {rejectUnauthorized: false}
});

// Definir la configuración de Swagger
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Mi API',
        version: '1.0.0',
      },
    },
    apis: ['app.js'], // Ruta al archivo que contiene las rutas de tu API
  };
  
  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
  // Definir tus rutas aquí
  app.get('/', (req, res) => {
    res.send('Hola, mundo!');
  });
  
  
/**
 * @swagger
 * /:
 *   get:
 *     summary: Retorna un saludo
 *     responses:
 *       200:
 *         description: Respuesta exitosa
 */
app.get("/products",(req,res)=>{
    const listUsersQuery = `SELECT * FROM products;`;
    pool.query(listUsersQuery)
    .then(respond => {
        
        console.log("List students: ", respond.rows);
        res.status(200).send(respond.rows)
        
    })
    .catch(err => {
        
        console.error(err);
        res.status(500).send("could not see users")
        
    });
    
})


app.post("/products", (req,res) =>{
    const nameproduct = `${req.body.nameproduct}`
    const price = `${req.body.price}`
    const quantity = `${req.body.quantity}`
    const addProducts = `INSERT INTO products (nameproduct, price, quantity) VALUES ('${nameproduct}', ${price}, ${quantity});`

    pool.query(addProducts)
    .then(data=>{
        console.log("product insert: ", data.rows)
        res.status(201).end("product insert")
    })
    .catch(err=>{
        console.error(err)
        res.status(400).send("product not insert")
    })
})

app.listen(PORT, ()=>{console.log("the app is running")})

module.exports = app