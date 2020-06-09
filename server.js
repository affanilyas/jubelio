const hapi = require('hapi');
const axios = require('axios');
const parseString = require('xml2js').parseString;
const url = require('url');

const pg = require('pg');
const conString = "postgres://postgres:bobobobo@localhost:5432/Jubelio";
const client = new pg.Client(conString);
client.connect();

const server = hapi.server({
    port: 3000,
    host: 'localhost'
});

// Route
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
        return '<h1>I did something!</h1>';
    }
});

server.route({
    method: 'GET',
    path: '/getData',
    handler: async function (req, res) {
        const text = "SELECT id, product_name, sku, image, price FROM products ORDER BY id";
        const data = await client.query("SELECT id, product_name, image, price FROM products ORDER BY id ASC");
        console.log(data.rows);
        return data.rows;
    }
});

server.route({
    method: 'PUT',
    path: '/update',
    handler: function (req, res) {
        const data = req.payload;
        const text = "UPDATE products SET product_name = '"+data.productName+"', sku = '"+data.sku+"', image = '"+data.image+"', price = '"+data.price+"' WHERE id = '"+data.productId+"'";
        client.query(text, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        return "Data Berhasil di Update";
    }
});

server.route({
    method: 'DELETE',
    path: '/delete',
    handler: function (req, res) {
        const data = req.payload;
        console.log(data.id);
        const text = "DELETE FROM products WHERE id = '"+data.id+"'";
        client.query(text, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        return "Data Berhasil di Hapus";
    }
});

server.start();

const getProductList = async () => {
    const config = {
        method: 'GET',
        url: 'http://api.elevenia.co.id/rest/prodservices/product/listing',
        headers: {
            'Content-Type' : 'application/xml',
            'Accept-Charset' : 'utf-8',
            'openapikey' : '721407f393e84a28593374cc2b347a98'
        }
    }
    let res = await axios(config).then((result) => {
        parseString(result.data, function(err, result) {
            const data = result.Products.product;
            data.forEach(element => {
                const productName = element.prdNm.toString();
                const SKU = element.sellerPrdCd.toString();
                const productNumber = element.prdNo.toString();
                const sellPrice = element.selPrc.toString();
                getImageProduct(productName, SKU, productNumber, sellPrice);
            });
        });
    });  
}

const getImageProduct = async (productName, SKU, productNumber, sellPrice) => {
    const config = {
        method: 'GET',
        url: 'http://api.elevenia.co.id/rest/prodservices/product/details/'+productNumber,
        headers: {
            'Content-Type' : 'application/xml',
            'Accept-Charset' : 'utf-8',
            'openapikey' : '721407f393e84a28593374cc2b347a98'
        }
    }
    let res = await axios(config).then((result) => {
        parseString(result.data, function(err, result) {
            const image = result.Product.prdImage01.toString();
            const query = "INSERT INTO products (product_name, sku, image, price)VALUES ('"+productName+"', '"+SKU+"', '"+image+"', '"+sellPrice+"')";
            client.query(query, (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    });  
    return;
}

getProductList();

