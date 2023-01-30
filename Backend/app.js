require('dotenv').config();


const express = require("express");
const passport = require('passport');
const app = express();
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const port = process.env.PORT || 3001;


// Load in Mongoose models

const { Supplier, ValidateSupplier } = require("./db/Modles/supplier.Model");
const { Product, ValidateProduct } = require("./db/Modles/products.Models");
const users = require('./Routes/user');
const auth = require('./Routes/auth');
const { User } = require('./db/Modles/User');

// Passport Config
passport.use(User.createStrategy());
app.use(passport.initialize());

// Load Middleware
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/* Route Handlers*/

/* Auth and User Routes*/

app.use('/sign-up', users);
app.use('/auth', auth);


/* Supplier Routers */

/*
 Get /suppliers
 Purpose: Get all Suppliers
*/
app.get("/suppliers", (req, res) => {
  // We want to return an array of all the supplier in the database
  Supplier.find({}).then((Supplier) => {
    res.send(Supplier);
  });
});

/* 
Get / 
Purpose: Get all suppliers but can query
*/

app.get("/", async (req, res) => {
  const { SupplierName, _id } = req.query;

  let filter = {};

  if (SupplierName) {
    filter.SupplierName = { $regex: `${SupplierName}`, $options: "i" };
  }

  if (SupplierName) {
    filter.SupplierName = { $regex: `${SupplierName}`, $options: "i" };
  }

  console.table(filter);
  const supplier = await Supplier.find(filter)
    .sort()
    .select("SupplierName")
    .exec(function (err, supplier) {
      if (err) {
        console.log(err);
      } else if (supplier.length === 0) {
        res.json("Supplier not Found");
      } else {
        res.json(supplier);
      }
    });
});

/* 
Post /suppliers
Purpose: Create a Supplier
*/

app.post("/suppliers", async (req, res) => {
  // We want to create a new supplier and return a new supplier doc to the user with and id
  // The supplier info fields will be past in via the json request body.
  let result = ValidateSupplier(req.body);

  if (result.error) {
    res.status(400).json(result.error);
    return;
  }

  let SupplierName = req.body.SupplierName;

  let newSupplier = new Supplier({
    SupplierName,
  });

  try {
    newSupplier.save().then((SupplierDoc) => {
      // The full supplierDoc is returned (incl. id)
      res.send(SupplierDoc);
    });
  } catch (error) {
    if (error.isJoi) {
      error.status = 422;
    }
    res.status(500).send("db_error" + error);
  }
});

/* 
Patch /supplier
Purpose: Updated a specified Suppliers
*/

app.patch("/suppliers/:id", (req, res) => {
  // We want to update the specified supplier, with the new values specified in the Json body of the request

  let result = ValidateSupplier(req.body);

  if (result.error) {
    res.status(400).json(result.error);
    return;
  }

  try {
    Supplier.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }).then(
      () => {
        res.send({ message: "updated Successfully" });
      }
    );
  } catch (error) {
    res.status(404).json(`Supplier ID not found : ${_id}`);
  }
});

/* 
Delete /supplier
Purpose: Delete a Supplier
*/

app.delete("/suppliers/:id", async (req, res) => {
  // we want to delete the specified supplier

  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (supplier) {
      res.status(204).send(supplier);
    } else {
      res
        .status(404)
        .json(`Supplier with the ID of ${req.params.id} was not found`);
    }
  } catch (error) {
    res.status(404).json(`Invalid ID, ${req.params.id} was not found`);
  }
});

/*
    GET /suppliers/:productID/products
    Purpose: Get all the products that a certain supplier has.
*/
app.get("/suppliers/:supplierId/products", async (req, res) => {
  // We want to return all products that belong to a specific supplier

  try {
    const supplier = await Product.find({
      _supplierId: req.params.supplierId,
    });

    if (supplier) {
      res.send(supplier);
    } else {
      res.json(
        `Supplier with the ID of ${req.params.supplierId} was not found`
      );
    }
  } catch {
    res.status(404).json(`Invalid ID, ${req.params.supplierId} was not found`);
  }
});

/*
    GET /suppliers/:productID/products/get-all
    Purpose: Get all the products that a certain supplier has, but for querying.
*/

app.get("/suppliers/:supplierId/products/get-product", async (req, res) => {
  const { title, price, description } = req.query;

  let filter = {};

  if (title) {
    filter.title = { $regex: `${title}`, $options: "i" };
  }

  if (price) {
    filter.Price = { $regex: `${price}`, $options: "i" };
  }

  if (description) {
    filter.Description = { $regex: `${description}`, $options: "i" };
  }

  console.table(filter);

  const product = Product.find(filter)
    .where({ _supplierId: req.params.supplierId })
    .sort()
    .select("title Price Description")
    .exec((err, product) => {
      if (err) {
        console.log(err);
      } else if (product && product.length != 0) {
        res.json(product);
      } else {
        res.json("This Supplier does not sell this :(");
      }
    });
});

/*
    GET /suppliers/get-all
    Purpose: Get all the products that you're querying from all products
*/

app.get("/suppliers/get-product", async (req, res) => {
  const { title, price, description } = req.query;

  let filter = {};

  if (title) {
    filter.title = { $regex: `${title}`, $options: "i" };
  }

  if (price) {
    filter.Price = { $regex: `${price}`, $options: "i" };
  }

  if (description) {
    filter.Description = { $regex: `${description}`, $options: "i" };
  }

  console.table(filter);

  const product = Product.find(filter)
    .sort()
    .select("title Price Description")
    .exec((err, product) => {
      if (err) {
        console.log(err);
      } else if (product && product.length != 0) {
        res.json(product);
      } else {
        res.json("Something went wrong :(");
      }
    });
});

/* 
 Get /suppliers/:supplierId/products/:productsId
 Purpose: get supplier and product from certain id and product id
*/

app.get("/suppliers/:supplierId/products/:productsId", async (req, res) => {
  // We want to get the details from a certain product i.e product and supplier id

  let supplierIdExists = false;

  try {
    // check if the supplierId exists
    const supplier = await Product.find({
      _supplierId: req.params.supplierId,
    });

    // if it does set varaible to true
    if (supplier && supplier.length != 0) {
      supplierIdExists = true;
    } else {
      // if it doesn't send json response
      res.json(
        `A Supplier with the id ${req.params.supplierId} does not exist`
      );
    }
  } catch (error) {
    // supplierId was invalid
    res.json(`Invalid Supplier ID ${req.params.supplierId} does not exist`);
  }

  // if variable is true do this

  if (supplierIdExists) {
    try {
      // check if there the supplier has any products with the id given
      const supplier = await Product.find({
        _id: req.params.productsId,
        _supplierId: req.params.supplierId,
      });
      // if they do send the product back to user
      if (supplier && supplier.length != 0) {
        res.send(supplier);
      } else {
        // if they don't send json response back.
        res.json(
          `A Product with the ID of ${req.params.productsId} was not found`
        );
      }
    } catch (error) {
      // productid was invalid
      res
        .status(404)
        .json(`Invalid Product ID,${req.params.productsId} was not found`);
    }
  }
});

/*
    POST /suppliers/:productID/products
    Purpose: Create a new task under a specific supplier.
*/
app.post("/suppliers/:supplierId/products", async (req, res) => {
  // We want to create a new product for a supplier, specified by SupplierID

  try {
    const supplier = await Product.find({
      _supplierId: req.params.supplierId,
    });

    if (supplier) {
      let newProduct = new Product({
        title: req.body.title,
        Description: req.body.Description,
        Price: req.body.Price,
        _supplierId: req.params.supplierId,
      });

      newProduct.save().then((newProductDoc) => {
        res.send(newProductDoc);
      });
    } else {
      res.json(
        `Supplier with the ID of ${req.params.supplierId} was not found`
      );
    }
  } catch {
    res.status(404).json(`Invalid ID, ${req.params.supplierId} was not found`);
  }
});

/*
    Patch /suppliers/:productId/products/:productsId
    Purpose: Update an existing product
*/

app.patch("/suppliers/:supplierId/products/:productsId", async (req, res) => {
  // We want to update a a specific product (specified by productId)
  let supplierIdExists = false;

  try {
    // check if the supplierId exists
    const supplier = await Product.find({
      _supplierId: req.params.supplierId,
    });

    // if it does set varaible to true
    if (supplier && supplier.length != 0) {
      supplierIdExists = true;
    } else {
      // if it doesn't send json response
      res.json(
        `A Supplier with the id ${req.params.supplierId} does not exist`
      );
    }
  } catch (error) {
    // supplierId was invalid
    res.json(`Invalid Supplier ID ${req.params.supplierId} does not exist`);
  }

  // if variable is true do this

  if (supplierIdExists) {
    try {
      // check if there the supplier has any products with the id given
      const supplier = await Product.find({
        _id: req.params.productsId,
        _supplierId: req.params.supplierId,
      });
      // if they do find and update the product
      if (supplier && supplier.length != 0) {
        Product.findOneAndUpdate(
          {
            _id: req.params.productsId,
            _supplierId: req.params.supplierId,
          },
          {
            $set: req.body,
          }
        ).then(() => {
          res.send({ message: "Added successfully!" });
        });
      } else {
        // if they don't send json response back.
        res.json(
          `A Product with the ID of ${req.params.productsId} was not found`
        );
      }
    } catch (error) {
      // productid was invalid
      res
        .status(404)
        .json(`Invalid Product ID,${req.params.productsId} was not found`);
    }
  }
});

/*
    Delete /suppliers/:productId/products/:productsId
    Purpose: Delete an existing product
*/

app.delete("/suppliers/:supplierId/products/:productsId", async (req, res) => {
  // We want to delete a specific products (specified by productId)

  let supplierIdExists = false;

  try {
    // check if the supplierId exists
    const supplier = await Product.find({
      _supplierId: req.params.supplierId,
    });

    // if it does set varaible to true
    if (supplier && supplier.length != 0) {
      supplierIdExists = true;
    } else {
      // if it doesn't send json response
      res.json(
        `A Supplier with the id ${req.params.supplierId} does not exist`
      );
    }
  } catch (error) {
    // supplierId was invalid
    res.json(`Invalid Supplier ID ${req.params.supplierId} does not exist`);
  }

  // if variable is true do this

  if (supplierIdExists) {
    try {
      // check if there the supplier has any products with the id given
      const supplier = await Product.find({
        _id: req.params.productsId,
        _supplierId: req.params.supplierId,
      });
      // if they do find and update the product
      if (supplier && supplier.length != 0) {
        Product.findOneAndRemove({
          _id: req.params.productsId,
          _supplierId: req.params.supplierId,
        }).then((removedProductDoc) => {
          res.send(removedProductDoc);
        });
      } else {
        // if they don't send json response back.
        res.json(
          `A Product with the ID of ${req.params.productsId} was not found`
        );
      }
    } catch (error) {
      // productid was invalid
      res
        .status(404)
        .json(`Invalid Product ID,${req.params.productsId} was not found`);
    }
  }
});

/*
    Delete /suppliers/:productId/products/
    Purpose: Delete all products that a supplier has
*/

app.delete("/suppliers/:supplierId/products/", async (req, res) => {
  // We want to delete all the products belonging to a specific supplier

  try {
    const supplier = await Product.find({
      _supplierId: req.params.supplierId,
    });

    if (supplier) {
      Product.deleteMany({
        _supplierId: req.params.supplierId,
      }).then((removedProductDoc) => {
        res.send(removedProductDoc);
      });
    } else {
      res.json(
        `Supplier with the ID of ${req.params.supplierId} was not found`
      );
    }
  } catch {
    res.status(404).json(`Invalid ID, ${req.params.supplierId} was not found`);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))